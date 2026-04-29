<script setup>
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import OrderItemCard from '@/components/OrderItemCard.vue'

// 假資料來源
const ordersList = ref([
  { id: 'ORD-001', total: 1500, status: '已完成', date: '2026-04-20' },
  { id: 'ORD-002', total: 890, status: '已出貨', date: '2026-04-25' },
  { id: 'ORD-003', total: 3200, status: '處理中', date: '2026-04-27' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
  { id: 'ORD-004', total: 450, status: '已取消', date: '2026-04-10' },
])

// 控制初始顯示數量與每次增加數量
const limit = ref(10)

// 依訂單日期由新到舊排序
const sortedOrders = computed(() => {
  return [...ordersList.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 依照目前上限切出要顯示的訂單
const displayedOrders = computed(() => {
  return sortedOrders.value.slice(0, limit.value)
})

// 載入更多訂單資料
const loadMore = () => {
  limit.value += 10
}

// 判斷是否還有更多資料可載入
const hasMore = computed(() => {
  return limit.value < ordersList.value.length
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-4xl font-black text-gray-900 tracking-tight">我的訂單</h1>
        <p class="text-gray-500 mt-4 font-medium">查看您在 Shizuku 的所有交易紀錄與配送狀態</p>
      </div>

      <div class="flex flex-col">
        <OrderItemCard v-for="order in displayedOrders" :key="order.id" :order="order" />
      </div>

      <div class="mt-8 flex justify-center">
        <Button v-if="hasMore" label="顯示更多訂單" class="px-6" @click="loadMore" />
        <p v-else class="text-gray-400 font-medium">已顯示所有訂單紀錄</p>
      </div>

      <p class="text-center text-gray-400 text-sm mt-10">
        僅顯示近半年的訂單紀錄，若需查詢更早之前的訂單請聯絡客服。
      </p>
    </div>
  </div>
</template>
