<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border transition-all duration-200"
      :class="[
        isDark 
          ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
      ]"
    >
      <div class="space-y-1">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight" :class="isDark ? colors.dark.text.primary : colors.light.text.primary">
          Featured Systems & Applications
        </h2>
        <p class="text-xs sm:text-sm max-w-xl" :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary">
          Selected works showcasing business process analysis, system integration, database architecture, and software development.
        </p>
      </div>

      <div class="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border"
        :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'"
      >
        <span>✨ 3D Interactive Cards</span>
      </div>
    </div>

    <!-- Projects Grid with 3D Tilt & Mouse Spotlight -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card rounded-3xl border overflow-hidden transition-all duration-200 relative group flex flex-col justify-between"
        :class="[
          isDark 
            ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
            : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
        ]"
        @mousemove="handleCardTilt($event)"
        @mouseleave="handleCardReset($event)"
      >
        <!-- Project Preview Image -->
        <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 border-b"
          :class="isDark ? 'border-white/10' : 'border-slate-200'"
        >
          <img
            :src="project.image"
            :alt="$t(project.name)"
            class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70"></div>
          
          <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-md text-xs font-mono font-medium backdrop-blur-md bg-black/60 text-white border border-white/20">
              Deliverable #0{{ project.id }}
            </span>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <h3 class="text-lg sm:text-xl font-bold tracking-tight group-hover:text-violet-400 transition-colors"
              :class="isDark ? colors.dark.text.primary : colors.light.text.primary"
            >
              {{ $t(project.name) }}
            </h3>
            <p class="text-xs sm:text-sm leading-relaxed"
              :class="isDark ? colors.dark.text.secondary : colors.light.text.secondary"
            >
              {{ $t(project.description) }}
            </p>
          </div>

          <!-- Technologies & Action Links -->
          <div class="space-y-4 pt-3 border-t" :class="isDark ? 'border-white/5' : 'border-slate-200/60'">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border font-medium"
                :class="isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'"
              >
                <PlatformIcon :name="tech" size="xs" onlyKnown />
                <span>{{ tech }}</span>
              </span>
            </div>

            <div class="flex items-center justify-between pt-1">
              <a
                v-if="project.github && project.github !== '#'"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200"
                :class="isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white hover:border-violet-400' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-900 hover:border-violet-500'"
              >
                <PlatformIcon name="github" size="xs" />
                <span>Source Code</span>
              </a>
              <span v-else class="text-xs font-mono text-slate-500 flex items-center gap-1">
                <span>🔒 Enterprise Internal</span>
              </span>

              <button
                @click="openProjectModal(project)"
                class="text-xs text-violet-400 hover:text-violet-300 font-semibold group-hover:translate-x-1 transition-all inline-flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Inspect Specs</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Architecture & BA Deliverable Inspection Modal -->
    <transition name="toast-fade">
      <div
        v-if="selectedProject"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        @click.self="selectedProject = null"
      >
        <div
          class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl transition-all"
          :class="isDark ? 'bg-[#0f1222] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'"
        >
          <!-- Top Row -->
          <div class="flex items-center justify-between border-b pb-4" :class="isDark ? 'border-white/10' : 'border-slate-200'">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-violet-600 text-white">
                DELIVERABLE #0{{ selectedProject.id }}
              </span>
              <span class="text-xs font-mono text-emerald-400">● VERIFIED_SPEC</span>
            </div>
            <button
              @click="selectedProject = null"
              class="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-mono transition-colors cursor-pointer"
              :class="isDark ? 'border-white/10 hover:bg-white/10 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'"
            >
              ✕
            </button>
          </div>

          <!-- Project Title & Image -->
          <div class="space-y-3">
            <h2 class="text-2xl font-bold tracking-tight">
              {{ $t(selectedProject.name) }}
            </h2>
            <div class="relative h-48 sm:h-56 rounded-2xl overflow-hidden border" :class="isDark ? 'border-white/10' : 'border-slate-200'">
              <img :src="selectedProject.image" :alt="$t(selectedProject.name)" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Description & Scope -->
          <div class="space-y-2">
            <h4 class="text-xs font-mono uppercase tracking-wider font-semibold text-violet-400">
              Executive Problem & Scope
            </h4>
            <p class="text-sm leading-relaxed" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
              {{ $t(selectedProject.description) }}
            </p>
          </div>

          <!-- Technical Toolchain -->
          <div class="space-y-2">
            <h4 class="text-xs font-mono uppercase tracking-wider font-semibold text-violet-400">
              Architecture & Systems Toolchain
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in selectedProject.technologies"
                :key="tech"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium"
                :class="isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'"
              >
                <PlatformIcon :name="tech" size="xs" onlyKnown />
                <span>{{ tech }}</span>
              </span>
            </div>
          </div>

          <!-- Action Footer -->
          <div class="pt-4 border-t flex items-center justify-between" :class="isDark ? 'border-white/10' : 'border-slate-200'">
            <span class="text-xs font-mono text-slate-400">STATUS: PRODUCTION_READY</span>
            <div class="flex items-center gap-3">
              <a
                v-if="selectedProject.github && selectedProject.github !== '#'"
                :href="selectedProject.github"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-sm active:scale-95"
              >
                <PlatformIcon name="github" size="xs" />
                <span>View Repository</span>
              </a>
              <button
                @click="selectedProject = null"
                class="px-4 py-2 rounded-xl border text-xs font-mono font-medium transition-colors cursor-pointer"
                :class="isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { gsap } from 'gsap'
