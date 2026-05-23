<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// 狀態管理
const tickets = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedStatus = ref('全部')

// 彈窗狀態管理
const isModalOpen = ref(false)
const selectedTicket = ref(null)

// 撈取資料 (帶有防呆假資料機制，確保你現在一存檔就能看到漂亮畫面)
const fetchTickets = async () => {
  isLoading.value = true
  try {
    //  這裡的網址要換成你們 C# 後端真正撈取所有表單的 API 路由
    const response = await axios.get('https://localhost:7197/api/CustomerApi/Admin/AllTickets')
    if (response.data.success) {
      tickets.value = response.data.data
    }
  } catch (error) {
    console.warn("API 尚未串接或發生錯誤，載入測試資料。")
    // 如果 C# API 還沒寫好，自動載入這組假資料讓你先看排版效果！
    tickets.value = [
      { id: 101, memberId: 1, guestName: '陳大名', email: 'chen@example.com', category: '商品問題', subject: '衣服尺寸不合', content: '您好，我昨天收到的外套尺寸太小了，請問可以直接去門市換貨嗎？', status: '待處理', createTime: '2026-05-23 10:30' },
      { id: 102, memberId: 0, guestName: '王小美 (訪客)', email: 'wang@example.com', category: '物流查詢', subject: '請問什麼時候出貨？', content: '我等了三天都還沒看到出貨通知，能幫我查一下進度嗎？', status: '已處理', createTime: '2026-05-22 14:15' },
      { id: 103, memberId: 3, guestName: '林先生', email: 'lin@example.com', category: '退換貨', subject: '商品有瑕疵', content: '衣服背面有一個小破洞，再麻煩協助退貨處理，附上圖片連結...', status: '處理中', createTime: '2026-05-21 09:00' }
    ]
  } finally {
    isLoading.value = false
  }
}

// 畫面載入時執行
onMounted(() => {
  fetchTickets()
})

// 打開閱讀彈窗
const openTicketModal = (ticket) => {
  selectedTicket.value = ticket
  isModalOpen.value = true
}

// 關閉閱讀彈窗
const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => { selectedTicket.value = null }, 200) // 等動畫跑完再清空
}

// 前端搜尋與篩選邏輯
const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    // 關鍵字搜尋 (找姓名或主旨)
    const matchQuery = ticket.guestName.includes(searchQuery.value) || ticket.subject.includes(searchQuery.value)
    // 狀態篩選
    const matchStatus = selectedStatus.value === '全部' || ticket.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})
</script>

<template>
  <div class="p-4 md:p-8 min-h-screen bg-slate-50/50">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-wide">表單留言紀錄</h2>
        <p class="text-sm text-slate-500 mt-1">管理與檢視顧客從前台送出的聯絡表單</p>
      </div>
      <button @click="fetchTickets" class="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">
        <i class="pi pi-refresh" :class="{'animate-spin': isLoading}"></i> 重新整理
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="flex gap-2 w-full md:w-auto">
        <button @click="selectedStatus = '全部'" :class="selectedStatus === '全部' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-1.5 rounded-lg text-sm font-medium transition">全部</button>
        <button @click="selectedStatus = '待處理'" :class="selectedStatus === '待處理' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-1.5 rounded-lg text-sm font-medium transition">待處理</button>
        <button @click="selectedStatus = '已處理'" :class="selectedStatus === '已處理' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-1.5 rounded-lg text-sm font-medium transition">已處理</button>
      </div>
      <div class="relative w-full md:w-72">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input v-model="searchQuery" type="text" placeholder="搜尋姓名或主旨..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
              <th class="px-6 py-4 font-semibold">狀態</th>
              <th class="px-6 py-4 font-semibold">發問人</th>
              <th class="px-6 py-4 font-semibold">分類</th>
              <th class="px-6 py-4 font-semibold min-w-[200px]">主旨</th>
              <th class="px-6 py-4 font-semibold">建立時間</th>
              <th class="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="isLoading" class="animate-pulse">
              <td colspan="6" class="px-6 py-12 text-center text-slate-400">載入資料中...</td>
            </tr>
            <tr v-else-if="filteredTickets.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-slate-400">目前沒有符合條件的紀錄。</td>
            </tr>
            <tr v-for="ticket in filteredTickets" :key="ticket.id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-6 py-4">
                <span :class="[
                  'px-2.5 py-1 text-xs font-bold rounded-full border',
                  ticket.status === '待處理' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                  ticket.status === '處理中' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  'bg-emerald-50 text-emerald-600 border-emerald-200'
                ]">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-slate-800">{{ ticket.guestName }}</div>
                <div class="text-xs text-slate-400 mt-0.5">{{ ticket.email }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                <span class="bg-slate-100 px-2 py-1 rounded text-xs">{{ ticket.category }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-800 truncate max-w-[250px]">{{ ticket.subject }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                {{ ticket.createTime }}
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openTicketModal(ticket)" class="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded text-sm font-medium transition opacity-0 group-hover:opacity-100 focus:opacity-100">
                  查看內容
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="closeModal" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold text-slate-800">表單詳細內容</h3>
            <span class="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">#{{ selectedTicket?.id }}</span>
          </div>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="px-6 py-6 overflow-y-auto custom-scrollbar">
          
          <div class="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 border-b border-slate-100 pb-6">
            <div>
              <p class="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">發問人</p>
              <p class="text-sm font-medium text-slate-800">{{ selectedTicket?.guestName }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">電子郵件</p>
              <p class="text-sm font-medium text-slate-800">{{ selectedTicket?.email }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">建立時間</p>
              <p class="text-sm text-slate-600">{{ selectedTicket?.createTime }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">問題分類</p>
              <p class="text-sm text-slate-600">{{ selectedTicket?.category }}</p>
            </div>
          </div>

          <div>
            <p class="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">案件主旨</p>
            <p class="text-base font-bold text-slate-800 mb-6">{{ selectedTicket?.subject }}</p>
            
            <p class="text-xs text-slate-400 font-bold mb-2 uppercase tracking-wider">詳細內容描述</p>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
              {{ selectedTicket?.content }}
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button @click="closeModal" class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm">
            關閉視窗
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
</style>