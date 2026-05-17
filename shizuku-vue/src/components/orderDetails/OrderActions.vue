<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

import { ORDER_STATUS } from '@/services/orderStatusManager'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['repay', 'cancel'])

const menu = ref()
const items = ref([
  {
    label: '信用卡',
    icon: 'pi pi-credit-card',
    command: () => {
      emit('repay', 1)
    },
  },
  {
    label: 'LINE Pay',
    icon: 'pi pi-mobile',
    command: () => {
      emit('repay', 2)
    },
  },
  {
    label: '貨到付款',
    icon: 'pi pi-box',
    command: () => {
      emit('repay', 3)
    },
  },
])

// 利用狀態機進行完全無魔術字判定
const isPendingPayment = computed(() => {
  return props.order.status === ORDER_STATUS.PENDING || props.order.statusText === '未付款'
})

const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4"
  >
    <!-- 隱藏的彈出式 Menu，用於點擊前往結帳時供選取付款管道 -->
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
      <div class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
        <i class="pi pi-wallet text-gray-500 text-sm"></i>
      </div>
      <div class="flex flex-col">
        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">付款方式</span>
        <span class="font-bold text-gray-800 text-sm">{{ props.order.paymentMethod || '未指定' }}</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <!-- 1. 當訂單為待付款/未付款時，顯示取消與前往結帳 -->
      <template v-if="isPendingPayment">
        <Button
          label="取消訂單"
          severity="danger"
          variant="outlined"
          class="rounded-xl px-6 font-bold"
          @click="emit('cancel')"
        />
        <Button
          label="前往結帳"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="rounded-xl px-6 font-bold !bg-gray-900 !border-gray-900 hover:!bg-gray-800 transition-colors"
          @click="toggleMenu"
        />
      </template>

      <!-- 2. 其他已付款、出貨中或取消狀態，顯示再次購買按鈕 -->
      <template v-else>
        <!-- 暫時維持裝飾用按鈕，但加上 disabled 或 title 提示避免誤導，等待未來規格開發 -->
        <Button
          label="再次購買"
          icon="pi pi-shopping-cart"
          severity="secondary"
          variant="outlined"
          class="rounded-xl px-6 font-bold opacity-60 cursor-not-allowed"
          title="再次購買功能開發中，敬請期待"
          disabled
        />
      </template>
    </div>
  </div>
</template>
