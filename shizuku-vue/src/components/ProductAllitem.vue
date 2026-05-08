<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { productApi } from '@/api/Product.js'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
    categoryId: {
        type: Number,
        default: null
    }
})

const products  = ref([])
const isLoading = ref(true)
const keyword   = ref('')
const defaultImg = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'
const sortOrder = ref('latest')

const sortedProducts = computed(() => {
    const list = [...(products.value ?? [])]
    if (sortOrder.value === 'priceAsc')  return list.sort((a, b) => a.fPrice - b.fPrice)
    if (sortOrder.value === 'priceDesc') return list.sort((a, b) => b.fPrice - a.fPrice)
    if (sortOrder.value === 'hot')       return list.sort((a, b) => b.fId - a.fId)
    return list
})

// ✨ 取得目前有效的分類 ID（網址優先，其次 props）
function getActiveCategoryId() {
    const fromRoute = route.query.categoryId
    if (fromRoute) return Number(fromRoute)
    return props.categoryId ?? null
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
watch(() => route.query.categoryId, () => {
    fetchProducts()
})

// 監聽 props 的 categoryId 變化（Sidebar 點擊）
watch(() => props.categoryId, () => {
    fetchProducts()
})

onMounted(() => {
    fetchProducts()
})
</script>

<template>
    <div class="max-w-[1400px] mx-auto px-4 py-14 text-center">

     <div class="max-w-[1400px] mx-auto px-4 mb-8 flex justify-between items-center text-sm border-b pb-4">
    <span class="text-gray-500">顯示 {{ sortedProducts.length }} 個項目</span>
    <select v-model="sortOrder"
            class="outline-none bg-transparent cursor-pointer text-sm border border-gray-200 rounded px-3 py-1.5">
        <option value="latest">依最新項目排序</option>
        <option value="hot">依熱銷度</option>
        <option value="priceAsc">依價格排序：低至高</option>
        <option value="priceDesc">依價格排序：高至低</option>
    </select>
</div>

        <div v-if="isLoading" class="text-gray-400 py-20">
            載入中...
        </div>

        <div v-else class="flex-1 min-w-0">
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">

                <div v-for="product in  sortedProducts" :key="product.fId"
                     class="group cursor-pointer">
                    <RouterLink :to="'/product/' + product.fId">

                        <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                            <div class="absolute top-2 left-2 z-10 bg-black/40 text-white text-[10px] px-2 py-0.5 tracking-wider">
                                new
                            </div>
                            <img :src="product.fImage || defaultImg"
                                 :alt="product.fName"
                                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>

                        <h3 class="text-sm font-medium text-gray-700 mb-1">
                            {{ product.fName }}
                        </h3>

                        <p class="text-sm text-gray-900 font-bold">
                            NT$ {{ product.fPrice.toLocaleString() }}
                        </p>

                    </RouterLink>

                    <button class="mt-3 w-full border border-gray-200 py-1.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span class="text-xs font-bold">加入購物車</span>
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>