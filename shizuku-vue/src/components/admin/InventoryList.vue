<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  inventory: { type: Array, default: () => [] },
})
const selectedStatus = ref('')

const baseUrl = 'https://localhost:7197'
const defaultImg = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'
const keyword = ref('')
const expandedIds = ref(new Set())

const filteredInventory = computed(() => {
  let result = props.inventory

  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.fProductName?.toLowerCase().includes(kw) || // ← 轉小寫比較
        p.fProduct?.toLowerCase().includes(kw),
    )
  }

  if (selectedStatus.value) {
    result = result.filter((p) => p.fVariants?.some((v) => v.fStockStatus === selectedStatus.value))
  }

  return result
})
const currentPage = ref(1)
const pageSize = ref(10)

const totalCount = computed(() => filteredInventory.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

const pagedInventory = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredInventory.value.slice(start, start + pageSize.value)
})

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 切換每頁筆數時回到第一頁
watch(pageSize, () => {
  currentPage.value = 1
})

// 搜尋時回到第一頁
watch(keyword, () => {
  currentPage.value = 1
})

watch(
  () => props.inventory,
  (newVal) => {
    newVal.forEach((p) => expandedIds.value.add(p.fProductId))
  },
  { immediate: true },
)

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
  if (status === '未設規格') return 'bg-gray-100 text-gray-400'
  return 'bg-green-50 text-green-600'
}

function profitRate(costPrice, price) {
  if (!costPrice || !price || price === 0) return null
  return Math.round(((price - costPrice) / price) * 100)
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <!-- 標題列 -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-base font-medium">庫存列表</h3>
        <p class="text-sm text-gray-400 mt-0.5">共 {{ totalCount }} 筆商品</p>
      </div>
    </div>

    <!-- 搜尋列 -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="relative">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋商品名稱、貨號..."
          class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
        />
      </div>
      <div class="relative">
        <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <select
          v-model="selectedStatus"
          class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white"
        >
          <option value="">全部狀態</option>
          <option value="正常">正常</option>
          <option value="低庫存">低庫存</option>
          <option value="售完">售完</option>
          <option value="未設規格">未設規格</option>
        </select>
      </div>
    </div>

    <!-- 表格 -->
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-gray-50">
          <th
            class="px-3 py-2.5 text-left text-gray-500 font-medium border-b border-gray-100 w-8"
          ></th>
          <th class="px-3 py-2.5 text-left text-gray-500 font-medium border-b border-gray-100">
            商品
          </th>
          <th class="px-3 py-2.5 text-left text-gray-500 font-medium border-b border-gray-100">
            總庫存
          </th>
          <th class="px-3 py-2.5 text-left text-gray-500 font-medium border-b border-gray-100">
            售價
          </th>
          <th class="px-3 py-2.5 text-left text-gray-500 font-medium border-b border-gray-100">
            狀態
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="product in pagedInventory" :key="product.fProductId">
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
                  <p class="text-gray-400 mt-0.5 font-mono text-xs">{{ product.fProduct }}</p>
                </div>
              </div>
            </td>
            <td class="px-3 py-3 font-medium">{{ product.fTotalStock }} 件</td>
            <td class="px-3 py-3 text-gray-400">
              NT${{ product.fVariants?.[0]?.fPrice?.toLocaleString() }}
            </td>
            <td class="px-3 py-3">
              <span
                v-if="!product.fVariants?.length"
                class="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-400"
              >
                未設規格
              </span>
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
                <span v-if="variant.fCostPrice" class="ml-2 text-gray-300 text-xs">
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

    <!-- 分頁列 -->
    <div class="flex items-center justify-between px-3 py-3 border-t border-gray-100 mt-2">
      <span class="text-sm text-gray-400"> 共 {{ totalCount }} 筆，共 {{ totalPages }} 頁 </span>
      <div class="flex items-center gap-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <i class="pi pi-chevron-left" style="font-size: 10px"></i>
        </button>
        <template v-for="page in totalPages" :key="page">
          <button
            v-if="
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            "
            @click="changePage(page)"
            :class="[
              'px-2.5 py-1 text-xs border rounded transition-colors',
              currentPage === page
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <span
            v-else-if="page === currentPage - 2 || page === currentPage + 2"
            class="text-xs text-gray-300"
            >...</span
          >
        </template>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <i class="pi pi-chevron-right" style="font-size: 10px"></i>
        </button>
        <select
          v-model="pageSize"
          class="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-indigo-400 bg-white ml-2"
        >
          <option :value="10">10 筆/頁</option>
          <option :value="20">20 筆/頁</option>
          <option :value="50">50 筆/頁</option>
        </select>
      </div>
    </div>
  </div>
</template>
