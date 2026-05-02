<script setup>
import { ref, onMounted } from 'vue'
import CartItemList from '@/components/AppCartItemList.vue'
import CartSummary from '@/components/AppCartSummary.vue'
const cartItems = ref([])

onMounted(() => {
  cartItems.value = [
    // 第一個假商品
    {
      id: 1,
      name: '日系簡約純棉 T-Shirt',
      price: 590,
      image: 'https://placehold.co/100x100/eeeeee/999999?text=Item+1',
      quantity: 1,
    },
    // 第二個假商品
    {
      id: 2,
      name: '復古寬鬆牛仔褲',
      price: 1280,
      image: 'https://placehold.co/100x100/eeeeee/999999?text=Item+2',
      quantity: 2,
    },
  ]
})

const removeItem = (id) => {
  // .filter 就像濾網，把不要的商品從畫面上剔除
  cartItems.value = cartItems.value.filter((item) => item.id !== id)
}
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
          <CartItemList :items="cartItems" :removeTool="removeItem" />
        </div>

        <!-- 右側：訂單摘要 -->
        <div class="w-full lg:w-[380px] xl:w-[420px]">
          <CartSummary :items="cartItems" />
        </div>
      </div>
      
    </div>
  </div>
</template>
