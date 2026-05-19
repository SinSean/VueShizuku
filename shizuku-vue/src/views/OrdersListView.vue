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
    if (!authStore.isLogin) {
      router.push({ name: 'Login' })
      return
    }

    const res = await getMemberOrdersAPI(authStore.user.fId)

    if (res.success && Array.isArray(res.data)) {
      ordersList.value = res.data.map((order) => ({
        id: order.orderNo,
        total: order.totalAmount,
        status: order.statusText,
        date: order.createdAt ? order.createdAt.split('T')[0] : '',
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

// ========== 狀態篩選 Tab ==========
const STATUS_TABS = [
  { label: '全部', value: 'all', icon: 'pi pi-list' },
  { label: '未付款', value: '未付款', icon: 'pi pi-clock' },
  { label: '已付款', value: '已付款', icon: 'pi pi-shopping-bag' },
  { label: '出貨中', value: '出貨中', icon: 'pi pi-truck' },
  { label: '已送達', value: '已送達', icon: 'pi pi-check-circle' },
  { label: '退款', value: 'refund', icon: 'pi pi-undo' },
  { label: '已取消', value: '已取消', icon: 'pi pi-times-circle' },
]

const activeTab = ref('all')

const setTab = (value) => {
  activeTab.value = value
  limit.value = 10  // 切換 Tab 時重置顯示數量
}

// ========== 篩選 + 排序 + 分頁 ==========
const limit = ref(10)

const filteredOrders = computed(() => {
  let result = [...ordersList.value].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (activeTab.value === 'all') return result
  if (activeTab.value === 'refund') {
    return result.filter(o => o.status === '待退款' || o.status === '已退款')
  }
  return result.filter(o => o.status === activeTab.value)
})

const displayedOrders = computed(() => filteredOrders.value.slice(0, limit.value))

const loadMore = () => { limit.value += 10 }

const hasMore = computed(() => limit.value < filteredOrders.value.length)

// 各狀態的數量 badge
const countByStatus = computed(() => {
  const map = {}
  STATUS_TABS.forEach(tab => {
    if (tab.value === 'all') {
      map.all = ordersList.value.length
    } else if (tab.value === 'refund') {
      map.refund = ordersList.value.filter(o => o.status === '待退款' || o.status === '已退款').length
    } else {
      map[tab.value] = ordersList.value.filter(o => o.status === tab.value).length
    }
  })
  return map
})

const goToShop = () => {
  router.push({ name: 'Product' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 py-16 px-4 pt-28">
    <div class="max-w-4xl mx-auto">
      <!-- 標題區塊 -->
      <div class="mb-8 text-center md:text-left">
        <h1 class="text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <i class="pi pi-receipt text-emerald-500 text-3xl"></i>
          我的訂單
        </h1>
        <p class="text-gray-400 mt-2 font-medium text-sm">
          查看您在 Shizuku 的所有交易紀錄與配送狀態
        </p>
      </div>

      <!-- 1. 加載中 -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-4">
        <i class="pi pi-spin pi-spinner-two text-4xl text-emerald-500"></i>
        <p class="text-gray-400 font-bold text-sm tracking-widest animate-pulse">
          正在為您讀取交易紀錄...
        </p>
      </div>

      <div v-else>
        <!-- 2. 狀態篩選 Tab 列 -->
        <div class="mb-6 overflow-x-auto">
          <div class="flex gap-2 min-w-max pb-1">
            <button
              v-for="tab in STATUS_TABS"
              :key="tab.value"
              @click="setTab(tab.value)"
              :class="[
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap border',
                activeTab === tab.value
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600',
              ]"
            >
              <i :class="[tab.icon, 'text-xs']"></i>
              {{ tab.label }}
              <span
                v-if="countByStatus[tab.value] > 0"
                :class="[
                  'ml-0.5 text-xs font-black px-1.5 py-0.5 rounded-full',
                  activeTab === tab.value
                    ? 'bg-white/30 text-white'
                    : 'bg-gray-100 text-gray-500',
                ]"
              >
                {{ countByStatus[tab.value] }}
              </span>
            </button>
          </div>
        </div>

        <!-- 3. 空狀態 (Empty State) -->
        <div
          v-if="ordersList.length === 0"
          class="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-6"
        >
          <div class="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
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

        <!-- 4. 篩選後的空狀態 -->
        <div
          v-else-if="filteredOrders.length === 0"
          class="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm"
        >
          <i class="pi pi-filter-slash text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 font-bold">此分類目前沒有訂單</p>
          <button
            @click="setTab('all')"
            class="mt-4 text-sm text-emerald-500 hover:text-emerald-700 font-bold underline"
          >
            查看全部訂單
          </button>
        </div>

        <!-- 5. 訂單清單 -->
        <div v-else class="flex flex-col gap-4">
          <div class="order-list-transition">
            <OrderItemCard
              v-for="order in displayedOrders"
              :key="order.id"
              :order="order"
            />
          </div>

          <!-- 顯示更多 -->
          <div class="mt-8 flex flex-col items-center gap-3">
            <Button
              v-if="hasMore"
              label="顯示更多訂單"
              icon="pi pi-chevron-down"
              class="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 font-bold rounded-xl shadow-sm transition-all"
              @click="loadMore"
            />
            <p v-else class="text-gray-400 font-bold text-sm tracking-wide mt-4">
              已顯示此分類的所有訂單
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
.pi-spinner-two {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
