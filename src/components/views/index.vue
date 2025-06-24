<template>
  <section class="relative min-h-[calc(100vh-4rem-4rem)] flex items-center overflow-hidden">
    <div
      class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center relative z-20 gap-8 md:gap-0">
      <!-- Left Content -->
      <div class="w-full md:w-1/2 space-y-6 text-center md:text-left">
        <!-- Greeting -->
        <p ref="greeting" :class="greetingClasses"
          class="text-base md:text-lg mb-8 transform transition-all duration-500 opacity-0 translate-y-4">
          <span class="inline-block">👋</span> {{ greetingText }}
        </p>

        <!-- Name và Accent line -->
        <div ref="nameContainer" class="relative inline-block">
          <h2 ref="name" :class="nameClasses" class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span ref="nameText" class="ml-2"></span>
          </h2>
          <!-- Accent line under name -->
          <div ref="accentLine" :class="accentLineClasses" class="absolute -bottom-2 left-0 h-1 opacity-0"></div>
        </div>

        <!-- Role -->
        <div ref="role" :class="roleClasses"
          class="text-xl sm:text-2xl lg:text-3xl mb-8 font-mono transform transition-all duration-500 opacity-0 translate-y-4 text-center">
          <div class="flex items-center justify-center md:justify-start">
            <span class="text-purple-400">&gt;</span>
            <span ref="roleText" class="ml-2 mr-2"></span>
          </div>
          <div class="flex items-center justify-center md:justify-start">
            <span class="text-purple-500">&gt;</span>
            <span ref="roleText2" class="ml-2 mr-2"></span>
          </div>
        </div>


        <!-- CTA Button -->
        <div ref="ctaContainer" class="transform transition-all duration-500 opacity-0 translate-y-4">
          <button ref="ctaButton" :class="ctaButtonClasses"
            class="group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            @click="navigateToPortfolio">
            <span class="relative z-10">{{ ctaText }}</span>
            <!-- Glow -->
            <div :class="glowClasses"
              class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl">
            </div>
            <!-- Arrow icon -->
            <svg class="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Right Content (3D Model + overlay) -->
      <div ref="rightContent"
        class="relative w-full md:w-2/3 h-[300px] md:h-[425px] transition-all duration-1000 opacity-0">
        <div class="absolute inset-0 z-30 rounded-2xl overflow-hidden">
          <div ref="threeContainer" class="w-full h-full cursor-pointer" :key="currentBreakpoint"> </div>

          <!-- Loading state -->
          <div v-show="!modelLoaded && !modelError"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm rounded-2xl">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
            <p class="mt-4 text-sm">Loading model... {{ modelLoadingProgress }}%</p>
          </div>

          <!-- Error state -->
          <div v-show="modelError"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm rounded-2xl">
            <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
            <p class="text-red-500 text-sm text-center">Failed to load 3D model<br></p>
          </div>
        </div>

        <!-- Overlay -->
        <div
          class="absolute top-10 md:top-20 right-0 md:right-10 w-1/2 h-full z-40 pointer-events-none flex items-end justify-end">
          <span class="absolute w-2/3 h-20 right-10 rounded-full z-[-1] shadow-clove hidden md:block"
            aria-hidden="true"></span>
          <img ref="cloveOverlay" :src="cloveImg" alt="Clove Pattern"
            class="h-full w-full md:w-auto object-contain transition-all duration-1000 scale-75 md:scale-100"
            @load="onImageLoad" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from '@vue/reactivity'
import { nextTick, onMounted, onUnmounted, shallowRef } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/theme'
import { useMacbookThree } from '@/components/utility/macbook/useMacbookThree'
import { colors } from '@/constants/theme'
import cloveImg from '@/assets/Images/clove.png'
import { useI18n } from 'vue-i18n'
import { animate, stagger } from 'animejs'

// Composables
const { t } = useI18n()
const router = useRouter()
const store = useStore()

