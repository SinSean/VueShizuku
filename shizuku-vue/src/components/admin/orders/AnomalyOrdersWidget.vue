<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAbnormalOrdersAPI, rescueOrderAPI } from '@/api/adminOrder'
import { getAbnormalPaymentsAPI } from '@/api/adminPayment'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import Tooltip from 'primevue/tooltip'
import Skeleton from 'primevue/skeleton'

const vTooltip = Tooltip

const toast = useToast()
const loading = ref(false)
const abnormalOrders = ref([])

// 支付監控相關資料
const highFreqList = ref([])
const highAmountList = ref([])
const lastScanned = ref('')

// 頂部分頁切換：'orders' | 'payments'
const activeSubTab = ref('orders')

const loadAllData = async () => {
  loading.value = true
  try {
    const [orderRes, paymentRes] = await Promise.all([
      getAbnormalOrdersAPI(),
      getAbnormalPaymentsAPI()
    ])

    if (orderRes && orderRes.success) {
      abnormalOrders.value = orderRes.data || []
    }

    if (paymentRes && paymentRes.success) {
      highFreqList.value = paymentRes.data.highFreqFailures || []
      highAmountList.value = paymentRes.data.highAmountTxns || []
      lastScanned.value = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  } catch (err) {
    console.error('載入異常資料失敗:', err)
    toast.add({ severity: 'error', summary: '載入失敗', detail: err.message, life: 3000 })
  } finally {
    loading.value = false
  }
}

const conflictOrdersList = computed(() => {
  return abnormalOrders.value.filter(o => o.abnormalityType === 'Conflict')
})

const behaviorOrdersList = computed(() => {
  return abnormalOrders.value.filter(o => o.abnormalityType === 'Behavior')
})

const stats = computed(() => {
  return {
    conflict: conflictOrdersList.value.length,
    behavior: behaviorOrdersList.value.length
  }
})

const handleRescue = async (orderNo) => {
  try {
    const res = await rescueOrderAPI(orderNo)
    if (res.success) {
      toast.add({ severity: 'success', summary: '救援成功', detail: res.message, life: 3000 })
      await loadAllData() // 重新載入
    } else {
      toast.add({ severity: 'error', summary: '救援失敗', detail: res.message, life: 5000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: '救援失敗', detail: '伺服器錯誤', life: 5000 })
  }
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  toast.add({ severity: 'info', summary: '已複製訂單編號', detail: text, life: 2000 })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(value || 0)
}

onMounted(loadAllData)
</script>

<template>
  <div class="anomaly-widget h-full flex flex-col min-h-0">
    <!-- 頂部頁籤切換 (新穎現代的膠囊型按鈕) -->
    <div class="flex bg-gray-100 p-1 rounded-xl self-start mb-6 shrink-0">
      <button
        @click="activeSubTab = 'orders'"
        :class="['px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2', activeSubTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800']"
      >
        <i class="pi pi-exclamation-triangle"></i>
        訂單異常監控 ({{ stats.conflict + stats.behavior }})
      </button>
      <button
        @click="activeSubTab = 'payments'"
        :class="['px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2', activeSubTab === 'payments' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-800']"
      >
        <i class="pi pi-shield"></i>
        支付安全監控 ({{ highFreqList.length + highAmountList.length }})
      </button>
    </div>

    <!-- ── 分頁 1：訂單異常監控 ── -->
    <div v-if="activeSubTab === 'orders'" class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- 頂部引導橫幅 -->
      <div class="mb-4 shrink-0 p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl flex items-center gap-2">
        <i class="pi pi-info-circle text-blue-500"></i>
        <p class="text-xs font-bold">
          💡 業務營運維護 (鎖單監控)：此處監控重點為業務營運健康度，防範會員惡意鎖庫存等異常業務操作行為。
        </p>
      </div>

      <!-- 狀態列 -->
      <div class="flex items-center justify-between mb-4 shrink-0">
        <div>
          <p class="text-xs text-gray-400">後台背景服務每 120 秒自動掃描，亦可手動即時刷新。</p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="lastScanned" class="text-xs text-gray-400">上次更新：{{ lastScanned }}</span>
          <Button icon="pi pi-refresh" rounded text @click="loadAllData" :loading="loading" />
        </div>
      </div>

      <!-- 統計摘要卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
        <div class="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <i class="pi pi-bolt text-red-500 animate-pulse"></i>
              <span class="text-xs font-black text-red-600 uppercase tracking-tight">金流衝突</span>
            </div>
            <div class="text-2xl font-black text-red-800">{{ stats.conflict }}</div>
            <div class="text-[11px] text-red-400 mt-0.5">訂單已取消但付款成功</div>
          </div>
          <i class="pi pi-bolt text-3xl text-red-200"></i>
        </div>
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <i class="pi pi-users text-blue-500"></i>
              <span class="text-xs font-black text-blue-600 uppercase tracking-tight">行為異常</span>
            </div>
            <div class="text-2xl font-black text-blue-800">{{ stats.behavior }}</div>
            <div class="text-[11px] text-blue-400 mt-0.5">24小時內取消訂單達 3 次</div>
          </div>
          <i class="pi pi-users text-3xl text-blue-200"></i>
        </div>
      </div>

      <!-- 左右雙欄清單佈局 -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-hidden mb-4">
        <!-- 左欄：金流衝突 -->
        <div class="flex flex-col min-h-0 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
          <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
            <span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
            金流衝突交易
          </h3>
          <div class="flex-1 overflow-auto pr-1">
            <div v-if="loading" class="space-y-2">
              <Skeleton v-for="i in 3" :key="i" height="80px" class="mb-2" border-radius="0.75rem" />
            </div>
            <div v-else-if="conflictOrdersList.length === 0" class="h-full flex flex-col items-center justify-center text-gray-300 py-10">
              <i class="pi pi-check-circle text-4xl mb-2 text-green-300"></i>
              <p class="text-sm font-bold text-green-400">目前無金流衝突交易</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="item in conflictOrdersList"
                :key="item.orderNo"
                class="bg-red-50/30 border border-red-100 rounded-xl p-4 flex flex-col gap-2 text-left"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-black text-gray-700">訂單 #{{ item.orderNo }}</div>
                    <div class="text-xs text-gray-400 mt-0.5">會員：{{ item.memberName }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-black text-red-600">{{ formatCurrency(item.totalAmount) }}</div>
                    <div class="text-[10px] text-gray-400 mt-0.5">{{ new Date(item.createdAt).toLocaleString() }}</div>
                  </div>
                </div>
                <div class="text-xs text-red-700 bg-red-50/50 p-2.5 rounded-lg border border-red-100/50 mt-1 leading-normal">
                  <p><strong>診斷：</strong>{{ item.description }}</p>
                  <p class="mt-1"><strong>處置：</strong>{{ item.suggestion }}</p>
                </div>
                <div class="flex justify-end mt-1">
                  <Button 
                    icon="pi pi-bolt" 
                    label="執行救援" 
                    severity="danger" 
                    size="small"
                    @click="handleRescue(item.orderNo)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右欄：行為異常 -->
        <div class="flex flex-col min-h-0 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
          <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
            <span class="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
            惡意鎖單警示
          </h3>
          <div class="flex-1 overflow-auto pr-1">
            <div v-if="loading" class="space-y-2">
              <Skeleton v-for="i in 3" :key="i" height="80px" class="mb-2" border-radius="0.75rem" />
            </div>
            <div v-else-if="behaviorOrdersList.length === 0" class="h-full flex flex-col items-center justify-center text-gray-300 py-10">
              <i class="pi pi-check-circle text-4xl mb-2 text-green-300"></i>
              <p class="text-sm font-bold text-green-400">目前無異常鎖單行為</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="item in behaviorOrdersList"
                :key="item.orderNo"
                class="bg-blue-50/30 border border-blue-100 rounded-xl p-4 flex flex-col gap-2 text-left"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-black text-gray-700">會員：{{ item.memberName }}</div>
                    <div class="text-xs text-gray-400 mt-0.5">關聯訂單：#{{ item.orderNo }}</div>
                  </div>
                  <div class="text-right">
                    <Tag :value="`24H內取消 ${item.relatedCount} 次`" severity="info" />
                    <div class="text-[10px] text-gray-400 mt-0.5">{{ new Date(item.createdAt).toLocaleString() }}</div>
                  </div>
                </div>
                <div class="text-xs text-blue-700 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50 mt-1 leading-normal">
                  <p><strong>診斷：</strong>{{ item.description }}</p>
                  <p class="mt-1"><strong>處置：</strong>{{ item.suggestion }}</p>
                </div>
                <div class="flex justify-end mt-1">
                  <Button 
                    icon="pi pi-copy" 
                    label="複製單號" 
                    severity="secondary" 
                    outlined
                    size="small" 
                    @click="copyToClipboard(item.orderNo)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 分頁 2：支付安全監控 ── -->
    <div v-else-if="activeSubTab === 'payments'" class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- 頂部引導橫幅 -->
      <div class="mb-4 shrink-0 p-3 bg-teal-50 border border-teal-100 text-teal-800 rounded-xl flex items-center gap-2">
        <i class="pi pi-shield text-teal-500"></i>
        <p class="text-xs font-bold">
          🛡️ 金流安全防護 (防刷卡測試)：此處監控重點為系統與交易安全，主要防範惡意刷卡測試 (Card Testing) 或盜刷風險。
        </p>
      </div>

      <!-- 狀態列 -->
      <div class="flex items-center justify-between mb-4 shrink-0">
        <div>
          <p class="text-xs text-gray-400">後台背景服務每 60 秒自動掃描，亦可手動即時刷新。</p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="lastScanned" class="text-xs text-gray-400">上次更新：{{ lastScanned }}</span>
          <Button icon="pi pi-refresh" rounded text @click="loadAllData" :loading="loading" />
        </div>
      </div>

      <!-- 統計摘要卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
        <div class="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <i class="pi pi-exclamation-circle text-orange-500"></i>
              <span class="text-xs font-black text-orange-600 uppercase tracking-tight">安全性疑慮 / 高頻失敗</span>
            </div>
            <div class="text-2xl font-black text-orange-800">{{ highFreqList.length }}</div>
            <div class="text-[11px] text-orange-400 mt-0.5">單筆付款失敗達 3 次（最近 10 分鐘內）</div>
          </div>
          <i class="pi pi-shield text-3xl text-orange-200"></i>
        </div>
        <div class="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <i class="pi pi-shield text-red-500"></i>
              <span class="text-xs font-black text-red-600 uppercase tracking-tight">異常高額交易</span>
            </div>
            <div class="text-2xl font-black text-red-800">{{ highAmountList.length }}</div>
            <div class="text-[11px] text-red-400 mt-0.5">單筆金額 &gt; $50,000（最近 10 分鐘內）</div>
          </div>
          <i class="pi pi-dollar text-3xl text-red-200"></i>
        </div>
      </div>

      <!-- 左右雙欄清單佈局 -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-hidden mb-4">
        <!-- 左欄：高頻失敗 -->
        <div class="flex flex-col min-h-0 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
          <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
            <span class="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
            付款次數異常訂單
          </h3>
          <div class="flex-1 overflow-auto pr-1">
            <div v-if="loading" class="space-y-2">
              <Skeleton v-for="i in 3" :key="i" height="52px" class="mb-2" border-radius="0.75rem" />
            </div>
            <div v-else-if="highFreqList.length === 0" class="h-full flex flex-col items-center justify-center text-gray-300 py-10">
              <i class="pi pi-check-circle text-4xl mb-2 text-green-300"></i>
              <p class="text-sm font-bold text-green-400">目前無高頻失敗異常</p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="item in highFreqList"
                :key="item.orderId"
                class="flex items-center justify-between bg-orange-50/40 border border-orange-100 rounded-xl px-4 py-3 text-left"
              >
                <div>
                  <div class="text-sm font-black text-gray-700">訂單 #{{ item.orderId }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">失敗時間：{{ item.latestTime }}</div>
                </div>
                <Tag :value="`失敗 ${item.failCount} 次`" severity="warn" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右欄：異常高額 -->
        <div class="flex flex-col min-h-0 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
          <h3 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
            <span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
            高額交易警示
          </h3>
          <div class="flex-1 overflow-auto pr-1">
            <div v-if="loading" class="space-y-2">
              <Skeleton v-for="i in 3" :key="i" height="52px" class="mb-2" border-radius="0.75rem" />
            </div>
            <div v-else-if="highAmountList.length === 0" class="h-full flex flex-col items-center justify-center text-gray-300 py-10">
              <i class="pi pi-check-circle text-4xl mb-2 text-green-300"></i>
              <p class="text-sm font-bold text-green-400">目前無異常高額交易</p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="txn in highAmountList"
                :key="txn.transactionNo"
                class="flex items-center justify-between bg-red-50/40 border border-red-100 rounded-xl px-4 py-3 text-left"
              >
                <div>
                  <div class="text-sm font-black text-gray-700">{{ txn.transactionNo }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">交易時間：{{ txn.createdAt }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-black text-red-600">{{ formatCurrency(txn.amount) }}</div>
                  <Tag value="高額警示" severity="danger" class="mt-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.anomaly-widget {
  max-height: 100%;
}
</style>
