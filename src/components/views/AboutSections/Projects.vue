<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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
    technologies: ["Vue.js", "Tailwind CSS", "Three.js"],
    github: 'https://github.com/your-project1',
  },
  {
    id: 2,
    name: 'projects.project2.name',
    description: 'projects.project2.description',
    image: new URL('@/assets/Images/projects/project1.png', import.meta.url).href,
    technologies: ["Vue.js", "Tailwind CSS", "Three.js"],
    github: 'https://github.com/your-mobile-store',
  },
  {
    id: 3,
    name: 'projects.project3.name',
    description: 'projects.project3.description',
    image: new URL('@/assets/Images/projects/project2.png', import.meta.url).href,
    technologies: ["Vue.js", "Tailwind CSS", "Three.js", "Vue.js", "Tailwind CSS"],
    github: 'https://github.com/your-chat-app',
  },
  {
    id: 4,
    name: 'projects.project4.name',
    description: 'projects.project4.description',
    image: new URL('@/assets/Images/avatar.png', import.meta.url).href,
    technologies: ["Vue.js", "Tailwind CSS", "Three.js", "Vue.js", "Tailwind CSS", "Three.js"],
    github: 'https://github.com/your-project4',
  },
  {
    id: 5,
    name: 'projects.project5.name',
    description: 'projects.project5.description',
    image: new URL('@/assets/Images/avatar.png', import.meta.url).href,
    technologies: ["Vue.js", "Tailwind CSS", "Three.js"],
    github: 'https://github.com/your-project5',
  },
])

const currentMainIndex = ref(0)
const cardRefs = ref([null, null, null, null, null])
const threeContainer = ref(null)
const showDebug = ref(false) // Toggle debug panel
const isAnimating = ref(false)
const isLoading = ref(true)
const showCenterContent = ref(true) // Control center content visibility
const forceUpdate = ref(0) // Force reactivity trigger

// Three.js variables
let scene, camera, renderer, particleSystem
let animationId = null

// Logic hiển thị cards theo thứ tự: farLeft, Left, Center, Right, farRight
const visibleProjects = computed(() => {
  // Trigger reactivity bằng cách read forceUpdate
  forceUpdate.value
  
  const total = projects.value.length
  const getIndex = (offset) => (currentMainIndex.value + offset + total) % total
  
  const result = {
    farLeft: projects.value[getIndex(-2)],
    left: projects.value[getIndex(-1)],
    center: projects.value[getIndex(0)],
    right: projects.value[getIndex(1)],
    farRight: projects.value[getIndex(2)],
  }
  
  console.log('Visible Projects Update:', {
    currentMainIndex: currentMainIndex.value,
    center: result.center.id,
    forceUpdate: forceUpdate.value
  })
  
  return result
})

// Cấu hình vị trí cố định cho từng card (5 vị trí)
const cardPositions = {
  farLeft: {
    left: '2%',
    top: '140px',
    width: '340px',
    height: '300px',
    zIndex: 5,
    transform: 'translateX(-50%) scale(0.7) rotateY(18deg) rotateX(2deg)',
    opacity: 0.5
  },
  left: {
    left: '18%',
    top: '90px',
    width: '420px',
    height: '360px',
    zIndex: 10,
    transform: 'translateX(-50%) scale(0.88) rotateY(10deg) rotateX(3deg)',
    opacity: 0.8
  },
  center: {
    left: '50%',
    top: '40px',
    width: '600px',
    height: '500px',
    zIndex: 30,
    transform: 'translateX(-50%) scale(1.15) rotateY(0deg) rotateX(0deg)',
    opacity: 1
  },
  right: {
    left: '82%',
    top: '90px',
    width: '420px',
    height: '360px',
    zIndex: 10,
    transform: 'translateX(-50%) scale(0.88) rotateY(-10deg) rotateX(3deg)',
    opacity: 0.8
  },
  farRight: {
    left: '98%',
    top: '140px',
    width: '340px',
    height: '300px',
    zIndex: 5,
    transform: 'translateX(-50%) scale(0.7) rotateY(-18deg) rotateX(2deg)',
    opacity: 0.5
  }
}

