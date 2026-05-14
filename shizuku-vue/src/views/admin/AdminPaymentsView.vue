<script setup>
import { ref, onMounted } from 'vue'
import { usePaymentAdmin } from '@/composables/usePaymentAdmin'
import PaymentLogDialog from '@/components/admin/payments/PaymentLogDialog.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'

const { transactions, loading, fetchTransactions, getStatusInfo, formatDate } = usePaymentAdmin()

const logDialogVisible = ref(false)
const selectedTransaction = ref(null)

//設定搜尋過濾器
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const openLogs = (data) => {
  selectedTransaction.value = data
  logDialogVisible.value = true
}

onMounted(fetchTransactions)
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">金流對帳中心</h1>
      <Button icon="pi pi-refresh" @click="fetchTransactions" :loading="loading" />
    </div>

    <DataTable
      :value="transactions"
      :loading="loading"
      stripedRows
      paginator
      :rows="10"
      v-model:filters="filters"
      :globalFilterFields="['fTransactionNo', 'orderNo', 'methodName']"
    >
      <template #header>
        <div class="flex justify-end">
          <InputText v-model="filters['global'].value" placeholder="搜尋訂單或支付單號" />
        </div>
      </template>
      <Column field="fTransactionNo" header="支付單號" />
      <Column field="orderNo" header="訂單號碼" />
      <Column field="methodName" header="付款方式" />
      <Column field="fAmount" header="金額">
        <template #body="{ data }">${{ data.fAmount.toLocaleString() }}</template>
      </Column>
      <Column header="狀態">
        <template #body="{ data }">
          <Tag
            :value="getStatusInfo(data.fStatus).label"
            :severity="getStatusInfo(data.fStatus).severity"
          />
        </template>
      </Column>
      <Column header="建立時間">
        <template #body="{ data }">{{ formatDate(data.fCreatedAt) }}</template>
      </Column>
      <Column header="操作">
        <template #body="{ data }">
          <Button label="日誌" icon="pi pi-search" class="p-button-text" @click="openLogs(data)" />
        </template>
      </Column>
    </DataTable>

    <PaymentLogDialog v-model:visible="logDialogVisible" :transaction="selectedTransaction" />
  </div>
</template>
