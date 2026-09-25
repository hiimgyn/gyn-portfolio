<template>
  <section class="relative min-h-[calc(100vh-4rem-4rem)] flex flex-col justify-between overflow-hidden py-6 sm:py-8">
    <div
      class="max-w-7xl mx-auto px-4 w-full flex-1 flex flex-col lg:flex-row justify-between items-center relative z-20 gap-8 lg:gap-10 my-auto"
    >
      <!-- Left Content -->
      <div class="w-full lg:w-7/12 space-y-5 text-center lg:text-left">
        <!-- Status Badge -->
        <div ref="statusBadge" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium backdrop-blur-md opacity-0 translate-y-4 shadow-xs"
          :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ $t('hero.availableStatus') }}</span>
        </div>

        <!-- Greeting -->
        <p ref="greeting" :class="greetingClasses"
          class="text-xs sm:text-sm opacity-0 translate-y-4 font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center lg:justify-start gap-2"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
          <span>{{ greetingText }}</span>
        </p>

        <!-- Name & Headline -->
        <div ref="nameContainer" class="relative inline-block">
          <h1 ref="name" :class="nameClasses" class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2">
            <span ref="nameText"></span>
          </h1>
          <div ref="accentLine" :class="accentLineClasses" class="h-1 rounded-full opacity-0"></div>
        </div>

        <!-- Role: Business Analyst -->
        <div ref="role" :class="roleClasses"
          class="text-xl sm:text-2xl lg:text-3xl font-mono opacity-0 translate-y-4"
        >
          <div class="flex items-center justify-center lg:justify-start gap-2.5">
            <span class="text-violet-400 font-bold">&gt;</span>
            <span ref="roleText" class="font-extrabold tracking-tight" :class="isDark ? 'text-white' : 'text-slate-900'"></span>
          </div>
        </div>

        <!-- Tagline / Value Proposition -->
        <p ref="taglineEl"
          class="text-sm sm:text-base leading-relaxed opacity-0 translate-y-4 max-w-xl mx-auto lg:mx-0 font-normal"
          :class="isDark ? 'text-slate-400' : 'text-slate-600'"
        >
          {{ $t('hero.tagline') }}
        </p>

        <!-- BA & Technical Quick Highlights with Official Icons -->
        <div ref="techHighlights" class="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 opacity-0 translate-y-4">
          <span v-for="tag in baTags"
            :key="tag.name"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border backdrop-blur-sm transition-all hover:scale-105"
            :class="isDark 
              ? 'bg-white/5 border-white/10 text-slate-300 hover:border-violet-400/50 hover:text-white' 
              : 'bg-white border-slate-200 text-slate-700 hover:border-violet-500/50 hover:text-slate-900 shadow-xs'"
          >
            <PlatformIcon :name="tag.icon" size="xs" />
            <span>{{ tag.name }}</span>
          </span>
        </div>

        <!-- Tactile Dual CTA Buttons -->
        <div ref="ctaContainer" class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 opacity-0 translate-y-4">
          <button
            @click="navigateToPortfolio"
            class="group relative px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] shadow-md flex items-center gap-2"
            :class="isDark 
              ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(139,92,246,0.35)]' 
              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_12px_rgba(139,92,246,0.25)]'"
          >
            <span>{{ ctaText }}</span>
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>

          <router-link
            to="/hub"
            class="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] flex items-center gap-2"
            :class="isDark 
              ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]' 
              : 'border-slate-300 bg-white hover:bg-violet-50/50 text-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.05)]'"
          >
            <span>{{ $t('nav.hub') }}</span>
          </router-link>
        </div>
      </div>

      <!-- Right Content: Interactive 3D Companion -->
      <div ref="rightContent"
        class="relative w-full lg:w-5/12 h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center opacity-0"
      >
        <div class="relative w-full h-full rounded-3xl overflow-hidden border backdrop-blur-xl transition-all duration-300 shadow-xl"
          :class="isDark 
            ? 'border-white/[0.08] bg-[#0f1220]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_36px_rgba(0,0,0,0.5)]' 
            : 'border-violet-100 bg-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_8px_24px_rgba(139,92,246,0.08)]'"
        >
          <ChillWorkstation />
        </div>
      </div>
    </div>

    <!-- Official Platform Ecosystem Marquee Ribbon -->
    <div class="w-full mt-10">
      <PlatformMarquee />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/theme'
import ChillWorkstation from '@/components/utility/room/ChillWorkstation.vue'
import PlatformIcon from '@/components/common/PlatformIcon.vue'
import PlatformMarquee from '@/components/common/PlatformMarquee.vue'
import { colors } from '@/constants/theme'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

