<script setup>
import Tag from 'primevue/tag'
import Button from 'primevue/button'
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
</script>

<template>
  <div class="flex flex-col gap-6 mt-8">
    <!-- 基本資訊 -->
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">基本資訊</h2>
      <div class="flex flex-wrap gap-x-8 gap-y-4 text-gray-700">
        <p>
          <span class="text-gray-500 mr-2">訂單編號:</span>
          <span class="font-bold">{{ props.order.orderNo }}</span>
        </p>
        <p><span class="text-gray-500 mr-2">訂購日期:</span> {{  new Date(props.order.createdAt).toLocaleString()}}</p>
        <p>
          <span class="text-gray-500 mr-2">訂單狀態:</span>
         <Tag :value="props.order.statusText" :severity="getSeverity(props.order.statusText)" rounded />
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
          <img :src="item.productImage" alt="商品圖片" class="w-20 h-20 object-cover rounded border" />
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 text-lg">{{ item.productName }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ item.variantName }}</p>
          </div>
          <div class="text-right">
            <p class="text-gray-500">$ {{ item.unitPrice.toLocaleString() }} x {{ item.quantity }}</p> 
            <p class="font-bold text-gray-800 mt-1">$ {{ (item.unitPrice * item.quantity).toLocaleString() }}</p>
          </div>
        </div>
      </div>
       <!-- 配送資訊 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> 
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">配送與付款</h2>
        <div class="flex flex-col gap-3 text-gray-700">
          <p><span class="text-gray-500 mr-2">收件人:</span> {{ props.order.receiverName }}</p>
          <p><span class="text-gray-500 mr-2">聯絡電話:</span> {{ props.order.receiverPhone }}</p>
          <p><span class="text-gray-500 mr-2">收件地址:</span> {{ props.order.receiverAddress }}</p>
          <p><span class="text-gray-500 mr-2">付款方式:</span> {{ props.order.paymentMethod }}</p>
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
            <p class="text-3xl font-extrabold text-blue-800">$ {{ props.order.totalAmount.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 訂單操作 -->
    <div
      class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-end gap-3"
    >
    <p><span class="text-gray-500 mr-2">付款方式:</span> {{ props.order.paymentMethod }}</p>
      <Button label="取消訂單" severity="danger" text />
      <Button label="再次購買" icon="pi pi-shopping-cart" />
    </div>
    </div>
  </div>
</template>
