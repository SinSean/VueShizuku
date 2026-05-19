<script setup>
import { ref, onMounted } from 'vue'
import { getAbnormalPaymentsAPI } from '@/api/adminPayment'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'

const loading = ref(true)
const highFreqList = ref([])
const highAmountList = ref([])
const lastScanned = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const res = await getAbnormalPaymentsAPI()
    if (res.success) {
      highFreqList.value = res.data.highFreqFailures || []
      highAmountList.value = res.data.highAmountTxns || []
      lastScanned.value = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  } catch (err) {
    console.error('載入異常支付資料失敗:', err)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (val) =>
  new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val || 0)

onMounted(() => loadData())
</script>

<template>
  <div class="h-full flex flex-col p-6 gap-6 overflow-auto">
    <!-- 頂部標題列 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black text-gray-800">異常支付監控</h2>
        <p class="text-xs text-gray-400 mt-0.5">後台背景服務每 60 秒自動掃描，可手動觸發即時更新</p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="lastScanned" class="text-[11px] text-gray-400">上次掃描：{{ lastScanned }}</span>
        <button
          @click="loadData"
          :disabled="loading"
          class="flex items-center gap-1.5 text-xs font-bold text-teal-600 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition-colors disabled:opacity-50"
        >
          <i class="pi pi-refresh text-xs" :class="{ 'animate-spin': loading }"></i>
          重新整理
        </button>
      </div>
    </div>

    <!-- 統計摘要卡片 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-orange-50 border border-orange-100 rounded-xl p-4">
        <div class="flex items-center gap-2 mb-1">
          <i class="pi pi-exclamation-circle text-orange-500"></i>
          <span class="text-xs font-black text-orange-600 uppercase tracking-tight">高頻失敗</span>
        </div>
        <div class="text-2xl font-black text-orange-800">{{ highFreqList.length }}</div>
        <div class="text-[11px] text-orange-400 mt-0.5">筆訂單異常</div>
      </div>
      <div class="bg-red-50 border border-red-100 rounded-xl p-4">
        <div class="flex items-center gap-2 mb-1">
          <i class="pi pi-shield text-red-500"></i>
          <span class="text-xs font-black text-red-600 uppercase tracking-tight">異常高額</span>
        </div>
        <div class="text-2xl font-black text-red-800">{{ highAmountList.length }}</div>
        <div class="text-[11px] text-red-400 mt-0.5">筆交易異常</div>
      </div>
    </div>

    <!-- 高頻失敗清單 -->
    <div class="flex-1 min-h-0 flex flex-col">
      <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
        高頻支付失敗（10 分鐘內 ≥ 3 次）
      </h3>

      <div v-if="loading">
        <Skeleton v-for="i in 3" :key="i" height="52px" class="mb-2" border-radius="0.75rem" />
      </div>

      <div v-else-if="highFreqList.length === 0" class="text-center py-8 text-gray-300">
        <i class="pi pi-check-circle text-4xl mb-2 text-green-300"></i>
        <p class="text-sm font-bold text-green-400">目前無高頻失敗異常</p>
      </div>

      <div v-else class="space-y-2 overflow-auto">
        <div
          v-for="item in highFreqList"
          :key="item.orderId"
          class="flex items-center justify-between bg-orange-50/60 border border-orange-100 rounded-xl px-4 py-3"
        >
          <div>
            <div class="text-sm font-black text-gray-700">訂單 #{{ item.orderId }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ item.latestTime }}</div>
          </div>
          <Tag :value="`失敗 ${item.failCount} 次`" severity="warn" />
        </div>
      </div>
    </div>

    <!-- 異常高額清單 -->
    <div class="flex-1 min-h-0 flex flex-col border-t border-gray-100 pt-4">
      <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
        異常高額交易（單筆 &gt; $50,000）
      </h3>

      <div v-if="loading">
        <Skeleton v-for="i in 2" :key="i" height="52px" class="mb-2" border-radius="0.75rem" />
      </div>

      <div v-else-if="highAmountList.length === 0" class="text-center py-8">
        <i class="pi pi-check-circle text-4xl mb-2 text-green-300"></i>
        <p class="text-sm font-bold text-green-400">目前無異常高額交易</p>
      </div>

      <div v-else class="space-y-2 overflow-auto">
        <div
          v-for="txn in highAmountList"
          :key="txn.transactionNo"
          class="flex items-center justify-between bg-red-50/60 border border-red-100 rounded-xl px-4 py-3"
        >
          <div>
            <div class="text-sm font-black text-gray-700">{{ txn.transactionNo }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ txn.createdAt }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-black text-red-600">{{ formatCurrency(txn.amount) }}</div>
            <Tag value="高額警示" severity="danger" class="mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
