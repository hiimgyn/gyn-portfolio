<template>
  <footer 
    :class="[
      'py-1 w-full backdrop-blur-sm border-t',
      isDark ? colors.dark.background.primary : colors.light.background.primary,
      isDark ? colors.dark.border.primary : colors.light.border.primary
    ]"
  >
    <nav class="max-w mx-auto px-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-0">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0 w-full md:w-auto justify-self-start">
        <!-- Divider border -->
        <div :class="[
          'md:pr-15 border-b md:border-b-0 md:border-r w-full md:w-auto text-center md:text-left pb-4 md:pb-0',
          isDark ? colors.dark.border.primary : colors.light.border.primary
        ]">
          <span :class="[
            'text-sm font-medium',
            isDark ? colors.dark.text.primary : colors.light.text.primary
          ]">
            find me in:
          </span>
        </div>
        <ul class="flex flex-wrap justify-center md:justify-start items-center w-full md:w-auto md:ml-6">
          <li v-for="(social, index) in socialLinks" 
              :key="index"
              :class="[
                'border-r',
                isDark ? colors.dark.border.primary : colors.light.border.primary
              ]">
            <a :href="social.url" 
               target="_blank"
               :class="[
                 'px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2',
                 isDark ? colors.dark.text.secondary : colors.light.text.secondary,
                 isDark ? colors.dark.text.hover : colors.light.text.hover
               ]">
              <component 
                :is="social.icon" 
                :class="[
                  'w-4 h-4',
                  isDark 
                    ? colors.dark.socialIcons.all 
                    : colors.light.socialIcons[social.name],
                  isDark 
                    ? colors.dark.socialIcons.hover 
                    : colors.light.socialIcons.hover[social.name]
                ]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              />
            </a>
          </li>
          <!-- GitHub Icon - Mobile Only -->
          <li class="md:hidden" :class="[
                'border-r',
                isDark ? colors.dark.border.primary : colors.light.border.primary
              ]">
            <a href="https://github.com/hiimgyn" 
               target="_blank"
               :class="[
                 'px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2',
                 isDark ? colors.dark.text.secondary : colors.light.text.secondary,
                 isDark ? colors.dark.text.hover : colors.light.text.hover
               ]">
              <svg :class="[
                    'w-4 h-4',
                    isDark ? colors.dark.socialIcons.all : `text-[${colors.light.socialIcons.github}]`,
                    isDark && colors.dark.socialIcons.hover
                  ]" 
                  fill="currentColor" 
                  viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <!-- Center copyright section - Always centered -->
      <div :class="[
        'text-sm font-medium text-center justify-self-center md:order-none',
        isDark ? colors.dark.text.primary : colors.light.text.primary
      ]">
        &copy; {{ currentYear }} HiimGyn. All rights reserved.
      </div>
      
      <!-- Right GitHub section - Desktop Only -->
      <div class="hidden md:block justify-self-end" :class="[
        'pl-6 border-l',
        isDark ? colors.dark.border.primary : colors.light.border.primary
      ]">
        <a href="https://github.com/hiimgyn" 
           target="_blank"
           :class="[
             'px-6 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2',
             isDark ? colors.dark.text.secondary : colors.light.text.secondary,
             isDark ? colors.dark.text.hover : colors.light.text.hover
           ]">
          <svg :class="[
                'w-4 h-4',
                isDark ? colors.dark.socialIcons.all : `text-[${colors.light.socialIcons.github}]`,
                isDark && colors.dark.socialIcons.hover
              ]" 
              fill="currentColor" 
              viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>@HiimGyn</span>
        </a>
      </div>
    </nav>
  </footer>
</template>


<script setup>
import { computed } from '@vue/reactivity'
import { useStore } from '@/stores/theme'
import { socialLinks } from '@/constants/links'
import { colors } from '@/constants/theme'

const store = useStore()
const isDark = computed(() => store.isDark)
const currentYear = new Date().getFullYear()
</script>
