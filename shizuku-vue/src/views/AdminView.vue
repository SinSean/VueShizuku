<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 左側 Sidebar -->
    <AdminSidebar />

    <!-- 右側內容區：子頁面在這裡顯示 -->
    <main class="flex-1 bg-gray-50 p-8">
      <router-view />
    </main>
  </div>
</template>
