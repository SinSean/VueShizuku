<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';

// 1. 表單資料綁定 (對應後端的 VueTicketDto)
const formData = reactive({
  lastName: '',
  firstName: '',
  email: '',
  categoryId: '', // 下拉選單預設為空
  subject: '',
  description: ''
});

// 2. 問題分類選項
const categories = ref([
  { id: 1, name: '商品瑕疵' },
  { id: 2, name: '尺寸不合' },
  { id: 3, name: '物流延遲' },
  { id: 4, name: '退貨申請' },
  { id: 5, name: '一般諮詢' },
  { id: 6, name: '發送錯誤' }
]);

const isSubmitting = ref(false);

// 3. 送出表單到後端
const submitForm = async () => {
  isSubmitting.value = true;
  
  try {
    // 🛑🛑🛑 老哥！就是這裡！把 7123 換成你 C# 跑起來的真實 Port 號 🛑🛑🛑
    const apiUrl = 'https://localhost:7197/api/CustomerApi/Submit';
    
    // 發送 POST 請求
    const response = await axios.post(apiUrl, formData);
    
    if (response.data.success) {
      alert(response.data.message); // 顯示成功訊息
      // 清空表單
      Object.keys(formData).forEach(key => formData[key] = '');
    }
  } catch (error) {
    console.error("API 呼叫失敗：", error);
    alert("系統發生錯誤，送出失敗。請檢查網路狀態或聯繫客服。");
  } finally {
    isSubmitting.value = false;
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
  <div class="animate-fade-in">
    <div class="bg-gray-100 p-4 mb-4 flex justify-between items-center">
      <h2 class="text-xl font-bold tracking-widest text-gray-800">客服信箱</h2>
      <span class="text-sm text-gray-600"><span class="text-red-500 mr-1">※</span>必須項目</span>
    </div>

    <!-- 加上 @submit.prevent 攔截原生表單送出，改呼叫我們的 API 邏輯 -->
    <form @submit.prevent="submitForm" class="space-y-6 bg-white p-6 md:p-10 border border-gray-200">
      
      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">姓名 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3 flex gap-4">
          <div class="flex-1 flex items-center gap-2">
            <span class="text-sm text-gray-600 whitespace-nowrap">姓</span>
            <input type="text" v-model="formData.lastName" required class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" />
          </div>
          <div class="flex-1 flex items-center gap-2">
            <span class="text-sm text-gray-600 whitespace-nowrap">名</span>
            <input type="text" v-model="formData.firstName" required class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">電子郵件地址 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <input type="email" v-model="formData.email" required class="w-full max-w-md border border-gray-300 p-2 focus:outline-none focus:border-gray-500 mb-2" />
        </div>
      </div>

      <!-- 新增的分類、主旨與描述 -->
      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">問題分類 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <select v-model="formData.categoryId" required class="w-full max-w-md border border-gray-300 p-2 focus:outline-none focus:border-gray-500 bg-white">
            <option value="" disabled>請選擇問題分類</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">案件主旨 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <input type="text" v-model="formData.subject" required class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" placeholder="請簡單描述您的問題" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">詳細描述 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <textarea v-model="formData.description" required rows="5" class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" placeholder="請詳細說明您遇到的狀況..."></textarea>
        </div>
      </div>

      <div class="text-center pt-8">
        <!-- 按鈕改成 type="submit" -->
        <button type="submit" :disabled="isSubmitting" class="bg-gray-900 text-white px-16 py-3 font-bold tracking-widest hover:bg-gray-700 transition-colors disabled:opacity-50">
          {{ isSubmitting ? '傳送中...' : '確認送出' }}
        </button>
      </div>

    </form>
  </div>
</template>