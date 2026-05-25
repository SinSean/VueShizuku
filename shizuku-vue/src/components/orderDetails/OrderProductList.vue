<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
import { getImageUrl } from '@/utils/imageHelper'
</script>

<template>
  <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
      <span class="w-1.5 h-5 bg-black rounded-full"></span>
      商品明細
    </h2>
    <div class="flex flex-col">
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="flex items-center gap-6 py-5 border-b border-gray-100 last:border-0 group"
      >
        <!-- 商品圖片 -->
        <div class="w-20 h-24 bg-[#f8f8f8] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          <img
            :src="getImageUrl(item.productImage)"
            alt="商品圖片"
            class="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <!-- 中間資訊區 -->
        <div class="flex-1 flex flex-col justify-center">
          <h3 class="font-bold text-gray-900 text-base tracking-wide">{{ item.productName }}</h3>
          <p class="text-sm text-gray-500 mt-1 mb-2">{{ item.variantName }}</p>
        </div>

        <!-- 右側數量區 -->
        <div class="text-right pl-4">
          <div class="inline-flex items-center justify-center px-3 py-1.5 bg-gray-50 text-gray-700 font-mono text-sm font-bold rounded-md border border-gray-200">
            <span class="text-gray-400 text-xs mr-1">x</span>{{ item.quantity }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
