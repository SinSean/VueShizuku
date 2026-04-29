<script setup>
import AppGuideFlow from '../components/AppGuideFlow.vue';
import AppGuidePayment from '../components/AppGuidePayment.vue';
import AppGuideShipping from '../components/AppGuideShipping.vue';
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 pt-40 pb-20 font-sans animate-fade-in">
    
    <div class="mb-20 text-center animate-fade-in">
      <h1 class="text-4xl font-bold text-gray-900 tracking-[0.25em] uppercase">Shopping Guide</h1>
      <div class="w-10 h-1 bg-black mx-auto mt-4"></div>
    </div>

    <div class="space-y-24">
      <AppGuideFlow />
      <AppGuidePayment />
      <AppGuideShipping />
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in { 
  animation: fadeIn 0.8s ease-out forwards; 
}
.animate-fade-in-up { 
  opacity: 0; 
  animation: fadeInUp 0.8s ease-out forwards; 
}

/* 🌟 幫這裡補上了 translateY，讓它也有高級漂浮感 */
@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
}
@keyframes fadeInUp { 
  from { opacity: 0; transform: translateY(20px); } 
  to { opacity: 1; transform: translateY(0); } 
}
</style>