<template>
  <div :class="[
    'flex flex-col px-4 py-8',
    isDark ? colors.dark.text.primary : colors.light.text.primary
  ]">
    <!-- Main Content Container -->
    <div class="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

      <!-- Left Side: Maintain Content -->
      <div class="flex flex-col items-center justify-center lg:w-2/3">
        <!-- 404 Image -->
        <div class="mb-6">
          <img src="../../assets/Images/404.png" alt="Maintenance"
            class="w-[300px] sm:w-[400px] lg:w-[500px] h-auto object-contain opacity-80 mx-auto" />

        </div>

        <!-- Text Content Below Image -->
        <div class="flex flex-col items-center justify-center text-center w-full">
          <!-- Title -->
          <h1 :class="['w-full text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 text-center px-4',
            isDark ? colors.dark.text.primary : colors.light.text.primary
          ]">
            {{ $t('maintain.title') }}
          </h1>

          <!-- Description -->
          <div :class="['w-full mx-auto space-y-2 text-center px-4',
            isDark ? colors.dark.text.primary : colors.light.text.primary
          ]">
            <p class="text-sm sm:text-base lg:text-lg">{{ $t('maintain.description') }}</p>
            <p class="text-sm sm:text-base lg:text-lg">{{ $t('maintain.returnLater') }}</p>
          </div>
        </div>

        <!-- Back to Home Button -->
        <div class="mt-10 text-center">
          <router-link to="/" :class="[
            'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg',
            isDark
              ? 'bg-gradient-to-r from-purple-200 to-purple-500 text-white hover:from-purple-100 hover:to-purple-400'
              : 'bg-gradient-to-r from-purple-400 to-purple-800 text-white hover:from-purple-300 hover:to-purple-600'
          ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ $t('maintain.backToHome') }}
          </router-link>
        </div>
      </div>

      <!-- Right Side: Game Section -->
      <div class="flex flex-col items-center justify-center lg:w-1/3">
        <!-- Mini Game Section -->
        <div :class="[
          'w-full p-6 rounded-lg border',
          isDark ? colors.dark.background.primary : colors.light.background.primary,
          isDark ? colors.dark.border.primary : colors.light.border.primary
        ]">
          <h2 :class="[
            'text-lg font-semibold mb-4',
            isDark ? colors.dark.text.primary : colors.light.text.primary
          ]">
            {{ $t('maintain.gameTitle') }}
          </h2>

          <!-- Game Container -->
          <div class="relative">
            <canvas ref="gameCanvas" :width="gameWidth" :height="gameHeight" :class="[
              'border-2 rounded-lg cursor-pointer mx-auto',
              isDark ? colors.dark.border.secondary : colors.light.border.secondary
            ]" :style="{ background: currentBackground }" @click="jump" @touchstart.prevent="jump"></canvas>

            <!-- Game UI Overlay -->
            <div v-if="!gameStarted" class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              @click="jump" @touchstart.prevent="jump">
              <div class="mb-4">
                <!-- Animated Bird in waiting state -->
                <div class="relative">
                  <div :class="[
                    'w-8 h-8 rounded transition-all duration-500',
                    isDark ? 'bg-purple-600' : 'bg-blue-600'
                  ]" style="animation: float 2s ease-in-out infinite;">
                  </div>
                  <!-- Bird eye -->
                  <div class="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                  <!-- Bird beak -->
                  <div :class="[
                    'absolute top-2 -right-1 w-1 h-1',
                    'bg-orange-400'
                  ]"></div>
                </div>
              </div>
              <p :class="[
                'text-sm font-medium mb-2',
                isDark ? colors.light.text.primary : colors.light.text.primary
              ]">
                {{ $t('maintain.clickToStart') }}
              </p>
              <p :class="[
                'text-xs opacity-70',
                isDark ? colors.dark.text.secondary : colors.light.text.secondary
              ]">
                {{ $t('maintain.tapOrSpace') }}
              </p>
            </div>

            <!-- Score Display -->
            <div v-if="gameStarted" class="absolute top-4 left-4">
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-bold',
                isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-black'
              ]">
                {{ $t('maintain.score') }}: {{ score }}
              </span>
            </div>

            <!-- Game Over Screen -->
            <div v-if="gameOver" class="absolute inset-0 flex items-center justify-center">
              <div :class="[
                'bg-black/80 text-white p-6 rounded-lg text-center'
              ]">
                <h3 class="text-xl font-bold mb-2">{{ $t('maintain.gameOver') }}</h3>
                <p class="mb-4">{{ $t('maintain.finalScore') }}: {{ score }}</p>
                <button @click="resetGame" :class="[
                  'px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105',
                  isDark
                    ? 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-300 hover:to-red-400'
                    : 'bg-gradient-to-r from-red-400 to-red-800 text-white hover:from-red-300 hover:to-red-600'
                ]">
                  {{ $t('maintain.playAgain') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Game Instructions -->
          <p :class="[
            'text-sm mt-4',
            isDark ? colors.dark.text.secondary : colors.light.text.secondary
          ]">
            {{ $t('maintain.gameInstructions') }}
          </p>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const isDark = computed(() => store.isDark)

// Game refs and variables
const gameCanvas = ref(null)
const gameStarted = ref(false)
const gameOver = ref(false)
const score = ref(0)

// Game settings
const gameWidth = ref(400)
const gameHeight = ref(300)

// Background rotation system
const backgrounds = [
  'linear-gradient(135deg, #E4FBFF 0%, #EDEEF7 100%)',
]
const currentBackground = ref(backgrounds[0])
let backgroundInterval = null

// Game objects
let ctx = null
let animationFrame = null
let bird = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  velocity: 0,
  gravity: 0.015,
  jumpStrength: -1
}

