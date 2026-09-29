<template>
  <div>
    <!-- Desktop Floating HUD (Fixed on left edge) -->
    <aside
      class="fixed left-4 xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-start gap-3 select-none pointer-events-auto"
      aria-label="Storyline Navigation"
    >
      <!-- Overall Storyline Progress Capsule -->
      <div
        class="p-2 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex flex-col items-center gap-3 shadow-xl"
        :class="isDark 
          ? 'bg-[#0e1122]/85 border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'"
      >
        <!-- Top Status Indicator -->
        <div class="text-[9px] font-mono uppercase tracking-widest text-violet-400 font-bold px-1.5 py-0.5 rounded bg-violet-500/10">
          HUD
        </div>

        <!-- Vertical Connecting Spine for Navigator -->
        <div class="relative flex flex-col items-center gap-4 py-1">
          <!-- Background Track Line -->
          <div
            class="absolute top-2 bottom-2 w-0.5 rounded-full"
            :class="isDark ? 'bg-white/10' : 'bg-slate-200'"
          >
            <!-- Active Fill Height -->
            <div
              class="w-full bg-gradient-to-b from-violet-500 via-fuchsia-400 to-emerald-400 rounded-full transition-all duration-300"
              :style="{ height: `${scrollProgress}%` }"
            ></div>
          </div>

          <!-- Station Nodes -->
          <button
            v-for="(st, idx) in stations"
            :key="st.id"
            @click="$emit('navigate', st.id)"
            class="group relative z-10 flex items-center focus:outline-none transition-transform active:scale-90"
            :aria-label="st.label"
          >
            <!-- Checkpoint Node Dot -->
            <div
              class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer"
              :class="[
                activeStation === st.id
                  ? (isDark 
                      ? 'bg-violet-600 border-white text-white shadow-[0_0_16px_rgba(139,92,246,0.8)] scale-110' 
                      : 'bg-violet-600 border-violet-200 text-white shadow-md scale-110')
                  : (isDark 
                      ? 'bg-[#0f1224] border-white/20 text-slate-400 group-hover:border-violet-400 group-hover:text-white' 
                      : 'bg-white border-slate-300 text-slate-500 group-hover:border-violet-500 group-hover:text-slate-900')
              ]"
            >
              <span class="text-[10px] font-mono font-bold">{{ st.number }}</span>
            </div>

            <!-- Tooltip Label on Hover / Active (Expands to right) -->
            <div
              class="absolute left-9 px-2.5 py-1 rounded-xl text-xs font-mono font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-lg border translate-x-1 group-hover:translate-x-0"
              :class="[
                activeStation === st.id ? 'opacity-100 translate-x-0' : '',
                isDark 
                  ? 'bg-[#15192c] border-violet-500/40 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md'
              ]"
            >
              <span class="text-violet-400 mr-1.5">{{ st.number }}</span>
              <span>{{ $t(st.label) }}</span>
            </div>
          </button>
        </div>

        <!-- Scroll Percentage -->
        <div class="text-[9px] font-mono text-slate-400 text-center font-bold">
          {{ Math.round(scrollProgress) }}%
        </div>
      </div>
    </aside>

    <!-- Mobile / Tablet Sticky Header Progress Strip (Always accessible) -->
    <div
      class="xl:hidden sticky top-14 sm:top-16 z-30 mb-6 py-2 px-3 rounded-2xl border backdrop-blur-xl transition-all shadow-md flex items-center justify-between gap-2"
      :class="isDark 
        ? 'bg-[#0e1122]/90 border-white/[0.08]' 
        : 'bg-white/95 border-slate-200'"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="w-2 h-2 rounded-full bg-violet-400 animate-ping shrink-0"></span>
        <span class="text-xs font-mono font-bold text-violet-400 truncate">
          {{ currentStationLabel }}
        </span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <button
          v-for="st in stations"
          :key="st.id"
          @click="$emit('navigate', st.id)"
          class="w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all border"
          :class="[
            activeStation === st.id
              ? 'bg-violet-600 text-white border-violet-400 shadow-sm scale-105'
              : (isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600')
          ]"
        >
          {{ st.number }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  stations: {
    type: Array,
    required: true
  },
  activeStation: {
    type: String,
    required: true
  },
  scrollProgress: {
    type: Number,
    default: 0
  }
})

defineEmits(['navigate'])

const store = useStore()
const isDark = computed(() => store.isDark)
const { t } = useI18n()

const currentStationLabel = computed(() => {
  const current = props.stations.find(s => s.id === props.activeStation)
  return current ? `${current.number} // ${t(current.label)}` : 'Hành trình'
})
</script>
