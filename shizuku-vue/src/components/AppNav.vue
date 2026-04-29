<script setup>
import { ref } from 'vue'
import AppCartMenu from './AppCartMenu.vue'
import AppNavHamburgerMenu from './AppNavHamburgerMenu.vue'

const isHamburgerMenuOpen = ref(false)
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

        <!-- <button class="border border-gray-300 px-3 py-1 rounded-full text-xs hover:bg-gray-50 transition-colors">
          登入/註冊
        </button> -->
        <router-link to="/auth"
          class="hidden lg:block border border-gray-300 px-3 py-1 rounded-full text-xs hover:bg-gray-50 transition-colors">
          登入/註冊
        </router-link>
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
