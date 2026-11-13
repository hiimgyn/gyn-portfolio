<template>
  <div ref="host" aria-hidden="true" class="pointer-events-none fixed inset-0 [&>canvas]:block [&>canvas]:size-full"></div>
</template>

<script setup>
/**
 * One particle cloud that morphs between three shapes as the page scrolls:
 *   0 → a BPMN-style process: start event, tasks, an exclusive gateway, two branches, end event.
 *       Particles stream along the sequence flows.
 *   1 → a layered system diagram: interface / API / services / data planes with requests flowing down.
 *   2 → a wireframe globe with an amber orbit: the work, shipped and live.
 * Stages are reached at elements marked data-stage="1" / "2". A page can pin a stage with
 * data-scene="n" (and data-dim to keep it in the background). Same structure as the GPM Hub
 * landing scene: one Points draw call, morph in the vertex shader, a domain-warped nebula and stars.
 */
import { onMounted, onBeforeUnmount, ref } from 'vue'

const host = ref(null)

const VERT = /* glsl */ `
  uniform float uTime, uProgress, uPixelRatio, uSize, uGlobeX, uNarrow;
  attribute vec3 aB, aC, aColA, aColB, aColC;
  attribute vec4 aFlowA, aFlowB;
  attribute float aRand;
  varying vec3 vColor;
  varying float vFade;

  vec3 spinY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x * c - p.z * s, p.y, p.x * s + p.z * c); }
  vec3 spinX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c); }
  // particles on a sequence flow ride from the segment start to its end and wrap
  vec3 flow(vec3 p, vec4 f, float speed) {
    float l = max(length(f.xyz), 0.001);
    return p + f.xyz * fract(f.w + uTime * speed / l);
  }

  void main() {
    float d = aRand * 0.35;
    float tAB = smoothstep(0.0, 1.0, clamp((uProgress - d) / 0.65, 0.0, 1.0));
    float tBC = smoothstep(0.0, 1.0, clamp((uProgress - 1.0 - d) / 0.65, 0.0, 1.0));

    vec3 a = flow(position, aFlowA, 0.9);
    a *= mix(0.68, 0.4, uNarrow);
    if (uNarrow > 0.5) a = vec3(a.y, -a.x, a.z); // phones: the process runs top to bottom
    a.z += sin(uTime * 0.8 + aRand * 6.28) * 0.05;
    a = spinX(spinY(a, sin(uTime * 0.22) * 0.22), -0.12);

    vec3 b = flow(aB, aFlowB, 0.7);
    b.xz *= mix(0.85, 0.6, uNarrow);
    b = spinY(b, uTime * 0.08 + 0.5);

    vec3 c = spinX(spinY(aC, uTime * 0.12), 0.25) + vec3(uGlobeX, 0.2, 0.0);

    vec3 p = mix(a, b, tAB);
    p = mix(p, c, tBC);
    p.y += (sin(tAB * 3.14159) + sin(tBC * 3.14159)) * (0.4 + aRand * 1.3);

    vColor = mix(mix(aColA, aColB, tAB), aColC, tBC);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.9 + aRand * 1.2) * uPixelRatio * (6.0 / -mv.z);
    vFade = clamp(1.0 - (-mv.z - 6.0) / 22.0, 0.08, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform float uGlow;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * (0.55 + a), a * a * vFade * uGlow);
  }
`

