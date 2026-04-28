<template>
  <main class="w-full bg-white p-10 shadow-sm border border-slate-100 rounded-xl">
    <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">我的地址</h2>
        <p class="text-slate-500 text-sm mt-1">管理收件地址，提升結帳效率</p>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
        <i class="pi pi-plus text-sm"></i>
        新增地址
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="addr in addressList" :key="addr.id" 
           class="border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-300 group">
        
        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <h3 class="font-bold text-lg text-slate-800">{{ addr.name }}</h3>
              <span class="text-slate-400">|</span>
              <span class="text-slate-600">{{ addr.phone }}</span>
              
              <span v-if="addr.isDefault" class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-semibold">
                預設地址
              </span>
            </div>
            
            <p class="text-slate-600 mt-2">{{ addr.fullAddress }}</p>
            <p class="text-slate-400 text-sm">{{ addr.zipCode }}</p>
          </div>

          <div class="flex items-center gap-4 text-sm font-medium">
            <button v-if="!addr.isDefault" class="text-slate-500 hover:text-blue-600 transition-colors">設為預設</button>
            <button class="text-slate-500 hover:text-blue-600 transition-colors">編輯</button>
            <button class="text-slate-500 hover:text-red-600 transition-colors">刪除</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

// 模擬地址資料
const addressList = ref([
  {
    id: 1,
    name: '陳大明',
    phone: '(+886) 929 111 111',
    fullAddress: '高雄市鳳山區中正四路211號8樓之1',
    zipCode: '830',
    isDefault: true
  },
  {
    id: 2,
    name: '陳大明',
    phone: '(+886) 929 111 111',
    fullAddress: '高雄市鳳山區鳳善美路66號1樓',
    zipCode: '830',
    isDefault: false
  }
]);
</script>