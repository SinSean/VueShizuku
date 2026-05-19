<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { getMemberOrdersAPI } from '@/api/order'
import OrderItemCard from '@/components/OrderItemCard.vue'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()
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
    toast.add({
      severity: 'error',
      summary: '載入訂單失敗',
      detail: '無法載入您的訂單資料，請檢查網路狀態或稍後再試！',
      life: 3000,
    })
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
  limit.value = 10 // 切換 Tab 時重置顯示數量
}

// ========== 篩選 + 排序 + 分頁 ==========
const limit = ref(10)

const filteredOrders = computed(() => {
  let result = [...ordersList.value].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (activeTab.value === 'all') return result
  if (activeTab.value === 'refund') {
    return result.filter((o) => o.status === '待退款' || o.status === '已退款')
  }
  return result.filter((o) => o.status === activeTab.value)
})

const displayedOrders = computed(() => filteredOrders.value.slice(0, limit.value))

const loadMore = () => {
  limit.value += 10
}

const hasMore = computed(() => limit.value < filteredOrders.value.length)

// 各狀態的數量 badge
const countByStatus = computed(() => {
  const map = {}
  STATUS_TABS.forEach((tab) => {
    if (tab.value === 'all') {
      map.all = ordersList.value.length
    } else if (tab.value === 'refund') {
      map.refund = ordersList.value.filter((o) => o.status === '待退款' || o.status === '已退款').length
    } else {
      map[tab.value] = ordersList.value.filter((o) => o.status === tab.value).length
    }
  })
  return map
})

const goToShop = () => {
  router.push({ name: 'ProductView' })
}
</script>

<template>
  <!-- 
    加上 w-full, max-w-full, overflow-hidden 與 min-w-0，
    以避免 flex 佈局下寬度被 min-w-max 子元素撐大，防止擠壓與變形左側 MemberSidebar
  -->
  <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm w-full max-w-full overflow-hidden min-w-0">
    <!-- 標題區塊 -->
    <div class="mb-6">
      <h1 class="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
        <i class="pi pi-receipt text-emerald-500 text-xl"></i>
        訂單列表
      </h1>
      <p class="text-slate-400 mt-1 text-xs">
        查看您在 Shizuku 的所有交易紀錄與配送狀態
      </p>
    </div>

    <!-- 1. 加載中狀態 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
      <i class="pi pi-spin pi-spinner text-2xl text-emerald-500"></i>
      <p class="text-slate-400 font-bold text-xs tracking-widest animate-pulse">
        正在為您讀取交易紀錄...
      </p>
    </div>

    <div v-else class="w-full min-w-0">
      <!-- 2. 狀態篩選 Tab 列 (強制設定 w-full overflow-x-auto 確保水平滾動而不撐開外層) -->
      <div class="mb-6 w-full overflow-x-auto scrollbar-thin">
        <div class="flex gap-1.5 min-w-max pb-2">
          <button
            v-for="tab in STATUS_TABS"
            :key="tab.value"
            @click="setTab(tab.value)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap border',
              activeTab === tab.value
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600',
            ]"
          >
            <i :class="[tab.icon, 'text-[10px]']"></i>
            {{ tab.label }}
            <span
              v-if="countByStatus[tab.value] > 0"
              :class="[
                'ml-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full',
                activeTab === tab.value ? 'bg-white/35 text-white' : 'bg-slate-200 text-slate-500',
              ]"
            >
              {{ countByStatus[tab.value] }}
            </span>
          </button>
        </div>
      </div>

      <!-- 3. 空狀態 -->
      <div
        v-if="ordersList.length === 0"
        class="py-12 text-center flex flex-col items-center justify-center gap-4"
      >
        <div class="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
          <i class="pi pi-shopping-bag text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-800">您目前還沒有任何訂單喔！</h3>
          <p class="text-slate-400 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
            現在就去挑選一些讓自己感到幸福的精緻商品吧！
          </p>
        </div>
        <Button
          label="立即去逛逛"
          icon="pi pi-compass"
          class="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 border-none font-bold rounded-lg shadow-md shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-0.5 text-xs"
          @click="goToShop"
        />
      </div>

      <!-- 4. 篩選後的空狀態 -->
      <div
        v-else-if="filteredOrders.length === 0"
        class="py-10 text-center border border-dashed border-slate-200 rounded-xl"
      >
        <i class="pi pi-filter-slash text-2xl text-slate-300 mb-2"></i>
        <p class="text-slate-500 text-xs font-bold">此分類目前沒有訂單</p>
        <button
          @click="setTab('all')"
          class="mt-2 text-xs text-emerald-500 hover:text-emerald-700 font-bold underline"
        >
          查看全部訂單
        </button>
      </div>

      <!-- 5. 訂單清單 -->
      <div v-else class="flex flex-col gap-4 w-full min-w-0">
        <div class="order-list-transition w-full min-w-0">
          <OrderItemCard v-for="order in displayedOrders" :key="order.id" :order="order" />
        </div>

        <!-- 顯示更多 -->
        <div class="mt-6 flex flex-col items-center gap-2">
          <Button
            v-if="hasMore"
            label="顯示更多訂單"
            icon="pi pi-chevron-down"
            class="px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold rounded-lg shadow-sm transition-all text-xs"
            @click="loadMore"
          />
          <p v-else class="text-slate-400 font-bold text-xs tracking-wide mt-2">
            已顯示此分類的所有訂單
          </p>
        </div>
      </div>
    </div>

    <!-- 頁尾提示 -->
    <p class="text-center text-slate-400/80 text-[10px] mt-10 leading-relaxed">
      僅顯示近半年的訂單紀錄，若需查詢更早之前的訂單請聯絡客服。
    </p>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
