<script setup>
import { ref, computed } from 'vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Timeline from 'primevue/timeline'
import { orderStatusManager } from '@/services/orderStatusManager'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

// 保持跟列表頁一致的顏色邏輯
const getSeverity = (status) => {
  if (status === '已完成') return 'secondary'
  if (status === '已付款') return 'info'
  if (status === '已出貨') return 'warn'
  if (status === '待付款') return 'secondary'
  if (status === '已取消') return 'primary'
  return 'danger'
}

// 出貨狀態邏輯 (根據訂單狀態推導)
const shippingStatus = computed(() => {
  const status = props.order.statusText
  if (status === '待付款' || status === '已取消') {
    return { text: '尚未出貨', severity: 'secondary', icon: 'pi pi-box' }
  }
  if (status === '已付款') {
    return { text: '理貨中 (準備出貨)', severity: 'info', icon: 'pi pi-spin pi-spinner' }
  }
  if (status === '已出貨') {
    return { text: '已交寄 (配送中)', severity: 'warn', icon: 'pi pi-truck' }
  }
  if (status === '已完成') {
    return { text: '已送達', severity: 'success', icon: 'pi pi-check-circle' }
  }
  return { text: '未知狀態', severity: 'danger', icon: 'pi pi-question-circle' }
})

const timelineEvents = computed(() => {
  // 由於前台 API 可能只回傳 statusText (如 '待付款')，我們將其映射回對應的數字狀態碼
  const map = {
    待付款: 1,
    已付款: 2,
    已出貨: 3,
    已完成: 4,
    已取消: 5,
  }
  const currentStatus = props.order.status || map[props.order.statusText] || 1
  return orderStatusManager.getTimelineSteps(Number(currentStatus))
})

const emit = defineEmits(['repay', 'cancel'])

const menu = ref()

const items = ref([
  {
    label: '信用卡 (綠界)',
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
])

const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="flex flex-col gap-6 mt-2">
    <!-- 隱藏的 Menu，用於選擇付款方式 -->
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <!-- 基本資訊 -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">基本資訊</h2>
      <div class="flex flex-wrap gap-x-8 gap-y-4 text-gray-700">
        <p>
          <span class="text-gray-500 mr-2">訂單編號:</span>
          <span class="font-bold">{{ props.order.orderNo }}</span>
        </p>
        <p>
          <span class="text-gray-500 mr-2">訂購日期:</span>
          {{ new Date(props.order.createdAt).toLocaleString() }}
        </p>
        <p>
          <span class="text-gray-500 mr-2">訂單狀態:</span>
          <Tag
            :value="props.order.statusText"
            :severity="getSeverity(props.order.statusText)"
            rounded
          />
        </p>
      </div>
    </div>

    <!-- 商品清單 -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">商品清單</h2>
      <div class="flex flex-col gap-4">
        <div
          v-for="(item, index) in props.order.items"
          :key="index"
          class="flex gap-4 items-center bg-gray-50 p-4 rounded-lg"
        >
          <img
            :src="item.productImage"
            alt="商品圖片"
            class="w-20 h-20 object-cover rounded border"
          />
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 text-lg">{{ item.productName }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ item.variantName }}</p>
          </div>
          <div class="text-right">
            <p class="text-gray-500">
              $ {{ item.unitPrice.toLocaleString() }} x {{ item.quantity }}
            </p>
            <p class="font-bold text-gray-800 mt-1">
              $ {{ (item.unitPrice * item.quantity).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- 訂單處理進度-->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 my-4">
        <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-6">訂單處理進度</h2>
        <div class="py-2">
          <Timeline :value="timelineEvents" layout="horizontal" class="custom-timeline">
            <template #marker="slotProps">
              <span
                class="flex w-8 h-8 items-center justify-center text-white rounded-full shadow-sm"
                :style="{ backgroundColor: slotProps.item.color }"
              >
                <i :class="slotProps.item.icon" class="text-xs"></i>
              </span>
            </template>
            <template #content="slotProps">
              <div
                class="text-xs font-bold mt-2"
                :class="slotProps.item.active ? 'text-blue-600' : 'text-gray-400'"
              >
                {{ slotProps.item.label }}
              </div>
            </template>
          </Timeline>
        </div>
      </div>

      <!-- 配送與付款 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">配送與付款</h2>
          <div class="flex flex-col gap-3 text-gray-700">
            <p><span class="text-gray-500 mr-2">收件人:</span> {{ props.order.receiverName }}</p>
            <p><span class="text-gray-500 mr-2">聯絡電話:</span> {{ props.order.receiverPhone }}</p>
            <p>
              <span class="text-gray-500 mr-2">收件地址:</span> {{ props.order.receiverAddress }}
            </p>
            <div class="flex items-center mt-1 border-t pt-3">
              <span class="text-gray-500 mr-2">出貨狀態:</span>
              <Tag
                :value="shippingStatus.text"
                :severity="shippingStatus.severity"
                :icon="shippingStatus.icon"
                rounded
              />
            </div>
          </div>
        </div>

        <!-- 金額總計 -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">金額明細</h2>
          <div class="flex flex-col gap-3 text-gray-700">
            <div class="flex justify-between">
              <p class="text-gray-500">商品小計</p>
              <p>$ {{ props.order.subtotal.toLocaleString() }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-gray-500">運費</p>
              <p>$ {{ props.order.shippingFee.toLocaleString() }}</p>
            </div>
            <div class="flex justify-between text-red-500">
              <p>折扣金額</p>
              <p>$ {{ props.order.discount.toLocaleString() }}</p>
            </div>
            <hr class="my-2 border-gray-200" />
            <div class="flex justify-between items-center">
              <p class="font-bold text-gray-800">總計金額</p>
              <p class="text-3xl font-extrabold text-blue-800">
                $ {{ props.order.totalAmount.toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 訂單操作 -->
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-3"
      >
        <div>
          <span class="text-gray-500 mr-2">付款方式:</span>
          <span class="font-medium text-gray-800">{{ props.order.paymentMethod }}</span>
        </div>
        <div class="flex gap-3">
          <!-- 當訂單狀態為「待付款」時，顯示重新付款按鈕 -->
          <Button
            v-if="props.order.statusText === '待付款'"
            label="重新付款"
            icon="pi pi-wallet"
            @click="toggleMenu"
          />

          <Button
            v-if="props.order.statusText === '待付款'"
            label="取消訂單"
            severity="danger"
            text
            @click="emit('cancel')"
          />
          <Button
            v-if="props.order.statusText !== '待付款'"
            label="再次購買"
            icon="pi pi-shopping-cart"
          />
        </div>
      </div>
    </div>
  </div>
</template>
