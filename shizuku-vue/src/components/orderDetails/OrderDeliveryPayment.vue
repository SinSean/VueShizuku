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

const currentStatus = computed(() => {
  return props.order.status || statusTextToCode[props.order.statusText] || ORDER_STATUS.PENDING
})

// 出貨狀態邏輯
const shippingStatus = computed(() => {
  const status = currentStatus.value

  if (status === ORDER_STATUS.PENDING || status === ORDER_STATUS.CANCELLED) {
    return { text: '尚未出貨', severity: 'secondary', icon: 'pi pi-box' }
  }
  if (status === ORDER_STATUS.PAID) {
    return {
      text: '理貨中 (準備出貨)',
      severity: 'info',
      icon: 'pi pi-spin pi-spinner',
    }
  }
  if (status === ORDER_STATUS.SHIPPING) {
    return { text: '已交寄 (配送中)', severity: 'warn', icon: 'pi pi-truck' }
  }
  if (status === ORDER_STATUS.DELIVERED) {
    return { text: '已送達', severity: 'success', icon: 'pi pi-check-circle' }
  }
  return {
    text: '未知狀態',
    severity: 'danger',
    icon: 'pi pi-question-circle',
  }
})
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 h-full">
    <h2
      class="text-lg font-bold text-gray-800 border-l-4 border-indigo-400 pl-3 mb-6 flex items-center gap-2"
    >
      <i class="pi pi-truck text-indigo-400"></i> 配送資訊
    </h2>
    <div class="flex flex-col gap-5 text-gray-700">
      <div class="flex items-start gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-50">
        <div
          class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0"
        >
          <i class="pi pi-user text-indigo-500"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">收件人</span>
          <span class="font-bold text-gray-800">{{ props.order.receiverName }}</span>
          <span class="text-sm text-gray-500 mt-0.5">{{ props.order.receiverPhone }}</span>
        </div>
      </div>

      <div class="flex items-start gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-50">
        <div
          class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0"
        >
          <i class="pi pi-map-marker text-indigo-500"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1"
            >收件地址</span
          >
          <span class="text-gray-700 leading-relaxed">{{ props.order.receiverAddress }}</span>
        </div>
      </div>

      <div
        class="flex items-center justify-between p-4 bg-indigo-50/30 rounded-xl border border-indigo-50 mt-2"
      >
        <span class="text-sm font-bold text-indigo-900">物流出貨狀態</span>
        <Tag
          :value="shippingStatus.text"
          :severity="shippingStatus.severity"
          :icon="shippingStatus.icon"
          rounded
          class="px-3"
        />
      </div>
    </div>
  </div>
</template>
