<script setup>
//  computed 自動計算機
import { computed } from 'vue'
// 定義傳遞 items  進來
const props = defineProps({
  // 標明 items 必須是一個 Array
  items: Array,
})

const totalPrice = computed(() => {
  let total = 0
  props.items.forEach((item) => {
    total = total + item.price * item.quantity
  })
  return total
})

// 【核心邏輯區塊：未來接 API - 送出結帳訂單】
// ============== 給未來接手此區塊的組員 =================
// 嗨！當使用者點擊「前往結帳」時，請在這裡撰寫 API 串接邏輯：
// 1. 檢查購物車是不是空的，如果是空的要擋住不給結帳
// 2. 整理好目前的購物車內容與總金額
// 3. 使用 Axios 發送 POST 請求到 /api/checkout
// 4. 處理成功後，將畫面跳轉到「付款頁面」或「綠界金流」
// ======================================================
// 這是專門處理結帳按鈕被點擊時的工具
const handleCheckout = () => {
  // 在瀏覽器的開發者工具印出提示，代表這顆按鈕有乖乖運作
  console.log('準備執行結帳 API... 總金額為：', totalPrice.value)
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm h-fit">
    <h2 class="text-lg font-bold border-b border-gray-100 pb-3 mb-4">訂單摘要</h2>

    <div class="flex justify-between items-center mb-4 text-gray-600">
      <span>商品總計</span>
      <span class="font-bold">NT$ {{ totalPrice }}</span>
    </div>

    <button
      @click="handleCheckout"
      class="w-full bg-blue-500 text-white py-3 rounded-md font-bold tracking-widest hover:bg-blue-600 transition-colors mt-4"
    >
      前往結帳
    </button>
  </div>
</template>
