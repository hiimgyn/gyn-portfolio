<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-4"
  >
    <div
      :class="[
        'max-w-5xl mx-auto rounded-full px-5 py-2.5 backdrop-blur-xl border transition-all duration-200 flex justify-between items-center',
        isDark 
          ? 'bg-[#0b0d14]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.4)]' 
          : 'bg-white/85 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.06)]'
      ]"
    >
      <!-- Logo -->
      <router-link
        to="/"
        class="flex items-center gap-2 font-bold text-sm tracking-tight transition-colors group"
        :class="isDark ? 'text-white' : 'text-slate-900'"
      >
        <span class="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center text-xs font-mono font-bold group-hover:scale-105 transition-transform shadow-xs">
          G
        </span>
        <span class="font-mono tracking-wider group-hover:text-violet-400 transition-colors">gyn.dev</span>
      </router-link>

      <!-- Desktop Nav Items -->
      <nav class="hidden md:flex items-center gap-1">
        <router-link
          v-for="item in navItems"
          :key="item"
          :to="`/${item}`"
          :class="[
            'px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 relative',
            isCurrentPage(item)
              ? (isDark 
                  ? 'bg-white/10 text-white font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                  : 'bg-violet-50 text-violet-800 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]')
              : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-violet-50/50')
          ]"
        >
          <span>{{ $t(`nav.${item}`) }}</span>
        </router-link>

        <router-link
          to="/contact"
          :class="[
            'px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            isCurrentPage('contact')
              ? (isDark 
                  ? 'bg-white/10 text-white font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                  : 'bg-violet-50 text-violet-800 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]')
              : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-violet-50/50')
          ]"
        >
          {{ $t('nav.contact') }}
        </router-link>
      </nav>

      <!-- Right Action / Mobile Menu Toggle -->
      <div class="flex items-center gap-2">
        <router-link
          to="/contact"
          class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(139,92,246,0.35)] active:scale-95"
        >
          <span>{{ $t('hero.ctaContact') }}</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </router-link>

        <button
          @click="toggleMobileMenu"
          class="md:hidden p-1.5 rounded-lg border focus:outline-none transition-colors"
          :class="isDark ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-100'"
          aria-label="Toggle Navigation"
        >
          <Bars3Icon v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <XMarkIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 top-[4.5rem] bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
      @click="closeMobileMenu"
    ></div>

    <div
      :class="[
        'md:hidden fixed top-[4.5rem] left-4 right-4 rounded-2xl p-4 border backdrop-blur-xl z-50 transition-all duration-300 shadow-2xl space-y-2',
        isDark ? 'bg-[#11131f]/95 border-white/10' : 'bg-white/95 border-slate-200',
        isMobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      ]"
    >
      <router-link
        v-for="item in navItems"
        :key="item"
        :to="`/${item}`"
        @click="closeMobileMenu"
        :class="[
          'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isCurrentPage(item)
            ? (isDark ? 'bg-violet-600 text-white font-semibold' : 'bg-violet-50 text-violet-800 font-semibold')
            : (isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-violet-50')
        ]"
      >
        {{ $t(`nav.${item}`) }}
      </router-link>

      <router-link
        to="/contact"
        @click="closeMobileMenu"
        :class="[
          'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isCurrentPage('contact')
            ? (isDark ? 'bg-violet-600 text-white font-semibold' : 'bg-violet-50 text-violet-800 font-semibold')
            : (isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-violet-50')
        ]"
      >
        {{ $t('nav.contact') }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/stores/theme'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const store = useStore()
const route = useRoute()
const isDark = computed(() => store.isDark)
const navItems = ref(['about', 'hub'])
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const isCurrentPage = (page) => {
  const currentPath = route.path
  if (page === 'home' && currentPath === '/') return true
  return currentPath === `/${page}` || currentPath.startsWith(`/${page}/`)
}
</script>
