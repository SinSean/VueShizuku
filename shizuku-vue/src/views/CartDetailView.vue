<script setup>
import CartItemList from '@/components/AppCartItemList.vue'
import CartSummary from '@/components/AppCartSummary.vue'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
</script>

<template>
  <div class="min-h-screen bg-white text-gray-800 font-sans pb-24 pt-28">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- 標題與進度條 -->
      <div class="flex flex-col items-center mb-12 text-center">
        <h1 class="text-3xl font-black tracking-tighter text-black uppercase mb-4">購物車清單</h1>
        <nav class="flex items-center text-xs text-gray-400 tracking-wider">
          <span class="text-black font-bold">購物車</span>
          <i class="pi pi-angle-right mx-2 text-[10px]"></i>
          <span>收件資訊</span>
          <i class="pi pi-angle-right mx-2 text-[10px]"></i>
          <span>付款方式</span>
        </nav>
      </div>

      <div class="flex flex-col lg:flex-row gap-12 xl:gap-16">
        <!-- 左側：商品清單 -->
        <div class="flex-1">
          <CartItemList :items="cartStore.items" :removeTool="cartStore.removeFromCart" />
        </div>

        <!-- 右側：訂單摘要 -->
        <div class="w-full lg:w-[380px] xl:w-[420px]">
          <CartSummary :items="cartStore.items" />
        </div>
      </div>
      
    </div>
  </div>
</template>
