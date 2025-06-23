<template>
  <div class="relative min-h-screen flex flex-col">
    <!-- Background layer -->
    <Background class="fixed inset-0 -z-10" />

    <!-- Theme + Lang Switcher-->
    <ThemeLangSwitcher />

    <!-- Header -->
    <Header class="z-20 " />

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto z-10 mt-10">
        <router-view />
    </main>

    <!-- Footer -->
    <Footer class="z-20" />
  </div>
</template>

<script setup>
import Background from '@/components/utility/Background.vue'
import ThemeLangSwitcher from '@/components/utility/ThemeLangSwitcher.vue'
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
</script>