const BG_VERT = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`
const BG_FRAG = /* glsl */ `
  uniform float uTime, uProgress, uDim;
  uniform vec2 uRes, uMouse;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }
  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y + uMouse * 0.04;
    float t = uTime * 0.035;
    vec2 q = vec2(fbm(uv * 1.5 + t), fbm(uv * 1.5 - t + 3.1));
    float n = fbm(uv * 1.3 + q * 1.9 + vec2(t * 0.6, -t * 0.4));
    float s1 = clamp(uProgress, 0.0, 1.0), s2 = clamp(uProgress - 1.0, 0.0, 1.0);
    // process: indigo + violet · system: deep indigo + blue-violet · globe: indigo + amber
    vec3 ca = mix(mix(vec3(0.34, 0.32, 0.95), vec3(0.22, 0.30, 0.85), s1), vec3(0.32, 0.34, 0.95), s2);
    vec3 cb = mix(mix(vec3(0.62, 0.36, 0.95), vec3(0.48, 0.40, 0.98), s1), vec3(0.95, 0.66, 0.22), s2);
    vec3 col = mix(ca, cb, smoothstep(0.35, 0.75, q.x));
    float vign = 1.0 - smoothstep(0.15, 1.35, length(uv * vec2(0.75, 1.0)));
    float neb = smoothstep(0.3, 0.62, n);
    float wisp = pow(smoothstep(0.42, 0.72, fbm(uv * 3.2 + q * 2.5 - t)), 2.0);
    vec3 c = vec3(0.027, 0.039, 0.078) + col * (neb * 0.6 + wisp * 0.65) * vign * uDim;
    c += ca * 0.18 * exp(-abs(uv.y + 0.2) * 3.0) * vign * uDim;
    c = c / (1.0 + c * 0.6);
    gl_FragColor = vec4(c, 1.0);
  }
`

const STAR_VERT = /* glsl */ `
  uniform float uTime, uPixelRatio;
  attribute float aPhase;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + fract(aPhase * 7.3) * 1.8) * uPixelRatio;
    vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + fract(aPhase * 3.1) * 1.8) + aPhase * 6.28));
  }
`
const STAR_FRAG = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(vec3(0.85, 0.88, 1.0), smoothstep(0.5, 0.0, d) * vA);
  }
`

const ICE = [0.86, 0.89, 1.0]
const IND = [0.545, 0.557, 0.969] // #8B8EF7
const VIO = [0.655, 0.545, 0.98] // #A78BFA
const AMB = [0.984, 0.749, 0.141] // #FBBF24
const DIM = [0.4, 0.43, 0.62]

const R = Math.random
const gauss = () => (R() + R() + R() - 1.5) / 1.5
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

// Emitters return a point (and, for sequence flows, the vector to flow along).
const seg = (from, to, col, k = 1, flowing = false) => ({
  w: Math.hypot(...sub(to, from)) * k,
  col,
  at: () => {
    if (flowing) return { p: [from[0] + gauss() * 0.025, from[1] + gauss() * 0.025, from[2] + gauss() * 0.04], f: [...sub(to, from), R()] }
    const u = R()
    return { p: [from[0] + (to[0] - from[0]) * u + gauss() * 0.025, from[1] + (to[1] - from[1]) * u + gauss() * 0.025, from[2] + (to[2] - from[2]) * u + gauss() * 0.03] }
  }
})
const poly = (pts, col, k = 1) => pts.map((p, i) => seg(p, pts[(i + 1) % pts.length], col, k))
// rectangle in a plane: xy (process) or xz (system layer)
const rect = (cx, cy, w, h, col, k, plane = 'xy', y = 0) => {
  const q = [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]]
  return poly(q.map(([a, b]) => (plane === 'xy' ? [a, b, 0] : [a, y, b])), col, k)
}
const ring = (c, r, col, k = 1, plane = 'xy') => ({
  w: 2 * Math.PI * r * k,
  col,
  at: () => {
    const a = R() * Math.PI * 2, rr = r + gauss() * 0.03
    return { p: plane === 'xy' ? [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr, c[2] + gauss() * 0.04] : [c[0] + Math.cos(a) * rr, c[1] + gauss() * 0.02, c[2] + Math.sin(a) * rr] }
  }
})

function sampler(emitters) {
  const total = emitters.reduce((s, e) => s + e.w, 0)
  return () => {
    let x = R() * total
    for (const e of emitters) if ((x -= e.w) <= 0) return { ...e.at(), col: e.col }
    return { ...emitters[0].at(), col: emitters[0].col }
  }
}

