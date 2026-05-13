<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '@/api/Product.js'

const batchVariantPrice = ref('')
const batchVariantStock = ref('')

const photoFiles = ref([]) // 新上傳的檔案
const photoPreviews = ref([]) // 預覽 URL（包含已有的）

const router = useRouter()

const props = defineProps({
  productId: { type: Number, default: null },
  isEdit: { type: Boolean, default: false },
})

// ── 基本資料 ──
const form = ref({
  fName: '',
  fPrice: null,
  fCategoryId: null,
  fDescription: '',
  fStatus: 1,
})

// ── 圖片 ──
const photoFile = ref(null)
const photoPreview = ref(null)

// ── 規格列表 ──
const variants = ref([])

// ── 下拉選單資料 ──
const categories = ref([])
const colors = ref([])
const sizes = ref([])

// ── 規格摘要（computed）──
const totalStock = computed(() => variants.value.reduce((a, v) => a + (Number(v.fStock) || 0), 0))
const priceRange = computed(() => {
  const prices = variants.value.map((v) => Number(v.fPrice)).filter((p) => p > 0)
  if (prices.length === 0)
    return form.value.fPrice ? `NT$${Number(form.value.fPrice).toLocaleString()}` : '—'
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return min === max
    ? `NT$${min.toLocaleString()}`
    : `NT$${min.toLocaleString()} - NT$${max.toLocaleString()}`
})

//批次編輯價格
function applyBatchVariant() {
  variants.value = variants.value.map((v) => ({
    ...v,
    ...(batchVariantPrice.value ? { fPrice: Number(batchVariantPrice.value) } : {}),
    ...(batchVariantStock.value ? { fStock: Number(batchVariantStock.value) } : {}),
  }))
}

// 圖片上傳
function onPhotoChange(e) {
  const files = Array.from(e.target.files)
  const remaining = 9 - photoPreviews.value.length
  const newFiles = files.slice(0, remaining)

  newFiles.forEach((file) => {
    photoFiles.value.push(file)
    photoPreviews.value.push({
      url: URL.createObjectURL(file),
      isNew: true,
    })
  })
  // 清空 input 讓同一張圖可以重複選
  e.target.value = ''
}

// 刪除圖片
function removePhoto(index) {
  const photo = photoPreviews.value[index]
  if (photo.isNew) {
    const newIndex = photoPreviews.value.slice(0, index).filter((p) => p.isNew).length
    photoFiles.value.splice(newIndex, 1)
  }
  photoPreviews.value.splice(index, 1)
}

// ── 新增一列規格 ──
function addVariant() {
  variants.value.push({
    fColorId: colors.value[0]?.fId ?? null,
    fSizeId: sizes.value[0]?.fId ?? null,
    fStock: 0,
    fPrice: form.value.fPrice ?? 0,
  })
}

// ── 刪除規格 ──
function removeVariant(index) {
  variants.value.splice(index, 1)
}

// ── 載入下拉選單資料 ──
async function loadDropdowns() {
  const res = await productApi.getDropdowns()
  const data = res.data.data
  categories.value = data.categories ?? []
  colors.value = data.colors ?? []
  sizes.value = data.sizes ?? []
}

// ── 編輯模式：載入現有資料 ──
async function loadProduct() {
  if (!props.isEdit || !props.productId) return

  const [productRes, variantRes] = await Promise.all([
    productApi.getById(props.productId),
    productApi.getVariants(props.productId),
  ])

  const p = productRes.data.data
  form.value = {
    fName: p.fName,
    fPrice: p.fPrice,
    fCategoryId: p.fCategoryId,
    fDescription: p.fDescription,
    fStatus: p.fStatus,
  }
  if (p.fImage) {
    photoPreviews.value = [{ url: p.fImage, isNew: false }]
  }

  // 規格資料對應顏色/尺寸 ID
  variants.value = (variantRes.data.data ?? []).map((v) => {
    const colorId = colors.value.find((c) => c.fName === v.fColor)?.fId ?? null
    const sizeId = sizes.value.find((s) => s.fName === v.fSize)?.fId ?? null
    return {
      fId: v.fId,
      fColorId: colorId,
      fSizeId: sizeId,
      fStock: v.fStock,
      fPrice: v.fPrice ?? p.fPrice,
    }
  })
}

onMounted(async () => {
  await loadDropdowns()
  await loadProduct()
  // 新增模式預設加一列規格
  if (!props.isEdit) addVariant()
})

