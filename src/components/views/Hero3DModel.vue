<template>
  <div
    ref="containerRef"
    class="relative w-full h-[480px] sm:h-[540px] lg:h-[580px] select-none flex items-center justify-center cursor-pointer group"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @click="onCanvasClick"
  >
    <!-- Soft Ambient Ethereal Violet Halo behind 3D Model (Borderless) -->
    <div
      class="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full blur-3xl pointer-events-none -z-10 transition-opacity duration-700"
      :class="isDark 
        ? 'bg-gradient-to-tr from-violet-600/30 via-purple-500/20 to-emerald-500/10 opacity-70 group-hover:opacity-95' 
        : 'bg-gradient-to-tr from-violet-300/40 via-purple-200/30 to-emerald-200/20 opacity-60 group-hover:opacity-90'"
    ></div>

    <!-- Three.js Canvas Container (Transparent & Borderless) -->
    <div ref="canvasWrapperRef" class="w-full h-full flex items-center justify-center"></div>

    <!-- Top Identifier Badge (Floating freely without stiff borders) -->
    <div
      class="absolute top-2 left-4 sm:left-6 flex items-center gap-2 pointer-events-none z-10 font-mono text-[11px] backdrop-blur-md px-3.5 py-1.5 rounded-full border transition-all"
      :class="isDark 
        ? 'bg-[#121528]/85 border-violet-500/30 text-violet-200 shadow-md' 
        : 'bg-white/90 border-violet-200 text-violet-800 shadow-xs'"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-bold tracking-wider">3D_COPILOT // SYS_AGENT</span>
    </div>

    <!-- Active State Pill (Top Right) -->
    <div
      class="absolute top-2 right-4 sm:right-6 z-10 pointer-events-none font-mono text-[11px] px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all flex items-center gap-2"
      :class="isDark 
        ? 'bg-[#121528]/85 border-violet-500/30 text-violet-200 shadow-md' 
        : 'bg-white/90 border-violet-200 text-violet-800 shadow-xs'"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="activeEmote ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'"></span>
      <span>{{ activeEmote ? `EMOTE: ${activeEmote.toUpperCase()}` : 'STATUS: INTERACTIVE_60FPS' }}</span>
    </div>

    <!-- Interactive Emote Control Bar (Floating bottom center) -->
    <div
      class="absolute bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-2xl text-xs font-mono backdrop-blur-xl border transition-all duration-300 flex items-center gap-2 z-20 shadow-2xl"
      :class="isDark 
        ? 'bg-[#0f1224]/90 border-violet-500/30 text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.6)]' 
        : 'bg-white/95 border-violet-300/80 text-violet-900 shadow-[0_8px_24px_rgba(139,92,246,0.15)]'"
      @click.stop
    >
      <button
        v-for="btn in emoteButtons"
        :key="btn.emote"
        @click="triggerEmote(btn.emote, btn.toast)"
        class="px-3.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 flex items-center gap-1.5 active:scale-95 hover:scale-105"
        :class="activeEmote === btn.emote 
          ? 'bg-violet-600 text-white shadow-md' 
          : (isDark ? 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white' : 'bg-violet-50 hover:bg-violet-100 text-violet-900')"
      >
        <span>{{ btn.icon }}</span>
        <span>{{ btn.label }}</span>
      </button>
    </div>

    <!-- Interactive Toast Feedback Banner -->
    <transition name="toast-fade">
      <div
        v-if="toastMessage"
        class="absolute top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-xs font-mono font-semibold backdrop-blur-md border shadow-xl z-30 pointer-events-none flex items-center gap-2 whitespace-nowrap"
        :class="isDark ? 'bg-[#15182e]/95 border-violet-500/50 text-violet-200' : 'bg-white/95 border-violet-300 text-violet-900 shadow-lg'"
      >
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Loading State Indicator -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-xs z-20 font-mono text-xs"
      :class="isDark ? 'text-violet-300' : 'text-violet-700'"
    >
      <div class="w-8 h-8 rounded-full border-2 border-violet-400 border-t-transparent animate-spin"></div>
      <div class="tracking-wider">INITIALIZING 3D COPILOT...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '@/stores/theme'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

const store = useStore()
const isDark = computed(() => store.isDark)

const containerRef = ref(null)
const canvasWrapperRef = ref(null)
const isLoading = ref(true)
const toastMessage = ref('')
const activeEmote = ref('')
let toastTimeout = null

const emoteButtons = [
  { emote: 'Wave', label: 'Wave', icon: '👋', toast: 'Co-Pilot: Welcome to Gyn\'s Portfolio! 👋' },
  { emote: 'ThumbsUp', label: 'Approve', icon: '👍', toast: 'Co-Pilot: BRD Specifications Verified! 👍' },
  { emote: 'Jump', label: 'Sprint', icon: '⚡', toast: 'Co-Pilot: Sprint Delivered Ahead of Schedule! ⚡' },
  { emote: 'Dance', label: 'Celebrate', icon: '✨', toast: 'Co-Pilot: Production Release 99.4% SLA! ✨' }
]

const showToast = (msg) => {
  toastMessage.value = msg
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMessage.value = ''
  }, 2400)
}

