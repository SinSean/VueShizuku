<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()

// 優先從 router.state 取得資料（來自 PaymentListView 的 goToDetail 傳遞），
// 若直接從網址進入則顯示基本骨架
const tx = ref(history.state?.transaction ?? null)
const order = ref(history.state?.order ?? null)
const orderId = route.params.id ?? ''

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

const statusConfig = (status) => {
  const map = {
    0: { label: '待付款', color: 'text-amber-600 bg-amber-50', icon: 'pi pi-clock', dot: 'bg-amber-400' },
    1: { label: '付款成功', color: 'text-emerald-700 bg-emerald-50', icon: 'pi pi-check-circle', dot: 'bg-emerald-400' },
    2: { label: '交易失敗', color: 'text-red-600 bg-red-50', icon: 'pi pi-times-circle', dot: 'bg-red-400' },
    3: { label: '已退款', color: 'text-slate-500 bg-slate-50', icon: 'pi pi-undo', dot: 'bg-slate-400' },
  }
  return map[status] ?? { label: '未知', color: 'text-gray-400 bg-gray-50', icon: 'pi pi-question', dot: 'bg-gray-300' }
}

const goBack = () => {
  router.push({ name: 'payment-list', params: { id: orderId } })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 pt-28">
    <div class="max-w-2xl mx-auto flex flex-col gap-5">

      <!-- 頂部導覽 -->
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack"
          class="!text-gray-600 !border-gray-300 hover:!bg-gray-100" />
        <div>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Detail</span>
          <h1 class="text-3xl font-black text-gray-800 tracking-tight mt-0.5">支付明細</h1>
        </div>
      </div>

      <!-- 無資料提示 (直接輸入 URL 進入時) -->
      <div
        v-if="!tx"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center"
      >
        <i class="pi pi-info-circle text-4xl text-gray-200 mb-4"></i>
        <p class="text-gray-400 font-bold">請從「支付明細列表」頁面進入此頁查看詳細資訊</p>
        <button
          @click="goBack"
          class="mt-4 text-sm text-emerald-500 hover:text-emerald-700 font-bold underline"
        >
          前往支付明細列表
        </button>
      </div>

      <template v-else>
        <!-- 狀態大卡 -->
        <div :class="[
          'rounded-3xl p-8 flex flex-col items-center gap-4 border',
          tx.status === 1
            ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-100'
            : tx.status === 2
              ? 'bg-gradient-to-b from-red-50 to-white border-red-100'
              : 'bg-white border-gray-100'
        ]">
          <div :class="[
            'w-16 h-16 rounded-full flex items-center justify-center',
            statusConfig(tx.status).color
          ]">
            <i :class="[statusConfig(tx.status).icon, 'text-3xl']"></i>
          </div>
          <div class="text-center">
            <p class="text-xs font-bold tracking-widest uppercase text-gray-400">
              {{ statusConfig(tx.status).label }}
            </p>
            <p class="text-4xl font-black text-gray-900 mt-2">
              NT$ {{ tx.amount?.toLocaleString() }}
            </p>
            <p v-if="tx.paidAt" class="text-sm text-emerald-600 font-bold mt-1">
              付款完成：{{ formatDate(tx.paidAt) }}
            </p>
          </div>
        </div>

        <!-- 交易資訊卡 -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50">
            <h2 class="text-sm font-black text-gray-700 uppercase tracking-widest">交易資訊</h2>
          </div>
          <div class="divide-y divide-gray-50">
            <div class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">交易流水號</span>
              <span class="text-sm font-black text-gray-900 font-mono">{{ tx.transactionNo }}</span>
            </div>
            <div v-if="tx.gatewayTradeNo" class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">金流商單號</span>
              <span class="text-sm font-bold text-gray-700 font-mono">{{ tx.gatewayTradeNo }}</span>
            </div>
            <div class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">付款方式</span>
              <span class="text-sm font-bold text-gray-900">{{ tx.method }}</span>
            </div>
            <div class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">發起時間</span>
              <span class="text-sm font-bold text-gray-700">{{ formatDate(tx.createdAt) }}</span>
            </div>
            <div class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">交易狀態</span>
              <span :class="[
                'text-xs font-black px-3 py-1 rounded-full',
                statusConfig(tx.status).color
              ]">
                {{ tx.statusText }}
              </span>
            </div>
          </div>
        </div>

        <!-- 關聯訂單資訊 -->
        <div v-if="order" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50">
            <h2 class="text-sm font-black text-gray-700 uppercase tracking-widest">關聯訂單</h2>
          </div>
          <div class="divide-y divide-gray-50">
            <div class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">訂單編號</span>
              <span class="text-sm font-black text-gray-900 font-mono">{{ orderId }}</span>
            </div>
            <div class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">訂單金額</span>
              <span class="text-sm font-bold text-gray-900">
                NT$ {{ order.totalAmount?.toLocaleString() }}
              </span>
            </div>
            <div class="flex justify-between items-center px-6 py-4">
              <span class="text-sm text-gray-500 font-medium">訂單狀態</span>
              <span class="text-sm font-bold text-gray-700">{{ order.statusText }}</span>
            </div>
          </div>
        </div>

        <!-- 備註 -->
        <p class="text-center text-gray-400 text-xs leading-relaxed">
          此交易紀錄由系統自動記錄，如有疑問請聯絡客服。
        </p>
      </template>

    </div>
  </div>
</template>
