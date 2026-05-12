<script setup>
defineProps({
    title:         { type: String, default: 'Shop All' },
    parentCrumb:   { type: String, default: null },
    currentCrumb:  { type: String, default: 'All Products' }
})
</script>

<template>
    <div class="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <h1 class="text-5xl font-light tracking-[0.5em] uppercase mb-6">
            {{ title }}
        </h1>
        <div class="text-sm text-gray-400 uppercase tracking-widest">
            <RouterLink to="/" class="hover:text-black">Home</RouterLink>
            <span class="mx-3">/</span>
            <template v-if="parentCrumb">
                <span class="text-gray-400">{{ parentCrumb }}</span>
                <span class="mx-3">/</span>
            </template>
            <span class="text-black">{{ currentCrumb }}</span>
        </div>
    </div>
</template>