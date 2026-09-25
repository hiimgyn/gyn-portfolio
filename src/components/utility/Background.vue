<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores/theme'

const store = useStore()
const isDark = computed(() => store.isDark)

const mouseX = ref(-1000)
const mouseY = ref(-1000)
const currentX = ref(-1000)
const currentY = ref(-1000)
let rafId = null

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const lerp = (start, end, factor) => start + (end - start) * factor

const animateSpotlight = () => {
  currentX.value = lerp(currentX.value, mouseX.value, 0.08)
  currentY.value = lerp(currentY.value, mouseY.value, 0.08)
  rafId = requestAnimationFrame(animateSpotlight)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  rafId = requestAnimationFrame(animateSpotlight)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    class="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none transition-colors duration-500"
    :class="isDark ? 'bg-[#0a0c14]' : 'bg-[#fcfaff]'"
  >
    <!-- Pastel Purple Ambient Cursor Spotlight -->
    <div
      class="absolute inset-0 transition-opacity duration-300"
      :style="{
        background: isDark
          ? `radial-gradient(650px circle at ${currentX}px ${currentY}px, rgba(196, 181, 253, 0.08), rgba(167, 139, 250, 0.02) 40%, transparent 80%)`
          : `radial-gradient(650px circle at ${currentX}px ${currentY}px, rgba(196, 181, 253, 0.14), rgba(167, 139, 250, 0.03) 40%, transparent 80%)`
      }"
    ></div>

    <!-- Precision Blueprint Grid with Vignette Mask -->
    <div
      class="absolute inset-0 blueprint-grid"
      :class="isDark ? 'grid-dark' : 'grid-light'"
    ></div>

    <!-- Vignette Falloff to keep center focused and edges subtle -->
    <div
      class="absolute inset-0"
      :class="isDark
        ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,12,20,0.85)_100%)]'
        : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(252,250,255,0.85)_100%)]'"
    ></div>

    <!-- Top Pastel Lavender Horizon Light -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 blur-3xl opacity-35 pointer-events-none"
      :class="isDark ? 'bg-gradient-to-b from-violet-400/20 to-transparent' : 'bg-gradient-to-b from-violet-200/50 to-transparent'"
    ></div>
  </div>
</template>

<style scoped>
.blueprint-grid {
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 95%);
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 95%);
}

.grid-dark {
  background-image: 
    linear-gradient(to right, rgba(216, 180, 254, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(216, 180, 254, 0.04) 1px, transparent 1px);
}

.grid-light {
  background-image: 
    linear-gradient(to right, rgba(139, 92, 246, 0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(139, 92, 246, 0.045) 1px, transparent 1px);
}
</style>
