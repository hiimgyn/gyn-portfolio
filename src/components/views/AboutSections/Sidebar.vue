<template>
  <div :class="['w-72 p-4 overflow-y-auto border-r min-h-full transition-colors duration-200',
    isDark ? colors.dark.background.primary : colors.light.background.primary,
    isDark ? colors.dark.text.primary : colors.light.text.primary,
    isDark ? colors.dark.border.primary : colors.light.border.primary
  ]">
    <ul class="space-y-4">
      <!-- Portfolio Section -->
      <li>
        <button 
          @click="toggle('portfolio')" 
          class="flex items-center w-full text-left font-semibold py-1.5 focus:outline-none group"
        >
          <ChevronDownIcon 
            class="w-4 h-4 mr-2 transition-transform duration-200" 
            :class="{ '-rotate-90': !expanded.portfolio }"
          />
          <span class="group-hover:text-violet-300 transition-colors">{{ t('about.portfolio') }}</span>
        </button>

        <div v-show="expanded.portfolio" class="mt-1 transition-all duration-200">
          <ul class="ml-6 space-y-1">
            <li>
              <button 
                @click="select('overview')" 
                :class="itemClass('overview')" 
                class="flex items-center w-full text-sm py-1.5"
              >
                <InformationCircleIcon class="w-4 h-4 mr-2 text-violet-400 flex-shrink-0" />
                <span>{{ t('about.overview') }}</span>
              </button>
            </li>
            <li>
              <button 
                @click="select('experiences')" 
                :class="itemClass('experiences')" 
                class="flex items-center w-full text-sm py-1.5"
              >
                <BriefcaseIcon class="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" />
                <span>{{ t('about.experiences') }}</span>
              </button>
            </li>
            <li>
              <button 
                @click="select('projects')" 
                :class="itemClass('projects')" 
                class="flex items-center w-full text-sm py-1.5"
              >
                <BookOpenIcon class="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                <span>{{ t('about.projects') }}</span>
              </button>
            </li>
          </ul>
        </div>
      </li>

      <!-- Contacts Section -->
      <li class="pt-2">
        <button 
          @click="toggle('contact')" 
          class="flex items-center w-full text-left font-semibold py-1.5 focus:outline-none group"
        >
          <ChevronDownIcon 
            class="w-4 h-4 mr-2 transition-transform duration-200" 
            :class="{ '-rotate-90': !expanded.contact }"
          />
          <span class="group-hover:text-violet-300 transition-colors">{{ t('about.contact') }}</span>
        </button>

        <div v-show="expanded.contact" class="mt-1">
          <ul :class="['ml-6 space-y-2 text-xs',
            isDark ? colors.dark.text.secondary : colors.light.text.secondary
          ]">
            <li class="flex items-center">
              <EnvelopeIcon class="w-4 h-4 mr-2 text-amber-400 flex-shrink-0" />
              <span class="select-all">{{ $t('about.emailAddress') }}</span>
            </li>
            <li class="flex items-center">
              <PhoneIcon class="w-4 h-4 mr-2 text-violet-400 flex-shrink-0" />
              <span class="select-all">{{ $t('about.phoneNumber') }}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '@/stores/theme'
import { colors } from '@/constants/theme'
import { useI18n } from 'vue-i18n'
import {
  ChevronDownIcon,
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
const emit = defineEmits(['select'])

const props = defineProps({
  selectedSection: {
    type: String,
    required: true
  }
})

function toggle(section) {
  expanded.value[section] = !expanded.value[section]
}

function select(section) {
  emit('select', section)
}

function itemClass(section) {
  const isSelected = props.selectedSection === section
  return [
    'rounded-lg px-2.5 py-1.5 transition-all duration-150',
    isSelected 
      ? (isDark.value ? 'bg-violet-950/50 text-violet-200 font-semibold border-l-2 border-violet-400' : 'bg-violet-50 text-violet-900 font-semibold border-l-2 border-violet-600')
      : (isDark.value ? 'text-slate-300 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-violet-50 hover:text-slate-900')
  ]
}
</script>
