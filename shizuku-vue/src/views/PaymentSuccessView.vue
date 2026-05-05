<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const status = ref('processing') // 狀態：processing (處理中), success (成功), fail (失敗)
const errorMessage = ref('')

onMounted(async () => {
  // 1. 從網址列抓取 LINE Pay 傳回來的參數
  const transactionId = route.query.transactionId
  const orderId = route.query.orderId

  if (!transactionId || !orderId) {
    status.value = 'fail'
    errorMessage.value = '網址缺少必要的交易參數。'
    return
  }

  try {
    // 2. 呼叫我們後端寫好的 Confirm API 進行最終扣款！
    const response = await axios.post('https://localhost:7197/api/order/confirm', {
      transactionId: transactionId,
      orderId: orderId
    })

    if (response.data.isSuccess) {
      status.value = 'success'
      
      // 3. 扣款成功！發送信號給原本的「結帳母視窗」
      if (window.opener) {
        window.opener.postMessage('PAYMENT_SUCCESS', window.location.origin)
      }
      
      // 4. 倒數 3 秒後自動關閉這個彈出視窗
      setTimeout(() => {
        window.close()
      }, 3000)

    } else {
      status.value = 'fail'
      errorMessage.value = response.data.message
      if (window.opener) window.opener.postMessage('PAYMENT_FAILED', window.location.origin)
    }
  } catch (error) {
    console.error(error)
    status.value = 'fail'
    errorMessage.value = '請款 API 連線失敗。'
    if (window.opener) window.opener.postMessage('PAYMENT_FAILED', window.location.origin)
  }
})

// 手動關閉視窗的方法
const closeWindow = () => {
  window.close()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
    <div class="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full text-center">
      
      <!-- 狀態：處理中 -->
      <div v-if="status === 'processing'">
        <i class="pi pi-spin pi-spinner text-5xl text-gray-300 mb-6"></i>
        <h2 class="text-xl font-bold text-gray-900 mb-2">正在與銀行連線請款中...</h2>
        <p class="text-gray-500 text-sm">請勿關閉此視窗，以免扣款失敗</p>
      </div>

      <!-- 狀態：成功 -->
      <div v-else-if="status === 'success'">
        <i class="pi pi-check-circle text-6xl text-green-500 mb-6"></i>
        <h2 class="text-2xl font-black text-gray-900 mb-2">付款成功！</h2>
        <p class="text-gray-500 text-sm mb-8">此視窗將於 3 秒後自動關閉...</p>
        <button @click="closeWindow" class="w-full bg-black text-white py-3 rounded-lg font-bold tracking-widest hover:bg-gray-800 transition shadow-lg shadow-gray-200">
          立即關閉
        </button>
      </div>

      <!-- 狀態：失敗 -->
      <div v-else-if="status === 'fail'">
        <i class="pi pi-times-circle text-6xl text-red-500 mb-6"></i>
        <h2 class="text-2xl font-black text-gray-900 mb-2">付款失敗</h2>
        <p class="text-red-500 text-sm mb-8 font-medium">{{ errorMessage }}</p>
        <button @click="closeWindow" class="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
          關閉視窗
        </button>
      </div>

    </div>
  </div>
</template>
