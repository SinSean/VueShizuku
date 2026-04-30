<script setup>
import MemberSidebar from '../components/member/MemberSidebar.vue';
</script>

<template>
    <div class="pt-30 max-w-6xl mx-auto py-8 px-4 flex gap-8">
        <MemberSidebar />

        <div class="flex-1">
            <router-view />
        </div>
    </div>
</template>