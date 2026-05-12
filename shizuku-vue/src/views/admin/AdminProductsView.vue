<script setup>
import { ref, computed, onMounted } from 'vue'
import { productApi } from '@/api/Product.js'

// 商品列表資料
const products = ref([])

// 載入狀態
const isLoading = ref(false)

// 搜尋關鍵字
const keyword = ref('')

// 選擇的分類
const selectedCategoryId = ref(null)

// 目前 Tab（null=全部, 1=上架, 2=下架）
const activeTab = ref(null)

// 勾選的商品 ID
const selectedIds = ref([])
// Modal 狀態
const showStockModal = ref(false)

const editingProduct = ref(null)      // 目前編輯的商品
const editingVariants = ref([])       // 複製一份規格資料來編輯

// 開啟 Modal
function openStockModal(product) {
    editingProduct.value = product
    // ✨ 深拷貝，避免直接修改原始資料
    editingVariants.value = product.variants.map(v => ({ ...v }))
    showStockModal.value = true
}

// 關閉 Modal
function closeStockModal() {
    showStockModal.value = false
    editingProduct.value = null
    editingVariants.value = []
}

// 儲存庫存修改
async function saveStockModal() {
    try {
        await productApi.updateVariants(
            editingProduct.value.fId,
            editingVariants.value.map(v => ({
                fId:    v.fId,
                fStock: Number(v.fStock)
            }))
        )
        closeStockModal()
        await fetchProducts()
    } catch (err) {
        console.error('庫存更新失敗', err)
    }
}

// 頁面載入時抓商品資料

async function fetchProducts() {
    isLoading.value = true
    try {
        const res = await productApi.getList(keyword.value, selectedCategoryId.value)
        products.value = res.data.data ?? []
    } catch (err) {
        console.error('載入失敗', err)
    } finally {
        isLoading.value = false
    }
}

// 依照 Tab 篩選商品
const filteredProducts = computed(() => {
    if (activeTab.value === null) return products.value
    if (activeTab.value === 1)    return products.value.filter(p => p.fStatus === 1)
    if (activeTab.value === 2)    return products.value.filter(p => p.fStatus === 2)
    if (activeTab.value === 0)    return products.value.filter(p => p.fStatus === 0)
    // 加上售完的篩選
    if (activeTab.value === 'sold') return products.value.filter(p =>
        p.variants?.length > 0 &&
        p.variants.every(v => v.fStock === 0)
    )
    return products.value
})

// 各 Tab 的數量
const tabCounts = computed(() => ({
    all:     products.value.length,
    active:  products.value.filter(p => p.fStatus === 1).length,
    offline: products.value.filter(p => p.fStatus === 2).length,
    sold:    products.value.filter(p =>
        p.variants?.length > 0 &&
        p.variants.every(v => v.fStock === 0)
    ).length
}))

// 全選/取消全選
function toggleSelectAll(checked) {
    if (checked) {
        selectedIds.value = filteredProducts.value.map(p => p.fId)
    } else {
        selectedIds.value = []
    }
}

// 切換單一勾選
function toggleSelect(id) {
    if (selectedIds.value.includes(id)) {
        selectedIds.value = selectedIds.value.filter(i => i !== id)
    } else {
        selectedIds.value.push(id)
    }
}



async function batchOffline() {
    if (!confirm(`確定要下架 ${selectedIds.value.length} 件商品嗎？`)) return
    try {
        for (const id of selectedIds.value) {
            const product = products.value.find(p => p.fId === id)
            if (!product) continue
            await productApi.update(id, {
                fId:          product.fId,
                fName:        product.fName,
                fProduct:     product.fProduct,
                fPrice:       product.fPrice,
                fStatus:      2,              // ← 改成下架
                fCategoryId:  product.fCategoryId,
                fDescription: product.fDescription
            })
        }
        selectedIds.value = []
        await fetchProducts()
    } catch (err) {
        console.error('批次下架失敗', err)
    }
}

async function batchOnline() {
    if (!confirm(`確定要上架 ${selectedIds.value.length} 件商品嗎？`)) return
    try {
        for (const id of selectedIds.value) {
            const product = products.value.find(p => p.fId === id)
            if (!product) continue
            await productApi.update(id, {
                fId:          product.fId,
                fName:        product.fName,
                fProduct:     product.fProduct,
                fPrice:       product.fPrice,
                fStatus:      1,              // ← 改成上架
                fCategoryId:  product.fCategoryId,
                fDescription: product.fDescription
            })
        }
        selectedIds.value = []
        await fetchProducts()
    } catch (err) {
        console.error('批次上架失敗', err)
    }
}

async function batchDelete() {
    if (!confirm(`確定要刪除 ${selectedIds.value.length} 件商品嗎？`)) return
    try {
        for (const id of selectedIds.value) {
            await productApi.delete(id)
        }
        selectedIds.value = []
        await fetchProducts()
    } catch (err) {
        console.error('批次刪除失敗', err)
    }
}

// 切換單一商品上下架
async function toggleStatus(product) {
    const newStatus = product.fStatus === 1 ? 2 : 1
    await productApi.update(product.fId, { ...product, fStatus: newStatus })
    await fetchProducts()
}

