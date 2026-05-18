<script setup>
import { defineProps, defineEmits } from 'vue'
import { ORDER_STATUS, orderStatusManager } from '@/services/orderStatusManager'

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['view-detail'])

// 取得狀態對應的 Tailwind Badge 樣式
const getStatusBadgeClass = (status) => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return 'bg-yellow-100 text-yellow-800'
    case ORDER_STATUS.PAID:
      return 'bg-blue-100 text-blue-800'
    case ORDER_STATUS.SHIPPING:
      return 'bg-indigo-100 text-indigo-800'
    case ORDER_STATUS.DELIVERED:
      return 'bg-green-100 text-green-800'
    case ORDER_STATUS.CANCELLED:
      return 'bg-red-100 text-red-800'
    case ORDER_STATUS.PENDING_REFUND:
      return 'bg-purple-100 text-purple-800'
    case ORDER_STATUS.REFUNDED:
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getStatusLabel = (order) => {
  if (order.statusText && order.statusText !== '未知狀態') {
    return order.statusText
  }
  const info = orderStatusManager.getStatusInfo(order.status)
  return info ? info.text : '未知狀態'
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
</script>

<template>
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
          <td colspan="6" class="py-8 text-center text-gray-500">
            <i class="pi pi-spin pi-spinner mr-2"></i>資料載入中...
          </td>
        </tr>
        <tr v-else-if="orders.length === 0">
          <td colspan="6" class="py-8 text-center text-gray-500">找不到符合條件的訂單</td>
        </tr>
        <tr
          v-else
          v-for="order in orders"
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
              :class="getStatusBadgeClass(order.status)"
            >
              {{ getStatusLabel(order) }}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <button
              @click="emit('view-detail', order.orderNo)"
              class="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center justify-center mx-auto gap-1"
            >
              <i class="pi pi-search text-xs"></i>
              查看
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
