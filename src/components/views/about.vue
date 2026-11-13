<template>
  <div data-dim>
    <section class="px-4 pb-20 pt-32 sm:px-6 lg:pt-40">
      <div class="mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <div :class="shadowText">
          <p class="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#A3ACC4]">
            <span class="size-2 rounded-full bg-[#FBBF24]"></span>{{ $t('aboutPage.eyebrow') }}
          </p>
          <h1 :class="`${h1} mt-5`">{{ $t('about.name') }}</h1>
          <p class="mt-3 font-display text-2xl font-medium text-[#C3C9DB]">{{ $t('about.role') }}</p>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[#B4BCD2]">{{ $t('about.professionalIntroContent') }}</p>
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#A3ACC4]">
            <span class="inline-flex items-center gap-2"><MapPinIcon class="size-4 text-[#8B8EF7]" />{{ $t('about.address') }}</span>
            <a :href="`mailto:${EMAIL}`" :class="`inline-flex items-center gap-2 break-all hover:text-white ${focus}`"><EnvelopeIcon class="size-4 text-[#8B8EF7]" />{{ EMAIL }}</a>
          </div>
        </div>
        <WindowFrame :title="$t('aboutPage.portrait')" class="mx-auto w-full max-w-xs lg:max-w-none">
          <img :src="avatarImg" :alt="$t('about.name')" class="aspect-square w-full object-cover" width="600" height="600" />
        </WindowFrame>
      </div>
    </section>

    <section data-stage="1" class="px-4 py-24 sm:px-6">
      <div class="mx-auto max-w-6xl">
        <h2 :class="`${h2} max-w-2xl ${shadowText}`">{{ $t('aboutPage.howTitle') }}</h2>
        <ul class="mt-12 grid gap-x-10 gap-y-10 lg:grid-cols-3">
          <li v-for="(v, i) in vision" :key="i" class="border-t border-[#262F4D] pt-5">
            <component :is="VISION_ICONS[i]" class="size-5" :class="i === 1 ? 'text-[#FBBF24]' : 'text-[#8B8EF7]'" />
            <h3 class="mt-3 font-semibold text-white">{{ v.title }}</h3>
            <p class="mt-1.5 text-[15px] leading-relaxed text-[#A3ACC4]">{{ v.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="px-4 py-20 sm:px-6">
      <div class="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 :class="h2">{{ $t('aboutPage.specTitle') }}</h2>
          <p :class="lead">{{ $t('aboutPage.specLead') }}</p>
          <ul class="mt-6 flex flex-wrap gap-2">
            <li v-for="s in SKILLS_BA" :key="s" class="rounded-full border border-[#262F4D] px-3 py-1.5 text-[13px] text-[#C3C9DB]">{{ s }}</li>
          </ul>
        </div>
        <WindowFrame :title="$t('aboutPage.specFrame')">
          <div class="space-y-4 p-5 text-[13px]">
            <div>
              <p class="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6F7894]">User story</p>
              <p class="mt-2 rounded-xl border border-[#262F4D] bg-[#141B33] p-3 leading-relaxed text-[#E7EAF3]">
                As an e-commerce operations manager, I want stock to be reserved while a customer checks out, so that we never sell the same last item twice across channels.
              </p>
            </div>
            <div>
              <p class="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6F7894]">Acceptance criteria · Gherkin</p>
              <div class="mt-2 space-y-1.5 rounded-xl border border-[#262F4D] bg-[#070A14] p-3 font-mono text-[12px] leading-relaxed text-[#C3C9DB]">
                <p v-for="g in GHERKIN" :key="g[1]"><span class="font-semibold" :class="g[0] === 'Then' ? 'text-[#FBBF24]' : 'text-[#8B8EF7]'">{{ g[0] }}</span> {{ g[1] }}</p>
              </div>
            </div>
          </div>
        </WindowFrame>
      </div>
    </section>

    <section class="px-4 py-20 sm:px-6">
      <div class="mx-auto max-w-6xl">
        <h2 :class="h2">{{ $t('aboutPage.toolsTitle') }}</h2>
        <p :class="`${lead} max-w-xl`">{{ $t('aboutPage.toolsLead') }}</p>
        <ul class="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          <li v-for="t in TOOLS" :key="t.name" class="border-t border-[#262F4D] pt-4">
            <PlatformIcon :name="t.icon" size="sm" />
            <p class="mt-3 text-sm font-semibold text-white">{{ t.name }}</p>
            <p class="mt-0.5 text-[13px] text-[#8F98B5]">{{ t.desc }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="px-4 py-20 sm:px-6">
      <div class="mx-auto max-w-6xl">
        <h2 :class="h2">{{ $t('about.experiences') }}</h2>
        <p :class="`${lead} max-w-xl`">{{ $t('experience.experienceSummaryContent') }}</p>
        <ol class="mt-12">
          <li v-for="x in EXPERIENCES" :key="x.key" class="grid gap-6 border-t border-[#262F4D] py-10 md:grid-cols-[240px_1fr]">
            <div class="flex items-center gap-3 md:block">
              <img :src="x.logo" :alt="$t(`experience.${x.key}.company`)" class="size-12 rounded-xl border border-[#262F4D] bg-white object-contain p-1.5" width="48" height="48" />
              <div class="md:mt-4">
                <p class="font-semibold text-white">{{ $t(`experience.${x.key}.company`) }}</p>
                <p class="font-mono text-xs text-[#8F98B5]">{{ x.period }}</p>
              </div>
            </div>
            <div>
              <h3 class="font-display text-xl font-extrabold text-white sm:text-2xl">{{ $t(`experience.${x.key}.title`) }}</h3>
              <ul class="mt-4 max-w-3xl space-y-2.5 text-[15px] leading-relaxed text-[#C3C9DB]">
                <li v-for="k in x.n" :key="k" class="flex gap-3">
                  <span aria-hidden="true" class="mt-3 h-px w-3 shrink-0 bg-[#8B8EF7]"></span>
                  {{ $t(`experience.${x.key}.achievement${k}`) }}
                </li>
              </ul>
              <ul class="mt-5 flex flex-wrap gap-1.5">
                <li v-for="t in x.tech" :key="t" class="rounded-md bg-[#8B8EF7]/15 px-2 py-0.5 font-mono text-[11px] font-medium text-[#B9BBFA]">{{ t }}</li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="px-4 py-20 sm:px-6">
      <div class="mx-auto max-w-6xl">
        <h2 :class="h2">{{ $t('aboutPage.casesTitle') }}</h2>
        <p :class="`${lead} max-w-xl`">{{ $t('aboutPage.casesLead') }}</p>
        <ul class="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
          <li v-for="c in CASES" :key="c.n">
            <WindowFrame :title="$t(`projects.project${c.n}.name`)">
              <img :src="c.image" :alt="$t(`projects.project${c.n}.name`)" loading="lazy" decoding="async" class="aspect-[16/10] w-full object-cover object-top" width="1600" height="1000" />
            </WindowFrame>
            <h3 class="mt-5 font-semibold text-white">{{ $t(`projects.project${c.n}.name`) }}</h3>
            <p class="mt-1.5 text-[15px] leading-relaxed text-[#A3ACC4]">{{ $t(`projects.project${c.n}.description`) }}</p>
            <div class="mt-4 flex flex-wrap items-center gap-1.5">
              <span v-for="t in c.tech" :key="t" class="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-[#A3ACC4]">{{ t }}</span>
              <a v-if="c.github" :href="c.github" v-bind="ext" :class="`ml-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-[#C3C9DB] hover:text-white ${focus}`">
                <Github class="size-4 opacity-70" /> {{ $t('work.links.source') }}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section data-stage="2" class="flex min-h-[90svh] items-center px-4 sm:px-6">
      <div :class="`mx-auto w-full max-w-6xl ${shadowText}`">
        <h2 :class="`${h2} max-w-lg`">{{ $t('aboutPage.closeTitle') }}</h2>
        <p :class="lead">{{ $t('contactPage.subtitle') }}</p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <router-link to="/contact" :class="cta">{{ $t('hero.ctaContact') }}</router-link>
          <router-link to="/#projects" :class="ghost">{{ $t('home.ctaWork') }} <ArrowRightIcon class="size-4" /></router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapPinIcon, EnvelopeIcon, ArrowRightIcon, ShareIcon, CircleStackIcon, FlagIcon } from '@heroicons/vue/24/outline'
import WindowFrame from '@/components/common/WindowFrame.vue'
import PlatformIcon from '@/components/common/PlatformIcon.vue'
import Github from '@/assets/Icons/Github.vue'
import { cta, ghost, h1, h2, lead, focus, ext, shadowText, EMAIL } from '@/ui'
import avatarImg from '@/assets/Images/avatar.png'
import hdLogo from '@/assets/Images/hd.png'
import acacyLogo from '@/assets/Images/acacy.webp'
import xteamLogo from '@/assets/Images/xteam.jpg'
import portfolioImg from '@/assets/Images/projects/portfolio.png'
import shopImg from '@/assets/Images/projects/shop.png'
import tunaImg from '@/assets/Images/projects/tuna.png'
import project1Img from '@/assets/Images/projects/project1.png'
import landingImg from '@/assets/Images/projects/landing.png'

const { t } = useI18n()

// visionContent_n reads "Heading: body"; split it so each becomes a titled column.
const VISION_ICONS = [ShareIcon, CircleStackIcon, FlagIcon]
const vision = computed(() => [1, 2, 3].map((n) => {
  const s = t(`about.visionContent_${n}`)
  const i = s.indexOf(':')
  return { title: s.slice(0, i), text: s.slice(i + 1).trim() }
}))

const SKILLS_BA = ['BRD / PRD', 'BPMN 2.0', 'User stories & Gherkin AC', 'Stakeholder alignment', 'Gap & impact analysis', 'UAT planning', 'Agile / Scrum']
const GHERKIN = [
  ['Given', 'the SKU has 1 unit in stock'],
  ['When', 'customers A and B check out at the same time'],
  ['Then', 'only customer A gets the reservation'],
  ['And', 'customer B sees "Out of stock" before paying']
]
const TOOLS = [
  { name: 'Jira', icon: 'jira', desc: 'Backlog & sprints' },
  { name: 'Confluence', icon: 'confluence', desc: 'PRD & specs' },
  { name: 'Figma', icon: 'figma', desc: 'Wireframes' },
  { name: 'Miro / Visio', icon: 'miro', desc: 'BPMN & flows' },
  { name: 'Postman', icon: 'postman', desc: 'API testing' },
  { name: 'Swagger', icon: 'swagger', desc: 'OpenAPI specs' },
  { name: 'SQL Server', icon: 'sqlserver', desc: 'Queries & 3NF' },
  { name: 'PostgreSQL', icon: 'postgres', desc: 'Relational DB' },
  { name: 'Power BI', icon: 'powerbi', desc: 'Reporting' },
  { name: '.NET / C#', icon: 'dotnet', desc: 'Backend' },
  { name: 'Docker', icon: 'docker', desc: 'Environments' },
  { name: 'GitHub', icon: 'github', desc: 'Version control' }
]
const EXPERIENCES = [
  { key: 'hd', logo: hdLogo, period: '11/2022 – 12/2024', n: 5, tech: ['BRD / PRD', 'BPMN 2.0', 'Figma', '.NET 8', 'SQL Server', 'REST API', 'UAT'] },
  { key: 'acacy', logo: acacyLogo, period: '06/2022 – 10/2022', n: 4, tech: ['Data analysis', 'SQL PIVOT', 'SQL Server', 'Stored procedures', '.NET 8', 'Dapper'] },
  { key: 'xteam', logo: xteamLogo, period: '2020 – 2022', n: 3, tech: ['Systems analysis', 'Capacity planning', 'Telemetry', 'Partner integration', 'C#', 'Linux'] }
]
const CASES = [
  { n: 2, image: shopImg, tech: ['ERD 3NF', 'SQL Server', 'Java MVC'], github: 'https://github.com/hiimgyn/mobile-store-management' },
  { n: 3, image: tunaImg, tech: ['TCP protocol', '.NET 8', 'C#'], github: 'https://github.com/hiimgyn/TunaApp' },
  { n: 4, image: project1Img, tech: ['BRD / PRD', 'API contracts', 'SQL Server'] },
  { n: 5, image: landingImg, tech: ['User journeys', 'Node.js', 'SEO'], github: 'https://github.com/hiimgyn/MasterDX_Landing' },
  { n: 1, image: portfolioImg, tech: ['Vue 3', 'Three.js', 'GSAP'], github: 'https://github.com/hiimgyn/gyn-portfolio' }
]
</script>
