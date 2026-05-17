<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { getMemberOrdersAPI } from '@/api/order'
import OrderItemCard from '@/components/OrderItemCard.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const ordersList = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    // 驗證登入狀態，未登入則引導跳轉
    if (!authStore.isLogin) {
      router.push({ name: 'Login' })
      return
    }

    // 發送請求並遵循 ApiResponse.cs 規範進行安全防禦
    const res = await getMemberOrdersAPI(authStore.user.fId)

    if (res.success && Array.isArray(res.data)) {
      // 轉換後端 DTO 欄位至前端卡片元件專用格式
      ordersList.value = res.data.map((order) => ({
        id: order.orderNo, // 對應後端的 OrderNo
        total: order.totalAmount, // 對應後端的 TotalAmount
        status: order.statusText, // 對應後端的 StatusText
        date: order.createdAt ? order.createdAt.split('T')[0] : '', // 安全處理日期
      }))
    } else {
      console.warn('取得訂單失敗或資料格式不符：', res.message)
    }
  } catch (error) {
    console.error('取得訂單失敗：', error)
  } finally {
    isLoading.value = false
  }
})

// 控制初始顯示數量與每次增加數量
const limit = ref(10)

// 依訂單日期由新到舊排序
const sortedOrders = computed(() => {
  return [...ordersList.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 依照目前上限切出要顯示的訂單
const displayedOrders = computed(() => {
  return sortedOrders.value.slice(0, limit.value)
})

// 載入更多訂單資料
const loadMore = () => {
  limit.value += 10
}

// 判斷是否還有更多資料可載入
const hasMore = computed(() => {
  return limit.value < ordersList.value.length
})

// 跳轉到購物頁面
const goToShop = () => {
  router.push({ name: 'Product' }) // 導向商品列表頁
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 py-16 px-4 pt-28">
    <div class="max-w-4xl mx-auto">
      <!-- 標題區塊 -->
      <div class="mb-10 text-center md:text-left">
        <h1
          class="text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3"
        >
          <i class="pi pi-receipt text-emerald-500 text-3xl"></i>
          我的訂單
        </h1>
        <p class="text-gray-400 mt-2 font-medium text-sm">
          查看您在 Shizuku 的所有交易紀錄與配送狀態
        </p>
      </div>

      <!-- 1. 加載中狀態 (Loading State) -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-4">
        <i class="pi pi-spin pi-spinner-two text-4xl text-emerald-500"></i>
        <p class="text-gray-400 font-bold text-sm tracking-widest animate-pulse">
          正在為您讀取交易紀錄...
        </p>
      </div>

      <div v-else>
        <!-- 2. 空狀態 (Empty State) -->
        <div
          v-if="ordersList.length === 0"
          class="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-6"
        >
          <div
            class="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"
          >
            <i class="pi pi-shopping-bag text-4xl"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">您目前還沒有任何訂單喔！</h3>
            <p class="text-gray-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              生活需要儀式感，現在就去挑選一些讓自己感到幸福的精緻商品吧！
            </p>
          </div>
          <Button
            label="立即去逛逛"
            icon="pi pi-compass"
            class="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 border-none font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
            @click="goToShop"
          />
        </div>

        <!-- 3. 訂單清單 (Order List) -->
        <div v-else class="flex flex-col gap-4">
          <div class="order-list-transition">
            <OrderItemCard
              v-for="order in displayedOrders"
              :key="order.id"
              :order="order"
            />
          </div>

          <!-- 顯示更多按鈕 -->
          <div class="mt-8 flex flex-col items-center gap-3">
            <Button
              v-if="hasMore"
              label="顯示更多訂單"
              icon="pi pi-chevron-down"
              class="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 font-bold rounded-xl shadow-sm transition-all"
              @click="loadMore"
            />
            <p v-else class="text-gray-400 font-bold text-sm tracking-wide mt-4">
              已顯示所有近半年的訂單紀錄
            </p>
          </div>
        </div>
      </div>

      <!-- 頁尾提示 -->
      <p class="text-center text-gray-400/80 text-xs mt-16 leading-relaxed">
        僅顯示近半年的訂單紀錄，若需查詢更早之前的訂單請聯絡客服。
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 旋轉加載動畫修飾 */
.pi-spinner-two {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
