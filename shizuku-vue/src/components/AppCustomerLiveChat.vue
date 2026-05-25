<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/stores/auth';
import { chatApi } from '@/api/chat';
import { getBackendUrl } from '@/utils/imageHelper';

const authStore = useAuthStore();
const messages = ref([]);
const inputMessage = ref('');
const messagesContainer = ref(null);
const connectionStatus = ref('連線中...');
const isConnected = ref(false);
let connection = null;

onMounted(async () => {
  if (!authStore.isLogin) return;
  const memberId = authStore.user?.fId || authStore.user?.fMemberId || 0;

  try {
    const res = await chatApi.getHistory(memberId);
    const apiResult = res.data;
    if (apiResult.success && apiResult.data) {
      //  關鍵：如果是 Admin 發的，強制顯示 '線上客服'，否則顯示客人自己的名字
      messages.value = apiResult.data.map(m => ({
        sender: m.type === 'Admin' ? '線上客服' : m.senderName,
        text: m.text,
        isMe: m.isMe,
        time: m.time
      }));
      scrollToBottom();
    }
  } catch (err) {
    console.error("歷史紀錄載入失敗: ", err);
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(getBackendUrl('/chatHub'))
    .withAutomaticReconnect()
    .build();

  //  收到客服即時回覆時，直接忽略 adminName，強制顯示 '線上客服'
  connection.on("ReceiveFromAdmin", (adminName, message) => {
    const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messages.value.push({ sender: '線上客服', text: message, isMe: false, time: timeString });
    scrollToBottom();
  });

  try {
    await connection.start();
    await connection.invoke("JoinAsMember", memberId);
    
    connectionStatus.value = '已連線';
    isConnected.value = true;
    if (messages.value.length === 0) {
        messages.value.push({ sender: '系統', text: `您好，${authStore.userName}！客服連線成功。請輸入您想詢問的問題。`, isMe: false, isSystem: true });
    }
  } catch (err) {
    connectionStatus.value = '連線失敗，請重新整理';
  }
});

const sendMessage = async () => {
  if (!inputMessage.value.trim() || !isConnected.value) return;
  const memberId = authStore.user?.fId || authStore.user?.fMemberId || 0;
  try {
    await connection.invoke("SendMessageToAdmin", memberId, authStore.userName, inputMessage.value);
    const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    messages.value.push({ sender: authStore.userName, text: inputMessage.value, isMe: true, time: timeString });
    inputMessage.value = '';
    scrollToBottom();
  } catch (err) {
    console.error("發送失敗: ", err);
  }
};

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }, 100);
};
</script>

<template>
  <div v-if="authStore.isLogin" class="bg-white border border-gray-300 shadow-sm flex flex-col h-[500px] animate-fade-in">
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

  <div v-else class="bg-white border border-gray-300 shadow-sm flex flex-col h-[500px] items-center justify-center p-8 text-center animate-fade-in">
    <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
    <h3 class="text-xl font-bold text-gray-800 tracking-widest mb-2">會員專屬服務</h3>
    <p class="text-sm text-gray-500 mb-6">真人即時客服僅提供給已登入之會員使用，以提供更精準的協助。</p>
    <RouterLink :to="{ name: 'Login' }" class="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors">
      前往登入
    </RouterLink>
  </div>
</template>