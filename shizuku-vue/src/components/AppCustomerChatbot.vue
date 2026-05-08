<script setup>
import { ref } from 'vue';
import axios from 'axios'; // 記得確保有引入 axios

// 畫面上綁定的變數
const messages = ref([
  // 可以先預設一句歡迎語
  { text: '您好！我是電商智能小幫手，請問有什麼我可以幫您的嗎？', isMine: false }
]);
const newMessage = ref('');

// 發送訊息的方法
const sendMessage = async () => {
  const userText = newMessage.value.trim();
  if (!userText) return;

  // 1. 先把客人的問題印在畫面上
  messages.value.push({ text: userText, isMine: true });
  newMessage.value = ''; // 成功送出後，清空輸入框

  try {
    // 2. 呼叫剛寫好的 C# API 
    //  老哥，記得把這裡的 7123 換成你真正在跑的 Port！
    const response = await axios.post('https://localhost:7197/api/CustomerApi/bot', {
      Message: userText
    });

    // 3. 把機器人的回答印在畫面上
    messages.value.push({ text: response.data.reply, isMine: false });
    
  } catch (error) {
    console.error("機器人連線失敗", error);
    messages.value.push({ text: '系統連線異常，請稍後再試或填寫聯絡表單。', isMine: false });
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>





<template>
  <div class="animate-fade-in bg-white border border-gray-200 p-6 flex flex-col h-[500px]">
    <h2 class="text-2xl font-bold mb-4 text-center">IQ 智能客服系統</h2>

    <div class="flex-1 overflow-y-auto border border-gray-200 p-4 mb-4 bg-gray-50 rounded">
      <div v-for="(msg, index) in messages" :key="index" class="mb-3">
        <span :class="msg.isMine ? 'text-green-600' : 'text-blue-600'" class="font-bold">
          {{ msg.isMine ? '我' : '智能客服' }}: 
        </span>
        <span class="text-gray-700">{{ msg.text }}</span>
      </div>
    </div>

    <div class="flex gap-2">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        type="text" 
        placeholder="請輸入關於運費、退換貨或門市的問題..." 
        class="border border-gray-300 p-2 flex-1 rounded focus:outline-none focus:border-blue-500" 
      />
      <button 
        @click="sendMessage" 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        送出
      </button>
    </div>
  </div>
</template>