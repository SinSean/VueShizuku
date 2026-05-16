<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { ORDER_STATUS } from '@/services/orderStatusManager'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

// 將狀態文字轉為數字的輔助 Map
const statusTextToCode = {
  待付款: ORDER_STATUS.PENDING,
  已付款: ORDER_STATUS.PAID,
  已出貨: ORDER_STATUS.SHIPPING,
  已完成: ORDER_STATUS.DELIVERED,
  已取消: ORDER_STATUS.CANCELLED,
}

// 顏色邏輯對齊
const getSeverity = (statusText) => {
  const status = statusTextToCode[statusText]
  switch (status) {
    case ORDER_STATUS.DELIVERED:
      return 'secondary'
    case ORDER_STATUS.PAID:
      return 'info'
    case ORDER_STATUS.SHIPPING:
      return 'warn'
    case ORDER_STATUS.PENDING:
      return 'secondary'
    case ORDER_STATUS.CANCELLED:
      return 'primary'
    default:
      return 'danger'
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2
      class="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3 mb-6 flex items-center gap-2"
    >
      <i class="pi pi-info-circle text-blue-500"></i> 基本資訊
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
      <div class="flex flex-col bg-gray-50/50 p-4 rounded-xl border border-gray-50">
        <span class="text-gray-400 text-xs mb-1 uppercase tracking-widest font-bold">訂單編號</span>
        <span class="font-mono text-lg font-bold text-gray-900">{{ props.order.orderNo }}</span>
      </div>
      <div class="flex flex-col bg-gray-50/50 p-4 rounded-xl border border-gray-50">
        <span class="text-gray-400 text-xs mb-1 uppercase tracking-widest font-bold">訂單時間</span>
        <span class="font-medium">{{ new Date(props.order.createdAt).toLocaleString() }}</span>
      </div>
      <div
        class="flex flex-col bg-gray-50/50 p-4 rounded-xl border border-gray-50 items-start justify-center"
      >
        <span class="text-gray-400 text-xs mb-1 uppercase tracking-widest font-bold">訂單狀態</span>
        <Tag
          :value="props.order.statusText"
          :severity="getSeverity(props.order.statusText)"
          rounded
          class="px-3"
        />
      </div>
    </div>
  </div>
</template>
