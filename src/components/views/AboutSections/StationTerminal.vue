<template>
  <section id="station-terminal" class="space-y-4 scroll-mt-24">
    <!-- Station Header Strip -->
    <div class="flex items-center justify-between px-2 text-xs font-mono">
      <div class="flex items-center gap-2" :class="isDark ? 'text-emerald-400' : 'text-emerald-700'">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-bold tracking-wider">TERMINAL // SYSTEM LAUNCH & COLLABORATION HUB</span>
      </div>
      <span class="text-[10px] font-mono" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
        STATUS: READY_FOR_NEXT_SPRINT
      </span>
    </div>

    <!-- Terminal Action Card -->
    <div
      class="p-6 sm:p-10 rounded-3xl border transition-all duration-300 relative overflow-hidden group space-y-6"
      :class="[
        isDark 
          ? 'bg-gradient-to-br from-[#121524]/90 via-[#0e1122]/90 to-[#18112e]/90 border-white/[0.1] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-4px_rgba(0,0,0,0.6)]' 
          : 'bg-gradient-to-br from-white via-violet-50/40 to-purple-50/30 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_4px_20px_rgba(15,23,42,0.06)]'
      ]"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2 max-w-xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border backdrop-blur-md"
            :class="isDark ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>AVAILABLE FOR BUSINESS ANALYST OPPORTUNITIES</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
            Ready to Translate Complexity into High-Impact Software?
          </h2>
          <p class="text-sm leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
            Connect directly to discuss upcoming product initiatives, requirements architecture, or consulting engagements.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">

          <router-link
            to="/contact"
            class="px-5 py-3 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            :class="isDark 
              ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-violet-400' 
              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 hover:border-violet-500 shadow-xs'"
          >
            <EnvelopeIcon class="w-4 h-4 text-violet-400" />
            <span>{{ $t('hero.ctaContact') }}</span>
          </router-link>
        </div>
      </div>

      <!-- Quick Contact Strip -->
      <div class="pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
        :class="isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'"
      >
        <div class="flex flex-wrap items-center gap-4">
          <a :href="`mailto:${email}`" class="hover:text-violet-400 transition-colors flex items-center gap-1.5">
            <EnvelopeIcon class="w-4 h-4 text-amber-400" />
            <span>{{ email }}</span>
          </a>
          <span>•</span>
          <a :href="`tel:${phone}`" class="hover:text-violet-400 transition-colors flex items-center gap-1.5">
            <PhoneIcon class="w-4 h-4 text-emerald-400" />
            <span>{{ phone }}</span>
          </a>
          <span>•</span>
          <span class="flex items-center gap-1.5">
            <MapPinIcon class="w-4 h-4 text-rose-400" />
            <span>{{ $t('about.address') }}</span>
          </span>
        </div>

        <div class="text-[11px] text-slate-500">
          DOCUMENT_HASH: 0xBA_PROD_2026
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline'

const store = useStore()
const isDark = computed(() => store.isDark)

const email = 'nguyenminhhung.work@gmail.com'
const phone = '+84 942 451 385'
</script>
