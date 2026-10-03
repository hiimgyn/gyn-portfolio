<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
    <!-- Header -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md"
        :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="tracking-wider font-semibold">{{ $t('tetris.badge') }}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
        {{ $t('tetris.title') }}
      </h1>
      <p class="text-sm sm:text-base max-w-2xl mx-auto" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
        {{ $t('tetris.subtitle') }}
      </p>
    </div>

    <!-- Mode Switcher -->
    <div class="flex justify-center">
      <div class="inline-flex p-1.5 rounded-2xl border backdrop-blur-xl"
        :class="isDark ? 'bg-[#11131f]/90 border-white/[0.08]' : 'bg-violet-50/70 border-violet-100'"
      >
        <button
          v-for="m in ['zen', 'training', 'boss']"
          :key="m"
          @mousedown.prevent
          @click="setMode(m)"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200',
            mode === m
              ? (isDark ? 'bg-violet-600 text-white shadow-[0_2px_8px_rgba(139,92,246,0.35)]' : 'bg-white text-violet-800 shadow-[0_1px_4px_rgba(0,0,0,0.06)]')
              : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
          ]"
        >
          {{ $t(`tetris.${m}`) }}
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
      <!-- Game -->
      <div class="w-full max-w-[680px] select-none rounded-2xl p-3 bg-black border border-white/10">
       <div class="relative">
        <canvas ref="canvas" class="w-full h-auto block"></canvas>
        <div
          v-if="status !== 'playing'"
          class="absolute flex flex-col items-center justify-center gap-3 bg-black/60 text-white text-center"
          :style="overlayStyle"
        >
          <p class="text-2xl sm:text-3xl font-black tracking-widest"
            :class="{ 'text-emerald-300': status === 'win', 'text-rose-300': status === 'fail' }"
          >
            {{ overlayTitle }}
          </p>
          <p v-if="status === 'win'" class="text-xs font-mono text-slate-300">{{ $t('tetris.clearedHint') }}</p>
          <p v-if="status === 'fail' && mode === 'boss'" class="text-xs font-mono text-slate-300">{{ $t('tetris.retryHint') }}</p>
          <p v-if="status === 'paused'" class="text-xs font-mono text-slate-300">Esc</p>
        </div>
       </div>
      </div>

      <!-- Side panel -->
      <aside class="w-full lg:w-72 space-y-4">
        <div v-if="mode === 'zen'" class="rounded-2xl border p-4 space-y-3 backdrop-blur-xl" :class="card">
          <p class="text-sm" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">{{ $t('tetris.zenDesc') }}</p>
          <div class="space-y-1.5">
            <p class="text-xs font-mono font-semibold tracking-wider" :class="isDark ? 'text-violet-300' : 'text-violet-700'">{{ $t('tetris.garbage') }}</p>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="lvl in ['off', 'light', 'heavy']"
                :key="lvl"
                @mousedown.prevent
                @click="setGarbage(lvl)"
                :class="[
                  'px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  garbage === lvl ? 'bg-violet-600 text-white' : (isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-violet-50 text-slate-700 hover:bg-violet-100')
                ]"
              >
                {{ $t(`tetris.garbageLevels.${lvl}`) }}
              </button>
            </div>
            <p v-if="garbage !== 'off'" class="text-xs" :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ $t('tetris.garbageDesc') }}</p>
          </div>
          <div class="flex gap-2">
            <button @mousedown.prevent @click="newGame" class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500">{{ $t('tetris.restart') }}</button>
            <button @mousedown.prevent @click="togglePause" class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold border" :class="isDark ? 'border-white/10 text-slate-200 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'">
              {{ status === 'paused' ? $t('tetris.resume') : $t('tetris.pause') }}
            </button>
          </div>
        </div>

        <div v-else-if="mode === 'boss'" class="rounded-2xl border p-4 space-y-3 backdrop-blur-xl" :class="card">
          <p class="text-xs font-mono font-semibold tracking-wider" :class="isDark ? 'text-violet-300' : 'text-violet-700'">{{ $t('tetris.bosses') }}</p>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="(b, i) in BOSSES"
              :key="b.id"
              @mousedown.prevent
              @click="pickBoss(i)"
              :class="[
                'px-2.5 py-2 rounded-lg text-xs font-semibold text-left flex items-center justify-between gap-1 transition-colors border',
                i === bossIdx
                  ? (isDark ? 'bg-white/10 border-white/30' : 'bg-slate-900 border-slate-900')
                  : (isDark ? 'bg-white/5 border-transparent hover:bg-white/10' : 'bg-slate-100 border-transparent hover:bg-slate-200')
              ]"
            >
              <span :style="{ color: i === bossIdx || isDark ? b.color : undefined }" :class="i !== bossIdx && !isDark ? 'text-slate-700' : ''">{{ i + 1 }}. {{ $t(`tetris.bossNames.${b.id}`) }}</span>
              <span v-if="done[`boss-${b.id}`]" class="text-emerald-400">✓</span>
            </button>
          </div>
          <p class="text-sm" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">{{ $t('tetris.bossDesc') }}</p>
          <p class="text-xs font-mono" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            HP {{ boss.hp }} · {{ $t('tetris.bossEvery', { s: boss.every / 1000 }) }} · {{ Math.min(...boss.sizes) }}–{{ Math.max(...boss.sizes) }} {{ $t('tetris.lines') }} · LV {{ boss.level }}
          </p>
          <div class="flex gap-2">
            <button @mousedown.prevent @click="newGame" class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold border" :class="isDark ? 'border-white/10 text-slate-200 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'">{{ $t('tetris.reset') }}</button>
            <button @mousedown.prevent @click="pickBoss(bossIdx + 1)" class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500">{{ $t('tetris.nextBoss') }}</button>
          </div>
        </div>

        <div v-else class="rounded-2xl border p-4 space-y-3 backdrop-blur-xl" :class="card">
          <p class="text-xs font-mono font-semibold tracking-wider" :class="isDark ? 'text-violet-300' : 'text-violet-700'">{{ $t('tetris.lessons') }}</p>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="(l, i) in LESSONS"
              :key="l.id"
              @mousedown.prevent
              @click="pickLesson(i)"
              :class="[
                'px-2.5 py-2 rounded-lg text-xs font-semibold text-left flex items-center justify-between gap-1 transition-colors',
                i === lessonIdx
                  ? 'bg-violet-600 text-white'
                  : (isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-violet-50 text-slate-700 hover:bg-violet-100')
              ]"
            >
              <span>{{ l.name }}</span>
              <span v-if="done[l.id]" class="text-emerald-400">✓</span>
            </button>
          </div>
          <p class="text-sm" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">{{ $t(`tetris.lesson.${lesson.id}`) }}</p>
          <div class="flex gap-2">
            <button @mousedown.prevent @click="newGame" class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold border" :class="isDark ? 'border-white/10 text-slate-200 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'">{{ $t('tetris.reset') }}</button>
            <button @mousedown.prevent @click="pickLesson(lessonIdx + 1)" class="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500">{{ $t('tetris.next') }}</button>
          </div>
        </div>

        <div class="rounded-2xl border p-4 space-y-2 backdrop-blur-xl" :class="card">
          <p class="text-xs font-mono font-semibold tracking-wider" :class="isDark ? 'text-violet-300' : 'text-violet-700'">{{ $t('tetris.controls') }}</p>
          <div v-for="[k, label] in controls" :key="label" class="flex justify-between gap-3 text-xs">
            <span :class="isDark ? 'text-slate-400' : 'text-slate-600'">{{ $t(`tetris.keys.${label}`) }}</span>
            <kbd class="font-mono" :class="isDark ? 'text-slate-200' : 'text-slate-800'">{{ k }}</kbd>
          </div>
          <p class="text-[11px] pt-1 lg:hidden" :class="isDark ? 'text-slate-500' : 'text-slate-400'">{{ $t('tetris.keyboardOnly') }}</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import {
  W, H, HIDDEN, COLORS, CELLS, LESSONS, emptyBoard, parseBoard, collides, spawnPiece,
  rotate, dropDistance, spinType, lockPiece, actionName, bag, attackFor, addGarbage, GARBAGE_CAP
} from './TetrisLab/engine'

