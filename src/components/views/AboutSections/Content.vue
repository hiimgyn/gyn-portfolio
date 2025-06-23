<template>
  <Suspense>
    <component :is="sectionComponent" :section="section" />
    <template #fallback>
      <div class="animate-pulse space-y-4 p-6">
        <div class="h-8 bg-gray-300 rounded w-1/3"></div>
        <div class="h-4 bg-gray-300 rounded w-full"></div>
        <div class="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { computed, watch } from 'vue'
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  section: {
    type: String,
    required: true
  }
})

// Async import components
const sectionComponents = {
  overview: defineAsyncComponent(() => import('./Overview.vue')),
  experiences: defineAsyncComponent(() => import('./Experiences.vue')),
  projects: defineAsyncComponent(() => import('./Projects.vue'))
}

const sectionComponent = computed(() => {
  return sectionComponents[props.section] || sectionComponents.overview
})

// Lưu section vào localStorage khi thay đổi
watch(() => props.section, (newSection) => {
  localStorage.setItem('selectedSection', newSection)
}, { immediate: true })
</script>
