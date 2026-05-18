<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAbnormalOrdersAPI, rescueOrderAPI } from '@/api/adminOrder'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import Message from 'primevue/message'
import Tooltip from 'primevue/tooltip'

const vTooltip = Tooltip

const toast = useToast()
const loading = ref(false)
const abnormalOrders = ref([])
const expandedRows = ref([])

// 篩選狀態
const selectedType = ref('All')

const loadData = async () => {
  loading.value = true
  try {
    const res = await getAbnormalOrdersAPI()
    if (res.success) {
      abnormalOrders.value = res.data
    }
  } catch (err) {
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
    security: abnormalOrders.value.filter(o => o.abnormalityType === 'Security').length,
    behavior: abnormalOrders.value.filter(o => o.abnormalityType === 'Behavior').length
  }
})

const handleRescue = async (orderNo) => {
  try {
    const res = await rescueOrderAPI(orderNo)
    if (res.success) {
      toast.add({ severity: 'success', summary: '救援成功', detail: res.message, life: 3000 })
      await loadData() // 重新載入
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
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(value)
}

const getSeverity = (type) => {
  switch (type) {
    case 'Conflict': return 'danger'
    case 'Security': return 'warning'
    case 'Behavior': return 'info'
    default: return 'secondary'
  }
}

const getTypeName = (type) => {
  switch (type) {
    case 'Conflict': return '金流衝突'
    case 'Security': return '安全性疑慮'
    case 'Behavior': return '行為異常'
    default: return type
  }
}

onMounted(loadData)
</script>

<template>
  <div class="anomaly-widget">
    <!-- 頂部統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        @click="selectedType = 'Security'"
        :class="['stat-card border-l-4 border-amber-500', selectedType === 'Security' ? 'active shadow-md' : 'opacity-80']"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-bold text-gray-500 uppercase">安全性疑慮</p>
            <h3 class="text-3xl font-black text-amber-600">{{ stats.security }}</h3>
            <p class="text-xs text-amber-500 mt-1">單筆付款失敗次數過高</p>
          </div>
          <i class="pi pi-shield text-3xl text-amber-200"></i>
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
            <p class="text-xs text-blue-400 mt-1">24小時內大量取消紀錄</p>
          </div>
          <i class="pi pi-users text-3xl text-blue-200"></i>
        </div>
      </div>
    </div>

    <!-- 功能操作區 -->
    <div class="flex justify-between items-center mb-4">
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
      <Button icon="pi pi-refresh" rounded text @click="loadData" :loading="loading" />
    </div>

    <!-- 主要資料表 -->
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
</template>

<style scoped>
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
