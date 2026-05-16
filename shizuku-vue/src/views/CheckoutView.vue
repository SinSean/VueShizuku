<script setup>
import { ref, computed, onMounted } from 'vue'
import { createOrderAPI } from '@/api/order'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/auth'
import { productApi } from '@/api/Product'
import { usePaymentWindow } from '@/composables/usePaymentWindow'
import PaymentResultOverlay from '@/components/PaymentResultOverlay.vue'
import CheckoutSummary from '@/components/checkout/CheckoutSummary.vue'
import CheckoutForm from '@/components/checkout/CheckoutForm.vue'

const authStore = useAuthStore()
const { openPaymentWindow } = usePaymentWindow()
const cartStore = useCartStore()
const router = useRouter()

// 定義結果視窗的狀態
const showResultModal = ref(false)
const resultStatus = ref('success')
const resultMessage = ref('')
const shouldRedirectToOrders = ref(false)

// 當彈出視窗 3 秒倒數結束時觸發
const handleCountdownEnd = () => {
  showResultModal.value = false
  if (shouldRedirectToOrders.value) {
    router.push({ name: 'MemberOrders' })
  }
}

// 準備變數來接收使用者的輸入
const form = ref({
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  note: '',
  paymentMethodId: 1,
  get cartTotal() { return cartStore.totalPrice }
})

const paymentOptions = ref([
  { id: 1, name: '信用卡 / 金融卡', icon: 'pi-credit-card', desc: '支援 Visa, Master, JCB' },
  { id: 2, name: 'LINE Pay', icon: 'pi-comment', desc: '可使用 LINE POINTS 折抵' },
  { id: 3, name: '貨到付款', icon: 'pi-box', desc: '全館滿 $1,500 免運，未滿加收 $60' },
])

// ========== 運費計算邏輯 ==========
const FREE_SHIPPING_THRESHOLD = 1500
const COD_SHIPPING_FEE = 60

const shippingFee = computed(() => {
  // 只有「貨到付款」才可能產生運費
  if (form.value.paymentMethodId !== 3) return 0
  // 貨到付款：滿 1500 免運，未滿加收 60
  return cartStore.totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : COD_SHIPPING_FEE
})

const finalTotal = computed(() => {
  return cartStore.totalPrice + shippingFee.value
})

// ========== 表單同步 ==========
const handleFormUpdate = (newForm) => {
  form.value = newForm
}

const handleBack = () => {
  router.push({ name: 'cart' })
}

// ========== 送出訂單 ==========
const submitOrder = async () => {
  // 1. 權限檢查
  if (!authStore.isLogin) {
    resultStatus.value = 'fail'
    resultMessage.value = '請先登入會員才能完成結帳！'
    showResultModal.value = true
    return
  }

  // 2. 欄位檢查
  if (!form.value.receiverName || !form.value.receiverPhone || !form.value.receiverAddress) {
    resultStatus.value = 'fail'
    resultMessage.value = '請填寫完整的收件人資訊喔！'
    showResultModal.value = true
    return
  }

  // 3. 顯示處理中動畫
  resultStatus.value = 'processing'
  resultMessage.value = '正在核對庫存與最新價格，請稍候...'
  showResultModal.value = true

  try {
    // 呼叫預檢 API
    const variantIds = cartStore.items.map((item) => item.id)
    const checkRes = await productApi.checkItems(variantIds)
    const latestInfos = checkRes.data.data

    // 比對庫存與價格
    for (const item of cartStore.items) {
      const latest = latestInfos.find((l) => l.variantId === item.id)

      if (!latest) throw new Error(`找不到商品：${item.name}`)

      if (latest.currentStock < item.quantity) {
        resultStatus.value = 'fail'
        resultMessage.value = `抱歉，【${item.name}】庫存不足（僅剩 ${latest.currentStock} 件），請調整後再下單。`
        return
      }

      if (latest.latestPrice !== item.price) {
        resultStatus.value = 'fail'
        resultMessage.value = `商品【${item.name}】價格已變動，請重新確認購物車金額。`
        return
      }
    }

    // 預檢通過，準備正式下單資料
    resultMessage.value = '資訊核對成功，正在為您成立訂單...'

    const formattedCartItems = cartStore.items.map((item) => ({
      variantId: item.id,
      quantity: item.quantity,
    }))

    const requestPayload = {
      memberId: authStore.user.fId,
      receiverName: form.value.receiverName,
      receiverPhone: form.value.receiverPhone,
      receiverAddress: form.value.receiverAddress,
      note: form.value.note,
      paymentMethodId: form.value.paymentMethodId,
      cartItems: formattedCartItems,
    }

    // 呼叫訂單 API 建立訂單
    const res = await createOrderAPI(requestPayload)
    console.log('後端回傳的資料：', res)

    if (res.success) {
      // 成功送出訂單後，清空購物車
      cartStore.clearCart()

      if (res.data && res.data.paymentUrl) {
        // 信用卡/LINE Pay：開啟金流視窗
        openPaymentWindow(
          res.data.paymentUrl,
          () => {
            resultStatus.value = 'success'
            resultMessage.value = '太棒了！您的訂單已付款成功。'
            shouldRedirectToOrders.value = true
            showResultModal.value = true
          },
          (errorMsg) => {
            resultStatus.value = 'fail'
            resultMessage.value = `${errorMsg} 訂單已成立，請至訂單列表重新付款。`
            shouldRedirectToOrders.value = true
            showResultModal.value = true
          },
        )
      } else {
        // 貨到付款：顯示專屬成功提示與現金準備金額
        const totalAmount = finalTotal.value
        resultStatus.value = 'success'
        resultMessage.value = `訂單已成立！請於包裹送達時，準備好現金 NT$ ${totalAmount.toLocaleString()} 交給配送人員。`
        shouldRedirectToOrders.value = true
        showResultModal.value = true
      }
    } else {
      resultStatus.value = 'fail'
      resultMessage.value = res.message
      shouldRedirectToOrders.value = false
      showResultModal.value = true
    }
  } catch (error) {
    console.error(error)
    resultStatus.value = 'fail'
    resultMessage.value = '系統連線發生錯誤，請稍後再試！'
    shouldRedirectToOrders.value = false
    showResultModal.value = true
  }
}

// 一進入頁面就檢查是否登入
onMounted(() => {
  if (!authStore.isLogin) {
    resultStatus.value = 'warn'
    resultMessage.value = '請先登入會員才能結帳！'
    showResultModal.value = true
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 3000)
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#fafafa] text-gray-800 font-sans pb-20">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <!-- LOGO 區塊 -->
      <header class="mb-8 text-center">
        <h1
          class="text-3xl font-black tracking-tighter text-black uppercase cursor-pointer"
          @click="$router.push({ name: 'home' })"
        >
          Shizuku.
        </h1>
      </header>

      <!-- 主體內容 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- 上半部：訂單摘要 -->
        <CheckoutSummary
          :items="cartStore.items"
          :subtotal="cartStore.totalPrice"
          :shippingFee="shippingFee"
          :finalTotal="finalTotal"
        />

        <!-- 下半部：填寫表單 -->
        <CheckoutForm
          :form="form"
          :paymentOptions="paymentOptions"
          @update:form="handleFormUpdate"
          @submit="submitOrder"
          @back="handleBack"
        />
      </div>
    </div>

    <!-- 付款結果彈出視窗 -->
    <PaymentResultOverlay
      :visible="showResultModal"
      :status="resultStatus"
      :message="resultMessage"
      @update:visible="showResultModal = $event"
      @countdown-end="handleCountdownEnd"
    />
  </div>
</template>
