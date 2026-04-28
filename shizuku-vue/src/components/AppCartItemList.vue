<script setup>
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

// 接收父層(AppCartSummary)給的資料
// 這裡子層需要兩樣東西：
// 1. items: 父層給的商品清單
// 2. removeTool: CartDetailView 的刪除函數
defineProps({
  items: Array,
  removeTool: Function,
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm mb-6 lg:mb-0">
    <h2 class="text-lg font-bold border-b border-gray-100 pb-3 mb-4">商品明細</h2>

    <div
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0"
    >
      <img :src="item.image" alt="商品圖片" class="w-20 h-20 object-cover rounded-md" />

      <div class="flex-1">
        <h3 class="text-sm font-bold text-gray-800">{{ item.name }}</h3>
        <p class="text-xs text-gray-500 mt-1">單價：NT$ {{ item.price }}</p>
      </div>

      <InputNumber v-model="item.quantity" showButtons :min="1" class="w-24" />

      <div class="w-24 text-right">
        <span class="text-sm font-bold text-gray-800">NT$ {{ item.price * item.quantity }}</span>
      </div>

      <Button icon="pi pi-trash" severity="danger" text rounded @click="removeTool(item.id)" />
    </div>

    <div v-if="items.length === 0" class="text-center py-10 text-gray-400">
      您的購物車目前沒有商品喔！
    </div>
  </div>
</template>
