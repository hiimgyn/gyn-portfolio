<!-- src/components/utility/ThemeLangSwitcher.vue -->
<template>
  <div :class="[
    'fixed right-4 bottom-4',
    'md:top-1/2 md:bottom-auto md:-translate-y-1/2',
    'flex flex-col items-center space-y-3.5 p-2 rounded-2xl z-50 border transition-all duration-200 backdrop-blur-xl',
    isDark 
      ? 'bg-[#111625]/90 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.4)]' 
      : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(15,23,42,0.06)]',
    'opacity-80 hover:opacity-100 hover:scale-105'
  ]" aria-label="Theme and Language Switcher">
    <!-- Language Switcher -->
    <div class="relative group">
      <div ref="flipContainer" class="w-7 h-7 rounded-lg overflow-hidden cursor-pointer shadow-xs border"
        :class="[
          isDark ? 'border-white/10' : 'border-slate-200',
          { 'pointer-events-none': isAnimating }
        ]" style="perspective: 1000px;"
        @click="switchLanguageWithAnimation">
        <img ref="flagImg" :src="currentFlag" alt="current-flag" class="w-full h-full object-cover rounded-lg"
          style="transform-style: preserve-3d; backface-visibility: hidden;" />
      </div>
      <!-- Tooltip -->
      <div :class="[
        'absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg whitespace-nowrap text-xs font-mono font-medium shadow-md border pointer-events-none',
        isDark ? 'bg-[#111625] border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
      ]">
        {{ $t('nav.switchLanguage') }}
      </div>
    </div>

    <!-- Theme Toggle -->
    <div class="relative group">
      <button @click="toggleTheme" :aria-label="$t('nav.toggleTheme')" :class="[
        'w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 border',
        isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-amber-300' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700',
        isThemeChanging ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
      ]" :disabled="isThemeChanging">
        <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm4.22 2.22a1 1 0 0 1 1.415 1.415l-.707.707a1 1 0 1 1-1.414-1.414l.706-.708zM18 9a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1zm-2.22 6.78a1 1 0 0 1 0 1.414l-.708.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.415 0zM10 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-4.22-1.22a1 1 0 0 1 .707.293l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 .707-1.707zm-2.78-4.56a1 1 0 0 1 1 1H3a1 1 0 1 1 0-2h1zm2.22-6.78a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zM10 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
            clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-300" viewBox="0 0 20 20"
          fill="currentColor">
          <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707 8.06 8.06 0 0 0 10 18a8.06 8.06 0 0 0 7.293-4.707z" />
        </svg>
      </button>
      <!-- Theme Tooltip -->
      <div :class="[
        'absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg whitespace-nowrap text-xs font-mono font-medium shadow-md border pointer-events-none',
        isDark ? 'bg-[#111625] border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800',
        'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
      ]">
        {{ isDark ? $t('nav.toggleLight') : $t('nav.toggleDark') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { useStore } from '@/stores/theme'

import flagEn from '@/assets/Flags/us.svg'
import flagVi from '@/assets/Flags/vn.svg'

const { locale } = useI18n({ useScope: 'global' })
const store = useStore()

const isDark = computed(() => store.isDark)
const isThemeChanging = ref(false)

const toggleTheme = () => {
  if (isThemeChanging.value) return

  isThemeChanging.value = true
  store.toggleTheme()

  setTimeout(() => {
    isThemeChanging.value = false
  }, 500)
}

onMounted(() => {
  store.initTheme()
})

const currentFlag = computed(() => {
  return locale.value === 'en' ? flagVi : flagEn
})

const flipContainer = ref(null)
const flagImg = ref(null)
const isAnimating = ref(false)

const switchLanguageWithAnimation = () => {
  if (isAnimating.value || !flagImg.value) {
    return
  }

  isAnimating.value = true
  const newLocale = locale.value === 'en' ? 'vi' : 'en'

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating.value = false
    }
  })

  tl.to(flagImg.value, {
    rotateY: 90,
    duration: 0.2,
    ease: 'power1.in',
    onComplete: () => {
      locale.value = newLocale
      localStorage.setItem('locale', newLocale)
      gsap.set(flagImg.value, { rotateY: -90 })
    }
  }).to(flagImg.value, {
    rotateY: 0,
    duration: 0.25,
    ease: 'power1.out'
  })
}
</script>