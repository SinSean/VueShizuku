<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '@/api/Product.js'
import Menu from 'primevue/menu'

const menu = ref()
const router = useRouter()
const keyword = ref('')
const allProducts = ref([])
const isLoading = ref(false)

const baseUrl = 'https://localhost:7197'
const defaultImg = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'

const fetchProducts = async () => {
  try {
    isLoading.value = true
    const res = await productApi.getList('', null)
    allProducts.value = res.data?.data ?? []
  } catch (err) {
    console.error('載入搜尋商品失敗', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

const toggle = (event) => {
  menu.value.toggle(event)
  // 每次打開時若商品列表為空則重試載入
  if (allProducts.value.length === 0) {
    fetchProducts()
  }
}

// 模糊搜尋與推薦列表
const filteredProducts = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) {
    // 輸入為空時，預設推薦前 3 筆商品
    return allProducts.value.slice(0, 3)
  }
  return allProducts.value.filter((p) => 
    p.fName && p.fName.toLowerCase().includes(kw)
  )
})

const goToProduct = (id) => {
  router.push({ name: 'product-detail', params: { id } })
  menu.value.hide()
  keyword.value = '' // 跳轉後清空搜尋關鍵字
}
</script>

<template>
  <div class="inline-block">
    <!-- 搜尋放大鏡觸發按鈕 -->
    <button class="flex items-center gap-1 hover:text-gray-400 transition-colors cursor-pointer" @click="toggle">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </button>

    <!-- 搜尋下拉面板 -->
    <Menu
      ref="menu"
      id="search_menu"
      :model="filteredProducts"
      :popup="true"
      class="w-80 p-2 !bg-white !border !border-gray-200 !shadow-xl"
    >
      <!-- 上方搜尋輸入框區塊 -->
      <template #start>
        <div class="p-2 border-b border-gray-100">
          <div class="relative flex items-center">
            <svg class="absolute left-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              v-model="keyword"
              type="text"
              placeholder="搜尋商品..."
              class="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              @click.stop
            />
            <!-- 清除按鈕 -->
            <button
              v-if="keyword"
              @click.stop="keyword = ''"
              class="absolute right-2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 列表小標題 -->
        <div class="px-3 pt-3 pb-1 text-xs font-semibold text-gray-400 tracking-wider">
          {{ keyword ? '搜尋結果' : '推薦商品' }}
        </div>
      </template>

      <!-- 商品項目樣式 -->
      <template #item="{ item }">
        <div
          @click="goToProduct(item.fId)"
          class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors group cursor-pointer"
        >
          <!-- 商品縮圖 -->
          <img
            :src="item.fImage ? baseUrl + item.fImage : defaultImg"
            alt="商品縮圖"
            class="w-12 h-12 object-cover rounded flex-shrink-0"
          />

          <!-- 商品資訊 -->
          <div class="flex flex-col flex-1 min-w-0">
            <span class="text-sm font-bold text-gray-800 truncate group-hover:text-amber-600 transition-colors">
              {{ item.fName }}
            </span>
            <span class="text-xs font-bold text-gray-500 mt-1">
              NT$ {{ (item.fMinPrice ?? item.fPrice).toLocaleString() }}
            </span>
          </div>
        </div>
      </template>

      <!-- 下方載入中或無搜尋結果提示 -->
      <template #end>
        <div v-if="isLoading" class="p-4 text-center text-sm text-gray-400">
          載入商品中...
        </div>
        <div v-else-if="keyword && filteredProducts.length === 0" class="p-6 text-center text-sm text-gray-400">
          <svg class="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          找不到符合的商品
        </div>
      </template>
    </Menu>
  </div>
</template>
