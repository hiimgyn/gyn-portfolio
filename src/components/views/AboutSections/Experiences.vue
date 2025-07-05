<template>
  <div class="min-h-[calc(100vh-4rem-1.4rem)] flex items-center justify-center">
    <div :class="[
      'w-full p-4 sm:p-6',
      isDark ? colors.dark.text.primary : colors.light.text.primary
    ]">
      <div class="relative overflow-visible max-w mx-auto">
        <!-- Central Line (hidden on mobile) -->
        <div :class="[
          'hidden sm:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.75 z-0',
          isDark ? colors.dark.background.line : colors.light.background.line
        ]"></div>

        <!-- Experience Items -->
        <div class="space-y-8 sm:space-y-12">
          <div
            v-for="(exp, index) in experiences"
            :key="exp.id"
            class="relative w-full flex items-start"
            :class="[
              index % 2 === 0 ? 'justify-start sm:justify-start' : 'justify-start sm:justify-end',
              'z-10'
            ]"
          >
            <!-- Timeline Dot (hidden on mobile) -->
            <div :class="[
              'hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-8 sm:w-10 rounded-full border-2 bg-white shadow-md h-8 sm:h-10',
              isDark ? colors.dark.border.line : colors.light.border.line
            ]">
              <img
                :src="exp.logo"
                :alt="$t(exp.company) + ' logo'"
                class="w-full h-full object-contain p-1"
                @error="handleImageError"
              />
            </div>

            <!-- Experience Card -->
            <div :class="[
              'w-full sm:w-[47.5%] p-6 rounded-lg transition-all duration-300 hover:shadow-lg z-10',
              index % 2 === 0 ? 'sm:mr-3' : 'sm:ml-12',
              isDark ? colors.dark.background.primary : colors.light.background.primary,
              isDark ? colors.dark.border.primary : colors.light.border.primary
            ]">
              <!-- Company and Period -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 :class="[
                    'text-xl font-bold mb-1',
                    isDark ? colors.dark.text.primary : colors.light.text.primary
                  ]">{{ $t(exp.title) }}</h3>
                  <p :class="[
                    'text-lg font-medium',
                    isDark ? colors.dark.text.link : colors.light.text.link
                  ]">{{ $t(exp.company) }}</p>
                </div>
                <div :class="[
                  'text-sm px-3 py-1 rounded-full border mt-2 sm:mt-0',
                  isDark
                    ? `${colors.dark.background.tertiary} ${colors.dark.border.secondary} ${colors.dark.text.secondary}`
                    : `${colors.light.background.tertiary} ${colors.light.border.secondary} ${colors.light.text.secondary}`
                ]">{{ exp.period }}</div>
              </div>

              <!-- Achievements -->
              <div class="mb-6">
                <h4 :class="[
                  'font-semibold mb-2',
                  isDark ? colors.dark.text.primary : colors.light.text.primary
                ]">{{ $t('experience.keyAchievements') }}</h4>
                <ul class="space-y-2">
                  <li v-for="(ach, aIdx) in exp.achievements" :key="aIdx" class="flex items-baseline">
                    <span :class="[
                      'w-2 h-2 rounded-full mt-1 mr-3 flex-shrink-0',
                      isDark ? colors.dark.background.line : colors.light.background.line
                    ]"></span>
                    <p :class="[
                      'text-sm leading-relaxed',
                      isDark ? colors.dark.text.secondary : colors.light.text.secondary
                    ]">{{ $t(ach) }}</p>
                  </li>
                </ul>
              </div>

              <!-- Technologies -->
              <div v-if="exp.technologies" class="flex flex-wrap gap-2">
                <span v-for="tech in exp.technologies" :key="tech" :class="[
                  'px-3 py-1 text-xs rounded-full border font-medium',
                  getTechColor(index)
                ]">{{ tech }}</span>
              </div>
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
import { useI18n } from 'vue-i18n'

import hdLogo from '@/assets/Images/hd.png'
import acacyLogo from '@/assets/Images/acacy.webp'
import xteamLogo from '@/assets/Images/xteam.jpg'

const { t } = useI18n()
const store = useStore()
const isDark = computed(() => store.isDark)

const experiences = ref([
  { id: 1, title: 'experience.hd.title', company: 'experience.hd.company', logo: hdLogo, period: '11/2022 - 12/2024', achievements: ['experience.hd.achievement1','experience.hd.achievement2','experience.hd.achievement3','experience.hd.achievement4','experience.hd.achievement5'], technologies: ['.NET 8','PHP','JavaScript','Figma','SQL','System Management'] },
  { id: 2, title: 'experience.acacy.title', company: 'experience.acacy.company', logo: acacyLogo, period: '06/2022 - 10/2022', achievements: ['experience.acacy.achievement1','experience.acacy.achievement2','experience.acacy.achievement3','experience.acacy.achievement4'], technologies: ['.NET 8','Dapper','SQL','SQL PIVOT','RESTful API'] },
  { id: 3, title: 'experience.xteam.title', company: 'experience.xteam.company', logo: xteamLogo, period: '2020 - 2022', achievements: ['experience.xteam.achievement1','experience.xteam.achievement2','experience.xteam.achievement3'], technologies: ['Lua','JavaScript','C#','FiveM','Server Management','Community Management'] }
])

// Fallback for broken logos
const handleImageError = (event) => {
  event.target.style.display = 'none'
  const fallback = document.createElement('div')
  fallback.className = `w-full h-full rounded-full ${isDark.value ? colors.dark.background.overlay : colors.light.background.overlay}`
  event.target.parentElement.appendChild(fallback)
}

// Tech badge colors based on index
const getTechColor = (index) => {
  const schemes = [
    isDark.value ? colors.dark.pattern.color : colors.light.pattern.color,
    isDark.value ? colors.dark.span.line : colors.light.span.line,
    isDark.value ? colors.dark.span.error : colors.light.span.error
  ]
  return schemes[index % schemes.length]
}
</script>

<style scoped>
@media (max-width: 640px) {
  /* Mobile vertical spacing */
  .space-y-8 > * {
    margin-bottom: 1.5rem !important;
  }
}

/* Hover scale for dots */
div[role="img"] img:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
</style>