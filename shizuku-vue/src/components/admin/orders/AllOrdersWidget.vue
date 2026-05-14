<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  getAllOrdersForAdminAPI,
  getAdminOrderDetailAPI,
  updateOrderStatusAPI,
  cancelOrderForAdminAPI,
} from '@/api/adminOrder'

const orders = ref([])
const loading = ref(false)

// 篩選與搜尋狀態
const searchQuery = ref('')
const statusFilter = ref('all')

// Modal 狀態
const isModalOpen = ref(false)
const selectedOrder = ref(null)
const selectedOrderDetails = ref([])
const newStatus = ref(1)

// 取得所有訂單
const fetchOrders = async () => {
  try {
    loading.value = true
    const res = await getAllOrdersForAdminAPI()
    if (res.success) {
      orders.value = res.data
    } else {
      alert(res.message || '獲取訂單失敗')
    }
  } catch (error) {
    console.error('Fetch Orders Error:', error)
  } finally {
    loading.value = false
  }
}

// 開啟明細 Modal
const openDetailModal = async (orderNo) => {
  try {
    const res = await getAdminOrderDetailAPI(orderNo)
    if (res.success) {
      selectedOrder.value = res.data
      selectedOrderDetails.value = res.data.items || []

      // 找出這筆訂單目前的狀態碼，帶入下拉選單的預設值
      const currentOrder = orders.value.find((o) => o.orderNo === orderNo)
      newStatus.value = currentOrder ? currentOrder.status : 1
      isModalOpen.value = true
    } else {
      alert(res.message)
    }
  } catch (error) {
    console.error('Fetch Detail Error:', error)
  }
}

// 關閉 Modal
const closeModal = () => {
  isModalOpen.value = false
  selectedOrder.value = null
}

const getShippingStatusUI = (status) => {
  const map = {
    1: { text: '尚未出貨', color: 'bg-gray-100 text-gray-500', icon: 'pi pi-box' },
    2: { text: '理貨中 (準備出貨)', color: 'bg-blue-100 text-blue-600', icon: 'pi pi-spin pi-spinner' },
    3: { text: '已交寄 (配送中)', color: 'bg-orange-100 text-orange-600', icon: 'pi pi-truck' },
    4: { text: '已送達', color: 'bg-green-100 text-green-600', icon: 'pi pi-check-circle' },
    5: { text: '訂單已取消', color: 'bg-red-100 text-red-600', icon: 'pi pi-times-circle' },
  }
  return map[status] || { text: '未知狀態', color: 'bg-gray-100 text-gray-400', icon: 'pi pi-question-circle' }
}

// 儲存狀態變更
const saveStatus = async () => {

  if (!selectedOrder.value) return
  if (!confirm('確定要更新此訂單的狀態嗎？')) return

  try {
    let res
    // 如果下拉選單選擇 5，就呼叫取消並回補庫存的 API
    if (newStatus.value == 5) {
      res = await cancelOrderForAdminAPI(selectedOrder.value.orderNo)
    } else {
      res = await updateOrderStatusAPI(selectedOrder.value.orderNo, Number(newStatus.value))
    }

    if (res.success) {
      alert('狀態更新成功！')
      closeModal()
      fetchOrders() // 狀態變更後，重新抓取列表資料
    } else {
      alert(res.message || '更新失敗')
    }
  } catch (error) {
    console.error('Update Status Error:', error)
    alert('系統發生錯誤')
  }
}

