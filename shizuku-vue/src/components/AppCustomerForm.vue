<script setup>
//  1. 多引入了一個 onMounted，用來在網頁開啟時觸發動作
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

// 表單資料綁定
const formData = reactive({
  lastName: '',
  firstName: '',
  email: '',
  categoryId: '', // 下拉選單預設為空
  subject: '',
  description: ''
});

//  2. 這裡改成「空陣列」，不寫死了，等著接後端傳來的資料！
const categories = ref([]);

const isSubmitting = ref(false);

//  3. 新增：專門去後端拿「分類資料」的函數
const fetchCategories = async () => {
  try {
    //  記得確認這裡的 Port 號是你現在 C# 跑起來的真實 Port (例如 7123)
    const apiUrl = 'https://localhost:7197/api/CustomerApi/Categories';
    const response = await axios.get(apiUrl);
    
    //  【關鍵修改】：因為套用了組長的 ApiResponse，所以這裡要寫 .data.data 才能拿到真正的陣列！
    categories.value = response.data.data; 

  } catch (error) {
    console.error("取得分類失敗：", error);
  }
};

// 送出表單到後端 (跟你原本寫的一樣)
const submitForm = async () => {
  isSubmitting.value = true;
  try {
    //  記得確認 Port 號
    const apiUrl = 'https://localhost:7197/api/CustomerApi/Submit';
    const response = await axios.post(apiUrl, formData);
    
    //  這裡其實不用大改，因為 response.data 裡面剛好也有組長寫的 success 和 message！
    if (response.data.success) {
      alert(response.data.message); // 會跳出我們 C# 寫的 "客服單已成功送出！"
      Object.keys(formData).forEach(key => formData[key] = ''); // 清空表單
    }
  } catch (error) {
    console.error("API 呼叫失敗：", error);
    
    // 【進階處理】：如果 C# 的 BadRequest 有回傳 ApiResponse，我們也可以把組長寫的錯誤訊息印出來
    if (error.response && error.response.data && error.response.data.message) {
      alert("錯誤：" + error.response.data.message);
    } else {
      alert("系統發生錯誤，送出失敗。請檢查網路狀態或聯繫客服。");
    }
  } finally {
    isSubmitting.value = false;
  }
};
//  4. 新增：設定網頁一載入 (Mounted) 的時候，就立刻去執行 fetchCategories！
onMounted(() => {
  fetchCategories();
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
  <div class="animate-fade-in">
    <div class="bg-gray-100 p-4 mb-4 flex justify-between items-center">
      <h2 class="text-xl font-bold tracking-widest text-gray-800">客服信箱</h2>
      <span class="text-sm text-gray-600"><span class="text-red-500 mr-1">※</span>必須項目</span>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6 bg-white p-6 md:p-10 border border-gray-200">
      
      <!-- 姓名 -->
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

      <!-- 信箱 -->
      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">電子郵件地址 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <input type="email" v-model="formData.email" required class="w-full max-w-md border border-gray-300 p-2 focus:outline-none focus:border-gray-500 mb-2" />
        </div>
      </div>

      <!-- 問題分類 (現在裡面的資料是從後端來的囉！) -->
      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">問題分類 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <select v-model="formData.categoryId" required class="w-full max-w-md border border-gray-300 p-2 focus:outline-none focus:border-gray-500 bg-white">
            <option value="" disabled>請選擇問題分類</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <!-- 主旨 -->
      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">案件主旨 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <input type="text" v-model="formData.subject" required class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" placeholder="請簡單描述您的問題" />
        </div>
      </div>

      <!-- 描述 -->
      <div class="grid grid-cols-1 md:grid-cols-4 md:gap-4 items-start border-b border-gray-100 pb-6">
        <label class="font-bold text-gray-800 mb-2 md:mb-0">詳細描述 <span class="text-red-500">※</span></label>
        <div class="md:col-span-3">
          <textarea v-model="formData.description" required rows="5" class="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500" placeholder="請詳細說明您遇到的狀況..."></textarea>
        </div>
      </div>

      <!-- 送出按鈕 -->
      <div class="text-center pt-8">
        <button type="submit" :disabled="isSubmitting" class="bg-gray-900 text-white px-16 py-3 font-bold tracking-widest hover:bg-gray-700 transition-colors disabled:opacity-50">
          {{ isSubmitting ? '傳送中...' : '確認送出' }}
        </button>
      </div>

    </form>
  </div>
</template>