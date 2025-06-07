<template>
  <div class="relative min-h-screen">
    <Background class="fixed inset-0" />
    <ThemeLangSwitcher />
    <div class="relative z-20 flex flex-col min-h-screen border-1 border-black dark:border-white/10">
      <Header />
      <main class="flex-grow">
        <router-view></router-view>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Background from '@/components/utility/Background.vue'
import ThemeLangSwitcher from '@/components/utility/ThemeLangSwitcher.vue'
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
</script>