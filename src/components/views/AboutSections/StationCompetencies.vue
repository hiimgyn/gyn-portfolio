<template>
  <section id="station-competencies" class="space-y-4 scroll-mt-24">
    <!-- Station Header Strip -->
    <div class="flex items-center justify-between px-2 text-xs font-mono">
      <div class="flex items-center gap-2" :class="isDark ? 'text-violet-400' : 'text-violet-700'">
        <span class="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
        <span class="font-bold tracking-wider">STATION 02 // BA REQUIREMENTS ENGINEERING & PROCESS MODELING</span>
      </div>
      <span class="text-[10px] font-mono" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
        ELICITATION ➔ BRD/PRD ➔ BPMN 2.0
      </span>
    </div>

    <!-- Main Card Container -->
    <div
      class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden group space-y-5"
      :class="[
        isDark 
          ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
      ]"
      @mousemove="handleCardMouseMove"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-violet-500/10 text-violet-300">
            <ChartBarSquareIcon class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-bold" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
              Requirements Engineering & Business Process Optimization
            </h3>
            <p class="text-xs font-mono" :class="isDark ? colors.dark.text.muted : colors.light.text.muted">
              Elicitation, BRD/PRD authoring, BPMN 2.0 modeling, and stakeholder alignment
            </p>
          </div>
        </div>

        <button
          @click="showPrdModal = !showPrdModal"
          class="text-xs font-mono px-3.5 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
          :class="showPrdModal 
            ? 'bg-violet-600 text-white border-violet-500 shadow-md' 
            : (isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-violet-300' : 'border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-800')"
        >
          <span>{{ showPrdModal ? 'Hide Tangible PRD' : 'Inspect PRD Deliverable Sample' }}</span>
          <span>{{ showPrdModal ? '▲' : '▼' }}</span>
        </button>
      </div>

      <p class="text-sm sm:text-base leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
        {{ $t('about.visionContent_1') }}
      </p>

      <!-- Expandable Tangible PRD Artifact Preview -->
      <transition name="toast-fade">
        <div v-if="showPrdModal" class="p-4 sm:p-5 rounded-2xl border font-mono text-xs space-y-3 bg-[#090b16] border-violet-500/30 text-slate-300 shadow-inner">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-violet-300 border-b border-white/10 pb-2">
            <span class="font-bold flex items-center gap-2">
              <PlatformIcon name="prd" size="xs" />
              <span>PRD // DELIVERABLE SPECIFICATION #042</span>
            </span>
            <span class="text-emerald-400 font-semibold">STATUS: APPROVED FOR SPRINT EXECUTION</span>
          </div>

          <div class="text-xs leading-relaxed">
            <span class="text-slate-400 font-bold block mb-1">USER STORY (BDD FORMAT):</span>
            <p class="text-slate-200 bg-white/5 p-2.5 rounded-lg border border-white/5">
              As an E-Commerce Operations Manager, I want real-time inventory locking with SQL UPDLOCK during checkout so that we eliminate overselling across multi-channel retail.
            </p>
          </div>

          <div class="text-xs bg-black/50 p-3 rounded-xl border border-white/5 space-y-1.5">
            <span class="text-amber-400 font-bold block">GHERKIN ACCEPTANCE CRITERIA:</span>
            <div class="text-slate-300 space-y-1 font-mono text-[11px]">
              <div><span class="text-violet-400 font-bold">Given</span> item SKU stock is 1 in Catalog DB</div>
              <div><span class="text-violet-400 font-bold">When</span> Customer A & B initiate checkout simultaneously</div>
              <div><span class="text-violet-400 font-bold">Then</span> ROWLOCK grants Customer A exclusive reservation</div>
              <div><span class="text-violet-400 font-bold">And</span> Customer B receives immediate graceful "Out of Stock" notification &lt; 200ms</div>
            </div>
          </div>
        </div>
      </transition>

      <!-- BA tags with Official Icons -->
      <div class="space-y-2 pt-2 border-t" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
        <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Core Methodologies & Standards:</div>
        <div class="flex flex-wrap gap-2">
          <span v-for="skill in Skills_BA" :key="skill"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xl border font-medium transition-transform hover:scale-105"
            :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-200' : 'bg-violet-50 border-violet-200 text-violet-800'"
          >
            <PlatformIcon :name="skill" size="xs" onlyKnown />
            <span>{{ skill }}</span>
          </span>
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
import { ChartBarSquareIcon } from '@heroicons/vue/24/outline'
import PlatformIcon from '@/components/common/PlatformIcon.vue'

gsap.registerPlugin(ScrollTrigger)

const store = useStore()
const isDark = computed(() => store.isDark)
const showPrdModal = ref(false)

const Skills_BA = [
  'BRD / PRD Documentation',
  'BPMN 2.0 Process Modeling',
  'User Stories & Gherkin AC',
  'Stakeholder Alignment',
  'Gap & Impact Analysis',
  'UAT Test Planning',
  'Agile / Scrum Framework'
]

let stMain = null

onMounted(() => {
  const tween = gsap.fromTo('#station-competencies > div',
    { y: 40, opacity: 0, scale: 0.98 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#station-competencies',
        scroller: 'main',
        start: 'top 85%'
      }
    }
  )
  stMain = tween.scrollTrigger
})

onUnmounted(() => {
  if (stMain) stMain.kill()
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
