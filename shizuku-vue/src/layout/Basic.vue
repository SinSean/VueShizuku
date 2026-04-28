<script setup>
import AppNav from '../components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <AppNav />
  </nav>

  <main class="pt-[104px]">
    <RouterView />
  </main>

  <footer>
    <AppFooter />
  </footer>
</template>
