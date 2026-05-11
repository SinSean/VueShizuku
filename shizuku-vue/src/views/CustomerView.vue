<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import AppCustomerForm from '@/components/AppCustomerForm.vue';
import AppCustomerChatbot from '@/components/AppCustomerChatbot.vue';
import AppCustomerLiveChat from '@/components/AppCustomerLiveChat.vue';

const currentView = ref('menu');
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12 font-sans">
    
    <div class="border-b border-gray-200 pb-4 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div>
        <RouterLink :to="{ name: 'home' }" class="text-sm text-gray-400 hover:text-gray-900 transition-colors inline-flex items-center gap-2 mb-4">
          <span>&lt;</span> 回首頁
        </RouterLink>
        <h1 class="text-3xl font-bold text-gray-900 tracking-widest">聯絡 SHIZUKU 台灣</h1>
      </div>
      
      <button 
        v-if="currentView !== 'menu'" 
        @click="currentView = 'menu'" 
        class="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
      >
        <span>&lt; 返回客服選單</span>
      </button>
    </div>

    <div v-if="currentView === 'menu'" class="bg-gray-50 p-6 md:p-12 animate-fade-in">
      <h2 class="text-2xl font-bold text-gray-800 mb-8 tracking-widest text-center">智能客服與表單回覆</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div @click="currentView = 'chatbot'" class="bg-white border border-gray-300 p-8 flex flex-col items-center cursor-pointer hover:shadow-xl transition-all group h-full">
          <div class="flex items-center gap-2 mb-4">
            <span class="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-sm">IQ</span>
            <h3 class="text-xl font-bold tracking-widest text-gray-900 group-hover:text-red-600 transition-colors">智能客服</h3>
          </div>
          <p class="text-xs text-gray-500 text-center">智能客服提供 24 小時線上查詢服務。</p>
        </div>

        <div @click="currentView = 'livechat'" class="bg-white border border-gray-300 p-8 flex flex-col items-center cursor-pointer hover:shadow-xl transition-all group h-full">
          <div class="flex items-center gap-2 mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            <h3 class="text-xl font-bold tracking-widest">真人客服</h3>
          </div>
          <p class="text-xs text-gray-500 text-center">即時與專人連線，解決您的疑難雜症。</p>
        </div>

        <div @click="currentView = 'feedback'" class="bg-white border border-gray-300 p-8 flex flex-col items-center cursor-pointer hover:shadow-xl transition-all group h-full">
          <div class="flex items-center gap-2 mb-4 text-gray-800 group-hover:text-gray-500 transition-colors">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <h3 class="text-xl font-bold tracking-widest">表單回覆</h3>
          </div>
          <p class="text-xs text-gray-500 text-center">留下您的寶貴意見，我們將儘速處理。</p>
        </div>

      </div>
    </div>

    <AppCustomerForm v-if="currentView === 'feedback'" />
    <AppCustomerChatbot v-if="currentView === 'chatbot'" />
    <AppCustomerLiveChat v-if="currentView === 'livechat'" />

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>