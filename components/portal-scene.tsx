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
uniform float rotation;
void main() {
  vec2 imageSize = vec2(1655., 950.);
  float cover = max(viewport.x / imageSize.x, viewport.y / imageSize.y);
  vec2 visible = viewport / (imageSize * cover);
  float alignment = .5;
  vec2 p = uv * visible + (1. - visible) * vec2(alignment, .5);
  // The source artwork places the live portal in the center of the mirror.
  vec2 center = vec2(.5, .47);
  vec2 source = p;

  vec2 delta = (source - center) * vec2(1.777, 1.);
  float radius = length(delta);
  float portal = 1. - smoothstep(.32, .48, radius);
  float vortex = 1. - smoothstep(.025, .27, radius);
  float pulse = .5 + .5 * sin(time * 1.15);
  float angle = -rotation * vortex * vortex;
  float c = cos(angle), s = sin(angle);
  delta = mat2(c, -s, s, c) * delta;
  float rotatedAngle = atan(delta.y, delta.x);
  delta *= 1. + (.016 + .025 * pull + .01 * pulse) * sin(time * 1.15 - radius * 30.) * vortex;
  source = center + delta / vec2(1.777, 1.);
  vec3 color = texture2D(artwork, clamp(source, .001, .999)).rgb;
  float glow = exp(-radius * radius * 125.) * (.045 + .06 * pulse + pull * .18);
  color += vec3(.38, .9, 1.) * glow;
  // A wide bloom follows the larger portal rim and keeps its halo visible.
  float wideHalo = exp(-pow((radius - .235) * 6., 2.));
  color += vec3(.14, .4, .56) * wideHalo * (.17 + .3 * pull + .07 * pulse);
  // One highlight follows the rotation, while another follows the pointer around the rim.
  float rim = exp(-pow((radius - .235) * 38., 2.));
  float lightAngle = rotatedAngle + rotation * .72;
  float sweep = pow(max(0., cos(lightAngle)), 12.);
  float goldSweep = pow(max(0., cos(lightAngle - 2.15)), 16.);
  vec2 centerScreen = (center - (1. - visible) * vec2(alignment, .5)) / visible;
  vec2 pointerDelta = (pointer + vec2(.5) - centerScreen) * vec2(viewport.x / viewport.y, 1.);
  float pointerAngle = atan(pointerDelta.y, pointerDelta.x);
  float pointerPresence = 1. - smoothstep(.12, .58, length(pointerDelta));
  float pointerSweep = pow(max(0., cos(rotatedAngle - pointerAngle)), 20.) * pointerPresence;
  float haloLight = exp(-pow((radius - .235) * 12., 2.)) * (.07 + .12 * pulse + .16 * pull);
  float goldHalo = exp(-pow((radius - .245) * 9., 2.)) * (.06 + .12 * pulse + .18 * pull);
  float warmCore = exp(-radius * radius * 72.) * (.025 + .035 * pulse + .08 * pull);
  color += vec3(.08, .42, .58) * rim * (.12 + .16 * pull);
  color += vec3(.48, .88, 1.) * haloLight;
  color += vec3(1., .47, .12) * goldHalo;
  color += vec3(1., .62, .24) * warmCore;
  color += vec3(.72, .94, 1.) * sweep * rim * (.68 + .34 * pull + .18 * pulse);
  color += vec3(1., .72, .3) * goldSweep * rim * (.18 + .38 * pull + .18 * pulse);
  color += vec3(.82, .96, 1.) * pointerSweep * rim * (.18 + .85 * pull);
  color += vec3(1., .82, .46) * pointerSweep * rim * (.06 + .42 * pull);
  float innerShimmer = exp(-pow((radius - .13) * 48., 2.)) * (.025 + .045 * pulse);
  color += vec3(.28, .72, .92) * innerShimmer;
  color += vec3(.12, .58, .72) * portal * (.025 + .045 * pulse + .09 * pull);
  gl_FragColor = vec4(color, 1.);
}`;

export default function PortalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emberRef = useRef<HTMLCanvasElement>(null);
  const energizedRef = useRef(false);
  const [energized, setEnergized] = useState(false);
  const [opened, setOpened] = useState(false);
  const [paused, setPaused] = useState(true);

  function openPortal() {
    energizedRef.current = true;
    setEnergized(true);
    setOpened(true);
    setPaused(false);
  }

  function togglePortalEnergy() {
    if (!opened) {
      openPortal();
      return;
    }

    energizedRef.current = !energized;
    setEnergized(!energized);
  }

  useEffect(() => {
    const handlePortalOpen = () => openPortal();

    window.addEventListener('digital-mirror:open-portal', handlePortalOpen);

    return () => {
      window.removeEventListener('digital-mirror:open-portal', handlePortalOpen);
    };
  }, []);

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
  const uniforms = Object.fromEntries(['viewport', 'time', 'pull', 'pointer', 'rotation'].map(name => [name, gl.getUniformLocation(program, name)]));
    const texture = gl.createTexture();
    const image = new Image();
    let disposed = false, loaded = false, frame = 0, elapsed = 0, last = 0;
    let targetPull = 0, currentPull = 0, pointerX = 0, pointerY = 0, pressed = false;
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
      const cover = Math.max(width / 1655, height / 950);
      const offsetX = (width - 1655 * cover) * .5;
      const offsetY = (height - 950 * cover) * .5;
      const cx = 1655 * .5 * cover + offsetX;
      const cy = 950 * .47 * cover + offsetY;
      const scale = 950 * cover;
      ink.globalCompositeOperation = 'lighter';
      for (const spark of sparks) {
        const life = (spark.phase + elapsed * spark.speed) % 1;
        const radius = .015 + .18 * (1 - life) * scale;
        const angle = spark.angle + life * (1.8 + currentPull * .75);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * .76;
        const alpha = Math.sin(life * Math.PI) * (.42 + currentPull * .28);
        const size = spark.size * Math.min(cover, 1.2) * (1 + currentPull * .35);
        const tint = spark.cool ? '125,224,255' : '255,177,68';
        const halo = ink.createRadialGradient(x, y, 0, x, y, size * 3.5);
        halo.addColorStop(0, `rgba(${tint},${alpha * .6})`);
        halo.addColorStop(1, `rgba(${tint},0)`);
        ink.fillStyle = halo;
        ink.fillRect(x - size * 3.5, y - size * 3.5, size * 7, size * 7);
        ink.strokeStyle = `rgba(${tint},${alpha})`;
        ink.lineWidth = size;
        ink.lineCap = 'round';
        ink.beginPath();
        ink.moveTo(x, y);
        ink.lineTo(x + Math.sin(angle) * size * 2.5, y - Math.cos(angle) * size * 2.5);
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
      elapsed += dt;
      last = now;
      const surge = energizedRef.current ? 1 : 0;
      currentPull += (Math.max(targetPull, surge, pressed ? 1 : 0) - currentPull) * (1 - Math.exp(-dt * 4.5));
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.pull, currentPull);
      gl.uniform2f(uniforms.pointer, pointerX, pointerY);
      const rotation = elapsed * .32 + currentPull * 1.4 + (energizedRef.current ? elapsed * .48 : 0) + (pressed ? .16 : 0);
      gl.uniform1f(uniforms.rotation, rotation);
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
      const cover = Math.max(bounds.width / 1655, bounds.height / 950);
      const cx = 1655 * .5 * cover + (bounds.width - 1655 * cover) * .5;
      const cy = 950 * .47 * cover + (bounds.height - 950 * cover) * .5;
      const distance = Math.hypot(event.clientX - bounds.left - cx, event.clientY - bounds.top - cy);
      const proximity = Math.max(0, 1 - distance / (bounds.width * .62));
      targetPull = Math.min(.82, proximity * proximity * .82);
      pressed = event.buttons > 0;
    };
    const leave = () => { targetPull = 0; pointerX = 0; pointerY = 0; pressed = false; };
    const focus = () => { targetPull = .65; };
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
    image.src = '/mirror-portal.png';
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
      <button aria-pressed={energized} onClick={togglePortalEnergy}>
        <span aria-hidden="true">✦</span> {energized ? 'Release the portal' : 'Awaken the portal'}
      </button>
      <span className="portal-hint">Hover to draw it in · press to send a ripple</span>
    </div>
    <button className="motion-toggle" disabled={!opened} onClick={() => setPaused(value => !value)} aria-pressed={paused}>
      {!opened ? 'Portal closed' : paused ? 'Resume animation' : 'Pause animation'}
    </button>
  </>
}
