<script setup>
import { ref, onMounted, watch } from 'vue'
import { getShippingOrdersAPI, batchUpdateStatusAPI } from '@/api/adminOrder'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const loading = ref(false)
const orders = ref([])
const selectedOrders = ref([])
const activeStatus = ref(2) // 預設 2: 待出貨

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await getShippingOrdersAPI(activeStatus.value)
    if (res.success) {
      orders.value = res.data
      selectedOrders.value = [] // 切換分頁時清空選取
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: '載入失敗', detail: '無法獲取出貨清單', life: 3000 })
  } finally {
    loading.value = false
  }
}

const handleBatchUpdate = async (newStatus) => {
  if (selectedOrders.value.length === 0) return

  const orderNos = selectedOrders.value.map((o) => o.fOrderNo)
  loading.value = true

  try {
    const res = await batchUpdateStatusAPI(orderNos, newStatus)
    if (res.success) {
      toast.add({ severity: 'success', summary: '批次更新成功', detail: res.message, life: 3000 })
      await loadOrders()
    } else {
      toast.add({ severity: 'error', summary: '更新失敗', detail: res.message, life: 5000 })
    }
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '系統錯誤',
      detail: '批次更新過程發生錯誤',
      life: 5000,
    })
  } finally {
    loading.value = false
  }
}

// 監聽分頁切換
watch(activeStatus, () => {
  loadOrders()
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(value)
}

onMounted(loadOrders)
</script>

<template>
  <div class="shipping-hub">
    <Toast />

    <!-- 自訂頁籤導覽 -->
    <div class="flex gap-4 mb-6 border-b border-gray-200">
      <button @click="activeStatus = 2" :class="['tab-btn', activeStatus === 2 ? 'active' : '']">
        待出貨
        <span v-if="activeStatus === 2" class="count-badge">{{ orders.length }}</span>
      </button>
      <button @click="activeStatus = 3" :class="['tab-btn', activeStatus === 3 ? 'active' : '']">
        出貨中
        <span v-if="activeStatus === 3" class="count-badge">{{ orders.length }}</span>
      </button>
    </div>

    <!-- 作業控制列 -->
    <div class="flex justify-between items-center mb-4 px-2">
      <div class="flex items-center gap-4">
        <h3 class="text-lg font-bold text-gray-700">
          {{ activeStatus === 2 ? '待打包撿貨清單' : '在途包裹追蹤' }}
        </h3>
        <Tag
          v-if="selectedOrders.length > 0"
          severity="info"
          :value="`已選取 ${selectedOrders.length} 筆`"
          rounded
        />
      </div>
      <Button icon="pi pi-refresh" text rounded @click="loadOrders" :loading="loading" />
    </div>

    <!-- 撿貨工作資料表 -->
    <DataTable
      v-model:selection="selectedOrders"
      :value="orders"
      dataKey="fOrderNo"
      stripedRows
      paginator
      :rows="10"
      responsiveLayout="stack"
      breakpoint="960px"
      class="p-datatable-sm custom-shipping-table"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

      <Column
        field="fOrderNo"
        header="訂單編號"
        sortable
        class="font-mono font-bold text-blue-600"
      ></Column>

      <Column header="收件資訊">
        <template #body="slotProps">
          <div class="flex flex-col text-sm">
            <span class="font-bold text-gray-800">{{ slotProps.data.fReceiverName }}</span>
            <span class="text-gray-500">{{ slotProps.data.fReceiverPhone }}</span>
          </div>
        </template>
      </Column>

      <Column field="fReceiverAddress" header="收件地址" class="max-w-[200px] truncate">
        <template #body="slotProps">
          <span class="text-sm text-gray-600" :title="slotProps.data.fReceiverAddress">
            {{ slotProps.data.fReceiverAddress }}
          </span>
        </template>
      </Column>

      <Column field="itemSummary" header="撿貨內容">
        <template #body="slotProps">
          <div class="p-2 bg-blue-50/50 rounded border border-blue-100/50 text-xs text-blue-800">
            {{ slotProps.data.itemSummary }}
          </div>
        </template>
      </Column>

      <Column field="fTotalAmount" header="金額" sortable>
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.fTotalAmount) }}
        </template>
      </Column>

      <template #empty>
        <div class="py-20 text-center bg-white rounded-xl">
          <i class="pi pi-inbox text-5xl text-gray-200 mb-4"></i>
          <p class="text-gray-400">當前沒有需要處理的訂單</p>
        </div>
      </template>
    </DataTable>

    <!-- 底部浮動操作列 (選取後出現) -->
    <transition name="slide-up">
      <div v-if="selectedOrders.length > 0" class="floating-actions shadow-2xl">
        <div class="flex items-center gap-6">
          <div class="hidden md:block">
            <p class="text-xs text-gray-400 uppercase tracking-wider">批量作業</p>
            <p class="font-bold text-white">已選擇 {{ selectedOrders.length }} 筆訂單</p>
          </div>
          <div class="h-8 w-px bg-white/20 hidden md:block"></div>
          <div class="flex gap-2">
            <template v-if="activeStatus === 2">
              <Button
                label="標記為出貨中"
                icon="pi pi-truck"
                severity="success"
                @click="handleBatchUpdate(3)"
                :loading="loading"
              />
              <Button
                label="列印撿貨單"
                icon="pi pi-print"
                text
                plain
                class="text-white hover:bg-white/10"
              />
            </template>
            <template v-if="activeStatus === 3">
              <Button
                label="標記為已送達"
                icon="pi pi-check-circle"
                severity="primary"
                @click="handleBatchUpdate(4)"
                :loading="loading"
              />
            </template>
          </div>
        </div>
        <Button
          icon="pi pi-times"
          text
          rounded
          class="text-white/60 hover:text-white"
          @click="selectedOrders = []"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.tab-btn {
  padding: 1rem 1.5rem;
  color: #6b7280; /* gray-500 */
  font-weight: 700;
  transition: all 0.2s;
  position: relative;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
}
.tab-btn:hover {
  color: #2563eb; /* blue-600 */
}
.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}
.count-badge {
  margin-left: 0.5rem;
  background-color: #dbeafe; /* blue-100 */
  color: #2563eb; /* blue-600 */
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

/* 浮動操作列樣式 */
.floating-actions {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(12px);
  padding: 1rem 2rem;
  border-radius: 5rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100px);
  opacity: 0;
}

:deep(.custom-shipping-table .p-datatable-thead > tr > th) {
  background-color: transparent !important;
  border-bottom: 2px solid #f1f5f9;
  color: #64748b;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #2563eb !important;
  border-color: #2563eb !important;
}
</style>
