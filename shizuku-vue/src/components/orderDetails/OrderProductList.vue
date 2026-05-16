<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2
      class="text-lg font-bold text-gray-800 border-l-4 border-emerald-400 pl-3 mb-6 flex items-center gap-2"
    >
      <i class="pi pi-list text-emerald-400"></i> 商品明細
    </h2>
    <div class="flex flex-col gap-4">
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-5 border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all duration-300 group"
      >
        <!-- 商品圖片 -->
        <div
          class="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner"
        >
          <img
            :src="item.productImage"
            alt="商品圖片"
            class="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <!-- 中間資訊區 -->
        <div class="flex-1 space-y-3">
          <h3 class="font-bold text-gray-900 text-lg tracking-tight">{{ item.productName }}</h3>

          <!-- 規格標籤 -->
          <div class="flex flex-wrap gap-2">
            <span
              class="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-md uppercase tracking-wider shadow-sm"
            >
              規格：{{ item.variantName }}
            </span>
            <span
              class="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold rounded-md uppercase tracking-wider"
            >
              數量：{{ item.quantity }}
            </span>
          </div>
        </div>

        <!-- 右側金額區 -->
        <div
          class="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-1 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50"
        >
          <div class="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            單價: $ {{ item.unitPrice.toLocaleString() }}
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xs font-bold text-gray-400 uppercase">總計:</span>
            <span class="text-2xl font-black text-emerald-600 tracking-tighter">
              $ {{ (item.unitPrice * item.quantity).toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