// ── 儲存 ──
async function save() {
  if (!form.value.fName) {
    alert('請填寫商品名稱')
    return
  }
  if (!form.value.fCategoryId) {
    alert('請選擇分類')
    return
  }
  if (!form.value.fPrice) {
    alert('請填寫主要售價')
    return
  }

  try {
    if (props.isEdit) {
      // 更新基本資料
      await productApi.update(props.productId, {
        fId: props.productId,
        fName: form.value.fName,
        fProduct: '',
        fPrice: Number(form.value.fPrice),
        fStatus: form.value.fStatus,
        fCategoryId: form.value.fCategoryId,
        fDescription: form.value.fDescription,
      })
      // 更新庫存與價格
      await productApi.updateVariants(
        props.productId,
        variants.value.map((v) => ({
          fId: v.fId,
          fStock: Number(v.fStock),
          fPrice: Number(v.fPrice),
        })),
      )
    } else {
      // 新增商品
      const res = await productApi.create({
        fName: form.value.fName,
        fPrice: Number(form.value.fPrice),
        fCategoryId: form.value.fCategoryId,
        fDescription: form.value.fDescription,
        variants: variants.value.map((v) => ({
          fColorId: v.fColorId,
          fSizeId: v.fSizeId,
          fStock: Number(v.fStock),
        })),
      })

      // 上傳圖片
      if (photoFiles.value.length > 0 && res.data.data?.id) {
        for (const file of photoFiles.value) {
          await productApi.uploadImage(res.data.data.id, file)
        }
      }
    }

    router.push({ name: 'admin-products' })
  } catch (err) {
    console.error('儲存失敗', err)
    alert('儲存失敗，請再試一次')
  }
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
      <!-- 左側 -->
      <div class="space-y-4">
        <!-- ✨ 1. 圖片上傳（移到最上面）-->
        <div class="bg-white border border-gray-100 rounded-xl p-5">
          <h3 class="text-sm font-medium mb-4 pb-3 border-b border-gray-100">商品圖片</h3>

          <!-- 上傳按鈕（未達9張才顯示）-->
          <label
            v-if="photoPreviews.length < 9"
            class="block border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-300 transition-colors mb-3"
          >
            <input type="file" accept="image/*" multiple class="hidden" @change="onPhotoChange" />
            <i class="pi pi-cloud-upload text-gray-300 block mb-2" style="font-size: 24px"></i>
            <span class="text-xs text-gray-400">點擊上傳圖片（最多 9 張）</span><br />
            <span class="text-[11px] text-gray-300">目前 {{ photoPreviews.length }} / 9 張</span>
          </label>

          <!-- 圖片預覽格 -->
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(photo, index) in photoPreviews"
              :key="index"
              class="relative aspect-square"
            >
              <img
                :src="photo.url"
                class="w-full h-full object-cover rounded-lg border border-gray-100"
              />
              <button
                @click="removePhoto(index)"
                class="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                aria-label="移除圖片"
              >
                <i class="pi pi-times" style="font-size: 9px"></i>
              </button>
            </div>
            <!-- 空格佔位 -->
            <label
              v-if="photoPreviews.length < 9"
              class="aspect-square border border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <input type="file" accept="image/*" multiple class="hidden" @change="onPhotoChange" />
              <i class="pi pi-plus text-gray-300" style="font-size: 16px" aria-hidden="true"></i>
            </label>
          </div>
        </div>

        <!-- 基本資料 -->
        <div class="bg-white border border-gray-100 rounded-xl p-5">
          <h3 class="text-sm font-medium mb-4 pb-3 border-b border-gray-100">基本資料</h3>

          <div class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 mb-1.5 block">
                商品名稱 <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.fName"
                type="text"
                placeholder="請輸入商品名稱"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-500 mb-1.5 block">
                  分類 <span class="text-red-400">*</span>
                </label>
                <select
                  v-model="form.fCategoryId"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white"
                >
                  <option :value="null">選擇分類</option>
                  <option v-for="cat in categories" :key="cat.fId" :value="cat.fId">
                    {{ cat.fFullName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="text-xs text-gray-500 mb-1.5 block">商品狀態</label>
                <select
                  v-model="form.fStatus"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 bg-white"
                >
                  <option :value="1">上架中</option>
                  <option :value="2">下架</option>
                </select>
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-500 mb-1.5 block">
                主要售價 <span class="text-red-400">*</span>
              </label>
              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <span class="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-200">
                  NT$
                </span>
                <input
                  v-model="form.fPrice"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-500 mb-1.5 block">商品描述</label>
              <textarea
                v-model="form.fDescription"
                rows="4"
                placeholder="請輸入商品描述..."
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 resize-none"
              >
              </textarea>
            </div>

            <div>
              <label class="text-xs text-gray-500 mb-1.5 block">商品貨號</label>
              <div class="px-3 py-2 bg-gray-50 rounded-lg text-xs text-gray-400 font-mono">
                {{ isEdit ? '不可修改' : '系統將於儲存時自動產生' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 規格設定 -->
        <div class="bg-white border border-gray-100 rounded-xl p-5">
          <h3 class="text-sm font-medium mb-4 pb-3 border-b border-gray-100">規格設定</h3>
          <!-- 批次設定列 -->
          <div
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3 border border-gray-100"
          >
            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
              <span class="px-3 py-2 bg-white text-gray-400 text-xs border-r border-gray-200"
                >NT$</span
              >
              <input
                type="number"
                v-model="batchVariantPrice"
                min="0"
                placeholder="價格"
                class="flex-1 px-3 py-2 text-xs focus:outline-none bg-white"
                aria-label="批次價格"
              />
            </div>
            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
              <input
                type="number"
                v-model="batchVariantStock"
                min="0"
                placeholder="商品數量"
                class="flex-1 px-3 py-2 text-xs focus:outline-none bg-white"
                aria-label="批次數量"
              />
            </div>
            <button
              @click="applyBatchVariant"
              class="shrink-0 px-4 py-2 text-xs border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              全部套用
            </button>
          </div>
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                  顏色
                </th>
                <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                  尺寸
                </th>
                <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                  庫存
                </th>
                <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
                  規格售價
                </th>
                <th class="px-3 py-2 border-b border-gray-100" style="width: 36px"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(variant, index) in variants"
                :key="index"
                class="border-b border-gray-50 last:border-0"
              >
                <td class="px-2 py-2">
                  <select
                    v-model="variant.fColorId"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-indigo-400 bg-white"
                  >
                    <option v-for="c in colors" :key="c.fId" :value="c.fId">
                      {{ c.fName }}
                    </option>
                  </select>
                </td>
                <td class="px-2 py-2">
                  <select
                    v-model="variant.fSizeId"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-indigo-400 bg-white"
                  >
                    <option v-for="s in sizes" :key="s.fId" :value="s.fId">
                      {{ s.fName }}
                    </option>
                  </select>
                </td>
                <td class="px-2 py-2">
                  <input
                    v-model="variant.fStock"
                    type="number"
                    min="0"
                    class="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs text-center focus:outline-none focus:border-indigo-400"
                  />
                </td>
                <td class="px-2 py-2">
                  <div class="flex items-center border border-gray-200 rounded-md overflow-hidden">
                    <span
                      class="px-2 py-1.5 bg-gray-50 text-gray-400 text-xs border-r border-gray-200"
                      >NT$</span
                    >
                    <input
                      v-model="variant.fPrice"
                      type="number"
                      min="0"
                      class="flex-1 px-2 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </td>
                <td class="px-2 py-2 text-center">
                  <button
                    @click="removeVariant(index)"
                    class="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="刪除規格"
                  >
                    <i class="pi pi-trash" style="font-size: 13px"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button
            @click="addVariant"
            class="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors"
          >
            <i class="pi pi-plus" style="font-size: 12px"></i>
            新增規格
          </button>
        </div>
      </div>
    </div>

    <!-- 右側
      <div class="space-y-4"> -->
    <!-- 圖片上傳 -->
    <!-- <div class="bg-white border border-gray-100 rounded-xl p-5">
          <h3 class="text-sm font-medium mb-4 pb-3 border-b border-gray-100">商品圖片</h3>

          <label
            class="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-300 transition-colors mb-3"
          >
            <input type="file" accept="image/*" class="hidden" @change="onPhotoChange" />
            <i class="pi pi-cloud-upload text-gray-300 block mb-2" style="font-size: 28px"></i>
            <span class="text-xs text-gray-400">點擊上傳圖片</span><br />
            <span class="text-[11px] text-gray-300">支援 JPG、PNG，建議 800×800px</span>
          </label>

          <div v-if="photoPreview" class="relative">
            <img
              :src="photoPreview"
              class="w-full aspect-square object-cover rounded-lg border border-gray-100"
            />
            <button
              @click="((photoPreviews = null), (photoFiles = null))"
              class="absolute top-2 right-2 w-6 h-6 bg-black/40 text-white rounded-full flex items-center justify-center"
              aria-label="移除圖片"
            >
              <i class="pi pi-times" style="font-size: 10px"></i>
            </button>
          </div>

        </div>

        規格摘要
      <div class="bg-white border border-gray-100 rounded-xl p-5">
        <h3 class="text-sm font-medium mb-4 pb-3 border-b border-gray-100">規格摘要</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">規格數量</span>
            <span class="font-medium">{{ variants.length }} 筆</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">總庫存</span>
            <span class="font-medium">{{ totalStock }} 件</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">價格區間</span>
            <span class="font-medium">{{ priceRange }}</span>
          </div>
        </div>
      </div>
    </div>

    
    <!-- 底部按鈕 -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
      <button
        @click="router.push({ name: 'admin-products' })"
        class="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
      >
        取消
      </button>
      <button
        @click="save"
        class="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
      >
        {{ isEdit ? '更新商品' : '儲存商品' }}
      </button>
    </div>
  </div>
</template>
