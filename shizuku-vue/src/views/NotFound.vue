<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <div class="relative mb-8">
      <h1 class="text-[12rem] font-black text-gray-100 leading-none select-none">404</h1>
      <div class="absolute inset-0 flex items-center justify-center">
        <i class="pi pi-search text-6xl text-primary opacity-20"></i>
      </div>
    </div>

    <h2 class="text-3xl font-bold text-gray-800 mb-4 tracking-tight">喔喔！您似乎走丟了</h2>
    <p class="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
      我們找不到您要尋找的時尚頁面。可能是網址輸入錯誤，或是該商品已經絕版下架了。
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <Button
        label="回到首頁"
        icon="pi pi-home"
        severity="contrast"
        rounded
        class="px-8 py-3"
        @click="$router.push('/')"
      />
      <Button
        label="聯繫客服"
        icon="pi pi-comments"
        variant="text"
        severity="secondary"
        rounded
        class="px-8 py-3"
      />
    </div>

    <div class="mt-16 pt-12 border-t border-gray-100 w-full max-w-2xl">
      <p class="text-sm text-gray-400 uppercase tracking-widest mb-6">或許您會感興趣</p>
      <div class="flex justify-center gap-8 text-sm font-bold text-gray-600">
        <router-link to="/women" class="hover:text-primary transition-colors">女裝專區</router-link>
        <router-link to="/men" class="hover:text-primary transition-colors">男裝專區</router-link>
        <router-link to="/sale" class="hover:text-primary transition-colors">限時折扣</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 這裡可以加入一些簡單的邏輯，例如記錄使用者在哪個路徑迷路
</script>

<style scoped>
/* 讓背景稍微有點變化，增加空間感 */
h1 {
  text-shadow: 10px 10px 0px rgba(0, 0, 0, 0.02);
}
</style>
