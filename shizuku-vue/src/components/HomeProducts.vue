<template>
  <section class="max-w-6xl mx-auto px-6 py-20">
    <div class="text-center mb-16">
      <h2 class="text-2xl tracking-[0.3em] text-gray-800 uppercase font-light">New Arrivals</h2>
      <p class="text-gray-400 text-xs mt-3 italic">最新上架單品</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      <div v-for="item in products" :key="item.id" class="group cursor-pointer">
        <div class="relative overflow-hidden mb-4 bg-gray-50 aspect-[3/4]">
          <img :src="item.image" :alt="item.name"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div
            class="absolute bottom-0 left-0 w-full bg-white/90 text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span class="text-xs tracking-widest text-gray-800">快速預覽</span>
          </div>
        </div>
        <div class="text-center mt-4">
          <h3 class="text-sm text-gray-600 mb-2 tracking-wide">{{ item.name }}</h3>
          <p class="text-sm font-medium text-gray-900">{{ item.price }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// 商品資料跟邏輯全包在這裡
const products = [
  { id: 1, name: '日系透膚輕薄針織衫', price: 'NT$ 1,280', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { id: 2, name: '高腰顯瘦垂墜寬褲', price: 'NT$ 1,580', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800' },
  { id: 3, name: '法式復古碎花無袖洋裝', price: 'NT$ 1,880', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800' },
  { id: 4, name: '簡約純棉V領休閒上衣', price: 'NT$ 890', image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800' },
  { id: 5, name: '日系透膚輕薄針織衫', price: 'NT$ 1,280', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { id: 6, name: '高腰顯瘦垂墜寬褲', price: 'NT$ 1,580', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800' },
  { id: 7, name: '法式復古碎花無袖洋裝', price: 'NT$ 1,880', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800' },
  { id: 8, name: '簡約純棉V領休閒上衣', price: 'NT$ 890', image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800' },
];
</script>