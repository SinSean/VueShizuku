<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import Divider from 'primevue/divider'
import { ref } from 'vue'

const router = useRouter()
const adminStore = useAdminStore()

// 將選單改成響應式 ref，這樣才能動態切換內部的 open 狀態
const menuItems = ref([
  { label: '儀表板', icon: 'pi pi-home', to: { name: 'admin-dashboard' } },
  {
    label: '會員管理', icon: 'pi pi-users',
    open: false,
    children: [
      { label: '會員列表', icon: 'pi pi-list', to: { name: 'admin-members' } },
      { label: '黑名單列表', icon: 'pi pi-ban', to: { name: 'admin-members-block' } },
    ]
  },
  {
    label: '商品管理', icon: 'pi pi-box',
    open: false, // 這是商品原本就有的
    children: [
      { label: '商品列表', icon: 'pi pi-list', to: { name: 'admin-products' } },
      { label: '庫存管理', icon: 'pi pi-warehouse', to: { name: 'admin-inventory' } },
      { label: '分類管理', icon: 'pi pi-tag', to: { name: 'admin-categories' } },
    ]
  },
  { label: '訂單管理', icon: 'pi pi-list', to: { name: 'admin-orders' } },
  { label: '金流管理', icon: 'pi pi-credit-card', to: { name: 'admin-payments' } },
  { label: '客服回覆', icon: 'pi pi-comments', to: { name: 'admin-customer-service' } },
  { label: '表單留言紀錄', icon: 'pi pi-envelope', to: { name: 'admin-ticket-list' } },
  {
    label: '系統管理', icon: 'pi pi-cog', 
    open: false,
    children: [
      { label: '安全設定', icon: 'pi pi-shield', to: { name: 'admin-system-settings' } }, 
      { label: '系統日誌', icon: 'pi pi-file', to: { name: 'admin-system-logs' } }      
    ]
  },
])

const handleLogout = () => {
  adminStore.logout()
  router.replace({ name: 'admin-login' })
}
</script>

<template>
  <aside
    class="w-64 min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden shadow-2xl">

    <!-- 背景裝飾光暈 -->
    <div class="absolute top-[-60px] left-[-60px] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none">
    </div>
    <div
      class="absolute bottom-[-40px] right-[-40px] w-60 h-60 bg-violet-500/10 rounded-full blur-3xl pointer-events-none">
    </div>

    <!-- Logo 區 -->
    <div class="relative z-10 px-6 py-8 flex items-center gap-3">
      <div
        class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
        <i class="pi pi-bolt text-white text-base"></i>
      </div>
      <div>
        <h1 class="text-base font-black text-white tracking-widest uppercase leading-none">Shizuku</h1>
        <p class="text-[10px] text-indigo-400 tracking-widest mt-0.5 uppercase">Admin Panel</p>
      </div>
    </div>

    <Divider class="!my-0 !border-indigo-800/30" />

    <!-- 員工資訊 -->
    <div class="relative z-10 px-5 py-5 flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-indigo-600/40 border border-indigo-500/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-inner">
        {{ adminStore.adminName?.charAt(0) ?? 'A' }}
      </div>
      <div class="overflow-hidden">
        <p class="text-sm font-bold text-white truncate">{{ adminStore.adminName }}</p>
        <p class="text-[11px] text-indigo-400/80 mt-0.5">系統管理員</p>
      </div>
    </div>

    <Divider class="!my-0 !border-indigo-800/30" />

    <!-- 選單區 -->
    <nav class="relative z-10 flex-1 px-3 py-6 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
      <p class="text-[10px] font-bold text-indigo-500/50 tracking-[0.2em] uppercase px-4 mb-3">
        Main Menu
      </p>

      <template v-for="item in menuItems" :key="item.label">
        <!-- 有子選單：手風琴 -->
        <div v-if="item.children">
          <!-- 關鍵修改：將 productMenuOpen 換成 item.open -->
          <button @click="item.open = !item.open" :class="[
            'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group',
            'text-slate-400 hover:bg-indigo-900/30 hover:text-indigo-100'
          ]">
            <i :class="[item.icon, 'text-base w-5 text-center transition-transform group-hover:scale-110']"></i>
            <span class="tracking-wide">{{ item.label }}</span>
            <!-- 關鍵修改：旋轉角度也根據各自的 item.open 決定 -->
            <i class="pi pi-chevron-down ml-auto text-xs transition-transform duration-300"
              :class="item.open ? 'rotate-180' : ''"></i>
          </button>

          <!-- 關鍵修改：顯示隱藏改用 item.open 控制 -->
          <div v-show="item.open" class="ml-4 mt-1 flex flex-col gap-1">
            <router-link v-for="child in item.children" :key="child.label" :to="child.to" custom
              v-slot="{ isExactActive, navigate }">
              <button @click="navigate" :class="[
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group',
                isExactActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 translate-x-1'
                  : 'text-slate-400 hover:bg-indigo-900/30 hover:text-indigo-100'
              ]">
                <i :class="[child.icon, 'text-base w-5 text-center transition-transform group-hover:scale-110']"></i>
                <span class="tracking-wide">{{ child.label }}</span>
                <div v-if="isExactActive"
                  class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.8)]"></div>
              </button>
            </router-link>
          </div>
        </div>

        <!-- 一般選單 -->
        <router-link v-else :to="item.to" custom v-slot="{ isExactActive, navigate }">
          <button @click="navigate" :class="[
            'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group',
            isExactActive
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 translate-x-1'
              : 'text-slate-400 hover:bg-indigo-900/30 hover:text-indigo-100',
          ]">
            <i :class="[item.icon, 'text-base w-5 text-center transition-transform group-hover:scale-110']"></i>
            <span class="tracking-wide">{{ item.label }}</span>
            <div v-if="isExactActive"
              class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.8)]"></div>
          </button>
        </router-link>
      </template>
    </nav>

    <Divider class="!my-0 !border-indigo-800/30" />

    <!-- 底部登出按鈕 -->
    <div class="relative z-10 px-3 py-6">
      <button @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-900/20 hover:text-red-400 transition-all duration-300 group">
        <i class="pi pi-sign-out text-base w-5 text-center group-hover:-translate-x-1 transition-transform"></i>
        <span class="tracking-wide">登出</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.1);
  border-radius: 10px;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2);
}
</style>