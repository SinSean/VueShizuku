<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as signalR from '@microsoft/signalr';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const activeGuests = ref({});
const currentGuestId = ref('');
const inputMessage = ref('');
const messagesContainer = ref(null);
let connection = null;

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
};

onMounted(async () => {
  // 1. 初始化：先去撈出所有有聊過天的會員名單
  try {
    const response = await fetch(`https://localhost:7197/api/ChatApi/GetChatMembers`);
    if (response.ok) {
      const memberList = await response.json();
      memberList.forEach(m => {
        // 使用一個虛擬的 guestId (因為此時還沒有即時連線 ID)
        const tempId = `History_${m.memberId}`;
        activeGuests.value[tempId] = {
          id: tempId,
          memberId: m.memberId,
          realName: m.realName,
          messages: [],
          unreadCount: 0,
          hasLoadedHistory: false
        };
      });
    }
  } catch (err) {
    console.error("載入會員名單失敗:", err);
  }

  // 2. 啟動 SignalR 連線
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7197/chatHub")
    .withAutomaticReconnect()
    .build();

  // 解決重複訊息關鍵：先移除舊的監聽器，再加新的
  connection.off("ReceiveFromMember"); 
  
  connection.on("ReceiveFromMember", (guestId, memberId, memberName, message) => {
    // 檢查清單中是否已經有這個會員 (比對 memberId)
    let targetId = Object.keys(activeGuests.value).find(key => activeGuests.value[key].memberId === memberId);

    if (!targetId) {
      // 完全新的客人
      activeGuests.value[guestId] = {
        id: guestId,
        memberId: memberId,
        realName: memberName,
        messages: [],
        unreadCount: 0,
        hasLoadedHistory: false
      };
      targetId = guestId;
    } else {
      // 如果已經在清單中 (歷史客人)，更新他的即時連線 ID
      const oldData = activeGuests.value[targetId];
      delete activeGuests.value[targetId];
      activeGuests.value[guestId] = { ...oldData, id: guestId };
      targetId = guestId;
    }

    const timeString = getCurrentTime();
    activeGuests.value[targetId].messages.push({ sender: 'Member', text: message, time: timeString });

    if (currentGuestId.value !== targetId) {
      activeGuests.value[targetId].unreadCount++;
    } else {
      scrollToBottom();
    }
  });

  try {
    await connection.start();
    await connection.invoke("JoinAsAdmin");
    console.log(`員工客服 [${adminStore.adminName}] 後台連線成功`);
  } catch (err) {
    console.error("連線失敗: ", err);
  }
});

const selectGuest = async (guestId) => {
  currentGuestId.value = guestId;
  const guest = activeGuests.value[guestId];
  guest.unreadCount = 0;

  if (!guest.hasLoadedHistory) {
    try {
      const response = await fetch(`https://localhost:7197/api/ChatApi/GetHistory/${guest.memberId}`);
      if (response.ok) {
        const history = await response.json();
        const formattedHistory = history.map(m => ({
          sender: m.type,
          text: m.text,
          time: m.time
        }));
        guest.messages = formattedHistory; 
        guest.hasLoadedHistory = true;
      }
    } catch (err) {
      console.error("歷史紀錄載入失敗:", err);
    }
  }
  scrollToBottom();
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || !currentGuestId.value) return;
  const targetMemberId = activeGuests.value[currentGuestId.value].memberId;
  try {
    await connection.invoke("ReplyToMember", currentGuestId.value, targetMemberId, adminStore.adminName, inputMessage.value);
    const timeString = getCurrentTime();
    activeGuests.value[currentGuestId.value].messages.push({ sender: 'Admin', text: inputMessage.value, time: timeString });
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
  <div class="flex h-[calc(100vh-8rem)] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md text-gray-800 w-full">
    
    <div class="w-1/4 border-r border-gray-200 flex flex-col bg-gray-50">
      <div class="p-4 bg-gray-800 text-white font-bold text-center tracking-widest">
        線上會員
      </div>
      <div class="flex-grow overflow-y-auto">
        <div v-if="Object.keys(activeGuests).length === 0" class="p-10 text-center text-gray-400 text-sm">
          暫無會員連線
        </div>
        <div v-for="(guest, guestId) in activeGuests" :key="guestId"
             @click="selectGuest(guestId)"
             :class="['p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-200 flex justify-between items-center transition-all', 
                      currentGuestId === guestId ? 'bg-blue-50 border-l-4 border-l-blue-600' : '']">
          <div class="flex flex-col">
            <span class="font-bold text-gray-700">會員：{{ guest.realName }}</span>
            <span class="text-xs text-gray-400">連線中</span>
          </div>
          <span v-if="guest.unreadCount > 0" class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
            {{ guest.unreadCount }}
          </span>
        </div>
      </div>
    </div>

    <div class="w-3/4 flex flex-col bg-white">
      <div v-if="currentGuestId" class="flex flex-col h-full">
        <div class="p-4 bg-white border-b border-gray-200 font-bold text-gray-800 flex justify-between items-center shadow-sm z-10">
          <span>正在與 會員：{{ activeGuests[currentGuestId].realName }} 對話</span>
        </div>
        
        <div class="flex-grow p-6 overflow-y-auto space-y-4 bg-gray-50" ref="messagesContainer">
          <div v-for="(msg, index) in activeGuests[currentGuestId].messages" :key="index" 
               :class="['flex flex-col', msg.sender === 'Admin' ? 'items-end' : 'items-start']">
            <span class="text-[11px] text-gray-400 mb-1">
              {{ msg.sender === 'Admin' ? `客服 (${adminStore.adminName})` : activeGuests[currentGuestId].realName }} · {{ msg.time }}
            </span>
            <div :class="['px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm', 
                        msg.sender === 'Admin' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800']">
              {{ msg.text }}
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 bg-white">
          <div class="flex gap-2">
            <input v-model="inputMessage" @keyup.enter="sendMessage"
                   type="text" class="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                   placeholder="請輸入回覆訊息..." />
            <button @click="sendMessage" class="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              發送
            </button>
          </div>
        </div>
      </div>

      <div v-else class="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
        <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        <p class="tracking-widest">請從左側點擊會員開始對談</p>
      </div>
    </div>
  </div>
</template>