const { t } = useI18n()
const store = useStore()
const isDark = computed(() => store.isDark)
const overlayTitle = computed(() => {
  if (status.value === 'paused') return t('tetris.paused')
  if (mode.value === 'boss') return t(status.value === 'win' ? 'tetris.victory' : 'tetris.gameOver')
  return t(status.value === 'win' ? 'tetris.cleared' : 'tetris.failed')
})
const card = computed(() => (isDark.value ? 'bg-[#11131f]/90 border-white/[0.08]' : 'bg-white/85 border-violet-100'))

// Handling (tetr.io defaults are DAS 10f / ARR 2f)
const DAS = 133, ARR = 33, SOFT_MS = 20, LOCK_MS = 500, MAX_RESETS = 15

const COUNTDOWN_MS = 3000
// Bot opponent for Zen: sends an attack every `every` ms, sized from `sizes`.
// Incoming garbage turns "ready" (red) after GARBAGE_DELAY and rises on your next non-clearing placement.
const GARBAGE_DELAY = 1000
const GARBAGE_LEVELS = {
  off: null,
  light: { every: 6000, sizes: [1, 1, 2, 2, 3, 4] },
  heavy: { every: 3000, sizes: [1, 2, 2, 3, 4, 4, 6] }
}
// Boss ladder: HP = attack needed to win; gravity level, attack rhythm/size,
// messy = chance per garbage row that the hole moves, delay = ms before garbage can rise
const BOSSES = [
  { id: 'beginner', name: 'BEGINNER', color: '#6ee7b7', hp: 8, level: 1, every: 9000, sizes: [1, 1, 2] },
  { id: 'easy', name: 'EASY', color: '#7dd3fc', hp: 16, level: 3, every: 7000, sizes: [1, 2, 2, 3] },
  { id: 'normal', name: 'NORMAL', color: '#c4b5fd', hp: 24, level: 5, every: 5500, sizes: [1, 2, 3, 4] },
  { id: 'hard', name: 'HARD', color: '#fcd34d', hp: 32, level: 8, every: 4500, sizes: [2, 3, 4, 4, 5], messy: 0.1 },
  { id: 'expert', name: 'EXPERT', color: '#fb923c', hp: 40, level: 11, every: 3500, sizes: [2, 3, 4, 5, 6], messy: 0.25, delay: 800 },
  { id: 'hell', name: 'HELL', color: '#f43f5e', hp: 50, level: 15, every: 2500, sizes: [3, 4, 5, 6, 8], messy: 0.5, delay: 500 }
]

