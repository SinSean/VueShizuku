<script setup>
import ProductAllitem from '@/components/ProductAllitem.vue';
import ProductSidebar from '@/components/ProductSidebar.vue';

</script>

<template>
    <main class="pt-24 bg-white min-h-screen">
  <div class="max-w-[1400px] mx-auto px-4 py-16 text-center">
  <h1 class="text-5xl font-light tracking-[0.5em] uppercase mb-6">
    Shop All
  </h1>

  <div class="text-sm text-gray-400 uppercase tracking-widest">
    <RouterLink to="/" class="hover:text-black">Home</RouterLink>
    <span class="mx-3">/</span>
    <span class="text-black">All Products</span>
  </div>
  </div>

  <!-- 使用 flex 讓子組件橫向排列，並設定最大寬度與置中 -->
  <div class="flex flex-col md:flex-row max-w-[1400px] mx-auto px-4 gap-8 pt-1">
    
    <!-- 側邊欄：設定固定寬度，不隨 flex 壓縮 -->
<aside class="w-full md:w-64 sticky shrink-0 mt-28">
    <ProductSidebar />
</aside>

    <!-- 商品列表：佔滿剩餘空間 -->
    <section class="flex-1 min-w-0">
      <ProductAllitem />
    </section>
    </div>
  </main>
</template>