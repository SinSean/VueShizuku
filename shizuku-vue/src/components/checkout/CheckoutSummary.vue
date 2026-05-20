<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    required: true,
  },
  finalTotal: {
    type: Number,
    required: true,
  },
})
import { getImageUrl } from '@/utils/imageHelper'
</script>

<template>
  <div class="bg-gray-50/50 border-b border-gray-200 p-6 sm:p-10">
    <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <span class="w-1.5 h-5 bg-black rounded-full"></span>
      訂單摘要
    </h2>

    <!-- 購物車商品清單 -->
    <div class="space-y-5 mb-6">
      <div
        v-for="item in props.items"
        :key="item.id"
        class="flex items-center gap-4 relative"
      >
        <div class="relative flex-shrink-0">
          <div
            class="w-16 h-16 bg-[#f8f8f8] border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <img :src="getImageUrl(item.image)" class="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <span
            class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          >{{ item.quantity }}</span>
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-gray-900 text-sm">{{ item.name }}</h4>
          <p class="text-gray-400 text-xs mt-1 font-mono">
            NT$ {{ item.price.toLocaleString() }} <span class="mx-1">x</span> {{ item.quantity }}
          </p>
        </div>
        <!-- 小計 -->
        <p class="font-bold text-gray-900 text-sm font-mono">
          NT$ {{ (item.price * item.quantity).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- 折扣碼區塊 -->
    <div class="flex gap-3 mb-6 pt-6 border-t border-gray-200">
      <input
        type="text"
        placeholder="折扣碼"
        class="flex-1 bg-white rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
      />
      <button
        class="bg-gray-200 text-gray-500 font-bold px-6 rounded-md hover:bg-gray-300 hover:text-gray-700 transition text-sm"
      >
        套用
      </button>
    </div>

    <!-- 結算明細 -->
    <div class="space-y-3 text-sm text-gray-600 border-t border-gray-200 pt-6">
      <div class="flex justify-between">
        <span>小計</span>
        <span class="font-medium text-gray-900 font-mono">
          NT$ {{ props.subtotal.toLocaleString() }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="flex items-center gap-1.5">
          <i class="pi pi-truck text-xs text-gray-400"></i> 運費
        </span>
        <span
          :class="props.shippingFee > 0 ? 'text-gray-900 font-medium font-mono' : 'text-emerald-600 font-medium'"
        >
          {{ props.shippingFee > 0 ? `NT$ ${props.shippingFee.toLocaleString()}` : '免運費' }}
        </span>
      </div>
      <!-- 總金額 -->
      <div class="flex justify-between items-center pt-4 mt-2 border-t-2 border-gray-900">
        <span class="text-sm font-bold text-gray-900 uppercase tracking-widest">Total</span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">TWD</span>
          <span class="text-2xl font-black text-gray-900 font-mono tracking-tight">
            NT$ {{ props.finalTotal.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