// Canvas layout like tetr.io: [hold 5][board 10][meter strip][next 5.4]
const C = 32
const HOLD_W = 5.2 * C
const BX = HOLD_W, BW = W * C
const METER_W = 0.9 * C
const NX = BX + BW + METER_W, NEXT_W = 5.4 * C
const VY = HIDDEN * C, BH = (H - HIDDEN) * C
const CW = NX + NEXT_W, CH = H * C + 0.4 * C
const FONT = 'Rajdhani, Outfit, sans-serif'
const overlayStyle = {
  left: `${(BX / CW) * 100}%`, width: `${(BW / CW) * 100}%`,
  top: `${(VY / CH) * 100}%`, height: `${(BH / CH) * 100}%`
}

const KEYS = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'soft', Space: 'hard',
  ArrowUp: 'cw', KeyX: 'cw', KeyZ: 'ccw', ControlLeft: 'ccw', ControlRight: 'ccw', KeyA: '180',
  KeyC: 'hold', ShiftLeft: 'hold', ShiftRight: 'hold', KeyR: 'reset', Escape: 'pause', KeyP: 'pause', Enter: 'next'
}
const controls = [
  ['← →', 'move'], ['↓', 'soft'], ['Space', 'hard'], ['↑ / X', 'cw'], ['Z / Ctrl', 'ccw'],
  ['A', 'r180'], ['C / Shift', 'hold'], ['R', 'reset'], ['Esc', 'pause']
]

const canvas = ref(null)
const mode = ref('zen')
const lessonIdx = ref(0)
const lesson = computed(() => LESSONS[lessonIdx.value])
const status = ref('playing') // playing | paused | win | fail
const done = ref({})
const garbage = ref('off')
const setGarbage = (lvl) => { garbage.value = lvl; newGame() }
const bossIdx = ref(0)
const boss = computed(() => BOSSES[bossIdx.value])
const pickBoss = (i) => { bossIdx.value = (i + BOSSES.length) % BOSSES.length; newGame() }

let g, fx, ctx, raf, last = 0, failTimer
const held = { left: false, right: false, soft: false }
const das = { dir: 0, t: 0, arr: 0 }

// ---------- game flow ----------
function newGame() {
  clearTimeout(failTimer)
  const l = mode.value === 'training' ? lesson.value : null
  g = {
    board: l ? parseBoard(l.board) : emptyBoard(),
    gen: l ? null : bag(),
    queue: l ? [...l.queue] : [],
    piece: null, hold: null, canHold: true,
    gravT: 0, lockT: 0, resets: 0, lastRot: null,
    b2b: -1, combo: -1, score: 0, lines: 0, pieces: 0, time: 0,
    countdown: COUNTDOWN_MS, go: 0,
    incoming: [], oppT: 0, attack: 0,
    mode: mode.value,
    boss: mode.value === 'boss' ? boss.value : null,
    bossHp: boss.value.hp,
    opp: mode.value === 'boss' ? boss.value : mode.value === 'zen' ? GARBAGE_LEVELS[garbage.value] : null
  }
  if (g.gen) while (g.queue.length < 5) g.queue.push(g.gen.next().value)
  fx = { particles: [], flashes: [], trails: [], texts: [], hits: [], lockFlash: null, shake: 0, bossFlash: 0 }
  status.value = 'playing'
}