// 日期格式化小工具
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 計算屬性：負責搜尋與過濾的聯動
const filteredOrders = computed(() => {
  let result = orders.value

  // 過濾狀態
  if (statusFilter.value !== 'all') {
    result = result.filter((o) => o.status === Number(statusFilter.value))
  }

  // 過濾訂單編號
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    result = result.filter((o) => o.orderNo.toLowerCase().includes(keyword))
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
      <h1 class="text-2xl font-bold text-gray-800">全站訂單管理</h1>
      <button
        @click="fetchOrders"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors duration-200"
      >
        重新整理
      </button>
    </div>

    <!-- 搜尋與過濾區塊 -->
    <div class="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-1">搜尋訂單編號</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="輸入 ORD..."
          class="w-full border-gray-300 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div class="w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1">訂單狀態</label>
        <select
          v-model="statusFilter"
          class="w-full border-gray-300 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部狀態</option>
          <option value="1">待付款</option>
          <option value="2">已付款</option>
          <option value="3">已出貨</option>
          <option value="4">已完成</option>
          <option value="5">已取消</option>
        </select>
      </div>
    </div>

    <!-- 訂單列表 Table -->
    <div class="bg-white rounded-lg shadow-sm border overflow-x-auto">
      <table class="min-w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-sm border-b">
            <th class="py-3 px-4 font-semibold">訂單編號</th>
            <th class="py-3 px-4 font-semibold">會員 ID</th>
            <th class="py-3 px-4 font-semibold">建立時間</th>
            <th class="py-3 px-4 font-semibold text-right">總金額</th>
            <th class="py-3 px-4 font-semibold text-center">狀態</th>
            <th class="py-3 px-4 font-semibold text-center">操作</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-gray-100">
          <tr v-if="loading">
            <td colspan="6" class="py-8 text-center text-gray-500">資料載入中...</td>
          </tr>
          <tr v-else-if="filteredOrders.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-500">找不到符合條件的訂單</td>
          </tr>
          <tr
            v-else
            v-for="order in filteredOrders"
            :key="order.orderNo"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 font-mono text-gray-800">{{ order.orderNo }}</td>
            <td class="py-3 px-4 text-gray-600">{{ order.memberId }}</td>
            <td class="py-3 px-4 text-gray-500">{{ formatDate(order.createdAt) }}</td>
            <td class="py-3 px-4 text-right font-medium text-gray-900">
              NT$ {{ order.totalAmount?.toLocaleString() }}
            </td>
            <td class="py-3 px-4 text-center">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 1,
                  'bg-blue-100 text-blue-800': order.status === 2,
                  'bg-indigo-100 text-indigo-800': order.status === 3,
                  'bg-green-100 text-green-800': order.status === 4,
                  'bg-red-100 text-red-800': order.status === 5,
                }"
              >
                {{ order.statusText }}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <button
                @click="openDetailModal(order.orderNo)"
                class="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                查看 / 編輯
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 訂單明細與編輯 Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">
            訂單明細
            <span class="font-mono text-lg text-blue-600 ml-2">{{ selectedOrder?.orderNo }}</span>
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6 overflow-y-auto flex-1">
          <div v-if="selectedOrder" class="space-y-6">
            <!-- 收件資訊 -->
            <div class="bg-white p-4 rounded-lg border shadow-sm">
              <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">收件人資訊</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span class="text-gray-500 w-16 inline-block">姓名：</span>
                  <span class="font-medium text-gray-800">{{ selectedOrder.receiverName }}</span>
                </p>
                <p>
                  <span class="text-gray-500 w-16 inline-block">電話：</span>
                  <span class="font-medium text-gray-800">{{ selectedOrder.receiverPhone }}</span>
                </p>
                <p class="col-span-2">
                  <span class="text-gray-500 w-16 inline-block">地址：</span>
                  <span class="font-medium text-gray-800">{{ selectedOrder.receiverAddress }}</span>
                </p>
                <p class="col-span-2">
                  <span class="text-gray-500 w-16 inline-block">備註：</span>
                  <span class="font-medium text-gray-800">{{ selectedOrder.note || '無' }}</span>
                </p>
              </div>
            </div>

            <!-- 新增：出貨狀態顯示列 -->
            <div
              class="col-span-2 mt-2 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span class="text-gray-500 font-medium">目前出貨進度：</span>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1',
                    getShippingStatusUI(newStatus).color,
                  ]"
                >
                  <i :class="getShippingStatusUI(newStatus).icon"></i>
                  {{ getShippingStatusUI(newStatus).text }}
                </span>
              </div>
              <span class="text-xs text-gray-400 italic">依照下方管理選單更新狀態</span>
            </div>

            <!-- 商品清單 -->
            <div>
              <h3 class="font-bold text-gray-800 mb-3">購買商品</h3>
              <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-sm text-left">
                  <thead class="bg-gray-50 border-b">
                    <tr>
                      <th class="p-3 font-semibold text-gray-600">商品名稱</th>
                      <th class="p-3 font-semibold text-gray-600">規格</th>
                      <th class="p-3 font-semibold text-gray-600 text-right">單價</th>
                      <th class="p-3 font-semibold text-gray-600 text-right">數量</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr
                      v-for="(item, index) in selectedOrderDetails"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td class="p-3 font-medium text-gray-800">{{ item.productName }}</td>
                      <td class="p-3 text-gray-500">{{ item.variantName || '無' }}</td>
                      <td class="p-3 text-right">NT$ {{ item.unitPrice?.toLocaleString() }}</td>
                      <td class="p-3 text-right font-medium">{{ item.quantity }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-4 text-right text-xl font-bold text-red-600">
                總計: NT$ {{ selectedOrder.totalAmount?.toLocaleString() }}
              </div>
            </div>

            <!-- 後台更改狀態區 -->
            <div class="bg-blue-50 p-5 rounded-lg border border-blue-200 mt-6 shadow-sm">
              <h3 class="font-bold text-blue-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                後台管理：更新訂單狀態
              </h3>
              <div class="flex items-center gap-4">
                <select
                  v-model="newStatus"
                  class="border border-blue-300 bg-white rounded-md px-4 py-2 w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none font-medium"
                >
                  <option :value="1">待付款 (未處理)</option>
                  <option :value="2">已付款 (準備出貨)</option>
                  <option :value="3">已出貨 (物流配送中)</option>
                  <option :value="4">已完成 (包裹已送達)</option>
                  <option :value="5">已取消 (退款並回補庫存)</option>
                </select>
                <button
                  @click="saveStatus"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow transition-colors"
                >
                  確定儲存
                </button>
              </div>
              <p
                v-if="newStatus == 5"
                class="text-sm text-red-600 mt-3 font-bold bg-red-50 p-2 rounded inline-block border border-red-200"
              >
                <i class="pi pi-exclamation-triangle mr-1"></i> 注意：選擇取消將會觸發「庫存回補」，請謹慎操作。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
