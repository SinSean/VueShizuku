<script setup>

import { useRouter } from 'vue-router'

import { useAdminStore } from '@/stores/admin'

import Divider from 'primevue/divider'



const router = useRouter()

const adminStore = useAdminStore()



// 選單項目：已新增會員、商品、客服管理

const menuItems = [

  { label: '儀表板', icon: 'pi pi-home', to: { name: 'admin-dashboard' } },

  { label: '會員管理', icon: 'pi pi-users', to: { name: 'admin-members' } },

  { label: '商品管理', icon: 'pi pi-box', to: { name: 'admin-products' } },

  { label: '訂單管理', icon: 'pi pi-list', to: { name: 'admin-orders' } },

  { label: '金流管理', icon: 'pi pi-credit-card', to: { name: 'admin-payments' } },

  { label: '客服管理', icon: 'pi pi-comments', to: { name: 'admin-customer-service' } },

]



const handleLogout = () => {
  // 3. 修改：呼叫 adminStore 的登出，才會清掉 adminUser 和 adminToken
  adminStore.logout()

  // 4. 建議：改用 replace，讓使用者無法按「回上一頁」回到後台
  router.replace({ name: 'admin-login' })
}
</script>




<template>

  <aside
    class="w-64 min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden shadow-2xl">

    <!-- 背景裝飾光暈 (與 LoginView 一致) -->

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

        <h1 class="text-base font-black text-white tracking-widest uppercase leading-none">

          Shizuku

        </h1>

        <p class="text-[10px] text-indigo-400 tracking-widest mt-0.5 uppercase">Admin Panel</p>

      </div>

    </div>



    <Divider class="!my-0 !border-indigo-800/30" />



    <!-- 員工資訊 -->

    <div class="relative z-10 px-5 py-5 flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-indigo-600/40 border border-indigo-500/40 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-inner">
        <!-- 5. 修改：顯示 adminName -->
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



      <router-link v-for="item in menuItems" :key="item.label" :to="item.to" custom
        v-slot="{ isExactActive, navigate }">

        <button @click="navigate" :class="[

          'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group',

          isExactActive

            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 translate-x-1'

            : 'text-slate-400 hover:bg-indigo-900/30 hover:text-indigo-100',

        ]">

          <i :class="[

            item.icon,

            'text-base w-5 text-center transition-transform group-hover:scale-110',

          ]"></i>

          <span class="tracking-wide">{{ item.label }}</span>



          <!-- 選中時的右側指示亮點 -->

          <div v-if="isExactActive"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.8)]"></div>

        </button>

      </router-link>

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
/* 自定義滾動條樣式，讓整體更精緻 */

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