<template>
  <div :class="['w-72 p-4 overflow-y-auto',
    isDark ? colors.dark.background.primary : colors.light.background.primary,
    isDark ? colors.dark.text.primary : colors.light.text.primary,
    isDark ? colors.dark.border.primary : colors.light.border.primary
  ]">
    <ul>
      <!-- Portfolio -->
      <li>
        <button @click="toggle('portfolio')" class="flex items-center w-full text-left font-semibold mb-2">
          <ChevronDownIcon v-if="expanded.portfolio" class="w-4 h-4 mr-2" />
          <ChevronRightIcon v-else class="w-4 h-4 mr-2" />
          {{ t('about.portfolio') }}
        </button>
        <ul v-show="expanded.portfolio" class="ml-6 space-y-1">
          <li>
            <button @click="select('overview')" :class="itemClass('overview')" class="flex items-center w-full">
              <InformationCircleIcon :class="['w-4 h-4 mr-2',
                isDark ? colors.dark.logo.primary : 'text-yellow-400'
              ]" />
              {{ t('about.overview') }}
            </button>
          </li>
          <li>
            <button @click="select('experiences')" :class="itemClass('experiences')" class="flex items-center w-full">
              <BriefcaseIcon :class="['w-4 h-4 mr-2',
                isDark ? colors.dark.logo.primary : 'text-green-500']" />
              {{ t('about.experiences') }}
            </button>
          </li>
          <li>
            <button @click="select('projects')" :class="itemClass('projects')" class="flex items-center w-full">
              <BookOpenIcon :class="['w-4 h-4 mr-2',
                isDark ? colors.dark.logo.primary : 'text-cyan-500']" />
              {{ t('about.projects') }}
            </button>
          </li>
        </ul>
      </li>

      <!-- Contacts -->
      <li class="mt-6">
        <button @click="toggle('contact')" class="flex items-center w-full text-left font-semibold mb-2">
          <ChevronDownIcon v-if="expanded.contact" class="w-4 h-4 mr-2" />
          <ChevronRightIcon v-else class="w-4 h-4 mr-2" />
          {{ t('about.contact') }}
        </button>
        <ul v-show="expanded.contact" :class="['ml-6 space-y-1.5 text-sm',
          isDark ? colors.dark.text.primary : colors.light.text.primary
        ]">
          <li class="flex items-center">
            <EnvelopeIcon :class="['w-4 h-4 mr-2',
              isDark ? colors.dark.logo.primary : 'text-orange-500']" />
            {{ $t('about.emailAddress') }}
          </li>
          <li class="flex items-center">
            <PhoneIcon :class="['w-4 h-4 mr-2',
              isDark ? colors.dark.logo.primary : 'text-purple-500']" />
            {{ $t('about.phoneNumber') }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from '@vue/reactivity'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { useI18n } from 'vue-i18n'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  BookOpenIcon
} from '@heroicons/vue/24/solid'

const { t } = useI18n()
const store = useStore()
const isDark = computed(() => store.isDark)

const expanded = ref({ portfolio: true, contact: true })
const selected = ref('overview')

const emit = defineEmits(['select'])

function toggle(section) {
  expanded.value[section] = !expanded.value[section]
}

function select(section) {
  selected.value = section
  emit('select', section)
}

function itemClass(section) {
  const isSelected = selected.value === section

  return [
    'rounded px-2 py-1 transition-colors duration-200',
    isSelected && [
      isDark.value ? colors.dark.background.secondary : colors.light.background.secondary,
      isDark.value ? colors.dark.text.primary : colors.light.text.primary,
      'font-semibold'
    ],
  ]
}
</script>
