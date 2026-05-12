<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as signalR from '@microsoft/signalr';

const messages = ref([]);
const inputMessage = ref('');
const messagesContainer = ref(null);
const connectionStatus = ref('連線中...');
const isConnected = ref(false);
let connection = null;

onMounted(async () => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7197/chatHub")
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveFromAdmin", (message) => {
    const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messages.value.push({ sender: '客服人員', text: message, isMe: false, time: timeString });
    scrollToBottom();
  });

  try {
    await connection.start();
    connectionStatus.value = '已連線';
    isConnected.value = true;
    
    // 加入系統歡迎詞，讓畫面不會一開始空空的
    messages.value.push({
        sender: '系統',
        text: '您好！客服連線成功。請輸入您想詢問的問題，我們會盡快為您解答。',
        isMe: false,
        isSystem: true
    });
  } catch (err) {
    connectionStatus.value = '連線失敗，請重新整理';
    console.error("連線失敗: ", err);
  }
});

const sendMessage = async () => {
  if (!inputMessage.value.trim() || !isConnected.value) return;

  try {
    await connection.invoke("SendMessageToAdmin", inputMessage.value);
    
    const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messages.value.push({ sender: '我', text: inputMessage.value, isMe: true, time: timeString });
    inputMessage.value = '';
    scrollToBottom();
  } catch (err) {
    console.error("發送失敗: ", err);
  }
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
    <div class="bg-gray-900 text-white p-4 font-bold tracking-widest text-center flex justify-between items-center">
      <span>真人即時連線服務</span>
      <span class="text-xs font-normal" :class="isConnected ? 'text-green-400' : 'text-yellow-400'">
        {{ connectionStatus }}
      </span>
    </div>
    
    <div class="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50" ref="messagesContainer">
      <div v-for="(msg, index) in messages" :key="index" 
           :class="['flex flex-col', msg.isMe ? 'items-end' : 'items-start', msg.isSystem ? 'items-center mt-4 mb-6' : '']">
        
        <div v-if="msg.isSystem" class="bg-gray-200 text-gray-500 text-xs px-4 py-2 rounded-full tracking-wide">
          {{ msg.text }}
        </div>

        <template v-else>
            <span class="text-xs text-gray-400 mb-1">
                {{ msg.sender }} <span class="ml-2">{{ msg.time }}</span>
            </span>
            <div :class="['px-4 py-2 rounded-lg max-w-[80%] text-sm', 
                        msg.isMe ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-800']">
              {{ msg.text }}
            </div>
        </template>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200 bg-white">
      <div class="flex gap-2">
        <input v-model="inputMessage" @keyup.enter="sendMessage" :disabled="!isConnected"
               type="text" class="flex-grow border border-gray-300 px-4 py-2 focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
               placeholder="請輸入訊息..." />
        <button @click="sendMessage" :disabled="!isConnected" 
                class="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          傳送
        </button>
      </div>
    </div>
  </div>
</template>