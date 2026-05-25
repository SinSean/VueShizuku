<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { getAllOrdersForAdminAPI } from '@/api/adminOrder'
import AdminOrderListTable from './AdminOrderListTable.vue'
import AdminOrderDetailModal from './AdminOrderDetailModal.vue'
import { ORDER_STATUS, orderStatusManager } from '@/services/orderStatusManager'
import DatePicker from 'primevue/datepicker'

const toast = useToast()
const orders = ref([])
const loading = ref(false)

// 篩選與搜尋狀態
const searchQuery = ref('')
const searchMemberId = ref('')
const dateRange = ref(null)
const statusFilter = ref('all')

// Modal 控制狀態
const isModalOpen = ref(false)
const selectedOrderNo = ref('')
const selectedOrderCurrentStatus = ref(ORDER_STATUS.PENDING)

// 取得所有訂單
const fetchOrders = async () => {
  try {
    loading.value = true
    const res = await getAllOrdersForAdminAPI()
    if (res.success) {
      orders.value = res.data
    } else {
      toast.add({
        severity: 'error',
        summary: '讀取資料失敗',
        detail: res.message || '無法載入後台訂單列表。',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Fetch Orders Error:', error)
    toast.add({
      severity: 'error',
      summary: '系統連線錯誤',
      detail: '無法與伺服器建立連線，請檢查網路狀態。',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// 開啟明細 Modal
const openDetailModal = (orderNo) => {
  selectedOrderNo.value = orderNo
  const currentOrder = orders.value.find((o) => o.orderNo === orderNo)
  selectedOrderCurrentStatus.value = currentOrder ? currentOrder.status : ORDER_STATUS.PENDING
  isModalOpen.value = true
}

// 動態生成狀態選單選項，全面由狀態機驅動
const statusOptions = computed(() => {
  return Object.values(ORDER_STATUS).map((status) => {
    const info = orderStatusManager.getStatusInfo(status)
    return { value: status, label: info.text }
  })
})

// 重設所有篩選條件
const resetFilters = () => {
  searchQuery.value = ''
  searchMemberId.value = ''
  dateRange.value = null
  statusFilter.value = 'all'
}

// 計算屬性：負責搜尋與過濾的聯動
const filteredOrders = computed(() => {
  let result = orders.value

  // 1. 過濾狀態
  if (statusFilter.value !== 'all') {
    result = result.filter((o) => o.status === Number(statusFilter.value))
  }

  // 2. 過濾訂單編號
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase().trim()
    result = result.filter((o) => o.orderNo.toLowerCase().includes(keyword))
  }

  // 3. 過濾會員編號 (精確比對)
  if (searchMemberId.value) {
    const mId = Number(searchMemberId.value.trim())
    if (!isNaN(mId)) {
      result = result.filter((o) => o.memberId === mId)
    }
  }

  // 4. 過濾時間區間 (createdAt)
  if (dateRange.value && dateRange.value[0]) {
    const start = new Date(dateRange.value[0])
    start.setHours(0, 0, 0, 0)

    let end = dateRange.value[1] ? new Date(dateRange.value[1]) : new Date(start)
    end.setHours(23, 59, 59, 999)

    result = result.filter((o) => {
      const orderTime = new Date(o.createdAt)
      return orderTime >= start && orderTime <= end
    })
  }

  return result
})

// 元件載入時，自動抓取一次訂單列表
onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800"></h1>
      <button
        @click="fetchOrders"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center gap-2"
      >
        <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
        重新整理
      </button>
    </div>

    <!-- 搜尋與過濾區塊 -->
    <div class="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
      <!-- 搜尋訂單編號 -->
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-1">搜尋訂單編號</label>
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="輸入 ORD..."
            class="w-full border-gray-300 border rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- 搜尋會員編號 -->
      <div class="w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1">搜尋會員編號</label>
        <div class="relative">
          <i class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchMemberId"
            type="text"
            placeholder="輸入會員 ID"
            class="w-full border-gray-300 border rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- 時間區間 -->
      <div class="w-64">
        <label class="block text-sm font-medium text-gray-700 mb-1">時間區間</label>
        <DatePicker
          v-model="dateRange"
          selectionMode="range"
          :manualInput="false"
          placeholder="選擇時間範圍"
          class="w-full"
          showIcon
          iconDisplay="input"
          :pt="{
            input: { class: 'w-full border-gray-300 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' }
          }"
        />
      </div>

      <!-- 訂單狀態 -->
      <div class="w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1">訂單狀態</label>
        <select
          v-model="statusFilter"
          class="w-full border-gray-300 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">全部狀態</option>
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- 重設篩選按鈕 -->
      <button
        @click="resetFilters"
        class="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2 min-h-[38px]"
      >
        <i class="pi pi-filter-slash"></i>
        重設篩選
      </button>
    </div>

    <!-- 訂單列表表格組件 -->
    <AdminOrderListTable
      :orders="filteredOrders"
      :loading="loading"
      @view-detail="openDetailModal"
    />

    <!-- 訂單詳情彈窗組件 -->
    <AdminOrderDetailModal
      v-model:visible="isModalOpen"
      :orderNo="selectedOrderNo"
      :currentStatus="selectedOrderCurrentStatus"
      @updated="fetchOrders"
    />
  </div>
</template>

<style scoped>
/* 保持原本的樣式或根據需要調整 */
</style>
