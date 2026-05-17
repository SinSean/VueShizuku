<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { ORDER_STATUS } from '@/services/orderStatusManager'
import OrderInfoSection from '@/components/OrderInfoSection.vue'
import PaymentResultOverlay from '@/components/PaymentResultOverlay.vue'
import { getOrderDetailAPI, repayOrderAPI, cancelOrderApi } from '@/api/order'
import { usePaymentWindow } from '@/composables/usePaymentWindow'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { openPaymentWindow } = usePaymentWindow()
const route = useRoute()
const router = useRouter()
const orderId = route.params.id

// 倒數計時相關變數
const timeLeft = ref('')
let timer = null

// 初始資料為 null
const orderData = ref(null)
const isLoading = ref(true)

// 彈出視窗相關狀態
const showResultModal = ref(false)
const resultStatus = ref('success')
const resultMessage = ref('')

// 啟動倒數計時器
const startCountdown = () => {
  // 只有在「未付款」狀態才需要倒數 (採用狀態機 PENDING 常數)
  if (!orderData.value || orderData.value.status !== ORDER_STATUS.PENDING) return

  const updateTimer = () => {
    const created = new Date(orderData.value.createdAt)
    const deadline = new Date(created.getTime() + 10 * 60 * 1000) // 建立時間 + 10 分鐘
    const now = new Date()
    const diff = deadline - now

    if (diff <= 0) {
      timeLeft.value = '已逾時'
      clearInterval(timer)
      return
    }

    const minutes = Math.floor(diff / 1000 / 60)
    const seconds = Math.floor((diff / 1000) % 60)
    timeLeft.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  updateTimer() // 立即執行一次
  timer = setInterval(updateTimer, 1000)
}

const handleCountdownEnd = () => {
  showResultModal.value = false
  window.location.reload()
}

// 處理重新付款
const handleRepay = async (paymentMethodId) => {
  try {
    resultStatus.value = 'processing'
    resultMessage.value = '請稍候，即將為您轉跳至付款頁面...'
    showResultModal.value = true

    const res = await repayOrderAPI(orderId, paymentMethodId)

    if (res.success) {
      if (res.data.paymentUrl) {
        openPaymentWindow(
          res.data.paymentUrl,
          () => {
            resultStatus.value = 'success'
            resultMessage.value = '太棒了！您的訂單已付款成功。'
            showResultModal.value = true
          },
          (errorMsg) => {
            resultStatus.value = 'fail'
            resultMessage.value = errorMsg
            showResultModal.value = true
          },
        )
      } else {
        // 沒有付款連結，代表轉為貨到付款成功
        resultStatus.value = 'success'
        resultMessage.value = '已將您的付款方式更改為「貨到付款」，訂單已準備出貨！'
        showResultModal.value = true
      }
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

// 取消訂單
const handleCancel = async () => {
  if (!confirm('確定要取消這筆訂單嗎？')) return
  const res = await cancelOrderApi(orderId)
  if (res.success) {
    alert('訂單已取消！')
    window.location.reload()
  } else {
    alert(res.message)
  }
}

onMounted(async () => {
  try {
    const res = await getOrderDetailAPI(orderId, authStore.user?.fId)
    if (res.success) {
      orderData.value = res.data
      startCountdown() // 讀取資料後啟動倒數
    } else {
      alert(res.message)
      router.push({ name: 'MemberOrders' })
    }
  } catch (error) {
    console.error('讀取訂單詳情失敗：', error)
    alert('系統錯誤，請稍後再試')
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
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

      <!-- 倒數計時提示條 (僅未付款顯示) -->
      <div
        v-if="orderData.status === ORDER_STATUS.PENDING && timeLeft !== '已逾時'"
        class="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
      >
        <div class="flex items-center gap-3 text-amber-800">
          <i class="pi pi-exclamation-triangle text-2xl"></i>
          <div>
            <p class="font-bold text-sm">此訂單尚未付款</p>
            <p class="text-xs text-amber-700/80">
              請於倒數結束前完成付款，否則系統將自動取消訂單並釋放庫存。
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-amber-200 shadow-inner"
        >
          <span class="text-xs font-bold text-amber-500 uppercase tracking-widest">剩餘時間</span>
          <span class="text-3xl font-black text-amber-600 font-mono leading-none">{{
            timeLeft
          }}</span>
        </div>
      </div>

      <!-- 引入原有的訂單明細元件 -->
      <OrderInfoSection :order="orderData" @repay="handleRepay" @cancel="handleCancel" />
    </div>

    <!-- 付款結果彈出視窗 -->
    <PaymentResultOverlay
      :visible="showResultModal"
      :status="resultStatus"
      :message="resultMessage"
      @update:visible="showResultModal = $event"
      @countdown-end="handleCountdownEnd"
    />
  </div>
</template>

<style scoped>
/* 讓數字看起來更像計時器 */
.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
