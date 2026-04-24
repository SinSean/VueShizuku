<script setup>
import AppNav from '../components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue';
import HomeView from '@/views/HomeView.vue';
</script>

<template>
  <nav>
    <AppNav />
  </nav>
  <main>
    <HomeView />

    <HomeView />

    <HomeView />

    <HomeView />
  </main>
  <footer>
    <AppFooter />
  </footer>
</template>
