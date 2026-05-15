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

//解析JASON字串
const parseLogData = (dataStr) => {
  if (!dataStr) return null
  try {
    return JSON.parse(dataStr)
  } catch (e) {
    return dataStr
  }
}

//客服友善翻譯字典 (可自行擴充 LINE Pay 或綠界的常見欄位)
const translateKey = (key) => {
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
  }
  return dictionary[key] || key
}

//動作類型翻譯字典 (將手風琴標題中文化)
const translateActionType = (type) => {
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
  return dictionary[type] || type // 找不到翻譯就顯示原本的字
}

// 當 transaction 改變且視窗打開時，才抓取日誌
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal && props.transaction) {
      loading.value = true
      try {
        const res = await getPaymentTransactionLogsForAdminAPI(props.transaction.fId)

        if (Array.isArray(res)) {
          logs.value = res
        } else if (res && res.success) {
          logs.value = res.data && res.data.$values ? res.data.$values : res.data
        }
      } finally {
        loading.value = false
      }
    }
  },
)
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    header="金流通訊日誌"
    modal
    :style="{ width: '70vw' }"
  >
    <div v-if="transaction" class="mb-4 p-4 bg-gray-50 rounded-lg">
      <p><strong>支付單號：</strong> {{ transaction.fTransactionNo }}</p>
      <p><strong>金流商交易序號：</strong> {{ transaction.fGatewayTradeNo || '無' }}</p>
    </div>

    <Accordion v-if="logs.length > 0" multiple>
      <AccordionPanel v-for="(log, index) in logs" :key="index" :value="String(index)">
        <AccordionHeader>
          <div class="flex justify-between items-center w-full pr-4">
            <!-- 左側：中文標題 + 原始英文標籤 -->
            <div class="flex items-center gap-3">
              <span class="font-bold text-gray-800 text-lg">{{
                translateActionType(log.fActionType)
              }}</span>
              <span
                class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs border border-gray-200"
              >
                {{ log.fActionType }}
              </span>
            </div>
            <!-- 右側：時間 (加上小時鐘 icon) -->
            <span class="text-gray-400 text-sm flex items-center gap-2">
              <i class="pi pi-clock"></i>
              {{ new Date(log.fCreatedAt).toLocaleString() }}
            </span>
          </div>
        </AccordionHeader>

        <!-- 改為動態顯示：如果有資料才顯示該區塊，並改用 flex-col 滿版排列 -->
        <AccordionContent>
          <div class="flex flex-col gap-4">
            <!-- 發送請求區塊 (只有當 fRequestData 有值時才渲染) -->
            <div
              v-if="log.fRequestData"
              class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <h4 class="font-bold text-gray-700 mb-3 border-b pb-2 flex items-center gap-2">
                <i class="pi pi-send text-blue-500"></i> 系統發送內容 (Request)
              </h4>
              <div v-if="typeof parseLogData(log.fRequestData) === 'object' && log.fRequestData">
                <div
                  v-for="(value, key) in parseLogData(log.fRequestData)"
                  :key="key"
                  class="text-sm mb-2 flex flex-col"
                >
                  <span class="text-gray-400 text-xs">{{ key }}</span>
                  <span class="font-semibold text-gray-700">
                    {{ translateKey(key) }}：
                    <span class="text-blue-600 font-normal break-all">{{ value }}</span>
                  </span>
                </div>
              </div>
              <pre v-else class="text-sm text-gray-600 whitespace-pre-wrap">{{
                log.fRequestData
              }}</pre>
            </div>

            <!-- 接收回應區塊 (只有當 fResponseData 有值時才渲染) -->
            <div
              v-if="log.fResponseData"
              class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <h4 class="font-bold text-gray-700 mb-3 border-b pb-2 flex items-center gap-2">
                <i class="pi pi-download text-green-500"></i> 金流商回應 (Response)
              </h4>
              <div v-if="typeof parseLogData(log.fResponseData) === 'object' && log.fResponseData">
                <div
                  v-for="(value, key) in parseLogData(log.fResponseData)"
                  :key="key"
                  class="text-sm mb-2 flex flex-col"
                >
                  <span class="text-gray-400 text-xs">{{ key }}</span>
                  <span class="font-semibold text-gray-700">
                    {{ translateKey(key) }}：
                    <!-- 特別針對成功代碼標色，加入字串 '1' 的判斷相容綠界 -->
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
              <pre v-else class="text-sm text-gray-600 whitespace-pre-wrap">{{
                log.fResponseData
              }}</pre>
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <div v-else-if="loading" class="text-center py-10">載入中...</div>
    <div v-else class="text-center py-10 text-gray-400">目前沒有通訊紀錄</div>
  </Dialog>
</template>
