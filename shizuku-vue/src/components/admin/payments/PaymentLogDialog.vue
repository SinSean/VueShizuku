<script setup>
import { ref, watch } from 'vue'
import { getPaymentTransactionLogsForAdminAPI } from '@/api/adminPayment'
import Dialog from 'primevue/dialog'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

const props = defineProps({
  visible: Boolean,
  transaction: Object,
})

const emit = defineEmits(['update:visible'])
const logs = ref([])
const loading = ref(false)
const parseLogData = (dataStr) => {
  if (!dataStr) return null
  try {
    return JSON.parse(dataStr)
  } catch (e) {
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
    info: '金流詳細交易資訊',
    payInfo: '付款明細資訊',
    method: '付款管道',
    maskedCardNumber: '信用卡卡號 (遮罩)',
    paymentAccessToken: '付款授權 Token',
    cardBrand: '發卡組織 (Visa/Master/JCB)',
    cardType: '卡片種類 (Credit/Debit)',
    paymentUrl: '金流支付跳轉網址',
    web: '電腦版網頁支付連結',
    app: '手機版 App 支付連結',
    refundTransactionId: '退款交易ID',
    refundTransactionDate: '退款交易日期',
    refundAmount: '退款金額',
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

        if (res && res.success) {
          logs.value = res.data || []
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
                  class="text-sm mb-4 flex flex-col border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                >
                  <!-- 顯示原始英文鍵名 -->
                  <span class="text-gray-400 text-xs">{{ key }}</span>
                  <!-- 顯示翻譯後的中文鍵名 -->
                  <span class="font-semibold text-gray-700 text-base mb-1">
                    {{ translateKey(key) }}：
                  </span>

                  <!-- 如果是巢狀物件 (例如 info) -->
                  <div
                    v-if="typeof value === 'object' && value !== null"
                    class="mt-2 pl-4 border-l-4 border-purple-400 bg-purple-50 p-3 rounded-md flex flex-col gap-2"
                  >
                    <div
                      v-for="(subVal, subKey) in value"
                      :key="subKey"
                      class="text-xs flex flex-col border-b border-gray-100/50 pb-2 last:border-0 last:pb-0"
                    >
                      <!-- 原始子欄位英文鍵名 -->
                      <span class="text-gray-400 font-mono text-[10px]">{{ subKey }}</span>
                      <!-- 中文翻譯子欄位與值 -->
                      <span class="font-semibold text-gray-700">
                        {{ translateKey(subKey) }}：

                        <!-- 1. 如果是 payInfo 付款明細陣列 -->
                        <div
                          v-if="subKey === 'payInfo' && Array.isArray(subVal)"
                          class="mt-2 flex flex-col gap-2"
                        >
                          <div
                            v-for="(pay, pIdx) in subVal"
                            :key="pIdx"
                            class="bg-white p-3 rounded-lg border border-purple-200 flex flex-col gap-1.5 shadow-sm font-normal"
                          >
                            <div
                              class="text-xs font-bold text-purple-600 border-b border-purple-100 pb-1 mb-1 flex items-center gap-1.5"
                            >
                              <i class="pi pi-credit-card"></i> 實體付款明細 #{{ pIdx + 1 }}
                            </div>
                            <div
                              class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600"
                            >
                              <div>
                                <span class="text-gray-400">付款管道:</span>
                                <strong class="text-gray-800 ml-1">{{
                                  pay.method || '未載明'
                                }}</strong>
                              </div>
                              <div>
                                <span class="text-gray-400">交易金額:</span>
                                <strong class="text-emerald-600 ml-1"
                                  >${{ pay.amount?.toLocaleString() }}</strong
                                >
                              </div>
                              <div v-if="pay.maskedCardNumber" class="col-span-1 md:col-span-2">
                                <span class="text-gray-400">信用卡卡號 (遮罩):</span>
                                <strong
                                  class="font-mono bg-gray-50 px-1.5 py-0.5 rounded ml-1 text-gray-700 border border-gray-100"
                                  >{{ pay.maskedCardNumber }}</strong
                                >
                              </div>
                              <div v-if="pay.cardBrand">
                                <span class="text-gray-400">發卡組織:</span>
                                <strong class="text-gray-800 ml-1">{{ pay.cardBrand }}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- 2. 如果是 packages 商品包裹明細陣列 -->
                        <div
                          v-else-if="subKey === 'packages' && Array.isArray(subVal)"
                          class="mt-2 flex flex-col gap-2"
                        >
                          <div
                            v-for="(pkg, pIdx) in subVal"
                            :key="pIdx"
                            class="bg-white p-3 rounded-lg border border-purple-200 shadow-sm flex flex-col gap-1.5 font-normal"
                          >
                            <div
                              class="text-xs font-bold text-purple-600 border-b border-purple-100 pb-1 mb-1 flex items-center gap-1.5"
                            >
                              <i class="pi pi-box"></i> 包裹明細 #{{ pIdx + 1 }}
                            </div>
                            <div
                              class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600"
                            >
                              <div>
                                <span class="text-gray-400">包裹編號:</span>
                                <strong
                                  class="font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 ml-1"
                                  >{{ pkg.id }}</strong
                                >
                              </div>
                              <div>
                                <span class="text-gray-400">包裹金額:</span>
                                <strong class="text-amber-600 font-bold ml-1"
                                  >${{ pkg.amount?.toLocaleString() }}</strong
                                >
                              </div>
                              <div class="col-span-1 md:col-span-2">
                                <span class="text-gray-400">包裹名稱:</span>
                                <strong class="text-gray-800 ml-1">{{ pkg.name }}</strong>
                              </div>
                            </div>
                            <!-- 包裹內的產品明細 -->
                            <div
                              v-if="pkg.products && Array.isArray(pkg.products)"
                              class="bg-purple-50/50 p-2 rounded-lg border border-purple-100/50 mt-2 font-normal"
                            >
                              <div
                                class="text-[10px] font-black text-purple-700 mb-1 flex items-center gap-1"
                              >
                                <i class="pi pi-list"></i> 包裹內商品清單：
                              </div>
                              <div
                                v-for="(prod, prIdx) in pkg.products"
                                :key="prIdx"
                                class="text-[11px] text-gray-700 flex justify-between py-1 border-b border-purple-100/20 last:border-0"
                              >
                                <span
                                  >名稱:
                                  <strong class="text-gray-900">{{ prod.name }}</strong></span
                                >
                                <span
                                  >數量:
                                  <strong class="text-gray-900">{{ prod.quantity }}</strong></span
                                >
                                <span
                                  >單價:
                                  <strong class="text-emerald-600">${{ prod.price }}</strong></span
                                >
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- 3. 如果是 paymentUrl 金流支付跳轉網址 (含有 web, app 鍵) -->
                        <div
                          v-else-if="
                            subKey === 'paymentUrl' && typeof subVal === 'object' && subVal !== null
                          "
                          class="mt-2 flex flex-col gap-2 font-normal"
                        >
                          <div
                            class="bg-white p-3 rounded-lg border border-purple-200 shadow-sm flex flex-col gap-2"
                          >
                            <div
                              class="text-xs font-bold text-purple-600 border-b border-purple-100 pb-1 mb-1 flex items-center gap-1.5"
                            >
                              <i class="pi pi-link"></i> 支付通道跳轉網址
                            </div>
                            <div class="flex flex-col gap-2 text-xs">
                              <!-- Web 網頁版連結 -->
                              <div
                                v-if="subVal.web"
                                class="flex flex-col md:flex-row md:items-center gap-1.5"
                              >
                                <span
                                  class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold scale-90 origin-left shrink-0 flex items-center gap-1"
                                >
                                  <i class="pi pi-desktop"></i> 電腦網頁
                                </span>
                                <a
                                  :href="subVal.web"
                                  target="_blank"
                                  class="text-blue-600 hover:underline break-all font-mono"
                                  >{{ subVal.web }}</a
                                >
                              </div>
                              <!-- App 行動版連結 -->
                              <div
                                v-if="subVal.app"
                                class="flex flex-col md:flex-row md:items-center gap-1.5 mt-1"
                              >
                                <span
                                  class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold scale-90 origin-left shrink-0 flex items-center gap-1"
                                >
                                  <i class="pi pi-mobile"></i> 手機 App
                                </span>
                                <a
                                  :href="subVal.app"
                                  target="_blank"
                                  class="text-emerald-600 hover:underline break-all font-mono"
                                  >{{ subVal.app }}</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- 4. 其他巢狀 JSON 回應 (萬用後備) -->
                        <div
                          v-else-if="typeof subVal === 'object' && subVal !== null"
                          class="mt-1 bg-white p-2 rounded border border-purple-100 font-normal"
                        >
                          <pre
                            class="text-[10px] text-gray-500 font-mono whitespace-pre-wrap leading-relaxed"
                            >{{ JSON.stringify(subVal, null, 2) }}</pre
                          >
                        </div>

                        <!-- 4. 純文字 -->
                        <span v-else class="text-gray-900 font-mono break-all">{{ subVal }}</span>
                      </span>
                    </div>
                  </div>

                  <!-- 如果是一般純文字欄位 -->
                  <span
                    v-else
                    :class="{
                      'text-green-600 font-bold': value === 1 || value === '0000' || value === '1',
                      'text-red-600': value === 0 || value === '0',
                      'text-blue-600 font-normal break-all':
                        value !== 1 &&
                        value !== '0000' &&
                        value !== 0 &&
                        value !== '1' &&
                        value !== '0',
                    }"
                  >
                    {{ value }}
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
