'use client';

import { useEffect, useRef, useState } from 'react';

// Animate the original painting in image coordinates, keeping the room still.
const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = vec2(position.x * .5 + .5, .5 - position.y * .5);
  gl_Position = vec4(position, 0., 1.);
}`;

const fragmentSource = `
precision highp float;
varying vec2 uv;
uniform sampler2D artwork;
uniform vec2 viewport;
uniform float time;
uniform float pull;
uniform vec2 pointer;
void main() {
  vec2 imageSize = vec2(1672., 941.);
  float cover = max(viewport.x / imageSize.x, viewport.y / imageSize.y);
  vec2 visible = viewport / (imageSize * cover);
  float alignment = viewport.x <= 760. ? .83 : .5;
  vec2 p = uv * visible + (1. - visible) * vec2(alignment, .5);
  p += pointer * .003 * sin(uv.x * 3.14159) * sin(uv.y * 3.14159);
  vec2 center = vec2(.614, .378);

  // A broad, feathered field moves the figure without a hard cutout seam.
  float girl = 1. - smoothstep(.65, 1.25, length((p - vec2(.845, .585)) / vec2(.175, .34)));
  float breath = .5 - .5 * cos(time * .65);
  float tug = .055 + .11 * breath + .16 * pull;
  vec2 source = p + (p - center) * girl * tug;
  source.y += sin(time * 1.3 - p.x * 9.) * .008 * girl;

  vec2 delta = (source - center) * vec2(1.777, 1.);
  float radius = length(delta);
  float vortex = 1. - smoothstep(.035, .255, radius);
  float angle = -(time * .7 + pull * 2.4) * vortex * vortex;
  float c = cos(angle), s = sin(angle);
  delta = mat2(c, -s, s, c) * delta;
  delta *= 1. + .045 * sin(time * 1.7 - radius * 35.) * vortex;
  source = center + delta / vec2(1.777, 1.);
  vec3 color = texture2D(artwork, clamp(source, .001, .999)).rgb;
  float glow = exp(-radius * radius * 180.) * (.035 + .035 * sin(time * 1.7) + pull * .12);
  color += vec3(.35, .85, 1.) * glow;
  // A soft traveling rim of light follows the figure into the vortex.
  float ribbon = exp(-pow((radius - .15 - .012 * sin(time * 1.4)) * 65., 2.));
  color += vec3(.2, .65, .85) * ribbon * (.055 + .09 * pull);
  gl_FragColor = vec4(color, 1.);
}`;

export default function PortalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emberRef = useRef<HTMLCanvasElement>(null);
  const energizedRef = useRef(false);
  const [energized, setEnergized] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const embers = emberRef.current;
    if (!canvas || !embers || paused) return;
    const ink = embers.getContext('2d');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      shaders.forEach(shader => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(['viewport', 'time', 'pull', 'pointer'].map(name => [name, gl.getUniformLocation(program, name)]));
    const texture = gl.createTexture();
    const image = new Image();
    let disposed = false, loaded = false, frame = 0, elapsed = 0, last = 0;
    let targetPull = 0, currentPull = 0, pointerX = 0, pointerY = 0;
    const host = canvas.closest('main')!;
    let width = 0, height = 0;
    // Stable seeds keep the ash field continuous across frames.
    const sparks = Array.from({ length: 110 }, (_, i) => ({
      phase: (i * .61803398875) % 1,
      angle: i * 2.399963,
      speed: .055 + (i % 7) * .007,
      size: .65 + (i % 5) * .3,
      cool: i % 5 === 0,
    }));
    const drawEmbers = () => {
      if (!ink) return;
      ink.clearRect(0, 0, width, height);
      const cover = Math.max(width / 1672, height / 941);
      const offsetX = (width - 1672 * cover) * (width <= 760 ? .83 : .5);
      const offsetY = (height - 941 * cover) * .5;
      const cx = 1672 * .614 * cover + offsetX;
      const cy = 941 * .378 * cover + offsetY;
      const scale = 941 * cover;
      ink.globalCompositeOperation = 'lighter';
      for (const spark of sparks) {
        const life = (spark.phase + elapsed * spark.speed) % 1;
        const radius = (.025 + .49 * (1 - life)) * scale;
        const angle = spark.angle + life * (4.5 + currentPull * 1.2);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * .76;
        const alpha = Math.sin(life * Math.PI) * (.55 + currentPull * .2);
        const size = spark.size * Math.min(cover, 1.5) * (1 + currentPull * .35);
        const tint = spark.cool ? '125,224,255' : '255,177,68';
        const halo = ink.createRadialGradient(x, y, 0, x, y, size * 6);
        halo.addColorStop(0, `rgba(${tint},${alpha * .6})`);
        halo.addColorStop(1, `rgba(${tint},0)`);
        ink.fillStyle = halo;
        ink.fillRect(x - size * 6, y - size * 6, size * 12, size * 12);
        ink.strokeStyle = `rgba(${tint},${alpha})`;
        ink.lineWidth = size;
        ink.lineCap = 'round';
        ink.beginPath();
        ink.moveTo(x, y);
        ink.lineTo(x + Math.sin(angle) * size * (3 + currentPull * 4), y - Math.cos(angle) * size * 3);
        ink.stroke();
        ink.fillStyle = `rgba(255,244,210,${alpha})`;
        ink.fillRect(x - size / 2, y - size / 2, size, size);
      }
      ink.globalCompositeOperation = 'source-over';
    };
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      embers.width = canvas.width;
      embers.height = canvas.height;
      ink?.setTransform(ratio, 0, 0, ratio, 0, 0);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.viewport, canvas.clientWidth, canvas.clientHeight);
    };
    const draw = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, .05) : 0;
      elapsed += dt * (1 + currentPull * .45);
      last = now;
      currentPull += (Math.max(targetPull, energizedRef.current ? 1 : 0) - currentPull) * (1 - Math.exp(-dt * 3));
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.pull, currentPull);
      gl.uniform2f(uniforms.pointer, pointerX, pointerY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      drawEmbers();
      canvas.style.opacity = '1';
      embers.style.opacity = '1';
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (motion.matches) { canvas.style.opacity = '0'; embers.style.opacity = '0'; }
      if (loaded && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width - .5;
      pointerY = (event.clientY - bounds.top) / bounds.height - .5;
      const cover = Math.max(bounds.width / 1672, bounds.height / 941);
      const cx = 1672 * .614 * cover + (bounds.width - 1672 * cover) * (bounds.width <= 760 ? .83 : .5);
      const cy = 941 * .378 * cover + (bounds.height - 941 * cover) * .5;
      const distance = Math.hypot(event.clientX - bounds.left - cx, event.clientY - bounds.top - cy);
      targetPull = Math.max(0, 1 - distance / (bounds.width * .5));
      if (event.buttons) targetPull = Math.min(1.3, targetPull + .5);
    };
    const leave = () => { targetPull = 0; pointerX = 0; pointerY = 0; };
    const focus = () => { targetPull = 1; };
    const lost = (event: Event) => { event.preventDefault(); loaded = false; cancelAnimationFrame(frame); canvas.style.opacity = '0'; embers.style.opacity = '0'; };
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      loaded = true;
      resize();
      sync();
    };
    image.src = '/portal.png';
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerdown', move);
    host.addEventListener('pointerup', leave);
    host.addEventListener('pointerleave', leave);
    host.addEventListener('pointercancel', leave);
    host.addEventListener('focusin', focus);
    host.addEventListener('focusout', leave);
    canvas.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      disposed = true;
      image.onload = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerdown', move);
      host.removeEventListener('pointerup', leave);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointercancel', leave);
      host.removeEventListener('focusin', focus);
      host.removeEventListener('focusout', leave);
      canvas.removeEventListener('webglcontextlost', lost);
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
      canvas.style.opacity = '0';
      embers.style.opacity = '0';
      ink?.clearRect(0, 0, width, height);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
  }, [paused]);

  return <>
    <div className="home-art" aria-hidden="true"><canvas ref={canvasRef} className="portal-canvas" /><canvas ref={emberRef} className="portal-embers" /></div>
    <div className="portal-interaction">
      <button disabled={paused} aria-pressed={energized} onClick={() => { energizedRef.current = !energized; setEnergized(!energized); }}>
        <span aria-hidden="true">✦</span> {energized ? 'Release the portal' : 'Awaken the portal'}
      </button>
      <span className="portal-hint">Move closer. Feel the pull.</span>
    </div>
    <button className="motion-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
      {paused ? 'Resume animation' : 'Pause animation'}
    </button>
  </>;
}
