<template>
  <div class="min-h-[calc(100vh-4rem-1.4rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-4xl mx-auto space-y-8">
      <!-- Title & Subtitle -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md"
          :class="isDark ? 'bg-violet-950/40 border-violet-800/60 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="tracking-wider font-semibold">COMMUNICATION // DIRECT INBOX</span>
        </div>
        <h1
          :class="[
            'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors duration-200',
            isDark ? colors.dark.text.primary : colors.light.text.primary
          ]"
        >
          {{ $t('contactPage.title') }}
        </h1>
        <p
          :class="[
            'text-sm sm:text-base max-w-xl mx-auto transition-colors duration-200',
            isDark ? colors.dark.text.secondary : colors.light.text.secondary
          ]"
        >
          {{ $t('contactPage.subtitle') }}
        </p>
      </div>

      <!-- Contact Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Email Card -->
        <div
          :class="[
            'p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between group',
            isDark 
              ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
              : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
          ]"
        >
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-2xl bg-violet-500/10 text-violet-300 flex-shrink-0">
              <EnvelopeIcon class="w-6 h-6" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 :class="['font-semibold text-xs font-mono uppercase tracking-wider mb-1', isDark ? colors.dark.text.muted : colors.light.text.muted]">
                {{ $t('contactPage.email') }}
              </h3>
              <a
                :href="`mailto:${email}`"
                :class="[
                  'text-base sm:text-lg font-bold truncate block transition-colors',
                  isDark ? 'text-violet-300 hover:text-white' : 'text-violet-700 hover:text-violet-900'
                ]"
              >
                {{ email }}
              </a>
            </div>
          </div>
          <div class="mt-6 flex items-center gap-3">
            <a
              :href="`mailto:${email}`"
              :class="[
                'flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
                isDark
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_12px_rgba(139,92,246,0.35)]'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_12px_rgba(139,92,246,0.25)]'
              ]"
            >
              {{ $t('contactPage.sendEmail') }}
            </a>
            <button
              @click="copyToClipboard(email, 'email')"
              :class="[
                'py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all active:scale-95',
                isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              ]"
              :title="$t('contactPage.copy')"
            >
              <CheckIcon v-if="copiedField === 'email'" class="w-4 h-4 text-emerald-400" />
              <ClipboardDocumentIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Phone Card -->
        <div
          :class="[
            'p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between group',
            isDark 
              ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
              : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
          ]"
        >
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-2xl bg-purple-500/10 text-purple-300 flex-shrink-0">
              <PhoneIcon class="w-6 h-6" />
            </div>
            <div class="min-w-0 flex-1">
              <h3 :class="['font-semibold text-xs font-mono uppercase tracking-wider mb-1', isDark ? colors.dark.text.muted : colors.light.text.muted]">
                {{ $t('contactPage.phone') }}
              </h3>
              <a
                :href="`tel:${phone.replace(/\\s+/g, '')}`"
                :class="[
                  'text-base sm:text-lg font-bold truncate block transition-colors',
                  isDark ? 'text-violet-300 hover:text-white' : 'text-violet-700 hover:text-violet-900'
                ]"
              >
                {{ phone }}
              </a>
            </div>
          </div>
          <div class="mt-6 flex items-center gap-3">
            <a
              :href="`tel:${phone.replace(/\\s+/g, '')}`"
              :class="[
                'flex-1 text-center py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
                isDark
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_12px_rgba(139,92,246,0.35)]'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_12px_rgba(139,92,246,0.25)]'
              ]"
            >
              {{ phone }}
            </a>
            <button
              @click="copyToClipboard(phone, 'phone')"
              :class="[
                'py-2.5 px-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all active:scale-95',
                isDark ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              ]"
              :title="$t('contactPage.copy')"
            >
              <CheckIcon v-if="copiedField === 'phone'" class="w-4 h-4 text-emerald-400" />
              <ClipboardDocumentIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Location Card -->
        <div
          :class="[
            'p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex items-center gap-4',
            isDark 
              ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
              : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
          ]"
        >
          <div class="p-3 rounded-2xl bg-violet-500/10 text-violet-300 flex-shrink-0">
            <MapPinIcon class="w-6 h-6" />
          </div>
          <div>
            <h3 :class="['font-semibold text-xs font-mono uppercase tracking-wider mb-1', isDark ? colors.dark.text.muted : colors.light.text.muted]">
              {{ $t('contactPage.address') }}
            </h3>
            <p :class="['text-base font-bold', isDark ? colors.dark.text.primary : colors.light.text.primary]">
              {{ $t('about.address') }}
            </p>
          </div>
        </div>

        <!-- Social Channels Card -->
        <div
          :class="[
            'p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-center',
            isDark 
              ? 'bg-[#121524]/85 border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.5)]' 
              : 'bg-white/90 border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_12px_rgba(15,23,42,0.05)]'
          ]"
        >
          <h3 :class="['font-semibold text-xs font-mono uppercase tracking-wider mb-3', isDark ? colors.dark.text.muted : colors.light.text.muted]">
            {{ $t('contactPage.socials') }}
          </h3>
          <div class="flex flex-wrap items-center gap-2.5">
            <a
              v-for="social in allSocials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :class="[
                'px-3.5 py-2 rounded-xl border transition-all duration-200 hover:scale-105 flex items-center gap-2 text-xs font-medium',
                isDark 
                  ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white hover:border-violet-400' 
                  : 'border-slate-200 bg-slate-50 hover:bg-violet-50 text-slate-800 hover:border-violet-400'
              ]"
            >
              <PlatformIcon :name="social.name" size="xs" />
              <span class="capitalize">{{ social.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { socialLinks, githubLink } from '@/constants/links'
import PlatformIcon from '@/components/common/PlatformIcon.vue'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const store = useStore()
const isDark = computed(() => store.isDark)

const email = 'nguyenminhhung.work@gmail.com'
const phone = '+84 942 451 385'

const allSocials = computed(() => [
  githubLink,
  ...socialLinks
])

const copiedField = ref(null)

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedField.value = field
    setTimeout(() => {
      if (copiedField.value === field) {
        copiedField.value = null
      }
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>