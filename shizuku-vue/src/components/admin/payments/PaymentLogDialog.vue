<script setup>
// 從 Vue 工具箱中拿出 ref（用來做資料響應盒子）和 watch（用來監聽資料變化的監視器）
import { ref, watch } from 'vue'
// 引入向後端拿取金流日誌資料的 API 工具
import { getPaymentTransactionLogsForAdminAPI } from '@/api/adminPayment'
// 引入 Primevue 視窗元件
import Dialog from 'primevue/dialog'
// 引入 Primevue 手風琴外殼元件
import Accordion from 'primevue/accordion'
// 引入 Primevue 手風琴單個面板元件
import AccordionPanel from 'primevue/accordionpanel'
// 引入 Primevue 手風琴標題元件
import AccordionHeader from 'primevue/accordionheader'
// 引入 Primevue 手風琴內容元件
import AccordionContent from 'primevue/accordioncontent'

// 定義從父元件傳進來的資料（顯示狀態與目前的交易資料）
const props = defineProps({
  visible: Boolean, // 視窗是否顯示的開關
  transaction: Object, // 目前選中的交易物件
})

// 定義要傳回給父元件的通知事件
const emit = defineEmits(['update:visible'])
// 宣告一個用來裝日誌列表的盒子，預設是空陣列
const logs = ref([])
// 宣告一個紀錄是否正在載入中的狀態盒子，預設是不用載入
const loading = ref(false)

// 定義一個工具：將 JSON 字串解析成 JavaScript 看得懂的物件
const parseLogData = (dataStr) => {
  // 如果沒有傳入任何資料，就直接回傳空值
  if (!dataStr) return null
  try {
    // 嘗試用 JSON 工具將文字轉成物件結構
    return JSON.parse(dataStr)
  } catch (e) {
    // 如果對方的資料本來就不是 JSON 格式，就直接把原字串回傳
    return dataStr
  }
}

// 客服友善翻譯字典工具
const translateKey = (key) => {
  // 建立一個對照字典，把工程師看的英文換成人類看的中文
  const dictionary = {
    MerchantID: '商店代號',
    TradeDesc: '交易描述',
    CustomField1: '自訂欄位1',
    CustomField2: '自訂欄位2',
    CustomField3: '自訂欄位3',
    CustomField4: '自訂欄位4',
    MerchantTradeNo: '特店交易編號',
    MerchantTradeDate: '特店交易日期',
    ItemName: '商品名稱',
    ReturnURL: '付款結果通知 URL',
    OrderResultURL: '付款完成後導向 URL',
    ChoosePayment: '選擇付款方式',
    EncryptType: '加密類型',
    PaymentDate: '交易日期',
    PaymentType: '交易方式',
    TradeAmt: '交易金額',
    StoreID: '特店門市編號',
    SimulatePaid: '是否為模擬付款(0為模擬付款)',
    PaymentTypeChargeFee: '交易手續費',
    TotalAmount: '交易總金額',
    RtnCode: '回傳代碼 (1為成功)',
    RtnMsg: '回傳訊息',
    TradeDate: '交易日期',
    TradeNo: '綠界交易序號',
    amount: '交易金額',
    orderId: '訂單編號',
    returnCode: '回傳代碼 (0000為成功)',
    returnMessage: '回傳訊息',
    Success: '成功',
    transactionId: '金流商交易序號',
    CheckMacValue: '檢查碼',
    currency: '幣別',
    packages: '商品包裹明細', // 將 LINE Pay 核心資料包裹中文化
    redirectUrls: '付款導向網址設定', // 將導向網址中文化
    id: '包裹編號', // 包裹內部的唯一識別碼
    name: '包裹名稱', // 包裹的名稱說明
    products: '商品品項清單', // 包裹內的商品陣列
    quantity: '購買數量', // 商品的數量
    price: '商品單價', // 商品的單一售價
    confirmUrl: '消費者同意付款後的導向網址', // 成功付款後的跳轉頁面
    cancelUrl: '消費者取消付款後的導向網址', // 取消付款後的跳轉頁面
  }
  // 查字典，如果找不到對應的中文，就顯示原本的英文名稱
  return dictionary[key] || key
}

// 動作類型翻譯字典工具（將手風琴標題中文化）
const translateActionType = (type) => {
  // 定義動作類別的中文對照表
  const dictionary = {
    PaymentRequest: '發送交易請求',
    Payment_Request: '發送交易請求 (手動測試)',
    CreateRequest: '向金流商建立訂單',
    ConfirmResponse: '確認扣款回應',
    CreateResponse: '金流商同步回應',
    Notification: '非同步付款通知 (Webhook)',
    ConfirmPayment: '確認扣款請求',
    RefundRequest: '退款請求',
    RefundResponse: '退款回應',
  }
  // 查字典，找不到就回傳原本的字
  return dictionary[type] || type
}

