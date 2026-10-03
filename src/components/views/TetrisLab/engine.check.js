// Run: node src/components/views/TetrisLab/engine.check.js
import assert from 'node:assert'
import { LESSONS, parseBoard, solvable, rotate, emptyBoard, spawnPiece, CELLS, attackFor, addGarbage, H } from './engine.js'

for (const type of Object.keys(CELLS)) assert.equal(CELLS[type].every((s) => s.length === 4), true, type)
// four CW rotations in open space return to spawn state
let p = { ...spawnPiece('T'), y: 10 }
for (let i = 0; i < 4; i++) p = rotate(emptyBoard(), p, 1).piece
assert.deepEqual(p, { ...spawnPiece('T'), y: 10 })

for (const l of LESSONS) {
  assert.ok(solvable(parseBoard(l.board), [...l.queue], l.goal), `lesson ${l.id} not solvable`)
}
// lessons must actually require the technique: no T-spin = no clear for the spin lessons
assert.ok(!solvable(parseBoard(LESSONS[1].board), ['T'], (r) => !r.spin && r.lines === 2), 'tsd solvable without spin')
// attack table
assert.equal(attackFor(1, null, -1, 0, false), 0)
assert.equal(attackFor(4, null, 0, 0, false), 4)
assert.equal(attackFor(2, 'full', 1, 0, false), 5) // TSD + B2B
assert.equal(attackFor(2, null, -1, 2, false), 1) // double, 2 combo: 1 * 1.5
assert.equal(attackFor(1, null, -1, 4, false), 1) // single on 4 combo: floor(ln 6)
// garbage rises from the bottom with one hole
const gb = parseBoard(['TTT.......'])
assert.equal(addGarbage(gb, 2, 3), false)
assert.deepEqual(gb[H - 3].slice(0, 4), ['T', 'T', 'T', null])
assert.equal(gb[H - 1][3], null)
assert.equal(gb[H - 1].filter(Boolean).length, 9)
console.log('engine ok')
