<script setup>
// 引入你的 components (請注意路徑，使用 ../components/)
import AppFaqSearch from '../components/AppFaqSearch.vue';
import AppFaqList from '../components/AppFaqList.vue';
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-16 font-sans">
    
    <div class="mb-8">
      <RouterLink :to="{ name: 'home' }" class="text-sm text-gray-400 hover:text-gray-900 transition-colors inline-flex items-center gap-2">
        <span>&lt;</span> 回首頁
      </RouterLink>
    </div>

    <AppFaqSearch />

    <AppFaqList />

  </div>
</template>

