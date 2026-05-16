<script setup>
import { ref, onMounted, watch } from 'vue'
import { getRevenueStatsAPI } from '@/api/adminOrder'
import Chart from 'primevue/chart'
import Skeleton from 'primevue/skeleton'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'

const loading = ref(true)
const stats = ref(null)

// 日期篩選相關
const dates = ref(null)
const periodOptions = [
  { label: '今日', value: 'today' },
  { label: '近 7 日', value: '7d' },
  { label: '近 30 日', value: '30d' },
  { label: '本年', value: 'year' },
]
const selectedPeriod = ref('7d')

const lineChartData = ref(null)
const lineChartOptions = ref(null)
const pieChartData = ref(null)
const pieChartOptions = ref(null)

const setPeriod = (p) => {
  const end = new Date()
  let start = new Date()
  if (p === 'today') start.setHours(0, 0, 0, 0)
  else if (p === '7d') start.setDate(end.getDate() - 6)
  else if (p === '30d') start.setDate(end.getDate() - 29)
  else if (p === 'year') start = new Date(end.getFullYear(), 0, 1)
  dates.value = [start, end]
  loadData()
}

const loadData = async () => {
  if (!dates.value || !dates.value[0]) return
  loading.value = true
  const start = dates.value[0].toISOString()
  const end = dates.value[1] ? dates.value[1].toISOString() : start
  try {
    const res = await getRevenueStatsAPI(start, end)
    if (res.success) {
      stats.value = res.data
      initCharts(res.data)
    }
  } catch (err) {
    console.error('Failed', err)
  } finally {
    loading.value = false
  }
}

watch(selectedPeriod, (newVal) => {
  if (newVal) setPeriod(newVal)
})

const initCharts = (data) => {
  lineChartData.value = {
    labels: data.dailyStats.map((s) => s.date),
    datasets: [
      {
        label: '營收',
        data: data.dailyStats.map((s) => s.amount),
        fill: true,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.4,
      },
    ],
  }
  lineChartOptions.value = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f8fafc' } } },
  }
  pieChartData.value = {
    labels: data.paymentStats.map((p) => p.method),
    datasets: [
      {
        data: data.paymentStats.map((p) => p.amount),
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      },
    ],
  }
  pieChartOptions.value = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
    cutout: '70%',
  }
}

const formatCurrency = (v) =>
  new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(v || 0)

onMounted(() => setPeriod('7d'))
</script>

