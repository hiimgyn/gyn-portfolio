<template>
  <div class="min-h-[calc(100vh-4rem-1.4rem)] flex items-center justify-left">
    <div :class="[
      'max-w p-6 min-h-full',
      isDark ? colors.dark.text.primary : colors.light.text.primary
    ]">
      <!-- Timeline Container -->
      <div class="relative">
        <!-- Timeline Line -->
        <div :class="[
          'absolute left-8 top-0 bottom-0 w-0.5',
          isDark ? 'bg-purple-500' : 'bg-purple-600'
        ]"></div>

        <!-- Experience Items -->
        <div class="space-y-8">
          <div v-for="(exp, index) in experiences" :key="exp.id" class="relative flex items-start">
            <!-- Timeline Dot -->
            <div :class="[
              'absolute left-4 w-8 h-8 rounded-full border-2 z-10 overflow-hidden bg-white shadow-md',
              isDark ? 'border-purple-500' : 'border-purple-600'
            ]">
              <img :src="exp.logo" :alt="$t(exp.company) + ' logo'" class="w-full h-full object-contain p-1"
                @error="handleImageError" />
            </div>
            <!-- Experience Card -->
            <div :class="[
              'ml-16 p-6 rounded-lg border w-full transition-all duration-300 hover:shadow-lg',
              isDark ? colors.dark.background.primary : colors.light.background.primary,
              isDark ? colors.dark.border.primary : colors.light.border.primary
            ]">
              <!-- Company and Period -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 :class="[
                    'text-xl font-bold mb-1',
                    isDark ? colors.dark.text.primary : colors.light.text.primary
                  ]">
                    {{ $t(exp.title) }}
                  </h3>
                  <p :class="[
                    'text-lg font-medium',
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  ]">
                    {{ $t(exp.company) }}
                  </p>
                </div>
                <div :class="[
                  'text-sm px-3 py-1 rounded-full border mt-2 sm:mt-0',
                  isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                ]">
                  {{ exp.period }}
                </div>
              </div>

              <!-- Achievements -->
              <div class="mb-6">
                <h4 :class="[
                  'font-semibold mb-3',
                  isDark ? colors.dark.text.primary : colors.light.text.primary
                ]">
                  {{ $t('experience.keyAchievements') }}
                </h4>
                <ul class="space-y-2">
                  <li v-for="(achievement, achIndex) in exp.achievements" :key="achIndex" :class="[
                    'text-sm leading-relaxed flex items-start',
                    isDark ? colors.dark.text.secondary : colors.light.text.secondary
                  ]">
                    <span :class="[
                      'inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0',
                      isDark ? 'bg-purple-400' : 'bg-purple-600'
                    ]"></span>
                    {{ $t(achievement) }}
                  </li>
                </ul>
              </div>

              <!-- Technologies -->
              <div v-if="exp.technologies">
                <h4 :class="[
                  'font-semibold mb-3',
                  isDark ? colors.dark.text.primary : colors.light.text.primary
                ]">
                  {{ $t('experience.technologiesUsed') }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tech in exp.technologies" :key="tech" :class="[
                    'px-3 py-1 text-xs rounded-full border font-medium',
                    getTechColor(index)
                  ]">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from '@vue/reactivity'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { useI18n } from 'vue-i18n'

import hdLogo from '@/assets/Images/hd.png'
import acacyLogo from '@/assets/Images/acacy.webp'
import xteamLogo from '@/assets/Images/xteam.jpg'

const { t } = useI18n()
const store = useStore()
const isDark = computed(() => store.isDark)

defineProps({
  section: String
})

// Tech badge colors based on experience index
const getTechColor = (index) => {
  const colorSchemes = [
    isDark.value ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-700',
    isDark.value ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-green-100 border-green-300 text-green-700',
    isDark.value ? 'bg-purple-900/30 border-purple-700 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-700'
  ]
  return colorSchemes[index % colorSchemes.length]
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
    technologies: ['.NET 8', 'PHP', 'JavaScript', 'Figma', 'SQL', 'System Management']
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
      'experience.acacy.achievement4',
    ],
    technologies: ['.NET 8', 'Dapper', 'SQL', 'SQL PIVOT', 'RESTful API']
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
      'experience.xteam.achievement3',
    ],
    technologies: ['Lua', 'JavaScript', 'C#', 'FiveM', 'Server Management', 'Community Management']
  }
])
const handleImageError = (event) => {
  // Fallback về dot mặc định nếu logo không tải được
  event.target.style.display = 'none'
  event.target.parentElement.innerHTML = `
    <div class="w-full h-full rounded-full ${isDark.value ? 'bg-purple-500' : 'bg-purple-600'}"></div>
  `
}

</script>

<style scoped>
/* Timeline responsive adjustments */
@media (max-width: 640px) {
  .ml-16 {
    margin-left: 3.5rem;
    /* Tăng margin để chừa chỗ cho logo lớn hơn */
  }

  .left-8 {
    left: 1.25rem;
  }

  .left-4 {
    left: 1rem;
  }
}

/* Hover effect cho logo */
.timeline-logo:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
</style>
