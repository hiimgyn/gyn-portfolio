<script setup>
import { ref, computed } from '@vue/reactivity'
import { nextTick, onMounted, onUnmounted } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'

const { t } = useI18n()
const store = useStore()
const isDark = computed(() => store.isDark)

const projects = ref([
  {
    id: 1,
    name: 'projects.project1.name',
    description: 'projects.project1.description',
    image: new URL('@/assets/Images/projects/portfolio.png', import.meta.url).href,
    technologies: ["Vue.js", "Node.js"],
    github: 'https://github.com/hiimgyn/gyn-portfolio',
  },
  {
    id: 2,
    name: 'projects.project2.name',
    description: 'projects.project2.description',
    image: new URL('@/assets/Images/projects/shop.png', import.meta.url).href,
    technologies: ["Java", "MVC", "SQL Server"],
    github: 'https://github.com/hiimgyn/mobile-store-management',
  },
  {
    id: 3,
    name: 'projects.project3.name',
    description: 'projects.project3.description',
    image: new URL('@/assets/Images/projects/tuna.png', import.meta.url).href,
    technologies: [".NET 8", "SQLite", "C#", "Winforms", "TCP Sockets"],
    github: 'https://github.com/hiimgyn/TunaApp',
  },
  {
    id: 4,
    name: 'projects.project4.name',
    description: 'projects.project4.description',
    image: new URL('@/assets/Images/projects/project1.png', import.meta.url).href,
    technologies: ["Laravel", "SQL Server", "ReactUI/API"],
    github: '#',
  },
  {
    id: 5,
    name: 'projects.project5.name',
    description: 'projects.project5.description',
    image: new URL('@/assets/Images/projects/landing.png', import.meta.url).href,
    technologies: ["Node.js", "HTML", "Figma"],
    github: 'https://github.com/hiimgyn/M-Pro-LandingPage',
  },
])

const currentMainIndex = ref(0)
const cardRefs = ref([])
const threeContainer = ref(null)
const isAnimating = ref(false)
const isLoading = ref(true)
const cardsInitialized = ref(false)
const contentVisible = ref(false)

// Tech badge colors based on index
const getTechColor = (projectIndex, techIndex) => {
  const schemes = [
    isDark.value ? colors.dark.badge.tech.blue : colors.light.badge.tech.blue,
    isDark.value ? colors.dark.badge.tech.green : colors.light.badge.tech.green,
    isDark.value ? colors.dark.badge.tech.purple : colors.light.badge.tech.purple
  ]
  return schemes[(projectIndex + techIndex) % schemes.length]
}

// Computed classes for better performance
const cardShadowClasses = computed(() => (position) => {
  const baseClasses = 'relative rounded-3xl overflow-hidden card-3d backdrop-blur-lg h-full border transition-all duration-500'
  const shadowMap = {
    center: isDark.value ? 'shadow-4xl border-white/25' : 'shadow-4xl border-gray-200/50',
    left: isDark.value ? 'shadow-2xl border-white/15 group' : 'shadow-2xl border-gray-200/30 group',
    right: isDark.value ? 'shadow-2xl border-white/15 group' : 'shadow-2xl border-gray-200/30 group',
    farLeft: isDark.value ? 'shadow-xl border-white/10 group' : 'shadow-xl border-gray-200/20 group',
    farRight: isDark.value ? 'shadow-xl border-white/10 group' : 'shadow-xl border-gray-200/20 group'
  }
  const cardBg = isDark.value ? colors.dark.card.background : colors.light.card.background
  return `${baseClasses} ${shadowMap[position] || shadowMap.farLeft} ${cardBg}`
})

