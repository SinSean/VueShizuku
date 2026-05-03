<script setup>
import { ref } from 'vue'
import AppCartMenu from './AppCartMenu.vue'
import AppNavHamburgerMenu from './AppNavHamburgerMenu.vue'

import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const isHamburgerMenuOpen = ref(false)

const authStore = useAuthStore()
const router = useRouter()

// 處理登出邏輯
const handleLogout = () => {
  authStore.logout()
  alert('您已成功登出')
  router.push({ name: 'home' });
}
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-gray-100 py-4">
    <div class="flex justify-center items-center px-4 py-6">
      <div class="absolute left-4 lg:left-8">
        <router-link to="/" class="cursor-pointer inline-block">
          <img src="../assets/img/logo.png" alt="Shizuku" class="inline-block" />
        </router-link>
      </div>
      <ul
        class="hidden lg:flex left-4 flex justify-center gap-8 text-[16px] font-bold tracking-widest uppercase text-gray-700">
        <li>
          <router-link to="/" class="hover:text-gray-400 cursor-pointer transition-colors">首頁</router-link>
        </li>
        <li class="cursor-pointer">
          <RouterLink to="/all" class="hover:text-gray-900 transition-colors duration-200"
            active-class="!text-red-500 !border-b-2 !border-red-500">
            所有商品
          </RouterLink>
        </li>

        <li class="hover:text-gray-400 cursor-pointer ">風格搭配 ▽</li>
        <li class="hover:text-gray-400 cursor-pointer ">聯名款商品 ▽</li>
        <li class="hover:text-gray-400 cursor-pointer ">"限時折扣專區"</li>
        <li>
          <router-link to="/member" class="hover:text-gray-400 cursor-pointer transition-colors">會員專區</router-link>
        </li>
      </ul>
      <div class="absolute right-4 lg:right-10 flex items-center gap-5 text-gray-600">
        <button class="hover:text-gray-400 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>

        <AppCartMenu />

        <template v-if="authStore.isLogin">
          <div class="flex items-center gap-3 bg-gray-200/50 p-1 pr-3 rounded-full border border-gray-300">
            <!-- 會員頭像 + 名字 (點了進會員中心) -->
            <router-link to="/member" class="flex items-center gap-2 group">
              <div
                class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white overflow-hidden group-hover:bg-emerald-600 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <span class="hidden xl:block text-xs font-bold text-gray-700">{{ authStore.userName }}</span>
            </router-link>

            <!-- 分隔線 -->
            <div class="w-[1px] h-4 bg-gray-400"></div>

            <!-- 登出按鈕：直接露出來，保證點得到 -->
            <button @click="handleLogout"
              class="text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-1">
              登出
            </button>
          </div>
        </template>

        <template v-else>
          <router-link to="/auth"
            class="hidden lg:block border border-gray-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 hover:text-white transition-all">
            登入/註冊
          </router-link>
        </template>
        <button class="lg:hidden hover:text-gray-400 transition-colors" @click="isHamburgerMenuOpen = true">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <AppNavHamburgerMenu v-model:visible="isHamburgerMenuOpen" />
</template>
