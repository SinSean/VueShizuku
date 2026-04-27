<template>
  <div class="max-w-5xl mx-auto px-6 py-12 font-sans">
    
    <div class="border-b border-gray-200 pb-4 mb-8 flex justify-between items-end">
      <h1 class="text-3xl font-bold text-gray-900 tracking-widest">聯絡 SHIZUKU 台灣</h1>
      
      <button 
        v-if="currentView !== 'menu'" 
        @click="currentView = 'menu'" 
        class="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
      >
        <span>&lt; 返回客服選單</span>
      </button>
    </div>

    <div v-if="currentView === 'menu'" class="bg-gray-50 p-6 md:p-12 animate-fade-in">
      <h2 class="text-2xl font-bold text-gray-800 mb-8 tracking-widest">智能客服與意見箱</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-white border border-gray-300 p-8 flex flex-col items-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div class="flex items-center gap-2 mb-4">
            <span class="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-sm">IQ</span>
            <h3 class="text-2xl font-bold tracking-widest text-gray-900 group-hover:text-red-600 transition-colors">智能客服</h3>
          </div>
          <ul class="text-sm text-gray-600 space-y-2 w-full text-left list-none p-0">
            <li>※ 智能客服提供 24 小時線上查詢服務。</li>
            <li>※ 詳情可參閱：<a href="#" class="text-blue-500 hover:underline">如何使用 IQ 智能客服？</a></li>
          </ul>
        </div>

        <div 
          @click="currentView = 'feedback'"
          class="bg-white border border-gray-300 p-8 flex flex-col items-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
        >
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <h3 class="text-2xl font-bold tracking-widest text-gray-900 group-hover:text-gray-500 transition-colors">表單回覆</h3>
          </div>
          <ul class="text-sm text-gray-600 space-y-2 w-full text-left list-none p-0">
            <li>※ 期待您的寶貴意見，我們將據此優化商品與服務。</li>
            <li>※ 後續將不對個別留言進行回覆。</li>
          </ul>
        </div>

      </div>
    </div>

    <div v-if="currentView === 'feedback'" class="animate-fade-in">
      <div class="bg-gray-100 p-4 mb-4 flex justify-between items-center">
        <h2 class="text-xl font-bold tracking-widest text-gray-800">客服信箱</h2>
        <span class="text-sm text-gray-600"><span class="text-red-500 mr-1">※</span>必須項目</span>
      </div>

      <form class="space-y-6 bg-white p-6 md:p-10 border border-gray-200">
        
        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
          <label class="font-bold text-gray-800 mb-2 md:mb-0">姓名 <span class="text-red-500">※</span></label>
          <div class="md:col-span-3 flex gap-4">
            <div class="flex-1 flex items-center gap-2">
              <span class="text-sm text-gray-600 whitespace-nowrap">姓</span>
              <input type="text" class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" />
            </div>
            <div class="flex-1 flex items-center gap-2">
              <span class="text-sm text-gray-600 whitespace-nowrap">名</span>
              <input type="text" class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
          <label class="font-bold text-gray-800 mb-2 md:mb-0">電子郵件地址 <span class="text-red-500">※</span></label>
          <div class="md:col-span-3">
            <input type="email" class="w-full max-w-md border border-gray-300 p-2 focus:outline-none focus:border-gray-500 mb-2" />
            <p class="text-xs text-gray-500">※ 請輸入半形英數字。<br>(例) xxxxx@shizuku.com.tw</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
          <label class="font-bold text-gray-800 mb-2 md:mb-0">電話號碼 <span class="text-red-500">※</span></label>
          <div class="md:col-span-3">
            <input type="tel" class="w-full max-w-md border border-gray-300 p-2 focus:outline-none focus:border-gray-500 mb-2" />
            <p class="text-xs text-gray-500">※ 請填寫白天也可與您取得聯繫的電話號碼。<br>(例) 0912345678</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
          <label class="font-bold text-gray-800 mb-2 md:mb-0">詢問主題 <span class="text-red-500">※</span></label>
          <div class="md:col-span-3">
            <select class="w-full max-w-md border border-gray-300 p-2 focus:outline-none focus:border-gray-500 bg-white">
              <option value="">請選擇</option>
              <option value="order">訂單相關問題</option>
              <option value="product">商品相關問題</option>
              <option value="return">退換貨問題</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
          <label class="font-bold text-gray-800 mb-2 md:mb-0">詢問內容 <span class="text-red-500">※</span></label>
          <div class="md:col-span-3">
            <textarea rows="6" class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500 mb-2"></textarea>
            <p class="text-xs text-gray-500 leading-relaxed">
              ※ 對於店鋪相關問題，請在「詢問內容」中輸入店鋪名稱、商品資訊 (商品名稱/商品編號/顏色/尺寸/數量)。<br>
              ※ 對於網路商店相關問題，請在「詢問內容」中輸入訂單編號、商品資訊 (商品名稱/商品編號/顏色/尺寸/數量)。<br>
              ※ 本頁面輸入的相關資訊被TLS保護並傳送。
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start pb-6">
          <label class="font-bold text-gray-800 mb-2 md:mb-0">檔案或圖片</label>
          <div class="md:col-span-3">
            <div class="border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-2 relative">
              <span class="text-sm font-bold text-gray-700 bg-gray-200 px-4 py-2 rounded">請點此上傳檔案</span>
              <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <p class="text-xs text-gray-500 leading-relaxed">
              * 若有相關圖片或檔案，煩請協助提供資訊，我們將盡快確認。<br>
              * 檔案請選擇 PDF、JPEG、PNG 的格式。<br>
              * 最多可附加 2 個檔案，每個檔案大小上限為 10MB。
            </p>
          </div>
        </div>

        <div class="text-center pt-8">
          <button type="button" class="bg-gray-900 text-white px-16 py-3 font-bold tracking-widest hover:bg-gray-700 transition-colors">
            確認送出
          </button>
        </div>

      </form>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// 控制目前要顯示哪一個畫面的變數
// 'menu' = 兩個大按鈕的選單
// 'feedback' = 意見箱表單
// 'chatbot' = 智能客服 (預留給之後用)
const currentView = ref('menu');
</script>

<style scoped>
/* 簡單的淡入特效，讓切換畫面時不會太生硬 */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>