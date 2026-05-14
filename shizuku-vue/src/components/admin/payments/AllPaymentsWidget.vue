<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePaymentAdmin } from '@/composables/usePaymentAdmin'
import PaymentLogDialog from '@/components/admin/payments/PaymentLogDialog.vue'

const { transactions, loading, fetchTransactions, getStatusInfo, formatDate } = usePaymentAdmin()

const searchQuery = ref('')
const logDialogVisible = ref(false)
const selectedTransaction = ref(null)

const openLogs = (data) => {
  selectedTransaction.value = data
  logDialogVisible.value = true
}

// 模糊搜尋邏輯
const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value
  const keyword = searchQuery.value.toLowerCase()
  return transactions.value.filter(
    (t) =>
      t.fTransactionNo?.toLowerCase().includes(keyword) ||
      t.orderNo?.toLowerCase().includes(keyword) ||
      t.methodName?.toLowerCase().includes(keyword),
  )
})

onMounted(fetchTransactions)
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- 標題與重新整理 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800"></h1>
      <button
        @click="fetchTransactions"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center gap-2"
      >
        <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
        重新整理
      </button>
    </div>

    <!-- 搜尋區塊 -->
    <div class="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div class="max-w-md">
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋關鍵字..."
            class="w-full border-gray-300 border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- 交易列表表格 -->
    <div class="bg-white rounded-lg shadow-sm border overflow-x-auto">
      <table class="min-w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-sm border-b">
            <th class="py-3 px-4 font-semibold">支付單號</th>
            <th class="py-3 px-4 font-semibold">訂單號碼</th>
            <th class="py-3 px-4 font-semibold">付款方式</th>
            <th class="py-3 px-4 font-semibold text-right">金額</th>
            <th class="py-3 px-4 font-semibold text-center">狀態</th>
            <th class="py-3 px-4 font-semibold text-center">建立時間</th>
            <th class="py-3 px-4 font-semibold text-center">操作</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-gray-100">
          <tr v-if="loading">
            <td colspan="7" class="py-8 text-center text-gray-500">
              <i class="pi pi-spin pi-spinner mr-2"></i>資料載入中...
            </td>
          </tr>
          <tr v-else-if="filteredTransactions.length === 0">
            <td colspan="7" class="py-8 text-center text-gray-500">找不到符合條件的交易紀錄</td>
          </tr>
          <tr
            v-else
            v-for="data in filteredTransactions"
            :key="data.fTransactionNo"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 font-mono text-gray-800">{{ data.fTransactionNo }}</td>
            <td class="py-3 px-4 font-mono text-blue-600 font-medium">{{ data.orderNo }}</td>
            <td class="py-3 px-4 text-gray-600">
              <span class="flex items-center gap-2">
                <i
                  :class="
                    data.methodName?.includes('LINE')
                      ? 'pi pi-mobile text-green-500'
                      : 'pi pi-credit-card text-blue-500'
                  "
                ></i>
                {{ data.methodName }}
              </span>
            </td>
            <td class="py-3 px-4 text-right font-bold text-gray-900">
              NT$ {{ data.fAmount?.toLocaleString() }}
            </td>
            <td class="py-3 px-4 text-center">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-800': data.fStatus === 1,
                  'bg-red-100 text-red-800': data.fStatus === 0,
                  'bg-yellow-100 text-yellow-800': data.fStatus === 2,
                }"
              >
                <i
                  :class="
                    data.fStatus === 1
                      ? 'pi pi-check-circle'
                      : data.fStatus === 0
                        ? 'pi pi-times-circle'
                        : 'pi pi-clock'
                  "
                  class="mr-1"
                ></i>
                {{ getStatusInfo(data.fStatus).label }}
              </span>
            </td>
            <td class="py-3 px-4 text-center text-gray-500">
              {{ formatDate(data.fCreatedAt) }}
            </td>
            <td class="py-3 px-4 text-center">
              <button
                @click="openLogs(data)"
                class="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center justify-center mx-auto gap-1"
              >
                <i class="pi pi-file-edit text-xs"></i>
                日誌
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 金流日誌彈窗 -->
    <PaymentLogDialog v-model:visible="logDialogVisible" :transaction="selectedTransaction" />
  </div>
</template>

<style scoped>
/* 保持簡約風格 */
</style>
