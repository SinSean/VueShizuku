<script setup>
import MemberNav from '@/components/member/MemberNav.vue';
</script>

<template>
    <nav class="sticky top-0 z-50">
        <MemberNav />
    </nav>
    <main>
        <RouterView />
    </main>
</template>
