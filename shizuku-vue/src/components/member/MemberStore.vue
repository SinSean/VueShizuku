<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

// 假資料：使用者目前的點數
const userPoints = ref('0')

const authStore = useAuthStore()

userPoints.value = authStore.userPoints.toLocaleString();


// 假資料：8個 Shizuku 品牌專屬點數商品
const pointsProducts = ref([
    {
        id: 1,
        name: 'Shizuku 霧黑雙層不鏽鋼隨行杯',
        points: 12000,
        originalPrice: 580,
        image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        name: 'Shizuku 刺繡 LOGO 水洗棉質老帽',
        points: 10000,
        originalPrice: 450,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        name: 'Shizuku 日系職人手工陶瓷咖啡濾夾組',
        points: 18000,
        originalPrice: 850,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 4,
        name: 'Shizuku 經典極簡亞麻重磅帆布袋',
        points: 8000,
        originalPrice: 350,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 5,
        name: 'Shizuku 靜謐森林 品牌香氛蠟燭',
        points: 15000,
        originalPrice: 680,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 6,
        name: 'Shizuku 經典刺繡雙條紋純棉長襪 (二入組)',
        points: 5000,
        originalPrice: 220,
        image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=500&q=80'
    }
])
</script>

<template>
    <div class="min-h-screen bg-white pb-24 select-none">
        <div class="text-center pt-12 pb-8">
            <h1 class="text-xl md:text-2xl tracking-[0.2em] text-gray-800 font-normal uppercase">Points Mall</h1>
            <p class="text-xs text-gray-400 tracking-wider mt-2">點數兌換專區</p>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
                class="border border-gray-200 rounded-lg p-6 mb-16 max-w-md mx-auto bg-gray-50/50 flex justify-between items-center">
                <div>
                    <p class="text-xs text-gray-500 tracking-wide mb-1">您的可用點數</p>
                    <p class="text-2xl font-semibold tracking-wide text-gray-800">
                        {{ userPoints.toLocaleString() }} <span class="text-xs font-normal text-gray-500">P</span>
                    </p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-gray-400">將於 2026/12/31 到期</p>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                <div v-for="product in pointsProducts" :key="product.id" class="group cursor-pointer">
                    <div class="aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4">
                        <img :src="product.image" :alt="product.name"
                            class="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-300" />
                    </div>

                    <h3
                        class="text-xs md:text-sm text-gray-700 font-normal tracking-wide text-center mb-1 line-clamp-1">
                        {{ product.name }}
                    </h3>

                    <div class="text-center">
                        <span class="text-xs md:text-sm font-semibold tracking-wide text-gray-900">
                            {{ product.points }} P
                        </span>
                        <span class="text-[10px] text-gray-400 line-through ml-2 tracking-wide">
                            原價 NT$ {{ product.originalPrice }}
                        </span>
                    </div>

                    <div class="mt-3 text-center">
                        <button
                            class="text-[11px] tracking-widest border border-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-200">
                            立即兌換
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 保持乾淨俐落的日系極簡風 */
</style>