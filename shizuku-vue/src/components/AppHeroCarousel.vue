<template>   <!-- 首頁輪播圖 -->
    <section class="relative w-full h-[450px] md:h-[650px] bg-gray-950 overflow-hidden group">

        <div class="relative w-full h-full">
            <Transition mode="out-in" name="fade">
                <div :key="currentIndex" class="absolute inset-0">
                    <img :src="banners[currentIndex].fImage" :alt="banners[currentIndex].fTitle"
                        class="w-full h-full object-cover object-center scale-105" />
                    <div class="absolute inset-0 bg-gray-950/40"></div>

                    <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                        <span class="text-base font-semibold text-sky-300 uppercase tracking-widest">{{
                            banners[currentIndex].fSubtitle }}</span>
                        <h1 class="text-5xl md:text-7xl font-extrabold text-white mt-4 tracking-tighter">{{
                            banners[currentIndex].fTitle }}</h1>
                        <p class="text-xl text-gray-100 mt-6 max-w-xl font-light">{{ banners[currentIndex].fDescription
                        }}</p>
                        <div class="mt-12 flex gap-4">
                            <button
                                class="border border-white bg-transparent text-white px-8 py-3 text-sm hover:bg-white hover:text-black transition-colors duration-300">立即選購</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>

        <button @click="prevSlide"
            class="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-4 rounded-full text-white hover:bg-white/30 transition-all z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <button @click="nextSlide"
            class="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-4 rounded-full text-white hover:bg-white/30 transition-all z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            <button v-for="(banner, index) in banners" :key="banner.fId" @click="currentIndex = index"
                :class="['w-3 h-3 rounded-full transition-all duration-300', index === currentIndex ? 'bg-white w-8' : 'bg-white/40']"></button>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentIndex = ref(0);
let timer = null;

const banners = ref([
    //https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop
    // { fId: 101, fSubtitle: '2024 春夏系列', fTitle: '煥然一新：探索極簡主義時尚', fDescription: '本季精選天然材質，打造舒適與風格兼具的日常穿搭。', fImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop' },
    // { fId: 102, fSubtitle: '限時特賣', fTitle: '週年慶典：精選商品 7 折起', fDescription: '僅此三天！快來搶購你心儀已久的時尚單品。', fImage: 'https://images.unsplash.com/photo-1441996643126-505809ce132c?q=80&w=1600&auto=format&fit=crop' },
    // { fId: 103, fSubtitle: '機能工裝', fTitle: '穿梭都市：全新機能系列上架', fDescription: '防潑水材質與多口袋設計，滿足你對探索的渴望。', fImage: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?q=80&w=1600&auto=format&fit=crop' }

    { fId: 101, fSubtitle: '2024 春夏系列', fTitle: '煥然一新：探索極簡主義時尚', fDescription: '本季精選天然材質，打造舒適與風格兼具的日常穿搭。', fImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' },
    { fId: 102, fSubtitle: '限時特賣', fTitle: '週年慶典：精選商品 7 折起', fDescription: '僅此三天！快來搶購你心儀已久的時尚單品。', fImage: 'https://images.unsplash.com/photo-1441996643126-505809ce132c?q=80&w=1600&auto=format&fit=crop' },
    { fId: 103, fSubtitle: '機能工裝', fTitle: '穿梭都市：全新機能系列上架', fDescription: '防潑水材質與多口袋設計，滿足你對探索的渴望。', fImage: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?q=80&w=1600&auto=format&fit=crop' }
]);

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % banners.value.length;
};

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + banners.value.length) % banners.value.length;
};

// 自動播放邏輯
onMounted(() => {
    timer = setInterval(nextSlide, 5000); // 每 5 秒切換一次
});

onUnmounted(() => {
    clearInterval(timer); // 組件銷毀時清除定時器，避免記憶體洩漏
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>