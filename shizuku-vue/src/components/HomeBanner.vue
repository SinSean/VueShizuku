<template>
  <div class="max-w-6xl mx-auto px-4 lg:px-8 py-6">
  
  <swiper
    :modules="modules"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 5000 }"
    class="overflow-hidden shadow-sm h-[300px] md:h-[450px] lg:h-[500px]"
  >
    <swiper-slide v-for="banner in banners" :key="banner.id">
      <div class="relative w-full h-full group">
        <img 
          :src="banner.image" 
          class="w-full h-full object-cover " 
          :alt="banner.title" 
        />
        
        <div class="absolute inset-0 bg-black/5 flex items-center justify-center">
          <h2 class="text-white text-3xl md:text-5xl font-light tracking-[0.2em] italic drop-shadow-md">
            {{ banner.title }}
          </h2>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</div>
</template>

<script setup>
// 確保你是從 /vue 引入組件
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// 引入樣式
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// 定義模組
const modules = [Autoplay, Pagination, Navigation];

const banners = [
  { id: 1, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070', title: '春季新品上市' },
  { id: 2, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070', title: '日系選物專區' },
];
</script>