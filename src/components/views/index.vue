<template>
  <section class="relative min-h-[calc(100vh-4rem-4rem)] flex items-center overflow-hidden">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center relative z-20 gap-8 md:gap-0">
      <!-- Left Content -->
      <div class="w-full md:w-1/2 space-y-6 text-center md:text-left">
        <!-- Greeting -->
        <p ref="greeting" :class=" [
          'text-base md:text-lg mb-8 transform transition-all duration-500 opacity-0 translate-y-4',
          'transition-colors duration-300',
          isDark ? colors.dark.text.secondary : colors.light.text.secondary
        ]">
          <span class="inline-block">👋</span> {{ i18nContent.greeting }}
        </p>
        <!-- Name và Accent line -->
        <div ref="nameContainer" class="relative inline-block">
          <h2 ref="name" :class="[
            'text-4xl sm:text-5xl lg:text-6xl font-bold mb-4',
            'transition-colors duration-300',
            isDark ? colors.dark.text.primary : colors.light.text.primary
          ]">
            <span ref="nameText" class="ml-2"></span>
          </h2>
          <!-- Accent line under name -->
          <div ref="accentLine" :class="[
            'absolute -bottom-2 left-0 h-1 opacity-0',
            'transition-all duration-300',
            isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500',
            isInitialMount ? 'accent-line-animation' : ''
          ]"></div>
        </div>
        <!-- Role -->
        <h3 ref="role" :class=" [
          'text-xl sm:text-2xl lg:text-3xl mb-8 font-mono transform transition-all duration-500 opacity-0 translate-y-4',
          'transition-colors duration-300',
          isDark ? colors.dark.text.secondary : colors.light.text.secondary
        ]">
          <span class="text-green-400">&gt;</span>
          <span ref="roleText" class="ml-2"></span>
          <span ref="cursor" class="animate-pulse">|</span>
        </h3>
        <!-- CTA Button -->
        <div ref="ctaContainer" class="transform transition-all duration-500 opacity-0 translate-y-4">
          <button ref="ctaButton" :class="[
            'group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1',
            'shadow-lg hover:shadow-xl',
            isDark
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400'
          ]" @click="navigateToPortfolio">
            <span class="relative z-10">{{ i18nContent.cta }}</span>
            <!-- Glow -->
            <div :class="[
              'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl',
              isDark
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            ]"></div>
            <!-- Arrow icon -->
            <svg class="inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Right Content (3D Model + overlay) -->
      <div ref="rightContent" class="relative w-full md:w-1/2 h-[300px] md:h-[425px] transition-all duration-1000 opacity-0 translate-x-8">
        <div class="absolute inset-0 z-30 rounded-2xl overflow-hidden">
          <div ref="threeContainer" 
            class="w-full h-full cursor-pointer"
            :key="currentBreakpoint" 
            @click="toggleAnimation">
          </div>
          <!-- Loading state -->
          <div v-if="!modelLoaded && !modelError"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm rounded-2xl">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
            <p class="mt-4 text-sm">Loading model... {{ modelLoadingProgress }}%</p>
          </div>
          <!-- Error state -->
          <div v-if="modelError"
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
        <div class="absolute top-10 md:top-20 right-0 md:right-10 w-1/2 h-full z-40 pointer-events-none flex items-end justify-end">
          <span class="absolute w-2/3 h-20 right-10 rounded-full z-[-1] shadow-clove hidden md:block" aria-hidden="true"></span>
          <img ref="cloveOverlay" :src="cloveImg" alt="Clove Pattern"
            class="h-full w-full md:w-auto object-contain transition-all duration-1000 scale-75 md:scale-100" 
            @load="onImageLoad" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/theme'
import GlitchText from '../utility/GlitchText.vue'
import { useMacbookThree } from '@/components/utility/scripts/useMacbookThree'
import { colors } from '@/constants/theme'
import cloveImg from '@/assets/Images/clove.png'
import { useI18n } from 'vue-i18n'

// I18n setup
const { t } = useI18n()
const i18nContent = computed(() => ({
  greeting: t('hero.greeting'),
  name: t('hero.name'),
  roles: t('hero.role').replace(/^>/, '').split(' . '),
  cta: t('hero.cta')
}))

// UI refs
const greeting = ref(null)
const nameContainer = ref(null)
const name = ref(null)
const nameText = ref(null)
const accentLine = ref(null)
const role = ref(null)
const roleText = ref(null)
const cursor = ref(null)
const ctaContainer = ref(null)
const ctaButton = ref(null)
const rightContent = ref(null)
const cloveOverlay = ref(null)
const threeContainer = ref(null)

// State refs
const isTyping = ref(false)
const isInitialMount = ref(true)
const currentBreakpoint = ref(getCurrentBreakpoint())
const animationInProgress = ref(false)

const router = useRouter()
const store = useStore()
const isDark = computed(() => store.isDark)

// Three.js logic
const {
  modelLoaded,
  modelError,
  modelLoadingProgress,
  initThreeJS,
  cleanup,
  toggleAnimation,
} = useMacbookThree({ isDark, threeContainer })

// Typing animation utilities
let cleanupTimers = []
let currentTypingPromises = []
const typeText = async (element, text, speed = 50) => {
  if (!element) return
  
  return new Promise((resolve, reject) => {
    let i = 0
    element.textContent = ''
    
    const timer = setInterval(() => {
      try {
        if (i < text.length) {
          element.textContent += text.charAt(i)
          i++
        } else {
          clearInterval(timer)
          resolve()
        }
      } catch (error) {
        clearInterval(timer)
        reject(error)
      }
    }, speed)
    
    cleanupTimers.push(() => {
      clearInterval(timer)
      reject('Animation cancelled')
    })
  })
}

