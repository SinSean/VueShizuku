<script setup>
import { ref } from 'vue'
import ProductSidebar from '@/components/ProductSidebar.vue'
// 假設你有一個商品卡片組件，如果沒有，等一下我們來寫
// import ProductCard from '@/components/ProductCard.vue' 

// 模擬從資料庫抓回來的商品列表
const products = ref([
  { id: 1, name: '日系透膚輕薄針織衫', price: 'NT$ 1,280', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { id: 2, name: '法式復古碎花無袖洋裝', price: 'NT$ 1,880', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800' },
  { id: 3, name: '簡約純棉V領休閒上衣', price: 'NT$ 890', img: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800' },
  { id: 4, name: '挺版牛津襯衫 (天藍色)', price: 'NT$ 1,580', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: '寬版連帽上衣 (墨綠色)', price: 'NT$ 1,880', img: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: '丹寧牛仔外套 (水洗藍)', price: 'NT$ 890', img: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=600&auto=format&fit=crop' },
  { id: 7, name: '日系透膚輕薄針織衫', price: 'NT$ 1,280', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { id: 8, name: '法式復古碎花無袖洋裝', price: 'NT$ 1,880', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800' },
  { id: 9, name: '簡約純棉V領休閒上衣', price: 'NT$ 890', img: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800' },
  { id: 10, name: '挺版牛津襯衫 (天藍色)', price: 'NT$ 1,580', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop' },
  { id: 11, name: '寬版連帽上衣 (墨綠色)', price: 'NT$ 1,880', img: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=600&auto=format&fit=crop' },
  { id: 12, name: '丹寧牛仔外套 (水洗藍)', price: 'NT$ 890', img: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=600&auto=format&fit=crop' },
])
</script>

<template>
  <div class="pt-24 min-h-screen bg-white">
    
    <!-- 標題區 -->
    <div class="max-w-[1400px] mx-auto px-4 py-12 text-center">
  <h1 class="text-3xl font-light tracking-[0.5em] uppercase mb-4">
    Shop All
  </h1>

  <div class="text-sm text-gray-400 uppercase tracking-widest">
    <RouterLink to="/" class="hover:text-black">Home</RouterLink>
    <span class="mx-2">/</span>
    <span class="text-black">All Products</span>
  </div>

</div>
<!-- 排序列 -->
    <div class="max-w-[1400px] mx-auto px-4 mb-8 flex justify-between items-center text-sm border-b pb-4">
         
      <span class="text-gray-500">顯示 {{ products.length }} 個項目</span>
      <select class="outline-none bg-transparent cursor-pointer">
        <option>最新上架</option>
        <option>價格低到高</option>
        <option>價格高到低</option>
      </select>
    </div>

    <!-- Sidebar + 商品區 ⭐最重要 -->
    <div class="max-w-[1400px] mx-auto px-4 pb-20 flex gap-16">
<ProductSidebar/>
   

    <div class="flex-1 min-w-0">
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
      
      <div v-for="product in products" :key="product.id" class="group cursor-pointer">
        
        <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
          <div class="absolute top-2 left-2 z-10 bg-black/40 text-white text-[10px] px-2 py-0.5 tracking-wider">
            new
          </div>

          <img :src="product.img" :alt="product.name"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <h3 class="text-sm font-medium text-gray-700 mb-1">
          {{ product.name }}
        </h3>

        <p class="text-sm text-gray-900 font-bold">
          {{ product.price }}
        </p>

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
  </div>

</template>