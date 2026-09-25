<template>
  <footer 
    :class="[
      'py-3 w-full backdrop-blur-xl border-t transition-colors duration-200 z-20 text-xs font-mono',
      isDark 
        ? 'bg-[#0a0e17]/85 border-white/[0.08] text-slate-400' 
        : 'bg-white/85 border-slate-200/90 text-slate-600'
    ]"
  >
    <nav class="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-0">
      <!-- Left side: Find me in + Social links -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-0 w-full md:w-auto justify-self-start">
        <div :class="[
          'md:pr-4 border-b md:border-b-0 md:border-r w-full md:w-auto text-center md:text-left pb-1.5 md:pb-0 text-slate-400',
          isDark ? 'border-white/10' : 'border-slate-200'
        ]">
          <span>find me in:</span>
        </div>
        <ul class="flex flex-wrap justify-center md:justify-start items-center w-full md:w-auto md:ml-3 gap-1">
          <li v-for="(social, index) in socialLinks" 
              :key="index">
            <a :href="social.url" 
               target="_blank"
               rel="noopener noreferrer"
               :aria-label="social.name"
               :class="[
                 'p-1.5 rounded-lg transition-colors flex items-center gap-1.5',
                 isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
               ]">
              <PlatformIcon :name="social.name" size="xs" />
            </a>
          </li>

          <!-- GitHub Icon - Mobile Only -->
          <li class="md:hidden">
            <a :href="githubLink.url" 
               target="_blank"
               rel="noopener noreferrer"
               :aria-label="githubLink.name"
               :class="[
                 'p-1.5 rounded-lg transition-colors flex items-center gap-1.5',
                 isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
               ]">
              <PlatformIcon name="github" size="xs" />
            </a>
          </li>
        </ul>
      </div>

      <!-- Center copyright section - Always centered -->
      <div class="text-center justify-self-center md:order-none select-none">
        &copy; {{ currentYear }} Gyn Nguyen • Business Analyst
      </div>
      
      <!-- Right GitHub section - Desktop Only -->
      <div class="hidden md:block justify-self-end" :class="[
        'pl-4 border-l',
        isDark ? 'border-white/10' : 'border-slate-200'
      ]">
        <a :href="githubLink.url" 
           target="_blank"
           rel="noopener noreferrer"
           :class="[
             'py-1 px-2.5 rounded-lg transition-colors flex items-center gap-2 font-mono',
             isDark ? 'hover:bg-white/5 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
           ]">
          <PlatformIcon name="github" size="xs" />
          <span>{{ githubLink.username }}</span>
        </a>
      </div>
    </nav>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores/theme'
import { socialLinks, githubLink } from '@/constants/links'
import { colors } from '@/constants/theme'
import PlatformIcon from '@/components/common/PlatformIcon.vue'

const store = useStore()
const isDark = computed(() => store.isDark)
const currentYear = new Date().getFullYear()
</script>
