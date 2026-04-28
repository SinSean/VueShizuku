<script setup>
// 未來搜尋的邏輯會寫在這裡
</script>



<template>
  <div class="mb-16">
    <h1 class="text-3xl text-center font-bold text-gray-900 mb-8 tracking-widest">有什麼我們能為您服務的嗎？</h1>
    
    <div class="flex max-w-2xl mx-auto border border-gray-300 bg-white">
      <input 
        type="text" 
        placeholder="搜尋關鍵字" 
        class="flex-1 py-3 px-4 text-gray-700 focus:outline-none"
      />
      <button class="bg-black text-white px-6 hover:bg-gray-800 transition-colors flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

