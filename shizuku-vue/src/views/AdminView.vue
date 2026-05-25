<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useAdminNotification } from '@/composables/useAdminNotification'

const toast = useToast()
const { connect, disconnect } = useAdminNotification(toast, 'all')

onMounted(() => connect())
onUnmounted(() => disconnect())
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 左側 Sidebar -->
    <AdminSidebar />

    <!-- 右側內容區：子頁面在這裡顯示 -->
    <main class="flex-1 bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

