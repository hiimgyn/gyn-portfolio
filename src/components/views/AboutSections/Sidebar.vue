<template>
  <div :class="['w-72.25 p-4 overflow-y-auto border-r min-h-full',
    isDark ? colors.dark.background.primary : colors.light.background.primary,
    isDark ? colors.dark.text.primary : colors.light.text.primary,
    isDark ? colors.dark.border.primary : colors.light.border.primary
  ]">
    <ul>
      <!-- Portfolio -->
      <li>
        <button @click="toggle('portfolio')" class="flex items-center w-full text-left font-semibold">
          <ChevronDownIcon 
            v-if="expanded.portfolio" 
            class="w-4 h-4 mr-2 transition-transform duration-200" 
            ref="portfolioChevron"
          />
          <ChevronRightIcon 
            v-else 
            class="w-4 h-4 mr-2 transition-transform duration-200" 
            ref="portfolioChevron"
          />
          {{ t('about.portfolio') }}
        </button>
        <div ref="portfolioList" class="overflow-hidden">
          <ul v-show="expanded.portfolio" class="ml-6 space-y-1">
            <li ref="portfolioItem1">
              <button @click="select('overview')" :class="itemClass('overview')" class="flex items-center w-full">
                <InformationCircleIcon :class="['w-4 h-4 mr-2',
                  isDark ? colors.dark.logo.primary : 'text-yellow-400'
                ]" />
                {{ t('about.overview') }}
              </button>
            </li>
            <li ref="portfolioItem2">
              <button @click="select('experiences')" :class="itemClass('experiences')" class="flex items-center w-full">
                <BriefcaseIcon :class="['w-4 h-4 mr-2',
                  isDark ? colors.dark.logo.primary : 'text-green-500']" />
                {{ t('about.experiences') }}
              </button>
            </li>
            <li ref="portfolioItem3">
              <button @click="select('projects')" :class="itemClass('projects')" class="flex items-center w-full">
                <BookOpenIcon :class="['w-4 h-4 mr-2',
                  isDark ? colors.dark.logo.primary : 'text-cyan-500']" />
                {{ t('about.projects') }}
              </button>
            </li>
          </ul>
        </div>
      </li>

      <!-- Contacts -->
      <li class="mt-6">
        <button @click="toggle('contact')" class="flex items-center w-full text-left font-semibold mb-2">
          <ChevronDownIcon 
            v-if="expanded.contact" 
            class="w-4 h-4 mr-2 transition-transform duration-200"
            ref="contactChevron"
          />
          <ChevronRightIcon 
            v-else 
            class="w-4 h-4 mr-2 transition-transform duration-200"
            ref="contactChevron"
          />
          {{ t('about.contact') }}
        </button>
        <div ref="contactList" class="overflow-hidden">
          <ul v-show="expanded.contact" :class="['ml-6 space-y-1.5 text-sm',
            isDark ? colors.dark.text.primary : colors.light.text.primary
          ]">
            <li class="flex items-center" ref="contactItem1">
              <EnvelopeIcon :class="['w-4 h-4 mr-2',
                isDark ? colors.dark.logo.primary : 'text-orange-500']" />
              {{ $t('about.emailAddress') }}
            </li>
            <li class="flex items-center" ref="contactItem2">
              <PhoneIcon :class="['w-4 h-4 mr-2',
                isDark ? colors.dark.logo.primary : 'text-purple-500']" />
              {{ $t('about.phoneNumber') }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { animate } from 'animejs'
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
const emit = defineEmits(['select'])

// Refs cho animation
const portfolioList = ref(null)
const contactList = ref(null)
const portfolioChevron = ref(null)
const contactChevron = ref(null)
const portfolioItem1 = ref(null)
const portfolioItem2 = ref(null)
const portfolioItem3 = ref(null)
const contactItem1 = ref(null)
const contactItem2 = ref(null)

const props = defineProps({
  selectedSection: {
    type: String,
    required: true
  }
})

async function toggle(section) {
  const isExpanding = !expanded.value[section]
  const listRef = section === 'portfolio' ? portfolioList : contactList
  const chevronRef = section === 'portfolio' ? portfolioChevron : contactChevron
  const itemRefs = section === 'portfolio' 
    ? [portfolioItem1, portfolioItem2, portfolioItem3]
    : [contactItem1, contactItem2]

  if (isExpanding) {
    // Mở rộng
    expanded.value[section] = true
    await nextTick()

    // Animation cho chevron
    animate(chevronRef.value, {
      rotate: '90deg',
      duration: 100,
      ease: 'outQuart'
    })

    // Animation cho container
    const fullHeight = listRef.value.scrollHeight
    animate(listRef.value, {
      height: [0, fullHeight],
      duration: 100,
      ease: 'outExpo'
    })

    // Animation cho từng item với delay
    itemRefs.forEach((itemRef, index) => {
      if (itemRef.value) {
        animate(itemRef.value, {
          opacity: [0, 1],
          translateY: [-10, 0],
          duration: 300,
          delay: 100 + (index * 50),
          ease: 'outQuart'
        })
      }
    })
  } else {
    // Thu gọn
    // Animation cho chevron
    animate(chevronRef.value, {
      rotate: '0deg',
      duration: 600,
      ease: 'outQuart'
    })

    // Animation cho từng item (ngược lại)
    itemRefs.forEach((itemRef, index) => {
      if (itemRef.value) {
        animate(itemRef.value, {
          opacity: [1, 0],
          translateY: [0, -10],
          duration: 200,
          delay: index * 30,
          ease: 'inQuart'
        })
      }
    })

    // Animation cho container
    animate(listRef.value, {
      height: [listRef.value.scrollHeight, 0],
      duration: 150,
      delay: 100,
      ease: 'inExpo',
      complete: () => {
        expanded.value[section] = false
      }
    })
  }
}

function select(section) {
  emit('select', section)
  
  // Thêm hiệu ứng khi chọn item
  const selectedButton = event.target.closest('button')
  if (selectedButton) {
    animate(selectedButton, {
      scale: [1, 0.95, 1],
      duration: 200,
      ease: 'outQuart'
    })
  }
}

function itemClass(section) {
  const isSelected = props.selectedSection === section
  return [
    'rounded px-2 py-1 transition-all duration-200 hover:scale-105',
    isSelected ? (isDark.value ? colors.dark.background.secondary : colors.light.background.secondary) : '',
    isSelected ? (isDark.value ? colors.dark.text.primary : colors.light.text.primary) : '',
    isSelected ? 'font-semibold' : ''
  ]
}
</script>

<style scoped>
/* Thêm smooth transitions cho các elements */
.transition-transform {
  transition: transform 0.2s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>
