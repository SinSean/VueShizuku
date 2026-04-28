<script setup>
import { ref, onMounted } from 'vue'
import CartItemList from '@/components/AppCartItemList.vue'
import CartSummary from '@/components/AppCartSummary.vue'
const cartItems = ref([])

onMounted(() => {
  // 這裡先放假資料模擬後端 API 回傳的結果
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
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">購物車列表</h1>

      <div class="lg:flex gap-6">
        <div class="flex-1">
          <CartItemList :items="cartItems" :removeTool="removeItem" />
        </div>

        <div class="lg:w-1/3">
          <CartSummary :items="cartItems" />
        </div>
      </div>
    </div>
  </div>
</template>
