<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { productApi } from '@/api/Product.js'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  categoryId: {
    type: Number,
    default: null,
  },
})

import { getImageUrl } from '@/utils/imageHelper'
const products = ref([])
const isLoading = ref(true)
const keyword = ref('')
const sortOrder = ref('latest')

const sortedProducts = computed(() => {
  const list = [...(products.value ?? [])]
  if (sortOrder.value === 'priceAsc') return list.sort((a, b) => a.fMinPrice - b.fMinPrice)
  if (sortOrder.value === 'priceDesc') return list.sort((a, b) => b.fMinPrice - a.fMinPrice)
  if (sortOrder.value === 'hot') return list.sort((a, b) => b.fId - a.fId)
  return list
})

//做分頁12/頁
const currentPage = ref(1)
const pageSize = 12

const totalCount = computed(() => sortedProducts.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedProducts.value.slice(start, start + pageSize)
})
// 排序或分類變更時回到第一頁
watch(sortOrder, () => {
  currentPage.value = 1
})
watch(
  () => props.categoryId,
  () => {
    currentPage.value = 1
  },
)
watch(
  () => route.query.categoryId,
  () => {
    currentPage.value = 1
  },
)

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 取得目前有效的分類 ID（props 優先，其次才是網址）
function getActiveCategoryId() {
  // props 有明確設定（包含 null）就用 props
  if (props.categoryId !== undefined) return props.categoryId

  const fromRoute = route.query.categoryId
  if (fromRoute) return Number(fromRoute)

  return null
}

async function fetchProducts() {
  try {
    isLoading.value = true
    const categoryId = getActiveCategoryId()
    const res = await productApi.getList(keyword.value, categoryId)
    products.value = res.data.data ?? []
  } catch (err) {
    console.error('商品載入失敗', err)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

// 監聽網址的 categoryId 變化
watch(
  () => route.query.categoryId,
  () => {
    fetchProducts()
  },
)

// 監聽網址的 keyword 變化
watch(
  () => route.query.keyword,
  (newVal) => {
    keyword.value = newVal || ''
    fetchProducts()
  },
)

// 監聽 props 的 categoryId 變化（Sidebar 點擊）
watch(
  () => props.categoryId,
  () => {
    fetchProducts()
  },
)

onMounted(() => {
  if (route.query.keyword) {
    keyword.value = route.query.keyword
  }
  fetchProducts()
})
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 py-14 text-center">
    <!-- 工具列：項目計數與排序 -->
    <div
      class="max-w-[1400px] mx-auto px-4 mb-8 flex justify-between items-center text-sm border-b pb-4"
    >
      <span class="text-gray-500">顯示 {{ sortedProducts.length }} 個項目</span>
      <select
        v-model="sortOrder"
        class="outline-none bg-transparent cursor-pointer text-sm border border-gray-200 rounded px-3 py-1.5"
      >
        <option value="latest">依最新項目排序</option>
        <option value="hot">依熱銷度</option>
        <option value="priceAsc">依價格排序：低至高</option>
        <option value="priceDesc">依價格排序：高至低</option>
      </select>
    </div>

    <!-- 載入狀態 -->
    <div v-if="isLoading" class="text-gray-400 py-20">載入中...</div>

    <!-- 商品列表區塊 -->
    <div v-else class="flex-1 min-w-0">
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        <div v-for="product in pagedProducts" :key="product.fId" class="group cursor-pointer">
          <RouterLink :to="'/product/' + product.fId">
            <!-- 商品圖片 -->
            <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
              <div
                class="absolute top-2 left-2 z-10 bg-black/40 text-white text-[10px] px-2 py-0.5 tracking-wider"
              >
                new
              </div>
              <img
                :src="getImageUrl(product.fImage)"
                :alt="product.fName"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <!-- 商品名稱 -->
            <h3 class="text-sm font-medium text-gray-700 mb-1">
              {{ product.fName }}
            </h3>

            <!-- 商品價格 -->
            <p class="text-sm text-gray-900 font-bold">
              NT$ {{ (product.fMinPrice ?? product.fPrice).toLocaleString() }}
            </p>
          </RouterLink>

          <!-- 操作按鈕 -->
          <button
            @click="$router.push('/product/' + product.fId)"
            class="mt-3 w-full border border-gray-200 py-1.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="text-xs font-bold">查看商品</span>
          </button>
        </div>
      </div>
    </div>
    <!-- 分頁列 -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-16">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ‹
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
            'w-9 h-9 flex items-center justify-center border text-sm transition-colors',
            currentPage === page
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <span
          v-else-if="page === currentPage - 2 || page === currentPage + 2"
          class="text-gray-300 text-sm"
          >...</span
        >
      </template>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </div>

    <!-- 顯示目前頁數 -->
    <p class="text-xs text-gray-400 text-center mt-4">
      第 {{ currentPage }} 頁，共 {{ totalPages }} 頁（{{ totalCount }} 件商品）
    </p>
  </div>
</template>
