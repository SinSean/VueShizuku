<script setup>
import { ref, nextTick } from 'vue';
// 這裡假設你已經有 axios，如果沒有請自行換成 fetch 或你原本呼叫 API 的方式
import { customerApi } from '@/api/customer'; 

const messages = ref([
  { 
    sender: '自助問答小幫手', 
    text: '您好！我是 SHIZUKU 智能小幫手。請問有什麼我可以幫忙的嗎？您可以直接點擊下方按鈕快速發問。' 
  }
]);
const inputMessage = ref('');
const messagesContainer = ref(null);

// 這裡的文字必須跟你資料庫 tChatbotFaq 裡面的 fKeyword 完全一模一樣
const quickKeywords = ['運費', '退換貨', '門市', '付款方式'];

const sendMessage = async (text) => {
  const messageToSend = text || inputMessage.value;
  if (!messageToSend.trim()) return;

  // 1. 把客人的訊息推到畫面上
  messages.value.push({ sender: '我', text: messageToSend });
  inputMessage.value = '';
  await scrollToBottom();

  try {
    // 2. 配合你的 C# Controller，改用 POST 發送，並包裝成 JSON 物件
    const response = await customerApi.getChatbotReply(messageToSend);
    
    // 3. 配合組長規定的 ApiResponse 格式，必須多加一層 .data 才能拆開包裝拿到裡面的 reply
    messages.value.push({ sender: '智能客服', text: response.data.data.reply });
  } catch (error) {
    console.error("API 呼叫失敗", error);
    messages.value.push({ sender: '智能客服', text: '不好意思，系統連線異常，請稍後再試。' });
  }
  
  await scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
</script>

<template>
  <div class="bg-white border border-gray-300 shadow-sm flex flex-col h-[500px] animate-fade-in">
    
    <div class="bg-blue-600 text-white p-4 font-bold tracking-widest text-center text-lg shrink-0 shadow-sm">
      SHIZUKU 自助問答小幫手
    </div>
    
    <div class="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" 
           :class="['flex flex-col', msg.sender === '我' ? 'items-end' : 'items-start']">
        <span class="text-xs text-gray-400 mb-1">{{ msg.sender }}</span>
        <div :class="['px-5 py-2.5 rounded-2xl max-w-[80%] text-base shadow-sm', 
                    msg.sender === '我' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-800']">
          {{ msg.text }}
        </div>
      </div>
    </div>

    <div class="px-4 py-3 bg-white border-t border-gray-100 flex gap-3 overflow-x-auto whitespace-nowrap items-center shadow-inner shrink-0">
      <span class="text-sm font-bold text-gray-500">常見問題：</span>
      <button 
        v-for="keyword in quickKeywords" 
        :key="keyword"
        @click="sendMessage(keyword)"
        class="text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 px-4 py-2 rounded-full shadow-sm transition-all duration-200 shrink-0"
      >
        {{ keyword }}
      </button>
    </div>

    <div class="p-4 border-t border-gray-200 bg-white shrink-0">
      <div class="flex gap-2">
        <input v-model="inputMessage" @keyup.enter="sendMessage()" 
               type="text" class="flex-grow border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
               placeholder="或手動輸入您的問題..." />
        <button @click="sendMessage()" class="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shrink-0">
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 隱藏卷軸但保留滑動功能，讓按鈕區塊更好看 */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>