<script setup>
// import ProductCard from '@/components/ProductCard.vue';
import AppHeroBanner from '@/components/AppHeroBanner.vue';
import ProductCard from '@/components/ProductCard.vue';
// 準備 4 個假商品資料來填滿橫排
const products = [
  { id: 1, name: '日系質感長裙', price: 'NT$ 1,280', date: '4/22 NEW', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { id: 2, name: '透膚針織上衣', price: 'NT$ 890', date: '4/22 NEW', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { id: 3, name: '工裝百褶裙', price: 'NT$ 1,500', date: '4/22 NEW', image: 'https://images.unsplash.com/photo-1572804013307-a9a111dd83b8?q=80&w=800' },
  { id: 4, name: '復古皮革小包', price: 'NT$ 2,100', date: '4/22 NEW', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' },
  { id: 5, name: 'Minimalist Cotton Shirt', price: 'NT$ 1,200', date: '4/22 NEW', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=800' },
  // 新增第 6 個：這張是寬褲類，湊滿兩排共 6 個
  { id: 6, name: 'Pleated Wide Trousers', price: 'NT$ 1,980', date: '4/22 NEW', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800' }
  
]
</script>

<template>
  <div class="min-h-[600px] relative z-10">
    <AppHeroBanner />
    </div>

  <div class="max-w-7xl mx-auto px-4 md:px-12 py-20 pb-32">
    
    <div class="text-center mb-16">
      <h2 class="text-3xl tracking-[0.4em] font-light uppercase text-gray-800">New Arrival</h2>
      <p class="text-gray-400 text-xs mt-3 italic">Exploring the new aesthetics</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
      <ProductCard 
        v-for="n in 6" 
        :key="n" 
        :product="products[0]" 
      />
    </div>

  </div>
</template>