// -------------------------------------------------------------
// THREE.JS SCENE STATE & 3D ROBOT COMPANION
// -------------------------------------------------------------
let scene, camera, renderer, animationFrameId
let modelGroup, robotModel, headBone
let mixer, actions = {}
let currentAction = null
let clock = new THREE.Clock()

// Mouse tracking lerp variables
let targetRotY = 0
let targetRotX = 0
let currentRotY = 0
let currentRotX = 0
let targetHeadX = 0
let targetHeadY = 0
let currentHeadX = 0
let currentHeadY = 0

// Lighting references
let ambientLight, dirLight, rimLight, platformMesh

const fadeToAction = (name, duration = 0.3, isEmote = false) => {
  const previousAction = currentAction
  const newAction = actions[name]

  if (!newAction || previousAction === newAction) return

  newAction.reset()
  newAction.setEffectiveTimeScale(1)
  newAction.setEffectiveWeight(1)

  if (isEmote) {
    newAction.clampWhenFinished = true
    newAction.loop = THREE.LoopOnce
    activeEmote.value = name
  }

  if (previousAction) {
    previousAction.crossFadeTo(newAction, duration, true)
  }

  newAction.play()
  currentAction = newAction
}

const triggerEmote = (emoteName, customToast) => {
  if (!actions[emoteName]) return
  showToast(customToast || `Co-Pilot: Triggered ${emoteName}!`)
  fadeToAction(emoteName, 0.25, true)
}

const onCanvasClick = () => {
  const availableEmotes = ['Wave', 'ThumbsUp', 'Jump', 'Dance']
  const randomEmote = availableEmotes[Math.floor(Math.random() * availableEmotes.length)]
  const match = emoteButtons.find(b => b.emote === randomEmote)
  triggerEmote(randomEmote, match ? match.toast : undefined)

  if (modelGroup) {
    gsap.fromTo(
      modelGroup.position,
      { y: -1.6 },
      { y: -1.45, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
    )
  }
}

const onMouseMove = (event) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const normY = -((event.clientY - rect.top) / rect.height) * 2 + 1

  targetRotY = normX * 0.55
  targetRotX = normY * 0.15

  targetHeadX = normX * 0.4
  targetHeadY = -normY * 0.25
}

const onMouseLeave = () => {
  targetRotY = 0
  targetRotX = 0
  targetHeadX = 0
  targetHeadY = 0
}

