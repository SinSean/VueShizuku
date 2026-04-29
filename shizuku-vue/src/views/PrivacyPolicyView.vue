<script setup>
import AppPrivacyContent from '../components/AppPrivacyContent.vue';
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<template>
  <div class="max-w-4xl mx-auto px-6 pt-40 pb-20 font-sans animate-fade-in">
    
    <div class="mb-16 text-center">
      <h1 class="text-3xl font-bold text-gray-900 tracking-[0.2em] uppercase">Privacy Policy</h1>
      <p class="text-sm text-gray-500 mt-2 tracking-widest">隱私權政策</p>
      <div class="w-10 h-1 bg-black mx-auto mt-6"></div>
    </div>

    <AppPrivacyContent />

  </div>
</template>

