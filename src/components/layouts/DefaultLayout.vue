<template>
  <div class="relative min-h-svh bg-[#070A14] text-[#E7EAF3]">
    <Scene />
    <Header />
    <main class="relative">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Scene from '@/components/layouts/Scene.vue'
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
</script>
