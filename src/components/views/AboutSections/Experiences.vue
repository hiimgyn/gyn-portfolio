<template>
  <div class="space-y-6">
    <!-- Header Summary -->
    <div class="p-6 sm:p-8 rounded-3xl border transition-all duration-200"
      :class="[
        isDark 
          ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
      ]"
    >
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-xl bg-violet-500/10 text-violet-300">
          <BriefcaseIcon class="w-5 h-5" />
        </div>
        <h2 class="text-xl font-bold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
          {{ $t('experience.keyAchievements') }}
        </h2>
      </div>
      <p class="text-sm leading-relaxed" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
        {{ $t('experience.experienceSummaryContent') }}
      </p>
    </div>

    <!-- Timeline List -->
    <div class="relative pl-6 sm:pl-8 border-l-2 space-y-8"
      :class="isDark ? 'border-violet-900/40' : 'border-violet-200'"
    >
      <div
        v-for="exp in experiences"
        :key="exp.id"
        class="relative group"
      >
        <!-- Glowing Timeline Node -->
        <div class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 bg-white dark:bg-[#0b0d14] flex items-center justify-center transition-transform duration-300 group-hover:scale-125 group-hover:border-violet-400 shadow-md"
          :class="isDark ? 'border-violet-400' : 'border-violet-500'"
        >
          <span class="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
        </div>

        <!-- Experience Card with Mouse Hover Glow -->
        <div
          class="p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md"
          :class="[
            isDark 
              ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
              : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
          ]"
          @mousemove="handleCardMouseMove"
        >
          <!-- Top Row: Logo, Role, Company, Period -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
            :class="isDark ? 'border-white/5' : 'border-slate-200/60'"
          >
            <div class="flex items-center gap-4">
              <img
                :src="exp.logo"
                :alt="$t(exp.company)"
                class="w-12 h-12 object-contain rounded-xl p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm"
              />
              <div>
                <h3 class="text-lg sm:text-xl font-bold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
                  {{ $t(exp.title) }}
                </h3>
                <p class="text-sm font-semibold tracking-wide" :class="isDark ? 'text-violet-300' : 'text-violet-700'">
                  {{ $t(exp.company) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-auto">
              <button
                @click="toggleDeliverable(exp.id)"
                class="px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all duration-200 flex items-center gap-1.5"
                :class="expandedExpId === exp.id 
                  ? 'bg-violet-600 text-white border-violet-500 shadow-sm' 
                  : (isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-violet-300' : 'border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-800')"
              >
                <span>{{ expandedExpId === exp.id ? 'Close Specs' : 'Inspect Deliverable' }}</span>
                <span>{{ expandedExpId === exp.id ? '▲' : '▼' }}</span>
              </button>

              <div class="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border"
                :class="isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-violet-50/70 border-violet-200 text-violet-800'"
              >
                {{ exp.period }}
              </div>
            </div>
          </div>

          <!-- Expandable Tangible Deliverable Artifact Box -->
          <transition name="toast-fade">
            <div v-if="expandedExpId === exp.id && exp.deliverable"
              class="my-4 p-4 rounded-2xl border font-mono text-xs space-y-2 bg-[#080a14] border-violet-500/30 text-slate-300 shadow-inner"
            >
              <div class="flex items-center justify-between pb-1.5 border-b border-white/10 text-[11px]">
                <span class="text-violet-300 font-bold flex items-center gap-1.5">
                  <PlatformIcon name="prd" size="xs" />
                  <span>DELIVERABLE // {{ exp.deliverable.title }}</span>
                </span>
                <span class="text-emerald-400 font-semibold">VERIFIED PRODUCTION</span>
              </div>
              <p class="text-xs leading-relaxed text-slate-300">{{ exp.deliverable.highlight }}</p>
              <div class="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-400">
                <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10">Scope: {{ exp.deliverable.scope }}</span>
                <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10">Impact: {{ exp.deliverable.impact }}</span>
              </div>
            </div>
          </transition>

          <!-- Achievements -->
          <div class="py-4 space-y-2.5">
            <h4 class="text-xs font-mono uppercase tracking-wider font-semibold" :class="isDark ? colors.dark.text.muted : colors.light.text.muted">
              Key Contributions & BA Impact
            </h4>
            <ul class="space-y-2.5">
              <li
                v-for="(ach, aIdx) in exp.achievements"
                :key="aIdx"
                class="flex items-start text-xs sm:text-sm leading-relaxed"
                :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary"
              >
                <span class="mr-2.5 text-violet-400 font-bold">•</span>
                <span>{{ $t(ach) }}</span>
              </li>
            </ul>
          </div>

          <!-- Tech Stack Tags -->
          <div class="flex flex-wrap gap-2 pt-3 border-t" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
            <span
              v-for="tech in exp.technologies"
              :key="tech"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border font-medium transition-all"
              :class="isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:border-violet-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-violet-500 hover:text-slate-900'"
            >
              <PlatformIcon :name="tech" size="xs" onlyKnown />
              <span>{{ tech }}</span>
            </span>
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
import { BriefcaseIcon } from '@heroicons/vue/24/outline'
import PlatformIcon from '@/components/common/PlatformIcon.vue'

import hdLogo from '@/assets/Images/hd.png'
import acacyLogo from '@/assets/Images/acacy.webp'
import xteamLogo from '@/assets/Images/xteam.jpg'

const store = useStore()
const isDark = computed(() => store.isDark)
const expandedExpId = ref(null)

const toggleDeliverable = (id) => {
  expandedExpId.value = expandedExpId.value === id ? null : id
}

const experiences = ref([
  {
    id: 1,
    title: 'experience.hd.title',
    company: 'experience.hd.company',
    logo: hdLogo,
    period: '11/2022 - 12/2024',
    achievements: [
      'experience.hd.achievement1',
      'experience.hd.achievement2',
      'experience.hd.achievement3',
      'experience.hd.achievement4',
      'experience.hd.achievement5'
    ],
    deliverable: {
      title: 'Digital Loan Origination & BPMN 2.0 State Machine',
      highlight: 'Engineered 50+ User Stories with Gherkin acceptance criteria, modeled automated risk evaluation workflows, and validated 100% test coverage during bank UAT signoff.',
      scope: 'Core Banking API & Mobile Ingress',
      impact: 'Zero Critical UAT Defects & -35% Disbursal Time'
    },
    technologies: ['BRD / PRD', 'BPMN 2.0', 'Figma', '.NET 8', 'SQL Server', 'RESTful API', 'UAT Testing']
  },
  {
    id: 2,
    title: 'experience.acacy.title',
    company: 'experience.acacy.company',
    logo: acacyLogo,
    period: '06/2022 - 10/2022',
    achievements: [
      'experience.acacy.achievement1',
      'experience.acacy.achievement2',
      'experience.acacy.achievement3',
      'experience.acacy.achievement4'
    ],
    deliverable: {
      title: 'Multi-Store Inventory Audit & Delta PIVOT Pipeline',
      highlight: 'Designed 3NF relational data schema and optimized SQL Stored Procedures using PIVOT transforms, accelerating stock discrepancy reconciliation across 200+ retail stores.',
      scope: 'Retail ERP & Field Scanning',
      impact: '-75% Daily Variance Reconciliation Latency'
    },
    technologies: ['Data Analysis', 'SQL PIVOT', 'SQL Server', 'Stored Procedures', '.NET 8', 'Dapper ORM']
  },
  {
    id: 3,
    title: 'experience.xteam.title',
    company: 'experience.xteam.company',
    logo: xteamLogo,
    period: '2020 - 2022',
    achievements: [
      'experience.xteam.achievement1',
      'experience.xteam.achievement2',
      'experience.xteam.achievement3'
    ],
    deliverable: {
      title: 'Logistics Partner Webhook Contracts & Event Architecture',
      highlight: 'Authored Swagger/OpenAPI integration specifications and established idempotency token standards for 3rd-party shipping webhooks with retry circuit breakers.',
      scope: 'B2B Partner Integrations',
      impact: '15,000+ Daily Webhook Events with 99.98% SLA'
    },
    technologies: ['Systems Architecture', 'Capacity Planning', 'Telemetry Logs', 'Partner Integration', 'C#', 'Linux']
  }
])

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