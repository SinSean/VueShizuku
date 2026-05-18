<script setup>
import { computed } from 'vue'
import { orderStatusManager, ORDER_STATUS } from '@/services/orderStatusManager'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const statusTextToCode = {
  未付款: ORDER_STATUS.PENDING,
  已付款: ORDER_STATUS.PAID,
  出貨中: ORDER_STATUS.SHIPPING,
  已送達: ORDER_STATUS.DELIVERED,
  已取消: ORDER_STATUS.CANCELLED,
}

const currentStatus = computed(() => {
  return props.order.status || statusTextToCode[props.order.statusText] || ORDER_STATUS.PENDING
})
const timelineEvents = computed(() => {
  return orderStatusManager.getTimelineSteps(Number(currentStatus.value))
})

const activeStepIndex = computed(() => {
  // 如果訂單已取消，進度條不顯示任何進度 (或維持在第一步)
  if (currentStatus.value === ORDER_STATUS.CANCELLED) return -1

  // 找出最後一個已完成 (completed) 的步驟索引
  const lastCompletedIndex = [...timelineEvents.value].reverse().findIndex((e) => e.completed)
  if (lastCompletedIndex === -1) return 0

  return timelineEvents.value.length - 1 - lastCompletedIndex
})
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2
      class="text-lg font-bold text-gray-800 border-l-4 border-emerald-500 pl-3 mb-8 flex items-center gap-2"
    >
      <i class="pi pi-map text-emerald-500"></i> 訂單處理進度
    </h2>

    <div class="w-full p-2">
      <div class="relative flex justify-between w-full">
        <div class="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

        <div
          class="absolute top-4 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 transition-all duration-500 ease-out z-0"
          :style="{ width: (activeStepIndex / (timelineEvents.length - 1)) * 100 + '%' }"
        ></div>

        <div
          v-for="(step, index) in timelineEvents"
          :key="index"
          class="relative z-10 flex flex-col items-center flex-1"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300"
            :class="[
              index <= activeStepIndex
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md ring-4 ring-emerald-50'
                : 'bg-white border-gray-200 text-gray-400',
            ]"
          >
            <i
              :class="index < activeStepIndex ? 'pi pi-check text-xs' : step.icon"
              class="text-xs"
            ></i>
          </div>

          <span
            class="text-xs font-bold mt-3 transition-colors duration-300"
            :class="index <= activeStepIndex ? 'text-emerald-600' : 'text-gray-400'"
          >
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
