// Pure Tetris engine: SRS rotation (+ tetr.io-style 180 kicks), 7-bag, T-spin detection, line clears.
// Board is H rows x W cols, row 0 = top. The top HIDDEN rows are the spawn buffer above the visible field.
export const W = 10
export const H = 22
export const HIDDEN = 2

export const COLORS = {
  // Sampled from tetr.io's default skin (outer face color of each mino)
  I: '#3cbd8e', O: '#c2a940', T: '#b04aa6', S: '#90c040',
  Z: '#c4424a', J: '#6850e2', L: '#c27040', G: '#4e4e4e'
}

const SHAPES = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
}

// SRS states are exactly the clockwise matrix rotations of the bounding box
const rotCW = (m) => m[0].map((_, i) => m.map((row) => row[i]).reverse())
export const CELLS = {}
for (const [type, shape] of Object.entries(SHAPES)) {
  CELLS[type] = []
  let m = shape
  for (let r = 0; r < 4; r++) {
    CELLS[type].push(m.flatMap((row, y) => row.flatMap((v, x) => (v ? [[x, y]] : []))))
    m = rotCW(m)
  }
}

// Kick tables below are written y-up (as on the wiki); flipped to y-down when used
const JLSTZ_OFFSETS = [
  [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
  [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
]
const I_KICKS = {
  '01': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '10': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '12': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  '21': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '23': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '32': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '30': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '03': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
}
const KICKS_180 = {
  '02': [[0, 0], [0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]],
  '20': [[0, 0], [0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0]],
  '13': [[0, 0], [1, 0], [1, 2], [1, 1], [0, 2], [0, 1]],
  '31': [[0, 0], [-1, 0], [-1, 2], [-1, 1], [0, 2], [0, 1]]
}

function kicks(type, from, to) {
  if (type === 'O') return [[0, 0]]
  if ((to - from + 4) % 4 === 2) return KICKS_180[`${from}${to}`]
  if (type === 'I') return I_KICKS[`${from}${to}`]
  return JLSTZ_OFFSETS[from].map(([x, y], i) => [x - JLSTZ_OFFSETS[to][i][0], y - JLSTZ_OFFSETS[to][i][1]])
}

export const emptyBoard = () => Array.from({ length: H }, () => Array(W).fill(null))

// Rows given top-to-bottom ('.' empty, any letter = mino of that color), stacked on the floor
export function parseBoard(rows) {
  const board = emptyBoard()
  rows.forEach((row, i) => {
    const y = H - rows.length + i
    ;[...row].forEach((c, x) => { board[y][x] = c === '.' ? null : c })
  })
  return board
}

const solid = (board, x, y) => x < 0 || x >= W || y >= H || (y >= 0 && !!board[y][x])

export const collides = (board, { type, r, x, y }) =>
  CELLS[type][r].some(([cx, cy]) => solid(board, x + cx, y + cy))

export const spawnPiece = (type) => ({ type, r: 0, x: type === 'O' ? 4 : 3, y: 0 })

// dir: 1 = CW, 3 = CCW, 2 = 180. Returns the kicked piece (with tst flag) or null.
export function rotate(board, piece, dir) {
  const to = (piece.r + dir) % 4
  const table = kicks(piece.type, piece.r, to)
  for (let i = 0; i < table.length; i++) {
    const next = { ...piece, r: to, x: piece.x + table[i][0], y: piece.y - table[i][1] }
    if (!collides(board, next)) return { piece: next, tst: dir !== 2 && i === 4 }
  }
  return null
}

export function dropDistance(board, piece) {
  let d = 0
  while (!collides(board, { ...piece, y: piece.y + d + 1 })) d++
  return d
}

// 3-corner rule. Call only when the last successful action was a rotation.
export function spinType(board, { type, r, x, y }, tst) {
  if (type !== 'T') return null
  const cx = x + 1, cy = y + 1
  const c = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy]) => solid(board, cx + dx, cy + dy)) // TL TR BR BL
  if (c.filter(Boolean).length < 3) return null
  const [a, b] = [[0, 1], [1, 2], [2, 3], [3, 0]][r] // the two corners the T points at
  return (c[a] && c[b]) || tst ? 'full' : 'mini'
}

// Mutates board. Returns cleared rows (with their old contents, for effects) and perfect-clear flag.
export function lockPiece(board, piece) {
  for (const [cx, cy] of CELLS[piece.type][piece.r]) {
    if (piece.y + cy >= 0) board[piece.y + cy][piece.x + cx] = piece.type
  }
  const cleared = []
  for (let y = 0; y < H; y++) {
    if (board[y].every(Boolean)) cleared.push({ y, cells: board[y] })
  }
  for (const { y } of cleared) {
    board.splice(y, 1)
    board.unshift(Array(W).fill(null))
  }
  return { lines: cleared.length, cleared, pc: cleared.length > 0 && board.every((row) => row.every((c) => !c)) }
}

