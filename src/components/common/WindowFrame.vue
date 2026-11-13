<template>
  <div :class="frame">
    <div class="flex items-center gap-2 border-b border-[#262F4D] px-4 py-2.5">
      <span class="size-2.5 rounded-full bg-[#3A4466]"></span>
      <span class="size-2.5 rounded-full bg-[#3A4466]"></span>
      <span class="size-2.5 rounded-full bg-[#3A4466]"></span>
      <span class="ml-2 truncate text-xs text-[#8F98B5]">{{ title }}</span>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { frame } from '@/ui'
defineProps({ title: { type: String, required: true } })
</script>
