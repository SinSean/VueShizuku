<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import OrderInfoSection from '@/components/OrderInfoSection.vue'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id

const orderData = ref({
  id: orderId,
  date: '2026-04-28 15:30',
  status: '已出貨',
  recipient: '王小明',
  address: '高雄市三民區建國路123號',
  paymentMethod: '信用卡付款',
  items: [
    {
      id: 1,
      name: '日系簡約純棉 T-Shirt',
      spec: '顏色：靜謐黑 / 尺寸：L',
      price: 590,
      quantity: 1,
      image: 'https://placehold.co/100x100/eeeeee/999999?text=T-Shirt',
    },
    {
      id: 2,
      name: '復古寬鬆牛仔褲',
      spec: '顏色：水洗藍 / 尺寸：M',
      price: 1280,
      quantity: 2,
      image: 'https://placehold.co/100x100/eeeeee/999999?text=Jeans',
    },
  ],
  subtotal: 3150,
  discount: -100,
  total: 3110,
})

const goBack = () => {
  router.push({ name: 'orders' })
}

// 前往支付明細列表頁
// const goToPaymentList = () => {
//   router.push({
//     name: 'payment-list',
//     params: { id: orderData.value.id },
//   })
// }
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
        <h1 class="text-3xl font-extrabold text-gray-800">訂單詳細內容</h1>
      </div>

      <!-- <div class="flex justify-end">
        <Button
          label="查看支付明細列表"
          icon="pi pi-credit-card"
          outlined
          @click="goToPaymentList"
        />
      </div> -->

      <OrderInfoSection :order="orderData" />
    </div>
  </div>
</template>
