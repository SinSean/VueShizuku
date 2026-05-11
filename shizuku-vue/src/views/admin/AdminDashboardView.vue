<script setup>
import Card from 'primevue/card'

const stats = [
  {
    label: '今日訂單',
    value: '—',
    icon: 'pi pi-shopping-cart',
    color: 'bg-indigo-50 text-indigo-600',
  },
  { label: '待付款訂單', value: '—', icon: 'pi pi-clock', color: 'bg-yellow-50 text-yellow-600' },
  {
    label: '已完成訂單',
    value: '—',
    icon: 'pi pi-check-circle',
    color: 'bg-green-50 text-green-600',
  },
  { label: '本月營收', value: '—', icon: 'pi pi-wallet', color: 'bg-purple-50 text-purple-600' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 頁首 -->
    <div>
      <h1 class="text-2xl font-black text-gray-800">儀表板</h1>
      <p class="text-sm text-gray-500 mt-1">歡迎回來，這裡是您的後台管理概覽。</p>
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card
        v-for="stat in stats"
        :key="stat.label"
        class="shadow-sm hover:shadow-md transition-shadow"
      >
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {{ stat.label }}
              </p>
              <p class="text-3xl font-black text-gray-800 mt-1">{{ stat.value }}</p>
            </div>
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-xl',
                stat.color,
              ]"
            >
              <i :class="stat.icon"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 未來功能預告 -->
    <Card class="shadow-sm">
      <template #title>
        <span class="text-base font-bold text-gray-700">近期訂單</span>
      </template>
      <template #content>
        <div class="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
          <i class="pi pi-inbox text-4xl"></i>
          <p class="text-sm">此功能開發中，敬請期待</p>
        </div>
      </template>
    </Card>
  </div>
</template>