import PlatformIcon from '@/components/common/PlatformIcon.vue'

// Import project images
import portfolioImg from '@/assets/Images/projects/portfolio.png'
import shopImg from '@/assets/Images/projects/shop.png'
import tunaImg from '@/assets/Images/projects/tuna.png'
import project1Img from '@/assets/Images/projects/project1.png'
import landingImg from '@/assets/Images/projects/landing.png'

const store = useStore()
const isDark = computed(() => store.isDark)
const selectedProject = ref(null)

const openProjectModal = (proj) => {
  selectedProject.value = proj
}

const projects = ref([
  {
    id: 1,
    name: 'projects.project1.name',
    description: 'projects.project1.description',
    image: portfolioImg,
    technologies: ["Vue 3", "Three.js", "GSAP", "BPMN Sandbox", "Vite"],
    github: 'https://github.com/hiimgyn/gyn-portfolio',
  },
  {
    id: 2,
    name: 'projects.project2.name',
    description: 'projects.project2.description',
    image: shopImg,
    technologies: ["ERD 3NF", "SQL Server", "Inventory Workflow", "Java MVC"],
    github: 'https://github.com/hiimgyn/mobile-store-management',
  },
  {
    id: 3,
    name: 'projects.project3.name',
    description: 'projects.project3.description',
    image: tunaImg,
    technologies: ["Custom TCP Protocol", ".NET 8", "Concurrency Flow", "C#"],
    github: 'https://github.com/hiimgyn/TunaApp',
  },
  {
    id: 4,
    name: 'projects.project4.name',
    description: 'projects.project4.description',
    image: project1Img,
    technologies: ["BRD/PRD", "API Contracts", "SQL Server", "Audit Workflows"],
    github: '#',
  },
  {
    id: 5,
    name: 'projects.project5.name',
    description: 'projects.project5.description',
    image: landingImg,
    technologies: ["User Journey Mapping", "Conversion Funnel", "Node.js", "SEO"],
    github: 'https://github.com/hiimgyn/MasterDX_Landing',
  },
])

// 3D Tilt interaction with GSAP
const handleCardTilt = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)

  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const tiltX = ((x - centerX) / centerX) * 6
  const tiltY = -((y - centerY) / centerY) * 6

  gsap.to(card, {
    rotateX: tiltY,
    rotateY: tiltX,
    transformPerspective: 1000,
    duration: 0.3,
    ease: 'power1.out'
  })
}

const handleCardReset = (e) => {
  const card = e.currentTarget
  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.5,
    ease: 'power2.out'
  })
}
</script>

<style scoped>
.project-card {
  transform-style: preserve-3d;
  will-change: transform;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(350px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(196, 181, 253, 0.1), transparent 80%);
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.project-card:hover::before {
  opacity: 1;
}
</style>