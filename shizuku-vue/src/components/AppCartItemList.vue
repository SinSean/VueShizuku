<script setup>
import { ref, computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { productApi } from '@/api/Product.js'
import { getImageUrl } from '@/utils/imageHelper'

const cartStore = useCartStore()
const router = useRouter()
const toast = useToast()

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

// 手風琴狀態變數
const activeEditingItemId = ref(null)
const editingProduct = ref(null)
const editingProductVariants = ref([])
const isLoadingVariants = ref(false)
const tempSelectedColor = ref('')
const tempSelectedSize = ref('')

// 計算可選取的顏色
const availableColors = computed(() => {
  const colors = []
  const seen = new Set()
  editingProductVariants.value.forEach((v) => {
    if (!seen.has(v.fColor)) {
      seen.add(v.fColor)
      colors.push(v.fColor)
    }
  })
  return colors
})

// 計算可選取的尺寸 (基於所選的顏色)
const availableSizes = computed(() => {
  return editingProductVariants.value
    .filter((v) => v.fColor === tempSelectedColor.value)
    .map((v) => v.fSize)
})

// 當前選中的規格物件
const tempSelectedVariant = computed(() => {
  return editingProductVariants.value.find(
    (v) => v.fColor === tempSelectedColor.value && v.fSize === tempSelectedSize.value
  )
})

// 當前規格價格 (若規格售價為 null/0，則退回使用商品主表價格)
const tempSelectedVariantPrice = computed(() => {
  const variantPrice = tempSelectedVariant.value?.fPrice
  if (variantPrice && variantPrice > 0) {
    return variantPrice
  }
  return editingProduct.value?.fPrice ?? 0
})

// 當前規格庫存
const tempSelectedVariantStock = computed(() => {
  return tempSelectedVariant.value?.fStock ?? 0
})

// 選取顏色並自動切換至該顏色下的第一個尺寸
const selectColor = (color) => {
  tempSelectedColor.value = color
  const sizes = editingProductVariants.value
    .filter((v) => v.fColor === color)
    .map((v) => v.fSize)
  tempSelectedSize.value = sizes[0] ?? ''
}

// 切換手風琴面板展開/收合
const toggleAccordion = async (item) => {
  if (activeEditingItemId.value === item.id) {
    activeEditingItemId.value = null
  } else {
    activeEditingItemId.value = item.id
    isLoadingVariants.value = true
    try {
      // 同步取得該規格所屬商品的主表資訊與規格列表，以利取得基本價格 Fallback
      const [variantsRes, productRes] = await Promise.all([
        productApi.getVariants(item.productId),
        productApi.getById(item.productId)
      ])
      editingProductVariants.value = variantsRes.data.data ?? []
      editingProduct.value = productRes.data.data
      tempSelectedColor.value = item.color
      tempSelectedSize.value = item.size
    } catch (err) {
      console.error('取得商品或規格資訊失敗', err)
      toast.add({
        severity: 'error',
        summary: '讀取失敗',
        detail: '無法取得該商品的最新規格，請稍後再試。',
        life: 3000
      })
      activeEditingItemId.value = null
    } finally {
      isLoadingVariants.value = false
    }
  }
}

// 確認規格變更
const confirmVariantChange = (item) => {
  const variant = tempSelectedVariant.value
  if (!variant) return

  if (variant.fStock <= 0) {
    toast.add({
      severity: 'warn',
      summary: '庫存不足',
      detail: '所選規格已無庫存，請選擇其他規格。',
      life: 3000
    })
    return
  }

  // 決定最終售價：優先採用規格售價，若為 null/0 則使用主表價格，若再沒有則使用原本項目的價格
  const finalPrice = tempSelectedVariantPrice.value || item.price

  // 呼叫 pinia store 更換規格
  cartStore.updateItemVariant(item.id, {
    id: variant.fId,
    color: variant.fColor,
    size: variant.fSize,
    price: finalPrice
  })

  toast.add({
    severity: 'success',
    summary: '規格更新成功',
    detail: `已成功變更為：${variant.fColor} / ${variant.fSize}`,
    life: 3000
  })

  // 關閉手風琴
  activeEditingItemId.value = null
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
        class="flex flex-col py-8 border-b border-gray-100 last:border-0"
      >
        <!-- 主體商品列 (改為內嵌包裹以利手風琴定位) -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <!-- 左側商品圖文 -->
          <div class="flex items-start gap-6 w-full sm:w-auto">
            <!-- 圖片容器 -->
            <div
              class="w-24 h-32 bg-[#f8f8f8] rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center"
            >
              <img
                :src="getImageUrl(item.image)"
                alt="商品圖片"
                class="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            <div class="flex flex-col justify-center pt-2">
              <h3 class="text-base font-bold text-gray-900 tracking-wide">{{ item.name }}</h3>

              <!-- 規格顯示 + 換規格提示 (手風琴按鈕) -->
              <div class="flex items-center gap-2 mt-1">
                <p class="text-gray-500 text-sm">{{ item.color }} / {{ item.size }}</p>
                <button
                  v-if="item.productId"
                  @click="toggleAccordion(item)"
                  class="px-2 py-0.5 text-[11px] text-gray-500 hover:text-black border border-gray-200 hover:border-black bg-white rounded-full transition-all flex items-center gap-1 font-medium shadow-sm"
                  title="原地變更商品顏色或尺寸"
                >
                  <i
                    :class="[
                      'pi text-[9px] transition-transform duration-300',
                      activeEditingItemId === item.id ? 'pi-times rotate-90 text-red-500' : 'pi-cog'
                    ]"
                  ></i>
                  {{ activeEditingItemId === item.id ? '收合' : '換規格' }}
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
              class="w-32 shadow-sm border border-gray-200 rounded-md overflow-hidden"
              inputClass="text-center flex-1 min-w-0 !border-0 font-bold px-1"
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

        <!-- 原地摺疊手風琴規格變更面板 -->
        <transition name="collapse">
          <div
            v-if="activeEditingItemId === item.id"
            class="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6"
          >
            <!-- 載入中狀態 -->
            <div v-if="isLoadingVariants" class="flex items-center justify-center py-4 gap-2 text-gray-400 text-sm">
              <i class="pi pi-spinner pi-spin"></i>
              <span>正在讀取最新規格資訊...</span>
            </div>

            <!-- 規格調整選單 -->
            <div v-else class="space-y-5 text-left text-sm">
              <!-- 顏色選擇 -->
              <div class="flex items-start gap-4">
                <span class="w-12 shrink-0 pt-1 text-gray-500 font-medium">顏色</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in availableColors"
                    :key="color"
                    @click="selectColor(color)"
                    :class="[
                      'px-3 py-1 border text-xs font-semibold tracking-wider rounded-lg transition-all',
                      tempSelectedColor === color
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    ]"
                  >
                    {{ color }}
                  </button>
                </div>
              </div>

              <!-- 尺寸選擇 -->
              <div class="flex items-start gap-4">
                <span class="w-12 shrink-0 pt-1 text-gray-500 font-medium">尺寸</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in availableSizes"
                    :key="size"
                    @click="tempSelectedSize = size"
                    :class="[
                      'w-12 py-1 border text-xs font-semibold tracking-wider rounded-lg transition-all',
                      tempSelectedSize === size
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    ]"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- 價格庫存資訊與確認列 -->
              <div class="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-4">
                <div class="flex items-center gap-6">
                  <div>
                    <span class="text-xs text-gray-400 block mb-0.5">單件售價</span>
                    <span class="text-base font-bold text-gray-900">
                      NT$ {{ tempSelectedVariantPrice.toLocaleString() }}
                    </span>
                  </div>
                  <div class="border-l border-gray-200 h-8"></div>
                  <div>
                    <span class="text-xs text-gray-400 block mb-0.5">目前庫存</span>
                    <span
                      :class="[
                        'text-sm font-semibold',
                        tempSelectedVariantStock > 0 ? 'text-gray-600' : 'text-red-500'
                      ]"
                    >
                      {{ tempSelectedVariantStock > 0 ? `${tempSelectedVariantStock} 件` : '已售完' }}
                    </span>
                  </div>
                </div>

                <!-- 操作按鈕 -->
                <div class="flex items-center gap-3">
                  <button
                    @click="activeEditingItemId = null"
                    class="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all"
                  >
                    取消
                  </button>
                  <button
                    @click="confirmVariantChange(item)"
                    :disabled="!tempSelectedVariant || tempSelectedVariantStock <= 0"
                    :class="[
                      'px-5 py-2 text-xs font-bold rounded-lg transition-all shadow-sm',
                      tempSelectedVariant && tempSelectedVariantStock > 0
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    ]"
                  >
                    確認變更
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
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

/* 手風琴折疊動畫 */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  max-height: 400px;
  opacity: 1;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}
</style>
