<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 py-2 z-50 backdrop-blur-sm border-b transition-colors duration-200',
      isDark ? colors.dark.background.primary : colors.light.background.primary,
      isDark ? colors.dark.border.primary : colors.light.border.primary
    ]"
  >
    <nav class="max-w mx-auto px-4 flex justify-between items-center">
      <!-- Logo & Left Menu -->
      <div class="flex items-center">
        <div :class="['logo pr-22 border-r', isDark ? colors.dark.border.primary : colors.light.border.primary]">
          <a
            href="/"
            :class="[
              'text-sm font-bold tracking-wider transition-colors duration-200 ms-5 me-20',
              isDark ? colors.dark.logo.text : colors.light.logo.text,
              isDark ? colors.dark.logo.hover : colors.light.logo.hover
            ]"
          >
            <GlitchText :text="$t('nav.logo')" />
          </a>
        </div>
        <!-- Desktop Menu -->
        <ul class="hidden md:flex items-center">
          <li
            v-for="item in navItems"
            :key="item"
            :class="['border-r', isDark ? colors.dark.border.primary : colors.light.border.primary]"
          >
            <a
              :href="`/${item}`"
              :class="[
                'px-6 py-2 text-sm font-medium transition-colors duration-200 relative',
                isDark ? colors.dark.text.secondary : colors.light.text.secondary,
                isDark ? colors.dark.text.hover : colors.light.text.hover,
                isCurrentPage(item) ? `border-b-3 ${isDark ? colors.dark.border.accent : colors.light.border.accent}` : ''
              ]"
            >
              <GlitchText :text="$t(`nav.${item}`)" />
            </a>
          </li>
        </ul>
      </div>

      <!-- Right Side: Desktop Contact + Mobile Menu -->
      <div class="flex items-center">
        <!-- Desktop Contact Section -->
        <div class="hidden md:block" :class="['border-l', isDark ? colors.dark.border.primary : colors.light.border.primary]">
          <a
            href="/contact"
            :class="[
              'px-6 py-2 text-sm font-medium transition-colors duration-200 relative',
              isDark ? colors.dark.text.secondary : colors.light.text.secondary,
              isDark ? colors.dark.text.hover : colors.light.text.hover,
              isCurrentPage('contact') ? `border-b-3 ${isDark ? colors.dark.border.accent : colors.light.border.accent}` : ''
            ]"
          >
            <GlitchText :text="$t('nav.contact')" />
          </a>
        </div>
        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden ml-4"
          :class="[isDark ? colors.dark.text.secondary : colors.light.text.secondary]"
        >
          <span class="sr-only">Menu</span>
          <MenuIcon v-if="!isMobileMenuOpen" class="h-6 w-6" />
          <XIcon v-else class="h-6 w-6" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div
      v-show="isMobileMenuOpen"
      :class="[
        'md:hidden fixed top-[2.5rem] right-0 w-[50vw] sm:w-[50vw] md:w-[40vw]  z-40 transform transition-all duration-300 border-1',
        isDark ? colors.dark.background.primary : colors.light.background.primary,
        isDark ? colors.dark.border.primary : colors.light.border.primary,
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <div class="px-6 py-4 space-y-3">
        <a
          v-for="item in navItems"
          :key="item"
          :href="`/${item}`"
          :class="[
            'block px-4 py-2 text-base font-medium transition-colors duration-200 relative',
            isDark ? colors.dark.text.secondary : colors.light.text.secondary,
            isDark ? colors.dark.text.hover : colors.light.text.hover,
            isCurrentPage(item) ? 'border-l-4 border-purple-500' : ''
          ]"
        >
          <GlitchText :text="$t(`nav.${item}`)" />
        </a>
        <a
          href="/contact"
          :class="[
            'block px-4 py-2 text-base font-medium transition-colors duration-200 relative',
            isDark ? colors.dark.text.secondary : colors.light.text.secondary,
            isDark ? colors.dark.text.hover : colors.light.text.hover,
            isCurrentPage('contact') ? 'border-l-4 border-purple-500' : ''
          ]"
        >
          <GlitchText :text="$t('nav.contact')" />
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from '@vue/reactivity'
import { useStore } from '@/stores/theme'
import { useRoute } from 'vue-router'
import GlitchText from '../utility/GlitchText.vue'
import { colors } from '@/constants/theme'
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/vue/24/outline'

const store = useStore()
const route = useRoute()
const isDark = computed(() => store.isDark)
const navItems = ref(['about', 'hub'])
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const isCurrentPage = (page) => {
  const currentPath = route.path
  if (page === 'home' && currentPath === '/') return true
  return currentPath === `/${page}` || currentPath.startsWith(`/${page}/`)
}
</script>
