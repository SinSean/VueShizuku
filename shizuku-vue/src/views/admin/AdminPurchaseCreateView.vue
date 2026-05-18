<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '@/api/Product.js'

const router = useRouter()

const inventory = ref([])
const isLoading = ref(true)

const purchaseForm = ref({
  fSupplier: '台灣成衣有限公司',
  fPaymentMethod: '月結30天',
  fNote: '',
})

const suppliers = ['台灣成衣有限公司', '日系服飾批發商', '韓國流行服飾', '歐美品牌代理商', '其他']

const paymentMethods = ['月結30天', '月結60天', '貨到付款', '預付款', '現金']

const purchaseSearch = ref('')
const cartItems = ref({})

const searchResults = computed(() => {
  const results = []
  inventory.value.forEach((p) => {
    ;(p.fVariants ?? []).forEach((v) => {
      const match =
        !purchaseSearch.value ||
        p.fProductName?.includes(purchaseSearch.value) ||
        p.fProduct?.includes(purchaseSearch.value)
      if (match) results.push({ product: p, variant: v })
    })
  })
  return results
})

function isInCart(variantId) {
  return !!cartItems.value[variantId]
}

const isAllChecked = computed(
  () =>
    searchResults.value.length > 0 &&
    searchResults.value.every((item) => isInCart(item.variant.fVariantId)),
)

function toggleVariant(item) {
  const id = item.variant.fVariantId
  if (cartItems.value[id]) {
    delete cartItems.value[id]
  } else {
    cartItems.value[id] = {
      fQuantity: 1,
      fCostPrice: null,
      fProductName: item.product.fProductName,
      fColor: item.variant.fColor,
      fSize: item.variant.fSize,
      fStock: item.variant.fStock,
    }
  }
}

function toggleAll(checked) {
  if (checked) {
    searchResults.value.forEach((item) => {
      const id = item.variant.fVariantId
      if (!cartItems.value[id]) {
        cartItems.value[id] = {
          fQuantity: 1,
          fCostPrice: null,
          fProductName: item.product.fProductName,
          fColor: item.variant.fColor,
          fSize: item.variant.fSize,
          fStock: item.variant.fStock,
        }
      }
    })
  } else {
    searchResults.value.forEach((item) => {
      delete cartItems.value[item.variant.fVariantId]
    })
  }
}

function removeFromCart(variantId) {
  delete cartItems.value[variantId]
}

const cartList = computed(() =>
  Object.entries(cartItems.value).map(([id, item]) => ({
    fVariantId: Number(id),
    ...item,
  })),
)

const cartCount = computed(() => cartList.value.length)
const cartTotalQty = computed(() =>
  cartList.value.reduce((a, v) => a + (Number(v.fQuantity) || 0), 0),
)
const cartTotalAmount = computed(() =>
  cartList.value.reduce((a, v) => a + (Number(v.fQuantity) || 0) * (Number(v.fCostPrice) || 0), 0),
)

function subTotal(item) {
  return (Number(item.fQuantity) || 0) * (Number(item.fCostPrice) || 0)
}

async function submit() {
  if (cartCount.value === 0) {
    alert('請至少勾選一筆商品')
    return
  }

  const details = cartList.value.map((v) => ({
    fVariantId: v.fVariantId,
    fQuantity: Number(v.fQuantity) || 0,
    fCostPrice: v.fCostPrice ? Number(v.fCostPrice) : null,
  }))

  if (details.some((d) => d.fQuantity <= 0)) {
    alert('請填寫所有勾選商品的進貨數量')
    return
  }

  const confirmed = confirm(
    `確認進貨？\n\n` +
      `廠商：${purchaseForm.value.fSupplier}\n` +
      `共 ${cartCount.value} 筆商品，總數量 ${cartTotalQty.value} 件\n` +
      `合計金額：NT$${cartTotalAmount.value.toLocaleString()}\n\n` +
      `確認後庫存將自動更新，無法撤銷。`,
  )
  if (!confirmed) return

  try {
    await productApi.createPurchaseOrder({
      fSupplier: purchaseForm.value.fSupplier,
      fPaymentMethod: purchaseForm.value.fPaymentMethod,
      fNote: purchaseForm.value.fNote,
      fDetails: details,
    })
    router.push({ name: 'admin-inventory' })
  } catch (err) {
    console.error('進貨失敗', err)
    alert('進貨失敗，請再試一次')
  }
}

