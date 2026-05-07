<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const router = useRouter()

// 準備變數來接收使用者的輸入
const form = ref({
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  note: '',
  paymentMethodId: 1,
})

const paymentOptions = ref([
  { id: 1, name: '信用卡 / 金融卡', icon: 'pi-credit-card', desc: '支援 Visa, Master, JCB' },
  { id: 2, name: 'LINE Pay', icon: 'pi-comment', desc: '可使用 LINE POINTS 折抵' },
  { id: 3, name: '貨到付款', icon: 'pi-box', desc: '需額外加收 30 元手續費' }
])

const submitOrder = async () => {
  if (!form.value.receiverName || !form.value.receiverPhone || !form.value.receiverAddress) {
    alert("請填寫完整的收件人資訊喔！")
    return
  }

  // 把 Pinia 購物車的資料轉換為後端 API 需要的格式
  const formattedCartItems = cartStore.items.map(item => ({
    variantId: item.id,
    quantity: item.quantity
  }))

  const requestPayload = {
    memberId: 1, 
    receiverName: form.value.receiverName,
    receiverPhone: form.value.receiverPhone,
    receiverAddress: form.value.receiverAddress,
    note: form.value.note,
    paymentMethodId: form.value.paymentMethodId,
    cartItems: formattedCartItems
  }

  try {
    const response = await axios.post('https://localhost:7197/api/orderApi/create', requestPayload)
    console.log("後端回傳的資料：", response.data)
    if (response.data.success) {
      // 1. 成功送出訂單後，第一件事就是清空購物車！
      cartStore.clearCart()
      // 2. 檢查後端有沒有傳「LINE Pay 付款網址 (paymentUrl)」過來
      if (response.data.data && response.data.data.paymentUrl) {
          alert(`訂單建立成功！請在彈出的視窗中完成 LINE Pay 付款...`)
          
          // 1. 彈出新視窗 (我們還可以指定大小，讓它看起來像個專屬付款小視窗)
          window.open(response.data.data.paymentUrl, '_blank', 'width=600,height=800');
          
          // 2. 在原網頁開啟「監聽器」，隨時等候新視窗傳回來的捷報！
          const receiveMessage = (event) => {
              // 安全檢查：確保訊息是從我們自己的網站發出來的
              if (event.origin !== window.location.origin) return;
              // 如果收到付款成功的暗號
              if (event.data === 'PAYMENT_SUCCESS') {
                  alert("太棒了！偵測到付款成功！為您導向訂單列表...");
                  window.removeEventListener('message', receiveMessage); // 關閉監聽器
                  router.push({ name: 'orders' }); // 原網頁這時候才跳轉！
              }
          };
          
          // 開始監聽
          window.addEventListener('message', receiveMessage);
          
      } else {
          alert(`結帳成功！訂單編號：${response.data.data.orderNo}`)
          router.push({ name: 'orders' }) 
      }
    } else {
      alert(` 結帳失敗：${response.data.message}`)
    }
  } catch (error) {
    console.error(error)
    alert('系統連線發生錯誤！')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#fafafa] text-gray-800 font-sans pb-20">
    <!-- 限制最大寬度並置中，打造單欄高質感版面 -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      
      <!-- LOGO 區塊 -->
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-black tracking-tighter text-black uppercase cursor-pointer" @click="$router.push({ name: 'home' })">
          Shizuku.
        </h1>
      </header>

      <!-- 麵包屑導覽 -->
      <!-- <nav class="flex items-center justify-center text-xs text-gray-400 mb-10 tracking-wider">
        <span class="hover:text-black cursor-pointer transition" @click="$router.push({ name: 'cart' })">購物車</span>
        <i class="pi pi-angle-right mx-2 text-[10px]"></i>
        <span class="text-black font-bold">收件資訊</span>
        <i class="pi pi-angle-right mx-2 text-[10px]"></i>
        <span>付款方式</span>
      </nav> -->

      <!-- 主體內容：上下堆疊的白色卡片 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <!-- 上半部：訂單摘要 (帶有極淺灰色底) -->
        <div class="bg-gray-50/50 border-b border-gray-200 p-6 sm:p-10">
          <h2 class="text-xl font-bold text-gray-900 mb-6">訂單摘要</h2>
          
          <div class="space-y-6 mb-6">
            <!-- 購物車商品清單 (動態產生) -->
            <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4 relative">
              <div class="relative flex-shrink-0">
                <div class="w-16 h-16 bg-[#f8f8f8] border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img :src="item.image" class="w-full h-full object-cover mix-blend-multiply">
                </div>
                <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">{{ item.quantity }}</span>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 text-sm">{{ item.name }}</h4>
                <p class="text-gray-500 text-xs mt-1">單價：NT$ {{ item.price.toLocaleString() }}</p>
              </div>
              <!-- 小計 -->
              <p class="font-bold text-gray-900 text-sm">NT$ {{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>

          <!-- 折扣碼區塊 -->
          <div class="flex gap-3 mb-6 pt-6 border-t border-gray-200">
            <InputText placeholder="折扣碼" class="flex-1 bg-white !rounded-md border-gray-300" />
            <button class="bg-gray-200 text-gray-500 font-bold px-6 rounded-md hover:bg-gray-300 hover:text-gray-700 transition">套用</button>
          </div>

          <!-- 結算明細 -->
          <div class="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-6">
            <div class="flex justify-between">
              <span>小計</span>
              <span class="font-medium text-gray-900">NT$ {{ cartStore.totalPrice.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span>運費</span>
              <span class="text-gray-500">免運費</span>
            </div>
            <!-- 總金額 -->
            <div class="flex justify-between items-center pt-4 mt-2">
              <span class="text-base font-bold text-gray-900">總計</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">TWD</span>
                <span class="text-2xl font-black text-gray-900">NT$ {{ cartStore.totalPrice.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 下半部：填寫表單 -->
        <div class="p-6 sm:p-10">
          <h2 class="text-xl font-bold text-gray-900 mb-6">聯絡與配送資訊</h2>

          <div class="flex flex-col gap-6">
            <!-- PrimeVue FloatLabel -->
            <FloatLabel>
              <InputText id="name" v-model="form.receiverName" class="w-full h-14 bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition" />
              <label for="name" class="text-gray-500 text-sm">收件人姓名 (Receiver Name)</label>
            </FloatLabel>

            <FloatLabel>
              <InputText id="phone" v-model="form.receiverPhone" class="w-full h-14 bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition" />
              <label for="phone" class="text-gray-500 text-sm">行動電話 (Mobile Phone)</label>
            </FloatLabel>

            <FloatLabel>
              <InputText id="address" v-model="form.receiverAddress" class="w-full h-14 bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition" />
              <label for="address" class="text-gray-500 text-sm">完整地址 (Shipping Address)</label>
            </FloatLabel>

            <!-- 運送方式選擇 -->
            <div class="mt-2">
              <h3 class="text-sm font-bold text-gray-900 mb-3 tracking-wide">選擇運送方式</h3>
              <div class="border-2 border-black bg-gray-50 rounded-lg p-4 flex justify-between items-center cursor-pointer shadow-sm">
                <div class="flex items-center gap-4">
                  <i class="pi pi-truck text-xl"></i>
                  <div>
                    <p class="font-bold text-black text-sm">標準宅配</p>
                    <p class="text-xs text-gray-500 mt-1">預計 2-3 個工作天送達</p>
                  </div>
                </div>
                <span class="font-bold text-black text-sm">免運費</span>
              </div>
            </div>
            <!-- 付款方式選擇 -->
            <div class="mt-6">
              <h3 class="text-sm font-bold text-gray-900 mb-3 tracking-wide">選擇付款方式</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <!-- 使用 v-for 迴圈把付款選項印出來 -->
                <div 
                  v-for="option in paymentOptions" 
                  :key="option.id"
                  @click="form.paymentMethodId = option.id"
                  :class="[
                    'border-2 rounded-lg p-4 cursor-pointer transition-all shadow-sm',
                    form.paymentMethodId === option.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  ]"
                >
                  <div class="flex flex-col items-center text-center gap-2">
                    <i :class="['pi', option.icon, 'text-2xl', form.paymentMethodId === option.id ? 'text-black' : 'text-gray-400']"></i>
                    <div>
                      <p :class="['font-bold text-sm', form.paymentMethodId === option.id ? 'text-black' : 'text-gray-600']">{{ option.name }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ option.desc }}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <FloatLabel class="mt-4">
              <Textarea id="note" v-model="form.note" rows="3" class="w-full bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition resize-none pt-4" />
              <label for="note" class="text-gray-500 text-sm">給店家的備註</label>
            </FloatLabel>
          </div>

          <!-- 底部按鈕區 -->
          <div class="mt-10 pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
            <button @click="$router.push({ name: 'cart' })" class="text-sm text-gray-500 hover:text-black transition flex items-center justify-center gap-2 group w-full sm:w-auto py-3">
              <i class="pi pi-angle-left group-hover:-translate-x-1 transition-transform"></i> 回到購物車
            </button>
            <button @click="submitOrder" class="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-md font-bold tracking-widest transition flex items-center justify-center gap-3 shadow-lg shadow-gray-200">
              確認送出 <i class="pi pi-arrow-right"></i>
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
