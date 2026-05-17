<script setup>
import { useRouter } from 'vue-router'
import { ORDER_STATUS } from '@/services/orderStatusManager'

// 呼叫司機待命
const router = useRouter()

// 接收經理 (列表頁) 傳進來的一筆訂單資料
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

// 統一對照表
const statusTextToCode = {
  未付款: ORDER_STATUS.PENDING,
  已付款: ORDER_STATUS.PAID,
  出貨中: ORDER_STATUS.SHIPPING,
  已出貨: ORDER_STATUS.SHIPPING,
  已送達: ORDER_STATUS.DELIVERED,
  已完成: ORDER_STATUS.DELIVERED,
  已取消: ORDER_STATUS.CANCELLED,
}

// 顯示狀態樣式
const getSeverity = (statusText) => {
  const code = statusTextToCode[statusText]
  if (code === ORDER_STATUS.DELIVERED) return 'success'
  if (code === ORDER_STATUS.PAID) return 'info'
  if (code === ORDER_STATUS.SHIPPING) return 'warn'
  if (code === ORDER_STATUS.PENDING) return 'secondary'
  if (code === ORDER_STATUS.CANCELLED) return 'danger'
  return 'secondary'
}

// 跳轉到詳情頁的動作
const goToDetail = () => {
  router.push({
    name: 'MemberOrderDetail',
    params: { id: props.order.id },
  })
}
</script>

<template>
  <div
    class="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row md:items-center justify-between gap-4"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0"
      >
        <i class="pi pi-shopping-bag text-xl"></i>
      </div>

      <div>
        <h3 class="text-lg font-extrabold text-gray-800">{{ props.order.id }}</h3>
        <p class="text-sm text-gray-400 mt-1">訂購時間：{{ props.order.date }}</p>
      </div>
    </div>

    <div class="flex flex-col md:items-end gap-2 md:pr-8">
      <Tag :value="props.order.status" :severity="getSeverity(props.order.status)" rounded />
      <span class="text-xl font-black text-gray-700">$ {{ props.order.total }}</span>
    </div>

    <div class="flex items-center">
      <Button
        label="查看詳情"
        icon="pi pi-angle-right"
        iconPos="right"
        outlined
        rounded
        @click="goToDetail"
        class="w-full md:w-auto"
      />
    </div>
  </div>
</template>
