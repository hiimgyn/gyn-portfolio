<template>
  <div class="min-h-[calc(100vh-4rem-1.4rem)] flex items-center justify-center">
    <div :class="[
      'max-w mx-auto p-6 min-h-full justify-center items-center',
      isDark ? colors.dark.text.primary : colors.light.text.primary
    ]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch ">
        <!-- Cột trái: Profile và thông tin cá nhân -->
        <div :class="[
          'p-8 rounded-lg border',
          isDark ? colors.dark.background.primary : colors.light.background.primary,
          isDark ? colors.dark.border.primary : colors.light.border.primary
        ]">
          <!-- Profile Image -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <img src="../../../assets/Images/avatar.png" alt="Gyn Nguyen"
                class="w-32 h-32 rounded-full object-cover border-4 border-purple-500" />
            </div>
          </div>

          <!-- Name and Title -->
          <div class="text-center mb-6">
            <h1 :class="[
              'text-2xl font-bold mb-2',
              isDark ? colors.dark.text.primary : colors.light.text.primary
            ]">
              {{ $t('about.name') }}
            </h1>
            <p :class="[
              'text-lg mb-2',
              isDark ? 'text-purple-400' : 'text-purple-600'
            ]">
              {{ $t('about.role') }}
            </p>
            <div class="flex items-center justify-center text-sm text-gray-500">
              <span class="mr-2">📍</span>
              <span> {{ $t('about.address') }}</span>
            </div>
          </div>

          <!-- Bio -->
          <div class="mb-6">
            <p :class="[
              'text-sm leading-relaxed',
              isDark ? colors.dark.text.secondary : colors.light.text.secondary
            ]">
              {{ $t('about.professionalIntroContent') }}
            </p>
          </div>

          <!-- Skills Section -->
          <div class="space-y-4">
            <h3 :class="[
              'text-lg font-semibold mb-4',
              isDark ? colors.dark.text.primary : colors.light.text.primary
            ]">
              {{ $t('about.skills') }}
            </h3>

            <div>
              <h4 :class="[
                'font-medium mb-3',
                isDark ? colors.dark.text.primary : colors.light.text.primary
              ]">
                {{ $t('about.skill1') }}
              </h4>              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="skill in Skills_1" :key="skill" :class="[
                  'px-3 py-1 text-xs rounded-full border',
                  isDark ? colors.dark.badge.tech.blue : colors.light.badge.tech.blue
                ]">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div>
              <h4 :class="[
                'font-medium mb-3',
                isDark ? colors.dark.text.primary : colors.light.text.primary
              ]">
                {{ $t('about.skill2') }}
              </h4>              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="skill in Skills_2" :key="skill" :class="[
                  'px-3 py-1 text-xs rounded-full border',
                  isDark ? colors.dark.badge.tech.green : colors.light.badge.tech.green
                ]">
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Others Skills -->
            <div>
              <h4 :class="[
                'font-medium mb-3',
                isDark ? colors.dark.text.primary : colors.light.text.primary
              ]">
                {{ $t('about.skill3') }}
              </h4>              <div class="flex flex-wrap gap-2">
                <span v-for="skill in Skills_3" :key="skill" :class="[
                  'px-3 py-1 text-xs rounded-full border',
                  isDark ? colors.dark.badge.tech.purple : colors.light.badge.tech.purple
                ]">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải: Mô tả chi tiết và ASCII art -->
        <div class="space-y-6">
          <!-- Detailed Description -->
          <div :class="[
            'p-6 rounded-lg border',
            isDark ? colors.dark.background.primary : colors.light.background.primary,
            isDark ? colors.dark.border.primary : colors.light.border.primary
          ]">
            <p :class="[
              'text-sm leading-relaxed pb-2',
              isDark ? colors.dark.text.secondary : colors.light.text.secondary
            ]">
              {{ $t('about.visionContent_1') }}
            </p>
            <p :class="[
              'text-sm leading-relaxed pb-2',
              isDark ? colors.dark.text.secondary : colors.light.text.secondary
            ]">
              {{ $t('about.visionContent_2') }}
            </p>
            <p :class="[
              'text-sm leading-relaxed',
              isDark ? colors.dark.text.secondary : colors.light.text.secondary
            ]">
              {{ $t('about.visionContent_3') }}
            </p>
          </div>

          <!-- ASCII Art Computer -->
          <div :class="[
            'p-2 sm:p-6 rounded-lg border font-mono',
            'text-[6px] xs:text-[8px] sm:text-xs',
            'mx-auto w-full max-w-full',
            'overflow-x-auto',
            isDark ? colors.dark.background.primary : colors.light.background.primary,
            isDark ? colors.dark.border.primary : colors.light.border.primary,
            isDark ? 'text-green-400' : 'text-gray-600'
          ]">
            <pre class="min-w-max whitespace-pre items-center justify-center">
              <p>
                                                    ⢀⠤⡀
                               ⢠⠊⣉⠒⠤⢀⡀          ⡐⢁⠴⢜⢄
                               ⡎⢸  ⠉⠐⠢⢌⠑⢄     ⡸ ⡆   ⠣⠱⡀
                               ⡇⢸       ⣀⠗  ⠉⠉⠁  ⠙⠢⠤⡀⢃⢱
                               ⡇⠘⣄⢀⠔⠉                   ⠈⠁⠘⡄
                               ⢇    ⠁                         ⠘⡄
                               ⢸            ⢀⣀⣀⡀       ⢀⣀⣀⡀  ⢣
                               ⡸        ⢴⣾⡿⠿⠽⠇       ⠘⠛⠛⠛   ⠈⢄
                              ⠰⡁            ⢠⠒⠢⡀⠈⠒⠊        ⡠⢄ ⡘
                               ⠱⣀         ⢀⠜   ⠇          ⢀⠔⠁ ⡏
                                   ⠑⠤⢄⣀⠔⠁    ⡜         ⠊⠁  ⢀⠜
                        ________________________________________________
                      /                                                \
                      |    _________________________________________     |
                      |   |                                         |    |
                      |   |  Gyn:\> _                               |    |
                      |   |                                         |    |
                      |   |                                         |    |
                      |   |                                         |    |
                      |   |                                         |    |
                      |   |                                         |    |
                      |   |                                         |    |
                      |   |                                         |    |
                      |   |                                         |    |
                      |   |_________________________________________|    |
                      |                                                  |
                      \_________________________________________________/
                              \___________________________________/
                            ___________________________________________
                        _-'    .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.  --- `-_
                      _-'.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.--.  .-.-.`-_
                  _-'.-.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-`__`. .-.-.-.`-_
                _-'.-.-.-.-. .-----.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-----. .-.-.-.-.`-_
            _-'.-.-.-.-.-. .---.-. .-------------------------. .-.---. .---.-.-.-.`-_
            :-------------------------------------------------------------------------:
            `---._.-------------------------------------------------------------._.---'
</p>
          </pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from '@vue/reactivity'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const isDark = computed(() => store.isDark)

// Skills data
const Skills_1 = ['.NET 8', 'Node.js', 'Laravel', 'Lua', 'Microservice', 'RESTful API', 'MySQL', 'SQL Server', 'NoSQL']
const Skills_2 = ['OOP', 'Functional Programming', 'Design Patterns', 'Data Structures']
const Skills_3 = ["Git", "Github", "PowerBI", "Jira", "Visio", "Postman", "Microsoft Office", "Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe After Effects", "Adobe Premiere Pro"]

defineProps({
  section: String
})
</script>
