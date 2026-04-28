<script setup>
import AppNav from '../components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue';
</script>

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
