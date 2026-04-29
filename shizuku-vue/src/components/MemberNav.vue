<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 根據路由名稱來決定顯示什麼文字
const pageTitle = computed(() => {
    // 這裡的 'login', 'register', 'forgot-password' 
    // 請對應到你在 router/index.js 定義的 name 屬性
    switch (route.name) {
        case 'Login':
            return '登入';
        case 'Register':
            return '註冊';
        case 'ForgotPassword':
            return '忘記密碼';
        default:
            return ''; // 其他頁面不顯示，或者你可以設定預設文字
    }
});
</script>

<template>
    <div class="fixed top-0 left-0 w-full z-50 bg-gray-100 py-4">
        <div class="flex justify-center items-center px-4 py-6">
            <div class="absolute left-4 lg:left-8">
                <router-link to="/" class="cursor-pointer inline-block">
                    <img src="../assets/img/logo.png" alt="Shizuku" class="inline-block" />
                </router-link>
            </div>

            <div class="left-4 flex justify-center gap-8 text-[16px] font-bold tracking-widest uppercase text-gray-700">
                {{ pageTitle }}
            </div>

            <div class="absolute right-4 lg:right-10 flex items-center gap-5 text-gray-600">
                <button class="hover:text-gray-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>

                <button class="flex items-center gap-1 hover:text-gray-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
                        </path>
                    </svg>
                    <span class="text-xs font-bold">0</span>
                </button>

                <router-link to="/auth"
                    class="border border-gray-300 px-3 py-1 rounded-full text-xs hover:bg-gray-50 transition-colors inline-block">
                    登入
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 這裡放你的樣式 */
</style>