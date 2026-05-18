<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { getPendingRefundsAPI, approveRefundAPI, rejectRefundAPI } from '@/api/adminOrder'

const toast = useToast()
const refundOrders = ref([])
const loading = ref(true)

// 載入待退款訂單清單
const loadRefunds = async () => {
  loading.value = true
  try {
    const res = await getPendingRefundsAPI()
    if (res && res.success) {
      refundOrders.value = res.data || []
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: '載入失敗', detail: '無法取得退款訂單清單', life: 4000 })
  } finally {
    loading.value = false
  }
}

// 核准退款
const handleApprove = async (orderNo) => {
  if (!confirm(`確定要核准 ${orderNo} 的退款嗎？此操作會呼叫金流退款 API 並回補庫存。`)) return

  try {
    const res = await approveRefundAPI(orderNo)
    if (res && res.success) {
      toast.add({ severity: 'success', summary: '退款成功', detail: res.message, life: 5000 })
      await loadRefunds() // 重新載入清單
    } else {
      toast.add({ severity: 'error', summary: '退款失敗', detail: res?.message || '退款操作失敗', life: 5000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: '系統錯誤', detail: '退款操作發生異常', life: 5000 })
  }
}

// 駁回退款
const handleReject = async (orderNo) => {
  const reason = prompt('請輸入駁回原因：')
  if (!reason) return

  try {
    const res = await rejectRefundAPI(orderNo, reason)
    if (res && res.success) {
      toast.add({ severity: 'warn', summary: '已駁回', detail: res.message, life: 4000 })
      await loadRefunds()
    } else {
      toast.add({ severity: 'error', summary: '駁回失敗', detail: res?.message || '駁回操作失敗', life: 4000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: '系統錯誤', detail: '駁回操作發生異常', life: 4000 })
  }
}

onMounted(() => loadRefunds())
</script>

<template>
  <div class="h-full flex flex-col gap-6 p-6 bg-gray-50">
    <!-- 頂部統計區 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
          <i class="pi pi-undo text-white text-xl"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">待處理退款</p>
          <p class="text-3xl font-black text-gray-800">{{ refundOrders.length }}</p>
        </div>
      </div>
      <Button
        label="重新整理"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        size="small"
        :loading="loading"
        @click="loadRefunds"
      />
    </div>

    <!-- 退款列表 -->
    <div class="flex-1 overflow-auto">
      <DataTable
        :value="refundOrders"
        :loading="loading"
        stripedRows
        :paginator="refundOrders.length > 10"
        :rows="10"
        emptyMessage="🎉 目前沒有待退款的訂單"
        class="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white"
        :pt="{
          header: { class: 'bg-white' },
          bodyRow: { class: 'hover:bg-teal-50/30 transition-colors' },
        }"
      >
        <Column field="orderNo" header="訂單編號" sortable>
          <template #body="{ data }">
            <span class="font-mono font-bold text-gray-800">{{ data.orderNo }}</span>
          </template>
        </Column>

        <Column field="memberName" header="會員姓名">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
                {{ data.memberName?.charAt(0) || '?' }}
              </div>
              <span class="font-medium text-gray-700">{{ data.memberName }}</span>
            </div>
          </template>
        </Column>

        <Column field="totalAmount" header="退款金額" sortable>
          <template #body="{ data }">
            <span class="font-bold text-red-500 text-base">
              NT$ {{ data.totalAmount?.toLocaleString() }}
            </span>
          </template>
        </Column>

        <Column field="paymentMethod" header="付款管道">
          <template #body="{ data }">
            <Tag
              :value="data.paymentMethod"
              :severity="data.paymentMethod === 'LINE Pay' ? 'success' : data.paymentMethod === '貨到付款' ? 'warning' : 'info'"
              class="font-bold"
            />
          </template>
        </Column>

        <Column field="note" header="退款原因" style="max-width: 200px">
          <template #body="{ data }">
            <span class="text-sm text-gray-600 line-clamp-2">{{ data.note || '未填寫' }}</span>
          </template>
        </Column>

        <Column field="updatedAt" header="申請時間" sortable>
          <template #body="{ data }">
            <span class="text-xs text-gray-500">
              {{ new Date(data.updatedAt).toLocaleString('zh-TW') }}
            </span>
          </template>
        </Column>

        <Column header="操作" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                label="核准退款"
                icon="pi pi-check"
                severity="success"
                size="small"
                class="font-bold"
                @click="handleApprove(data.orderNo)"
              />
              <Button
                label="駁回"
                icon="pi pi-times"
                severity="danger"
                variant="outlined"
                size="small"
                class="font-bold"
                @click="handleReject(data.orderNo)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
