<template>
  <div class="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">
    <!-- Top Segmented Navigation Tabs -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-6"
      :class="isDark ? 'border-white/10' : 'border-slate-200'"
    >
      <div
        class="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-xl"
        :class="isDark 
          ? 'bg-[#11131f]/90 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]' 
          : 'bg-violet-50/70 border-violet-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]'"
      >
        <button
          v-for="sec in sections"
          :key="sec.id"
          @click="selectSection(sec.id)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95',
            currentSection === sec.id
              ? (isDark 
                  ? 'bg-violet-600 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(139,92,246,0.35)]' 
                  : 'bg-white text-violet-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_4px_rgba(0,0,0,0.06)]')
              : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50')
          ]"
        >
          <component :is="sec.icon" class="w-4 h-4" />
          <span>{{ $t(sec.label) }}</span>
        </button>
      </div>

      <!-- Quick Contact Info -->
      <div
        class="hidden lg:flex items-center gap-4 text-xs font-mono"
        :class="isDark ? 'text-slate-400' : 'text-slate-600'"
      >
        <a :href="`mailto:${email}`" class="hover:text-violet-300 transition-colors flex items-center gap-1.5">
          <EnvelopeIcon class="w-4 h-4 text-amber-400" />
          <span>{{ email }}</span>
        </a>
        <span>•</span>
        <span class="flex items-center gap-1.5">
          <MapPinIcon class="w-4 h-4 text-violet-400" />
          <span>{{ $t('about.address') }}</span>
        </span>
      </div>
    </div>

    <!-- Active Section Content with GSAP Transition -->
    <main ref="contentContainer" class="transition-all duration-300">
      <Content :section="currentSection" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from '@/stores/theme'
import Content from '@/components/views/AboutSections/Content.vue'
import {
  UserCircleIcon,
  BriefcaseIcon,
  FolderIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline'

const store = useStore()
const isDark = computed(() => store.isDark)

const email = 'nguyenminhhung.work@gmail.com'

const sections = [
  { id: 'overview', label: 'about.overview', icon: UserCircleIcon },
  { id: 'experiences', label: 'about.experiences', icon: BriefcaseIcon },
  { id: 'projects', label: 'about.projects', icon: FolderIcon }
]

const currentSection = ref('overview')

const selectSection = (sectionId) => {
  currentSection.value = sectionId
}

onMounted(() => {
  const saved = localStorage.getItem('selectedSection')
  if (saved && sections.some(s => s.id === saved)) {
    currentSection.value = saved
  }
})

watch(currentSection, (newSection) => {
  localStorage.setItem('selectedSection', newSection)
})
</script>
