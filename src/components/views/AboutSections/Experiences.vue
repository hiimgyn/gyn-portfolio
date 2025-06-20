<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ $t('about.experiences') }}</h2>
    <div class="space-y-6">
      <!-- Timeline kinh nghiệm -->
      <div v-for="exp in experiences" :key="exp.id" class="border-l-4 border-blue-500 pl-4">
        <h3 class="font-semibold">{{ exp.title }}</h3>
        <p class="text-gray-600">{{ exp.company }} • {{ exp.period }}</p>
        <p class="mt-2">{{ exp.description }}</p>
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

const experiences = ref([

])
</script>
