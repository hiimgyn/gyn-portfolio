import { ref, watch } from '@vue/reactivity'
import { nextTick } from '@vue/runtime-core'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import macbookModel from '@/assets/Models/macbook.glb'
import SceneConfig from './jsons/Scene.json'

export function useMacbookThree({ isDark, threeContainer }) {
  // Configuration
  const CONFIG = {
    positions: { closedY: -11.5, openedY: -9 },
    float: { amp: 0.4, speed: 0.7 },
    swing: { amp: 0.3, speed: 0.04 },
    tilt: { amp: 0.55, openTilt: 0.2 },
    durations: { open: 0.4, close: 0.3, flyUp: 0.2, flyDown: 0.2 }
  }

  // State Management
  const modelLoaded = ref(false)
  const modelError = ref(false)
  const modelLoadingProgress = ref(0)
  const isAnimating = ref(false)
  const isOpen = ref(false)

  // Three.js Core Variables
  let renderer = null
  let scene = null
  let camera = null
  let controls = null
  let mixer = null
  let animationFrameId = null
  let modelMesh = null
  let animations = []
  let currentAction = null
  let resizeObserver = null

  // Mouse interaction
  let raycaster = null
  let mouse = new THREE.Vector2()
  let isDragging = false
  let mouseDownPosition = { x: 0, y: 0 }

  // Animation state
  let swing = 0
  let tilt = 0
  let swingTimer = 0
  let gsapTween = null

  // Utility Functions
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const getContainerSize = () => {
    if (!threeContainer.value) return { width: 0, height: 0 }
    const rect = threeContainer.value.getBoundingClientRect()
    return {
      width: rect.width || window.innerWidth,
      height: rect.height || window.innerHeight
    }
  }

  // Renderer Configuration
  const createRenderer = () => {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = isDark.value ? 1.4 : 1.0
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    return renderer
  }

  // Scene Setup
  const loadSceneFromConfig = () => {
    try {
      const loader = new THREE.ObjectLoader()
      scene = loader.parse(SceneConfig)
      camera = findCameraInScene() || createDefaultCamera()
    } catch (error) {
      //console.error('Failed to load scene from config:', error)
      createDefaultScene()
    }
  }

  const findCameraInScene = () => {
    let foundCamera = null
    scene.traverse((child) => {
      if (child.isPerspectiveCamera && !foundCamera) {
        foundCamera = child
      }
    })
    return foundCamera
  }

  const createDefaultCamera = () => {
    const size = getContainerSize()
    const cam = new THREE.PerspectiveCamera(75, size.width / size.height || 1, 0.1, 1000)
    cam.position.set(0, 0, 10)
    return cam
  }

  const createDefaultScene = () => {
    scene = new THREE.Scene()
    camera = createDefaultCamera()

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    const directional = new THREE.DirectionalLight(0xffffff, 0.8)
    directional.position.set(1, 1, 1)
    directional.castShadow = true

    scene.add(ambient, directional)
  }

  // Material Optimization
  const optimizeModelMaterials = (model) => {
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const material = child.material

        if (material.map) {
          material.map.magFilter = THREE.LinearFilter
          material.map.minFilter = THREE.LinearMipmapLinearFilter
          material.map.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)
        }

        if (material.normalMap) {
          material.normalMap.magFilter = THREE.LinearFilter
          material.normalMap.minFilter = THREE.LinearMipmapLinearFilter
        }

        child.castShadow = true
        child.receiveShadow = true
        material.needsUpdate = true
      }
    })
  }

  // Model Loading
  const loadGLTFModel = () => {
    const loader = new GLTFLoader()

    loader.load(
      macbookModel,
      (gltf) => {
        try {
          modelMesh = gltf.scene
          optimizeModelMaterials(modelMesh)
          scene.add(modelMesh)
          animations = gltf.animations || []

          if (animations.length > 0) {
            mixer = new THREE.AnimationMixer(modelMesh)
          }

          setModelState(false)
          modelLoaded.value = true
          modelError.value = false
          animate()

          //console.log('Model loaded successfully')
        } catch (err) {
          //console.error('Model processing error:', err)
          modelError.value = true
        }
      },
      (progress) => {
        if (progress.lengthComputable) {
          modelLoadingProgress.value = Math.round((progress.loaded / progress.total) * 100)
        }
      },
      (error) => {
        //console.error('Model loading failed:', error)
        modelError.value = true
      }
    )
  }

  // Mouse Click Detection
  const handleModelClick = (event) => {
    event.stopPropagation() // NgÄƒn event bubbling

    if (!camera || !modelMesh || isAnimating.value || !modelLoaded.value) return

    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    if (!raycaster) {
      raycaster = new THREE.Raycaster()
    }

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(modelMesh, true)

    if (intersects.length > 0) {
      //console.log('Model clicked!', intersects[0])
      toggleAnimation()
    } else {
      //console.log('Clicked outside model - no animation')
    }
  }


  const setupMouseEvents = () => {
    if (!threeContainer.value || !renderer) return

    const canvas = renderer.domElement
    let clickStartTime = 0
    const CLICK_THRESHOLD = 200 // milliseconds
    const MOVE_THRESHOLD = 5 // pixels

    const onMouseDown = (event) => {
      mouseDownPosition = { x: event.clientX, y: event.clientY }
      clickStartTime = Date.now()
      isDragging = false
    }

    const onMouseMove = (event) => {
      const dx = event.clientX - mouseDownPosition.x
      const dy = event.clientY - mouseDownPosition.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > MOVE_THRESHOLD) {
        isDragging = true
      }
    }

    const onMouseUp = (event) => {
      const clickDuration = Date.now() - clickStartTime

      // Chá»‰ xá»­ lÃ½ nhÆ° click náº¿u:
      // 1. KhÃ´ng cÃ³ dragging
      // 2. Thá»i gian click ngáº¯n
      // 3. Model Ä‘Ã£ Ä‘Æ°á»£c load
      if (!isDragging &&
        clickDuration < CLICK_THRESHOLD &&
        modelMesh &&
        modelLoaded.value) {
        handleModelClick(event)
      }

      isDragging = false
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }


  // Animation Logic
  const animate = () => {
    if (!renderer || !scene || !camera) return

    animationFrameId = requestAnimationFrame(animate)

    if (mixer) mixer.update(1 / 60)

    swingTimer += 1 / 60
    swing = CONFIG.swing.amp * Math.sin(swingTimer * CONFIG.swing.speed)
    tilt = -CONFIG.tilt.amp * Math.sin(swingTimer * CONFIG.swing.speed)

    if (modelMesh) {
      if (isOpen.value && !isAnimating.value) {
        // Floating animation when open
        modelMesh.rotation.x = CONFIG.tilt.openTilt
        modelMesh.rotation.y = swing
        modelMesh.rotation.z = tilt
        const floatOffset = CONFIG.float.amp * Math.sin(swingTimer * CONFIG.float.speed)
        modelMesh.position.y = CONFIG.positions.openedY + floatOffset
      } else if (!isOpen.value && !isAnimating.value) {
        // Static position when closed
        modelMesh.rotation.x = 0
        modelMesh.rotation.y = 0
        modelMesh.rotation.z = 0
        modelMesh.position.y = CONFIG.positions.closedY
      }
    }

    if (controls) controls.update()
    renderer.render(scene, camera)
  }

  // Animation Toggle
  const toggleAnimation = () => {
    if (!mixer || isAnimating.value || animations.length === 0 || !modelMesh) return

    isAnimating.value = true
    const clip = animations[0]

    if (!currentAction) {
      currentAction = mixer.clipAction(clip)
      currentAction.setLoop(THREE.LoopOnce)
      currentAction.clampWhenFinished = true
    }

    // Kill existing tweens
    if (gsapTween) {
      gsapTween.kill()
      gsapTween = null
    }
    gsap.killTweensOf(modelMesh.position)
    gsap.killTweensOf(modelMesh.rotation)

    if (!isOpen.value) {
      // Opening animation
      currentAction.reset()
      currentAction.time = 0
      currentAction.timeScale = clip.duration / CONFIG.durations.open
      currentAction.play()

      gsapTween = gsap.to(modelMesh.position, {
        y: CONFIG.positions.openedY,
        duration: CONFIG.durations.flyUp,
        ease: "power4.out",
        onComplete: () => {
          isAnimating.value = false
          isOpen.value = true
        }
      })

      gsap.to(modelMesh.rotation, {
        x: CONFIG.tilt.openTilt,
        y: swing,
        z: tilt,
        duration: CONFIG.durations.flyUp,
        ease: "power2.out"
      })
    } else {
      // Closing animation
      currentAction.paused = false
      currentAction.time = clip.duration
      currentAction.timeScale = -clip.duration / CONFIG.durations.close
      currentAction.play()

      gsapTween = gsap.to(modelMesh.position, {
        y: CONFIG.positions.closedY,
        duration: CONFIG.durations.flyDown,
        ease: "power4.out"
      })

      gsap.to(modelMesh.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: CONFIG.durations.flyDown,
        ease: "power2.in",
        onComplete: () => {
          isAnimating.value = false
          isOpen.value = false
        }
      })
    }
  }

  const setModelState = (open) => {
    if (!mixer || animations.length === 0) return

    const clip = animations[0]
    if (!currentAction) {
      currentAction = mixer.clipAction(clip)
      currentAction.setLoop(THREE.LoopOnce)
      currentAction.clampWhenFinished = true
    }

    currentAction.paused = true
    currentAction.enabled = true
    currentAction.time = open ? clip.duration : 0
    mixer.setTime(open ? clip.duration : 0)
    isOpen.value = open
  }

  // Resize Handler
  const onWindowResize = debounce(() => {
    if (!threeContainer.value || !camera || !renderer) return

    const size = getContainerSize()
    if (size.width <= 0 || size.height <= 0) return

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
  }, 100)

  // Initialization
  const initThreeJS = async () => {
    if (!threeContainer.value) return

    try {
      cleanup()
      await nextTick()

      loadSceneFromConfig()
      const size = getContainerSize()

      renderer = createRenderer()
      renderer.setSize(size.width, size.height)
      threeContainer.value.appendChild(renderer.domElement)

      if (camera && renderer) {
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.enableRotate = false
        controls.enableZoom = false
        controls.dampingFactor = 0.05
      }

      // Setup mouse events
      const cleanupMouseEvents = setupMouseEvents()
      if (!window.threeCleanupFunctions) {
        window.threeCleanupFunctions = []
      }
      window.threeCleanupFunctions.push(cleanupMouseEvents)

      // Setup resize observer
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(onWindowResize)
        resizeObserver.observe(threeContainer.value)
      }

      window.addEventListener('resize', onWindowResize)
      loadGLTFModel()

      //console.log('Three.js initialized with click detection')
    } catch (error) {
      //console.error('Three.js initialization failed:', error)
      modelError.value = true
    }
  }

  // Cleanup
  const cleanup = () => {
    // Cleanup mouse events
    if (window.threeCleanupFunctions) {
      window.threeCleanupFunctions.forEach(cleanupFn => cleanupFn())
      window.threeCleanupFunctions = []
    }

    // Reset mouse variables
    raycaster = null
    mouse = new THREE.Vector2()
    isDragging = false
    mouseDownPosition = { x: 0, y: 0 }

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    window.removeEventListener('resize', onWindowResize)

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    if (mixer) {
      mixer.stopAllAction()
      mixer = null
    }

    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        }
      })
    }

    if (renderer) {
      if (threeContainer.value?.contains(renderer.domElement)) {
        threeContainer.value.removeChild(renderer.domElement)
      }
      renderer.dispose()
      renderer = null
    }

    if (controls) {
      controls.dispose()
      controls = null
    }

    // Reset state
    currentAction = null
    modelMesh = null
    animations = []
    swing = 0
    tilt = 0
    swingTimer = 0
    modelLoaded.value = false
    modelError.value = false
    modelLoadingProgress.value = 0
    isAnimating.value = false
    isOpen.value = false

    if (gsapTween) {
      gsapTween.kill()
      gsapTween = null
    }
  }

  // Theme Watcher
  watch(isDark, (newVal) => {
    if (renderer) {
      renderer.toneMappingExposure = newVal ? 1.4 : 1.0
    }
  }, { immediate: true })

  // Return API
  return {
    // State
    modelLoaded,
    modelError,
    modelLoadingProgress,
    isAnimating,
    isOpen,

    // Methods
    initThreeJS,
    cleanup,
    toggleAnimation,
    setModelState,
    getContainerSize
  }
}