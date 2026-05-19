<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { ORDER_STATUS } from '@/services/orderStatusManager'

// 導入與 OrderItemCard 一致的高質感扁平化子元件
import OrderBasicInfo from '@/components/orderDetails/OrderBasicInfo.vue'
import OrderProductList from '@/components/orderDetails/OrderProductList.vue'
import OrderDeliveryPayment from '@/components/orderDetails/OrderDeliveryPayment.vue'
import OrderAmountSummary from '@/components/orderDetails/OrderAmountSummary.vue'
import OrderProgressStepper from '@/components/orderDetails/OrderProgressStepper.vue'
import OrderActions from '@/components/orderDetails/OrderActions.vue'

import PaymentResultOverlay from '@/components/PaymentResultOverlay.vue'
import { getOrderDetailAPI, requestRefundAPI } from '@/api/order'
import { useAuthStore } from '@/stores/auth'

// 引入職責分離組合式函數
import { useOrderCountdown } from '@/composables/useOrderCountdown'
import { useOrderDetailActions } from '@/composables/useOrderDetailActions'

const toast = useToast()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const orderId = route.params.id

// 訂單狀態與資料管理
const orderData = ref(null)
const isLoading = ref(true)

// 導入倒數計時組合式函數 (專注倒數管理職責)
const { timeLeft, startCountdown } = useOrderCountdown(orderData)

// 導入詳情流程操作組合式函數 (專注重新付款金流與取消訂單，完美對接 ApiResponse 規範)
const {
  showResultModal,
  resultStatus,
  resultMessage,
  handleRepay,
  handleCancel,
  handleCountdownEnd,
} = useOrderDetailActions(orderId)

// 讀取訂單詳細資訊
const fetchOrderDetail = async () => {
  try {
    const res = await getOrderDetailAPI(orderId, authStore.user?.fId)

    // 嚴格對接標準 ApiResponse.cs 成功狀態規範
    if (res && res.success && res.data) {
      // 統一將後端文字狀態碼，對應轉換為數值狀態碼以驅動倒數與 Stepper 狀態機
      const statusTextToCode = {
        未付款: ORDER_STATUS.PENDING,
        已付款: ORDER_STATUS.PAID,
        出貨中: ORDER_STATUS.SHIPPING,
        已出貨: ORDER_STATUS.SHIPPING,
        已送達: ORDER_STATUS.DELIVERED,
        已完成: ORDER_STATUS.DELIVERED,
        已取消: ORDER_STATUS.CANCELLED,
        待退款: ORDER_STATUS.PENDING_REFUND,
        已退款: ORDER_STATUS.REFUNDED,
      }

      const mappedData = {
        ...res.data,
        status: statusTextToCode[res.data.statusText] || ORDER_STATUS.PENDING,
      }

      orderData.value = mappedData
      startCountdown() // 觸發倒數計時 Composable 內部的計時更新
    } else {
      // ApiResponse.Success 為 false 的防禦性處理
      toast.add({
        severity: 'error',
        summary: '讀取資料失敗',
        detail: (res && res.message) || '無法載入訂單詳情。',
        life: 3000,
      })
      setTimeout(() => {
        router.push({ name: 'MemberOrders' })
      }, 1500)
    }
  } catch (error) {
    console.error('讀取訂單詳情失敗：', error)
    toast.add({
      severity: 'error',
      summary: '系統連線錯誤',
      detail: '無法與伺服器取得連線，請檢查您的網路狀態。',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchOrderDetail()
})

const goBack = () => {
  router.push({ name: 'MemberOrders' })
}

// ========== 申請退款 ==========
const handleRefundRequest = async () => {
  const reason = prompt('請簡述退款原因（例如：買錯了、不想買了、欲更換付款方式等）：')
  if (!reason) return // 使用者按取消

  try {
    const res = await requestRefundAPI(orderId, reason)
    if (res && res.success) {
      toast.add({ severity: 'success', summary: '申請成功', detail: res.message, life: 5000 })
      // 重新加載最新的訂單詳細，如果是秒退款，會直接是已退款狀態！
      await fetchOrderDetail()
    } else {
      toast.add({ severity: 'error', summary: '申請失敗', detail: res?.message || '退款申請發生錯誤', life: 5000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: '系統錯誤', detail: '無法連線伺服器，請稍後再試。', life: 4000 })
  }
}
</script>

<template>
  <!-- 載入中骨架狀態 -->
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <i class="pi pi-spin pi-spinner text-3xl text-gray-300"></i>
  </div>

  <!-- 資料就緒渲染主介面 -->
  <div v-else-if="orderData" class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <!-- 頂部精美導覽/標題區 -->
      <div class="flex items-center justify-between border-b border-gray-200 pb-5 mb-2">
        <div class="flex items-center gap-4">
          <Button
            icon="pi pi-arrow-left"
            outlined
            rounded
            @click="goBack"
            class="!text-gray-600 !border-gray-300 hover:!bg-gray-100"
          />
          <div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest"
              >Member Center</span
            >
            <h1 class="text-3xl font-black text-gray-800 tracking-tight mt-0.5">訂單詳細內容</h1>
          </div>
        </div>
      </div>

      <!-- 1. 精緻倒數計時提示條 (僅在未付款時顯示) -->
      <div
        v-if="orderData.status === ORDER_STATUS.PENDING && timeLeft !== '已逾時'"
        class="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden group/alert"
      >
        <!-- 背景裝飾微光效果 -->
        <div
          class="absolute -right-4 -top-4 w-24 h-24 bg-amber-200/20 rounded-full blur-xl group-hover/alert:scale-110 transition-transform duration-300"
        ></div>

        <div class="flex items-center gap-3 text-amber-800">
          <i class="pi pi-exclamation-triangle text-2xl shrink-0"></i>
          <div>
            <p class="font-black text-sm">此訂單尚未付款</p>
            <p class="text-xs text-amber-700/80 mt-0.5">
              請於倒數結束前完成付款，否則系統將自動取消訂單並釋放庫存。
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-amber-200 shadow-inner shrink-0 z-10"
        >
          <span class="text-xs font-bold text-amber-500 uppercase tracking-widest"
            >剩餘付款時間</span
          >
          <span class="text-3xl font-black text-amber-600 font-mono leading-none tracking-tight">
            {{ timeLeft }}
          </span>
        </div>
      </div>

      <!-- 2. 基本資訊 -->
      <OrderBasicInfo :order="orderData" />

      <!-- 3. 商品明細清單 -->
      <OrderProductList :items="orderData.items" />

      <!-- 4. 配送資訊 與 金額明細 -->
      <div class="flex flex-col md:flex-row gap-6 items-stretch">
        <div class="flex-1 min-w-[280px]">
          <OrderDeliveryPayment :order="orderData" />
        </div>
        <div class="flex-1 min-w-[280px]">
          <OrderAmountSummary :order="orderData" />
        </div>
      </div>

      <!-- 5. 物流與配送狀態進度軸 -->
      <OrderProgressStepper :order="orderData" />

      <!-- 6. 操作按鈕 (最底部壓陣) -->
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-2">
        <OrderActions :order="orderData" @repay="handleRepay" @cancel="handleCancel" @requestRefund="handleRefundRequest" />
      </div>
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
