<script setup>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'

const store = useStore()
const isDark = computed(() => store.isDark)
const stars = ref(null)

// Generate stars once
const starsArray = Array.from({ length: 200 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${Math.random() * 3}px`,
  delay: `${Math.random() * 2}s`
}))

const handleMouseMove = (e) => {
  if (isDark.value && stars.value) {
    const mouseX = e.clientX / window.innerWidth
    const mouseY = e.clientY / window.innerHeight
    stars.value.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})

// Add particle animation function
const getParticleStyle = (index) => {
  const delay = index * 0.5
  const duration = 3 + Math.random() * 2
  const x = Math.random() * 100
  const y = Math.random() * 100
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    color: isDark.value ? '#64748b' : '#cbd5e1'
  }
}
</script>

<template>
  <div :class="[
    'fixed inset-0 w-full h-full overflow-hidden -z-10 transition-all duration-300', // Thay đổi z-10 thành -z-10
    isDark ? colors.dark.background.primary : colors.light.background.primary
  ]">
    <!-- Animated gradient background -->
    <div 
      :class="[
        'absolute inset-0 transition-all duration-1000',
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100'
      ]"
    ></div>
    
    <!-- Floating particles -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        v-for="i in 15" 
        :key="i"
        class="absolute w-1 h-1 bg-current opacity-20 rounded-full animate-float"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Dark mode stars -->
    <div ref="stars" class="stars absolute inset-0" v-if="isDark">
      <div v-for="(star, index) in starsArray" 
           :key="index"
           class="star absolute rounded-full" 
           :style="{
             left: star.left,
             top: star.top,
             width: star.size,
             height: star.size,
             animationDelay: star.delay
           }">
      </div>
    </div>
    
    <!-- Light mode pattern -->
    <div v-else 
         :class="[
           'light-pattern absolute inset-0',
           colors.light.pattern.opacity,
           colors.light.pattern.color
         ]">
    </div>
  </div>
</template>

<style scoped>
.star {
  background: white;
  opacity: 0.3;
  animation: twinkle 3s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.stars {
  transition: transform 0.3s ease-out;
}

.light-pattern {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 20px 20px;
  transition: opacity 0.3s ease-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
