<template>
  <div class="w-full overflow-hidden py-4 border-y relative select-none"
    :class="isDark ? 'border-white/5 bg-[#0b0d14]/40' : 'border-violet-100 bg-white/40'"
  >
    <!-- Subtle gradient masks for smooth fade on edges -->
    <div class="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
      :class="isDark ? 'bg-gradient-to-r from-[#0b0d14] to-transparent' : 'bg-gradient-to-r from-[#faf8fc] to-transparent'"
    ></div>
    <div class="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none"
      :class="isDark ? 'bg-gradient-to-l from-[#0b0d14] to-transparent' : 'bg-gradient-to-l from-[#faf8fc] to-transparent'"
    ></div>

    <!-- Scrolling Track -->
    <div class="flex items-center gap-6 sm:gap-8 w-max animate-marquee hover:[animation-play-state:paused]">
      <!-- Repeated twice for seamless infinite loop -->
      <div v-for="loop in 2" :key="loop" class="flex items-center gap-6 sm:gap-8 shrink-0">
        <div
          v-for="platform in platforms"
          :key="`${loop}-${platform.name}`"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-200 hover:scale-105"
          :class="isDark 
            ? 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-violet-400/40 text-slate-300 hover:text-white' 
            : 'border-slate-200/80 bg-white/80 hover:bg-white hover:border-violet-400 text-slate-700 hover:text-slate-900 shadow-xs'"
        >
          <PlatformIcon :name="platform.icon" size="sm" interactive />
          <span class="text-xs font-mono font-semibold tracking-tight">{{ platform.name }}</span>
          <span class="text-[10px] font-mono opacity-40 uppercase">{{ platform.category }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores/theme'
import PlatformIcon from '@/components/common/PlatformIcon.vue'

const store = useStore()
const isDark = computed(() => store.isDark)

const platforms = [
  { name: 'Jira', icon: 'jira', category: 'Agile' },
  { name: 'Confluence', icon: 'confluence', category: 'PRD' },
  { name: 'Figma', icon: 'figma', category: 'Design' },
  { name: 'Miro', icon: 'miro', category: 'Process' },
  { name: 'Postman', icon: 'postman', category: 'API' },
  { name: 'SQL Server', icon: 'sqlserver', category: 'DB' },
  { name: 'PostgreSQL', icon: 'postgres', category: 'Data' },
  { name: 'Power BI', icon: 'powerbi', category: 'KPI' },
  { name: 'Docker', icon: 'docker', category: 'DevOps' },
  { name: 'Swagger', icon: 'swagger', category: 'OpenAPI' },
  { name: 'GitHub', icon: 'github', category: 'VCS' },
  { name: '.NET / C#', icon: 'dotnet', category: 'Backend' }
]
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 32s linear infinite;
}
</style>
