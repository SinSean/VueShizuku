<script setup>
// 引入我們自己寫好的客服紀錄小零件
import AppCustomerTicketHistory from '@/components/AppCustomerTicketHistory.vue';
</script>

<template>
  <main class="w-full bg-white p-10 shadow-sm border border-slate-100 rounded-xl">
    
    <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">客服紀錄</h2>
        <p class="text-slate-500 text-sm mt-1">查看您的歷史提問與專員回覆狀態</p>
      </div>
    </div>

    <AppCustomerTicketHistory />
    
  </main>
</template>

<style scoped>
/* 保持乾淨，不用寫多餘的 CSS */
</style>