const gradientClasses = computed(() => (position) => {
  const gradientMap = {
    center: 'from-black/90 via-black/35 to-transparent p-10',
    left: 'from-black/85 via-black/25 to-transparent p-6',
    right: 'from-black/85 via-black/25 to-transparent p-6',
    farLeft: 'from-black/80 via-black/20 to-transparent p-4',
    farRight: 'from-black/80 via-black/20 to-transparent p-4'
  }
  const baseClasses = 'absolute inset-0 bg-gradient-to-t flex flex-col justify-end transition-opacity duration-250'
  const opacityClass = contentVisible.value ? 'opacity-100' : 'opacity-0'
  return `${baseClasses} ${gradientMap[position] || gradientMap.farLeft} ${opacityClass}`
})

const isLeftOrRight = (position) => position === 'left' || position === 'right'

// Mobile card classes
const mobileCardClasses = computed(() => [
  'rounded-lg overflow-hidden border transition-all duration-300',
  isDark.value ? colors.dark.background.primary : colors.light.background.primary,
  isDark.value ? colors.dark.border.primary : colors.light.border.primary
])

const mobileTextClasses = computed(() => ({
  title: [
    'text-xl font-bold mb-4',
    isDark.value ? colors.dark.text.primary : colors.light.text.primary
  ],
  description: [
    'mb-4 text-sm leading-relaxed',
    isDark.value ? colors.dark.text.secondary : colors.light.text.secondary
  ],
  link: [
    'inline-flex items-center gap-2 font-medium text-sm transition-colors',
    isDark.value ? colors.dark.text.link : colors.light.text.link  ]
}))

// Keyboard hint classes
const keyboardHintClasses = computed(() => [
  'flex items-center gap-2 transition-colors duration-200',
  isDark.value ? 'text-gray-300' : 'text-gray-600'
])

// Three.js variables
let scene, camera, renderer
let animationId = null

const cardPositions = computed(() => {
  const result = {}
  
  projects.value.forEach((project, index) => {
    const relativePosition = (index - currentMainIndex.value + projects.value.length) % projects.value.length
    
    const positionMap = {
      0: 'center',
      1: 'right', 
      2: 'farRight',
      [projects.value.length - 1]: 'left',
      [projects.value.length - 2]: 'farLeft'
    }
    
    result[index] = positionMap[relativePosition] || 'hidden'
  })
  
  return result
})

// Cấu hình CSS cho từng vị trí
const positionStyles = {
  farLeft: { left: '2%', top: '140px', width: '340px', height: '300px', zIndex: 5, transform: 'translateX(-50%) scale(0.7) rotateY(18deg) rotateX(2deg)', opacity: 0.5 },
  left: { left: '18%', top: '90px', width: '420px', height: '360px', zIndex: 10, transform: 'translateX(-50%) scale(0.88) rotateY(10deg) rotateX(3deg)', opacity: 0.8 },
  center: { left: '50%', top: '40px', width: '600px', height: '500px', zIndex: 30, transform: 'translateX(-50%) scale(1.15) rotateY(0deg) rotateX(0deg)', opacity: 1 },
  right: { left: '82%', top: '90px', width: '420px', height: '360px', zIndex: 10, transform: 'translateX(-50%) scale(0.88) rotateY(-10deg) rotateX(3deg)', opacity: 0.8 },
  farRight: { left: '92%', top: '140px', width: '340px', height: '300px', zIndex: 5, transform: 'translateX(-50%) scale(0.7) rotateY(-18deg) rotateX(2deg)', opacity: 0.5 },
  hidden: { left: '50%', top: '40px', width: '600px', height: '500px', zIndex: 1, transform: 'translateX(-50%) scale(0) rotateY(0deg) rotateX(0deg)', opacity: 0, pointerEvents: 'none' }
}

// Animation chuyển đổi cards
const animateCardTransition = (direction, step = 1) => {
  if (isAnimating.value) return
  isAnimating.value = true
  contentVisible.value = false
  
  setTimeout(() => {
    const total = projects.value.length
    currentMainIndex.value = direction === 'prev' 
      ? (currentMainIndex.value - step + total) % total
      : (currentMainIndex.value + step) % total
    
    const timeline = gsap.timeline({
      onComplete: () => fadeInNewContent()
    })
    
    cardRefs.value.forEach((card, index) => {
      if (!card) return
      const newPosition = cardPositions.value[index]
      const targetStyle = positionStyles[newPosition]
      timeline.to(card, { ...targetStyle, duration: 0.8, ease: 'power3.inOut' }, 0)
    })
  }, 250)
}

