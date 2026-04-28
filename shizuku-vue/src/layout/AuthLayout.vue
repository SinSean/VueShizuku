<script setup>
import MemberNav from '@/components/MemberNav.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<template>
    <nav>
        <MemberNav />
    </nav>
    <main>
        <RouterView />
    </main>
    <footer>
        <!-- <AppFooter /> -->
    </footer>
</template>