let pipes = []
let pipeWidth = 60
let pipeGap = 140
let pipeSpeed = 1.2
let gameSpeed = 1

// Responsive canvas size
const updateCanvasSize = () => {
  const isMobile = window.innerWidth < 640
  gameWidth.value = isMobile ? 320 : 400
  gameHeight.value = isMobile ? 240 : 300

  // Update bird position relative to new canvas size
  if (bird && gameHeight.value) {
    bird.y = Math.min(bird.y, gameHeight.value - bird.height - 10)
  }
}

// Background rotation function
const rotateBackground = () => {
  const randomIndex = Math.floor(Math.random() * backgrounds.length)
  currentBackground.value = backgrounds[randomIndex]
}

// Start background rotation
const startBackgroundRotation = () => {
  backgroundInterval = setInterval(rotateBackground, 3000) // Change every 3 seconds
}

// Stop background rotation
const stopBackgroundRotation = () => {
  if (backgroundInterval) {
    clearInterval(backgroundInterval)
    backgroundInterval = null
  }
}

// Game functions
const startGame = () => {
  // Ensure canvas context is ready
  if (!ctx && gameCanvas.value) {
    ctx = gameCanvas.value.getContext('2d')
  }

  if (!ctx) {
    return
  }

  gameStarted.value = true
  gameOver.value = false
  score.value = 0
  gameSpeed = 1

  // Reset bird
  bird.x = 50
  bird.y = gameHeight.value / 2
  bird.velocity = 0

  // Reset pipes
  pipes = []

  // Clear any existing animation frame
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  // Start background rotation
  startBackgroundRotation()

  // Start game loop
  gameLoop()
}

const drawInitialState = () => {
  // Clear canvas with transparent background
  ctx.clearRect(0, 0, gameWidth.value, gameHeight.value)
}

const resetGame = () => {
  gameOver.value = false
  startGame()
}