const fadeInNewContent = () => {
  setTimeout(() => {
    contentVisible.value = true
    isAnimating.value = false
  }, 100)
}

// Xử lý click card
const handleCardClick = (cardIndex) => {
  if (isAnimating.value) return

  const currentPosition = cardPositions.value[cardIndex]
  const clickActions = {
    'farLeft': () => animateCardTransition('prev', 2),
    'left': () => animateCardTransition('prev', 1),
    'right': () => animateCardTransition('next', 1),
    'farRight': () => animateCardTransition('next', 2)
  }
  
  clickActions[currentPosition]?.()
}

// Navigation functions
const goToPreviousProject = (step = 1) => animateCardTransition('prev', step)
const goToNextProject = (step = 1) => animateCardTransition('next', step)

// Khởi tạo cards với animation
const initializeCards = () => {
  nextTick(() => {
    // Set initial state for all cards
    cardRefs.value.forEach((card) => {
      if (!card) return
      gsap.set(card, {
        position: 'absolute',
        opacity: 0,
        scale: 0,
        visibility: 'hidden',
        transformOrigin: 'center center'
      })
    })
    
    cardsInitialized.value = true
    
    setTimeout(() => {
      // Make cards visible
      cardRefs.value.forEach((card) => {
        if (card) gsap.set(card, { visibility: 'visible' })
      })
      
      const timeline = gsap.timeline({
        onComplete: () => {
          // Add floating animation to visible cards
          cardRefs.value.forEach((card, index) => {
            if (!card || cardPositions.value[index] === 'hidden') return
            gsap.to(card, {
              y: `+=${6 + index * 2}`,
              duration: 3.5 + index * 0.4,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            })
          })
          setTimeout(() => { contentVisible.value = true }, 300)
          isLoading.value = false
        }
      })

      // Animate cards to their positions
      cardRefs.value.forEach((card, index) => {
        if (!card) return
        const position = cardPositions.value[index]
        const targetStyle = positionStyles[position]
        
        timeline.to(card, {
          position: 'absolute',
          ...targetStyle,
          scale: 1,
          duration: 1.4,
          ease: 'back.out(1.4)',
          transformOrigin: 'center center'
        }, index * 0.2)
      })
    }, 200)
  })
}

// Three.js functions
const initThreeJS = () => {
  if (!threeContainer.value) return

  try {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
    renderer.setClearColor(0x000000, 0)
    threeContainer.value.appendChild(renderer.domElement)

    camera.position.z = 5
    animateThree()
  } catch (error) {
    console.error('Failed to initialize Three.js:', error)
  }
}

const animateThree = () => {
  animationId = requestAnimationFrame(animateThree)
  renderer.render(scene, camera)
}

const cleanupThreeJS = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (renderer && threeContainer.value) {
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
    renderer.dispose()
  }
  if (scene) {
    scene.clear()
  }
}

// Event handlers
const handleResize = () => {
  if (camera && renderer && threeContainer.value) {
    camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  }
}

const handleKeydown = (e) => {
  if (isAnimating.value) return
  const keyActions = {
    'ArrowLeft': goToPreviousProject,
    'ArrowRight': goToNextProject
  }
  keyActions[e.key]?.()
}

