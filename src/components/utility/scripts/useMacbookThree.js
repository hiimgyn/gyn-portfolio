import { ref, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import macbookModel from '@/assets/Models/macbook.glb'
import CameraPos from './Jsons/macbook/Camera.json'
import TopDirectionalLight from './Jsons/macbook/TopDirectionalLight.json'
import FrontDirectionalLight from './Jsons/macbook/FrontDirectionalLight.json'

export function useMacbookThree({ isDark, threeContainer }) {
  // State
  const modelLoaded = ref(false)
  const modelError = ref(false)
  const modelLoadingProgress = ref(0)

  // Three.js core
  let renderer, scene, camera, controls, mixer, animationFrameId
  let modelMesh = null
  let animations = []
  let currentAction = null

  // Animation state
  const isAnimating = ref(false)
  const isOpen = ref(false)

  // Effect config
  const EFFECT = {
    closedY: 0,
    openedY: 5,
    floatAmp: 0.4,       
    floatSpeed: 0.7,      
    swingAmp: 0.3,
    swingSpeed: 0.04,
    tiltAmp: 0.2,
    animDurationOpen: 0.8,
    animDurationClose: 1.2,
    flyUpDuration: 0.2,   
    flyDownDuration: 0.3,
    openTilt: 0.2,
  }

  // Effect state
  let swing = 0
  let tilt = 0
  let swingTimer = 0
  let gsapTween = null

  // --- Three.js logic ---
  const initThreeJS = () => {
    if (!threeContainer.value) return
    cleanup()

    // Scene
    scene = new THREE.Scene()

    // Camera
    camera = new THREE.PerspectiveCamera()
    setCameraFromJson(camera, CameraPos)

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.LinearToneMapping
    renderer.toneMappingExposure = 1
    threeContainer.value.appendChild(renderer.domElement)

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableRotate = false
    controls.enableZoom = false

    // Lights
    addDirectionalLightFromJson(scene, TopDirectionalLight)
    addDirectionalLightFromJson(scene, FrontDirectionalLight)
    //scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    // Load model
    loadGLTFModel()
    window.addEventListener('resize', onWindowResize)
  }

  const loadGLTFModel = () => {
    const loader = new GLTFLoader()
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      modelLoadingProgress.value = Math.round((itemsLoaded / itemsTotal) * 100)
    }
    loader.manager = loadingManager
    loader.load(
      macbookModel,
      (gltf) => {
        try {
          modelMesh = gltf.scene
          scene.add(modelMesh)
          animations = gltf.animations || []
          if (animations.length > 0) {
            mixer = new THREE.AnimationMixer(modelMesh)
          }
          setModelState(false)
          modelLoaded.value = true
          modelError.value = false
          animate()
        } catch (err) {
          modelError.value = true
        }
      },
      undefined,
      () => { modelError.value = true }
    )
  }

  function setCameraFromJson(camera, camJson) {
    if (!camera || !camJson || !camJson.object) return
    const m = camJson.object.matrix
    const matrix = new THREE.Matrix4()
    matrix.set(
      m[0], m[4], m[8],  m[12],
      m[1], m[5], m[9],  m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15]
    )
    camera.matrixAutoUpdate = false
    camera.matrix.copy(matrix)
    camera.matrix.decompose(camera.position, camera.quaternion, camera.scale)
    camera.fov = camJson.object.fov
    camera.aspect = camJson.object.aspect
    camera.near = camJson.object.near
    camera.far = camJson.object.far
    camera.updateProjectionMatrix()
  }


  function addDirectionalLightFromJson(scene, lightJson) {
    if (!scene || !lightJson || !lightJson.object) return
    const obj = lightJson.object
    const color = obj.color !== undefined ? obj.color : 0xffffff
    const intensity = obj.intensity !== undefined ? obj.intensity : 1
    const light = new THREE.DirectionalLight(color, intensity)
    if (obj.matrix) {
      const m = obj.matrix
      const matrix = new THREE.Matrix4()
      matrix.set(
        m[0], m[4], m[8],  m[12],
        m[1], m[5], m[9],  m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
      )
      light.matrixAutoUpdate = false
      light.matrix.copy(matrix)
      light.matrix.decompose(light.position, light.quaternion, light.scale)
    } else if (obj.position) {
      light.position.fromArray(obj.position)
    }
    if (obj.target && obj.target.position) {
      const target = new THREE.Object3D()
      target.position.fromArray(obj.target.position)
      scene.add(target)
      light.target = target
    }
    light.castShadow = !!obj.castShadow
    scene.add(light)
  }

  function setModelState(open) {
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

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }

  // Animation loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    if (mixer) mixer.update(1 / 60)

    swingTimer += 1 / 60
    swing = EFFECT.swingAmp * Math.sin(swingTimer * EFFECT.swingSpeed)
    tilt = -EFFECT.tiltAmp * Math.sin(swingTimer * EFFECT.swingSpeed)

    if (modelMesh) {
      if (isOpen.value && !isAnimating.value) {
        modelMesh.rotation.x = EFFECT.openTilt
        modelMesh.rotation.y = swing
        modelMesh.rotation.z = tilt
        
        // Sử dụng easeInOutSine để làm mượt chuyển động float
        const floatOffset = EFFECT.floatAmp * Math.sin(swingTimer * EFFECT.floatSpeed)
        const smoothFloat = floatOffset * easeInOutSine(Math.abs(Math.sin(swingTimer * EFFECT.floatSpeed)))
        modelMesh.position.y = EFFECT.openedY + smoothFloat
      } else if (!isOpen.value && !isAnimating.value) {
        modelMesh.rotation.x = 0
        modelMesh.rotation.y = 0
        modelMesh.rotation.z = 0
        modelMesh.position.y = EFFECT.closedY
      }
    }

    if (renderer && scene && camera) renderer.render(scene, camera)
  }

  // Toggle animation: mở/đóng với hiệu ứng bay/lắc và easing bằng GSAP
  function toggleAnimation() {
    if (!mixer || isAnimating.value || animations.length === 0) return
    isAnimating.value = true
    const clip = animations[0]
    currentAction = mixer.clipAction(clip)
    currentAction.setLoop(THREE.LoopOnce)
    currentAction.clampWhenFinished = true

    if (gsapTween) {
        gsapTween.kill()
        gsapTween = null
    }
    gsap.killTweensOf(modelMesh.position)
    gsap.killTweensOf(modelMesh.rotation)

    if (!isOpen.value) {
        // Opening animation with quick pop-up effect
        currentAction.reset()
        currentAction.time = 0
        currentAction.timeScale = clip.duration / EFFECT.animDurationOpen
        currentAction.play()

        // Quick pop-up animation
        gsapTween = gsap.to(modelMesh.position, {
            y: EFFECT.openedY,
            duration: EFFECT.flyUpDuration,
            ease: "power4.out",
            onUpdate: () => {
                // Tính toán thêm hiệu ứng float trong quá trình tweening
                const floatOffset = EFFECT.floatAmp * Math.sin(swingTimer * EFFECT.floatSpeed);
                modelMesh.position.y += floatOffset;
            },
            onComplete: () => {
                isAnimating.value = false
                isOpen.value = true
            }
        })
        
        // Quick rotation with forward tilt
        gsap.to(modelMesh.rotation, {
            x: EFFECT.openTilt, // Thêm rotation.x để nghiêng về phía trước
            y: swing,
            z: tilt,
            duration: EFFECT.flyUpDuration,
            ease: "power2.out",
        })
    } else {
        // Closing animation
        currentAction.paused = false
        currentAction.time = 2
        currentAction.timeScale = -clip.duration / EFFECT.animDurationClose
        currentAction.play()

        gsapTween = gsap.to(modelMesh.position, {
            y: EFFECT.closedY,
            duration: EFFECT.flyDownDuration,
            ease: "power4.out"
        })
        
        gsap.to(modelMesh.rotation, {
            x: 0, // Reset rotation.x về 0
            y: 0,
            z: 0,
            duration: EFFECT.flyDownDuration,
            ease: "power2.in",
            onComplete: () => {
                isAnimating.value = false
                isOpen.value = false
            }
        })
    }
  }

  // Resize
  const onWindowResize = () => {
    if (!threeContainer.value || !camera || !renderer) return
    camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  }

  // Cleanup
  const cleanup = () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', onWindowResize)
    if (mixer) { mixer.stopAllAction(); mixer = null }
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry && child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose())
            else child.material.dispose()
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
    if (controls) { controls.dispose(); controls = null }
    currentAction = null
    modelMesh = null
    animations = []
    modelLoaded.value = false
    modelError.value = false
  }

  // Theme watcher (optional)
  watch(isDark, (newVal) => {
    if (renderer) renderer.toneMappingExposure = newVal ? 1 : 0.8
  })

  return {
    modelLoaded,
    modelError,
    modelLoadingProgress,
    initThreeJS,
    cleanup,
    toggleAnimation,
    setModelState,
    setCameraFromJson,
  }
}