// -------------------------------------------------------------
// SCENE SETUP & GLTF LOADING
// -------------------------------------------------------------
const initScene = () => {
  if (!canvasWrapperRef.value) return

  const width = canvasWrapperRef.value.clientWidth || 520
  const height = canvasWrapperRef.value.clientHeight || 520

  scene = new THREE.Scene()

  // Camera positioned to view full character with natural framing
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50)
  camera.position.set(0, 0.65, 5.3)
  camera.lookAt(0, 0.05, 0)

  // WebGLRenderer with complete transparency (borderless)
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  canvasWrapperRef.value.appendChild(renderer.domElement)

  // Lights (Pastel Violet & Soft Ambient)
  ambientLight = new THREE.AmbientLight(isDark.value ? 0xc4b5fd : 0xffffff, isDark.value ? 2.2 : 2.6)
  scene.add(ambientLight)

  dirLight = new THREE.DirectionalLight(0xffffff, 1.7)
  dirLight.position.set(2.5, 5, 4)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024
  dirLight.shadow.bias = -0.001
  scene.add(dirLight)

  rimLight = new THREE.DirectionalLight(0xc4b5fd, 2.2)
  rimLight.position.set(-3, 3, -2)
  scene.add(rimLight)

  // Stylized Futuristic Pedestal
  const platformGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.1, 32)
  const platformMat = new THREE.MeshStandardMaterial({
    color: isDark.value ? 0x16182a : 0xf5f3ff,
    roughness: 0.35,
    metalness: 0.3
  })
  platformMesh = new THREE.Mesh(platformGeo, platformMat)
  platformMesh.position.set(0, -1.65, 0)
  platformMesh.receiveShadow = true
  scene.add(platformMesh)

  // Glowing ring border
  const ringGeo = new THREE.RingGeometry(1.62, 1.68, 32)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xa78bfa,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.set(0, -1.59, 0)
  scene.add(ring)

  // Load RobotExpressive.glb
  const loader = new GLTFLoader()
  loader.load(
    '/models/RobotExpressive.glb',
    (gltf) => {
      robotModel = gltf.scene
      modelGroup = new THREE.Group()
      modelGroup.position.set(0, -1.6, 0)
      modelGroup.scale.set(0.62, 0.62, 0.62) // Perfectly proportioned scale

      robotModel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
        if (child.isBone && child.name.toLowerCase().includes('head')) {
          headBone = child
        }
      })

      modelGroup.add(robotModel)
      scene.add(modelGroup)

      mixer = new THREE.AnimationMixer(robotModel)
      gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer.clipAction(clip)
      })

      mixer.addEventListener('finished', (e) => {
        if (e.action !== actions['Idle'] && actions['Idle']) {
          fadeToAction('Idle', 0.4)
          activeEmote.value = ''
        }
      })

      if (actions['Idle']) {
        fadeToAction('Idle', 0.1)
      }

      isLoading.value = false
    },
    undefined,
    (err) => {
      console.error('Failed to load RobotExpressive.glb:', err)
      isLoading.value = false
    }
  )
}

// -------------------------------------------------------------
// RENDER LOOP & LIFECYCLE
// -------------------------------------------------------------
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  const delta = clock.getDelta()

  if (mixer) {
    mixer.update(delta)
  }

  currentRotY += (targetRotY - currentRotY) * 0.08
  currentRotX += (targetRotX - currentRotX) * 0.08

  if (modelGroup) {
    modelGroup.rotation.y = currentRotY
    modelGroup.rotation.x = currentRotX
  }

  if (headBone) {
    currentHeadX += (targetHeadX - currentHeadX) * 0.1
    currentHeadY += (targetHeadY - currentHeadY) * 0.1
    headBone.rotation.y = currentHeadX
    headBone.rotation.x = currentHeadY
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const onResize = () => {
  if (!canvasWrapperRef.value || !renderer || !camera) return
  const width = canvasWrapperRef.value.clientWidth
  const height = canvasWrapperRef.value.clientHeight
  if (width === 0 || height === 0) return

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

watch(isDark, (val) => {
  if (ambientLight) {
    ambientLight.color.setHex(val ? 0xa78bfa : 0xf3edf8)
    ambientLight.intensity = val ? 1.5 : 2.0
  }
  if (platformMesh) {
    platformMesh.material.color.setHex(val ? 0x16182a : 0xf5f3ff)
  }
})

onMounted(() => {
  initScene()
  animate()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', onResize)
  if (renderer && renderer.domElement && canvasWrapperRef.value) {
    canvasWrapperRef.value.removeChild(renderer.domElement)
  }
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px) scale(0.95);
}
</style>
