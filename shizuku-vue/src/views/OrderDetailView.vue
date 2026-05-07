<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OrderInfoSection from '@/components/OrderInfoSection.vue'
import { getOrderDetailAPI } from '@/api/order';

const route = useRoute()
const router = useRouter()
const orderId = route.params.id

//初始資料為null
const orderData = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await getOrderDetailAPI(orderId)
    if (res.success) {
      // 把後端 DTO 轉成你前端需要的格式（或是直接對接）
      orderData.value = res.data
    } else {
      alert(res.message)
      router.push({ name: 'orders' })
    }
  } catch (error) {
    console.error("讀取訂單詳情失敗：", error)
    alert("系統錯誤，請稍後再試")
  } finally {
    isLoading.value = false
  }
})

const goBack = () => {
  router.push({ name: 'orders' })
}
</script>

<!-- <template>
  <div  class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <Button icon="pi pi-arrow-left" text rounded @click="goBack" />
        <h1 class="text-3xl font-extrabold text-gray-800">訂單詳細內容</h1>
      </div>
      <OrderInfoSection :order="orderData" />
    </div>
  </div>
</template> -->

<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <!-- 這裡可以放一個簡易的載入動畫 -->
    <i class="pi pi-spin pi-spinner text-3xl text-gray-300"></i>
  </div>

  <div v-else-if="orderData" class="min-h-screen bg-gray-50 py-8 px-4">
    <!-- 原本的內容... -->
    <div class="max-w-4xl mx-auto flex flex-col gap-6">
       <!-- 範例：顯示訂單編號 -->
       <h1 class="text-2xl font-bold">訂單詳情：{{ orderData.orderNo }}</h1>
       
       <!-- 這裡記得要把欄位名稱都改成 res.data 裡面的名稱喔！ -->
    </div>
  </div>
</template>