onMounted(() => {
  setTimeout(() => {
    initThreeJS()
    initializeCards()
  }, 400)

  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  cleanupThreeJS()
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div :class="[
    'w-full flex flex-col items-center justify-center relative min-h-[calc(100vh-4rem-1.4rem)] overflow-hidden',
    'px-6 py-10'
  ]">
    <!-- Three.js Background Container -->
    <div ref="threeContainer" class="absolute inset-0 pointer-events-none z-0" style="width: 100vw; height: 100vh;">
    </div>

    <!-- Desktop Layout -->
    <div class="relative w-full max-w-[1900px] h-[850px] hidden md:flex items-center justify-center perspective-2500 z-10">
      <div 
        v-for="(project, index) in projects" 
        :key="project.id"
        :ref="el => cardRefs[index] = el" 
        class="card-container preserve-3d"
        :class="{
          'cursor-pointer': cardPositions[index] !== 'center' && cardPositions[index] !== 'hidden' && cardsInitialized,
          'invisible': !cardsInitialized
        }"
        @click="cardsInitialized ? handleCardClick(index) : null"
        :title="cardPositions[index] !== 'center' && cardsInitialized ? `Go to: ${t(project.name)}` : `Current: ${t(project.name)}`"
        :style="{ pointerEvents: cardPositions[index] === 'hidden' || !cardsInitialized ? 'none' : 'auto' }"
      >        <div :class="cardShadowClasses(cardPositions[index])">
          <img 
            :src="project.image" 
            :alt="t(project.name)" 
            class="absolute inset-0 w-full h-full object-cover" 
          />
          <div :class="gradientClasses(cardPositions[index])">
            <div v-if="cardPositions[index] === 'center'" 
                 :class="['transition-all duration-400 delay-75', contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3']">
              <h3 class="text-4xl font-bold mb-5 drop-shadow-lg text-white">
                {{ t(project.name) }}
              </h3>
              <p class="mb-7 drop-shadow-sm text-lg leading-relaxed text-white/96">
                {{ t(project.description) }}
              </p>              <div class="flex flex-wrap gap-3 mb-7">
                <span v-for="(tech, techIndex) in project.technologies.slice(0, 3)" :key="tech"
                  :class="['px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 border', 
                    getTechColor(index, techIndex), 
                    contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2']"
                  :style="{ transitionDelay: contentVisible ? `${150 + techIndex * 60}ms` : '0ms' }">
                  {{ tech }}
                </span>
                <span v-if="project.technologies.length > 3"
                  :class="['px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border', 
                    isDark ? colors.dark.badge.background + ' ' + colors.dark.badge.text + ' ' + colors.dark.badge.border : colors.light.badge.background + ' ' + colors.light.badge.text + ' ' + colors.light.badge.border, 
                    contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2']"
                  :style="{ transitionDelay: contentVisible ? '330ms' : '0ms' }">
                  +{{ project.technologies.length - 3 }}
                </span>
              </div>
              <a v-if="project.github" :href="project.github" target="_blank" rel="noopener"
                :class="['inline-flex items-center gap-3 font-semibold text-xl group duration-300 transition-all', 
                  isDark ? 'text-white hover:text-blue-400' : 'text-white hover:text-blue-200',
                  contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3']"
                :style="{ transitionDelay: contentVisible ? '400ms' : '0ms' }">
                <span>View on GitHub</span>
                <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </a>
            </div>            <div v-else-if="cardPositions[index] !== 'hidden'"
                 :class="['transition-all duration-300 delay-100', contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2']">
              <h3 :class="[
                'font-bold mb-2 drop-shadow-lg text-white',
                isLeftOrRight(cardPositions[index]) ? 'text-xl mb-3' : 'text-lg'
              ]">
                {{ t(project.name) }}
              </h3>
              <p :class="[
                'drop-shadow-sm line-clamp-2',
                isLeftOrRight(cardPositions[index]) ? 'text-base text-white/95' : 'text-sm text-white/90'
              ]">
                {{ t(project.description) }}
              </p>
            </div>
          </div>
          <div v-if="isLeftOrRight(cardPositions[index])"
            :class="['absolute top-4 right-4 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-400 border backdrop-blur-sm',
              isDark ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 border-white/40' : 'bg-gradient-to-r from-blue-400/90 to-purple-400/90 border-gray-300/60',
              contentVisible ? '' : 'pointer-events-none']">
            <svg :class="['w-5 h-5 animate-pulse', isDark ? 'text-white' : 'text-white']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                :d="cardPositions[index] === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>    <!-- Keyboard Hints -->
    <div class="hidden md:flex items-center gap-6 mt-6 text-base opacity-70 z-10">
      <div :class="keyboardHintClasses">
        <span>{{$t('projects.previous')}}</span>
        <kbd :class="[
          'px-3 py-2 rounded text-sm font-medium transition-colors duration-200',
          isDark ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-gray-100 text-gray-700 border border-gray-300 shadow-sm'
        ]">←</kbd>
      </div>
      <div :class="keyboardHintClasses">
        <kbd :class="[
          'px-3 py-2 rounded text-sm font-medium transition-colors duration-200',
          isDark ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-gray-100 text-gray-700 border border-gray-300 shadow-sm'
        ]">→</kbd>
        <span>{{$t('projects.next')}}</span>
      </div>
    </div><!-- Mobile Layout -->
    <div class="flex flex-col gap-6 w-full md:hidden z-10 px-4">
      <div v-for="(project, index) in projects" :key="project.id" :class="mobileCardClasses">
        <img :src="project.image" :alt="t(project.name)" class="w-full h-48 object-cover" />
        <div class="p-6">
          <h3 :class="mobileTextClasses.title">
            {{ t(project.name) }}
          </h3>
          <p :class="mobileTextClasses.description">
            {{ t(project.description) }}
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="(tech, techIndex) in project.technologies.slice(0, 3)" :key="tech"
              :class="['px-3 py-1 text-xs rounded-full border font-medium', 
                getTechColor(index, techIndex)]">
              {{ tech }}
            </span>
            <span v-if="project.technologies.length > 3"
              :class="['px-3 py-1 text-xs rounded-full border font-medium', 
                isDark ? colors.dark.badge.background + ' ' + colors.dark.badge.text + ' ' + colors.dark.badge.border : colors.light.badge.background + ' ' + colors.light.badge.text + ' ' + colors.light.badge.border]">
              +{{ project.technologies.length - 3 }}
            </span>
          </div>
          <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" :class="mobileTextClasses.link">
            <span>View on GitHub</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-2500 {
  perspective: 2500px;
  perspective-origin: center center;
}

