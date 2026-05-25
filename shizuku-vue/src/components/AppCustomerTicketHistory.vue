<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const tickets = ref([]);
const expandedId = ref(null);
const isLoading = ref(true);

const getMemberId = () => {
  const userData = localStorage.getItem('memberUser');
  if (userData) {
    const user = JSON.parse(userData);
    //  終極修正：只抓流水號，避開 "M001"
    const exactId = user.fId || user.FId || user.id || user.Id || 0;
    return parseInt(exactId) || null;
  }
  return null;
};

onMounted(async () => {
  const memberId = getMemberId(); 
  
  if (!memberId) {
    isLoading.value = false;
    return; 
  }

  try {
    const response = await axios.get(`https://localhost:7197/api/CustomerApi/History/${memberId}`);
    if (response.data.success) {
      tickets.value = response.data.data;
    }
  } catch (err) {
    console.error("無法載入提問歷史紀錄:", err);
  } finally {
    isLoading.value = false;
  }
});

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>

<template>
  <div class="bg-white border border-gray-200 p-6 w-full shadow-sm rounded-lg">
    <div v-if="isLoading" class="text-center py-8 text-gray-400 text-sm">載入紀錄中，請稍候...</div>
    <div v-else-if="tickets.length === 0" class="text-center py-8 text-gray-400 text-sm">目前尚無任何表單留言紀錄。</div>

    <div v-else class="space-y-3">
      <div v-for="ticket in tickets" :key="ticket.id" class="border border-gray-200 rounded overflow-hidden bg-white shadow-sm transition-all">
        
        <div @click="toggleExpand(ticket.id)" class="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-gray-50 gap-2">
          <div class="flex items-center gap-3">
            <span :class="['px-2.5 py-0.5 text-xs font-bold rounded-full whitespace-nowrap', 
                           ticket.status === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700']">
              {{ ticket.status === 1 ? '● 已結案' : '● 處理中' }}
            </span>
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded whitespace-nowrap">{{ ticket.category }}</span>
            <span class="font-semibold text-gray-800 text-base line-clamp-1">{{ ticket.subject }}</span>
          </div>
          <span class="text-xs text-gray-400 whitespace-nowrap">{{ ticket.createTime }}</span>
        </div>

        <div v-if="expandedId === ticket.id" class="p-5 bg-gray-50 border-t border-gray-100 space-y-4 text-base animate-fade-in">
          <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-inner">
            <p class="text-xs font-bold text-gray-400 mb-2">您的提問內容：</p>
            <p class="text-gray-700 whitespace-pre-line">{{ ticket.content }}</p>
          </div>
          
          <div class="text-xs text-center py-3 text-gray-500 bg-gray-100 rounded border border-gray-200 flex flex-col gap-1">
            <span v-if="ticket.status === 0">⏳ 專員已收到您的提問，將於 1-2 個工作天內回覆。</span>
            <span v-else>✅ 此案件已處理完畢。</span>
            <span>詳細解答請留意您的註冊信箱 (Email)。</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>