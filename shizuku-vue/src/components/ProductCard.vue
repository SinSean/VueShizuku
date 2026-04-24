<template>
  <div class="group cursor-pointer">
    <div class="aspect-[3/4] overflow-hidden bg-gray-100">
      <img :src="product.image" class="w-full h-full object-cover" :alt="product.name" />
    </div>
    
    <div class="mt-4 space-y-1 text-sm">
      <p class="text-gray-400 text-xs">{{ product.date }}</p>
      <h3 class="text-gray-700 font-medium">{{ product.name }}</h3>
      <p class="text-gray-900 font-semibold">{{ product.price }}</p>
    </div>
  </div>
</template>

<script setup>
// 1. 確保 defineProps 在 script setup 的頂層
// 2. 如果紅字持續，可以給它一個預設值或更明確的定義
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      image: '',
      name: '未命名商品',
      price: '0',
      date: ''
    })
  }
})
</script>