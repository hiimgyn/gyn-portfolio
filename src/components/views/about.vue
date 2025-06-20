<template>
  <div class="flex min-h-[calc(100vh-4rem-1.5rem)]">
    <Sidebar @select="currentSection = $event" />
    <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#1A1A30]">
      <Suspense>
        <Content :section="currentSection" />
        <template #fallback>
          <div class="flex items-center justify-center h-64">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span class="ml-2">Đang tải...</span>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { defineAsyncComponent } from '@vue/runtime-core'

// Lazy load Sidebar và Content
const Sidebar = defineAsyncComponent(() => 
  import('@/components/views/AboutSections/Sidebar.vue')
)

const Content = defineAsyncComponent(() => 
  import('@/components/views/AboutSections/Content.vue')
)

const currentSection = ref('overview')
</script>
