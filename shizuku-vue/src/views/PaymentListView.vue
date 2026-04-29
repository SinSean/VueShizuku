<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PaymentRecordCard from '@/components/PaymentRecordCard.vue'

// 取得路由資訊，綁定當前訂單編號
const route = useRoute()
const router = useRouter()
const orderId = computed(() => String(route.params.id ?? 'ORD-003'))

// 支付紀錄假資料（後續可替換為 API 回傳）
const paymentRecords = ref([
  {
    transactionId: 'TXN-ORD-003-001',
    paidAt: '2026-04-29 13:22',
    method: '信用卡（Visa）',
    status: '付款成功',
    totalPaid: 3110,
  },
  {
    transactionId: 'TXN-ORD-003-000',
    paidAt: '2026-04-29 13:15',
    method: '信用卡（Visa）',
    status: '付款失敗',
    totalPaid: 3110,
  },
])

// 返回訂單詳情頁
const goBack = () => {
  if (route.params.id) {
    router.push({ name: 'order-detail', params: { id: orderId.value } })
    return
  }
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
        <div>
          <h1 class="text-3xl font-extrabold text-gray-800">支付明細列表</h1>
          <p class="text-gray-500 mt-1">訂單 {{ orderId }} 的所有支付交易紀錄</p>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <PaymentRecordCard
          v-for="payment in paymentRecords"
          :key="payment.transactionId"
          :payment="payment"
          :order-id="orderId"
        />
      </div>

      <p class="text-center text-gray-400 text-sm mt-2">目前顯示前端假資料，待後續串接後端金流 API。</p>
    </div>
  </div>
</template>
