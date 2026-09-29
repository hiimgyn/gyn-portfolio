<template>
  <div ref="connectorRoot" class="relative py-8 sm:py-12 flex flex-col items-center justify-center select-none overflow-visible">
    <!-- Top Out-Port (Emanating from card above) -->
    <div
      ref="fromPortEl"
      class="flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono border backdrop-blur-md transition-all duration-300 shadow-xs z-10 -mt-2"
      :class="isDark 
        ? 'bg-[#0e1122]/90 border-violet-500/30 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.15)]' 
        : 'bg-white/95 border-violet-200 text-violet-800 shadow-[0_1px_4px_rgba(0,0,0,0.05)]'"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
      <span class="font-semibold">{{ fromPort }}</span>
    </div>

    <!-- Motion Graphic Central Laser Conduit Container -->
    <div ref="conduitTrack" class="relative w-full max-w-md h-28 sm:h-36 flex items-center justify-center my-1">
      <!-- Animated SVG Circuit Conduit -->
      <svg
        class="w-full h-full overflow-visible"
        viewBox="0 0 320 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Flowing Beam Gradient -->
          <linearGradient :id="`beam-grad-${uniqueId}`" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3" />
            <stop offset="50%" stop-color="#38bdf8" stop-opacity="1" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.9" />
          </linearGradient>

          <!-- Glowing Filter for Laser Effect -->
          <filter :id="`glow-${uniqueId}`" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Central Static Guide Track -->
        <line
          x1="160"
          y1="0"
          x2="160"
          y2="120"
          stroke="currentColor"
          :class="isDark ? 'text-white/10' : 'text-slate-300'"
          stroke-width="1.5"
          stroke-dasharray="3 3"
        />

        <!-- GSAP Scrubbed Laser Line (Drawn on scroll) -->
        <path
          ref="laserPath"
          d="M 160 0 L 160 120"
          :stroke="`url(#beam-grad-${uniqueId})`"
          stroke-width="3"
          stroke-linecap="round"
          :filter="`url(#glow-${uniqueId})`"
        />

        <!-- Left Lateral PCB Branch -->
        <path
          ref="leftBranch"
          d="M 160 60 L 115 60 L 95 40 L 55 40"
          stroke="currentColor"
          :class="isDark ? 'text-violet-400' : 'text-violet-600'"
          stroke-width="1.5"
          stroke-dasharray="2 2"
        />
        <circle ref="leftNode" cx="55" cy="40" r="3" :class="isDark ? 'fill-violet-400' : 'fill-violet-600'" />

        <!-- Right Lateral PCB Branch -->
        <path
          ref="rightBranch"
          d="M 160 60 L 205 60 L 225 80 L 265 80"
          stroke="currentColor"
          :class="isDark ? 'text-emerald-400' : 'text-emerald-600'"
          stroke-width="1.5"
          stroke-dasharray="2 2"
        />
        <circle ref="rightNode" cx="265" cy="80" r="3" :class="isDark ? 'fill-emerald-400' : 'fill-emerald-600'" />
      </svg>

      <!-- Scrubbed Traveling Photon / Data Packet -->
      <div
        ref="packetRunner"
        class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full pointer-events-none flex items-center justify-center z-20"
        style="top: 0px;"
      >
        <div class="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_16px_#38bdf8,0_0_8px_#fff] flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
        </div>
      </div>

      <!-- Center Pipeline Joint Badge -->
      <div
        ref="jointBadge"
        class="absolute px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-2xl border text-[10px] sm:text-xs font-mono font-bold tracking-wider backdrop-blur-xl flex items-center gap-2 z-10 shadow-lg"
        :class="isDark 
          ? 'bg-[#0f1325]/95 border-white/[0.15] text-slate-100 shadow-[0_4px_24px_rgba(139,92,246,0.35)]' 
          : 'bg-white/95 border-violet-200 text-slate-800 shadow-[0_4px_16px_rgba(139,92,246,0.15)]'"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-extrabold tracking-tight text-violet-400 font-mono">{{ stepNumber }}</span>
        <span class="text-slate-400">|</span>
        <span class="truncate max-w-[200px] sm:max-w-xs">{{ label }}</span>
      </div>
    </div>

    <!-- Bottom In-Port (Plugging into card below) -->
    <div
      ref="toPortEl"
      class="flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono border backdrop-blur-md transition-all duration-300 shadow-xs z-10 -mb-2"
      :class="isDark 
        ? 'bg-[#0e1122]/90 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
        : 'bg-white/95 border-emerald-200 text-emerald-800 shadow-[0_1px_4px_rgba(0,0,0,0.05)]'"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
      <span class="font-semibold">{{ toPort }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores/theme'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  stepNumber: {
    type: String,
    default: '01 ➔ 02'
  },
  label: {
    type: String,
    required: true
  },
  fromPort: {
    type: String,
    default: 'OUT // VALIDATED_STREAM'
  },
  toPort: {
    type: String,
    default: 'IN // NEXT_PHASE_PIPELINE'
  }
})

const store = useStore()
const isDark = computed(() => store.isDark)
const uniqueId = computed(() => Math.random().toString(36).substring(2, 9))

const connectorRoot = ref(null)
const laserPath = ref(null)
const packetRunner = ref(null)
const jointBadge = ref(null)
const leftBranch = ref(null)
const rightBranch = ref(null)
const toPortEl = ref(null)

let st = null

onMounted(() => {
  if (!laserPath.value || !connectorRoot.value) return

  const path = laserPath.value
  const pathLength = 120

  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  })

  gsap.set([leftBranch.value, rightBranch.value], {
    opacity: 0.15,
    scale: 0.95,
    transformOrigin: 'center'
  })

  gsap.set(jointBadge.value, {
    scale: 0.9,
    opacity: 0.7
  })

  // GSAP ScrollTrigger timeline with scrub
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: connectorRoot.value,
      scroller: 'main',
      start: 'top 85%',
      end: 'bottom 45%',
      scrub: 0.6,
      onLeaveBack: () => {
        gsap.to(toPortEl.value, { scale: 1, duration: 0.2 })
      }
    }
  })

  tl.to(path, {
    strokeDashoffset: 0,
    ease: 'none'
  }, 0)
  .to(packetRunner.value, {
    y: 110,
    ease: 'none'
  }, 0)
  .to(jointBadge.value, {
    scale: 1,
    opacity: 1,
    ease: 'power1.out',
    duration: 0.35
  }, 0.2)
  .to([leftBranch.value, rightBranch.value], {
    opacity: 1,
    scale: 1,
    stagger: 0.1,
    duration: 0.3
  }, 0.3)
  .to(toPortEl.value, {
    scale: 1.12,
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)',
    duration: 0.2
  }, 0.8)

  st = tl.scrollTrigger
})

onUnmounted(() => {
  if (st) st.kill()
})
</script>
