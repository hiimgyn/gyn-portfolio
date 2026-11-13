<template>
  <footer class="relative overflow-hidden border-t border-[#1E2642] bg-[#060912]">
    <div class="relative mx-auto grid max-w-6xl gap-10 px-4 pb-6 pt-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <Wordmark />
        <p class="mt-3 max-w-xs text-sm leading-relaxed text-[#7D86A3]">{{ $t('footer.tagline') }}</p>
      </div>
      <nav :aria-label="$t('footer.projects')" class="flex flex-col gap-2.5 text-sm">
        <a v-for="p in PROJECTS" :key="p.id" :href="p.links[0]?.href || `/#${p.id}`" v-bind="p.links[0] ? ext : {}" :class="`w-fit text-[#A3ACC4] transition-colors hover:text-white ${focus}`">{{ p.title }}</a>
      </nav>
      <div class="flex flex-col gap-2.5 text-sm md:items-end">
        <a :href="GITHUB" v-bind="ext" :class="`group inline-flex w-fit items-center gap-2 text-[#C3C9DB] transition-colors hover:text-white ${focus}`">
          <Github class="size-4 opacity-70 transition-opacity group-hover:opacity-100" /> HiimGyn
        </a>
        <a v-for="s in socialLinks" :key="s.name" :href="s.url" v-bind="ext" :class="`group inline-flex w-fit items-center gap-2 capitalize text-[#C3C9DB] transition-colors hover:text-white ${focus}`">
          <component :is="s.icon" class="size-4 opacity-70 transition-opacity group-hover:opacity-100" /> {{ s.name }}
        </a>
        <a :href="`mailto:${EMAIL}`" :class="`w-fit break-all text-[#C3C9DB] transition-colors hover:text-white ${focus}`">{{ EMAIL }}</a>
        <span class="text-[#5A6380]">© {{ year }} Gyn Nguyen</span>
      </div>
    </div>
    <div
      aria-hidden="true"
      class="pointer-events-none -mb-[0.22em] select-none whitespace-nowrap px-4 text-center font-display text-[clamp(3.5rem,15vw,14rem)] font-extrabold leading-none tracking-[-0.04em] text-transparent sm:px-6"
      style="background-image: linear-gradient(180deg, rgba(251,191,36,0.2), rgba(251,191,36,0) 85%); -webkit-background-clip: text; background-clip: text"
    >gyn nguyen</div>
  </footer>
</template>

<script setup>
import Wordmark from '@/components/layouts/Wordmark.vue'
import Github from '@/assets/Icons/Github.vue'
import { socialLinks } from '@/constants/links'
import { PROJECTS } from '@/data/projects'
import { focus, ext, GITHUB, EMAIL } from '@/ui'

const year = new Date().getFullYear()
</script>
