<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})
import Button from 'primevue/button'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">基本資訊</h2>
      <div class="flex flex-wrap gap-x-8 gap-y-4 text-gray-700">
        <p>
          <span class="text-gray-500 mr-2">訂單編號:</span>
          <span class="font-bold">{{ props.order.id }}</span>
        </p>
        <p><span class="text-gray-500 mr-2">訂購日期:</span> {{ props.order.date }}</p>
        <p>
          <span class="text-gray-500 mr-2">訂單狀態:</span>
          <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">{{
            props.order.status
          }}</span>
        </p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">商品清單</h2>
      <div class="flex flex-col gap-4">
        <div
          v-for="item in props.order.items"
          :key="item.id"
          class="flex gap-4 items-center bg-gray-50 p-4 rounded-lg"
        >
          <img :src="item.image" alt="商品圖片" class="w-20 h-20 object-cover rounded border" />
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 text-lg">{{ item.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ item.spec }}</p>
          </div>
          <div class="text-right">
            <p class="text-gray-500">$ {{ item.price }} x {{ item.quantity }}</p>
            <p class="font-bold text-gray-800 mt-1">$ {{ item.price * item.quantity }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">配送與付款細節</h2>
        <div class="flex flex-col gap-3 text-gray-700">
          <p><span class="text-gray-500 mr-2">收件人:</span> {{ props.order.recipient }}</p>
          <p><span class="text-gray-500 mr-2">收件地址:</span> {{ props.order.address }}</p>
          <p><span class="text-gray-500 mr-2">付款方式:</span> {{ props.order.paymentMethod }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mb-4">金額明細</h2>
        <div class="flex flex-col gap-3 text-gray-700">
          <div class="flex justify-between">
            <p class="text-gray-500">商品小計</p>
            <p>$ {{ props.order.subtotal }}</p>
          </div>
          <div class="flex justify-between text-red-500">
            <p>折扣</p>
            <p>$ {{ props.order.discount }}</p>
          </div>
          <hr class="my-2 border-gray-200" />
          <div class="flex justify-between items-center">
            <p class="font-bold text-gray-800">總計</p>
            <p class="text-3xl font-extrabold text-blue-800">$ {{ props.order.total }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-end gap-3"
    >
      <Button label="取消訂單" severity="danger" text />
      <Button label="再次購買" icon="pi pi-shopping-cart" />
    </div>
  </div>
</template>
