<script setup>
import { ref, computed, onMounted } from 'vue'
import { productApi } from '@/api/Product.js'

const inventory = ref([]) // InventoryProductDto 列表
const stockRecords = ref([]) // 進貨紀錄
const isLoading = ref(true)
const activeTab = ref('inventory')
const keyword = ref('')
const expandedIds = ref(new Set())
const baseUrl = 'https://localhost:7197'
const defaultImg = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'

// 新增進貨表單
const form = ref({
  fVariantId: null,
  fQuantity: null,
  fCostPrice: null,
  fNote: '',
  fType: '進貨',
})

// 統計卡片
const totalStock = computed(() => inventory.value.reduce((a, p) => a + (p.fTotalStock ?? 0), 0))
const lowStockCount = computed(
  () =>
    inventory.value.flatMap((p) => p.fVariants ?? []).filter((v) => v.fStock > 0 && v.fStock <= 5)
      .length,
)
const outOfStockCount = computed(
  () => inventory.value.flatMap((p) => p.fVariants ?? []).filter((v) => v.fStock === 0).length,
)
const avgProfit = computed(() => {
  const allVariants = inventory.value.flatMap((p) => p.fVariants ?? [])
  const items = allVariants.filter((v) => v.fCostPrice > 0 && v.fPrice > 0)
  if (items.length === 0) return 0
  const total = items.reduce((a, v) => a + ((v.fPrice - v.fCostPrice) / v.fPrice) * 100, 0)
  return Math.round(total / items.length)
})

// 篩選商品
const filteredInventory = computed(() => {
  if (!keyword.value) return inventory.value
  return inventory.value.filter(
    (p) => p.fProductName?.includes(keyword.value) || p.fProduct?.includes(keyword.value),
  )
})

// 展開/收合
function toggleExpand(id) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
}

// 庫存狀態
function stockStatusClass(status) {
  if (status === '售完') return 'bg-red-50 text-red-500'
  if (status === '低庫存') return 'bg-amber-50 text-amber-500'
  return 'bg-green-50 text-green-600'
}

// 毛利率
function profitRate(costPrice, price) {
  if (!costPrice || !price || price === 0) return null
  return Math.round(((price - costPrice) / price) * 100)
}

// 載入資料
async function loadData() {
  try {
    isLoading.value = true
    const [inventoryRes, recordsRes] = await Promise.all([
      productApi.getInventory(),
      productApi.getStockRecords(),
    ])
    inventory.value = inventoryRes.data.data ?? []
    stockRecords.value = recordsRes.data.data ?? []

    // 預設全部展開
    inventory.value.forEach((p) => expandedIds.value.add(p.fProductId))
  } catch (err) {
    console.error('載入失敗', err)
  } finally {
    isLoading.value = false
  }
}

// 新增進貨
async function addStockRecord() {
  if (!form.value.fVariantId) {
    alert('請選擇商品規格')
    return
  }
  if (!form.value.fQuantity || form.value.fQuantity <= 0) {
    alert('請填寫進貨數量')
    return
  }

  try {
    await productApi.addStockRecord(form.value)
    form.value = { fVariantId: null, fQuantity: null, fCostPrice: null, fNote: '', fType: '進貨' }
    await loadData()
    alert('進貨成功！')
  } catch (err) {
    console.error('進貨失敗', err)
    alert('進貨失敗，請再試一次')
  }
}

