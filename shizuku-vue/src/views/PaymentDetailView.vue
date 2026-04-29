<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PaymentDetailSection from '@/components/PaymentDetailSection.vue'

// 取得路由參數，優先顯示交易編號
const route = useRoute()
const router = useRouter()
const transactionId = route.params.transactionId ?? 'TXN-202604290001'
const orderId = route.params.id ?? 'ORD-003'

// 交易明細假資料（後續可替換成 API）
const paymentData = ref({
  transactionId,
  orderId,
  paidAt: '2026-04-29 13:22',
  method: '信用卡（Visa）',
  status: '付款成功',
  authCode: 'A7K9Q2',
  subtotal: 3150,
  shippingFee: 60,
  discount: 100,
  totalPaid: 3110,
  note: '本交易由第三方金流平台完成授權，款項已成功入帳。',
})

// 返回支付明細列表頁
const goBack = () => {
  router.push({
    name: 'payment-list',
    params: { id: paymentData.value.orderId },
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
        <div>
          <h1 class="text-3xl font-extrabold text-gray-800">支付明細</h1>
          <p class="text-gray-500 mt-1">查看本次交易的付款狀態與金額明細</p>
        </div>
      </div>

      <PaymentDetailSection :payment="paymentData" />
    </div>
  </div>
</template>