/** Shape A: start → task → gateway → two branches → end, drawn like a BPMN diagram. */
function processShape() {
  const e = []
  e.push(ring([-5.2, 0, 0], 0.42, ICE, 1.3))
  e.push(ring([5.2, 0, 0], 0.42, AMB, 1.3), ring([5.2, 0, 0], 0.3, AMB, 1.0))
  const task = (cx, cy) => {
    e.push(...rect(cx, cy, 1.9, 1.1, IND, 1.25))
    e.push(seg([cx - 0.6, cy + 0.15, 0], [cx + 0.6, cy + 0.15, 0], DIM, 0.45), seg([cx - 0.6, cy - 0.15, 0], [cx + 0.25, cy - 0.15, 0], DIM, 0.45))
  }
  task(-2.9, 0)
  task(2.6, 1.55)
  task(2.6, -1.55)
  // exclusive gateway: a diamond with an X
  const g = [-0.2, 0]
  e.push(...poly([[g[0] - 0.72, g[1], 0], [g[0], g[1] + 0.72, 0], [g[0] + 0.72, g[1], 0], [g[0], g[1] - 0.72, 0]], AMB, 1.4))
  e.push(seg([g[0] - 0.22, g[1] - 0.22, 0], [g[0] + 0.22, g[1] + 0.22, 0], AMB, 0.9), seg([g[0] - 0.22, g[1] + 0.22, 0], [g[0] + 0.22, g[1] - 0.22, 0], AMB, 0.9))
  // sequence flows (particles stream along them)
  const F = (pts) => pts.slice(1).forEach((p, i) => e.push(seg(pts[i], p, VIO, 1.6, true)))
  F([[-4.75, 0, 0], [-3.88, 0, 0]])
  F([[-1.92, 0, 0], [-0.95, 0, 0]])
  F([[-0.2, 0.75, 0], [-0.2, 1.55, 0], [1.62, 1.55, 0]])
  F([[-0.2, -0.75, 0], [-0.2, -1.55, 0], [1.62, -1.55, 0]])
  F([[3.58, 1.55, 0], [5.2, 1.55, 0], [5.2, 0.45, 0]])
  F([[3.58, -1.55, 0], [5.2, -1.55, 0], [5.2, -0.45, 0]])
  return sampler(e)
}

/** Shape B: four planes (interface, API, services, data) with modules; requests flow down between them. */
function systemShape() {
  const e = []
  const W = 7.2, D = 3.6
  const layers = [
    { y: 1.65, col: ICE, n: 4 },
    { y: 0.55, col: IND, n: 3 },
    { y: -0.55, col: VIO, n: 4 },
    { y: -1.65, col: AMB, n: 3, db: true },
  ]
  const centers = layers.map(({ y, col, n, db }) => {
    e.push(...rect(0, 0, W, D, col, 0.8, 'xz', y))
    const mw = (W - 0.5 * (n + 1)) / n
    const xs = Array.from({ length: n }, (_, j) => -W / 2 + 0.5 + mw / 2 + j * (mw + 0.5))
    for (const x of xs) {
      if (db) {
        const r = Math.min(mw, D * 0.6) / 2.2
        e.push(ring([x, y, 0], r, col, 1.2, 'xz'), ring([x, y + 0.22, 0], r, col, 1.2, 'xz'))
      } else e.push(...rect(x, 0, mw, D * 0.55, col, 1.1, 'xz', y))
    }
    return xs.map((x) => [x, y, 0])
  })
  for (let i = 0; i < centers.length - 1; i++)
    for (const c of centers[i]) {
      const next = centers[i + 1].reduce((best, d) => (Math.abs(d[0] - c[0]) < Math.abs(best[0] - c[0]) ? d : best))
      e.push(seg([c[0], c[1] - 0.04, 0], [next[0], next[1] + 0.26, 0], DIM, 1.4, true))
    }
  return sampler(e)
}

