<script setup>
import { ref, shallowRef } from 'vue'
import Dialog from 'primevue/dialog'

// 1. 匯入子元件
import AllPaymentsWidget from '@/components/admin/payments/AllPaymentsWidget.vue'

// 目前被點擊打開的 Widget
const activeWidget = ref(null)
const activeWidgetComponent = shallowRef(null)
const isDialogVisible = ref(false)

// 2. 定義金流泡泡卡片的陣容清單
const widgets = [
  {
    id: 'all-payments',
    title: '全站交易對帳',
    desc: '監控全站金流流水，支援單號檢視、支付狀態查詢與詳細通訊日誌。',
    icon: 'pi pi-credit-card',
    gridSpan: 'md:col-span-3',
    component: AllPaymentsWidget
  },
  {
    id: 'failed-monitor',
    title: '異常支付監控',
    desc: '即時偵測金額不符、高頻失敗與金流逾時，守護交易安全。',
    icon: 'pi pi-exclamation-circle',
    gridSpan: 'col-span-1',
    component: null
  },
  {
    id: 'daily-revenue',
    title: '今日營收統計',
    desc: '即時統計 GMV、支付管道佔比與分時銷售趨勢圖表。',
    icon: 'pi pi-chart-line',
    gridSpan: 'col-span-1',
    component: null
  },
  {
    id: 'refund-center',
    title: '退款管理中心',
    desc: '集中處理退款申請、線上退刷審核與退款原因數據分析。',
    icon: 'pi pi-undo',
    gridSpan: 'col-span-1',
    component: null
  }
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
  <div class="min-h-screen relative overflow-hidden flex flex-col bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
    <!-- 內容容器 -->
    <div class="relative z-10 p-6 md:p-8 flex-1">
      <h1 class="text-4xl font-bold text-gray-800 mb-10 tracking-tight">金流控制中心</h1>

      <!-- 泡泡卡片區塊 - 採 3 欄制佈局 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="widget in widgets" 
          :key="widget.id"
          @click="openWidget(widget)"
          class="bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg rounded-[2rem] p-8 cursor-pointer hover:-translate-y-2 hover:bg-white/70 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[200px]"
          :class="widget.gridSpan"
        >
          <div>
            <div class="flex items-center gap-4 mb-4">
              <i :class="[widget.icon, 'text-4xl text-teal-600 filter drop-shadow-sm']"></i>
              <h2 class="text-2xl font-bold text-gray-800">{{ widget.title }}</h2>
            </div>
            <p class="text-gray-600 font-medium leading-relaxed">{{ widget.desc }}</p>
          </div>
          
          <div class="mt-6 flex justify-end">
            <div class="bg-white/60 rounded-full p-2 text-gray-400 hover:text-teal-500 transition-colors shadow-sm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PrimeVue Dialog 作為功能容器 -->
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
        content: { class: 'bg-gray-50 p-0 h-full' },
        maximizeButton: { class: 'hover:bg-gray-100 rounded-full w-10 h-10 transition-colors mr-2' },
        closeButton: { class: 'hover:bg-red-100 hover:text-red-600 rounded-full w-10 h-10 transition-colors' }
      }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <i :class="[activeWidget?.icon, 'text-3xl text-teal-600']"></i>
          <h2 class="text-2xl font-bold text-gray-800">{{ activeWidget?.title }}</h2>
        </div>
      </template>

      <component :is="activeWidgetComponent" v-if="activeWidgetComponent" />
      
      <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 py-20">
        <i class="pi pi-wrench text-6xl mb-4 text-gray-300"></i>
        <h2 class="text-2xl font-bold">金流工程師正加緊實作中...</h2>
        <p class="mt-2">此進階分析功能尚未開放</p>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* 專屬金流頁面的漸層感 */
</style>
