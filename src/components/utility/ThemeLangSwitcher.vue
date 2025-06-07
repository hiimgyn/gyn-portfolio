<!-- src/components/utility/ThemeLangSwitcher.vue -->
<template>
  <div
    :class="[
      'fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4 p-2 rounded-lg z-50',
      isDark ? colors.dark.background.secondary : colors.light.background.secondary,
      'opacity-50 hover:opacity-100 transition-opacity duration-200 backdrop-blur-md'
    ]"
    aria-label="Theme and Language Switcher"
  >
    <!-- Language Switcher -->
    <div class="relative group">
      <div
        ref="flipContainer"
        class="w-6 h-6 rounded-md overflow-hidden cursor-pointer"
        :class="{ 'pointer-events-none': isAnimating }"
        style="perspective: 1000px;"
        @click="switchLanguageWithAnimation"
      >
        <img
          ref="flagImg"
          :src="currentFlag"
          alt="current-flag"
          class="w-full h-full object-cover rounded-md"
          style="transform-style: preserve-3d; backface-visibility: hidden;"
        />
      </div>
      <!-- Tooltip -->
      <div :class="[
        'absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md whitespace-nowrap text-xs',
        isDark ? colors.dark.background.tertiary : colors.light.background.tertiary,
        isDark ? colors.dark.text.primary : colors.light.text.primary,
        'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
      ]">
        {{ $t('nav.switchLanguage') }}
        <div :class="[
          'absolute top-1/2 -translate-y-1/2 right-[-4px] w-0 h-0 border-[4px] border-transparent',
          isDark ? 'border-l-gray-800' : 'border-l-gray-100'
        ]">
        </div>
      </div>
    </div>

    <!-- Theme Toggle -->
    <div class="relative group">
      <button
        @click="toggleTheme"
        :aria-label="$t('nav.toggleTheme')"
        :class="[
          'w-6 h-6 flex items-center justify-center rounded-md transition-colors duration-200',
          isDark ? colors.dark.background.tertiary : colors.light.background.tertiary,
          isDark ? colors.dark.background.hover : colors.light.background.hover,
          isThemeChanging ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        :disabled="isThemeChanging"
      >
        <svg
          v-if="!isDark"
          xmlns="http://www.w3.org/2000/svg"
          :class="[
            'h-4 w-4',
            colors.light.text.primary
          ]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <!-- Icon mặt trời -->
          <path
            fill-rule="evenodd"
            d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm4.22 2.22a1 1 0 0 1 1.415 1.415l-.707.707a1 1 0 1 1-1.414-1.414l.706-.708zM18 9a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1zm-2.22 6.78a1 1 0 0 1 0 1.414l-.708.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.415 0zM10 16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-4.22-1.22a1 1 0 0 1 .707.293l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 .707-1.707zm-2.78-4.56a1 1 0 0 1 1 1H3a1 1 0 1 1 0-2h1zm2.22-6.78a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zM10 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-yellow-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <!-- Icon mặt trăng -->
          <path
            d="M17.293 13.293A8 8 0 0 1 6.707 2.707 8.06 8.06 0 0 0 10 18a8.06 8.06 0 0 0 7.293-4.707z"
          />
        </svg>
      </button>
      <!-- Theme Tooltip -->
      <div :class="[
        'absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md whitespace-nowrap text-xs',
        isDark ? colors.dark.background.tertiary : colors.light.background.tertiary,
        isDark ? colors.dark.text.primary : colors.light.text.primary,
        'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
      ]">
        {{ isDark ? $t('nav.toggleLight') : $t('nav.toggleDark') }}
        <div :class="[
          'absolute top-1/2 -translate-y-1/2 right-[-4px] w-0 h-0 border-[4px] border-transparent',
          isDark ? 'border-l-gray-800' : 'border-l-gray-100'
        ]">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { createTimeline } from 'animejs' 
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme' 

import flagEn from '@/assets/Flags/us.svg'
import flagVi from '@/assets/Flags/vn.svg'

const { locale } = useI18n({ useScope: 'global' })
const store = useStore()

// 3. Quản lý dark/light mode
const isDark = computed(() => store.isDark)

const isThemeChanging = ref(false)

const toggleTheme = () => {
  if (isThemeChanging.value) return
  
  isThemeChanging.value = true
  store.toggleTheme()
  
  // Khóa nút trong 500ms để tránh spam
  setTimeout(() => {
    isThemeChanging.value = false
  }, 500)
}

// Khởi tạo theme khi mount
onMounted(() => {
  store.initTheme()
})

const currentFlag = computed(() => {
  return locale.value === 'en' ? flagEn : flagVi
})

const flipContainer = ref(null)
const flagImg = ref(null)
const isAnimating = ref(false)

const switchLanguageWithAnimation = async () => {
  if (isAnimating.value || !flagImg.value) {
    return
  }
  
  isAnimating.value = true
  
  const newLocale = locale.value === 'en' ? 'vi' : 'en'

  try {
    const tl = createTimeline({
      defaults: {
        duration: 300,
        easing: 'easeInOutQuad'
      },
      complete: () => {
        isAnimating.value = false
      }
    })

    tl.add(flagImg.value, {
      rotateY: 90
    }, 0)

    tl.call(() => {
      locale.value = newLocale
      
      nextTick().then(() => {
        if (flagImg.value) {
          flagImg.value.style.transform = 'rotateY(-90deg)'
        }
      })
    }, 300)

    tl.add(flagImg.value, {
      rotateY: 0
    }, 350)

    setTimeout(() => {
      if (isAnimating.value) {
        isAnimating.value = false
      }
    }, 1000)

  } catch (error) {
    locale.value = newLocale
    if (flagImg.value) {
      flagImg.value.style.transform = 'rotateY(0deg)'
    }
    isAnimating.value = false
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.pointer-events-none {
  pointer-events: none;
}
</style>