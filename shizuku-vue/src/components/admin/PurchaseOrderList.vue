<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '@/api/Product.js'

const router = useRouter()

const props = defineProps({
  purchaseOrders: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['refresh'])

const showDetailModal = ref(false)
const currentOrder = ref(null)

// 分頁
const currentPage = ref(1)
const pageSize = 15
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize))
const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

const keyword = ref('')
const filteredOrders = computed(() => {
  if (!keyword.value) return props.purchaseOrders
  const kw = keyword.value.toLowerCase()
  return props.purchaseOrders.filter(
    (o) =>
      o.fOrderNo?.toLowerCase().includes(kw) ||
      o.fSupplier?.toLowerCase().includes(kw) ||
      o.fType?.toLowerCase().includes(kw),
  )
})

const showEditModal = ref(false)
const editingOrder = ref(null)
const editingStatus = ref('已完成')

function editOrder(order) {
  editingOrder.value = order
  editingStatus.value = order.fStatus
  showEditModal.value = true
}

async function saveEditOrder() {
  try {
    await productApi.updatePurchaseOrderStatus(editingOrder.value.fId, editingStatus.value)
    showEditModal.value = false
    emit('refresh')
  } catch (err) {
    alert('更新失敗，請再試一次')
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const noSupplierTypes = ['報廢', '銷售退回', '調整進', '調整出', '進貨退出']

async function viewOrder(id) {
  const res = await productApi.getPurchaseOrder(id)
  currentOrder.value = res.data.data
  showDetailModal.value = true
}

function getTypeClass(type) {
  switch (type) {
    case '進貨':
      return 'bg-green-50 text-green-700 border border-green-100'
    case '銷售退回':
      return 'bg-green-50 text-green-600 border border-green-100'
    case '調整進':
      return 'bg-green-50 text-green-600 border border-green-100'
    case '調整出':
      return 'bg-red-50 text-red-600 border border-red-100'
    case '進貨退出':
      return 'bg-red-50 text-red-600 border border-red-100'
    case '報廢':
      return 'bg-red-50 text-red-700 border border-red-100'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

function getQuantityPrefix(type) {
  if (['進貨', '銷售退回', '調整進'].includes(type)) return '+'
  return '-'
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div
      class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center"
    >
      <div class="min-w-0">
        <h3 class="text-sm font-semibold text-slate-800">庫存異動紀錄</h3>
        <p class="mt-0.5 text-xs text-slate-400">共 {{ filteredOrders.length }} 筆資料</p>
      </div>

      <!-- 中間搜尋框 -->

      <div class="relative w-full md:ml-4 md:max-w-sm">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋單號、廠商、異動類型"
          class="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-8 text-xs text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
        <button
          v-if="keyword"
          @click="keyword = ''"
          class="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-slate-300 hover:bg-slate-100 hover:text-slate-500"
        >
          <i class="pi pi-times" style="font-size: 10px"></i>
        </button>
      </div>

      <button
        @click="router.push({ name: 'admin-inventory-create' })"
        class="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3.5 text-sm font-medium text-white transition hover:bg-indigo-700 md:ml-auto"
      >
        <i class="pi pi-plus" style="font-size: 11px"></i>
        新增異動單
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[1040px] text-sm">
        <thead class="bg-slate-50/80">
          <tr class="text-left text-xs uppercase tracking-wide text-slate-500">
            <th class="border-b border-slate-200 px-5 py-3 font-medium">狀態</th>
            <th class="border-b border-slate-200 px-5 py-3 font-medium">異動單號</th>
            <th class="border-b border-slate-200 px-5 py-3 font-medium">廠商 / 日期</th>
            <th class="border-b border-slate-200 px-5 py-3 text-right font-medium">數量</th>
            <th class="border-b border-slate-200 px-5 py-3 text-right font-medium">總金額</th>
            <th class="border-b border-slate-200 px-5 py-3 font-medium">異動類型</th>
            <th class="border-b border-slate-200 px-5 py-3 font-medium">付款方式</th>
            <th class="border-b border-slate-200 px-5 py-3 text-right font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="pagedOrders.length === 0">
            <td colspan="8" class="px-5 py-12 text-center text-sm text-slate-400">尚無異動紀錄</td>
          </tr>

          <tr v-for="order in pagedOrders" :key="order.fId" class="transition hover:bg-slate-50">
            <td class="px-5 py-4">
              <span
                :class="[
                  'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                  order.fStatus === '已完成'
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                    : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
                ]"
              >
                {{ order.fStatus }}
              </span>
            </td>

            <td class="px-5 py-4">
              <p class="font-mono text-sm font-semibold text-indigo-600">
                {{ order.fOrderNo }}
              </p>
            </td>

            <td class="px-5 py-4">
              <p class="font-medium text-slate-700">
                {{ order.fSupplier || '—' }}
              </p>
              <p class="mt-1 text-xs text-slate-400">
                {{ new Date(order.fCreatedAt).toLocaleDateString('zh-TW') }}
              </p>
            </td>

            <td class="px-5 py-4 text-right">
              <p class="font-semibold text-slate-700">
                {{ getQuantityPrefix(order.fType) }}{{ order.fTotalQuantity }} 件
              </p>
              <p class="mt-1 text-xs text-slate-400">{{ order.fItemCount }} 筆商品</p>
            </td>

            <td class="px-5 py-4 text-right">
              <p class="font-semibold text-slate-800">
                NT${{ order.fTotalAmount.toLocaleString() }}
              </p>
            </td>

            <td class="px-5 py-4">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                :class="getTypeClass(order.fType)"
              >
                {{ order.fType }}
              </span>
            </td>

            <td class="px-5 py-4 text-slate-500">
              {{ noSupplierTypes.includes(order.fType) ? '—' : order.fPaymentMethod || '—' }}
            </td>

            <td class="px-5 py-4">
              <div class="flex justify-end gap-1">
                <button
                  @click="viewOrder(order.fId)"
                  class="rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  查看
                </button>
                <button
                  @click="editOrder(order)"
                  class="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                  編輯
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分頁控制 -->
    <div
      v-if="totalPages > 1"
      class="flex flex-col gap-3 border-t border-slate-200 px-5 py-3 md:flex-row md:items-center md:justify-between"
    >
      <span class="text-xs text-slate-400">
        共 {{ filteredOrders.length }} 筆，第 {{ currentPage }} / {{ totalPages }} 頁
      </span>

      <div class="flex flex-wrap items-center gap-1">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <i class="pi pi-chevron-left" style="font-size: 10px"></i>
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-medium transition"
          :class="
            page === currentPage
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          "
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <i class="pi pi-chevron-right" style="font-size: 10px"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- 詳細 Modal -->
  <div
    v-if="showDetailModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click.self="showDetailModal = false"
  >
    <div
      class="bg-white rounded-xl w-full mx-4 flex flex-col"
      style="max-width: 900px; max-height: 90vh"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <div class="flex items-center gap-3">
          <span class="font-medium font-mono text-indigo-600 text-base">
            {{ currentOrder?.fOrderNo }}
          </span>
          <span
            class="px-2 py-0.5 rounded-full text-xs font-medium"
            :class="getTypeClass(currentOrder?.fType)"
          >
            {{ currentOrder?.fType }}
          </span>
          <span class="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            {{ currentOrder?.fStatus }}
          </span>
        </div>
        <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- 進貨單資訊 -->
      <div
        class="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0 text-xs"
      >
        <template v-if="!noSupplierTypes.includes(currentOrder?.fType)">
          <div>
            <p class="text-gray-400 mb-0.5">廠商</p>
            <p class="font-medium text-gray-700">{{ currentOrder?.fSupplier || '—' }}</p>
          </div>
          <div>
            <p class="text-gray-400 mb-0.5">付款方式</p>
            <p class="font-medium text-gray-700">{{ currentOrder?.fPaymentMethod || '—' }}</p>
          </div>
          <div>
            <p class="text-gray-400 mb-0.5">課稅別</p>
            <p class="font-medium text-gray-700">{{ currentOrder?.fTaxType || '—' }}</p>
          </div>
          <div>
            <p class="text-gray-400 mb-0.5">發票號碼</p>
            <p class="font-medium text-gray-700">{{ currentOrder?.fInvoiceNo || '—' }}</p>
          </div>
          <div>
            <p class="text-gray-400 mb-0.5">發票日期</p>
            <p class="font-medium text-gray-700">
              {{
                currentOrder?.fInvoiceDate
                  ? new Date(currentOrder.fInvoiceDate).toLocaleDateString('zh-TW')
                  : '—'
              }}
            </p>
          </div>
        </template>
        <div>
          <p class="text-gray-400 mb-0.5">建立日期</p>
          <p class="font-medium text-gray-700">
            {{ currentOrder ? new Date(currentOrder.fCreatedAt).toLocaleDateString('zh-TW') : '' }}
          </p>
        </div>
        <div class="col-span-2">
          <p class="text-gray-400 mb-0.5">備註</p>
          <p class="font-medium text-gray-700">{{ currentOrder?.fNote || '—' }}</p>
        </div>
      </div>

      <!-- 明細表格 -->
      <div class="overflow-y-auto flex-1 px-6 py-4">
        <table class="w-full text-xs">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                商品規格
              </th>
              <th
                class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100 w-20"
              >
                異動數量
              </th>
              <th
                class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100 w-24"
              >
                成本價
              </th>
              <th
                class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100 w-24"
              >
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
                <p class="text-xs font-mono text-slate-400 mt-0.5">{{ detail.fSkuCode }}</p>
                <p class="text-gray-400 mt-0.5">{{ detail.fColor }} / {{ detail.fSize }}</p>
              </td>
              <td class="px-3 py-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full font-medium text-xs',
                    ['進貨', '銷售退回', '調整進'].includes(currentOrder?.fType)
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-500',
                  ]"
                >
                  {{ ['進貨', '銷售退回', '調整進'].includes(currentOrder?.fType) ? '+' : '-'
                  }}{{ detail.fQuantity }}
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

      <!-- 底部合計 -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 shrink-0">
        <div class="flex justify-between items-end">
          <div class="text-xs text-gray-500">
            <template v-if="!noSupplierTypes.includes(currentOrder?.fType)">
              總數量：<strong class="text-gray-700">{{ currentOrder?.fTotalQuantity }} 件</strong>
            </template>
          </div>
          <div class="text-right space-y-1 text-xs text-gray-500">
            <template v-if="!noSupplierTypes.includes(currentOrder?.fType)">
              <div class="flex justify-between gap-16">
                <span>未稅金額</span>
                <span class="text-gray-700"
                  >NT${{ currentOrder?.fUntaxedAmount?.toLocaleString() }}</span
                >
              </div>
              <div class="flex justify-between gap-16">
                <span>稅額（{{ currentOrder?.fTaxType === '應稅' ? '5%' : '免稅' }}）</span>
                <span class="text-gray-700"
                  >NT${{ currentOrder?.fTaxAmount?.toLocaleString() }}</span
                >
              </div>
              <div class="flex justify-between gap-16 border-t border-gray-200 pt-1">
                <span class="font-medium text-gray-700">含稅總計</span>
                <strong class="text-indigo-600 text-sm"
                  >NT${{ currentOrder?.fTotalAmount?.toLocaleString() }}</strong
                >
              </div>
            </template>
            <template v-else>
              總數量：<strong class="text-gray-700">{{ currentOrder?.fTotalQuantity }} 件</strong>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 編輯狀態 Modal -->
  <div
    v-if="showEditModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click.self="showEditModal = false"
  >
    <div class="bg-white rounded-xl w-full mx-4 max-w-sm">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 class="font-medium">編輯異動單狀態</h3>
        <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times"></i>
        </button>
      </div>
      <!-- Body -->
      <div class="px-6 py-4 space-y-3">
        <div>
          <p class="text-xs text-gray-400 mb-1">異動單號</p>
          <p class="text-sm font-mono text-indigo-600">{{ editingOrder?.fOrderNo }}</p>
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1 block">狀態</label>
          <select
            v-model="editingStatus"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white"
          >
            <option value="已完成">已完成</option>
            <option value="未處理">未處理</option>
          </select>
        </div>
        <p class="text-xs text-amber-500" v-if="editingStatus === '已完成'">
          ⚠️ 改為已完成後，庫存將自動更新
        </p>
      </div>
      <!-- Footer -->
      <div class="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
        <button
          @click="showEditModal = false"
          class="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
        <button
          @click="saveEditOrder"
          class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          儲存
        </button>
      </div>
    </div>
  </div>
</template>
