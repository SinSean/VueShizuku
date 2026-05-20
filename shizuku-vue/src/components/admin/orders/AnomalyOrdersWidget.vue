<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAbnormalOrdersAPI, rescueOrderAPI } from '@/api/adminOrder'
import { getAbnormalPaymentsAPI } from '@/api/adminPayment'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import Message from 'primevue/message'
import Tooltip from 'primevue/tooltip'
import Skeleton from 'primevue/skeleton'

const vTooltip = Tooltip

const toast = useToast()
const loading = ref(false)
const abnormalOrders = ref([])
const expandedRows = ref([])

// 支付監控相關資料
const highFreqList = ref([])
const highAmountList = ref([])
const lastScanned = ref('')

// 頂部分頁切換：'orders' | 'payments'
const activeSubTab = ref('orders')

// 訂單分頁篩選狀態
const selectedType = ref('All')

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

const filteredOrders = computed(() => {
  if (selectedType.value === 'All') return abnormalOrders.value
  return abnormalOrders.value.filter(o => o.abnormalityType === selectedType.value)
})

const stats = computed(() => {
  return {
    conflict: abnormalOrders.value.filter(o => o.abnormalityType === 'Conflict').length,
    behavior: abnormalOrders.value.filter(o => o.abnormalityType === 'Behavior').length
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

const getSeverity = (type) => {
  switch (type) {
    case 'Conflict': return 'danger'
    case 'Behavior': return 'info'
    default: return 'secondary'
  }
}

const getTypeName = (type) => {
  switch (type) {
    case 'Conflict': return '金流衝突'
    case 'Behavior': return '行為異常'
    default: return type
  }
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
      <!-- 頂部統計卡片 (只有金流衝突與行為異常，移除安全性疑慮以防混淆) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
        <div 
          @click="selectedType = 'Conflict'"
          :class="['stat-card border-l-4 border-red-500', selectedType === 'Conflict' ? 'active shadow-md' : 'opacity-80']"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-bold text-gray-500 uppercase">金流衝突</p>
              <h3 class="text-3xl font-black text-red-600">{{ stats.conflict }}</h3>
              <p class="text-xs text-red-400 mt-1">訂單已取消但付款成功</p>
            </div>
            <i class="pi pi-bolt text-3xl text-red-200"></i>
          </div>
        </div>

        <div 
          @click="selectedType = 'Behavior'"
          :class="['stat-card border-l-4 border-blue-500', selectedType === 'Behavior' ? 'active shadow-md' : 'opacity-80']"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-bold text-gray-500 uppercase">行為異常</p>
              <h3 class="text-3xl font-black text-blue-600">{{ stats.behavior }}</h3>
              <p class="text-xs text-blue-400 mt-1">24小時內取消訂單達 3 次</p>
            </div>
            <i class="pi pi-users text-3xl text-blue-200"></i>
          </div>
        </div>
      </div>

      <!-- 功能操作區 -->
      <div class="flex justify-between items-center mb-4 shrink-0">
        <div class="flex items-center gap-2">
          <Button 
            v-if="selectedType !== 'All'" 
            icon="pi pi-filter-slash" 
            label="清除篩選" 
            text 
            size="small" 
            @click="selectedType = 'All'" 
          />
          <span class="text-sm text-gray-500" v-if="selectedType !== 'All'">
            正在顯示: <b class="text-gray-800">{{ getTypeName(selectedType) }}</b>
          </span>
        </div>
        <Button icon="pi pi-refresh" rounded text @click="loadAllData" :loading="loading" />
      </div>

      <!-- 主要資料表 -->
      <div class="flex-1 overflow-auto">
        <DataTable 
          :value="filteredOrders" 
          v-model:expandedRows="expandedRows"
          dataKey="orderNo"
          stripedRows 
          paginator 
          :rows="10"
          responsiveLayout="stack" 
          breakpoint="960px"
          class="p-datatable-sm custom-table"
        >
          <template #empty>
            <div class="py-20 text-center">
              <i class="pi pi-check-circle text-5xl text-green-400 mb-4"></i>
              <p class="text-xl font-bold text-gray-600">目前沒有偵測到異常訂單</p>
              <p class="text-gray-400">系統一切運作正常</p>
            </div>
          </template>

          <Column expander style="width: 3rem" />
          
          <Column field="orderNo" header="訂單編號" sortable class="font-mono font-bold"></Column>
          
          <Column field="abnormalityType" header="異常類型" sortable>
            <template #body="slotProps">
              <Tag :value="getTypeName(slotProps.data.abnormalityType)" :severity="getSeverity(slotProps.data.abnormalityType)" />
            </template>
          </Column>

          <Column field="memberName" header="會員名稱"></Column>

          <Column field="totalAmount" header="訂單金額" sortable>
            <template #body="slotProps">
              <span class="font-bold text-gray-700">{{ formatCurrency(slotProps.data.totalAmount) }}</span>
            </template>
          </Column>
          
          <Column field="createdAt" header="偵測時間" sortable>
            <template #body="slotProps">
              {{ new Date(slotProps.data.createdAt).toLocaleString() }}
            </template>
          </Column>

          <Column header="操作" class="text-right">
            <template #body="slotProps">
              <div class="flex justify-end gap-2">
                <Button 
                  v-if="slotProps.data.abnormalityType === 'Conflict'"
                  icon="pi pi-bolt" 
                  label="救援" 
                  severity="danger" 
                  size="small"
                  @click="handleRescue(slotProps.data.orderNo)"
                />
                <Button 
                  v-else
                  icon="pi pi-copy" 
                  text 
                  rounded 
                  size="small" 
                  v-tooltip="'複製訂單編號'"
                  @click="copyToClipboard(slotProps.data.orderNo)"
                />
              </div>
            </template>
          </Column>

          <!-- 展開顯示診斷描述 -->
          <template #expansion="slotProps">
            <div class="p-4 bg-white rounded-lg border border-gray-200 shadow-inner">
              <h5 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <i class="pi pi-info-circle text-blue-500"></i>
                診斷報告
              </h5>
              <Message severity="info" :closable="false" class="mb-3">
                {{ slotProps.data.description }}
              </Message>
              <div class="bg-gray-50 p-3 rounded text-sm text-gray-600">
                <p><strong>建議處理方式：</strong> {{ slotProps.data.suggestion }}</p>
                <p v-if="slotProps.data.relatedCount" class="mt-1">
                  <strong>相關數據紀錄：</strong> {{ slotProps.data.relatedCount }} 次
                </p>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- ── 分頁 2：支付安全監控 (整合原 AnomalyPaymentWidget 邏輯) ── -->
    <div v-else-if="activeSubTab === 'payments'" class="flex-1 flex flex-col min-h-0 overflow-hidden">
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
          <i class="pi pi-shield text-3xl text-orange-200 animate-pulse"></i>
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
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-hidden">
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
                class="flex items-center justify-between bg-orange-50/40 border border-orange-100 rounded-xl px-4 py-3"
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
                class="flex items-center justify-between bg-red-50/40 border border-red-100 rounded-xl px-4 py-3"
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
.stat-card {
  background-color: white;
  padding: 1.25rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #f3f4f6;
}
.stat-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
.stat-card.active {
  background-color: #f9fafb;
  transform: scale(1.02);
  border-color: #d1d5db;
}
:deep(.p-datatable-thead > tr > th) {
  background-color: #f9fafb !important;
  color: #4b5563 !important;
  font-weight: 700 !important;
  padding: 1rem !important;
}
:deep(.p-datatable-tbody > tr) {
  transition: background-color 0.15s;
}
</style>
