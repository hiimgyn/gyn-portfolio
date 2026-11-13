<template>
  <header class="fixed inset-x-0 top-0 z-30 bg-[#070A14]/30 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
      <Wordmark @navigate="open = false" />
      <nav class="flex items-center gap-1 sm:gap-2" :aria-label="$t('nav.main')">
        <router-link
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :class="`hidden rounded-full px-4 py-2 text-sm transition-colors md:block ${focus} ${active(l.to) ? 'text-white' : 'text-[#C3C9DB] hover:text-white'}`"
        >{{ $t(l.label) }}</router-link>
        <button
          type="button"
          :class="`rounded-full px-3 py-2 font-mono text-xs font-medium uppercase tracking-wider text-[#C3C9DB] transition-colors hover:text-white ${focus}`"
          :aria-label="$t('nav.switchLanguage')"
          @click="setLocale(locale === 'en' ? 'vi' : 'en')"
        >
          <span :class="locale === 'en' ? 'text-white' : 'text-[#5A6380]'">EN</span>
          <span class="text-[#5A6380]"> / </span>
          <span :class="locale === 'vi' ? 'text-white' : 'text-[#5A6380]'">VI</span>
        </button>
        <a :href="GITHUB" v-bind="ext" :class="`hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:inline-flex ${focus}`">
          <Github class="size-4" /> GitHub
        </a>
        <button
          type="button"
          :class="`grid size-10 place-items-center rounded-full border border-white/20 text-white md:hidden ${focus}`"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="$t('nav.menu')"
          @click="open = !open"
        >
          <XMarkIcon v-if="open" class="size-5" />
          <Bars2Icon v-else class="size-5" />
        </button>
      </nav>
    </div>
    <div v-if="open" id="mobile-nav" class="border-t border-[#1E2642] bg-[#070A14]/95 px-4 pb-6 pt-2 md:hidden">
      <router-link
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        :class="`block border-b border-[#1E2642] py-4 font-display text-2xl font-extrabold ${focus} ${active(l.to) ? 'text-white' : 'text-[#A3ACC4]'}`"
        @click="open = false"
      >{{ $t(l.label) }}</router-link>
      <a :href="GITHUB" v-bind="ext" :class="`mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white ${focus}`">
        <Github class="size-4" /> GitHub
      </a>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Bars2Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import Wordmark from '@/components/layouts/Wordmark.vue'
import Github from '@/assets/Icons/Github.vue'
import { setLocale } from '@/i18n'
import { focus, ext, GITHUB } from '@/ui'

const { locale } = useI18n()
const route = useRoute()
const open = ref(false)
const links = [
  { to: '/#projects', label: 'nav.projects' },
  { to: '/about', label: 'nav.about' },
  { to: '/tetris', label: 'nav.tetris' },
  { to: '/contact', label: 'nav.contact' }
]
const active = (to) => !to.includes('#') && route.path === to
</script>
