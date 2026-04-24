<script setup>
import { ref } from 'vue'
// 建立一個叫做 products 的資料盒子，裡面裝著一個清單 (陣列 [])
const products = ref([
  {
    id: 1,
    // 商品名稱
    name: '極簡風純棉短T',
    // 優惠價格
    price: 790,
    // 原本價格
    originalPrice: 990,
    // 商品圖片網址 (我幫你挑了服飾相關的圖片)
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    // 標籤文字 (顯示在左上角的小圓角標籤)
    tag: 'HOT',
  },
  {
    // 第二件商品...
    id: 2,
    name: '日系落肩長袖襯衫',
    price: 1280,
    originalPrice: 1580,
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    tag: 'NEW',
  },
  {
    // 第三件商品...
    id: 3,
    name: '經典直筒牛仔褲',
    price: 1450,
    originalPrice: 1800,
    image:
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=800&auto=format&fit=crop',
    tag: '', // 這件沒有標籤，留空
  },
  {
    // 第四件商品...
    id: 4,
    name: '輕量防風連帽外套',
    price: 2100,
    originalPrice: 2800,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    tag: 'SALE',
  },
])
</script>

<template>
  <section class="max-w-7xl mx-auto py-16 px-4 md:px-12">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-black text-gray-900 tracking-wider mb-2">HOT ARRIVALS</h2>
      <p class="text-gray-500">熱賣暢銷單品</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="product in products" :key="product.id" class="group cursor-pointer">
        <div class="relative rounded-xl overflow-hidden mb-4">
          <img
            :src="product.image"
            class="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-110"
            alt="商品圖片"
          />

          <span
            v-if="product.tag"
            class="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-sm tracking-widest"
          >
            {{ product.tag }}
          </span>
        </div>

        <h3 class="font-bold text-gray-800 text-lg">{{ product.name }}</h3>

        <div class="flex gap-2 items-center mt-1 mb-4">
          <span class="text-red-600 font-bold">NT$ {{ product.price }}</span>
          <span class="text-gray-400 line-through text-sm">NT$ {{ product.originalPrice }}</span>
        </div>

        <Button label="加入購物車" outlined severity="contrast" class="w-full font-bold" />
      </div>
    </div>
  </section>
</template>
