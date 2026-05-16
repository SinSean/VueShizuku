<script setup>
import { ref, shallowRef } from 'vue'
import Dialog from 'primevue/dialog' // 引入 PrimeVue 對話框

// 1. 匯入子元件
import AllOrdersWidget from '@/components/admin/orders/AllOrdersWidget.vue'
import AnomalyOrdersWidget from '@/components/admin/orders/AnomalyOrdersWidget.vue'

// 目前被點擊打開的 Widget
const activeWidget = ref(null)
const activeWidgetComponent = shallowRef(null)
const isDialogVisible = ref(false) // 控制 PrimeVue Dialog 的開關

// 2. 定義泡泡卡片的陣容清單 (維持純陣列，效能最好)
const widgets = [
  {
    id: 'all-orders',
    title: '全站訂單管理',
    desc: '總覽全站交易，支援即時關鍵字查詢、明細檢視與強制狀態變更。',
    icon: 'pi pi-list',
    gridSpan: 'md:col-span-2 lg:col-span-3',
    component: AllOrdersWidget,
  },
  {
    id: 'shipping-hub',
    title: '出貨作業中心',
    desc: '倉儲人員專屬！集中顯示「待出貨」訂單，一鍵批次更改狀態。',
    icon: 'pi pi-box',
    gridSpan: 'col-span-1',
    component: null,
  },
  {
    id: 'anomaly-orders',
    title: '異常訂單監控',
    desc: '掃描金流衝突、異常刷卡行為與惡意鎖單，並提供一鍵自動化救援機制。',
    icon: 'pi pi-exclamation-triangle',
    gridSpan: 'col-span-1',
    component: AnomalyOrdersWidget,
  },
]

// 打開卡片
const openWidget = (widget) => {
  activeWidget.value = widget
  activeWidgetComponent.value = widget.component
  isDialogVisible.value = true
}

// 關閉卡片時的清理動作
const onDialogHide = () => {
  activeWidget.value = null
  activeWidgetComponent.value = null
}
</script>

<template>
  <!--內部區塊再給間距 -->
  <div
    class="min-h-screen relative overflow-hidden flex flex-col bg-gradient-to-br from-blue-100 via-indigo-50 to-pink-100"
  >
    <!-- 內容容器 -->
    <div class="relative z-10 p-6 md:p-8 flex-1">
      <h1 class="text-4xl font-bold text-gray-800 mb-10 tracking-tight">訂單控制中心</h1>

      <!-- 瀑布流/Grid 泡泡卡片區塊 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 單一泡泡卡片 -->
        <div
          v-for="widget in widgets"
          :key="widget.id"
          @click="openWidget(widget)"
          class="bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg rounded-[2rem] p-8 cursor-pointer hover:-translate-y-2 hover:bg-white/70 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[200px]"
          :class="widget.gridSpan"
        >
          <div>
            <div class="flex items-center gap-4 mb-4">
              <i :class="[widget.icon, 'text-4xl text-blue-600 filter drop-shadow-sm']"></i>
              <h2 class="text-2xl font-bold text-gray-800">{{ widget.title }}</h2>
            </div>
            <p class="text-gray-600 font-medium leading-relaxed">{{ widget.desc }}</p>
          </div>

          <!-- 卡片底部小箭頭 -->
          <div class="mt-6 flex justify-end">
            <div
              class="bg-white/60 rounded-full p-2 text-gray-400 hover:text-blue-500 transition-colors shadow-sm"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PrimeVue Dialog (取代手刻的全螢幕視窗) -->
    <Dialog
      v-model:visible="isDialogVisible"
      modal
      maximizable
      :draggable="false"
      @hide="onDialogHide"
      :style="{ width: '90vw', height: '90vh' }"
      :pt="{
        root: { class: 'rounded-2xl overflow-hidden shadow-2xl border-0' },
        header: { class: 'bg-white border-b px-8 py-5' },
        content: { class: 'bg-gray-50 p-6 h-full' },
        maximizeButton: {
          class: 'hover:bg-gray-100 rounded-full w-10 h-10 transition-colors mr-2',
        },
        closeButton: {
          class: 'hover:bg-red-100 hover:text-red-600 rounded-full w-10 h-10 transition-colors',
        },
      }"
    >
      <!-- 自訂 Header 標題 -->
      <template #header>
        <div class="flex items-center gap-3">
          <i :class="[activeWidget?.icon, 'text-3xl text-blue-600']"></i>
          <h2 class="text-2xl font-bold text-gray-800">{{ activeWidget?.title }}</h2>
        </div>
      </template>

      <!-- 裡面真正執行功能的 Component -->
      <component :is="activeWidgetComponent" v-if="activeWidgetComponent" />

      <!-- 尚未開發的防呆提示 -->
      <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 py-20">
        <i class="pi pi-wrench text-6xl mb-4 text-gray-300"></i>
        <h2 class="text-2xl font-bold">工程師正爆肝開發中...</h2>
        <p class="mt-2">此功能尚未實作 Vue Component</p>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
