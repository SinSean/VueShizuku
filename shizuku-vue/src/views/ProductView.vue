<script setup>
import ProductAllitem from '@/components/ProductAllitem.vue'
import ProductSidebar from '@/components/ProductSidebar.vue'
import { ref } from 'vue'

// ✨ 紀錄目前選中的分類 ID
const selectedCategoryId = ref(null)

function onCategorySelected(id) {
    selectedCategoryId.value = id
}
</script>

<template>
    <main class="pt-24 bg-white min-h-screen">
        <div class="max-w-[1400px] mx-auto px-4 py-16 text-center">
            <h1 class="text-5xl font-light tracking-[0.5em] uppercase mb-6">Shop All</h1>
            <div class="text-sm text-gray-400 uppercase tracking-widest">
                <RouterLink to="/" class="hover:text-black">Home</RouterLink>
                <span class="mx-3">/</span>
                <span class="text-black">All Products</span>
            </div>
        </div>

        <div class="flex flex-col md:flex-row max-w-[1400px] mx-auto px-4 gap-8 pt-1">

            <aside class="w-full md:w-64 sticky shrink-0 mt-28">
                <!-- ✨ 監聽 categorySelected 事件 -->
                <ProductSidebar @categorySelected="onCategorySelected" />
            </aside>

            <section class="flex-1 min-w-0">
                <!-- ✨ 把選中的分類 ID 傳給商品列表 -->
                <ProductAllitem :categoryId="selectedCategoryId" />
            </section>
        </div>
    </main>
</template>