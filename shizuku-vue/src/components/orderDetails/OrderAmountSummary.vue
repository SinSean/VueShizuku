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
    class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 h-full flex flex-col"
  >
    <h2
      class="text-lg font-bold text-gray-800 border-l-4 border-amber-400 pl-3 mb-6 flex items-center gap-2"
    >
      <i class="pi pi-receipt text-amber-400"></i> 金額明細
    </h2>
    <div class="flex flex-col gap-4 text-gray-700 flex-1 justify-center">
      <div class="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
        <p class="text-gray-500 font-medium">商品小計</p>
        <p class="font-mono text-gray-800">$ {{ props.order.subtotal.toLocaleString() }}</p>
      </div>

      <div class="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
        <p class="text-gray-500 font-medium flex items-center gap-1">
          <i class="pi pi-truck text-xs"></i> 運費
        </p>
        <p class="font-mono text-gray-800">$ {{ props.order.shippingFee.toLocaleString() }}</p>
      </div>

      <div
        class="flex justify-between items-center py-2 border-b border-gray-50 border-dashed text-rose-500"
      >
        <p class="font-medium flex items-center gap-1">
          <i class="pi pi-tag text-xs"></i> 折扣金額
        </p>
        <p class="font-mono font-bold">- $ {{ props.order.discount.toLocaleString() }}</p>
      </div>

      <div class="mt-auto pt-6 pb-2">
        <div
          class="flex justify-between items-end bg-gray-50/50 p-4 rounded-xl border border-gray-100"
        >
          <p class="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">總金額</p>
          <p class="text-4xl font-black text-gray-900 tracking-tighter">
            <span class="text-lg text-gray-400 font-bold mr-1">$</span
            >{{ props.order.totalAmount.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
