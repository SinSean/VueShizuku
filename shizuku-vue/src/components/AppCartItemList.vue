<script setup>
// ====== 核心邏輯區塊：引進 PrimeVue 零件 ======
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
// ============================================

// 接收從 CartDetailView 傳進來的購物車清單與刪除工具
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
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h2 class="text-xl font-bold text-gray-800 border-b pb-4 mb-4">商品明細</h2>

    <div class="flex flex-col gap-6">
      <div
        v-for="item in props.items"
        :key="item.id"
        class="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0"
      >
        <div class="flex items-center gap-4 w-full md:w-auto">
          <img
            :src="item.image"
            alt="商品圖片"
            class="w-24 h-24 object-cover rounded-lg border border-gray-100"
          />
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ item.name }}</h3>
            <p class="text-gray-500 mt-1">單價：NT$ {{ item.price }}</p>
          </div>
        </div>

        <div class="flex items-center gap-6 w-full md:w-auto justify-end">
          <InputNumber
            v-model="item.quantity"
            showButtons
            buttonLayout="horizontal"
            :min="1"
            :max="99"
            class="w-32"
            inputClass="text-center w-full"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            size="large"
            @click="props.removeTool(item.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 如果有需要微調 PrimeVue 內建的樣式，可以寫在這裡，目前不需要 */
</style>