const setMode = (m) => { mode.value = m; newGame() }
const pickLesson = (i) => { lessonIdx.value = (i + LESSONS.length) % LESSONS.length; newGame() }
const level = () => (g.boss ? g.boss.level : Math.min(15, 1 + Math.floor(g.lines / 10)))
const ready = (a) => a.t >= (g.opp?.delay ?? GARBAGE_DELAY)
const gravityMs = () => 1000 * (0.8 - (level() - 1) * 0.007) ** (level() - 1)

function nextType() {
  if (g.gen) while (g.queue.length < 6) g.queue.push(g.gen.next().value)
  return g.queue.shift()
}

function spawn(type = nextType()) {
  if (!type) return finish(false)
  Object.assign(g, { piece: spawnPiece(type), gravT: 0, lockT: 0, resets: 0, lastRot: null })
  if (!collides(g.board, g.piece)) return
  if (g.mode !== 'zen') return finish(false)
  clearBoard()
}

// Zen never ends: topping out just wipes the board
function clearBoard() {
  g.board = emptyBoard()
  g.incoming = []
  text('TOP OUT', '#fb7185')
}

function finish(win) {
  g.piece = null
  status.value = win ? 'win' : 'fail'
  if (win) done.value[g.boss ? `boss-${g.boss.id}` : lesson.value.id] = true
  else if (g.mode === 'training') failTimer = setTimeout(newGame, 900)
}

function togglePause() {
  if (status.value === 'playing') status.value = 'paused'
  else if (status.value === 'paused') status.value = 'playing'
}

// ---------- piece actions ----------
const grounded = () => collides(g.board, { ...g.piece, y: g.piece.y + 1 })

function moved() {
  if (grounded() && g.resets < MAX_RESETS) { g.lockT = 0; g.resets++ }
}

function shift(dx) {
  const p = { ...g.piece, x: g.piece.x + dx }
  if (collides(g.board, p)) return false
  g.piece = p
  g.lastRot = null
  moved()
  return true
}

function turn(dir) {
  const res = rotate(g.board, g.piece, dir)
  if (!res) return
  g.piece = res.piece
  g.lastRot = { tst: res.tst }
  moved()
}

function stepDown() {
  if (grounded()) return false
  g.piece = { ...g.piece, y: g.piece.y + 1 }
  g.lastRot = null
  return true
}

function hardDrop() {
  const d = dropDistance(g.board, g.piece)
  if (d) {
    fx.trails.push({ piece: { ...g.piece }, d, t: 0 })
    g.lastRot = null
  }
  g.piece = { ...g.piece, y: g.piece.y + d }
  fx.shake = Math.max(fx.shake, 4)
  lock()
}

function hold() {
  if (!g.canHold || (!g.hold && !g.queue.length)) return
  const t = g.piece.type
  spawn(g.hold || nextType())
  g.hold = t
  g.canHold = false
}

function lock() {
  const p = g.piece
  const spin = g.lastRot ? spinType(g.board, p, g.lastRot.tst) : null
  const { lines, cleared, pc } = lockPiece(g.board, p)
  g.pieces++
  fx.lockFlash = { piece: p, t: 0 }

  if (lines) {
    g.b2b = lines === 4 || spin ? g.b2b + 1 : -1
    g.combo++
  } else g.combo = -1

  const base = spin === 'full' ? [400, 800, 1200, 1600] : spin === 'mini' ? [100, 200, 400] : [0, 100, 300, 500, 800]
  let pts = base[lines] * (lines && g.b2b > 0 ? 1.5 : 1) + Math.max(g.combo, 0) * 50 + (pc ? 3000 : 0)
  g.score += Math.round(pts * level())
  g.lines += lines

  const name = actionName(lines, spin)
  if (name) text(name, spin ? '#d8a4ff' : lines === 4 ? '#67e8f9' : '#ffffff', spin || lines === 4 ? 1.25 : 1)
  if (lines && g.b2b > 0) text(`B2B ×${g.b2b}`, '#fcd34d')
  if (g.combo > 0) text(`${g.combo} COMBO`, '#7dd3fc')
  if (pc) text('PERFECT CLEAR', '#6ee7b7', 1.4)

  for (const { y, cells } of cleared) {
    fx.flashes.push({ y, t: 0 })
    cells.forEach((c, x) => {
      for (let i = 0; i < 3; i++) {
        fx.particles.push({
          x: BX + (x + Math.random()) * C, y: (y + Math.random()) * C,
          vx: (Math.random() - 0.5) * 0.5, vy: -Math.random() * 0.45 - 0.05,
          life: 1, color: COLORS[c], s: 3 + Math.random() * 5
        })
      }
    })
  }
  if (lines) fx.shake = Math.max(fx.shake, 3 + lines * 2 + (spin ? 3 : 0))

  // Attack cancels incoming garbage first; a placement without a clear lets ready garbage rise
  let atk = attackFor(lines, spin, g.b2b, g.combo, pc)
  g.attack += atk
  while (atk > 0 && g.incoming.length) {
    const a = g.incoming[0], c = Math.min(a.n, atk)
    a.n -= c
    atk -= c
    if (!a.n) g.incoming.shift()
  }
  g.canHold = true
  // Whatever wasn't spent cancelling garbage hits the boss
  if (g.boss && atk > 0) {
    g.bossHp = Math.max(0, g.bossHp - atk)
    fx.hits.push({ n: atk, t: 0 })
    fx.bossFlash = 180
    if (!g.bossHp) return finish(true)
  }
  if (!lines) {
    let cap = GARBAGE_CAP, rose = 0
    while (cap > 0 && g.incoming.length && ready(g.incoming[0])) {
      const a = g.incoming[0]
      if (Math.random() < (g.opp.messy || 0)) a.hole = Math.floor(Math.random() * W)
      if (addGarbage(g.board, 1, a.hole)) {
        if (g.mode !== 'zen') return finish(false)
        clearBoard()
        break
      }
      a.n--
      cap--
      rose++
      if (!a.n) g.incoming.shift()
    }
    if (rose) fx.shake = Math.max(fx.shake, 4 + rose)
  }

  if (g.mode === 'training' && lesson.value.goal({ lines, spin, pc })) return finish(true)
  spawn()
}

