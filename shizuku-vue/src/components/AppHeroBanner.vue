<script setup>
// 匯入 Vue 的魔法盒子工具 'ref'，只要盒子裡的資料改變，畫面就會自動更新
import { ref } from 'vue'
// 匯入 PrimeVue 提供的輪播圖工具 (就像買了一台幻燈片放映機)
import Carousel from 'primevue/carousel'

/* ======= 核心邏輯區塊開始：準備海報資料清單 ======= */
// 建立一個叫做 banners 的魔法盒子，裡面裝著一個清單 (陣列 [])
// 清單裡面有三個物件 {}，每一個物件代表一張海報的資訊
const banners = ref([
  {
    id: 1, // 第一張海報的編號
    // 第一張海報的圖片網址
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    title: 'SUMMER SALE', // 大標題
    subtitle: '2026 春夏系列全新上市，全館五折起', // 副標題
    buttonText: '立即選購', // 按鈕文字
  },
  {
    id: 2, // 第二張海報的編號
    // 第二張海報的圖片網址 (我幫你挑了一張秋冬風格的衣服照片)
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
    title: 'AUTUMN ARRIVALS', // 大標題
    subtitle: '秋季新品預購中，會員享專屬折扣', // 副標題
    buttonText: '查看新品', // 按鈕文字
  },
  {
    id: 3, // 第三張海報的編號
    // 第三張海報的圖片網址 (我幫你挑了一張精緻配件的照片)
    image:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600&auto=format&fit=crop',
    title: 'LIMITED EDITION', // 大標題
    subtitle: '聯名限量款式，即將發售', // 副標題
    buttonText: '瞭解更多', // 按鈕文字
  },
])
/* ======= 核心邏輯區塊結束 ======= */
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-12 py-8">
    <Carousel :value="banners" :numVisible="1" :numScroll="1" circular :autoplayInterval="4000">
      <template #item="slotProps">
        <div class="px-2">
          <section class="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img :src="slotProps.data.image" class="w-full h-full object-cover" alt="Hero Banner" />

            <div
              class="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white"
            >
              <h1 class="text-6xl font-black mb-4 tracking-widest">{{ slotProps.data.title }}</h1>

              <p class="text-xl mb-8">{{ slotProps.data.subtitle }}</p>

              <Button :label="slotProps.data.buttonText" severity="contrast" size="large" rounded />
            </div>
          </section>
        </div>
      </template>
    </Carousel>
  </div>
</template>