// Reactive state
const isDark = computed(() => store.isDark)
const isInitialMount = ref(true)
const animationInProgress = ref(false)
const currentBreakpoint = shallowRef(getCurrentBreakpoint())

// Template refs
const greeting = ref(null)
const nameText = ref(null)
const roleText = ref(null)
const roleText2 = ref(null)
const accentLine = ref(null)
const role = ref(null)
const ctaContainer = ref(null)
const rightContent = ref(null)
const cloveOverlay = ref(null)
const threeContainer = ref(null)

// Computed properties for i18n content[1]
const greetingText = computed(() => t('hero.greeting'))
const nameText_content = computed(() => t('hero.name'))

const rolesArray = computed(() => {
  const analyst = t('hero.roles.analyst')
  const developer = t('hero.roles.developer')

  return [analyst, developer]
})

const ctaText = computed(() => t('hero.cta'))

// Computed classes for better performance[1]
const greetingClasses = computed(() => [
  'transition-colors duration-300',
  isDark.value ? colors.dark.text.secondary : colors.light.text.secondary
])

const nameClasses = computed(() => [
  'transition-colors duration-300',
  isDark.value ? colors.dark.text.primary : colors.light.text.primary
])

const roleClasses = computed(() => [
  'transition-colors duration-300',
  isDark.value ? colors.dark.text.secondary : colors.light.text.secondary
])

const accentLineClasses = computed(() => [
  'transition-all duration-300',
  isDark.value ? 'bg-gradient-to-r from-purple-200 to-purple-400' : 'bg-gradient-to-r from-purple-500 to-indigo-500',
  isInitialMount.value ? 'accent-line-animation' : ''
])

const ctaButtonClasses = computed(() => [
  isDark.value
    ? 'bg-gradient-to-r from-purple-200 to-purple-500 text-white hover:from-purple-100 hover:to-purple-400'
    : 'bg-gradient-to-r from-purple-400 to-purple-800 text-white hover:from-purple-300 hover:to-purple-600'
])

const glowClasses = computed(() => [
  isDark.value
    ? 'bg-gradient-to-r from-purple-200 to-purple-500'
    : 'bg-gradient-to-r from-purple-300 to-purple-600'
])

// 3D Model composable
const {
  modelLoaded,
  modelError,
  modelLoadingProgress,
  initThreeJS,
  cleanup,
} = useMacbookThree({ isDark, threeContainer })

// Optimized animation functions[3]
const resetElements = async () => {
  animationInProgress.value = false
  if (nameText.value) nameText.value.textContent = ''
  if (roleText.value) roleText.value.textContent = ''
  if (roleText2.value) roleText2.value.textContent = ''

  const elements = [
    { ref: greeting.value, transform: 'translateY(16px)' },
    { ref: role.value, transform: 'translateY(16px)' },
    { ref: ctaContainer.value, transform: 'translateY(16px)' },
    { ref: rightContent.value, transform: 'translateX(32px)' }
  ]

  // Batch DOM updates for better performance[3]
  requestAnimationFrame(() => {
    elements.forEach(({ ref, transform }) => {
      if (ref) {
        ref.style.opacity = '0'
        ref.style.transform = transform
      }
    })

    if (accentLine.value) {
      accentLine.value.classList.remove('accent-line-animation')
    }
  })

  await new Promise(resolve => setTimeout(resolve, 100))
}

