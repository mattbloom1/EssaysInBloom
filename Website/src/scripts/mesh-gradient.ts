/**
 * Liquid mesh gradient — one continuous, domain-warped fbm noise field
 * (Inigo Quilez "warp fbm by fbm") mapped onto a 5-stop brand color ramp.
 * Vanilla port of the Framer reference component (Desktop/mesh), recolored
 * from the Essays in Bloom tokens at mount time so it always matches the
 * active theme instead of hard-coding hex values.
 *
 * WebGL only; on failure the caller's CSS fallback (--gradient-bloom on the
 * host) simply stays visible through the transparent canvas.
 */

const SPEED = 0.045; // flow tempo (lower = slower drift)
const SCALE = 2.2; // noise frequency (lower = larger, softer features)
const WARP = 4.2; // domain-warp strength (higher = more liquid folding)
const STRETCH = 1.9; // >1 = wide streaky horizontal bands

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_ramp[5];

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
}

vec3 ramp(float t) {
    t = clamp(t, 0.0, 1.0) * 4.0;
    if (t < 1.0) return mix(u_ramp[0], u_ramp[1], t);
    if (t < 2.0) return mix(u_ramp[1], u_ramp[2], t - 1.0);
    if (t < 3.0) return mix(u_ramp[2], u_ramp[3], t - 2.0);
    return mix(u_ramp[3], u_ramp[4], t - 3.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    vec2 p = uv * ${SCALE.toFixed(1)};
    p.x /= ${STRETCH.toFixed(1)};
    float t = u_time * ${SPEED.toFixed(3)};

    vec2 q = vec2(fbm(p + vec2(0.0, 0.0)), fbm(p + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(p + ${WARP.toFixed(1)} * q + vec2(1.7, 9.2) + t),
                  fbm(p + ${WARP.toFixed(1)} * q + vec2(8.3, 2.8) - t));
    float f = fbm(p + ${WARP.toFixed(1)} * r);

    float v = f * 0.65 + length(r) * 0.35;
    gl_FragColor = vec4(ramp(v), 1.0);
}
`;

function hexToRGB(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRGB(a);
  const [br, bg, bb] = hexToRGB(b);
  const c = (x: number, y: number) =>
    Math.round((x + (y - x) * t) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
}

function token(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

/** Mount the animated gradient on a canvas. Returns a cleanup fn (unused on
 * this static site, but keeps the module honest). */
export function mountMeshGradient(canvas: HTMLCanvasElement): (() => void) | undefined {
  const gl = canvas.getContext('webgl', { antialias: true });
  if (!gl) return;

  // Brand ramp, dark → light: evergreen holds most of the field, hunter
  // green mid-tones, bronze only as high-value streaks. Swatches come from
  // the CSS tokens at runtime (the hexes here are only their fallbacks, plus
  // black as a darkening constant).
  const evergreen = token('--evergreen', '#133430');
  const hunter = token('--hunter-green', '#29603D');
  const bronze = token('--light-bronze', '#E0A98D');
  const RAMP = [
    lerpHex(evergreen, '#000000', 0.25),
    evergreen,
    hunter,
    lerpHex(hunter, bronze, 0.5),
    bronze,
  ];

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aLoc = gl.getAttribLocation(program, 'a');
  gl.enableVertexAttribArray(aLoc);
  gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_res');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRamp = gl.getUniformLocation(program, 'u_ramp[0]');
  gl.uniform3fv(uRamp, new Float32Array(RAMP.flatMap(hexToRGB)));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  const draw = (t: number) => {
    gl.uniform1f(uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  resize();
  draw(0);

  // Hybrid loop: rAF normally, setTimeout fallback so motion keeps running
  // when rAF is starved (iOS Safari Low Power Mode paints one frame, then
  // never services requestAnimationFrame). Shared performance.now timeline.
  let raf = 0;
  let timer = 0;
  const cancel = () => {
    if (raf) cancelAnimationFrame(raf);
    if (timer) clearTimeout(timer);
    raf = timer = 0;
  };
  const render = (now: number) => {
    cancel();
    resize();
    draw(now / 1000);
    if (document.hidden) return;
    raf = requestAnimationFrame(render);
    timer = window.setTimeout(() => render(performance.now()), 1000 / 30);
  };
  const onVisibility = () => {
    if (!document.hidden) render(performance.now());
  };
  document.addEventListener('visibilitychange', onVisibility);
  render(performance.now());

  return () => {
    cancel();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
