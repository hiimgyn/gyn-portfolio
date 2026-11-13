<template>
  <div>
    <section class="flex min-h-svh flex-col justify-end px-4 pb-20 sm:px-6">
      <div ref="hero" :class="`mx-auto w-full max-w-6xl ${shadowText}`">
        <p class="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#A3ACC4]">
          <span class="size-2 rounded-full bg-[#FBBF24]"></span>{{ $t('home.eyebrow') }}
        </p>
        <h1 :class="`${h1} mt-5 max-w-4xl`">{{ $t('home.title') }}</h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-[#B4BCD2]">{{ $t('home.lead') }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <router-link to="/#projects" :class="cta">{{ $t('home.ctaWork') }}</router-link>
          <router-link to="/about" :class="ghost">{{ $t('home.ctaAbout') }} <ArrowRightIcon class="size-4" /></router-link>
        </div>
      </div>
    </section>

    <section data-stage="1" class="flex min-h-[90svh] items-start px-4 pt-24 sm:px-6">
      <div :class="`mx-auto w-full max-w-6xl ${shadowText}`">
        <h2 :class="`${h2} max-w-2xl`">{{ $t('home.approachTitle') }}</h2>
        <p :class="lead">{{ $t('home.approachLead') }}</p>
      </div>
    </section>

    <section class="px-4 py-24 sm:px-6">
      <div class="mx-auto max-w-6xl">
        <h2 :class="h2">{{ $t('home.howTitle') }}</h2>
        <ul class="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="(I, i) in HOW" :key="i" class="border-t border-[#262F4D] pt-5">
            <component :is="I" class="size-5" :class="i === 0 ? 'text-[#FBBF24]' : 'text-[#8B8EF7]'" />
            <h3 class="mt-3 font-semibold text-white">{{ $t(`home.how.${i}.title`) }}</h3>
            <p class="mt-1.5 text-[15px] leading-relaxed text-[#A3ACC4]">{{ $t(`home.how.${i}.text`) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section id="projects" class="scroll-mt-20 px-4 pt-24 sm:px-6">
      <div :class="`mx-auto w-full max-w-6xl ${shadowText}`">
        <h2 :class="h2">{{ $t('home.projectsTitle') }}</h2>
        <p :class="`${lead} max-w-xl`">{{ $t('home.projectsLead') }}</p>
      </div>
    </section>

    <section v-for="(p, i) in PROJECTS" :id="p.id" :key="p.id" class="scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
      <div :class="`mx-auto grid max-w-6xl items-center gap-10 lg:gap-16 ${i % 2 ? 'lg:grid-cols-[1.25fr_0.75fr] lg:[&>*:first-child]:order-2' : 'lg:grid-cols-[0.75fr_1.25fr]'}`">
        <div :class="shadowText">
          <p class="flex items-center gap-2 text-sm text-[#8F98B5]">
            <span class="size-2 rounded-full" :style="{ background: p.accent }"></span>{{ $t(`work.${p.id}.kind`) }}
          </p>
          <h2 :class="`${h2} mt-3`">{{ p.title }}</h2>
          <p :class="lead">{{ $t(`work.${p.id}.description`) }}</p>
          <ul class="mt-6 max-w-md space-y-2.5 text-[15px] text-[#C3C9DB]">
            <li v-for="k in 3" :key="k" class="flex gap-3">
              <span aria-hidden="true" class="mt-2.5 h-px w-3 shrink-0" :style="{ background: p.accent }"></span>
              {{ $t(`work.${p.id}.points.${k - 1}`) }}
            </li>
          </ul>
          <div class="mt-8 flex flex-wrap items-center gap-2">
            <a v-for="(l, k) in p.links" :key="l.href" :href="l.href" v-bind="ext" :class="k === 0 ? outline : `${ghost} px-4! py-2.5!`">
              <Github v-if="l.label === 'source'" class="size-4 opacity-70" />
              {{ $t(`work.links.${l.label}`) }}
              <ArrowUpRightIcon v-if="k === 0 && l.label !== 'source'" class="size-4" :style="{ color: p.accent }" />
            </a>
            <span v-if="p.private" class="inline-flex items-center gap-1.5 rounded-full border border-[#262F4D] px-4 py-2.5 text-sm text-[#8F98B5]">
              <LockClosedIcon class="size-4" /> {{ $t('work.links.private') }}
            </span>
          </div>
        </div>
        <SkillMock v-if="p.mock === 'skill'" :title="p.host" />
        <VbookMock v-else-if="p.mock === 'vbook'" :title="p.host" />
        <WindowFrame v-else :title="p.host">
          <img :src="p.image" :alt="$t(`work.${p.id}.alt`)" width="1600" height="1000" :loading="i === 0 ? 'eager' : 'lazy'" decoding="async" class="aspect-[16/10] w-full object-cover object-top" />
        </WindowFrame>
      </div>
    </section>

    <section class="px-4 py-24 sm:px-6">
      <div class="mx-auto max-w-6xl">
        <h2 :class="h2">{{ $t('home.moreTitle') }}</h2>
        <ul class="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          <li v-for="m in MORE" :key="m.to" class="border-t border-[#262F4D] pt-5">
            <router-link :to="m.to" :class="`group block rounded-lg ${focus}`">
              <component :is="m.icon" class="size-5 text-[#8B8EF7]" />
              <h3 class="mt-3 flex items-center gap-2 font-semibold text-white">
                {{ $t(`home.more.${m.key}.title`) }}
                <ArrowRightIcon class="size-4 text-[#FBBF24] transition-transform group-hover:translate-x-1" />
              </h3>
              <p class="mt-1.5 max-w-md text-[15px] leading-relaxed text-[#A3ACC4]">{{ $t(`home.more.${m.key}.text`) }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </section>

    <section data-stage="2" class="flex min-h-[110svh] items-center px-4 sm:px-6">
      <div :class="`mx-auto w-full max-w-6xl ${shadowText}`">
        <h2 :class="`${h2} max-w-md`">{{ $t('home.closeTitle') }}</h2>
        <p :class="lead">{{ $t('home.closeLead') }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a :href="`mailto:${EMAIL}`" :class="`${cta} max-w-full break-all`">{{ EMAIL }}</a>
          <router-link to="/contact" :class="ghost">{{ $t('home.closeContact') }} <ArrowRightIcon class="size-4" /></router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import {
  ArrowRightIcon, ArrowUpRightIcon, LockClosedIcon, ShareIcon, Square3Stack3DIcon, DocumentTextIcon,
  CircleStackIcon, CheckBadgeIcon, CodeBracketIcon, UserIcon, Squares2X2Icon
} from '@heroicons/vue/24/outline'
import Github from '@/assets/Icons/Github.vue'
import WindowFrame from '@/components/common/WindowFrame.vue'
import SkillMock from '@/components/common/SkillMock.vue'
import VbookMock from '@/components/common/VbookMock.vue'
import { PROJECTS } from '@/data/projects'
import { cta, ghost, outline, h1, h2, lead, focus, ext, shadowText, EMAIL } from '@/ui'

const HOW = [ShareIcon, Square3Stack3DIcon, DocumentTextIcon, CircleStackIcon, CheckBadgeIcon, CodeBracketIcon]
const MORE = [
  { key: 'about', to: '/about', icon: UserIcon },
  { key: 'tetris', to: '/tetris', icon: Squares2X2Icon }
]

const hero = ref(null)
onMounted(() => {
  if (!hero.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.from(hero.value.children, { opacity: 0, y: 24, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.1 })
})
</script>