function build(n) {
  const pos = new Float32Array(n * 3), b = new Float32Array(n * 3), c = new Float32Array(n * 3)
  const fa = new Float32Array(n * 4), fb = new Float32Array(n * 4)
  const ca = new Float32Array(n * 3), cb = new Float32Array(n * 3), cc = new Float32Array(n * 3)
  const rand = new Float32Array(n)
  const A = processShape(), B = systemShape()
  const golden = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < n; i++) {
    const k = i * 3
    rand[i] = R()
    const dust = R() < 0.07

    if (dust) {
      pos.set([(R() - 0.5) * 14, (R() - 0.5) * 6, (R() - 0.5) * 4], k)
      b.set([(R() - 0.5) * 10, (R() - 0.5) * 5, (R() - 0.5) * 6], k)
      ca.set(DIM, k)
      cb.set(DIM, k)
    } else {
      const a = A(), s = B()
      pos.set(a.p, k)
      ca.set(a.col, k)
      if (a.f) fa.set(a.f, i * 4)
      b.set(s.p, k)
      cb.set(s.col, k)
      if (s.f) fb.set(s.f, i * 4)
    }

    // Globe: Fibonacci sphere, a few meridians/parallels, an amber orbit and a soft inner core.
    const roll = R()
    const gi = i + 0.5, y = 1 - (2 * gi) / n, sq = Math.sqrt(1 - y * y), th = golden * gi
    if (roll < 0.6) {
      c.set([Math.cos(th) * sq * 2.3, y * 2.3, Math.sin(th) * sq * 2.3], k)
      cc.set(y > 0 ? IND : VIO, k)
    } else if (roll < 0.78) {
      const t = R() * Math.PI * 2, m = Math.floor(R() * 10)
      if (m < 6) {
        const lon = (m / 6) * Math.PI
        c.set([Math.cos(t) * Math.cos(lon) * 2.34, Math.sin(t) * 2.34, Math.cos(t) * Math.sin(lon) * 2.34], k)
      } else {
        const lat = ((m - 6) / 3 - 0.5) * 1.6, r = Math.cos(lat) * 2.34
        c.set([Math.cos(t) * r, Math.sin(lat) * 2.34, Math.sin(t) * r], k)
      }
      cc.set(ICE, k)
    } else if (roll < 0.9) {
      const t = R() * Math.PI * 2, r = 3.3 + gauss() * 0.05
      c.set([Math.cos(t) * r, Math.sin(t) * r * 0.32 + gauss() * 0.03, Math.sin(t) * r * 0.95], k)
      cc.set(AMB, k)
    } else {
      const r = 1.2 + R() * 0.8, t = R() * Math.PI * 2, u = R() * 2 - 1, s2 = Math.sqrt(1 - u * u)
      c.set([Math.cos(t) * s2 * r, u * r, Math.sin(t) * s2 * r], k)
      cc.set(DIM, k)
    }
  }
  return { pos, b, c, fa, fb, ca, cb, cc, rand }
}

let dispose = () => {}
let cancelled = false