// ---------- loop ----------
function update(dt) {
  if (status.value !== 'playing') return
  if (g.countdown > 0) {
    g.countdown -= dt
    if (g.countdown <= 0) { g.go = 600; spawn() }
    return
  }
  if (!g.piece) return
  g.time += dt

  const opp = g.opp
  if (opp) {
    g.oppT += dt
    if (g.oppT >= opp.every) {
      g.oppT = 0
      g.incoming.push({ n: opp.sizes[Math.floor(Math.random() * opp.sizes.length)], hole: Math.floor(Math.random() * W), t: 0 })
    }
    for (const a of g.incoming) a.t += dt
  }

  if (das.dir) {
    das.t += dt
    if (das.t >= DAS) {
      das.arr += dt
      while (das.arr >= ARR) {
        das.arr -= ARR
        if (!shift(das.dir)) { das.arr = 0; break }
      }
    }
  }

  const interval = held.soft ? SOFT_MS : g.mode === 'training' ? Infinity : gravityMs()
  if (interval === Infinity) g.gravT = 0
  else {
    g.gravT += dt
    while (g.gravT >= interval) {
      g.gravT -= interval
      if (!stepDown()) { g.gravT = 0; break }
    }
  }

  // Training has no gravity and no auto-lock: place with hard drop only
  if (g.mode !== 'training' && grounded()) {
    g.lockT += dt
    if (g.lockT >= LOCK_MS) lock()
  }
}

function tickFx(dt) {
  fx.shake = Math.max(0, fx.shake - dt * 0.035)
  for (const p of fx.particles) {
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vy += 0.0012 * dt
    p.life -= dt / 800
  }
  fx.particles = fx.particles.filter((p) => p.life > 0)
  for (const list of [fx.flashes, fx.trails, fx.texts]) list.forEach((f) => (f.t += dt))
  fx.flashes = fx.flashes.filter((f) => f.t < 300)
  fx.trails = fx.trails.filter((f) => f.t < 220)
  fx.texts = fx.texts.filter((f) => f.t < 1600)
  if (fx.lockFlash && (fx.lockFlash.t += dt) > 160) fx.lockFlash = null
  if (g.go > 0) g.go -= dt
  fx.hits.forEach((h) => (h.t += dt))
  fx.hits = fx.hits.filter((h) => h.t < 900)
  fx.bossFlash -= dt
}

function frame(now) {
  const dt = Math.min(now - last, 50)
  last = now
  update(dt)
  tickFx(dt)
  draw()
  raf = requestAnimationFrame(frame)
}

function text(str, color, scale = 1) {
  fx.texts.push({ str, color, scale, t: 0 })
}

