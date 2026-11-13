<template>
  <WindowFrame :title="title">
    <div class="grid gap-4 p-4 text-[12px] sm:grid-cols-[0.95fr_1.05fr] sm:p-5">
      <div class="min-w-0">
        <p class="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6F7894]">{{ $t('work.viethoa.mock.workflow') }}</p>
        <ol class="mt-2.5 space-y-1.5">
          <li v-for="i in 8" :key="i" class="flex items-start gap-2.5 rounded-lg border px-2.5 py-1.5"
            :class="i === 4 ? 'border-[#FBBF24]/40 bg-[#FBBF24]/[0.07]' : 'border-[#262F4D] bg-[#141B33]'">
            <span class="mt-px font-mono text-[10px] font-semibold" :class="i === 4 ? 'text-[#FBBF24]' : 'text-[#8B8EF7]'">{{ String(i).padStart(2, '0') }}</span>
            <span class="leading-snug text-[#E7EAF3]">
              {{ $t(`work.viethoa.mock.steps.${i - 1}`) }}
              <span v-if="i === 4" class="mt-0.5 block text-[11px] text-[#FBBF24]">{{ $t('work.viethoa.mock.stop') }}</span>
            </span>
          </li>
        </ol>
      </div>
      <div class="flex min-w-0 flex-col gap-4">
        <div>
          <p class="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6F7894]">{{ $t('work.viethoa.mock.matrix') }}</p>
          <table class="mt-2.5 w-full overflow-hidden rounded-lg border border-[#262F4D] text-left">
            <thead class="bg-[#141B33] text-[10px] uppercase tracking-wider text-[#8F98B5]">
              <tr><th class="px-2.5 py-1.5 font-medium">{{ $t('work.viethoa.mock.pair') }}</th><th class="px-2.5 py-1.5 font-medium">{{ $t('work.viethoa.mock.pronouns') }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in MATRIX" :key="r[1]" class="border-t border-[#262F4D]">
                <td class="px-2.5 py-1.5 text-[#C3C9DB]">{{ $t(`work.viethoa.mock.pairs.${i}`) }}</td>
                <td class="px-2.5 py-1.5 font-mono text-[#E7EAF3]">{{ r[1] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="min-w-0 flex-1 rounded-lg border border-[#262F4D] bg-[#070A14] p-3 font-mono text-[10.5px] leading-relaxed">
          <p class="text-[#8F98B5]"><span class="text-[#34D399]">$</span> python validate_game_text.py --source en.json --target vi.json</p>
          <p v-for="l in RUN" :key="l[1]" class="mt-1.5 break-words">
            <span class="mr-2" :class="l[0] === 'ERROR' ? 'text-[#F2546B]' : 'text-[#F2AD40]'">{{ l[0] }}</span>
            <span class="mr-2 text-[#8B8EF7]">{{ l[1] }}</span>
            <span class="text-[#C3C9DB]">{{ l[2] }}</span>
          </p>
          <p class="mt-1.5 text-[#8F98B5]">3 chuỗi · 1 error · 1 warning</p>
        </div>
      </div>
    </div>
  </WindowFrame>
</template>

<script setup>
import WindowFrame from '@/components/common/WindowFrame.vue'
defineProps({ title: { type: String, required: true } })

// Pronoun pairs follow references/xung-ho.md; the run is the validator's real output on a 3-string sample.
const MATRIX = [['master', 'ta – con'], ['disciple', 'con – sư phụ'], ['enemies', 'ta – ngươi']]
const RUN = [
  ['ERROR', 'PH001', "greet: placeholder không khớp với nguồn | thiếu ['{player}']; thừa ['{name}']"],
  ['WARNING', 'SPC001', "menu.save: khoảng trắng kép | 'u  l'"]
]
</script>
