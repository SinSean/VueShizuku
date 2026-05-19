<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { getOrderDetailAPI, getOrderTransactionsAPI } from '@/api/order'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const orderId = computed(() => String(route.params.id ?? ''))
const orderData = ref(null)
const transactions = ref([])
const isLoading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    if (!orderId.value) {
      errorMsg.value = '訂單編號不存在'
      return
    }

    // 同時取訂單基本資料與金流交易列表
    const [detailRes, txRes] = await Promise.all([
      getOrderDetailAPI(orderId.value, authStore.user?.fId),
      getOrderTransactionsAPI(orderId.value),
    ])

    if (detailRes?.success && detailRes.data) {
      orderData.value = detailRes.data
    }

    if (txRes?.success && Array.isArray(txRes.data)) {
      transactions.value = txRes.data
    }
  } catch (err) {
    console.error('取得金流明細失敗：', err)
    errorMsg.value = '無法載入支付紀錄，請稍後再試。'
  } finally {
    isLoading.value = false
  }
})

// 金流狀態 UI 對照
const statusConfig = (status) => {
  const map = {
    0: { label: '待付款', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'pi pi-clock' },
    1: { label: '付款成功', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'pi pi-check-circle' },
    2: { label: '交易失敗', color: 'bg-red-50 text-red-600 border-red-200', icon: 'pi pi-times-circle' },
    3: { label: '已退款', color: 'bg-slate-50 text-slate-500 border-slate-200', icon: 'pi pi-undo' },
  }
  return map[status] ?? { label: '未知', color: 'bg-gray-50 text-gray-400 border-gray-200', icon: 'pi pi-question' }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

const goBack = () => {
  if (route.params.id) {
    router.push({ name: 'order-detail', params: { id: orderId.value } })
  } else {
    router.push({ name: 'home' })
  }
}

const goToDetail = (tx) => {
  router.push({
    name: 'payment-detail',
    params: { id: orderId.value, transactionId: tx.transactionId },
    state: { transaction: tx, order: orderData.value },
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 pt-28">
    <div class="max-w-3xl mx-auto flex flex-col gap-6">

      <!-- 頂部導覽 -->
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack"
          class="!text-gray-600 !border-gray-300 hover:!bg-gray-100" />
        <div>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Records</span>
          <h1 class="text-3xl font-black text-gray-800 tracking-tight mt-0.5">支付明細列表</h1>
          <p class="text-gray-400 text-sm mt-0.5">訂單 {{ orderId }} 的所有支付交易紀錄</p>
        </div>
      </div>

      <!-- 載入中 -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <i class="pi pi-spin pi-spinner text-3xl text-gray-300"></i>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="errorMsg" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <i class="pi pi-exclamation-circle text-4xl text-red-400 mb-3"></i>
        <p class="text-red-600 font-bold">{{ errorMsg }}</p>
      </div>

      <div v-else>
        <!-- 訂單概況卡 -->
        <div v-if="orderData" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">訂單金額</p>
            <p class="text-2xl font-black text-gray-900 mt-1">
              NT$ {{ orderData.totalAmount?.toLocaleString() }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400 font-bold">建立時間</p>
            <p class="text-sm font-bold text-gray-700 mt-1">{{ formatDate(orderData.createdAt) }}</p>
          </div>
        </div>

        <!-- 空狀態 -->
        <div
          v-if="transactions.length === 0"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center"
        >
          <i class="pi pi-credit-card text-4xl text-gray-200 mb-4"></i>
          <p class="text-gray-400 font-bold">此訂單尚無支付紀錄</p>
        </div>

        <!-- 交易紀錄列表 -->
        <div v-else class="flex flex-col gap-3">
          <div
            v-for="tx in transactions"
            :key="tx.transactionId"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group"
            @click="goToDetail(tx)"
          >
            <div class="flex items-start justify-between gap-4">
              <!-- 左側：交易資訊 -->
              <div class="flex items-start gap-4">
                <!-- 狀態圖示 -->
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0',
                  statusConfig(tx.status).color
                ]">
                  <i :class="[statusConfig(tx.status).icon, 'text-base']"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-black text-gray-900">{{ tx.transactionNo }}</span>
                    <span :class="[
                      'text-[11px] font-bold px-2 py-0.5 rounded-full border',
                      statusConfig(tx.status).color
                    ]">
                      {{ tx.statusText }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ tx.method }} · {{ formatDate(tx.createdAt) }}
                  </p>
                  <p v-if="tx.gatewayTradeNo" class="text-[11px] text-gray-300 mt-0.5">
                    金流單號：{{ tx.gatewayTradeNo }}
                  </p>
                </div>
              </div>

              <!-- 右側：金額 + 箭頭 -->
              <div class="flex items-center gap-3 flex-shrink-0">
                <div class="text-right">
                  <p class="text-lg font-black text-gray-900">
                    NT$ {{ tx.amount?.toLocaleString() }}
                  </p>
                  <p v-if="tx.paidAt" class="text-[11px] text-emerald-500 font-bold mt-0.5">
                    付款：{{ formatDate(tx.paidAt) }}
                  </p>
                </div>
                <i class="pi pi-chevron-right text-gray-300 group-hover:text-gray-500 transition-colors"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 統計小結 -->
        <div v-if="transactions.length > 0" class="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
          <p class="text-xs text-gray-400">
            共 {{ transactions.length }} 筆支付紀錄 ·
            成功 {{ transactions.filter(t => t.status === 1).length }} 筆 ·
            失敗 {{ transactions.filter(t => t.status === 2).length }} 筆
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