// 設立監視器：當視窗被打開且有交易資料時，觸發向後端拿資料的流程
watch(
  () => props.visible, // 監聽視窗開啟狀態
  async (newVal) => {
    // 如果視窗狀態變成 true (打開) 且確實有交易物件存在
    if (newVal && props.transaction) {
      // 將載入中盒子設為 true，顯示載入動畫
      loading.value = true
      try {
        // 呼叫後端 API 拿取日誌資料
        const res = await getPaymentTransactionLogsForAdminAPI(props.transaction.fId)

        // 判斷回傳的資料是不是標準的陣列
        if (Array.isArray(res)) {
          // 如果是，直接放進日誌盒子
          logs.value = res
        } else if (res && res.success) {
          // 如果是特定格式，檢查有沒有包含 .value 處理 .NET 導出的物件清單，並放入盒子
          logs.value = res.data && res.data.$values ? res.data.$values : res.data
        }
      } finally {
        // 不管成功或失敗，最後都要把載入中狀態關閉
        loading.value = false
      }
    }
  },
)
</script>

<template>
  <!-- 跳出式對話視窗主體 -->
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    header="金流通訊日誌"
    modal
    :style="{ width: '70vw' }"
  >
    <!-- 上方基礎交易資訊區塊 -->
    <div v-if="transaction" class="mb-4 p-4 bg-gray-50 rounded-lg">
      <!-- 顯示支付單號 -->
      <p><strong>支付單號：</strong> {{ transaction.fTransactionNo }}</p>
      <!-- 顯示金流商交易序號，若沒有則顯示無 -->
      <p><strong>金流商交易序號：</strong> {{ transaction.fGatewayTradeNo || '無' }}</p>
    </div>

    <!-- 下方通訊日誌詳細手風琴清單 -->
    <Accordion v-if="logs.length > 0" multiple>
      <!-- 根據日誌數量循環產生手風琴面板 -->
      <AccordionPanel v-for="(log, index) in logs" :key="index" :value="String(index)">
        <!-- 手風琴標題區塊 -->
        <AccordionHeader>
          <!-- 橫向排列的標題列 -->
          <div class="flex justify-between items-center w-full pr-4">
            <!-- 左側區塊：包含中文名稱與原始英文標籤 -->
            <div class="flex items-center gap-3">
              <!-- 中文動作翻譯名稱 -->
              <span class="font-bold text-gray-800 text-lg">
                {{ translateActionType(log.fActionType) }}
              </span>
              <!-- 原始英文動作標籤 -->
              <span
                class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs border border-gray-200"
              >
                {{ log.fActionType }}
              </span>
            </div>
            <!-- 右側區塊：顯示這條紀錄的建立時間 -->
            <span class="text-gray-400 text-sm flex items-center gap-2">
              <!-- 小時鐘圖示 -->
              <i class="pi pi-clock"></i>
              <!-- 格式化後的時間字串 -->
              {{ new Date(log.fCreatedAt).toLocaleString() }}
            </span>
          </div>
        </AccordionHeader>

        <!-- 手風琴打開後的詳細內容區塊 -->
        <AccordionContent>
          <!-- 垂直排列的資料區塊 -->
          <div class="flex flex-col gap-4">
            <!-- 【發送請求區塊 (Request)】 -->
            <div
              v-if="log.fRequestData"
              class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <!-- 區塊小標題 -->
              <h4 class="font-bold text-gray-700 mb-3 border-b pb-2 flex items-center gap-2">
                <!-- 紙飛機圖示 -->
                <i class="pi pi-send text-blue-500"></i> 系統發送內容 (Request)
              </h4>
              <!-- 如果解析出來是個物件，就進行詳細鍵值對排版 -->
              <div v-if="typeof parseLogData(log.fRequestData) === 'object' && log.fRequestData">
                <!-- 循環跑物件裡面的每一個欄位 -->
                <div
                  v-for="(value, key) in parseLogData(log.fRequestData)"
                  :key="key"
                  class="text-sm mb-4 flex flex-col border-b border-gray-100 pb-2"
                >
                  <!-- 顯示原始英文鍵名 -->
                  <span class="text-gray-400 text-xs">{{ key }}</span>
                  <!-- 顯示翻譯後的中文鍵名 -->
                  <span class="font-semibold text-gray-700 text-base mb-1">
                    {{ translateKey(key) }}：
                  </span>

                  <!-- ============================================================ -->
                  <!-- 【核心邏輯區塊：判斷並渲染 packages (商品包裹) 專用優化樣式】 -->
                  <!-- ============================================================ -->
                  <div
                    v-if="key === 'packages'"
                    class="mt-2 pl-4 border-l-4 border-blue-400 bg-blue-50 p-3 rounded-md"
                  >
                    <!-- 由於 packages 是陣列，我們循環讀取每一個包裹 -->
                    <div v-for="(pkg, pIdx) in value" :key="pIdx" class="mb-3 last:mb-0">
                      <!-- 顯示包裹基本資料 -->
                      <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>
                          <span class="text-gray-400">包裹編號:</span>
                          <span class="font-mono bg-white px-1 rounded border">{{ pkg.id }}</span>
                        </div>
                        <div>
                          <span class="text-gray-400">包裹總額:</span>
                          <span class="text-amber-600 font-bold">${{ pkg.amount }}</span>
                        </div>
                        <div class="col-span-2">
                          <span class="text-gray-400">包裹名稱:</span>
                          <span class="text-gray-800 font-medium">{{ pkg.name }}</span>
                        </div>
                      </div>
                      <!-- 深入顯示該包裹裡面的商品清單 -->
                      <div class="bg-white p-2 rounded border border-blue-100 mt-2">
                        <div class="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1.5">
                          <i class="pi pi-box"></i> 商品項目明細：
                        </div>
                        <!-- 循環讀取商品 -->
                        <div
                          v-for="(prod, prIdx) in pkg.products"
                          :key="prIdx"
                          class="text-xs text-gray-700 flex justify-between py-1 border-b border-gray-50 last:border-0"
                        >
                          <span
                            >名稱: <strong class="text-gray-900">{{ prod.name }}</strong></span
                          >
                          <span
                            >數量: <strong class="text-gray-900">{{ prod.quantity }}</strong></span
                          >
                          <span
                            >單價: <strong class="text-emerald-600">${{ prod.price }}</strong></span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- ============================================================ -->
                  <!-- 【核心邏輯區塊：判斷並渲染 redirectUrls (導向網址) 專用優化樣式】 -->
                  <!-- ============================================================ -->
                  <div
                    v-else-if="key === 'redirectUrls'"
                    class="mt-2 pl-4 border-l-4 border-green-400 bg-green-50 p-3 rounded-md"
                  >
                    <div class="flex flex-col gap-2 text-xs">
                      <!-- 顯示成功跳轉網址 -->
                      <div class="flex flex-col md:flex-row md:items-center gap-1">
                        <span
                          class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold scale-90 origin-left shrink-0"
                          >成功導向</span
                        >
                        <a
                          :href="value.confirmUrl"
                          target="_blank"
                          class="text-blue-600 hover:underline break-all font-mono"
                          >{{ value.confirmUrl }}</a
                        >
                      </div>
                      <!-- 顯示取消跳轉網址 -->
                      <div class="flex flex-col md:flex-row md:items-center gap-1 mt-1">
                        <span
                          class="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold scale-90 origin-left shrink-0"
                          >取消導向</span
                        >
                        <a
                          :href="value.cancelUrl"
                          target="_blank"
                          class="text-blue-600 hover:underline break-all font-mono"
                          >{{ value.cancelUrl }}</a
                        >
                      </div>
                    </div>
                  </div>

                  <!-- 【一般純文字欄位的顯示方式】 -->
                  <span v-else class="text-blue-600 font-normal break-all">
                    {{ value }}
                  </span>
                </div>
              </div>
              <!-- 如果解析失敗不是物件，就用原汁原味的排版印出來 -->
              <pre v-else class="text-sm text-gray-600 whitespace-pre-wrap">{{
                log.fRequestData
              }}</pre>
            </div>

            <!-- 【接收回應區塊 (Response)】 -->
            <div
              v-if="log.fResponseData"
              class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <!-- 區塊小標題 -->
              <h4 class="font-bold text-gray-700 mb-3 border-b pb-2 flex items-center gap-2">
                <!-- 下載圖示 -->
                <i class="pi pi-download text-green-500"></i> 金流商回應 (Response)
              </h4>
              <!-- 如果解析出來是個物件，就進行詳細鍵值對排版 -->
              <div v-if="typeof parseLogData(log.fResponseData) === 'object' && log.fResponseData">
                <!-- 循環跑物件裡面的每一個欄位 -->
                <div
                  v-for="(value, key) in parseLogData(log.fResponseData)"
                  :key="key"
                  class="text-sm mb-2 flex flex-col"
                >
                  <!-- 顯示原始英文鍵名 -->
                  <span class="text-gray-400 text-xs">{{ key }}</span>
                  <!-- 顯示翻譯後的中文鍵名 -->
                  <span class="font-semibold text-gray-700">
                    {{ translateKey(key) }}：
                    <!-- 針對代表成功的代碼特別標註顏色 -->
                    <span
                      :class="{
                        'text-green-600 font-bold':
                          value === 1 || value === '0000' || value === '1',
                        'text-red-600': value === 0 || value === '0',
                        'text-gray-800 font-normal break-all':
                          value !== 1 &&
                          value !== '0000' &&
                          value !== 0 &&
                          value !== '1' &&
                          value !== '0',
                      }"
                    >
                      {{ value }}
                    </span>
                  </span>
                </div>
              </div>
              <!-- 如果解析失敗不是物件，就用原汁原味的排版印出來 -->
              <pre v-else class="text-sm text-gray-600 whitespace-pre-wrap">{{
                log.fResponseData
              }}</pre>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <!-- 狀態切換：讀取中顯示的字樣 -->
    <div v-else-if="loading" class="text-center py-10">載入中...</div>
    <!-- 狀態切換：空資料時顯示的字樣 -->
    <div v-else class="text-center py-10 text-gray-400">目前沒有通訊紀錄</div>
  </Dialog>
</template>
