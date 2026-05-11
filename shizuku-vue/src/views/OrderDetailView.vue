<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import OrderInfoSection from '@/components/OrderInfoSection.vue'
import PaymentResultOverlay from '@/components/PaymentResultOverlay.vue'
import { getOrderDetailAPI, repayOrderAPI,cancelOrderApi } from '@/api/order';
import { usePaymentWindow } from '@/composables/usePaymentWindow'

const { openPaymentWindow } = usePaymentWindow()
const route = useRoute()
const router = useRouter()
const orderId = route.params.id

//初始資料為null
const orderData = ref(null)
const isLoading = ref(true)

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
    // 1. 先跳出處理中的等待畫面
    resultStatus.value = 'processing'
    resultMessage.value = '請稍候，即將為您轉跳至付款頁面...'
    showResultModal.value = true
    // 2. 向後端呼叫重新付款的 API，取得 res
    const res = await repayOrderAPI(orderId, paymentMethodId)
    
    // 3. 接下來才是你剛剛完美改好的 openPaymentWindow 邏輯
    if (res.success && res.data.paymentUrl) {
      openPaymentWindow(
        res.data.paymentUrl,
        () => {
          // 成功時的動作
          resultStatus.value = 'success'
          resultMessage.value = '太棒了！您的訂單已付款成功。'
          showResultModal.value = true
        },
        (errorMsg) => {
          // 失敗時的動作
          resultStatus.value = 'fail'
          resultMessage.value = errorMsg
          showResultModal.value = true
        }
      )
    } else {
      resultStatus.value = 'fail'
      resultMessage.value = res.message || '無法產生付款連結，請聯絡客服。'
      showResultModal.value = true
    }
  } catch (error) {
    console.error(error)
    resultStatus.value = 'fail'
    resultMessage.value = '系統連線發生錯誤！'
    showResultModal.value = true
  }
}
//取消訂單
const handleCancel = async () => {
  if (!confirm('確定要取消這筆訂單嗎？')) return;
  const res = await cancelOrderApi(orderId);
  if (res.success) {
    alert('訂單已取消！');
    window.location.reload(); // 重新整理以更新狀態
  } else {
    alert(res.message);
  }
}
onMounted(async () => {
  try {
    const res = await getOrderDetailAPI(orderId)
    if (res.success) {
      // 把後端 DTO 轉成你前端需要的格式（或是直接對接）
      orderData.value = res.data
    } else {
      alert(res.message)
      router.push({ name: 'MemberOrders' })
    }
  } catch (error) {
    console.error("讀取訂單詳情失敗：", error)
    alert("系統錯誤，請稍後再試")
  } finally {
    isLoading.value = false
  }
})


const goBack = () => {
  router.push({ name: 'MemberOrders' })
}
</script>

<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <i class="pi pi-spin pi-spinner text-3xl text-gray-300"></i>
  </div>

  <div v-else-if="orderData" class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
        <h1 class="text-3xl font-extrabold text-gray-800">訂單詳細內容</h1>
      </div>
      
      <!-- 引入原有的訂單明細元件，並監聽重新付款事件 -->
      <OrderInfoSection :order="orderData" @repay="handleRepay" @cancel="handleCancel"/>
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