// 刪除單一商品
async function deleteProduct(id) {
    if (!confirm('確定要刪除此商品嗎？')) return
    await productApi.delete(id)
    await fetchProducts()
}

// 更新規格庫存
async function updateStock(variant, newStock) {
    await productApi.updateVariants(variant.fProductId ?? 0, [
        { fId: variant.fId, fStock: Number(newStock) }
    ])
}

// 分類下拉選單資料
const categories = ref([])
onMounted(async () => {
    const res = await productApi.getDropdowns()
    console.log('分類資料：', res.data.data.categories)
    categories.value = res.data.data.categories ?? []
    await fetchProducts()
})

</script>

<template>
    <div class="p-6">

        <!-- 標題列 -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-xl font-medium">我的商品</h1>
                <p class="text-sm text-gray-400 mt-0.5">共 {{ products.length }} 件商品</p>
            </div>
            <button class="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                <i class="pi pi-plus text-sm"></i>
                新增商品
            </button>
        </div>

        <!-- Tab 切換 -->
        <div class="flex border-b border-gray-200 mb-4">
            <button v-for="tab in [
                { label: '全部',   value: null, count: tabCounts.all     },
                { label: '上架中', value: 1,    count: tabCounts.active  },
                { label: '下架',   value: 2,    count: tabCounts.offline },
                { label: '售完',   value: 'sold', count: tabCounts.sold  },
            ]" :key="tab.label"
                @click="activeTab = tab.value; selectedIds = []"
                class="px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px"
                :class="activeTab === tab.value
                    ? 'border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-600'">
                {{ tab.label }} ({{ tab.count }})
            </button>
        </div>

        <!-- 搜尋列 -->
        <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="relative">
                <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input v-model="keyword"
                       @keyup.enter="fetchProducts"
                       type="text"
                       placeholder="搜尋商品名稱、貨號..."
                       class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div class="relative">
                <i class="pi pi-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <select v-model="selectedCategoryId"
                        @change="fetchProducts"
                        class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white">
                    <option :value="null">全部分類</option>
                    <option v-for="cat in categories" :key="cat.fId" :value="cat.fId">
                        {{ cat.fFullName }}
                    </option>
                </select>
            </div>
        </div>

        <!-- 批次操作列（有勾選才顯示）-->
        <div v-if="selectedIds.length > 0"
             class="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg mb-3 text-sm">
            <span class="text-indigo-600 flex-1">已選取 <strong>{{ selectedIds.length }}</strong> 件商品</span>
            <button @click="batchOnline"
                    class="px-3 py-1.5 bg-green-50 text-green-700 border border-green-300 rounded-md text-xs font-medium hover:bg-green-100">
                批次上架
            </button>
            <button @click="batchOffline"
                    class="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-300 rounded-md text-xs font-medium hover:bg-amber-100">
                批次下架
            </button>
            <button @click="batchDelete"
                    class="px-3 py-1.5 bg-red-50 text-red-700 border border-red-300 rounded-md text-xs font-medium hover:bg-red-100">
                批次刪除
            </button>
        </div>

        <!-- 商品表格 -->
        <div class="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table class="w-full" style="table-layout:fixed">
                <colgroup>
                    <col style="width:40px">
                    <col style="width:52px">
                    <col>
                    <col style="width:80px">
                    <col style="width:100px">
                    <col style="width:80px">
                    <col style="width:80px">
                    <col style="width:110px">
                </colgroup>
                <thead class="bg-gray-50 text-xs text-gray-500">
                    <tr>
                        <th class="px-3 py-3 text-left">
                            <input type="checkbox"
                                   :checked="selectedIds.length === filteredProducts.length && filteredProducts.length > 0"
                                   @change="e => toggleSelectAll(e.target.checked)"
                                   aria-label="全選" />
                        </th>
                        <th></th>
                        <th class="px-3 py-3 text-left font-medium">商品</th>
                        <th class="px-3 py-3 text-left font-medium">已售出</th>
                        <th class="px-3 py-3 text-left font-medium">價格</th>
                        <th class="px-3 py-3 text-left font-medium">總庫存</th>
                        <th class="px-3 py-3 text-left font-medium">狀態</th>
                        <th class="px-3 py-3 text-left font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>

                    <!-- 載入中 -->
                    <tr v-if="isLoading">
                        <td colspan="8" class="text-center py-12 text-gray-400">載入中...</td>
                    </tr>

                    <!-- 沒有資料 -->
                    <tr v-else-if="filteredProducts.length === 0">
                        <td colspan="8" class="text-center py-12 text-gray-400">沒有符合的商品</td>
                    </tr>

                    <!-- 商品列 -->
                    <template v-else v-for="product in filteredProducts" :key="product.fId">

                        <!-- 主商品列 -->
