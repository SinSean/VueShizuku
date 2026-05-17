<script setup>
import { computed } from 'vue'
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

// 取得數值化訂單狀態
const currentStatusCode = computed(() => {
  return statusTextToCode[props.order.status] || ORDER_STATUS.PENDING
})

// 計算出精確的付款狀態與對應的 UI 樣式
const paymentStatus = computed(() => {
  const code = currentStatusCode.value
  if (code === ORDER_STATUS.PENDING) {
    return { text: '未付款', severity: 'danger' } // 紅色/橙色警示未付款
  }
  if (code === ORDER_STATUS.CANCELLED) {
    return { text: '已取消', severity: 'secondary' } // 灰色
  }
  return { text: '已付款', severity: 'success' } // 綠色已付款
})

// 計算出精確的物流與訂單進度狀態與對應的 UI 樣式
const shippingStatus = computed(() => {
  const code = currentStatusCode.value
  if (code === ORDER_STATUS.PENDING) {
    return { text: '訂單待付款', severity: 'secondary' }
  }
  if (code === ORDER_STATUS.PAID) {
    return { text: '理貨中', severity: 'info' }
  }
  if (code === ORDER_STATUS.SHIPPING) {
    return { text: '配送中', severity: 'warn' }
  }
  if (code === ORDER_STATUS.DELIVERED) {
    return { text: '商品已送達', severity: 'success' }
  }
  if (code === ORDER_STATUS.CANCELLED) {
    return { text: '訂單已終止', severity: 'secondary' }
  }
  return { text: '處理中', severity: 'secondary' }
})

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
    class="bg-white rounded-2xl p-6 mb-4 border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden group"
  >
    <!-- 左側裝飾性漸變背景條 -->
    <div
      class="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
      :class="[
        currentStatusCode === ORDER_STATUS.PENDING
          ? 'bg-amber-400'
          : currentStatusCode === ORDER_STATUS.CANCELLED
            ? 'bg-gray-300'
            : 'bg-emerald-500',
      ]"
    ></div>

    <!-- 左側：訂單識別與時間 -->
    <div class="flex items-center gap-5 pl-2">
      <div
        class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300"
        :class="[
          currentStatusCode === ORDER_STATUS.PENDING
            ? 'bg-amber-50 text-amber-600'
            : currentStatusCode === ORDER_STATUS.CANCELLED
              ? 'bg-gray-50 text-gray-400'
              : 'bg-emerald-50 text-emerald-600',
        ]"
      >
        <i class="pi pi-receipt text-xl"></i>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-xs font-bold text-gray-400 tracking-wider uppercase">訂單編號</span>
        <h3
          class="text-lg font-mono font-black text-gray-900 tracking-tight group-hover:text-emerald-600 transition-colors"
        >
          {{ props.order.id }}
        </h3>
        <div class="flex items-center gap-1.5 text-xs text-gray-400">
          <i class="pi pi-calendar text-[10px]"></i>
          <span>訂購時間：{{ props.order.date }}</span>
        </div>
      </div>
    </div>

    <!-- 右側：金額、雙狀態標籤與詳情按鈕 -->
    <div
      class="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 justify-between w-full sm:w-auto pl-2 sm:pl-0"
    >
      <!-- 狀態與金額區 -->
      <div class="flex flex-col sm:items-end gap-2.5">
        <!-- 雙狀態 Badge 容器 -->
        <div class="flex flex-wrap items-center gap-2 sm:justify-end">
          <!-- 付款狀態 Tag -->
          <span
            class="px-3 py-1 text-xs font-bold rounded-full border tracking-wide transition-all shadow-sm"
            :class="[
              paymentStatus.severity === 'danger'
                ? 'bg-red-50 text-red-600 border-red-200'
                : paymentStatus.severity === 'secondary'
                  ? 'bg-gray-50 text-gray-500 border-gray-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200',
            ]"
          >
            <i class="pi pi-wallet text-[10px] mr-1"></i>
            {{ paymentStatus.text }}
          </span>

          <!-- 物流/進度 Tag -->
          <span
            class="px-3 py-1 text-xs font-bold rounded-full border tracking-wide transition-all shadow-sm"
            :class="[
              shippingStatus.severity === 'secondary'
                ? 'bg-gray-50 text-gray-400 border-gray-200'
                : shippingStatus.severity === 'info'
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : shippingStatus.severity === 'warn'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200',
            ]"
          >
            <i class="pi pi-box text-[10px] mr-1"></i>
            {{ shippingStatus.text }}
          </span>
        </div>

        <!-- 總計金額 -->
        <div class="flex items-baseline gap-1 sm:justify-end">
          <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">NT$</span>
          <span class="text-2xl font-black text-gray-800 tracking-tight">
            {{ Number(props.order.total).toLocaleString() }}
          </span>
        </div>
      </div>

      <!-- 查看詳情按鈕 -->
      <div class="flex items-center">
        <button
          @click="goToDetail"
          class="w-full sm:w-auto px-6 py-3 bg-gray-50 hover:bg-emerald-500 text-gray-700 hover:text-white border border-gray-200 hover:border-emerald-500 font-bold rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>查看詳情</span>
          <i
            class="pi pi-arrow-right text-xs transition-transform duration-300 group-hover/btn:translate-x-1"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>