// Khởi tạo Three.js scene
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

// Three.js animation loop
const animateThree = () => {
  animationId = requestAnimationFrame(animateThree)

  if (particleSystem) {
    particleSystem.rotation.y += 0.002
    particleSystem.rotation.x += 0.001
  }

  renderer.render(scene, camera)
}

// Cleanup Three.js
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

// Animation chuyển đổi cards (5 card) với fade content
const animateCardTransition = (direction, step = 1) => {
  if (isAnimating.value) return
  isAnimating.value = true

  console.log(`Starting animation: ${direction}, step: ${step}, currentIndex: ${currentMainIndex.value}`)

  // Create main timeline for the entire animation sequence
  const masterTimeline = gsap.timeline({
    onComplete: () => {
      console.log('Master animation complete')
      isAnimating.value = false
    }
  })

  // Phase 1: Fade out center content (0.2s)
  masterTimeline.to('.center-project-content', {
    opacity: 0,
    y: -20,
    duration: 0.2,
    ease: 'power2.out',
    onComplete: () => {
      showCenterContent.value = false
    }
  })

  // Phase 2: Calculate next positions for all cards
  const positions = ['farLeft', 'left', 'center', 'right', 'farRight']
  const cardMoves = []
  
  cardRefs.value.forEach((card, idx) => {
    if (!card) return
    
    let targetPositionIndex
    if (direction === 'prev') {
      // Previous: cards move right (increase index)
      targetPositionIndex = (idx + step) % 5
    } else if (direction === 'next') {
      // Next: cards move left (decrease index)
      targetPositionIndex = (idx - step + 5) % 5
    }
    
    const targetPosition = positions[targetPositionIndex]
    const targetConfig = cardPositions[targetPosition]
    
    cardMoves.push({
      card,
      targetConfig,
      originalIndex: idx,
      targetIndex: targetPositionIndex
    })
  })

  // Phase 2: Animate all cards to new positions (0.8s)
  cardMoves.forEach(({ card, targetConfig }) => {
    masterTimeline.to(card, {
      ...targetConfig,
      duration: 0.8,
      ease: 'power3.inOut',
    }, "-=0.6") // Start 0.6s before previous animation ends (overlap)
  })

  // Phase 3: Update data and reset positions after card animation
  masterTimeline.call(() => {
    console.log('Cards moved, updating data...')
    
    // Update index
    const total = projects.value.length
    const oldIndex = currentMainIndex.value
    
    if (direction === 'prev') {
      currentMainIndex.value = (currentMainIndex.value - step + total) % total
    } else if (direction === 'next') {
      currentMainIndex.value = (currentMainIndex.value + step) % total
    }
    
    console.log(`Index changed from ${oldIndex} to ${currentMainIndex.value}`)
    
    // Force trigger reactivity
    forceUpdate.value++
  })

  // Phase 4: Reset positions with new data (immediate)
  masterTimeline.call(() => {
    setTimeout(() => {
      console.log('Resetting card positions with new data...')
      setCardPositions()
      showCenterContent.value = true
    }, 50) // Give Vue time to update
  })

  // Phase 5: Fade in new center content (0.3s)
  masterTimeline.fromTo('.center-project-content', 
    { 
      opacity: 0, 
      y: 20 
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    }, "+=0.1") // Small delay after position reset
}

// Xử lý click card
const handleCardClick = (position) => {
  if (isAnimating.value) return

  if (position === 'farLeft') {
    animateCardTransition('prev', 2)
  } else if (position === 'left') {
    animateCardTransition('prev', 1)
  } else if (position === 'right') {
    animateCardTransition('next', 1)
  } else if (position === 'farRight') {
    animateCardTransition('next', 2)
  }
}

// Chuyển về project trước
const goToPreviousProject = (step = 1) => {
  animateCardTransition('prev', step)
}

