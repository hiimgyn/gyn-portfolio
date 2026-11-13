<template>
  <WindowFrame :title="title">
    <div class="grid gap-4 p-4 sm:grid-cols-[1fr_1fr] sm:p-5">
      <pre class="min-w-0 overflow-hidden rounded-lg border border-[#262F4D] bg-[#070A14] p-3 font-mono text-[10.5px] leading-[1.6] text-[#C3C9DB]"><template v-for="(l, i) in JSON_LINES" :key="i"><span v-for="(t, j) in l" :key="j" :class="t[0]">{{ t[1] }}</span>{{ '\n' }}</template></pre>
      <div class="min-w-0">
        <div class="flex items-center justify-between">
          <p class="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6F7894]">{{ $t('work.vbook.mock.installed') }}</p>
          <span class="rounded-full bg-[#38BDF8]/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#38BDF8]">vi_VN</span>
        </div>
        <ul class="mt-2.5 space-y-1.5">
          <li v-for="s in SOURCES" :key="s.name" class="flex items-center gap-2.5 rounded-xl border border-[#262F4D] bg-[#141B33] px-2.5 py-2">
            <span class="grid size-7 shrink-0 place-items-center rounded-lg font-display text-[12px] font-extrabold" :style="{ background: `${TYPE[s.type]}22`, color: TYPE[s.type] }">{{ s.name[0] }}</span>
            <span class="min-w-0 flex-1 truncate text-[12px] text-[#E7EAF3]">{{ s.name }}</span>
            <span class="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold" :style="{ background: `${TYPE[s.type]}22`, color: TYPE[s.type] }">{{ s.type }}</span>
            <span class="w-6 text-right font-mono text-[10px] text-[#6F7894]">v{{ s.v }}</span>
          </li>
        </ul>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup>
import WindowFrame from '@/components/common/WindowFrame.vue'
defineProps({ title: { type: String, required: true } })

const TYPE = { novel: '#8B8EF7', comic: '#38BDF8', tts: '#FBBF24' }
// Neutral sources only, versions as in the repo's plugin.json / tts.json.
const SOURCES = [
  { name: 'Truyện Full', type: 'novel', v: 8 },
  { name: 'MangaDex', type: 'comic', v: 4 },
  { name: 'Truyện QQ', type: 'comic', v: 8 },
  { name: 'TruyenDich.AI', type: 'novel', v: 3 },
  { name: 'Google TTS', type: 'tts', v: 1 },
  { name: 'Gemini TTS', type: 'tts', v: 1 }
]
const K = 'text-[#8B8EF7]', S = 'text-[#34D399]', N = 'text-[#F2AD40]', P = 'text-[#6F7894]'
const JSON_LINES = [
  [[P, '{']],
  [[P, '  '], [K, '"metadata"'], [P, ': {']],
  [[P, '    '], [K, '"name"'], [P, ': '], [S, '"Truyện Full"'], [P, ',']],
  [[P, '    '], [K, '"version"'], [P, ': '], [N, '8'], [P, ',']],
  [[P, '    '], [K, '"type"'], [P, ': '], [S, '"novel"'], [P, ',']],
  [[P, '    '], [K, '"locale"'], [P, ': '], [S, '"vi_VN"']],
  [[P, '  },']],
  [[P, '  '], [K, '"script"'], [P, ': {']],
  [[P, '    '], [K, '"home"'], [P, ': '], [S, '"home.js"'], [P, ',']],
  [[P, '    '], [K, '"search"'], [P, ': '], [S, '"search.js"'], [P, ',']],
  [[P, '    '], [K, '"detail"'], [P, ': '], [S, '"detail.js"'], [P, ',']],
  [[P, '    '], [K, '"toc"'], [P, ': '], [S, '"toc.js"'], [P, ',']],
  [[P, '    '], [K, '"chap"'], [P, ': '], [S, '"chap.js"']],
  [[P, '  }']],
  [[P, '}']]
]
</script>
