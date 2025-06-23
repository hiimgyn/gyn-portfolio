<template>
  <div class="flex min-h-[calc(100vh-4rem-1.4rem)] relative">
    <!-- Mobile Overlay -->
    <div v-if="isMobileMenuOpen" :class="['fixed inset-0 bg-opacity-90 z-40 lg:hidden',
      isDark ? colors.dark.background.overlay : colors.light.background.overlay
    ]" @click="closeMobileMenu"></div>

    <!-- Sidebar -->
    <div :class="[
      'transition-transform duration-300 ease-in-out z-50',
      'lg:relative lg:translate-x-0 lg:w-auto',
      'fixed left-0 top-0 overflow-y-auto shadow-lg',
      isMobileMenuOpen ? ' h-full translate-x-0' : '-translate-x-full lg:translate-x-0' 
    ]">
      <Sidebar @select="handleSectionSelect" />
    </div>

    <!-- Mobile Toggle Button -->
    <button @click="toggleMobileMenu" :class="[
      'fixed top-1/2 -translate-y-1/2 z-50 lg:hidden rounded-r p-0.5',
      isDark ? colors.light.background.primary : colors.dark.background.primary,
      isDark ? colors.light.text.primary : colors.dark.text.primary,
      'transition-transform duration-300 ease-in-out',
      isMobileMenuOpen ? 'translate-x-[18rem]' : 'translate-x-0'
    ]">
      <svg :class="{ 'rotate-180': isMobileMenuOpen }" class="w-6 h-6 transition-transform duration-300" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto lg:ml-0">
      <Suspense>
        <Content :section="currentSection" />
        <template #fallback>
          <div class="flex items-center justify-center h-64">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span class="ml-2">Đang tải...</span>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { computed, defineAsyncComponent, onMounted, onUnmounted } from '@vue/runtime-core'
import { colors } from '@/constants/theme'
import { useStore } from '@/stores/theme'

const store = useStore()
const isDark = computed(() => store.isDark)
// Lazy load Sidebar và Content
const Sidebar = defineAsyncComponent(() =>
  import('@/components/views/AboutSections/Sidebar.vue')
)

const Content = defineAsyncComponent(() =>
  import('@/components/views/AboutSections/Content.vue')
)

const currentSection = ref('overview')
const isMobileMenuOpen = ref(false)

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Handle section selection
const handleSectionSelect = (section) => {
  currentSection.value = section
  // Auto close mobile menu when selecting on mobile
  if (window.innerWidth < 1024) {
    closeMobileMenu()
  }
}

// Close menu on window resize to desktop
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
   const saved = localStorage.getItem('selectedSection')
  if (saved) {
    currentSection.value = saved
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
