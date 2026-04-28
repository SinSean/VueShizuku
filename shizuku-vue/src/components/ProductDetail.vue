<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const productId = ref('');

onMounted(() => {
  // 從網址列抓取 id 參數
  productId.value = route.params.id;
});
</script>

<template>
  <div class="pt-32 px-4 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold">商品詳情頁面</h1>
    <p class="mt-4 text-gray-600">當前查看的商品 ID 為：{{ productId }}</p>
    
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-gray-100 aspect-square flex items-center justify-center">
        圖片預留區
      </div>
      <div class="space-y-4">
        <h2 class="text-xl font-medium">商品名稱載入中...</h2>
        <p class="text-2xl text-red-600 font-bold">NT$ 0</p>
        <button class="w-full bg-black text-white py-3">加入購物車</button>
      </div>
    </div>
  </div>
</template>