const jump = () => {
  // Ensure canvas context is ready
  if (!ctx) {
    if (gameCanvas.value) {
      ctx = gameCanvas.value.getContext('2d')
    } else {
      return
    }
  }

  if (!gameStarted.value) {
    startGame()
    return
  }

  if (gameOver.value) {
    resetGame()
    return
  }

  bird.velocity = bird.jumpStrength
}

const gameLoop = () => {
  if (gameOver.value || !gameStarted.value) return

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, gameWidth.value, gameHeight.value)

  // Update bird physics
  bird.velocity += bird.gravity * gameSpeed
  bird.y += bird.velocity * gameSpeed

  // Check boundaries
  if (bird.y < 0) {
    bird.y = 0
    bird.velocity = 0
  }
  if (bird.y + bird.height > gameHeight.value) {
    endGame()
    return
  }

  // Spawn pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < gameWidth.value - 200) {
    addPipe()
  }

  // Update pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    const pipe = pipes[i]
    pipe.x -= pipeSpeed * gameSpeed

    // Remove off-screen pipes and increment score
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(i, 1)
      score.value++
      // Increase game speed every 10 points (slower progression)
      if (score.value % 10 === 0 && score.value > 0) {
        gameSpeed += 0.05
      }
    }

    // Check collision
    if (checkCollision(bird, pipe)) {
      endGame()
      return
    }
  }

  // Draw everything
  drawPipes()
  drawBird()

  // Continue game loop
  animationFrame = requestAnimationFrame(gameLoop)
}

const addPipe = () => {
  const minGapTop = 30
  const maxGapTop = gameHeight.value - pipeGap - 30
  const gapStart = Math.random() * (maxGapTop - minGapTop) + minGapTop

  pipes.push({
    x: gameWidth.value,
    topHeight: gapStart,
    bottomY: gapStart + pipeGap,
    bottomHeight: gameHeight.value - (gapStart + pipeGap)
  })
}

const drawBird = () => {
  // Bird body
  ctx.fillStyle = isDark.value ? '#60A5FA' : '#3B82F6'
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height)

  // Bird eye
  ctx.fillStyle = '#FFF'
  ctx.fillRect(bird.x + 14, bird.y + 4, 4, 4)

  // Bird beak
  ctx.fillStyle = '#FFA500'
  ctx.fillRect(bird.x + bird.width, bird.y + 8, 4, 4)
}

const drawPipes = () => {
  ctx.fillStyle = isDark.value ? '#10B981' : '#059669'

  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight)

    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, pipe.bottomHeight)

    // Pipe caps
    ctx.fillStyle = isDark.value ? '#065F46' : '#047857'
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipeWidth + 10, 20)
    ctx.fillRect(pipe.x - 5, pipe.bottomY, pipeWidth + 10, 20)

    // Reset pipe color
    ctx.fillStyle = isDark.value ? '#10B981' : '#059669'
  })
}

const checkCollision = (bird, pipe) => {
  // More precise collision detection
  const birdLeft = bird.x + 2
  const birdRight = bird.x + bird.width - 2
  const birdTop = bird.y + 2
  const birdBottom = bird.y + bird.height - 2

  const pipeLeft = pipe.x
  const pipeRight = pipe.x + pipeWidth

  // Check if bird is within pipe x-range
  if (birdRight > pipeLeft && birdLeft < pipeRight) {
    // Check if bird hits top pipe or bottom pipe
    if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
      return true
    }
  }

  return false
}

const endGame = () => {
  gameOver.value = true
  stopBackgroundRotation()
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
}

// Keyboard controls
const handleKeydown = (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault()
    jump()
  }
}

onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
  window.addEventListener('keydown', handleKeydown)

  // Initialize canvas context with delay to ensure DOM is ready
  setTimeout(() => {
    if (gameCanvas.value) {
      ctx = gameCanvas.value.getContext('2d')

      // Draw initial state with transparent background
      drawInitialState()
    }
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
  window.removeEventListener('keydown', handleKeydown)
  stopBackgroundRotation()
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }
}
</style>
