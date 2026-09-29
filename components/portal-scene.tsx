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
  float breath = .5 - .5 * cos(time * .85);
  float tug = .025 * breath + .07 * pull;
  vec2 source = p + (p - center) * girl * tug;
  source.y += sin(time * 1.3) * .004 * girl;

  vec2 delta = (source - center) * vec2(1.777, 1.);
  float radius = length(delta);
  float vortex = 1. - smoothstep(.035, .255, radius);
  float angle = -(time * .55 + pull * 1.8) * vortex * vortex;
  float c = cos(angle), s = sin(angle);
  delta = mat2(c, -s, s, c) * delta;
  delta *= 1. + .045 * sin(time * 1.7 - radius * 35.) * vortex;
  source = center + delta / vec2(1.777, 1.);
  vec3 color = texture2D(artwork, clamp(source, .001, .999)).rgb;
  float glow = exp(-radius * radius * 180.) * (.035 + .035 * sin(time * 1.7) + pull * .12);
  color += vec3(.35, .85, 1.) * glow;
  gl_FragColor = vec4(color, 1.);
}`;

export default function PortalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return;
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
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.viewport, canvas.clientWidth, canvas.clientHeight);
    };
    const draw = (now: number) => {
      elapsed += last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      currentPull += (targetPull - currentPull) * .035;
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.pull, currentPull);
      gl.uniform2f(uniforms.pointer, pointerX, pointerY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.style.opacity = '1';
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (motion.matches) canvas.style.opacity = '0';
      if (loaded && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width - .5;
      pointerY = (event.clientY - bounds.top) / bounds.height - .5;
      targetPull = 1;
    };
    const leave = () => { targetPull = 0; pointerX = 0; pointerY = 0; };
    const focus = () => { targetPull = 1; };
    const lost = (event: Event) => { event.preventDefault(); loaded = false; cancelAnimationFrame(frame); canvas.style.opacity = '0'; };
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
    observer.observe(host);
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
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
  }, [paused]);

  return <>
    <div className="home-art" aria-hidden="true"><canvas ref={canvasRef} className="portal-canvas" /></div>
    <button className="motion-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
      {paused ? 'Resume animation' : 'Pause animation'}
    </button>
  </>;
}
