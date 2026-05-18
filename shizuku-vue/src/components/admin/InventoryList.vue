<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  inventory: { type: Array, default: () => [] },
})

const baseUrl = 'https://localhost:7197'
const defaultImg = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'
const keyword = ref('')
const expandedIds = ref(new Set())

const filteredInventory = computed(() => {
  if (!keyword.value) return props.inventory
  return props.inventory.filter(
    (p) => p.fProductName?.includes(keyword.value) || p.fProduct?.includes(keyword.value),
  )
})

function toggleExpand(id) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

function stockStatusClass(status) {
  if (status === '售完') return 'bg-red-50 text-red-500'
  if (status === '低庫存') return 'bg-amber-50 text-amber-500'
  return 'bg-green-50 text-green-600'
}

function profitRate(costPrice, price) {
  if (!costPrice || !price || price === 0) return null
  return Math.round(((price - costPrice) / price) * 100)
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium">庫存列表</h3>
      <input
        v-model="keyword"
        type="text"
        placeholder="搜尋商品名稱或貨號..."
        class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400 w-52"
      />
    </div>

    <table class="w-full text-xs">
      <thead>
        <tr class="bg-gray-50">
          <th
            class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100 w-8"
          ></th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            商品
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            總庫存
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            售價
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            狀態
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="product in filteredInventory" :key="product.fProductId">
          <!-- 商品主列 -->
          <tr
            class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            @click="toggleExpand(product.fProductId)"
          >
            <td class="px-3 py-3 text-gray-400">
              <i
                :class="
                  expandedIds.has(product.fProductId) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'
                "
                style="font-size: 11px"
              ></i>
            </td>
            <td class="px-3 py-3">
              <div class="flex items-center gap-3">
                <img
                  :src="product.fImage ? baseUrl + product.fImage : defaultImg"
                  class="w-10 h-10 object-cover rounded-lg border border-gray-100"
                />
                <div>
                  <p class="font-medium text-gray-700">{{ product.fProductName }}</p>
                  <p class="text-gray-400 mt-0.5 font-mono">{{ product.fProduct }}</p>
                </div>
              </div>
            </td>
            <td class="px-3 py-3 font-medium">{{ product.fTotalStock }} 件</td>
            <td class="px-3 py-3 text-gray-400">
              NT${{ product.fVariants?.[0]?.fPrice?.toLocaleString() }}
            </td>
            <td class="px-3 py-3">
              <span class="text-gray-400 text-xs"> {{ product.fVariants?.length }} 個規格 </span>
            </td>
          </tr>

          <!-- 規格子列 -->
          <template v-if="expandedIds.has(product.fProductId)">
            <tr
              v-for="variant in product.fVariants"
              :key="variant.fVariantId"
              class="border-b border-gray-50 bg-gray-50/50"
            >
              <td></td>
              <td class="px-3 py-2 pl-16">
                <span class="text-gray-500">{{ variant.fColor }} / {{ variant.fSize }}</span>
              </td>
              <td
                class="px-3 py-2"
                :class="
                  variant.fStock === 0
                    ? 'text-red-400 font-medium'
                    : variant.fStock <= 5
                      ? 'text-amber-500 font-medium'
                      : 'text-gray-600'
                "
              >
                {{ variant.fStock }} 件
              </td>
              <td class="px-3 py-2 text-gray-400">
                NT${{ variant.fPrice?.toLocaleString() }}
                <span v-if="variant.fCostPrice" class="ml-2 text-gray-300">
                  成本 NT${{ variant.fCostPrice?.toLocaleString() }}
                  <span
                    v-if="profitRate(variant.fCostPrice, variant.fPrice) !== null"
                    class="text-green-500 ml-1"
                  >
                    {{ profitRate(variant.fCostPrice, variant.fPrice) }}%
                  </span>
                </span>
              </td>
              <td class="px-3 py-2">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-xs',
                    stockStatusClass(variant.fStockStatus),
                  ]"
                >
                  {{ variant.fStockStatus }}
                </span>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
