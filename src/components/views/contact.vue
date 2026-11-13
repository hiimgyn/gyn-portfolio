<template>
  <section data-scene="2" class="flex min-h-svh items-center px-4 pb-20 pt-32 sm:px-6">
    <div class="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div :class="shadowText">
        <p class="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#A3ACC4]">
          <span class="size-2 rounded-full bg-[#FBBF24]"></span>{{ $t('nav.contact') }}
        </p>
        <h1 :class="`${h1} mt-5`">{{ $t('contactPage.title') }}</h1>
        <p :class="lead">{{ $t('contactPage.subtitle') }}</p>
        <div class="mt-8">
          <a :href="`mailto:${EMAIL}`" :class="cta">{{ $t('contactPage.sendEmail') }}</a>
        </div>
      </div>
      <ul :class="`${frame} divide-y divide-[#262F4D]`">
        <li v-for="r in rows" :key="r.label" class="flex items-center gap-4 px-5 py-4">
          <component :is="r.icon" class="size-5 shrink-0 text-[#8B8EF7]" />
          <div class="min-w-0 flex-1">
            <p class="text-xs text-[#8F98B5]">{{ $t(r.label) }}</p>
            <a v-if="r.href" :href="r.href" v-bind="r.ext ? ext : {}" :class="`block truncate font-medium text-white hover:text-[#B9BBFA] ${focus}`">{{ r.value }}</a>
            <p v-else class="truncate font-medium text-white">{{ r.value }}</p>
          </div>
          <button
            v-if="r.copy"
            type="button"
            :class="`grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-[#C3C9DB] transition-colors hover:bg-white/10 hover:text-white ${focus}`"
            :aria-label="`${$t('contactPage.copy')} ${$t(r.label)}`"
            @click="copy(r.value, r.label)"
          >
            <CheckIcon v-if="copied === r.label" class="size-4 text-[#34D399]" />
            <ClipboardDocumentIcon v-else class="size-4" />
          </button>
        </li>
        <li class="flex flex-wrap items-center gap-2 px-5 py-4">
          <a v-for="s in socials" :key="s.name" :href="s.url" v-bind="ext" :class="`inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-sm capitalize text-[#C3C9DB] transition-colors hover:bg-white/10 hover:text-white ${focus}`">
            <component :is="s.icon" class="size-4" /> {{ s.name }}
          </a>
        </li>
      </ul>
      <p class="sr-only" aria-live="polite">{{ copied ? $t('contactPage.copySuccess') : '' }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/vue/24/outline'
import Github from '@/assets/Icons/Github.vue'
import { socialLinks } from '@/constants/links'
import { cta, h1, lead, frame, focus, ext, shadowText, EMAIL, GITHUB } from '@/ui'

const { t } = useI18n()
const PHONE = '+84 942 451 385'
const rows = computed(() => [
  { label: 'contactPage.email', value: EMAIL, href: `mailto:${EMAIL}`, icon: EnvelopeIcon, copy: true },
  { label: 'contactPage.phone', value: PHONE, href: `tel:${PHONE.replace(/\s+/g, '')}`, icon: PhoneIcon, copy: true },
  { label: 'contactPage.address', value: t('about.address'), icon: MapPinIcon }
])
const socials = [...socialLinks, { name: 'github', url: GITHUB, icon: Github }]

const copied = ref(null)
let timer
async function copy(text, label) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = label
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = null), 1800)
  } catch {
    // clipboard blocked: the value is still visible and selectable
  }
}
</script>