onMounted(() => {
  const el = host.value
  import('three').then((THREE) => {
    if (cancelled || !el) return
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // no WebGL: the page keeps its flat dark background
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)

    const d = build(mobile ? 6500 : 15000)
    const geo = new THREE.BufferGeometry()
    const attr = (name, arr, size) => geo.setAttribute(name, new THREE.BufferAttribute(arr, size))
    attr('position', d.pos, 3)
    attr('aB', d.b, 3)
    attr('aC', d.c, 3)
    attr('aFlowA', d.fa, 4)
    attr('aFlowB', d.fb, 4)
    attr('aColA', d.ca, 3)
    attr('aColB', d.cb, 3)
    attr('aColC', d.cc, 3)
    attr('aRand', d.rand, 1)
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: mobile ? 5.5 : 6.5 },
      uGlow: { value: 1 },
      uGlobeX: { value: 0 },
      uNarrow: { value: 0 },
    }
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    scene.add(points)

    const bgUniforms = { uTime: uniforms.uTime, uProgress: uniforms.uProgress, uDim: { value: 1 }, uRes: { value: new THREE.Vector2() }, uMouse: { value: new THREE.Vector2() } }
    const bgMat = new THREE.ShaderMaterial({ vertexShader: BG_VERT, fragmentShader: BG_FRAG, uniforms: bgUniforms, depthTest: false, depthWrite: false })
    const bgGeo = new THREE.PlaneGeometry(2, 2)
    const bg = new THREE.Mesh(bgGeo, bgMat)
    bg.frustumCulled = false
    bg.renderOrder = -1
    scene.add(bg)

    const starCount = mobile ? 900 : 2200
    const starPos = new Float32Array(starCount * 3), starPhase = new Float32Array(starCount)
    for (let i = 0; i < starCount; i++) {
      const u = R() * 2 - 1, th = R() * Math.PI * 2, r = 35 + R() * 15, cs = Math.sqrt(1 - u * u)
      starPos.set([Math.cos(th) * cs * r, u * r, Math.sin(th) * cs * r], i * 3)
      starPhase[i] = R()
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhase, 1))
    const starMat = new THREE.ShaderMaterial({ vertexShader: STAR_VERT, fragmentShader: STAR_FRAG, uniforms: { uTime: uniforms.uTime, uPixelRatio: uniforms.uPixelRatio }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    let narrow = false
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      narrow = w < 768
      uniforms.uGlobeX.value = narrow ? 0 : 2.6
      uniforms.uNarrow.value = narrow ? 1 : 0
      renderer.setSize(w, h, false)
      renderer.getDrawingBufferSize(bgUniforms.uRes.value)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5
      mouse.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onMove)

    const anchor = (n) => {
      const a = document.querySelector(`[data-stage="${n}"]`)
      return a ? a.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight * (n / 2)
    }
    const scrollTarget = () => {
      const pinned = document.querySelector('[data-scene]')
      if (pinned) return Number(pinned.dataset.scene) || 0
      const y = window.scrollY + window.innerHeight * 0.5
      const a1 = anchor(1), a2 = anchor(2)
      return y < a1 ? Math.max(0, y - window.innerHeight * 0.5) / Math.max(1, a1 - window.innerHeight * 0.5) : 1 + Math.min(1, (y - a1) / Math.max(1, a2 - a1))
    }

    // Camera keyframes per stage: [x, y, z] position and look-at; x of the first is shifted so the
    // process sits up and to the right of the hero copy on wide screens.
    const lerp = (a, b, t) => a + (b - a) * t
    const keys = () => [
      { pos: [narrow ? 0 : -2.4, narrow ? -2.6 : -1.2, narrow ? 14 : 10], look: [narrow ? 0 : -2.4, narrow ? -3.6 : -2.2, 0] },
      { pos: [narrow ? 0 : -3.1, 5.2, narrow ? 13.5 : 9.6], look: [narrow ? 0 : -3.1, narrow ? 0.8 : -0.9, 0] },
      { pos: [0, 1.0, narrow ? 12 : 8.4], look: [0, narrow ? -2.6 : 0.2, 0] },
    ]

    let last = performance.now()
    let raf = 0
    const look = new THREE.Vector3()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (document.hidden) return
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!reduce) uniforms.uTime.value += dt
      bgUniforms.uMouse.value.set(mouse.x, -mouse.y)
      stars.rotation.y = uniforms.uTime.value * 0.006
      const target = scrollTarget()
      uniforms.uProgress.value = reduce ? target : uniforms.uProgress.value + (target - uniforms.uProgress.value) * Math.min(1, dt * 3.5)

      const p = uniforms.uProgress.value
      // Full brightness only within about half a screen of a stage anchor; across dense sections the
      // particles dim so text stays readable.
      const vh = window.innerHeight, y = window.scrollY + vh * 0.5
      const near = document.querySelector('[data-scene]') ? 1 : Math.max(...[vh * 0.5, anchor(1), anchor(2)].map((a) => 1 - Math.min(1, Math.max(0, (Math.abs(y - a) / vh - 0.08) / 0.16))))
      const dim = document.querySelector('[data-dim]') ? 0.18 : 1
      uniforms.uGlow.value = (0.14 + 0.86 * near) * dim
      bgUniforms.uDim.value = dim === 1 ? 1 : 0.6

      const K = keys()
      const i = Math.min(1, Math.floor(p)), f = Math.min(1, p - i)
      const t = f * f * (3 - 2 * f)
      const [ka, kb] = [K[i], K[i + 1]]
      camera.position.x += (lerp(ka.pos[0], kb.pos[0], t) + mouse.x * 1.2 - camera.position.x) * 0.05
      camera.position.y += (lerp(ka.pos[1], kb.pos[1], t) - mouse.y * 0.6 - camera.position.y) * 0.08
      camera.position.z += (lerp(ka.pos[2], kb.pos[2], t) - camera.position.z) * 0.08
      look.set(lerp(ka.look[0], kb.look[0], t), lerp(ka.look[1], kb.look[1], t), 0)
      camera.lookAt(look)

      renderer.render(scene, camera)
    }
    const k0 = keys()[0]
    camera.position.set(...k0.pos)
    tick()

    dispose = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      geo.dispose()
      mat.dispose()
      bgGeo.dispose()
      bgMat.dispose()
      starGeo.dispose()
      starMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  })
})

onBeforeUnmount(() => {
  cancelled = true
  dispose()
})
</script>