// Chuyển tới project tiếp theo
const goToNextProject = (step = 1) => {
  animateCardTransition('next', step)
}

// Thiết lập vị trí ban đầu cho cards (5 card) - Enhanced for stability
const setCardPositions = () => {
  nextTick(() => {
    cardRefs.value.forEach((card, index) => {
      if (!card) return
      
      // Kill all existing animations first
      gsap.killTweensOf(card)
      
      const positions = ['farLeft', 'left', 'center', 'right', 'farRight']
      const position = positions[index]
      const config = cardPositions[position]
      
      // Clear all previous styles
      gsap.set(card, {
        clearProps: "all"
      })
      
      // Set stable positioning with immediate values
      gsap.set(card, {
        position: 'absolute',
        left: config.left,
        top: config.top,
        width: config.width,
        height: config.height,
        zIndex: config.zIndex,
        transform: config.transform,
        opacity: config.opacity,
        transformOrigin: 'center center'
      })
      
      console.log(`Card ${index} positioned at ${position} for project ${visibleProjects.value[position]?.id}`)
    })
    
    // Ensure center content is visible after positioning
    if (showCenterContent.value) {
      gsap.set('.center-project-content', {
        opacity: 1,
        y: 0
      })
    }
  })
}

// Khởi tạo cards với animation (5 card) - Enhanced for better sequencing
const initializeCards = () => {
  nextTick(() => {
    // Set initial hidden state for all cards
    cardRefs.value.forEach((card, index) => {
      if (!card) return
      gsap.set(card, {
        position: 'absolute',
        opacity: 0,
        scale: 0.2,
        rotationY: index === 0 ? -160 : index === 4 ? 160 : 0,
        transformOrigin: 'center center'
      })
    })
    
    // Create main initialization timeline
    const initTimeline = gsap.timeline({
      onComplete: () => {
        // Start floating animations after initialization
        cardRefs.value.forEach((card, index) => {
          if (!card) return
          gsap.to(card, {
            y: `+=${6 + index * 2}`,
            duration: 3.5 + index * 0.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
        })
        
        // Mark loading as complete
        isLoading.value = false
        console.log('Card initialization complete')
      }
    })
    
    // Animate each card to its final position
    cardRefs.value.forEach((card, index) => {
      if (!card) return
      const positions = ['farLeft', 'left', 'center', 'right', 'farRight']
      const position = positions[index]
      const config = cardPositions[position]
      
      initTimeline.to(card, {
        position: 'absolute',
        left: config.left,
        top: config.top,
        width: config.width,
        height: config.height,
        zIndex: config.zIndex,
        transform: config.transform,
        opacity: config.opacity,
        scale: 1, // Override the initial scale
        rotationY: 0, // Reset rotation
        duration: 1.2,
        ease: 'back.out(1.8)',
        transformOrigin: 'center center'
      }, index * 0.15) // Stagger the animations
    })
  })
}

// Handle window resize
const handleResize = () => {
  if (camera && renderer && threeContainer.value) {
    camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  }
}

// Keyboard navigation
const handleKeydown = (e) => {
  if (isAnimating.value) return

  if (e.key === 'ArrowLeft') {
    goToPreviousProject()
  } else if (e.key === 'ArrowRight') {
    goToNextProject()
  }
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
    </div>    <!-- Debug Panel - Toggleable -->
    <div class="fixed top-4 left-4 z-50">
      <button @click="showDebug = !showDebug" 
              class="bg-black/90 text-white px-3 py-2 rounded-lg text-xs font-mono mb-2 hover:bg-black transition-colors">
        {{ showDebug ? 'Hide Debug' : 'Show Debug' }}
      </button>
      <div v-if="showDebug" class="bg-black/90 text-white p-4 rounded-lg text-sm font-mono">
        <div>Current Main Index: {{ currentMainIndex }}</div>
        <div>Force Update: {{ forceUpdate }}</div>
        <div>Center Project: {{ visibleProjects.center?.id }}</div>
        <div>Show Center Content: {{ showCenterContent }}</div>
        <div>Animation: {{ isAnimating ? 'Running' : 'Idle' }}</div>
        <div class="mt-2">Projects Order:</div>
        <div class="ml-2">Far Left: Project {{ visibleProjects.farLeft?.id }}</div>
        <div class="ml-2">Left: Project {{ visibleProjects.left?.id }}</div>
        <div class="ml-2 font-bold">Center: Project {{ visibleProjects.center?.id }}</div>
        <div class="ml-2">Right: Project {{ visibleProjects.right?.id }}</div>
        <div class="ml-2">Far Right: Project {{ visibleProjects.farRight?.id }}</div>
        <div class="mt-2 space-x-2">
          <button @click="goToPreviousProject()" class="bg-blue-500 px-2 py-1 rounded text-xs" :disabled="isAnimating">← Prev</button>
          <button @click="goToNextProject()" class="bg-blue-500 px-2 py-1 rounded text-xs" :disabled="isAnimating">Next →</button>
        </div>
      </div>
    </div>

    <!-- Stack Cards Desktop Layout - 5 cards -->
    <div
      class="relative w-full max-w-[1900px] h-[850px] hidden md:flex items-center justify-center perspective-2500 z-10">      <!-- Card farLeft (Previous-2 Project) -->
      <div :ref="el => cardRefs[0] = el" class="card-container cursor-pointer preserve-3d"
        @click="handleCardClick('farLeft')" :title="`Previous: ${t(visibleProjects.farLeft.name)}`"
        :key="`farLeft-${visibleProjects.farLeft.id}-${currentMainIndex}-${forceUpdate}`">
        <div :class="[
          'relative group rounded-3xl overflow-hidden shadow-xl card-3d backdrop-blur-lg bg-opacity-96 h-full border border-white/10 transition-all duration-500',
          isDark ? colors.dark.background.secondary : 'bg-white'
        ]">
          <img :src="visibleProjects.farLeft.image" :alt="t(visibleProjects.farLeft.name)" class="w-full h-40 object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
            <h3 class="text-lg font-bold mb-2 drop-shadow-lg text-white">
              {{ t(visibleProjects.farLeft.name) }}
            </h3>
            <p class="text-sm drop-shadow-sm line-clamp-2 text-white/90">
              {{ t(visibleProjects.farLeft.description) }}
            </p>
          </div>
        </div>
      </div>      <!-- Card left (Previous Project) -->
      <div :ref="el => cardRefs[1] = el" class="card-container cursor-pointer preserve-3d"
        @click="handleCardClick('left')" :title="`Previous: ${t(visibleProjects.left.name)}`"
        :key="`left-${visibleProjects.left.id}-${currentMainIndex}-${forceUpdate}`">
        <div :class="[
          'relative group rounded-3xl overflow-hidden shadow-2xl card-3d backdrop-blur-lg bg-opacity-96 h-full border border-white/15 transition-all duration-500',
          isDark ? colors.dark.background.secondary : 'bg-white'
        ]">
          <img :src="visibleProjects.left.image" :alt="t(visibleProjects.left.name)" class="w-full h-56 object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6">
            <h3 class="text-xl font-bold mb-3 drop-shadow-lg text-white">
              {{ t(visibleProjects.left.name) }}
            </h3>
            <p class="text-base drop-shadow-sm line-clamp-2 text-white/95">
              {{ t(visibleProjects.left.description) }}
            </p>
          </div>
          <!-- Hover indicator -->
          <div
            class="absolute top-4 right-4 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-400 border border-white/40">
            <svg class="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </div>
        </div>
      </div>      <!-- Card center (Current Project) -->
      <div :ref="el => cardRefs[2] = el" class="card-container preserve-3d"
        :title="`Current: ${t(visibleProjects.center.name)}`"
        :key="`center-${visibleProjects.center.id}-${currentMainIndex}-${forceUpdate}`">
        <div :class="[
          'relative rounded-3xl overflow-hidden shadow-4xl card-3d backdrop-blur-lg bg-opacity-96 h-full border border-white/25',
          isDark ? colors.dark.background.secondary : 'bg-white'
        ]">
          <img :src="visibleProjects.center.image" :alt="t(visibleProjects.center.name)"
            class="w-full h-72 object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-10">
            <div v-if="showCenterContent" class="center-project-content">
              <h3 class="text-4xl font-bold mb-5 drop-shadow-lg text-white">
                {{ t(visibleProjects.center.name) }}
              </h3>
              <p class="mb-7 drop-shadow-sm text-lg leading-relaxed text-white/96">
                {{ t(visibleProjects.center.description) }}
              </p>
              <!-- Technologies -->
              <div class="flex flex-wrap gap-3 mb-7">
                <span v-for="tech in visibleProjects.center.technologies.slice(0, 3)" :key="tech"
                  class="px-4 py-2 bg-white/95 text-blue-900 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                  {{ t(tech) }}
                </span>
                <span v-if="visibleProjects.center.technologies.length > 3"
                  class="px-4 py-2 bg-white/75 text-blue-900 rounded-full text-sm font-medium">
                  +{{ visibleProjects.center.technologies.length - 3 }}
                </span>
              </div>
              <!-- GitHub link -->
              <a v-if="visibleProjects.center.github" :href="visibleProjects.center.github" target="_blank" rel="noopener"
                class="inline-flex items-center gap-3 text-white hover:text-blue-200 transition-colors font-semibold text-xl group">
                <span>View on GitHub</span>
                <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3">
                  </path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>      <!-- Card right (Next Project) -->
      <div :ref="el => cardRefs[3] = el" class="card-container cursor-pointer preserve-3d"
        @click="handleCardClick('right')" :title="`Next: ${t(visibleProjects.right.name)}`"
        :key="`right-${visibleProjects.right.id}-${currentMainIndex}-${forceUpdate}`">
        <div :class="[
          'relative group rounded-3xl overflow-hidden shadow-2xl card-3d backdrop-blur-lg bg-opacity-96 h-full border border-white/15 transition-all duration-500',
          isDark ? colors.dark.background.secondary : 'bg-white'
        ]">
          <img :src="visibleProjects.right.image" :alt="t(visibleProjects.right.name)"
            class="w-full h-56 object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6">
            <h3 class="text-xl font-bold mb-3 drop-shadow-lg text-white">
              {{ t(visibleProjects.right.name) }}
            </h3>
            <p class="text-base drop-shadow-sm line-clamp-2 text-white/95">
              {{ t(visibleProjects.right.description) }}
            </p>
          </div>
          <!-- Hover indicator -->
          <div
            class="absolute top-4 right-4 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-400 border border-white/40">
            <svg class="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>      <!-- Card farRight (Next+2 Project) -->
      <div :ref="el => cardRefs[4] = el" class="card-container cursor-pointer preserve-3d"
        @click="handleCardClick('farRight')" :title="`Next: ${t(visibleProjects.farRight.name)}`"
        :key="`farRight-${visibleProjects.farRight.id}-${currentMainIndex}-${forceUpdate}`">
        <div :class="[
          'relative group rounded-3xl overflow-hidden shadow-xl card-3d backdrop-blur-lg bg-opacity-96 h-full border border-white/10 transition-all duration-500',
          isDark ? colors.dark.background.secondary : 'bg-white'
        ]">
          <img :src="visibleProjects.farRight.image" :alt="t(visibleProjects.farRight.name)" class="w-full h-40 object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
            <h3 class="text-lg font-bold mb-2 drop-shadow-lg text-white">
              {{ t(visibleProjects.farRight.name) }}
            </h3>
            <p class="text-sm drop-shadow-sm line-clamp-2 text-white/90">
              {{ t(visibleProjects.farRight.description) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyboard Hints -->
    <div class="hidden md:flex items-center gap-6 mt-6 text-base opacity-70 z-10">
      <div :class="['flex items-center gap-2', isDark ? 'text-gray-400' : 'text-gray-600']">
        <span>Previous</span>
        <kbd class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium">←</kbd>
      </div>
      <div :class="['flex items-center gap-2', isDark ? 'text-gray-400' : 'text-gray-600']">
        <kbd class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium">→</kbd>
        <span>Next</span>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="flex flex-col gap-8 w-full md:hidden z-10 px-4">
      <div v-for="(project, index) in projects" :key="project.id" :class="[
        'rounded-3xl overflow-hidden shadow-lg backdrop-blur-md bg-opacity-96 border transition-all duration-400',
        currentMainIndex === index
          ? 'border-blue-500/60 shadow-blue-500/25 shadow-2xl scale-105'
          : 'border-white/15 hover:shadow-xl hover:scale-[1.02]',
        isDark ? colors.dark.background.secondary : 'bg-white'
      ]">
        <img :src="project.image" :alt="t(project.name)" class="w-full h-52 object-cover" />
        <div class="p-7">
          <h3 :class="[
            'text-2xl font-bold mb-4',
            currentMainIndex === index
              ? (isDark ? 'text-blue-400' : 'text-blue-600')
              : (isDark ? colors.dark.text.primary : 'text-gray-800')
          ]">
            {{ t(project.name) }}
          </h3>
          <p :class="[
            'mb-5 text-lg leading-relaxed',
            isDark ? colors.dark.text.secondary : 'text-gray-600'
          ]">
            {{ t(project.description) }}
          </p>

          <!-- Technologies -->
          <div class="flex flex-wrap gap-3 mb-5">
            <span v-for="tech in project.technologies.slice(0, 3)" :key="tech"
              class="px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-semibold">
              {{ t(tech) }}
            </span>
            <span v-if="project.technologies.length > 3"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              +{{ project.technologies.length - 3 }}
            </span>
          </div>

          <!-- GitHub link -->
          <a v-if="project.github" :href="project.github" target="_blank" rel="noopener" :class="[
            'inline-flex items-center gap-3 font-semibold text-lg transition-colors',
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
          ]">
            <span>View on GitHub</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

