<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllOrdersForAdminAPI } from "@/api/adminOrder";
import AdminOrderListTable from "./AdminOrderListTable.vue";
import AdminOrderDetailModal from "./AdminOrderDetailModal.vue";

const orders = ref([]);
const loading = ref(false);

// 篩選與搜尋狀態
const searchQuery = ref("");
const statusFilter = ref("all");

// Modal 控制狀態
const isModalOpen = ref(false);
const selectedOrderNo = ref("");
const selectedOrderCurrentStatus = ref(1);

// 取得所有訂單
const fetchOrders = async () => {
  try {
    loading.value = true;
    const res = await getAllOrdersForAdminAPI();
    if (res.success) {
      orders.value = res.data;
    } else {
      alert(res.message || "獲取訂單失敗");
    }
  } catch (error) {
    console.error("Fetch Orders Error:", error);
  } finally {
    loading.value = false;
  }
};

// 開啟明細 Modal
const openDetailModal = (orderNo) => {
  selectedOrderNo.value = orderNo;
  const currentOrder = orders.value.find((o) => o.orderNo === orderNo);
  selectedOrderCurrentStatus.value = currentOrder ? currentOrder.status : 1;
  isModalOpen.value = true;
};

// 計算屬性：負責搜尋與過濾的聯動
const filteredOrders = computed(() => {
  let result = orders.value;

  // 過濾狀態
  if (statusFilter.value !== "all") {
    result = result.filter((o) => o.status === Number(statusFilter.value));
  }

  // 過濾訂單編號
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase();
    result = result.filter((o) => o.orderNo.toLowerCase().includes(keyword));
  }

  return result;
});

// 元件載入時，自動抓取一次訂單列表
onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800"></h1>
      <button
        @click="fetchOrders"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center gap-2"
      >
        <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
        重新整理
      </button>
    </div>

    <!-- 搜尋與過濾區塊 -->
    <div
      class="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-wrap gap-4 items-end"
    >
      <div class="flex-1 min-w-[200px]">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >搜尋訂單編號</label
        >
        <div class="relative">
          <i
            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="輸入 ORD..."
            class="w-full border-gray-300 border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div class="w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >訂單狀態</label
        >
        <select
          v-model="statusFilter"
          class="w-full border-gray-300 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">全部狀態</option>
          <option value="1">待付款</option>
          <option value="2">已付款</option>
          <option value="3">已出貨</option>
          <option value="4">已完成</option>
          <option value="5">已取消</option>
        </select>
      </div>
    </div>

    <!-- 訂單列表表格組件 -->
    <AdminOrderListTable
      :orders="filteredOrders"
      :loading="loading"
      @view-detail="openDetailModal"
    />

    <!-- 訂單詳情彈窗組件 -->
    <AdminOrderDetailModal
      v-model:visible="isModalOpen"
      :orderNo="selectedOrderNo"
      :currentStatus="selectedOrderCurrentStatus"
      @updated="fetchOrders"
    />
  </div>
</template>

<style scoped>
/* 保持原本的樣式或根據需要調整 */
</style>
