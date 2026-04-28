<script setup>
// 之後接後端 API 的程式碼就寫在這個檔案，不會干擾到別人
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
        </div>
      </div>

      <div class="text-center pt-8">
        <button type="button" class="bg-gray-900 text-white px-16 py-3 font-bold tracking-widest hover:bg-gray-700 transition-colors">
          確認送出
        </button>
      </div>

    </form>
  </div>
</template>