onMounted(loadData)
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-xl font-medium">庫存管理</h1>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-400 mb-1">總庫存量</p>
        <p class="text-2xl font-medium">{{ totalStock.toLocaleString() }}</p>
        <p class="text-xs text-gray-300 mt-1">件商品庫存</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-400 mb-1">低庫存警示</p>
        <p class="text-2xl font-medium text-amber-500">{{ lowStockCount }}</p>
        <p class="text-xs text-gray-300 mt-1">筆規格庫存不足 5</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-400 mb-1">售完規格</p>
        <p class="text-2xl font-medium text-red-400">{{ outOfStockCount }}</p>
        <p class="text-xs text-gray-300 mt-1">筆規格已售完</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-xs text-gray-400 mb-1">平均毛利率</p>
        <p class="text-2xl font-medium text-green-500">{{ avgProfit }}%</p>
        <p class="text-xs text-gray-300 mt-1">全商品平均</p>
      </div>
    </div>

    <!-- 新增進貨 -->
    <div class="bg-white rounded-xl border border-gray-100 p-5">
      <h3 class="text-sm font-medium mb-4 pb-3 border-b border-gray-100">新增進貨</h3>
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-3 items-end">
        <div class="xl:col-span-2">
          <label class="text-xs text-gray-400 mb-1.5 block">商品規格</label>
          <select
            v-model="form.fVariantId"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white"
          >
            <option :value="null">選擇規格</option>
            <template v-for="p in inventory" :key="p.fProductId">
              <option v-for="v in p.fVariants" :key="v.fVariantId" :value="v.fVariantId">
                {{ p.fProductName }} / {{ v.fColor }} / {{ v.fSize }}
              </option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1.5 block">進貨數量</label>
          <input
            v-model="form.fQuantity"
            type="number"
            min="1"
            placeholder="0"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1.5 block">成本價（NT$）</label>
          <input
            v-model="form.fCostPrice"
            type="number"
            min="0"
            placeholder="選填"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label class="text-xs text-gray-400 mb-1.5 block">備註</label>
          <input
            v-model="form.fNote"
            type="text"
            placeholder="選填"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>
      <div class="mt-3 flex justify-end">
        <button
          @click="addStockRecord"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          新增進貨
        </button>
      </div>
    </div>

    <!-- Tab 切換 -->
    <div class="bg-white rounded-xl border border-gray-100 p-5">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div class="flex gap-4">
          <button
            @click="activeTab = 'inventory'"
            :class="[
              'text-sm font-medium pb-1 transition-colors',
              activeTab === 'inventory'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-400 hover:text-gray-600',
            ]"
          >
            庫存總覽
          </button>
          <button
            @click="activeTab = 'records'"
            :class="[
              'text-sm font-medium pb-1 transition-colors',
              activeTab === 'records'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-400 hover:text-gray-600',
            ]"
          >
            進貨紀錄
            <span class="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
              {{ stockRecords.length }}
            </span>
          </button>
        </div>
        <input
          v-if="activeTab === 'inventory'"
          v-model="keyword"
          type="text"
          placeholder="搜尋商品..."
          class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400 w-48"
        />
      </div>

      <!-- 庫存總覽 -->
      <div v-if="activeTab === 'inventory'">
        <div v-if="isLoading" class="text-center text-gray-400 py-10 text-sm">載入中...</div>
        <table v-else class="w-full text-xs">
          <thead>
            <tr class="bg-gray-50">
              <th
                class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100 w-8"
              ></th>
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                商品
              </th>
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                總庫存
              </th>
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                售價
              </th>
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                狀態
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="product in filteredInventory" :key="product.fProductId">
              <!-- 商品主列 -->
              <tr
                class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                @click="toggleExpand(product.fProductId)"
              >
                <td class="px-3 py-3 text-gray-400">
                  <i
                    :class="
                      expandedIds.has(product.fProductId)
                        ? 'pi pi-chevron-down'
                        : 'pi pi-chevron-right'
                    "
                    style="font-size: 11px"
                  ></i>
                </td>
                <td class="px-3 py-3">
                  <div class="flex items-center gap-3">
                    <img
                      :src="product.fImage ? baseUrl + product.fImage : defaultImg"
                      class="w-10 h-10 object-cover rounded-lg border border-gray-100"
                    />
                    <div>
                      <p class="font-medium text-gray-700">{{ product.fProductName }}</p>
                      <p class="text-gray-400 mt-0.5 font-mono">{{ product.fProduct }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3 font-medium">{{ product.fTotalStock }} 件</td>
                <td class="px-3 py-3 text-gray-400">
                  NT${{ product.fVariants?.[0]?.fPrice?.toLocaleString() }}
                </td>
                <td class="px-3 py-3">
                  <span class="text-gray-400 text-xs">
                    {{ product.fVariants?.length }} 個規格
                  </span>
                </td>
              </tr>

              <!-- 規格子列 -->
              <template v-if="expandedIds.has(product.fProductId)">
                <tr
                  v-for="variant in product.fVariants"
                  :key="variant.fVariantId"
                  class="border-b border-gray-50 bg-gray-50/50"
                >
                  <td class="px-3 py-2"></td>
                  <td class="px-3 py-2 pl-16">
                    <span class="text-gray-500">{{ variant.fColor }} / {{ variant.fSize }}</span>
                  </td>
                  <td
                    class="px-3 py-2"
                    :class="
                      variant.fStock === 0
                        ? 'text-red-400 font-medium'
                        : variant.fStock <= 5
                          ? 'text-amber-500 font-medium'
                          : 'text-gray-600'
                    "
                  >
                    {{ variant.fStock }} 件
                  </td>
                  <td class="px-3 py-2 text-gray-400">NT${{ variant.fPrice?.toLocaleString() }}</td>
                  <td class="px-3 py-2">
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-xs',
                        stockStatusClass(variant.fStockStatus),
                      ]"
                    >
                      {{ variant.fStockStatus }}
                    </span>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>

      <!-- 進貨紀錄 -->
      <div v-if="activeTab === 'records'">
        <table class="w-full text-xs">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                日期
              </th>
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
                備註
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="stockRecords.length === 0">
              <td colspan="5" class="text-center text-gray-300 py-8">尚無進貨紀錄</td>
            </tr>
            <tr
              v-for="record in stockRecords"
              :key="record.fId"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50"
            >
              <td class="px-3 py-3 text-gray-400">
                {{ new Date(record.fCreatedAt).toLocaleDateString('zh-TW') }}
              </td>
              <td class="px-3 py-3">
                <p class="font-medium text-gray-700">{{ record.fProductName }}</p>
                <p class="text-gray-400 mt-0.5">{{ record.fColor }} / {{ record.fSize }}</p>
              </td>
              <td class="px-3 py-3">
                <span class="px-2 py-1 bg-green-50 text-green-600 rounded-full font-medium">
                  +{{ record.fQuantity }}
                </span>
              </td>
              <td class="px-3 py-3 text-gray-400">
                {{ record.fCostPrice ? `NT$${record.fCostPrice.toLocaleString()}` : '—' }}
              </td>
              <td class="px-3 py-3 text-gray-400">
                {{ record.fNote || '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
