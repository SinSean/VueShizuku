<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import {
  getAdminOrderDetailAPI,
  updateOrderStatusAPI,
  cancelOrderForAdminAPI,
} from '@/api/adminOrder'
import { orderStatusManager, ORDER_STATUS } from '@/services/orderStatusManager'
import OrderProgressStepper from '@/components/orderDetails/OrderProgressStepper.vue'
import OrderDeliveryPayment from '@/components/orderDetails/OrderDeliveryPayment.vue'
import OrderProductList from '@/components/orderDetails/OrderProductList.vue'
import OrderAmountSummary from '@/components/orderDetails/OrderAmountSummary.vue'

const props = defineProps({
  visible: Boolean,
  orderNo: String,
  currentStatus: Number, // 傳入目前的狀態碼作為初始值
})

const emit = defineEmits(['update:visible', 'updated'])
const toast = useToast()

const loading = ref(false)
const selectedOrder = ref(null)
const selectedOrderDetails = ref([])
const newStatus = ref(1)

// 監聽 orderNo 變化，開啟時抓取資料
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal && props.orderNo) {
      await fetchDetail()
      newStatus.value = props.currentStatus || 1
    }
  },
)

const fetchDetail = async () => {
  try {
    loading.value = true
    const res = await getAdminOrderDetailAPI(props.orderNo)
    if (res.success) {
      // 進行資料結構防禦性相容包裝，確保完全支援前台元件所需的 subtotal, discount, shippingFee 等欄位
      const orderData = res.data
      const items = orderData.items || []
      const computedSubtotal = items.reduce(
        (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0),
        0,
      )

      selectedOrder.value = {
        ...orderData,
        subtotal: orderData.subtotal !== undefined ? orderData.subtotal : computedSubtotal,
        shippingFee: orderData.shippingFee !== undefined ? orderData.shippingFee : 0,
        discount: orderData.discount !== undefined ? orderData.discount : 0,
        totalAmount:
          orderData.totalAmount !== undefined
            ? orderData.totalAmount
            : orderData.total || computedSubtotal,
      }
      selectedOrderDetails.value = items
    }
  } catch (error) {
    console.error('Fetch Detail Error:', error)
    toast.add({
      severity: 'error',
      summary: '讀取詳情失敗',
      detail: '無法載入該筆訂單明細。',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const saveStatus = async () => {
  if (!selectedOrder.value) return
  if (!orderStatusManager.isValidTransition(selectedOrder.value.status, Number(newStatus.value))) {
    if (!confirm(`偵測到非標準的狀態跳轉，您確定要手動強改訂單狀態嗎？`)) {
      return
    }
  } else {
    if (!confirm('確定要更新此訂單的狀態嗎？')) return
  }

  try {
    let res
    if (Number(newStatus.value) === ORDER_STATUS.CANCELLED) {
      res = await cancelOrderForAdminAPI(selectedOrder.value.orderNo)
    } else {
      res = await updateOrderStatusAPI(selectedOrder.value.orderNo, Number(newStatus.value))
    }

    if (res.success) {
      toast.add({
        severity: 'success',
        summary: '更新狀態成功',
        detail: '訂單狀態已成功更新！',
        life: 2000,
      })
      emit('updated')
      emit('update:visible', false)
    } else {
      toast.add({
        severity: 'error',
        summary: '更新狀態失敗',
        detail: res.message || '無法儲存新的訂單狀態。',
        life: 3000,
      })
    }
  } catch (error) {
    console.error('Update Status Error:', error)
    toast.add({
      severity: 'error',
      summary: '系統連線錯誤',
      detail: '發生未知錯誤，請聯絡客服人員或稍後再試。',
      life: 3000,
    })
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    :header="'訂單明細 ' + (orderNo || '')"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="admin-order-detail-dialog"
  >
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
      <p class="text-gray-500">正在讀取訂單資料...</p>
    </div>

    <div v-else-if="selectedOrder" class="space-y-6 pt-2">
      <!-- 配送與收件人資訊：重用前台精美卡片元件 -->
      <OrderDeliveryPayment :order="selectedOrder" />

      <OrderProgressStepper :order="selectedOrder" />

      <!-- 商品清單與結帳明細：重用前台左右兩欄的商品細目與圖片卡片元件 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderProductList :items="selectedOrderDetails" />
        <OrderAmountSummary :order="selectedOrder" />
      </div>

      <!-- 後台更改狀態區 -->
      <div class="bg-blue-50 p-5 rounded-lg border border-blue-200 mt-6 shadow-sm">
        <h3 class="font-bold text-blue-800 mb-3 flex items-center">
          <i class="pi pi-cog mr-2"></i>
          後台管理：更新訂單狀態
        </h3>
        <div class="flex flex-wrap items-center gap-4">
          <select
            v-model="newStatus"
            class="border border-blue-300 bg-white rounded-md px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none font-medium"
          >
            <!-- 為了防止破壞金流一致性，禁止手動切換至待付款/已付款 -->
            <!-- 僅當目前狀態是 PENDING 或 PAID 時，才顯示該選項且設為禁用 (Disabled)，避免下拉選單空白 -->
            <option
              v-if="selectedOrder?.status === ORDER_STATUS.PENDING"
              :value="ORDER_STATUS.PENDING"
              disabled
            >
              未付款
            </option>
            <option
              v-if="selectedOrder?.status === ORDER_STATUS.PAID"
              :value="ORDER_STATUS.PAID"
              disabled
            >
              已付款
            </option>

            <option
              :value="ORDER_STATUS.SHIPPING"
              :disabled="
                selectedOrder?.status < ORDER_STATUS.PAID ||
                selectedOrder?.status >= ORDER_STATUS.SHIPPING
              "
            >
              已出貨
            </option>
            <option
              :value="ORDER_STATUS.DELIVERED"
              :disabled="
                selectedOrder?.status < ORDER_STATUS.SHIPPING ||
                selectedOrder?.status >= ORDER_STATUS.DELIVERED
              "
            >
              已完成
            </option>
            <option
              :value="ORDER_STATUS.CANCELLED"
              :disabled="selectedOrder?.status === ORDER_STATUS.CANCELLED"
            >
              訂單取消
            </option>
          </select>
          <button
            @click="saveStatus"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow transition-colors flex-1 md:flex-none"
          >
            確定儲存
          </button>
        </div>
        <p
          v-if="Number(newStatus) === ORDER_STATUS.CANCELLED"
          class="text-sm text-red-600 mt-3 font-bold bg-red-50 p-2 rounded inline-block border border-red-200"
        >
          <i class="pi pi-exclamation-triangle mr-1"></i>
          注意：選擇取消將會觸發「庫存回補」，請謹慎操作。
        </p>
      </div>
    </div>
  </Dialog>
</template>

<style scoped></style>