onMounted(async () => {
  try {
    const res = await productApi.getInventory()
    inventory.value = res.data.data ?? []
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="p-6 flex flex-col" style="height: calc(100vh - 60px)">
    <!-- 標題列 -->
    <div class="flex items-center gap-3 mb-4 shrink-0">
      <button
        @click="router.push({ name: 'admin-inventory' })"
        class="text-gray-400 hover:text-gray-600"
      >
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1 class="text-xl font-medium">新增進貨單</h1>
      <span class="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
        單號自動生成
      </span>
    </div>

    <!-- 廠商資訊 -->
    <div
      class="grid grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-gray-100 mb-4 shrink-0"
    >
      <div>
        <label class="text-xs text-gray-400 mb-1 block">廠商</label>
        <select
          v-model="purchaseForm.fSupplier"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white"
        >
          <option v-for="s in suppliers" :key="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <label class="text-xs text-gray-400 mb-1 block">付款方式</label>
        <select
          v-model="purchaseForm.fPaymentMethod"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white"
        >
          <option v-for="m in paymentMethods" :key="m">{{ m }}</option>
        </select>
      </div>
      <div class="col-span-2">
        <label class="text-xs text-gray-400 mb-1 block">備註</label>
        <input
          v-model="purchaseForm.fNote"
          type="text"
          placeholder="選填"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
        />
      </div>
    </div>

    <!-- 左右分欄 -->
    <div class="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
      <!-- 左側：商品挑選 -->
      <div class="bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <span class="text-sm font-medium">商品挑選</span>
          <span class="text-xs text-gray-400">點擊列加入右側</span>
        </div>
        <div class="px-4 py-2 border-b border-gray-100 shrink-0">
          <input
            v-model="purchaseSearch"
            type="text"
            placeholder="搜尋商品名稱或貨號..."
            class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div class="overflow-y-auto flex-1">
          <table class="w-full text-xs">
            <thead class="sticky top-0">
              <tr class="bg-gray-50">
                <th class="px-3 py-2 border-b border-gray-100 w-8">
                  <input
                    type="checkbox"
                    :checked="isAllChecked"
                    @change="(e) => toggleAll(e.target.checked)"
                    aria-label="全選"
                  />
                </th>
                <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                  商品規格
                </th>
                <th
                  class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100 w-16"
                >
                  庫存
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="3" class="text-center py-8 text-gray-300">載入中...</td>
              </tr>
              <tr
                v-for="item in searchResults"
                :key="item.variant.fVariantId"
                :class="[
                  'border-b border-gray-50 last:border-0 cursor-pointer',
                  isInCart(item.variant.fVariantId) ? 'bg-indigo-50/50' : 'hover:bg-gray-50',
                ]"
                @click="toggleVariant(item)"
              >
                <td class="px-3 py-2.5" @click.stop>
                  <input
                    type="checkbox"
                    :checked="isInCart(item.variant.fVariantId)"
                    @change="toggleVariant(item)"
                    aria-label="勾選商品"
                  />
                </td>
                <td class="px-3 py-2.5">
                  <p class="font-medium text-gray-700">{{ item.product.fProductName }}</p>
                  <p class="text-gray-400 mt-0.5">
                    {{ item.variant.fColor }} / {{ item.variant.fSize }}
                  </p>
                </td>
                <td
                  class="px-3 py-2.5 font-medium"
                  :class="
                    item.variant.fStock === 0
                      ? 'text-red-400'
                      : item.variant.fStock <= 5
                        ? 'text-amber-500'
                        : 'text-gray-500'
                  "
                >
                  {{ item.variant.fStock }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 右側：已選商品 -->
      <div class="bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <span class="text-sm font-medium">已選商品</span>
          <span class="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            {{ cartCount }} 筆
          </span>
        </div>
        <div class="overflow-y-auto flex-1">
          <div
            v-if="cartCount === 0"
            class="flex items-center justify-center h-full text-gray-300 text-sm"
          >
            請從左側勾選商品
          </div>
          <div
            v-for="item in cartList"
            :key="item.fVariantId"
            class="px-4 py-3 border-b border-gray-50 last:border-0"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <p class="font-medium text-gray-700 text-sm">{{ item.fProductName }}</p>
                <p class="text-gray-400 text-xs mt-0.5">
                  {{ item.fColor }} / {{ item.fSize }}
                  <span class="ml-2 text-gray-300">目前庫存：{{ item.fStock }} 件</span>
                </p>
                <div class="flex items-center gap-2 mt-2 flex-wrap">
                  <span class="text-xs text-gray-400">數量</span>
                  <input
                    v-model="cartItems[item.fVariantId].fQuantity"
                    type="number"
                    min="1"
                    class="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-xs focus:outline-none focus:border-indigo-400"
                  />
                  <span class="text-xs text-gray-400">成本（NT$）</span>
                  <input
                    v-model="cartItems[item.fVariantId].fCostPrice"
                    type="number"
                    min="0"
                    placeholder="選填"
                    class="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-right text-xs focus:outline-none focus:border-indigo-400"
                  />
                  <span class="text-xs font-medium text-indigo-600">
                    = NT${{ subTotal(cartItems[item.fVariantId]).toLocaleString() }}
                  </span>
                </div>
              </div>
              <button
                @click="removeFromCart(item.fVariantId)"
                class="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                aria-label="移除"
              >
                <i class="pi pi-times" style="font-size: 12px"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 右側底部合計 -->
        <div class="px-4 py-3 bg-gray-50 border-t border-gray-100 shrink-0">
          <div class="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span
              >總數量：<strong class="text-gray-700">{{ cartTotalQty }} 件</strong></span
            >
            <span
              >合計金額：<strong class="text-indigo-600 text-base"
                >NT${{ cartTotalAmount.toLocaleString() }}</strong
              ></span
            >
          </div>
          <div class="flex gap-2">
            <button
              @click="router.push({ name: 'admin-inventory' })"
              class="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              @click="submit"
              class="flex-1 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              確認進貨
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
