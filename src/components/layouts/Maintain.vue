<template>
  <div
    class="min-h-[calc(100vh-4rem-4rem)] flex items-center justify-center px-4 py-12"
    :class="isDark ? colors.dark.text.primary : colors.light.text.primary"
  >
    <div
      class="w-full max-w-xl p-8 sm:p-12 rounded-3xl border text-center space-y-6 shadow-xl relative overflow-hidden backdrop-blur-xl"
      :class="[
        isDark 
          ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
      ]"
    >
      <!-- Visual 404 Graphic -->
      <div class="relative w-36 h-36 mx-auto flex items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-violet-500/10 animate-ping"></div>
        <div class="w-24 h-24 rounded-2xl bg-violet-600/10 border border-violet-400/30 flex items-center justify-center text-3xl font-mono font-extrabold text-violet-400 shadow-inner">
          404
        </div>
      </div>

      <!-- Text Content -->
      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
          {{ $t('maintain.title') }}
        </h1>
        <p class="text-sm sm:text-base leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
          {{ $t('maintain.description') }}
        </p>
        <p class="text-xs sm:text-sm font-mono text-slate-400">
          {{ $t('maintain.returnLater') }}
        </p>
      </div>

      <!-- Actions -->
      <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-violet-600 text-white hover:bg-violet-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(139,92,246,0.35)] transform hover:-translate-y-0.5 active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{{ $t('maintain.backToHome') }}</span>
        </router-link>

        <router-link
          to="/about"
          class="px-5 py-3 rounded-xl font-semibold text-sm border transition-all duration-200"
          :class="isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'"
        >
          {{ $t('about.portfolio') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'

const store = useStore()
const isDark = computed(() => store.isDark)
</script>
