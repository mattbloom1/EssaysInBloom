/**
 * Liquid mesh gradient — one continuous, domain-warped fbm noise field
 * (Inigo Quilez "warp fbm by fbm") mapped onto a brand color ramp.
 * Vanilla port of the Framer reference component (Desktop/mesh), recolored
 * from the Essays in Bloom tokens at mount time so it always matches the
 * active theme instead of hard-coding hex values.
 *
 * WebGL only; on failure the caller's CSS fallback (--gradient-bloom on the
 * host) simply stays visible through the transparent canvas.
 */

// ─────────────────────────────────────────────────────────────────────────
// TWEAK ME — everything adjustable lives here.
// ─────────────────────────────────────────────────────────────────────────
const CONFIG = {
  // ── Motion ──────────────────────────────────────────────────────────
  speed: 0.12, // flow tempo (lower = slower drift)
  fpsFallback: 30, // frame rate of the setTimeout fallback loop

  // ── Noise field ─────────────────────────────────────────────────────
  scale: 1, // noise frequency (lower = larger, softer features)
  warp: 4, // domain-warp strength (higher = more liquid folding)
  stretch: 0.8, // >1 = wide streaky horizontal bands
  octaves: 2, // fbm detail layers (more = finer, costlier)
  gain: 0.2, // amplitude falloff per octave (0–1; lower = smoother)
  lacunarity: 2.5, // frequency growth per octave (higher = more detail)

  // ── Value blend (composes the scalar fed to the color ramp) ─────────
  warpWeight: 0.65, // weight of the final warped fbm value
  foldWeight: 0.35, // weight of the warp-vector length (adds contrast)

  // ── Rendering ───────────────────────────────────────────────────────
  maxDpr: 2, // device-pixel-ratio cap (higher = sharper, costlier)

  // ── Colors ──────────────────────────────────────────────────────────
  // Pulled from CSS tokens at mount; the hexes are fallbacks only.
  // Brand ramp, dark → light: evergreen holds most of the field, hunter
  // green mid-tones, bronze high-value streaks, periwinkle the rare peaks.
  colors: {
    evergreenToken: '--evergreen',
    evergreen: '#133430',
    hunterToken: '--hunter-green',
    hunter: '#29603D',
    bronzeToken: '--light-bronze',
    bronze: '#E0A98D',
    periwinkleToken: '--periwinkle', // "Essays in Bloom" lavender blue
    periwinkle: '#8B8FD4',
    shadowMix: 0.25, // darken evergreen toward black for the lowest stop
    midMix: 0.5, // hunter → bronze blend for the mid-high stop
  },
};
// ─────────────────────────────────────────────────────────────────────────

/** Number of color stops in the ramp — must match the recipe in buildRamp. */
const STOPS = 6;

/** Format a JS number as a GLSL float literal (always has a decimal point). */
const glf = (n: number): string => (Number.isInteger(n) ? n.toFixed(1) : String(n));

/** Generate the GLSL `ramp()` function for `stops` evenly-spaced color stops.
 * Unrolls into an if-chain over the (stops - 1) segments so the number of
 * colors can change without hand-editing shader source. */
function rampGLSL(stops: number): string {
  const seg = stops - 1;
  const lines = [`    t = clamp(t, 0.0, 1.0) * ${glf(seg)};`];
  for (let i = 0; i < seg - 1; i++) {
    lines.push(`    if (t < ${glf(i + 1)}) return mix(u_ramp[${i}], u_ramp[${i + 1}], t - ${glf(i)});`);
  }
  lines.push(`    return mix(u_ramp[${seg - 1}], u_ramp[${seg}], t - ${glf(seg - 1)});`);
  return `vec3 ramp(float t) {\n${lines.join('\n')}\n}`;
}

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_ramp[${STOPS}];

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    // norm accumulates total amplitude so the result stays in [0, 1] no matter
    // how octaves/gain are tuned — otherwise low settings shrink the range and
    // the top color stops (bronze, periwinkle) become unreachable.
    float v = 0.0, a = 0.5, norm = 0.0;
    for (int i = 0; i < ${CONFIG.octaves}; i++) { v += a * noise(p); norm += a; p *= ${glf(CONFIG.lacunarity)}; a *= ${glf(CONFIG.gain)}; }
    return v / norm;
}

${rampGLSL(STOPS)}

void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    vec2 p = uv * ${glf(CONFIG.scale)};
    p.x /= ${glf(CONFIG.stretch)};
    float t = u_time * ${glf(CONFIG.speed)};

    vec2 q = vec2(fbm(p + vec2(0.0, 0.0)), fbm(p + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(p + ${glf(CONFIG.warp)} * q + vec2(1.7, 9.2) + t),
                  fbm(p + ${glf(CONFIG.warp)} * q + vec2(8.3, 2.8) - t));
    float f = fbm(p + ${glf(CONFIG.warp)} * r);

    float v = f * ${glf(CONFIG.warpWeight)} + length(r) * ${glf(CONFIG.foldWeight)};
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

/** Resolve the brand color ramp (dark → light) from CSS tokens, falling back
 * to the CONFIG hexes. Length MUST equal STOPS (the shader is sized to it). */
function buildRamp(c: typeof CONFIG.colors): string[] {
  const evergreen = token(c.evergreenToken, c.evergreen);
  const hunter = token(c.hunterToken, c.hunter);
  const bronze = token(c.bronzeToken, c.bronze);
  const periwinkle = token(c.periwinkleToken, c.periwinkle);
  return [
    lerpHex(evergreen, '#000000', c.shadowMix), // 0 — deepest shadow
    evergreen, //                                  1
    hunter, //                                     2
    lerpHex(hunter, bronze, c.midMix), //          3 — green→bronze mid
    bronze, //                                     4 — warm highlight
    periwinkle, //                                 5 — brightest peaks
  ];
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

  const RAMP = buildRamp(CONFIG.colors);

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
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
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
    timer = window.setTimeout(() => render(performance.now()), 1000 / CONFIG.fpsFallback);
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
