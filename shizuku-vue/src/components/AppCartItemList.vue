<script setup>
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  removeTool: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="bg-white">
    <h2 class="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-2">商品明細 ({{ props.items.length }} 件)</h2>

    <!-- 當購物車為空時 -->
    <div v-if="props.items.length === 0" class="py-20 text-center text-gray-400">
      <i class="pi pi-shopping-cart text-5xl mb-4 opacity-50"></i>
      <p>您的購物車目前沒有商品</p>
    </div>

    <!-- 購物車商品列表 -->
    <div v-else class="flex flex-col">
      <div
        v-for="item in props.items"
        :key="item.id"
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-8 border-b border-gray-100 last:border-0"
      >
        <!-- 左側商品圖文 -->
        <div class="flex items-start gap-6 w-full sm:w-auto">
          <!-- 圖片容器 (帶極淺灰底色，讓去背圖更好看) -->
          <div class="w-24 h-32 bg-[#f8f8f8] rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
            <img
              :src="item.image"
              alt="商品圖片"
              class="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          <div class="flex flex-col justify-center pt-2">
            <h3 class="text-base font-bold text-gray-900 tracking-wide">{{ item.name }}</h3>
            <p class="text-gray-500 text-sm mt-1">極致舒適 / 單一尺寸</p>
            <p class="text-gray-900 font-medium mt-3">NT$ {{ item.price.toLocaleString() }}</p>
          </div>
        </div>

        <!-- 右側操作區 (數量與刪除) -->
        <div class="flex items-center justify-between w-full sm:w-auto gap-8 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
          <InputNumber
            v-model="item.quantity"
            showButtons
            buttonLayout="horizontal"
            :min="1"
            :max="99"
            class="w-28 shadow-sm border border-gray-200 rounded-md overflow-hidden"
            inputClass="text-center w-10 !border-0 font-bold"
            decrementButtonClass="!bg-white !text-gray-800 hover:!bg-gray-100 !border-0"
            incrementButtonClass="!bg-white !text-gray-800 hover:!bg-gray-100 !border-0"
          />
          <button
            class="text-gray-300 hover:text-red-500 transition p-2 group"
            @click="props.removeTool(item.id)"
            title="移除商品"
          >
            <i class="pi pi-trash group-hover:scale-110 transition-transform text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 覆蓋 PrimeVue 預設邊框樣式，讓它融入我們客製化的 Tailwind 邊框 */
:deep(.p-inputnumber-input) {
  border: none !important;
  box-shadow: none !important;
}
</style>
