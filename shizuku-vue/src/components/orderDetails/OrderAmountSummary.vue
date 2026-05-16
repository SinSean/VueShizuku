<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex-1 h-full flex flex-col"
  >
    <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
      <span class="w-1.5 h-5 bg-black rounded-full"></span>
      金額明細
    </h2>
    <div class="flex flex-col flex-1">
      <!-- 新增：商品個別金額細目 -->
      <div class="flex flex-col gap-3 mb-6">
        <div
          v-for="(item, index) in props.order.items"
          :key="index"
          class="flex justify-between items-start text-sm"
        >
          <div class="flex flex-col pr-4">
            <span class="text-gray-800 font-medium leading-relaxed">{{ item.productName }}</span>
            <span class="text-gray-400 font-mono text-xs mt-0.5"
              >$ {{ item.unitPrice.toLocaleString() }} <span class="mx-1">x</span>
              {{ item.quantity }}</span
            >
          </div>
          <span class="font-mono text-gray-900 font-bold whitespace-nowrap"
            >$ {{ (item.unitPrice * item.quantity).toLocaleString() }}</span
          >
        </div>
      </div>

      <!-- 分隔線 -->
      <hr class="border-gray-200 border-dashed mb-6" />

      <!-- 小計、運費、折扣 -->
      <div class="flex flex-col gap-4 text-sm text-gray-600 mb-8">
        <div class="flex justify-between items-center">
          <p>商品小計</p>
          <p class="font-mono text-gray-900">$ {{ props.order.subtotal.toLocaleString() }}</p>
        </div>

        <div class="flex justify-between items-center">
          <p class="flex items-center gap-2"><i class="pi pi-truck text-gray-400"></i> 運費</p>
          <p class="font-mono text-gray-900">$ {{ props.order.shippingFee.toLocaleString() }}</p>
        </div>

        <div class="flex justify-between items-center text-rose-600">
          <p class="flex items-center gap-2"><i class="pi pi-tag text-rose-400"></i> 折扣金額</p>
          <p class="font-mono font-bold">- $ {{ props.order.discount.toLocaleString() }}</p>
        </div>
      </div>

      <!-- 總金額 -->
      <div class="mt-auto pt-4 border-t-2 border-gray-900">
        <div class="flex justify-between items-end">
          <p class="font-bold text-gray-900 tracking-widest text-sm mb-1 uppercase">總計</p>
          <p class="text-3xl font-black text-gray-900 tracking-tighter">
            <span class="text-lg text-gray-400 font-bold mr-1">$</span
            >{{ props.order.totalAmount.toLocaleString() }}
          </p>
        </div>
        <!-- 貨到付款提醒 -->
        <p
          v-if="props.order.paymentMethod === '貨到付款'"
          class="mt-4 text-right text-[10px] text-amber-600 font-bold tracking-tight"
        >
          * 此金額將於商品送達時以現金支付
        </p>
      </div>
    </div>
  </div>
</template>