.preserve-3d {
  transform-style: preserve-3d;
  transform-origin: center center;
}

.card-container {
  transition: none !important;
  transform-origin: center center;
  will-change: transform;
  backface-visibility: hidden;
}

.card-3d {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-3d:hover {
  transform: translateY(-15px) rotateX(8deg) scale(1.03);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* CSS utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shadow-4xl { box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.5); }
.backdrop-blur-lg { backdrop-filter: blur(16px); }
.bg-opacity-96 { background-color: rgba(255, 255, 255, 0.96); }
.dark .bg-opacity-96 { background-color: rgba(17, 24, 39, 0.96); }

/* Enhanced responsive design */
@media (max-width: 1600px) {
  .card-container { transform: scale(0.95); }
  .perspective-2500 { height: 800px; }
}

@media (max-width: 1400px) {
  .card-container { transform: scale(0.9); }
  .perspective-2500 { perspective: 2000px; height: 750px; }
}

@media (max-width: 1200px) {
  .perspective-2500 { perspective: 1600px; height: 700px; }
  .card-container { transform: scale(0.85); }
}

@media (max-width: 1024px) {
  .perspective-2500 { perspective: 1300px; height: 650px; }
  .card-container { transform: scale(0.8); }
}

.card-3d::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  border-radius: 1.5rem;
}

.card-3d:hover::before { opacity: 1; }

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cursor-pointer:hover { transform: scale(1.02); }

kbd {
  font-weight: 600;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

kbd:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.group:hover .group-hover\\:translate-x-1 { transform: translateX(0.25rem); }
.group:hover .group-hover\\:opacity-100 { opacity: 1; }

.card-3d {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
}

.card-container {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media (max-width: 768px) {
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.5); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.8); }
}
</style>