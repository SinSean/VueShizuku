<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import Divider from 'primevue/divider'
import { ref } from 'vue'

const router = useRouter()
const adminStore = useAdminStore()

const menuItems = ref([
  { label: '儀表板', icon: 'pi pi-home', to: { name: 'admin-dashboard' } },

  {
    label: '會員管理',
    icon: 'pi pi-users',
    open: false,
    children: [
      { label: '會員列表', icon: 'pi pi-list', to: { name: 'admin-members' } },
      { label: '黑名單列表', icon: 'pi pi-ban', to: { name: 'admin-members-block' } },
    ],
  },

  {
    label: '商品管理',
    icon: 'pi pi-box',
    open: false,
    children: [
      { label: '商品列表', icon: 'pi pi-list', to: { name: 'admin-products' } },
      { label: '庫存管理', icon: 'pi pi-warehouse', to: { name: 'admin-inventory' } },
    ],
  },

  { label: '訂單管理', icon: 'pi pi-list', to: { name: 'admin-orders' } },
  { label: '金流管理', icon: 'pi pi-credit-card', to: { name: 'admin-payments' } },
  { label: '客服回覆', icon: 'pi pi-comments', to: { name: 'admin-customer-service' } },
  { label: '表單留言紀錄', icon: 'pi pi-envelope', to: { name: 'admin-ticket-list' } },

  {
    label: '系統管理',
    icon: 'pi pi-cog',
    open: false,
    children: [
      {
        label: '安全設定',
        icon: 'pi pi-shield',
        to: { name: 'admin-system-settings' },
      },
      {
        label: '系統日誌',
        icon: 'pi pi-file',
        to: { name: 'admin-system-logs' },
      },
    ],
  },
])

const handleLogout = () => {
  adminStore.logout()
  router.replace({ name: 'admin-login' })
}
</script>

<template>
  <aside
    class="w-64 min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden shadow-2xl"
  >
    <div
      class="absolute top-[-60px] left-[-60px] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"
    />

    <div
      class="absolute bottom-[-40px] right-[-40px] w-60 h-60 bg-violet-500/10 rounded-full blur-3xl"
    />

    <div class="relative z-10 px-6 py-8 flex items-center gap-3">
      <div
        class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center"
      >
        <i class="pi pi-bolt text-white" />
      </div>

      <div>
        <h1 class="text-base font-black text-white">
          Shizuku
        </h1>

        <p class="text-[10px] text-indigo-400">
          Admin Panel
        </p>
      </div>
    </div>

    <Divider class="!my-0 !border-indigo-800/30" />

    <div class="relative z-10 px-5 py-5 flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-indigo-600/40 flex items-center justify-center text-white"
      >
        {{ adminStore.adminName?.charAt(0) ?? 'A' }}
      </div>

      <div>
        <p class="text-sm font-bold text-white">
          {{ adminStore.adminName }}
        </p>

        <p class="text-[11px] text-indigo-400">
          系統管理員
        </p>
      </div>
    </div>

    <Divider class="!my-0 !border-indigo-800/30" />

    <nav class="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">

      <template
        v-for="item in menuItems"
        :key="item.label"
      >

        <div v-if="item.children">

          <button
            @click="item.open = !item.open"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-indigo-900/30"
          >
            <i :class="item.icon" />

            <span>
              {{ item.label }}
            </span>

            <i
              class="pi pi-chevron-down ml-auto"
              :class="{ 'rotate-180': item.open }"
            />
          </button>

          <div
            v-show="item.open"
            class="ml-4 mt-1 flex flex-col gap-1"
          >
            <router-link
              v-for="child in item.children"
              :key="child.label"
              :to="child.to"
              custom
              v-slot="{ navigate }"
            >

              <button
                @click="navigate"
                class="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-indigo-900/30"
              >
                <i :class="child.icon" />

                {{ child.label }}
              </button>

            </router-link>
          </div>

        </div>

        <router-link
          v-else
          :to="item.to"
          custom
          v-slot="{ navigate }"
        >

          <button
            @click="navigate"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-900/30"
          >
            <i :class="item.icon" />

            {{ item.label }}
          </button>

        </router-link>

      </template>

    </nav>

    <Divider />

    <div class="px-3 py-6">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/20"
      >
        <i class="pi pi-sign-out" />
        登出
      </button>
    </div>

  </aside>
</template>