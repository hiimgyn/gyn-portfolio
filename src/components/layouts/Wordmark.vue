<template>
  <router-link to="/" :class="`flex items-center gap-2.5 rounded-lg ${focus}`" @click="$emit('navigate')">
    <span aria-hidden="true" class="relative grid size-8 place-items-center rounded-lg bg-[#5B5FEF] font-display text-[15px] font-extrabold text-white">
      g
      <span class="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#FBBF24] ring-2 ring-[#070A14]"></span>
    </span>
    <span class="font-display text-lg font-extrabold text-white">gyn nguyen</span>
  </router-link>
</template>

<script setup>
import { focus } from '@/ui'
defineEmits(['navigate'])
</script>
