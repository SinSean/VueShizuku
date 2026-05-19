<script setup>
import InputNumber from 'primevue/inputnumber'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

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

// 點擊商品圖或名稱 → 跳到商品詳情頁重新選規格（最直接的換規格方式）
// 此時可透過 useProductCart composable 的 addToCart 加入購物車，
// 購物車 store 會自動合併相同規格的數量
const goToProduct = (item) => {
  // item.productId 由 useProductCart 加入時記錄（若有）
  if (item.productId) {
    router.push({ name: 'product-detail', params: { id: item.productId } })
  }
}
</script>

<template>
  <div class="bg-white">
    <h2 class="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-2">
      商品明細 ({{ cartStore.items.length }} 件)
    </h2>

    <!-- 當購物車為空時 -->
    <div v-if="cartStore.items.length === 0" class="py-20 text-center text-gray-400">
      <i class="pi pi-shopping-cart text-5xl mb-4 opacity-50"></i>
      <p>您的購物車目前沒有商品</p>
    </div>

    <!-- 購物車商品列表 -->
    <div v-else class="flex flex-col">
      <div
        v-for="item in cartStore.items"
        :key="item.id"
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-8 border-b border-gray-100 last:border-0"
      >
        <!-- 左側商品圖文 -->
        <div class="flex items-start gap-6 w-full sm:w-auto">
          <!-- 圖片容器 -->
          <div
            class="w-24 h-32 bg-[#f8f8f8] rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center"
          >
            <img
              :src="item.image"
              alt="商品圖片"
              class="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          <div class="flex flex-col justify-center pt-2">
            <h3 class="text-base font-bold text-gray-900 tracking-wide">{{ item.name }}</h3>

            <!-- 規格顯示 + 換規格提示 -->
            <div class="flex items-center gap-2 mt-1">
              <p class="text-gray-500 text-sm">{{ item.color }} / {{ item.size }}</p>
              <!-- 換規格按鈕：若有 productId 則導向商品頁重選 -->
              <button
                v-if="item.productId"
                @click="goToProduct(item)"
                class="text-[11px] text-blue-500 hover:text-blue-700 hover:underline transition-colors flex items-center gap-0.5"
                title="返回商品頁更換顏色或尺寸"
              >
                <i class="pi pi-refresh text-[10px]"></i>
                換規格
              </button>
            </div>

            <p class="text-gray-900 font-medium mt-3">
              NT$ {{ (item.price * item.quantity).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- 右側操作區 (數量與刪除) -->
        <div
          class="flex items-center justify-between w-full sm:w-auto gap-8 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50"
        >
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
            @click="cartStore.removeFromCart(item.id)"
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
