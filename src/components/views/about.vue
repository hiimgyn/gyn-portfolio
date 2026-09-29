<template>
  <div class="relative max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-6">
    <!-- Executive Top Header Strip -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6"
      :class="isDark ? 'border-white/10' : 'border-slate-200'"
    >
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border backdrop-blur-md"
          :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="tracking-wider font-semibold">{{ $t('about.pipelineLabel') }}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
          Executive Portfolio & System Specs
        </h1>
        <p class="text-xs sm:text-sm max-w-xl" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
          {{ $t('about.scrollHint') }}
        </p>
      </div>

      <!-- Quick Contact Info -->
      <div
        class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono self-start sm:self-auto"
        :class="isDark ? 'text-slate-400' : 'text-slate-600'"
      >
        <a :href="`mailto:${email}`" class="hover:text-violet-300 transition-colors flex items-center gap-1.5">
          <EnvelopeIcon class="w-4 h-4 text-amber-400" />
          <span>{{ email }}</span>
        </a>
        <span class="hidden sm:inline">•</span>
        <span class="flex items-center gap-1.5">
          <MapPinIcon class="w-4 h-4 text-violet-400" />
          <span>{{ $t('about.address') }}</span>
        </span>
      </div>
    </div>

    <!-- Floating / Sticky HUD Navigator -->
    <ScrollNavigator
      :stations="stations"
      :active-station="activeStation"
      :scroll-progress="scrollProgress"
      @navigate="scrollToStation"
    />

    <!-- CONTINUOUS MOTION GRAPHIC SCROLL-CONNECTED CARDS PIPELINE -->
    <div class="space-y-0 relative">
      <!-- STATION 01: IDENTITY & SCORECARD -->
      <StationIdentity ref="stationIdentityRef" />

      <!-- KINETIC CONNECTOR 01 ➔ 02 -->
      <MotionConnector
        step-number="01 ➔ 02"
        label="STREAM_01 // REQUIREMENTS_ELICITATION"
        from-port="OUT // IDENTITY_SCORECARD"
        to-port="IN // BA_DOMAIN_ANALYSIS"
      />

      <!-- STATION 02: BA REQUIREMENTS & PRD ARTIFACT -->
      <StationCompetencies ref="stationCompetenciesRef" />

      <!-- KINETIC CONNECTOR 02 ➔ 03 -->
      <MotionConnector
        step-number="02 ➔ 03"
        label="STREAM_02 // SYSTEMS_&_TOOLCHAIN"
        from-port="OUT // SPEC_DEFINITIONS"
        to-port="IN // ARCH_FEASIBILITY"
      />

      <!-- STATION 03: SYSTEMS ACUMEN & TOOLCHAIN MATRIX -->
      <StationSystems ref="stationSystemsRef" />

      <!-- KINETIC CONNECTOR 03 ➔ 04 -->
      <MotionConnector
        step-number="03 ➔ 04"
        label="STREAM_03 // INDUSTRY_CAREER_TRACK"
        from-port="OUT // ARCH_VALIDATED"
        to-port="IN // ENTERPRISE_DEPLOYMENT"
      />

      <!-- STATION 04: PROFESSIONAL CAREER TRACK -->
      <StationCareer ref="stationCareerRef" />

      <!-- KINETIC CONNECTOR 04 ➔ 05 -->
      <MotionConnector
        step-number="04 ➔ 05"
        label="STREAM_04 // PRODUCTION_DELIVERABLES"
        from-port="OUT // VERIFIED_CONTRIBUTIONS"
        to-port="IN // CASE_STUDIES"
      />

      <!-- STATION 05: FLAGSHIP SYSTEMS & CASE STUDIES -->
      <StationProjects ref="stationProjectsRef" />

      <!-- KINETIC CONNECTOR 05 ➔ TERMINAL -->
      <MotionConnector
        step-number="05 ➔ TERMINAL"
        label="PIPELINE_COMPLETE // NEXT_STEPS"
        from-port="OUT // SHIPPED_DELIVERABLES"
        to-port="IN // COLLABORATION_TERMINAL"
      />

      <!-- STATION 06: TERMINAL COLLABORATION HUB -->
      <StationTerminal ref="stationTerminalRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EnvelopeIcon, MapPinIcon } from '@heroicons/vue/24/outline'

import ScrollNavigator from '@/components/views/AboutSections/ScrollNavigator.vue'
import MotionConnector from '@/components/views/AboutSections/MotionConnector.vue'
import StationIdentity from '@/components/views/AboutSections/StationIdentity.vue'
import StationCompetencies from '@/components/views/AboutSections/StationCompetencies.vue'
import StationSystems from '@/components/views/AboutSections/StationSystems.vue'
import StationCareer from '@/components/views/AboutSections/StationCareer.vue'
import StationProjects from '@/components/views/AboutSections/StationProjects.vue'
import StationTerminal from '@/components/views/AboutSections/StationTerminal.vue'

gsap.registerPlugin(ScrollTrigger)

const store = useStore()
const isDark = computed(() => store.isDark)

const email = 'nguyenminhhung.work@gmail.com'

const stations = [
  { id: 'station-identity', label: 'about.station1', number: '01' },
  { id: 'station-competencies', label: 'about.station2', number: '02' },
  { id: 'station-systems', label: 'about.station3', number: '03' },
  { id: 'station-career', label: 'about.station4', number: '04' },
  { id: 'station-projects', label: 'about.station5', number: '05' },
  { id: 'station-terminal', label: 'about.stationTerminal', number: '06' }
]

const activeStation = ref('station-identity')
const scrollProgress = ref(0)

const scrollToStation = (stationId) => {
  activeStation.value = stationId
  const el = document.getElementById(stationId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

let masterSt = null

onMounted(() => {
  // GSAP ScrollTrigger for total storyline progress & active station
  masterSt = ScrollTrigger.create({
    scroller: 'main',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      scrollProgress.value = Math.min(100, Math.max(0, Math.round(self.progress * 100)))

      const mainEl = document.querySelector('main')
      if (!mainEl) return
      const scrollPos = mainEl.scrollTop + (mainEl.clientHeight * 0.35)

      for (let i = stations.length - 1; i >= 0; i--) {
        const el = document.getElementById(stations[i].id)
        if (el && el.offsetTop <= scrollPos) {
          activeStation.value = stations[i].id
          break
        }
      }
    }
  })
})

onUnmounted(() => {
  if (masterSt) masterSt.kill()
})
</script>