const resetElements = async () => {
  // Reset animation state
  animationInProgress.value = false
  
  // Clear all timers and promises
  cleanupTimers.forEach(cleanup => cleanup())
  cleanupTimers = []
  currentTypingPromises.forEach(promise => promise.catch(() => {}))
  currentTypingPromises = []

  // Reset text content
  if (nameText.value) {
    nameText.value.textContent = ''
  }
  if (roleText.value) {
    roleText.value.textContent = ''
  }

  // Reset animations and transforms
  const elements = [
    { ref: greeting.value, transform: 'translateY(16px)' },
    { ref: role.value, transform: 'translateY(16px)' },
    { ref: ctaContainer.value, transform: 'translateY(16px)' },
    { ref: rightContent.value, transform: 'translateX(32px)' }
  ]

  elements.forEach(({ ref, transform }) => {
    if (ref) {
      ref.style.opacity = '0'
      ref.style.transform = transform
    }
  })

  // Reset accent line
  if (accentLine.value) {
    accentLine.value.classList.remove('accent-line-animation')
  }

  // Wait for reset to complete
  await new Promise(resolve => setTimeout(resolve, 100))
}

const animateContent = async () => {
  if (animationInProgress.value) {
    await resetElements()
  }

  animationInProgress.value = true

  try {
    // Add a small delay before starting animations
    await new Promise(resolve => setTimeout(resolve, 50))

    // Greeting animation with fade in
    if (greeting.value) {
      greeting.value.style.opacity = '1'
      greeting.value.style.transform = 'translateY(0)'
    }
    await new Promise(resolve => setTimeout(resolve, 300))

    // Name typing with proper cleanup
    if (nameText.value) {
      const namePromise = typeText(nameText.value, i18nContent.value.name, 50)
      currentTypingPromises.push(namePromise)
      await namePromise
    }
    await new Promise(resolve => setTimeout(resolve, 200))

    // Accent line animation
    if (accentLine.value) {
      accentLine.value.classList.remove('accent-line-animation')
      // Force reflow
      void accentLine.value.offsetWidth
      accentLine.value.classList.add('accent-line-animation')
    }
    await new Promise(resolve => setTimeout(resolve, 300))

    // Role animation
    if (role.value) {
      role.value.style.opacity = '1'
      role.value.style.transform = 'translateY(0)'
    }
     new Promise(resolve => setTimeout(resolve, 200))

    // Role text typing
    if (roleText.value) {
      const rolePromise = typeText(roleText.value, i18nContent.value.roles[0], 70)
      currentTypingPromises.push(rolePromise)
       rolePromise
    }

    // Final animations
    if (ctaContainer.value) {
      ctaContainer.value.style.opacity = '1'
      ctaContainer.value.style.transform = 'translateY(0)'
    }
    if (rightContent.value) {
      rightContent.value.style.opacity = '1'
      rightContent.value.style.transform = 'translateX(0)'
    }

  } catch (error) {
    console.log('Animation cancelled:', error)
  } finally {
    animationInProgress.value = false
    cleanupTimers = []
    currentTypingPromises = []
  }
}

// CTA
const navigateToPortfolio = () => {
  router.push('/hub')
}

// Overlay image loaded
const onImageLoad = () => {
  cloveOverlay.value.style.opacity = 1
}

// Breakpoint utility
function getCurrentBreakpoint() {
  const width = window.innerWidth
  if (width < 640) return 'sm'
  if (width < 768) return 'md'
  if (width < 1024) return 'lg'
  if (width < 1280) return 'xl'
  return '2xl'
}

// Window resize handler
const handleResize = () => {
  const debounceReload = debounce(async () => {
    const newBreakpoint = getCurrentBreakpoint()
    
    // Only reload if breakpoint changes
    if (currentBreakpoint.value !== newBreakpoint) {
      currentBreakpoint.value = newBreakpoint
      if (threeContainer.value) {
        cleanup()
        await nextTick()
        initThreeJS()
      }
    }
  }, 500)
  
  window.addEventListener('resize', debounceReload)
  
  onUnmounted(() => {
    window.removeEventListener('resize', debounceReload)
  })
}

// Debounce utility
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// Mount/unmount
onMounted(() => {
  initThreeJS()
  animateContent()
  handleResize() 
})

onUnmounted(() => {
  cleanup()
  if (typingTimer) clearInterval(typingTimer)
  typingTimer = null
  
  // Cleanup any remaining animations
  cleanupTimers.forEach(cleanup => cleanup())
  cleanupTimers = []
  currentTypingPromises.forEach(promise => promise.catch(() => {}))
  currentTypingPromises = []
})

watch([isDark, i18nContent], async () => {
  if (isInitialMount.value) {
    isInitialMount.value = false
    return
  }

  // Add class to disable transitions during theme change
  document.body.classList.add('disable-transitions')
  
  await resetElements()
  
  // Small delay to ensure reset is complete
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Remove disable transitions class
  document.body.classList.remove('disable-transitions')
  
  // Start new animation sequence
  animateContent()
}, { deep: true })
</script>

<style scoped>
/* Accent line animation */
.accent-line-animation {
  animation: accentLineIn 0.6s ease forwards;
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

/* Typing cursor animation */
.cursor-blink {
  animation: cursorBlink 0.7s infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Prevent animation during theme change */
.disable-transitions * {
  transition: none !important;
}
</style>
