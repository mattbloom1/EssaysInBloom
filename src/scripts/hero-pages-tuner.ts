import type { HeroPagesApi, HeroPagesConfig } from './hero-pages';

/**
 * Dev-only live tuner for the pinned hero page-arc. Sliders drive the rig in
 * real time; "Copy" emits a HERO_PAGES_CONFIG snippet to paste back into
 * src/scripts/hero-pages.ts. Dynamically imported behind `import.meta.env.DEV`,
 * so Vite strips it from production builds.
 */

interface ControlSpec {
  label: string;
  min: number;
  max: number;
  step: number;
  get: () => number;
  set: (v: number) => void;
}

const STYLE = `
.hpt { position: fixed; top: 12px; right: 12px; z-index: 99999; width: 280px;
  max-height: calc(100vh - 24px); display: flex; flex-direction: column;
  font: 12px/1.4 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  color: #f4f4f5; background: rgba(20,18,24,.94); border: 1px solid rgba(255,255,255,.14);
  border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,.45); backdrop-filter: blur(8px);
  user-select: none; }
.hpt__bar { display: flex; align-items: center; gap: 6px; padding: 8px 10px;
  border-bottom: 1px solid rgba(255,255,255,.1); }
.hpt__title { flex: 1; font-weight: 600; letter-spacing: .02em; }
.hpt__btn { cursor: pointer; background: rgba(255,255,255,.1); color: inherit;
  border: 1px solid rgba(255,255,255,.16); border-radius: 6px; padding: 3px 8px; font: inherit; }
.hpt__btn:hover { background: rgba(255,255,255,.2); }
.hpt__body { overflow-y: auto; padding: 4px 10px 10px; }
.hpt__group { margin-top: 8px; }
.hpt__legend { font-weight: 600; opacity: .7; text-transform: uppercase;
  font-size: 10px; letter-spacing: .08em; margin: 8px 0 4px; }
.hpt__row { display: grid; grid-template-columns: 64px 1fr 52px; align-items: center;
  gap: 6px; margin: 3px 0; }
.hpt__row label { opacity: .85; }
.hpt__row input[type=range] { width: 100%; accent-color: #c69; }
.hpt__row input[type=number] { width: 100%; background: rgba(255,255,255,.06); color: inherit;
  border: 1px solid rgba(255,255,255,.14); border-radius: 4px; padding: 2px 4px; font: inherit; }
.hpt__hint { opacity: .55; font-size: 10px; margin: 8px 0 4px; }
.hpt__out { width: 100%; height: 130px; resize: vertical; margin-top: 6px;
  background: rgba(0,0,0,.35); color: #d7d7db; border: 1px solid rgba(255,255,255,.12);
  border-radius: 6px; padding: 6px; font: 11px/1.35 ui-monospace, Menlo, Consolas, monospace; }
.hpt.is-collapsed .hpt__body { display: none; }
`;

function serialize(c: HeroPagesConfig): string {
  const e = c.entry;
  const s = c.stack;
  return [
    'export const HERO_PAGES_CONFIG: HeroPagesConfig = {',
    `  count: ${c.count},`,
    `  pin: ${c.pin},`,
    `  scrub: ${c.scrub},`,
    `  scale: ${c.scale},`,
    `  stagger: ${c.stagger},`,
    `  contentRise: ${c.contentRise},`,
    `  reverse: ${c.reverse},`,
    `  entry: { x: ${e.x}, y: ${e.y}, spread: ${e.spread}, rotMin: ${e.rotMin}, rotMax: ${e.rotMax} },`,
    `  crest: { x: ${c.crest.x}, y: ${c.crest.y} },`,
    `  stack: { x: ${s.x}, y: ${s.y}, dx: ${s.dx}, dy: ${s.dy}, rotJitter: ${s.rotJitter} },`,
    '};',
  ].join('\n');
}

