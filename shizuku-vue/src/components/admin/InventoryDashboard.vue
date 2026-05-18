<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  inventory: { type: Array, default: () => [] },
})

const baseUrl = 'https://localhost:7197'
const defaultImg = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800'

const donutChartRef = ref(null)
const barChartRef = ref(null)
let donutChart = null
let barChart = null

const totalStock = computed(() => props.inventory.reduce((a, p) => a + (p.fTotalStock ?? 0), 0))
const lowStockCount = computed(
  () =>
    props.inventory.flatMap((p) => p.fVariants ?? []).filter((v) => v.fStock > 0 && v.fStock <= 5)
      .length,
)
const outOfStockCount = computed(
  () => props.inventory.flatMap((p) => p.fVariants ?? []).filter((v) => v.fStock === 0).length,
)
const avgProfit = computed(() => {
  const items = props.inventory
    .flatMap((p) => p.fVariants ?? [])
    .filter((v) => v.fCostPrice > 0 && v.fPrice > 0)
  if (items.length === 0) return 0
  const total = items.reduce((a, v) => a + ((v.fPrice - v.fCostPrice) / v.fPrice) * 100, 0)
  return Math.round(total / items.length)
})

const lowStockList = computed(() =>
  props.inventory
    .flatMap((p) =>
      (p.fVariants ?? [])
        .filter((v) => v.fStock <= 5)
        .map((v) => ({ ...v, fProductName: p.fProductName, fImage: p.fImage })),
    )
    .sort((a, b) => a.fStock - b.fStock)
    .slice(0, 5),
)

function stockStatusClass(status) {
  if (status === '售完') return 'bg-red-50 text-red-500'
  if (status === '低庫存') return 'bg-amber-50 text-amber-500'
  return 'bg-green-50 text-green-600'
}

function buildCharts() {
  const normal = props.inventory
    .flatMap((p) => p.fVariants ?? [])
    .filter((v) => v.fStock > 5).length
  const low = lowStockCount.value
  const soldOut = outOfStockCount.value

  if (donutChartRef.value) {
    if (donutChart) donutChart.destroy()
    donutChart = new Chart(donutChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['正常庫存', '低庫存', '售完'],
        datasets: [
          {
            data: [normal, low, soldOut],
            backgroundColor: ['#1D9E75', '#BA7517', '#E24B4A'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '65%',
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  }

  const categoryMap = {}
  props.inventory.forEach((p) => {
    const cat = p.fProduct?.split('-')[0] ?? '其他'
    const stock = p.fTotalStock ?? 0
    categoryMap[cat] = (categoryMap[cat] ?? 0) + stock
  })

  if (barChartRef.value) {
    if (barChart) barChart.destroy()
    barChart = new Chart(barChartRef.value, {
      type: 'bar',
      data: {
        labels: Object.keys(categoryMap),
        datasets: [
          {
            label: '庫存量',
            data: Object.values(categoryMap),
            backgroundColor: '#4F46E5',
            borderRadius: 4,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
          x: { grid: { display: false } },
        },
      },
    })
  }
}

watch(
  () => props.inventory,
  () => {
    buildCharts()
  },
  { deep: true },
)

onMounted(() => {
  buildCharts()
})
</script>

<template>
  <div class="space-y-4">
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
        <p class="text-xs text-gray-300 mt-1">筆規格不足 5 件</p>
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

    <!-- 圖表 -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <h3 class="text-sm font-medium mb-4">庫存狀態分布</h3>
        <div class="flex items-center gap-6">
          <div style="height: 160px; width: 160px; position: relative">
            <canvas ref="donutChartRef"></canvas>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-green-600"></div>
              <span class="text-gray-500">正常庫存</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-amber-600"></div>
              <span class="text-gray-500">低庫存</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <span class="text-gray-500">售完</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <h3 class="text-sm font-medium mb-4">各分類庫存量</h3>
        <div style="height: 160px; position: relative">
          <canvas ref="barChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- 低庫存警示 -->
    <div class="bg-white rounded-xl border border-gray-100 p-5">
      <h3 class="text-sm font-medium mb-4 pb-3 border-b border-gray-100">低庫存警示</h3>
      <div v-if="lowStockList.length === 0" class="text-center text-gray-300 py-6 text-sm">
        目前無低庫存商品
      </div>
      <table v-else class="w-full text-xs">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
              商品
            </th>
            <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
              規格
            </th>
            <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
              庫存
            </th>
            <th class="px-3 py-2 text-left text-gray-500 font-medium border-b border-gray-100">
              狀態
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in lowStockList"
            :key="item.fVariantId"
            class="border-b border-gray-50 last:border-0"
          >
            <td class="px-3 py-3">
              <div class="flex items-center gap-2">
                <img
                  :src="item.fImage ? baseUrl + item.fImage : defaultImg"
                  class="w-8 h-8 object-cover rounded-lg border border-gray-100"
                />
                <span class="font-medium text-gray-700">{{ item.fProductName }}</span>
              </div>
            </td>
            <td class="px-3 py-3 text-gray-500">{{ item.fColor }} / {{ item.fSize }}</td>
            <td
              class="px-3 py-3"
              :class="item.fStock === 0 ? 'text-red-400 font-medium' : 'text-amber-500 font-medium'"
            >
              {{ item.fStock }} 件
            </td>
            <td class="px-3 py-3">
              <span
                :class="['px-2 py-0.5 rounded-full text-xs', stockStatusClass(item.fStockStatus)]"
              >
                {{ item.fStockStatus }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