// ---------- drawing ----------
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) : v) * amt)))
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`
}

// tetr.io-style mino, proportions measured from the default skin:
// thin rim (light top-left, dark bottom-right), flat face, engraved inner square
// (dark groove top-left, light groove bottom-right) whose face darkens toward the center.
// Each color/size is rendered once to an offscreen sprite.
const sprites = new Map()
function sprite(color, s, core) {
  const key = `${color}|${s}|${core}`
  if (sprites.has(key)) return sprites.get(key)
  const dpr = window.devicePixelRatio || 1
  const cv = document.createElement('canvas')
  cv.width = cv.height = Math.ceil(s * dpr)
  const c = cv.getContext('2d')
  c.scale(dpr, dpr)
  const r = Math.max(1.5, s * 0.06), i = s * 0.19, w = s - 2 * i, e = Math.max(1, s * 0.05)
  c.fillStyle = color
  c.fillRect(0, 0, s, s)
  c.fillStyle = shade(color, 0.25); c.fillRect(0, 0, s, r)
  c.fillStyle = shade(color, 0.18); c.fillRect(0, 0, r, s)
  c.fillStyle = shade(color, -0.18); c.fillRect(0, s - r, s, r)
  c.fillStyle = shade(color, -0.12); c.fillRect(s - r, 0, r, s)
  c.fillStyle = shade(color, -0.1); c.fillRect(i, i, w, w)
  c.fillStyle = shade(color, 0.07); c.fillRect(i + e, i + e, w, w)
  if (core) c.fillStyle = core
  else {
    const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, w * 0.7)
    g.addColorStop(0, shade(color, -0.09))
    g.addColorStop(1, shade(color, -0.02))
    c.fillStyle = g
  }
  c.fillRect(i + e, i + e, w - e, w - e)
  sprites.set(key, cv)
  return cv
}

function mino(x, y, s, color, alpha = 1, core = null) {
  ctx.globalAlpha = alpha
  ctx.drawImage(sprite(color, s, core), x, y, s, s)
  ctx.globalAlpha = 1
}

const cellsOf = (p) => CELLS[p.type][p.r].map(([cx, cy]) => [p.x + cx, p.y + cy])

function drawPiece(type, cx, cy, s, alpha) {
  const cells = CELLS[type][0]
  const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1])
  const ox = cx - ((Math.max(...xs) + Math.min(...xs) + 1) * s) / 2
  const oy = cy - ((Math.max(...ys) + Math.min(...ys) + 1) * s) / 2
  for (const [x, y] of cells) mino(ox + x * s, oy + y * s, s, COLORS[type], alpha)
}

// White-framed panel: white header bar with black label, chamfered bottom corner
function panel(x, y, w, h, label, chamferRight) {
  const hh = 0.85 * C, k = 0.55 * C
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  if (chamferRight) {
    ctx.lineTo(x + w, y + h - k); ctx.lineTo(x + w - k, y + h); ctx.lineTo(x, y + h)
  } else {
    ctx.lineTo(x + w, y + h); ctx.lineTo(x + k, y + h); ctx.lineTo(x, y + h - k)
  }
  ctx.closePath()
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.fillRect(x, y, w, hh)
  ctx.fillStyle = '#000'
  ctx.font = `700 ${C * 0.72}px ${FONT}`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(label, x + 4, y + hh / 2 + 2)
}

const spaced = (str) => str.split('').join(String.fromCharCode(8202, 8202))

// Label + value where the value has a big part and a small suffix (e.g. "0:31" + ".933")
function stat(label, big, small, x, y, align) {
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'
  ctx.font = `700 ${C * 0.55}px ${FONT}`
  ctx.textAlign = align
  ctx.fillText(spaced(label), x, y - C * 1.05)
  ctx.font = `700 ${C * 0.62}px ${FONT}`
  const sw = small ? ctx.measureText(small).width : 0
  ctx.font = `700 ${C * 1.15}px ${FONT}`
  const bw = ctx.measureText(big).width
  const left = align === 'right' ? x - sw - bw : x
  ctx.textAlign = 'left'
  ctx.fillText(big, left, y)
  if (small) {
    ctx.font = `700 ${C * 0.62}px ${FONT}`
    ctx.fillText(small, left + bw + 1, y)
  }
}

function draw() {
  ctx.clearRect(0, 0, CW, CH)
  ctx.save()
  ctx.translate(0, fx.shake)

  // Board well + grid + meter strip
  ctx.fillStyle = '#000'
  ctx.fillRect(BX, VY, BW + METER_W, BH)
  ctx.strokeStyle = '#161616'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 1; x < W; x++) { ctx.moveTo(BX + x * C + 0.5, VY); ctx.lineTo(BX + x * C + 0.5, VY + BH) }
  for (let y = 1; y < H - HIDDEN; y++) { ctx.moveTo(BX, VY + y * C + 0.5); ctx.lineTo(BX + BW, VY + y * C + 0.5) }
  ctx.stroke()

  // Locked stack (rows above the field are drawn too, like tetr.io)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) if (g.board[y][x]) mino(BX + x * C, y * C, C, COLORS[g.board[y][x]])
  }

  // Hard drop trails
  for (const tr of fx.trails) {
    const a = 0.4 * (1 - tr.t / 220)
    for (const [x, y] of cellsOf(tr.piece)) {
      const grad = ctx.createLinearGradient(0, y * C, 0, (y + tr.d) * C)
      grad.addColorStop(0, 'rgba(255,255,255,0)')
      grad.addColorStop(1, COLORS[tr.piece.type])
      ctx.globalAlpha = a
      ctx.fillStyle = grad
      ctx.fillRect(BX + x * C + 2, y * C, C - 4, tr.d * C)
    }
    ctx.globalAlpha = 1
  }

  // Ghost (gray rim, black core) + active piece
  if (g.piece) {
    const ghost = { ...g.piece, y: g.piece.y + dropDistance(g.board, g.piece) }
    for (const [x, y] of cellsOf(ghost)) mino(BX + x * C, y * C, C, '#2a2a29', 1, '#050403')
    for (const [x, y] of cellsOf(g.piece)) mino(BX + x * C, y * C, C, COLORS[g.piece.type])
  }

  // Lock flash
  if (fx.lockFlash) {
    ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - fx.lockFlash.t / 160)})`
    for (const [x, y] of cellsOf(fx.lockFlash.piece)) ctx.fillRect(BX + x * C, y * C, C, C)
  }

  // Line clear flashes
  for (const f of fx.flashes) {
    const k = f.t / 300
    const grow = C * 0.4 * k
    ctx.fillStyle = `rgba(255,255,255,${0.85 * (1 - k)})`
    ctx.fillRect(BX, f.y * C - grow, BW, C + grow * 2)
  }

  // Frame: left wall, board/meter divider, right wall, floor
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(BX, VY); ctx.lineTo(BX, VY + BH + 1)
  ctx.lineTo(NX, VY + BH + 1); ctx.lineTo(NX, VY)
  ctx.moveTo(BX + BW + 1, VY); ctx.lineTo(BX + BW + 1, VY + BH)
  ctx.stroke()

  // Incoming garbage meter: red = ready to rise, orange = still arriving
  let my = VY + BH
  for (const a of g.incoming) {
    const h = Math.min(a.n * C, my - VY)
    my -= h
    ctx.fillStyle = ready(a) ? '#e0331b' : '#e2791c'
    ctx.fillRect(BX + BW + 3, my, METER_W - 4, h)
  }
  if (g.incoming.length) {
    ctx.beginPath()
    ctx.moveTo(BX + BW + 3, my); ctx.lineTo(BX + BW + 1 + METER_W / 2, my - C * 0.45); ctx.lineTo(NX - 1, my)
    ctx.fill()
  }

  for (const p of fx.particles) {
    ctx.globalAlpha = Math.max(0, p.life)
    ctx.fillStyle = p.color
    ctx.fillRect(p.x, p.y, p.s, p.s)
  }
  ctx.globalAlpha = 1

  // Countdown 3-2-1 / GO!
  const label = g.countdown > 0 ? String(Math.ceil(g.countdown / 1000)) : g.go > 0 ? 'GO!' : ''
  if (label) {
    const k = g.countdown > 0 ? 1 - (g.countdown % 1000) / 1000 : 1 - g.go / 600
    ctx.globalAlpha = g.countdown > 0 ? Math.min(1, (1 - k) * 2.5) : 1 - k
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${C * (label === 'GO!' ? 3 : 4.2) * (1.25 - 0.25 * Math.min(1, k * 3))}px ${FONT}`
    ctx.fillText(label, BX + BW / 2, VY + BH * 0.42)
    ctx.globalAlpha = 1
  }
  ctx.restore()

  // Hold (attached to the board's left wall)
  panel(0, VY, HOLD_W, 4 * C, 'HOLD', false)
  if (g.hold) drawPiece(g.hold, HOLD_W / 2, VY + 2.45 * C, C, g.canHold ? 1 : 0.3)

  // Next
  panel(NX, VY, NEXT_W, 15.8 * C, 'NEXT', true)
  g.queue.slice(0, 5).forEach((t, i) => drawPiece(t, NX + NEXT_W / 2, VY + 2.4 * C + i * 2.95 * C, C, 1))

  // Action texts (left of the board, newest on top)
  const tx = BX - 0.3 * C
  fx.texts.slice().reverse().forEach((t, i) => {
    const pop = t.t < 120 ? 0.7 + 0.3 * (t.t / 120) : 1
    ctx.globalAlpha = Math.max(0, t.t > 1200 ? 1 - (t.t - 1200) / 400 : 1)
    ctx.fillStyle = t.color
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${C * 0.7 * t.scale * pop}px ${FONT}`
    ctx.fillText(t.str, tx, VY + 6.4 * C + i * C * 1.05)
  })
  ctx.globalAlpha = 1

  // Stats (bottom-left, TIME sits on the floor line like tetr.io)
  const s = g.time / 1000
  const floor = VY + BH - 2
  stat('PIECES', `${g.pieces}`, `, ${g.time ? (g.pieces / s).toFixed(2) : '0.00'}/S`, tx, floor - 4.6 * C, 'right')
  if (g.opp) {
    stat('ATTACK', `${g.attack}`, `, ${g.time ? ((g.attack / s) * 60).toFixed(2) : '0.00'}/M`, tx, floor - 6.9 * C, 'right')
  }
  stat('LINES', `${g.lines}`, '', tx, floor - 2.3 * C, 'right')
  stat('TIME', `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`, `.${String(Math.floor(g.time % 1000)).padStart(3, '0')}`, tx, floor, 'right')

  const rx = NX + 0.15 * C
  if (g.mode === 'zen') {
    stat('SCORE', g.score.toLocaleString(), '', rx, floor - 2.3 * C, 'left')
    stat('LEVEL', `${level()}`, '', rx, floor, 'left')
  } else if (g.boss) {
    drawBoss(rx, floor)
  } else {
    stat('LESSON', `${lessonIdx.value + 1}`, `/${LESSONS.length}`, rx, floor - 2.3 * C, 'left')
    ctx.fillStyle = '#fff'
    ctx.font = `700 ${C * 0.62}px ${FONT}`
    ctx.fillText(lesson.value.name.toUpperCase(), rx, floor)
  }
}

