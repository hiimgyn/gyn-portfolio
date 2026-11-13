<template>
  <router-link to="/" :class="`flex items-center gap-2.5 rounded-lg ${focus}`" @click="$emit('navigate')">
    <!-- brand mark: black 8-bit cat on the indigo tile, same geometry as assets/favicon/favicon.svg -->
    <svg viewBox="6 6 88 88" aria-hidden="true" class="size-8">
      <rect x="6" y="6" width="88" height="88" rx="22" fill="#5B5FEF" />
      <g shape-rendering="crispEdges">
        <rect v-for="c in cells" :key="c.k" :x="c.x" :y="c.y" width="6.6" height="6.6" :fill="c.fill" />
      </g>
    </svg>
    <span class="font-display text-lg font-extrabold text-white">gyn nguyen</span>
  </router-link>
</template>

<script setup>
import { focus } from '@/ui'
defineEmits(['navigate'])

const CAT = ['.X.......X.', '.XX.....XX.', '.XXX...XXX.', '.XXXXXXXXX.', 'XXOOXXXOOXX', 'XXOOXXXOOXX', 'XXXXXPXXXXX', 'XXXXXXXXXXX', '.XXXXXXXXX.']
const FILL = { X: '#15171F', O: '#FBBF24', P: '#FB7185' }
const cells = CAT.flatMap((row, y) => [...row].flatMap((ch, x) => (ch === '.' ? [] : [{ k: `${x}-${y}`, x: 14.8 + x * 6.4, y: 21 + y * 6.4, fill: FILL[ch] }])))
</script>
