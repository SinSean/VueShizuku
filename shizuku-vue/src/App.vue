<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <AppNavbar />
  <main class="flex-grow">
    <h1 class="text-3xl font-bold p-10">歡迎來到 shizuku</h1>
  </main>

  <AppFooter />
</template>

<style scoped></style>