export function mountHeroPagesTuner(api: HeroPagesApi): void {
  const { config } = api;

  if (!document.getElementById('hpt-style')) {
    const style = document.createElement('style');
    style.id = 'hpt-style';
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  const panel = document.createElement('div');
  panel.className = 'hpt';
  if (localStorage.getItem('hpt-collapsed') === '1') panel.classList.add('is-collapsed');

  const bar = document.createElement('div');
  bar.className = 'hpt__bar';
  const title = document.createElement('span');
  title.className = 'hpt__title';
  title.textContent = 'Hero pages';
  const copyBtn = document.createElement('button');
  copyBtn.className = 'hpt__btn';
  copyBtn.textContent = 'Copy';
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'hpt__btn';
  const setToggleLabel = () => (toggleBtn.textContent = panel.classList.contains('is-collapsed') ? '▸' : '▾');
  setToggleLabel();
  bar.append(title, copyBtn, toggleBtn);

  const body = document.createElement('div');
  body.className = 'hpt__body';

  const out = document.createElement('textarea');
  out.className = 'hpt__out';
  out.readOnly = true;

  let queued = false;
  const refresh = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      api.rebuild();
      out.value = serialize(config);
    });
  };

  const addControl = (parent: HTMLElement, spec: ControlSpec) => {
    const row = document.createElement('div');
    row.className = 'hpt__row';
    const label = document.createElement('label');
    label.textContent = spec.label;
    const range = document.createElement('input');
    range.type = 'range';
    range.min = String(spec.min);
    range.max = String(spec.max);
    range.step = String(spec.step);
    const num = document.createElement('input');
    num.type = 'number';
    num.step = String(spec.step);
    const sync = (v: number) => {
      range.value = String(v);
      num.value = String(v);
    };
    sync(spec.get());
    range.addEventListener('input', () => {
      const v = parseFloat(range.value);
      spec.set(v);
      num.value = range.value;
      refresh();
    });
    num.addEventListener('input', () => {
      const v = parseFloat(num.value);
      if (Number.isNaN(v)) return;
      spec.set(v);
      range.value = num.value;
      refresh();
    });
    row.append(label, range, num);
    parent.appendChild(row);
  };

  const addGroup = (legend: string, specs: ControlSpec[]) => {
    const group = document.createElement('div');
    group.className = 'hpt__group';
    const head = document.createElement('div');
    head.className = 'hpt__legend';
    head.textContent = legend;
    group.appendChild(head);
    specs.forEach((s) => addControl(group, s));
    body.appendChild(group);
    return group;
  };

  const addToggle = (parent: HTMLElement, label: string, get: () => boolean, set: (v: boolean) => void) => {
    const row = document.createElement('div');
    row.className = 'hpt__row';
    const lab = document.createElement('label');
    lab.textContent = label;
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = get();
    cb.style.justifySelf = 'start';
    cb.addEventListener('input', () => {
      set(cb.checked);
      refresh();
    });
    row.append(lab, cb);
    parent.appendChild(row);
  };

  const flow = addGroup('Flow', [
    { label: 'count', min: 10, max: 24, step: 1, get: () => config.count, set: (v) => (config.count = v) },
    { label: 'length %', min: 60, max: 400, step: 10, get: () => config.pin, set: (v) => (config.pin = v) },
    { label: 'scrub', min: 0, max: 3, step: 0.1, get: () => config.scrub, set: (v) => (config.scrub = v) },
    { label: 'stagger', min: 0.1, max: 1.5, step: 0.05, get: () => config.stagger, set: (v) => (config.stagger = v) },
    { label: 'scale', min: 0.4, max: 2, step: 0.05, get: () => config.scale, set: (v) => (config.scale = v) },
    { label: 'rise %', min: 0, max: 120, step: 5, get: () => config.contentRise, set: (v) => (config.contentRise = v) },
  ]);
  addToggle(flow, 'reverse', () => config.reverse, (v) => (config.reverse = v));

  addGroup('Entry (bottom-right)', [
    { label: 'x %', min: 90, max: 160, step: 1, get: () => config.entry.x, set: (v) => (config.entry.x = v) },
    { label: 'y %', min: 40, max: 100, step: 1, get: () => config.entry.y, set: (v) => (config.entry.y = v) },
    { label: 'spread', min: 0, max: 200, step: 1, get: () => config.entry.spread, set: (v) => (config.entry.spread = v) },
    { label: 'rot min', min: -90, max: 0, step: 1, get: () => config.entry.rotMin, set: (v) => (config.entry.rotMin = v) },
    { label: 'rot max', min: 0, max: 90, step: 1, get: () => config.entry.rotMax, set: (v) => (config.entry.rotMax = v) },
  ]);

  addGroup('Crest (over wordmark)', [
    { label: 'x %', min: 0, max: 100, step: 1, get: () => config.crest.x, set: (v) => (config.crest.x = v) },
    { label: 'y %', min: -40, max: 100, step: 1, get: () => config.crest.y, set: (v) => (config.crest.y = v) },
  ]);

  addGroup('Stack (bottom-left)', [
    { label: 'x %', min: 0, max: 60, step: 1, get: () => config.stack.x, set: (v) => (config.stack.x = v) },
    { label: 'y %', min: 50, max: 100, step: 1, get: () => config.stack.y, set: (v) => (config.stack.y = v) },
    { label: 'dx %', min: -5, max: 5, step: 0.1, get: () => config.stack.dx, set: (v) => (config.stack.dx = v) },
    { label: 'dy %', min: -5, max: 5, step: 0.1, get: () => config.stack.dy, set: (v) => (config.stack.dy = v) },
    { label: 'rot ±', min: 0, max: 90, step: 1, get: () => config.stack.rotJitter, set: (v) => (config.stack.rotJitter = v) },
  ]);

  const hint = document.createElement('div');
  hint.className = 'hpt__hint';
  hint.textContent = 'Scroll the hero to preview the arc. Copy → paste over HERO_PAGES_CONFIG in src/scripts/hero-pages.ts.';
  body.append(hint, out);
  out.value = serialize(config);

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('is-collapsed');
    localStorage.setItem('hpt-collapsed', panel.classList.contains('is-collapsed') ? '1' : '0');
    setToggleLabel();
  });

  copyBtn.addEventListener('click', async () => {
    const text = serialize(config);
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied!';
    } catch {
      out.select();
      copyBtn.textContent = 'Select+⌘C';
    }
    setTimeout(() => (copyBtn.textContent = 'Copy'), 1400);
  });

  panel.append(bar, body);
  document.body.appendChild(panel);
}