<!-- 主商品列 -->
<tr class="border-t border-gray-50 hover:bg-gray-50 transition-colors">
    <td class="px-3 py-3">
        <input type="checkbox"
               :checked="selectedIds.includes(product.fId)"
               @change="toggleSelect(product.fId)"
               aria-label="選擇商品" />
    </td>
    <td class="px-2 py-3">
        <div class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
            <img v-if="product.fImage"
                 :src="product.fImage"
                 class="w-full h-full object-cover rounded-lg" />
            <i v-else class="pi pi-image text-sm"></i>
        </div>
    </td>

    <!--  商品名稱 + 鉛筆圖示 -->
    <td class="px-3 py-3">
    <div class="font-medium text-sm leading-snug">{{ product.fName }}</div>
    <div class="text-xs text-gray-400 mt-0.5">{{ product.fProduct }}</div>
</td>

    <!--  已售出 -->
    <td class="px-3 py-3 text-sm text-gray-500">—</td>

    <!--  價格 -->
    <td class="px-3 py-3 text-sm font-medium">NT${{ product.fPrice?.toLocaleString() }}</td>

    <!--  總庫存 -->
    <td class="px-3 py-3 text-sm">
        {{ product.variants?.reduce((a, v) => a + v.fStock, 0) ?? 0 }}
    </td>

    <!-- 狀態 -->
    <td class="px-3 py-3">
        <span :class="[
            'text-xs px-2 py-1 rounded-full font-medium',
            product.fStatus === 1 ? 'bg-green-50 text-green-700'  :
            product.fStatus === 2 ? 'bg-gray-100 text-gray-500'   :
            'bg-red-50 text-red-600'
        ]">
            {{ product.fStatus === 1 ? '上架中' : product.fStatus === 2 ? '下架' : '刪除' }}
        </span>
    </td>

    <!-- 操作 -->
    <td class="px-3 py-3">
        <div class="flex flex-col gap-1 items-start text-xs">
            <button class="text-indigo-500 hover:text-indigo-700">編輯</button>
            <button @click="toggleStatus(product)"
                    class="text-amber-500 hover:text-amber-700">
                {{ product.fStatus === 1 ? '下架' : '上架' }}
            </button>
            <button @click="deleteProduct(product.fId)"
                    class="text-red-400 hover:text-red-600">
                刪除
            </button>
        </div>
    </td>
</tr>

                        <!-- 規格列（預設全部顯示）-->
                       <!-- 規格列（預設全部顯示）-->
<tr v-for="variant in product.variants" :key="variant.fColor + variant.fSize"
    class="bg-gray-50 border-t border-gray-100 group">
    <td colspan="2"></td>
    <td class="px-3 py-2 text-xs text-gray-600 font-medium">
        {{ variant.fColor }} / {{ variant.fSize }}
    </td>
    <td></td>
    <td class="px-3 py-2 text-xs text-gray-400">
        NT${{ product.fPrice?.toLocaleString() }}
    </td>

    <!-- ✨ 庫存顯示 + hover 才顯示鉛筆 -->
    <td class="px-3 py-2">
        <div class="flex items-center gap-2">
            <span class="text-sm">{{ variant.fStock }}</span>
            <button @click="openStockModal(product)"
                    class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded transition-all"
                    title="編輯庫存">
                <i class="pi pi-pencil" style="font-size:11px"></i>
            </button>
        </div>
    </td>

    <td class="px-3 py-2">
        <span :class="['text-xs px-2 py-0.5 rounded-full',
            variant.fStock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500']">
            {{ variant.fStock > 0 ? '有庫存' : '售完' }}
        </span>
    </td>
    <td></td>
</tr>

                        <!-- 商品間隔 -->
                        <tr class="h-2 bg-gray-100">
                            <td colspan="8" class="p-0"></td>
                        </tr>

                    </template>
                </tbody>
            </table>
        </div>
<!-- 庫存編輯 Modal -->
<div v-if="showStockModal"
     class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
     @click.self="closeStockModal">

    <div class="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl">

        <!-- Modal 標題 -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-medium text-base">設定庫存</h3>
            <button @click="closeStockModal"
                    class="text-gray-400 hover:text-gray-600">
                <i class="pi pi-times"></i>
            </button>
        </div>

        <!-- 商品名稱 -->
        <div class="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <p class="text-sm text-gray-600 line-clamp-2">{{ editingProduct?.fName }}</p>
        </div>

        <!-- 規格列表 -->
        <div class="px-6 py-4 max-h-80 overflow-y-auto">
            <div class="flex text-xs text-gray-400 mb-3 px-1">
                <span class="flex-1">規格</span>
                <span class="w-24 text-center">庫存數量</span>
            </div>

            <div v-for="variant in editingVariants" :key="variant.fColor + variant.fSize"
                 class="flex items-center py-2.5 border-b border-gray-50 last:border-0">
                <span class="flex-1 text-sm">{{ variant.fColor }} / {{ variant.fSize }}</span>
                <input type="number"
                       v-model="variant.fStock"
                       min="0"
                       class="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-indigo-400"
                       :aria-label="`${variant.fColor} ${variant.fSize} 庫存`" />
            </div>
        </div>

        <!-- Modal 底部按鈕 -->
        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button @click="closeStockModal"
                    class="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">
                取消
            </button>
            <button @click="saveStockModal"
                    class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                更新
            </button>
        </div>

    </div>
</div>
    </div>
</template>