const animateText = async (element, text, delay = 40) => {
  if (!element) return

  // Create text spans in a single operation[3]
  element.innerHTML = text
    .split('')
    .map(c => c === ' ' ? `<span class="inline-block opacity-0">&nbsp;</span>` : `<span class="inline-block opacity-0">${c}</span>`)
    .join('')

  await nextTick()

  // Use requestAnimationFrame for smooth animation[3]
  requestAnimationFrame(() => {
    animate(element.querySelectorAll('span'), {
      opacity: [0, 1],
      translateY: [10, 0],
      delay: stagger(delay),
      ease: 'outCubic',
      duration: 600
    })
  })
}
const animateContent = async () => {
  if (animationInProgress.value) {
    await resetElements()
  }
  animationInProgress.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 50))

    if (greeting.value) {
      greeting.value.style.opacity = '1'
      greeting.value.style.transform = 'translateY(0)'
    }

    await new Promise(resolve => setTimeout(resolve, 300))
    await animateText(nameText.value, nameText_content.value)
    await new Promise(resolve => setTimeout(resolve, 200))

    if (accentLine.value) {
      accentLine.value.classList.remove('accent-line-animation')
      void accentLine.value.offsetWidth
      accentLine.value.classList.add('accent-line-animation')
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    if (role.value) {
      role.value.style.opacity = '1'
      role.value.style.transform = 'translateY(0)'
    }

    await animateText(roleText.value, rolesArray.value[0], 50)

    if (roleText2.value && rolesArray.value[1]) {
      await new Promise(resolve => setTimeout(resolve, 200))
      await animateText(roleText2.value, rolesArray.value[1], 50)
    }

    // Batch final animations với requestAnimationFrame
    requestAnimationFrame(() => {
      if (ctaContainer.value) {
        ctaContainer.value.style.opacity = '1'
        ctaContainer.value.style.transform = 'translateY(0)'
      }
      if (rightContent.value) {
        rightContent.value.style.opacity = '1'
        rightContent.value.style.transform = 'translateX(0)'
      }
    })

  } catch (error) {
    console.log('Animation error:', error)
  } finally {
    animationInProgress.value = false
  }
}

// Utility functions
const navigateToPortfolio = () => router.push('/hub')

const onImageLoad = () => {
  if (cloveOverlay.value) {
    cloveOverlay.value.style.opacity = 1
  }
}

function getCurrentBreakpoint() {
  const width = window.innerWidth
  if (width < 640) return 'sm'
  if (width < 768) return 'md'
  if (width < 1024) return 'lg'
  if (width < 1280) return 'xl'
  return '2xl'
}

// Optimized debounce function[3]
const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

// Optimized resize handler[2]
const debounceReload = debounce(async () => {
  const newBreakpoint = getCurrentBreakpoint()
  if (currentBreakpoint.value !== newBreakpoint) {
    currentBreakpoint.value = newBreakpoint
    if (threeContainer.value) {
      cleanup()
      await nextTick()
      initThreeJS()
    }
  }
}, 500)

const handleResize = () => {
  window.addEventListener('resize', debounceReload, { passive: true })
}

// Lifecycle hooks
onMounted(() => {
  // Use requestAnimationFrame for initial setup[3]
  requestAnimationFrame(() => {
    initThreeJS()
    animateContent()
    handleResize()
  })
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('resize', debounceReload)
})

// Optimized watchers[1]
watch([isDark, greetingText, nameText_content, rolesArray, ctaText], async () => {
  requestAnimationFrame(async () => {
    document.body.classList.add('disable-transitions')
    await resetElements()
    await new Promise(resolve => setTimeout(resolve, 200))
    document.body.classList.remove('disable-transitions')
    animateContent()
  })
}, { deep: true })
</script>
<style scoped>
.accent-line-animation {
  animation: accentLineIn 0.6s ease forwards;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  will-change: width, opacity;
}

@keyframes accentLineIn {
  0% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 100%;
    opacity: 1;
  }
}

/* Prevent animation during theme change */
.disable-transitions * {
  transition: none !important;
}

.three-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.three-container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: contain;
  touch-action: none;
  image-rendering: crisp-edges;
}

/* Mobile specific optimizations */
@media (max-width: 768px) {
  .three-container {
    width: 100vw;
    height: 300px;
  }

  .three-container canvas {
    max-width: 100%;
    max-height: 100%;
    image-rendering: crisp-edges;
  }
}
</style>