<template>
  <div class="revenue-widget p-4 max-h-full overflow-hidden flex flex-col">
    <!-- 1. 緊湊工具列 -->
    <div
      class="flex flex-wrap items-center justify-between gap-2 mb-4 bg-white/60 p-2 px-4 rounded-xl border border-white/80 shadow-sm"
    >
      <div class="flex items-center gap-2">
        <span class="text-xs font-black text-teal-700 mr-2 uppercase tracking-tighter"
          >分析區間</span
        >
        <SelectButton
          v-model="selectedPeriod"
          :options="periodOptions"
          optionLabel="label"
          optionValue="value"
          unselectable
        />
      </div>
      <div class="flex items-center gap-2">
        <DatePicker
          v-model="dates"
          selectionMode="range"
          :manualInput="false"
          placeholder="自定義範圍"
          class="custom-cal"
          @hide="loadData"
        />
        <Button
          icon="pi pi-refresh"
          text
          rounded
          @click="loadData"
          :loading="loading"
          class="p-button-sm"
        />
      </div>
    </div>

    <!-- 2. KPI 卡片 (旗艦級美化版) -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div v-if="loading" v-for="i in 3" :key="i">
        <Skeleton height="80px" borderRadius="1.25rem" />
      </div>
      <template v-else>
        <!-- 總交易額 -->
        <div class="modern-kpi kpi-emerald">
          <div class="kpi-content">
            <span class="kpi-label">總交易額</span>
            <div class="kpi-value">{{ formatCurrency(stats?.totalGMV) }}</div>
          </div>
          <div class="kpi-icon">
            <i class="pi pi-wallet"></i>
          </div>
          <div class="kpi-badge">Revenue</div>
        </div>

        <!-- 訂單總量 -->
        <div class="modern-kpi kpi-blue">
          <div class="kpi-content">
            <span class="kpi-label">訂單總量</span>
            <div class="kpi-value">{{ stats?.totalOrders }} <span class="unit">筆</span></div>
          </div>
          <div class="kpi-icon">
            <i class="pi pi-shopping-bag"></i>
          </div>
          <div class="kpi-badge">Volume</div>
        </div>

        <!-- 平均客單價 -->
        <div class="modern-kpi kpi-amber">
          <div class="kpi-content">
            <span class="kpi-label">平均客單價</span>
            <div class="kpi-value">{{ formatCurrency(stats?.aov) }}</div>
          </div>
          <div class="kpi-icon">
            <i class="pi pi-chart-line"></i>
          </div>
          <div class="kpi-badge">Quality</div>
        </div>
      </template>
    </div>

    <!-- 3. 圖表與數據明細區塊 -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">
      <!-- 折線圖 + 明細表 -->
      <div class="lg:col-span-3 chart-box flex flex-col">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-tighter">銷售趨勢分析</h3>
          <span class="text-[9px] text-gray-300 italic">Historical Data</span>
        </div>
        <div class="h-[210px] w-full">
          <Chart
            type="line"
            :data="lineChartData"
            :options="lineChartOptions"
            v-if="lineChartData"
            class="h-full w-full"
          />
        </div>

        <!-- 新增：每日明細表格 -->
        <div class="mt-4 flex-1 overflow-auto border-t border-gray-50 pt-3">
          <table class="w-full text-left text-[11px]">
            <thead>
              <tr class="text-gray-400 font-black uppercase">
                <th class="pb-2">日期</th>
                <th class="pb-2 text-right">訂單數</th>
                <th class="pb-2 text-right">營收額</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 font-bold">
              <tr
                v-for="item in [...(stats?.dailyStats || [])].reverse().slice(0, 5)"
                :key="item.date"
                class="border-b border-gray-50/50 last:border-0"
              >
                <td class="py-2">{{ item.date }}</td>
                <td class="py-2 text-right">{{ item.count }}</td>
                <td class="py-2 text-right text-emerald-600">{{ formatCurrency(item.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 圓餅圖 + 佔比列表 -->
      <div class="lg:col-span-2 chart-box flex flex-col">
        <h3 class="text-xs font-black text-gray-400 mb-4 uppercase tracking-tighter">
          支付管道佔比
        </h3>
        <div class="h-[170px] flex items-center justify-center">
          <Chart
            type="doughnut"
            :data="pieChartData"
            :options="pieChartOptions"
            v-if="pieChartData"
            class="h-full w-full"
          />
        </div>

        <!-- 新增：支付佔比明細 -->
        <div class="mt-4 flex-1 overflow-auto border-t border-gray-50 pt-3">
          <div
            v-for="(item, idx) in stats?.paymentStats"
            :key="idx"
            class="flex justify-between items-center mb-2 last:mb-0"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][idx] }"
              ></div>
              <span class="text-[11px] font-bold text-gray-500">{{ item.method }}</span>
            </div>
            <div class="text-[11px] font-black text-gray-700">
              {{ formatCurrency(item.amount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.revenue-widget {
  height: 100%;
}

.modern-kpi {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-radius: 1.25rem;
  overflow: hidden;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-kpi:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
}

.kpi-content {
  z-index: 1;
}

.kpi-label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.15rem;
  opacity: 0.7;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  line-height: 1;
}

.kpi-value .unit {
  font-size: 11px;
  font-weight: 600;
  margin-left: 2px;
}

.kpi-icon {
  font-size: 1.8rem;
  opacity: 0.15;
  transition: all 0.4s;
}

.modern-kpi:hover .kpi-icon {
  transform: scale(1.15) rotate(-8deg);
  opacity: 0.35;
}

.kpi-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 8px;
  font-weight: 900;
  padding: 2px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  opacity: 0.5;
}

/* 色系控制 */
.kpi-emerald { background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border-left: 4px solid #10b981; }
.kpi-emerald .kpi-label, .kpi-emerald .kpi-icon, .kpi-emerald .kpi-badge { color: #059669; }
.kpi-emerald .kpi-value { color: #064e3b; }
.kpi-emerald .kpi-badge { background: #d1fae5; }

.kpi-blue { background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); border-left: 4px solid #3b82f6; }
.kpi-blue .kpi-label, .kpi-blue .kpi-icon, .kpi-blue .kpi-badge { color: #2563eb; }
.kpi-blue .kpi-value { color: #1e3a8a; }
.kpi-blue .kpi-badge { background: #dbeafe; }

.kpi-amber { background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%); border-left: 4px solid #f59e0b; }
.kpi-amber .kpi-label, .kpi-amber .kpi-icon, .kpi-amber .kpi-badge { color: #d97706; }
.kpi-amber .kpi-value { color: #78350f; }
.kpi-amber .kpi-badge { background: #fef3c7; }

.chart-box {
  background: white;
  border-radius: 1.25rem;
  padding: 1.25rem;
  border: 1px solid #f1f5f9;
}

:deep(.p-selectbutton .p-button) {
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 800;
  font-size: 12px;
  padding: 0.4rem 0.8rem;
  border-radius: 0.6rem;
}
:deep(.p-selectbutton .p-button.p-highlight) {
  background: #0d9488;
  color: white;
}
:deep(.custom-cal .p-datepicker-input) {
  font-size: 11px;
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  width: 170px;
}
</style>
