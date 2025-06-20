<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ $t('about.projects') }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="project in projects" :key="project.id" class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 class="font-semibold mb-2">{{ project.name }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ project.description }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="tech in project.technologies" :key="tech" 
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  section: String
})

const projects = ref([
  // Dữ liệu dự án
])
</script>
