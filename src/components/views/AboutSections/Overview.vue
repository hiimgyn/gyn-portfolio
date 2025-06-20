<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ $t('about.overview') }}</h2>
    <div class="prose dark:prose-invert max-w-none">
      <p>{{ $t('about.overviewContent') }}</p>
      <!-- Nội dung tổng quan -->
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  section: String
})
</script>
