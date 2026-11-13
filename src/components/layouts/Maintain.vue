<template>
  <section data-scene="2" class="flex min-h-svh items-center px-4 pb-20 pt-32 sm:px-6">
    <div :class="`mx-auto w-full max-w-6xl ${shadowText}`">
      <p class="font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#FBBF24]">404</p>
      <h1 :class="`${h1} mt-5 max-w-3xl`">{{ $t('maintain.title') }}</h1>
      <p :class="lead">{{ $t('maintain.description') }} {{ $t('maintain.returnLater') }}</p>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <router-link to="/" :class="cta">{{ $t('maintain.backToHome') }}</router-link>
        <router-link to="/about" :class="ghost">{{ $t('nav.about') }}</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { cta, ghost, h1, lead, shadowText } from '@/ui'
</script>