// Boss HP bar + next-attack timer + floating damage numbers, under NEXT
function drawBoss(x, floor) {
  const b = g.boss, w = NEXT_W - 0.3 * C, y = VY + 16.9 * C, h = 0.5 * C
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = b.color
  ctx.font = `700 ${C * 0.6}px ${FONT}`
  ctx.fillText(spaced(`BOSS ${b.name}`), x, y - 0.25 * C)
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = fx.bossFlash > 0 ? '#fff' : b.color
  ctx.fillRect(x, y, (w * g.bossHp) / b.hp, h)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1.5
  ctx.strokeRect(x, y, w, h)
  ctx.fillStyle = '#e2791c'
  ctx.fillRect(x, y + 0.68 * C, w * Math.min(1, g.oppT / b.every), 0.12 * C)
  stat('HP', `${g.bossHp}`, `/${b.hp}`, x, floor, 'left')
  for (const hit of fx.hits) {
    ctx.globalAlpha = 1 - hit.t / 900
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'right'
    ctx.font = `700 ${C * 0.95}px ${FONT}`
    ctx.fillText(`-${hit.n}`, x + w, y - 0.3 * C - hit.t * 0.03)
  }
  ctx.globalAlpha = 1
}

// ---------- input ----------
function onKeyDown(e) {
  const a = KEYS[e.code]
  if (!a || ((e.ctrlKey || e.metaKey) && !e.code.startsWith('Control'))) return
  e.preventDefault()
  if (e.repeat) return
  if (a === 'reset') return newGame()
  if (a === 'pause') return togglePause()
  if (a === 'next') return status.value === 'win' && (mode.value === 'boss' ? pickBoss(bossIdx.value + 1) : pickLesson(lessonIdx.value + 1))
  if (status.value !== 'playing' || !g.piece) return
  if (a === 'left' || a === 'right') {
    const d = a === 'left' ? -1 : 1
    held[a] = true
    Object.assign(das, { dir: d, t: 0, arr: 0 })
    shift(d)
  } else if (a === 'soft') {
    held.soft = true
    g.gravT = 0
    stepDown()
  } else if (a === 'hard') hardDrop()
  else if (a === 'cw') turn(1)
  else if (a === 'ccw') turn(3)
  else if (a === '180') turn(2)
  else if (a === 'hold') hold()
}

function onKeyUp(e) {
  const a = KEYS[e.code]
  if (a === 'soft') held.soft = false
  if (a !== 'left' && a !== 'right') return
  held[a] = false
  const other = a === 'left' ? 'right' : 'left'
  Object.assign(das, { dir: held[other] ? (other === 'left' ? -1 : 1) : 0, t: 0, arr: 0 })
}

function onBlur() {
  Object.assign(held, { left: false, right: false, soft: false })
  das.dir = 0
  if (status.value === 'playing') status.value = 'paused'
}

onMounted(() => {
  const dpr = window.devicePixelRatio || 1
  canvas.value.width = CW * dpr
  canvas.value.height = CH * dpr
  ctx = canvas.value.getContext('2d')
  ctx.scale(dpr, dpr)
  newGame()
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
  last = performance.now()
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(failTimer)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', onBlur)
})
</script>
