<script setup>
import Drawer from 'primevue/drawer'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const visible = defineModel('visible')

const navItems = [
  { label: '首頁', name: 'home', icon: 'pi pi-home' },
  { label: '所有商品', name: 'ProductView', icon: 'pi pi-shopping-bag' },
  { label: '風格搭配', name: 'home', icon: 'pi pi-sparkles' }, // TODO:導向待更新
  { label: '聯名款商品', name: 'home', icon: 'pi pi-star' }, // TODO:導向待更新
  {
    label: '限時折扣專區',
    name: 'home', //TODO:導向待更新
    icon: 'pi pi-tag',
    color: 'text-red-500',
    iconColor: 'text-red-400',
  },
]

const navigateTo = (routeName) => {
  visible.value = false
  router.push({ name: routeName })
}

const handleAuthAction = () => {
  visible.value = false
  if (authStore.isLogin) {
    router.push({ name: 'MemberProfile' })
  } else {
    router.push({ name: 'Login' })
  }
}

// 建立登出工具
const handleLogout = () => {
  // 登出
  authStore.logout()
  // 關閉側邊選單
  visible.value = false
  // 導向首頁
  router.push({ name: 'home' })
}
</script>

<template>
  <Drawer v-model:visible="visible" position="right" class="w-full md:w-80 !bg-white">
    <template #header>
      <div class="flex items-baseline gap-2 px-2 cursor-pointer" @click="navigateTo('home')">
        <span class="text-2xl font-bold italic tracking-tighter text-black uppercase">
          shizuku
        </span>
        <span class="text-[10px] text-gray-400">しずく</span>
      </div>
    </template>

    <ul class="flex flex-col gap-2 mt-6">
      <li
        v-for="item in navItems"
        :key="item.label"
        class="cursor-pointer transition-colors hover:bg-gray-50 rounded-xl"
        @click="navigateTo(item.name)"
      >
        <div class="flex items-center gap-4 px-4 py-3">
          <i :class="[item.icon, item.iconColor || 'text-gray-400']" class="text-xl"></i>
          <span
            class="text-[15px] font-bold tracking-widest uppercase"
            :class="item.color || 'text-gray-700'"
          >
            {{ item.label }}
          </span>
        </div>
      </li>

      <hr class="border-gray-100 my-6" />

      <li class="px-2">
        <button
          @click="handleAuthAction"
          class="w-full bg-black text-white px-4 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
          {{ authStore.isLogin ? '會員中心' : '登入 / 註冊' }}
        </button>
      </li>

      <li v-if="authStore.isLogin" class="px-2 mt-2">
        <button
          @click="handleLogout"
          class="w-full bg-white border border-gray-200 text-gray-500 px-4 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gray-50 transition-colors"
        >
          登出
        </button>
      </li>
    </ul>
  </Drawer>
</template>
