<template>
  <section id="station-systems" class="space-y-4 scroll-mt-24">
    <!-- Station Header Strip -->
    <div class="flex items-center justify-between px-2 text-xs font-mono">
      <div class="flex items-center gap-2" :class="isDark ? 'text-violet-400' : 'text-violet-700'">
        <span class="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
        <span class="font-bold tracking-wider">STATION 03 // SYSTEMS ARCHITECTURE & ANALYSIS TOOLCHAIN</span>
      </div>
      <span class="text-[10px] font-mono" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
        SQL // ERD 3NF // OPENAPI // TOOLCHAIN
      </span>
    </div>

    <div class="space-y-6">
      <!-- Card 1: Systems & Data Acumen -->
      <div
        class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden group space-y-4"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardMouseMove"
      >
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-300">
            <ServerStackIcon class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-bold" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
              Systems & Relational Data Acumen
            </h3>
            <p class="text-xs font-mono" :class="isDark ? colors.dark.text.muted : colors.light.text.muted">
              The competitive edge: bridging business logic directly to technical architecture
            </p>
          </div>
        </div>

        <p class="text-sm sm:text-base leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
          {{ $t('about.visionContent_2') }}
        </p>

        <!-- Technical foundation tags with Official Icons -->
        <div class="flex flex-wrap gap-2 pt-2 border-t" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
          <span v-for="skill in Skills_Tech" :key="skill"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xl border font-medium transition-transform hover:scale-105"
            :class="isDark ? 'bg-purple-950/40 border-purple-800/60 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-800'"
          >
            <PlatformIcon :name="skill" size="xs" onlyKnown />
            <span>{{ skill }}</span>
          </span>
        </div>
      </div>

      <!-- Card 2: Analysis & Engineering Toolchain Matrix -->
      <div
        class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden group space-y-5"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardMouseMove"
      >
        <div class="flex items-center justify-between pb-3 border-b" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
          <div class="flex items-center gap-2.5 font-bold text-sm sm:text-base" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
            <WrenchScrewdriverIcon class="w-5 h-5 text-violet-400" />
            <span>Analysis, Design & Systems Toolchain</span>
          </div>
          <span class="text-xs font-mono px-2.5 py-1 rounded-md border text-emerald-400 border-emerald-500/30 bg-emerald-950/20">
            12 Shipped Environments
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div
            v-for="tool in Skills_Tools"
            :key="tool.name"
            class="group/tool p-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center gap-2 cursor-default"
            :class="isDark 
              ? 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-violet-400/50 text-slate-200' 
              : 'border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-violet-400 text-slate-800 shadow-xs'"
          >
            <div class="p-2.5 rounded-xl transition-colors" :class="isDark ? 'bg-white/5 group-hover/tool:bg-white/10' : 'bg-white group-hover/tool:bg-violet-50 shadow-xs'">
              <PlatformIcon :name="tool.icon || tool.name" size="md" interactive />
            </div>
            <div>
              <div class="text-xs font-semibold tracking-tight">{{ tool.name }}</div>
              <div class="text-[10px] font-mono mt-0.5" :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ tool.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ServerStackIcon, WrenchScrewdriverIcon } from '@heroicons/vue/24/outline'
import PlatformIcon from '@/components/common/PlatformIcon.vue'

gsap.registerPlugin(ScrollTrigger)

const store = useStore()
const isDark = computed(() => store.isDark)

const Skills_Tech = [
  'SQL Server & MySQL',
  'ERD Schema Modeling',
  'SQL PIVOT & Analytics',
  'RESTful API Contracts',
  'C# / .NET 8 Core',
  'System Integration Workflows'
]

const Skills_Tools = [
  { name: 'Jira', icon: 'jira', desc: 'Backlog & Sprints' },
  { name: 'Confluence', icon: 'confluence', desc: 'PRD & Specs' },
  { name: 'Figma', icon: 'figma', desc: 'Wireframing' },
  { name: 'Miro / Visio', icon: 'miro', desc: 'BPMN & Flows' },
  { name: 'Postman', icon: 'postman', desc: 'API Testing' },
  { name: 'SQL Server', icon: 'sqlserver', desc: 'Queries & 3NF' },
  { name: 'PostgreSQL', icon: 'postgres', desc: 'Relational DB' },
  { name: 'Power BI', icon: 'powerbi', desc: 'KPI Telemetry' },
  { name: 'GitHub', icon: 'github', desc: 'Version Control' },
  { name: 'Swagger', icon: 'swagger', desc: 'OpenAPI Spec' },
  { name: 'Docker', icon: 'docker', desc: 'Environments' },
  { name: '.NET / C#', icon: 'dotnet', desc: 'Logic Arch' }
]

let stSys = null

onMounted(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#station-systems',
      scroller: 'main',
      start: 'top 85%'
    }
  })

  tl.fromTo('#station-systems > div > div',
    { y: 35, opacity: 0, scale: 0.98 },
    { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.65, ease: 'power2.out' }
  )
  .fromTo('#station-systems .group\\/tool',
    { opacity: 0, scale: 0.85, y: 15 },
    { opacity: 1, scale: 1, y: 0, stagger: 0.035, duration: 0.4, ease: 'back.out(1.5)' },
    '-=0.3'
  )

  stSys = tl.scrollTrigger
})

onUnmounted(() => {
  if (stSys) stSys.kill()
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
