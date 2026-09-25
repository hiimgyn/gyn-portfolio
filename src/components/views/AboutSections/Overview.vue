<template>
  <div class="space-y-6">
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
              src="../../../assets/Images/avatar.png"
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
              <span>BA // REQUIREMENTS & PROCESS</span>
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
          <span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border text-emerald-400 border-emerald-500/30 bg-emerald-950/20">
            ● SLA: 99.4%
          </span>
        </div>
        
        <div class="space-y-4 py-2">
          <div>
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-extrabold tracking-tight text-violet-400">100+</span>
              <span class="text-[11px] font-mono text-slate-400">100% Accepted</span>
            </div>
            <div class="text-xs font-medium" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
              User Stories & Specifications Delivered
            </div>
            <div class="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-violet-500 h-full rounded-full w-[94%]"></div>
            </div>
          </div>

          <div class="border-t pt-3" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-extrabold tracking-tight text-purple-400">25+</span>
              <span class="text-[11px] font-mono text-slate-400">BPMN 2.0</span>
            </div>
            <div class="text-xs font-medium" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
              Workflows & Data Schemas Mapped
            </div>
            <div class="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-purple-500 h-full rounded-full w-[88%]"></div>
            </div>
          </div>

          <div class="border-t pt-3" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
            <div class="flex items-baseline justify-between">
              <span class="text-3xl font-extrabold tracking-tight text-emerald-400">4+</span>
              <span class="text-[11px] font-mono text-slate-400">Continuous</span>
            </div>
            <div class="text-xs font-medium" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
              Years Bridging Business & Engineering
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Business Analyst Domain (PRIMARY - Col 1 & 2 on md) -->
      <div
        class="md:col-span-2 p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden space-y-4"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardMouseMove"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-violet-500/10 text-violet-300">
              <ChartBarSquareIcon class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-bold" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
                Requirements Engineering & Process Optimization
              </h3>
              <p class="text-xs" :class="isDark ? colors.dark.text.muted : colors.light.text.muted">
                Elicitation, BRD/PRD authoring, BPMN 2.0 modeling, and stakeholder alignment
              </p>
            </div>
          </div>

          <button
            @click="showPrdModal = !showPrdModal"
            class="text-[11px] font-mono px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center gap-1.5 shrink-0"
            :class="showPrdModal 
              ? 'bg-violet-600 text-white border-violet-500 shadow-sm' 
              : (isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-violet-300' : 'border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-800')"
          >
            <span>{{ showPrdModal ? 'Hide Artifact' : 'Inspect PRD Sample' }}</span>
            <span>{{ showPrdModal ? '▲' : '▼' }}</span>
          </button>
        </div>

        <p class="text-sm leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
          {{ $t('about.visionContent_1') }}
        </p>

        <!-- Expandable Tangible PRD Artifact Preview -->
        <transition name="toast-fade">
          <div v-if="showPrdModal" class="p-4 rounded-2xl border font-mono text-xs space-y-2.5 bg-[#090b16] border-violet-500/30 text-slate-300 shadow-inner">
            <div class="flex items-center justify-between text-[11px] text-violet-300 border-b border-white/10 pb-1.5">
              <span class="font-bold flex items-center gap-1.5">
                <PlatformIcon name="prd" size="xs" />
                <span>PRD // DELIVERABLE SPECIFICATION #042</span>
              </span>
              <span class="text-emerald-400">STATUS: APPROVED FOR SPRINT</span>
            </div>
            <div class="text-[11px] leading-relaxed">
              <span class="text-slate-400 font-bold block mb-1">USER STORY (BDD):</span>
              <p class="text-slate-200">As an E-Commerce Ops Manager, I want real-time inventory locking with SQL UPDLOCK during checkout so that we eliminate overselling across multi-channel retail.</p>
            </div>
            <div class="text-[11px] bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
              <span class="text-amber-400 font-bold block">GHERKIN ACCEPTANCE CRITERIA:</span>
              <div class="text-slate-300 space-y-0.5">
                <div><span class="text-violet-400">Given</span> item SKU stock is 1 in Catalog DB</div>
                <div><span class="text-violet-400">When</span> Customer A & B initiate checkout simultaneously</div>
                <div><span class="text-violet-400">Then</span> ROWLOCK grants Customer A exclusive reservation</div>
                <div><span class="text-violet-400">And</span> Customer B receives immediate graceful "Out of Stock" notification &lt; 200ms</div>
              </div>
            </div>
          </div>
        </transition>

        <!-- BA tags with Official Icons -->
        <div class="flex flex-wrap gap-2 pt-2">
          <span v-for="skill in Skills_BA" :key="skill"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border font-medium transition-transform hover:scale-105"
            :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-200' : 'bg-violet-50 border-violet-200 text-violet-800'"
          >
            <PlatformIcon :name="skill" size="xs" onlyKnown />
            <span>{{ skill }}</span>
          </span>
        </div>
      </div>

      <!-- Card 4: Technical Foundation Domain (Col 3 on md) -->
      <div
        class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden space-y-4"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardMouseMove"
      >
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-300">
            <ServerStackIcon class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
              Systems & Data Acumen
            </h3>
            <p class="text-xs" :class="isDark ? colors.dark.text.muted : colors.light.text.muted">
              The technical BA advantage
            </p>
          </div>
        </div>
        <p class="text-sm leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
          {{ $t('about.visionContent_2') }}
        </p>

        <!-- Technical foundation tags with Official Icons -->
        <div class="flex flex-wrap gap-2 pt-2">
          <span v-for="skill in Skills_Tech" :key="skill"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border font-medium transition-transform hover:scale-105"
            :class="isDark ? 'bg-purple-950/40 border-purple-800/60 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-800'"
          >
            <PlatformIcon :name="skill" size="xs" onlyKnown />
            <span>{{ skill }}</span>
          </span>
        </div>
      </div>

      <!-- Card 5: Tools & Ecosystem Matrix (Spans full 3 cols) -->
      <div
        class="md:col-span-3 p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden space-y-4"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardMouseMove"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 font-bold text-sm" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
            <WrenchScrewdriverIcon class="w-4 h-4 text-violet-400" />
            <span>Analysis, Design & Systems Toolchain</span>
          </div>
          <span class="text-xs font-mono text-slate-400">Production Proven</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          <div
            v-for="tool in Skills_Tools"
            :key="tool.name"
            class="group/tool p-3 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col items-center text-center gap-2"
            :class="isDark 
              ? 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-violet-400/40 text-slate-200' 
              : 'border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-violet-400 text-slate-800 shadow-xs'"
          >
            <div class="p-2 rounded-xl transition-colors" :class="isDark ? 'bg-white/5 group-hover/tool:bg-white/10' : 'bg-white group-hover/tool:bg-violet-50 shadow-xs'">
              <PlatformIcon :name="tool.icon || tool.name" size="md" interactive />
            </div>
            <div>
              <div class="text-xs font-semibold tracking-tight">{{ tool.name }}</div>
              <div class="text-[10px] font-mono" :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ tool.desc }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import PlatformIcon from '@/components/common/PlatformIcon.vue'
import {
  MapPinIcon,
  CheckCircleIcon,
  ServerStackIcon,
  ChartBarSquareIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

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
