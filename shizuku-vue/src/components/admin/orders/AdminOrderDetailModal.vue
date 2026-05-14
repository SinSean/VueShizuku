<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog'
import { getAdminOrderDetailAPI, updateOrderStatusAPI, cancelOrderForAdminAPI } from '@/api/adminOrder'

const props = defineProps({
  visible: Boolean,
  orderNo: String,
  currentStatus: Number // 傳入目前的狀態碼作為初始值
})

const emit = defineEmits(['update:visible', 'updated'])

const loading = ref(false)
const selectedOrder = ref(null)
const selectedOrderDetails = ref([])
const newStatus = ref(1)

// 監聽 orderNo 變化，開啟時抓取資料
watch(() => props.visible, async (newVal) => {
  if (newVal && props.orderNo) {
    await fetchDetail()
    newStatus.value = props.currentStatus || 1
  }
})

const fetchDetail = async () => {
  try {
    loading.value = true
    const res = await getAdminOrderDetailAPI(props.orderNo)
    if (res.success) {
      selectedOrder.value = res.data
      selectedOrderDetails.value = res.data.items || []
    }
  } catch (error) {
    console.error('Fetch Detail Error:', error)
  } finally {
    loading.value = false
  }
}

const saveStatus = async () => {
  if (!selectedOrder.value) return
  if (!confirm('確定要更新此訂單的狀態嗎？')) return

  try {
    let res
    if (newStatus.value == 5) {
      res = await cancelOrderForAdminAPI(selectedOrder.value.orderNo)
    } else {
      res = await updateOrderStatusAPI(selectedOrder.value.orderNo, Number(newStatus.value))
    }

    if (res.success) {
      alert('狀態更新成功！')
      emit('updated')
      emit('update:visible', false)
    } else {
      alert(res.message || '更新失敗')
    }
  } catch (error) {
    console.error('Update Status Error:', error)
    alert('系統發生錯誤')
  }
}

const getShippingStatusUI = (status) => {
  const map = {
    1: { text: '尚未出貨', color: 'bg-gray-100 text-gray-500', icon: 'pi pi-box' },
    2: { text: '理貨中 (準備出貨)', color: 'bg-blue-100 text-blue-600', icon: 'pi pi-spin pi-spinner' },
    3: { text: '已交寄 (配送中)', color: 'bg-orange-100 text-orange-600', icon: 'pi pi-truck' },
    4: { text: '已送達', color: 'bg-green-100 text-green-600', icon: 'pi pi-check-circle' },
    5: { text: '訂單已取消', color: 'bg-red-100 text-red-600', icon: 'pi pi-times-circle' },
  }
  return map[status] || { text: '未知狀態', color: 'bg-gray-100 text-gray-400', icon: 'pi pi-question-circle' }
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
      <!-- 收件資訊 -->
      <div class="bg-white p-4 rounded-lg border shadow-sm">
        <h3 class="font-bold text-gray-800 mb-3 border-b pb-2">收件人資訊</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p>
            <span class="text-gray-500 w-16 inline-block">姓名：</span>
            <span class="font-medium text-gray-800">{{ selectedOrder.receiverName }}</span>
          </p>
          <p>
            <span class="text-gray-500 w-16 inline-block">電話：</span>
            <span class="font-medium text-gray-800">{{ selectedOrder.receiverPhone }}</span>
          </p>
          <p class="md:col-span-2">
            <span class="text-gray-500 w-16 inline-block">地址：</span>
            <span class="font-medium text-gray-800">{{ selectedOrder.receiverAddress }}</span>
          </p>
          <p class="md:col-span-2">
            <span class="text-gray-500 w-16 inline-block">備註：</span>
            <span class="font-medium text-gray-800">{{ selectedOrder.note || '無' }}</span>
          </p>
        </div>
      </div>

      <!-- 出貨狀態顯示列 -->
      <div class="mt-2 pt-3 border-t border-dashed border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-gray-500 font-medium">目前出貨進度：</span>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1',
              getShippingStatusUI(newStatus).color,
            ]"
          >
            <i :class="getShippingStatusUI(newStatus).icon"></i>
            {{ getShippingStatusUI(newStatus).text }}
          </span>
        </div>
        <span class="text-xs text-gray-400 italic">依照下方管理選單更新狀態</span>
      </div>

      <!-- 商品清單 -->
      <div>
        <h3 class="font-bold text-gray-800 mb-3">購買商品</h3>
        <div class="border rounded-lg overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="p-3 font-semibold text-gray-600">商品名稱</th>
                <th class="p-3 font-semibold text-gray-600">規格</th>
                <th class="p-3 font-semibold text-gray-600 text-right">單價</th>
                <th class="p-3 font-semibold text-gray-600 text-right">數量</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in selectedOrderDetails" :key="index" class="hover:bg-gray-50">
                <td class="p-3 font-medium text-gray-800">{{ item.productName }}</td>
                <td class="p-3 text-gray-500">{{ item.variantName || '無' }}</td>
                <td class="p-3 text-right">NT$ {{ item.unitPrice?.toLocaleString() }}</td>
                <td class="p-3 text-right font-medium">{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 text-right text-xl font-bold text-red-600">
          總計: NT$ {{ selectedOrder.totalAmount?.toLocaleString() }}
        </div>
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
            <option :value="1">待付款 (未處理)</option>
            <option :value="2">已付款 (準備出貨)</option>
            <option :value="3">已出貨 (物流配送中)</option>
            <option :value="4">已完成 (包裹已送達)</option>
            <option :value="5">已取消 (退款並回補庫存)</option>
          </select>
          <button
            @click="saveStatus"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow transition-colors flex-1 md:flex-none"
          >
            確定儲存
          </button>
        </div>
        <p
          v-if="newStatus == 5"
          class="text-sm text-red-600 mt-3 font-bold bg-red-50 p-2 rounded inline-block border border-red-200"
        >
          <i class="pi pi-exclamation-triangle mr-1"></i>
          注意：選擇取消將會觸發「庫存回補」，請謹慎操作。
        </p>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
/* 可以在這裡加入 Dialog 的自訂樣式 */
</style>
