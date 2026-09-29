<template>
  <section id="station-identity" class="space-y-4 scroll-mt-24">
    <!-- Station Header Strip -->
    <div class="flex items-center justify-between px-2 text-xs font-mono">
      <div class="flex items-center gap-2" :class="isDark ? 'text-violet-400' : 'text-violet-700'">
        <span class="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
        <span class="font-bold tracking-wider">STATION 01 // IDENTITY & PERFORMANCE SCORECARD</span>
      </div>
      <span class="text-[10px] font-mono" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
        ENTRY_PORT // ARCHITECTURE_PIPELINE
      </span>
    </div>

    <!-- Bento Grid Container -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1: Identity & Profile (Spans 2 cols on md) -->
      <div
        class="md:col-span-2 p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardMouseMove"
      >
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10">
          <div class="relative flex-shrink-0">
            <img
              :src="avatarImg"
              alt="Gyn Nguyen"
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-violet-300/40 shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
            </div>
          </div>

          <div class="space-y-2 text-center sm:text-left">
            <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border"
              :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'"
            >
              <span>BA // REQUIREMENTS & PROCESS ARCHITECTURE</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
              {{ $t('about.name') }}
            </h2>
            <p class="text-sm font-semibold tracking-wide" :class="isDark ? 'text-violet-300' : 'text-violet-700'">
              {{ $t('about.role') }}
            </p>
            <p class="text-xs sm:text-sm leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
              {{ $t('about.professionalIntroContent') }}
            </p>
          </div>
        </div>

        <div class="pt-6 flex flex-wrap items-center gap-3 z-10 border-t mt-6" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
          <div class="flex items-center gap-1.5 text-xs font-mono" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
            <MapPinIcon class="w-4 h-4 text-rose-400" />
            <span>{{ $t('about.address') }}</span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1.5 text-xs font-mono text-emerald-500 font-medium">
            <CheckCircleIcon class="w-4 h-4" />
            <span>Open to Hybrid & Remote Consulting</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Quick Metrics / Stats -->
      <div
        class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardMouseMove"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-mono uppercase tracking-wider font-semibold" :class="isDark ? colors.dark.text.muted : colors.light.text.muted">
            DELIVERY_SCORECARD
          </h3>
          <span class="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border text-emerald-400 border-emerald-500/30 bg-emerald-950/20 flex items-center gap-1.5 shadow-xs">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SLA: {{ countSla }}%</span>
          </span>
        </div>
        
        <div class="space-y-4 py-2">
          <div>
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-extrabold tracking-tight text-violet-400 font-mono">{{ countStories }}+</span>
              <span class="text-[11px] font-mono text-slate-400">100% Accepted</span>
            </div>
            <div class="text-xs font-medium" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
              User Stories & Specifications Delivered
            </div>
            <div class="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
              <div
                class="bg-gradient-to-r from-violet-600 via-violet-400 to-purple-300 h-full rounded-full transition-all duration-1000 ease-out relative"
                :style="{ width: `${barStoriesWidth}%` }"
              >
                <div class="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px]"></div>
              </div>
            </div>
          </div>

          <div class="border-t pt-3" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-extrabold tracking-tight text-purple-400 font-mono">{{ countWorkflows }}+</span>
              <span class="text-[11px] font-mono text-slate-400">BPMN 2.0</span>
            </div>
            <div class="text-xs font-medium" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
              Workflows & Data Schemas Mapped
            </div>
            <div class="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
              <div
                class="bg-gradient-to-r from-purple-600 via-fuchsia-400 to-pink-300 h-full rounded-full transition-all duration-1000 ease-out relative"
                :style="{ width: `${barWorkflowsWidth}%` }"
              >
                <div class="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px]"></div>
              </div>
            </div>
          </div>

          <div class="border-t pt-3" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">{{ countYears }}+</span>
              <span class="text-[11px] font-mono text-slate-400">Continuous</span>
            </div>
            <div class="text-xs font-medium" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
              Years Bridging Business & Engineering
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPinIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import avatarImg from '@/assets/Images/avatar.png'

gsap.registerPlugin(ScrollTrigger)

const store = useStore()
const isDark = computed(() => store.isDark)

// Animated Metric Counters & Progress Bars
const countStories = ref(0)
const countWorkflows = ref(0)
const countYears = ref(0)
const countSla = ref('0.0')
const barStoriesWidth = ref(0)
const barWorkflowsWidth = ref(0)

let stMetric = null
let stCards = null

onMounted(() => {
  stMetric = ScrollTrigger.create({
    trigger: '#station-identity',
    scroller: 'main',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const metricObj = { stories: 0, workflows: 0, years: 0, sla: 0 }
      gsap.to(metricObj, {
        stories: 100,
        workflows: 25,
        years: 4,
        sla: 99.4,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          countStories.value = Math.round(metricObj.stories)
          countWorkflows.value = Math.round(metricObj.workflows)
          countYears.value = Math.round(metricObj.years)
          countSla.value = metricObj.sla.toFixed(1)
        }
      })

      setTimeout(() => {
        barStoriesWidth.value = 94
        barWorkflowsWidth.value = 88
      }, 100)
    }
  })

  // Card entrance with GSAP ScrollTrigger
  const tween = gsap.fromTo('#station-identity .grid > div', 
    { y: 35, opacity: 0, scale: 0.98 },
    { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      duration: 0.65, 
      stagger: 0.12, 
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#station-identity',
        scroller: 'main',
        start: 'top 88%'
      }
    }
  )
  stCards = tween.scrollTrigger
})

onUnmounted(() => {
  if (stMetric) stMetric.kill()
  if (stCards) stCards.kill()
})

const handleCardMouseMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
}
</script>

<style scoped>
.group::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(400px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(196, 181, 253, 0.08), transparent 80%);
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover::before {
  opacity: 1;
}
</style>
