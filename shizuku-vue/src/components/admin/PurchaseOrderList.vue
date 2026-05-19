<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '@/api/Product.js'

const router = useRouter()

const props = defineProps({
  purchaseOrders: { type: Array, default: () => [] },
})

const emit = defineEmits(['refresh'])

const showDetailModal = ref(false)
const currentOrder = ref(null)

async function viewOrder(id) {
  const res = await productApi.getPurchaseOrder(id)
  currentOrder.value = res.data.data
  showDetailModal.value = true
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 p-5">
    <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
      <h3 class="text-sm font-medium">進貨單列表</h3>
      <div class="flex gap-2">
        <button
          @click="router.push({ name: 'admin-products-create' })"
          class="flex items-center gap-1.5 px-3 py-2 border border-indigo-200 text-indigo-600 rounded-lg text-sm hover:bg-indigo-50 transition-colors"
        >
          <i class="pi pi-plus" style="font-size: 11px"></i>
          新增商品
        </button>
      </div>
    </div>

    <table class="w-full text-xs">
      <thead>
        <tr class="bg-gray-50">
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            進貨單號
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            廠商
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            日期
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            商品筆數
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            總數量
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            總金額
          </th>
          <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
            付款方式
          </th>
          <th class="px-3 py-2 border-b border-gray-100" style="width: 60px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="purchaseOrders.length === 0">
          <td colspan="8" class="text-center text-gray-300 py-8">尚無進貨紀錄</td>
        </tr>
        <tr
          v-for="order in purchaseOrders"
          :key="order.fId"
          class="border-b border-gray-50 last:border-0 hover:bg-gray-50"
        >
          <td class="px-3 py-3 font-mono font-medium text-indigo-600">{{ order.fOrderNo }}</td>
          <td class="px-3 py-3 text-gray-500">{{ order.fSupplier || '—' }}</td>
          <td class="px-3 py-3 text-gray-400">
            {{ new Date(order.fCreatedAt).toLocaleDateString('zh-TW') }}
          </td>
          <td class="px-3 py-3">{{ order.fItemCount }} 筆</td>
          <td class="px-3 py-3">{{ order.fTotalQuantity }} 件</td>
          <td class="px-3 py-3 font-medium">NT${{ order.fTotalAmount.toLocaleString() }}</td>
          <td class="px-3 py-3 text-gray-400">{{ order.fPaymentMethod || '—' }}</td>
          <td class="px-3 py-3">
            <button
              @click="viewOrder(order.fId)"
              class="text-xs text-indigo-500 hover:text-indigo-700"
            >
              查看
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 進貨單詳細 Modal -->
  <div
    v-if="showDetailModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click.self="showDetailModal = false"
  >
    <div class="bg-white rounded-xl w-full mx-4 max-w-2xl">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <span class="font-medium font-mono text-indigo-600">{{ currentOrder?.fOrderNo }}</span>
          <span class="ml-3 text-xs text-gray-400">{{ currentOrder?.fSupplier }}</span>
        </div>
        <button
          @click="router.push({ name: 'admin-inventory-create' })"
          class="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <i class="pi pi-plus" style="font-size: 11px"></i>
          新增進貨單
        </button>
      </div>
      <div
        class="px-6 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-3 gap-4 text-xs text-gray-500"
      >
        <div>
          日期：{{
            currentOrder ? new Date(currentOrder.fCreatedAt).toLocaleDateString('zh-TW') : ''
          }}
        </div>
        <div>付款方式：{{ currentOrder?.fPaymentMethod || '—' }}</div>
        <div>備註：{{ currentOrder?.fNote || '—' }}</div>
      </div>
      <div class="px-6 py-4 max-h-80 overflow-y-auto">
        <table class="w-full text-xs">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                商品規格
              </th>
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                進貨數量
              </th>
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                成本價
              </th>
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                小計
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="detail in currentOrder?.fDetails"
              :key="detail.fId"
              class="border-b border-gray-50 last:border-0"
            >
              <td class="px-3 py-3">
                <p class="font-medium text-gray-700">{{ detail.fProductName }}</p>
                <p class="text-gray-400 mt-0.5">{{ detail.fColor }} / {{ detail.fSize }}</p>
              </td>
              <td class="px-3 py-3">
                <span class="px-2 py-1 bg-green-50 text-green-600 rounded-full font-medium">
                  +{{ detail.fQuantity }}
                </span>
              </td>
              <td class="px-3 py-3 text-gray-400">
                {{ detail.fCostPrice ? `NT$${detail.fCostPrice.toLocaleString()}` : '—' }}
              </td>
              <td class="px-3 py-3 font-medium">
                {{ detail.fAmount ? `NT$${detail.fAmount.toLocaleString()}` : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between text-xs text-gray-500"
      >
        <span
          >總數量：<strong class="text-gray-700"
            >{{ currentOrder?.fTotalQuantity }} 件</strong
          ></span
        >
        <span
          >合計金額：<strong class="text-indigo-600 text-sm"
            >NT${{ currentOrder?.fTotalAmount.toLocaleString() }}</strong
          ></span
        >
      </div>
    </div>
  </div>
</template>
