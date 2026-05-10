<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import OrderInfoSection from '@/components/OrderInfoSection.vue'
import PaymentResultOverlay from '@/components/PaymentResultOverlay.vue'
import { getOrderDetailAPI, repayOrderAPI } from '@/api/order';

const route = useRoute()
const router = useRouter()
const orderId = route.params.id

//初始資料為null
const orderData = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await getOrderDetailAPI(orderId)
    if (res.success) {
      // 把後端 DTO 轉成你前端需要的格式（或是直接對接）
      orderData.value = res.data
    } else {
      alert(res.message)
      router.push({ name: 'orders' })
    }
  } catch (error) {
    console.error("讀取訂單詳情失敗：", error)
    alert("系統錯誤，請稍後再試")
  } finally {
    isLoading.value = false
  }
})

// 彈出視窗相關狀態
const showResultModal = ref(false)
const resultStatus = ref('success')
const resultMessage = ref('')

const handleCountdownEnd = () => {
  showResultModal.value = false
  // 重新整理頁面以取得最新訂單狀態
  window.location.reload()
}

// 處理重新付款
const handleRepay = async (paymentMethodId) => {
  try {
    resultStatus.value = 'processing'
    resultMessage.value = '請稍候，即將為您轉跳至付款頁面...'
    showResultModal.value = true

    const res = await repayOrderAPI(orderId, paymentMethodId)
    
    if (res.success && res.data.paymentUrl) {
      const paymentWindow = window.open(res.data.paymentUrl, '_blank', 'width=600,height=800')
      let paymentComplete = false

      const receiveMessage = (event) => {
        if (event.origin !== window.location.origin && event.origin !== 'https://localhost:7197') return
        
        if (event.data === 'PAYMENT_SUCCESS') {
          paymentComplete = true
          window.removeEventListener('message', receiveMessage)
          resultStatus.value = 'success'
          resultMessage.value = '太棒了！您的訂單已付款成功。'
          showResultModal.value = true
        } else if (event.data === 'PAYMENT_FAILED') {
          paymentComplete = true
          window.removeEventListener('message', receiveMessage)
          resultStatus.value = 'fail'
          resultMessage.value = '付款取消或失敗。'
          showResultModal.value = true
        }
      }
      window.addEventListener('message', receiveMessage)

      const checkWindowClosed = setInterval(() => {
        if (paymentWindow && paymentWindow.closed) {
          clearInterval(checkWindowClosed)
          if (!paymentComplete) {
            window.removeEventListener('message', receiveMessage)
            resultStatus.value = 'fail'
            resultMessage.value = '您已關閉付款視窗，付款未完成。'
            showResultModal.value = true
          }
        }
      }, 1000)

    } else {
      resultStatus.value = 'fail'
      resultMessage.value = res.message || '無法產生付款連結'
      showResultModal.value = true
    }
  } catch (error) {
    console.error(error)
    resultStatus.value = 'fail'
    resultMessage.value = '系統連線發生錯誤！'
    showResultModal.value = true
  }
}

const goBack = () => {
  router.push({ name: 'orders' })
}
</script>

<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <!-- 簡易的載入動畫 -->
    <i class="pi pi-spin pi-spinner text-3xl text-gray-300"></i>
  </div>

  <div v-else-if="orderData" class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
        <h1 class="text-3xl font-extrabold text-gray-800">訂單詳細內容</h1>
      </div>
      
      <!-- 引入原有的訂單明細元件，並監聽重新付款事件 -->
      <OrderInfoSection :order="orderData" @repay="handleRepay" />
    </div>

    <!-- 加入付款結果的自訂彈出視窗 -->
    <PaymentResultOverlay 
      :visible="showResultModal" 
      :status="resultStatus" 
      :message="resultMessage" 
      @update:visible="showResultModal = $event"
      @countdown-end="handleCountdownEnd"
    />
  </div>
</template>