// Composables
const { t } = useI18n()
const router = useRouter()
const store = useStore()

// Reactive state
const isDark = computed(() => store.isDark)
const isInitialMount = ref(true)

// Template refs
const statusBadge = ref(null)
const greeting = ref(null)
const nameContainer = ref(null)
const nameText = ref(null)
const role = ref(null)
const roleText = ref(null)
const taglineEl = ref(null)
const accentLine = ref(null)
const techHighlights = ref(null)
const ctaContainer = ref(null)
const rightContent = ref(null)

// Computed properties for i18n content
const greetingText = computed(() => t('hero.greeting'))
const nameText_content = computed(() => t('hero.name'))

// Primary role: Business Analyst
const roleTitle = computed(() => t('hero.roles.analyst'))

const baTags = [
  { name: 'BRD / PRD Specs', icon: 'prd' },
  { name: 'BPMN 2.0 Workflows', icon: 'bpmn' },
  { name: 'SQL & Relational DB', icon: 'sqlserver' },
  { name: 'API Contracts', icon: 'postman' },
  { name: 'Jira / Agile Delivery', icon: 'jira' }
]

const ctaText = computed(() => t('hero.cta'))

// Computed classes
const greetingClasses = computed(() => [
  'transition-colors duration-200',
  isDark.value ? colors.dark.text.secondary : colors.light.text.secondary
])

const nameClasses = computed(() => [
  'transition-colors duration-200',
  isDark.value ? colors.dark.text.primary : colors.light.text.primary
])

const roleClasses = computed(() => [
  'transition-colors duration-200',
  isDark.value ? colors.dark.text.secondary : colors.light.text.secondary
])

const accentLineClasses = computed(() => [
  'transition-all duration-300',
  isDark.value ? 'bg-gradient-to-r from-violet-400 via-purple-300 to-transparent' : 'bg-gradient-to-r from-violet-600 via-purple-400 to-transparent',
  isInitialMount.value ? 'accent-line-animation' : ''
])

const resetElements = () => {
  if (nameText.value) nameText.value.textContent = ''
  if (roleText.value) roleText.value.textContent = ''

  const elements = [statusBadge.value, greeting.value, role.value, taglineEl.value, techHighlights.value, ctaContainer.value, rightContent.value]
  elements.forEach(el => {
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateY(16px)'
    }
  })
}

const animateText = async (element, text, delay = 35) => {
  if (!element) return

  element.innerHTML = text
    .split('')
    .map(c => c === ' ' ? `<span class="inline-block opacity-0">&nbsp;</span>` : `<span class="inline-block opacity-0">${c}</span>`)
    .join('')

  await nextTick()

  gsap.fromTo(
    element.querySelectorAll('span'),
    { opacity: 0, y: 8 },
    {
      opacity: 1,
      y: 0,
      stagger: delay / 1000,
      duration: 0.4,
      ease: 'power2.out'
    }
  )
}

const animateContent = async () => {
  try {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.5 } })

    if (statusBadge.value) {
      tl.to(statusBadge.value, { opacity: 1, y: 0 })
    }
    if (greeting.value) {
      tl.to(greeting.value, { opacity: 1, y: 0 }, '-=0.3')
    }

    tl.add(() => {
      animateText(nameText.value, nameText_content.value)
    }, '-=0.2')

    if (accentLine.value) {
      accentLine.value.classList.add('accent-line-animation')
    }

    if (role.value) {
      tl.to(role.value, { opacity: 1, y: 0 }, '+=0.2')
      tl.add(() => {
        animateText(roleText.value, roleTitle.value, 35)
      })
    }

    if (taglineEl.value) {
      tl.to(taglineEl.value, { opacity: 1, y: 0 }, '+=0.2')
    }

    if (techHighlights.value) {
      tl.to(techHighlights.value, { opacity: 1, y: 0 }, '-=0.1')
    }

    if (ctaContainer.value) {
      tl.to(ctaContainer.value, { opacity: 1, y: 0 }, '-=0.2')
    }

    if (rightContent.value) {
      tl.to(rightContent.value, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    }
  } catch (error) {
    console.error('Animation error:', error)
  }
}

const navigateToPortfolio = () => router.push('/about')

onMounted(() => {
  animateContent()
})

watch([greetingText, nameText_content, roleTitle, ctaText], async () => {
  resetElements()
  animateContent()
}, { deep: true })
</script>

<style scoped>
.accent-line-animation {
  animation: accentLineIn 0.6s ease forwards;
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
</style>
