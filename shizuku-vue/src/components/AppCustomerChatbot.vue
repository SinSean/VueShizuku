<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as signalR from '@microsoft/signalr';

const messages = ref([]);
const newMessage = ref('');
const isConnected = ref(false);
let connection = null;

const startConnection = async () => {
  // 記得確認這個 Port 是不是你的 C# 執行 Port
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7197/chatHub")
    .withAutomaticReconnect()
    .build();

  // 監聽從「客服人員」傳來的訊息
  connection.on("ReceiveFromAdmin", (message) => {
    messages.value.push({ user: '客服人員', text: message, isMine: false });
  });

  try {
    await connection.start();
    isConnected.value = true;
  } catch (error) {
    console.error("連線失敗", error);
  }
};

const sendMessage = async () => {
  if (!newMessage.value) return;

  try {
    // 訪客送出訊息時，先把它印在自己的畫面上
    messages.value.push({ user: '我', text: newMessage.value, isMine: true });

    // 呼叫 C# 後端的 SendMessageToAdmin，不需要傳名字，只要傳訊息內容
    await connection.invoke("SendMessageToAdmin", newMessage.value);
    
    newMessage.value = '';
  } catch (error) {
    console.error("發送失敗", error);
  }
};

onMounted(() => {
  startConnection();
});

onUnmounted(() => {
  if (connection) {
    connection.stop();
  }
});
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
    <h2 class="text-2xl font-bold mb-4 text-center">真人線上客服</h2>

    <div class="flex-1 overflow-y-auto border border-gray-200 p-4 mb-4 bg-gray-50">
      <div v-for="(msg, index) in messages" :key="index" class="mb-2">
        <span :class="msg.isMine ? 'text-green-600' : 'text-blue-600'" class="font-bold">
          {{ msg.user }}:
        </span>
        <span>{{ msg.text }}</span>
      </div>
    </div>

    <div class="flex gap-2">
      <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="請輸入訊息..." class="border p-2 flex-1" />
      
      <button @click="sendMessage" :disabled="!isConnected" class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
        送出
      </button>
    </div>

    <div v-if="!isConnected" class="text-red-500 text-sm mt-2 text-center">
      連線中，請稍候...
    </div>
  </div>
</template>