export function actionName(lines, spin) {
  const n = ['', 'SINGLE', 'DOUBLE', 'TRIPLE', 'QUAD'][lines]
  if (spin) return [spin === 'mini' ? 'T-SPIN MINI' : 'T-SPIN', n].filter(Boolean).join(' ')
  return n
}

export function* bag() {
  for (;;) {
    const b = [...'IJLOSTZ']
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[b[i], b[j]] = [b[j], b[i]]
    }
    yield* b
  }
}

// Every reachable lock (BFS over moves/rotations from spawn). Used to verify lessons are solvable.
export function placements(board, type) {
  const start = { ...spawnPiece(type), rot: 0 }
  const seen = new Set()
  const queue = [start]
  const out = []
  const key = (p) => `${p.x},${p.y},${p.r},${p.rot}`
  seen.add(key(start))
  while (queue.length) {
    const p = queue.shift()
    if (collides(board, { ...p, y: p.y + 1 })) {
      const b = board.map((row) => [...row])
      const spin = p.rot ? spinType(b, p, p.rot === 2) : null
      out.push({ board: b, spin, ...lockPiece(b, p) })
    }
    const nexts = [-1, 1].map((dx) => ({ ...p, x: p.x + dx, rot: 0 }))
    nexts.push({ ...p, y: p.y + 1, rot: 0 })
    for (const dir of [1, 2, 3]) {
      const res = rotate(board, p, dir)
      if (res) nexts.push({ ...res.piece, rot: res.tst ? 2 : 1 })
    }
    for (const n of nexts) {
      if (collides(board, n) || seen.has(key(n))) continue
      seen.add(key(n))
      queue.push(n)
    }
  }
  return out
}

// Can `goal` be met with this queue (hold allowed)?
export function solvable(board, queue, goal, held = null) {
  const [cur, ...rest] = queue
  if (!cur) return false
  const options = [[cur, rest, held]]
  if (held) options.push([held, rest, cur])
  else if (rest.length) options.push([rest[0], rest.slice(1), cur])
  return options.some(([type, remaining, h]) =>
    placements(board, type).some((res) => goal(res) || solvable(res.board, remaining, goal, h))
  )
}

export const LESSONS = [
  {
    id: 'tss', name: 'T-Spin Single', queue: 'T',
    goal: (r) => r.spin === 'full' && r.lines === 1,
    board: ['GGGG......', 'GGG...GGGG', 'GGGG.GGG.G']
  },
  {
    id: 'tsd', name: 'T-Spin Double', queue: 'T',
    goal: (r) => r.spin === 'full' && r.lines === 2,
    board: ['GGGG......', 'GGG...GGGG', 'GGGG.GGGGG', 'GGGGGG.GGG']
  },
  {
    id: 'tst', name: 'T-Spin Triple', queue: 'T',
    goal: (r) => r.spin === 'full' && r.lines === 3,
    board: ['GGG.......', 'GG........', 'GG.GGGGGGG', 'GG..GGGGGG', 'GG.GGGGGGG', 'GGGGG.GGGG']
  },
  {
    id: 'mini', name: 'T-Spin Mini', queue: 'T',
    goal: (r) => r.spin === 'mini' && r.lines === 1,
    board: ['.GGGGGGGGG', 'GGGGG.GGGG']
  },
  {
    id: 'quad', name: 'Quad', queue: 'OI',
    goal: (r) => r.lines === 4,
    board: ['GGGGGGGGG.', 'GGGGGGGGG.', 'GGGGGGGGG.', 'GGGGGGGGG.']
  },
  {
    id: 'pc', name: 'Perfect Clear', queue: 'LJ',
    goal: (r) => r.pc,
    board: ['GGGG......', 'GGGG.GGGG.']
  }
]

// ---------- Garbage (tetr.io VS rules) ----------
export const GARBAGE_CAP = 8 // max rows that can rise per placed piece

// Lines sent for a clear. Combo multiplies (+25% per combo); 0-attack clears still send a little on long combos.
export function attackFor(lines, spin, b2b, combo, pc) {
  if (!lines) return 0
  const base = spin === 'full' ? [0, 2, 4, 6][lines] : spin === 'mini' ? [0, 0, 1][lines] : [0, 0, 1, 2, 4][lines]
  const withB2b = base + (b2b > 0 ? 1 : 0)
  const atk = withB2b > 0 ? withB2b * (1 + 0.25 * combo) : combo >= 2 ? Math.log1p(combo * 1.25) : 0
  return Math.floor(atk) + (pc ? 10 : 0)
}

// Push `n` gray rows with a hole at column `hole` in from the bottom. Returns true if blocks were pushed off the top.
export function addGarbage(board, n, hole) {
  let toppedOut = false
  for (let i = 0; i < n; i++) {
    if (board[0].some(Boolean)) toppedOut = true
    board.shift()
    board.push(Array.from({ length: W }, (_, x) => (x === hole ? null : 'G')))
  }
  return toppedOut
}
