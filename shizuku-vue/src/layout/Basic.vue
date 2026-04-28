<script setup>
import AppNav from '../components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue';
// import HomeView from '@/views/HomeView.vue';
import { RouterView } from 'vue-router'</script>

<template>
  <nav>
    <AppNav />
  </nav>
  <main>
   <RouterView />
  </main>
  <footer>
    <AppFooter />
  </footer>
</template>
