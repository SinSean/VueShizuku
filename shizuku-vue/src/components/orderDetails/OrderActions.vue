<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

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

const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4"
  >
    <!-- 隱藏的 Menu，用於選擇付款方式 -->
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
      <div class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
        <i class="pi pi-wallet text-gray-500 text-sm"></i>
      </div>
      <div class="flex flex-col">
        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">付款方式</span>
        <span class="font-bold text-gray-800 text-sm">{{ props.order.paymentMethod }}</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <!-- 當訂單狀態為「待付款」時，顯示重新付款與取消按鈕 -->
      <template v-if="props.order.statusText === '待付款'">
        <Button
          label="取消訂單"
          severity="danger"
          variant="outlined"
          class="rounded-xl px-6"
          @click="emit('cancel')"
        />
        <Button
          label="前往結帳"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="rounded-xl px-6 !bg-gray-900 !border-gray-900 hover:!bg-gray-800"
          @click="toggleMenu"
        />
      </template>

      <!-- 其他狀態顯示再次購買 -->
      <template v-else>
        <Button
          label="再次購買"
          icon="pi pi-shopping-cart"
          severity="secondary"
          variant="outlined"
          class="rounded-xl px-6"
        />
      </template>
    </div>
  </div>
</template>