/* Center content styling for smooth animations */
.center-project-content {
  opacity: 1;
  transform: translateY(0);
  transition: none; /* Let GSAP handle all animations */
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shadow-4xl {
  box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.5);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.bg-opacity-96 {
  background-color: rgba(255, 255, 255, 0.96);
}

.dark .bg-opacity-96 {
  background-color: rgba(17, 24, 39, 0.96);
}

/* Enhanced responsive design */
@media (max-width: 1600px) {
  .card-container {
    transform: scale(0.95);
  }

  .perspective-2500 {
    height: 800px;
  }
}

@media (max-width: 1400px) {
  .card-container {
    transform: scale(0.9);
  }

  .perspective-2500 {
    perspective: 2000px;
    height: 750px;
  }
}

@media (max-width: 1200px) {
  .perspective-2500 {
    perspective: 1600px;
    height: 700px;
  }

  .card-container {
    transform: scale(0.85);
  }
}

@media (max-width: 1024px) {
  .perspective-2500 {
    perspective: 1300px;
    height: 650px;
  }

  .card-container {
    transform: scale(0.8);
  }
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

.card-3d:hover::before {
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cursor-pointer:hover {
  transform: scale(1.02);
}

kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: 600;
  border: 1px solid;
  border-radius: 0.5rem;
  border-color: rgb(209 213 219);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}

.dark kbd {
  border-color: rgb(55 65 81);
  background-color: rgb(55 65 81);
  color: rgb(209 213 219);
}

.card-container[data-loading="true"] {
  opacity: 0.5;
  pointer-events: none;
}

.group:hover .group-hover\\:translate-x-1 {
  transform: translateX(0.25rem);
}

.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}

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
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.8);
  }
}
</style>
