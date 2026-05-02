<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  items: Array,
})

const totalPrice = computed(() => {
  return props.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const goToCheckout = () => {
  router.push('/checkout')
}
</script>

<template>
  <div class="bg-gray-50/70 p-8 rounded-2xl border border-gray-100 sticky top-28">
    <h2 class="text-xl font-bold text-gray-900 mb-6">訂單摘要</h2>

    <div class="space-y-4 text-sm text-gray-600 border-b border-gray-200 pb-6 mb-6">
      <div class="flex justify-between items-center">
        <span>商品金額小計</span>
        <span class="font-medium text-gray-900">NT$ {{ totalPrice.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span>運費</span>
        <span class="text-gray-500">結帳時計算</span>
      </div>
    </div>

    <!-- 總金額 -->
    <div class="flex justify-between items-end mb-8">
      <span class="text-base font-bold text-gray-900">總計</span>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">TWD</span>
        <span class="text-3xl font-black text-gray-900">NT$ {{ totalPrice.toLocaleString() }}</span>
      </div>
    </div>

    <!-- 結帳按鈕 -->
    <button
      @click="goToCheckout"
      :disabled="props.items.length === 0"
      class="w-full bg-black text-white py-4 rounded-md font-bold tracking-widest hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      前往結帳 <i class="pi pi-arrow-right text-sm"></i>
    </button>
    
    <!-- 支援的支付方式 Icon (裝飾用增加信任感) -->
    <div class="mt-8 flex justify-center items-center gap-5 text-gray-300 text-2xl">
      <i class="pi pi-credit-card hover:text-gray-400 transition"></i>
      <i class="pi pi-paypal hover:text-gray-400 transition"></i>
      <i class="pi pi-apple hover:text-gray-400 transition"></i>
    </div>
  </div>
</template>
