<script setup>
import { ref, onMounted } from 'vue'
import { getTopProductsAPI } from '@/api/order.js'
import { getImageUrl } from '@/utils/imageHelper'

// 預設靜態商品資料 (作為 API 讀取中、無數據或讀取失敗時的備用資料)
const fallbackProducts = [
  { productId: 1, productName: '日系透膚輕薄針織衫', price: 1280, imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { productId: 2, productName: '高腰顯瘦垂墜寬褲', price: 1580, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800' },
  { productId: 3, productName: '法式復古碎花無袖洋裝', price: 1880, imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800' },
  { productId: 4, productName: '簡約純棉V領休閒上衣', price: 890, imageUrl: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800' },
  { productId: 5, productName: '落肩純棉短T (淺米色)', price: 1280, imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop' },
  { productId: 6, productName: '挺版牛津襯衫 (天藍色)', price: 1580, imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop' },
  { productId: 7, productName: '寬版連帽上衣 (墨綠色)', price: 1880, imageUrl: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=600&auto=format&fit=crop' },
  { productId: 8, productName: '丹寧牛仔外套 (水洗藍)', price: 890, imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=600&auto=format&fit=crop' },
]

const products = ref([])
const isLoading = ref(true)

const fetchTopProducts = async () => {
  try {
    isLoading.value = true
    const res = await getTopProductsAPI()
    if (res.success && res.data && res.data.length > 0) {
      products.value = res.data
    } else {
      products.value = fallbackProducts
    }
  } catch (error) {
    console.error('取得熱銷商品失敗:', error)
    products.value = fallbackProducts
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTopProducts()
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-6 py-20">
    <div class="text-center mb-16">
      <h2 class="text-2xl tracking-[0.3em] text-gray-800 uppercase font-light">Best Sellers</h2>
      <p class="text-gray-400 text-xs mt-3 italic">熱銷排行單品</p>
    </div>

    <!-- 載入中骨架畫面 (Skeleton) -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      <div v-for="n in 8" :key="n" class="animate-pulse">
        <div class="bg-gray-200 aspect-[3/4] mb-4 rounded"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      <RouterLink
        v-for="item in products"
        :key="item.productId"
        :to="'/product/' + item.productId"
        class="group cursor-pointer block"
      >
        <div class="relative overflow-hidden mb-4 bg-gray-50 aspect-[3/4]">
          <img
            :src="getImageUrl(item.imageUrl)"
            :alt="item.productName"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            class="absolute bottom-0 left-0 w-full bg-white/90 text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <span class="text-xs tracking-widest text-gray-800 font-medium">查看商品詳情</span>
          </div>
        </div>
        <div class="text-center mt-4">
          <h3 class="text-sm text-gray-600 mb-2 tracking-wide truncate px-2">{{ item.productName }}</h3>
          <p class="text-sm font-semibold text-gray-900">NT$ {{ Number(item.price).toLocaleString() }}</p>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
