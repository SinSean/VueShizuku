<script setup>
import { ref, computed } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const items = ref([
  // 準備一個 items 裡面裝一個清單（陣列）
  {
    id: 1,
    name: '純棉短 T 恤',
    price: 500,
    quantity: 1,
    image: 'https://placehold.co/200x200/png',
  }, // 清單裡的第一個商品
  {
    id: 2,
    name: '經典牛仔褲',
    price: 1200,
    quantity: 1,
    image: 'https://placehold.co/200x200/png',
  }, // 清單裡的第二個商品
])

const removeItem = (id) => {
  items.value = items.value.filter((item) => item.id !== id)
}

const totalAmount = computed(() => {
  return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
})
</script>

<template>
  <div class="cart-container">
    <div class="cart-list">
      <div v-for="item in items" :key="item.id" class="cart-item">
        <img :src="item.image" alt="商品照片" class="item-image" />
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p>單價: ${{ item.price }}</p>
        </div>
        <div class="item-actions">
          <InputNumber v-model="item.quantity" showButtons buttonLayout="horizontal" :min="1" />
          <Button
            icon="pi pi-trash"
            severity="danger"
            aria-label="刪除"
            @click="removeItem(item.id)"
          />
        </div>
      </div>
    </div>
    <div class="cart-summary">
      <h2>訂單摘要</h2>
      <div class="summary-line">
        <span>商品總計</span> <span>${{ totalAmount }}</span>
      </div>
      <div class="summary-line"><span>運費</span> <span>$60</span></div>
      <Divider />
      <div class="summary-total">
        <strong>應付總額</strong> <strong>${{ totalAmount + 60 }}</strong>
      </div>
      <Button label="前往結帳" severity="success" class="checkout-btn" />
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  display: flex; /* 啟動並排模式（讓裡面的東西左右排列） */
  gap: 20px; /* 中間留 20px 的空白距離 */
  padding: 20px; /* 內側留 20px 的空白空間 */
} /* 最大箱子樣式結束 */

.cart-list {
  /* 左邊清單區的樣式 */
  flex: 2; /* 在畫面中佔據 2 份的寬度空間 */
} /* 左邊清單樣式結束 */

.cart-summary {
  /* 右邊結帳摘要的樣式 */
  flex: 1; /* 在畫面中佔據 1 份的寬度空間 */
  background-color: #f9fafb; /* 塗上一層淺灰色的背景 */
  padding: 20px; /* 內側留 20px 空白 */
  border-radius: 8px; /* 把四個尖銳的角落磨成圓角 */
  height: fit-content; /* 高度剛好包住裡面的文字就好，不要拉長 */
} /* 結帳摘要樣式結束 */

.cart-item {
  /* 單一商品的樣式 */
  display: flex; /* 啟動並排模式，讓圖片跟文字左右排 */
  align-items: center; /* 讓大家的高度都對齊在中間線上 */
  margin-bottom: 15px; /* 下面留 15px 空白 */
  padding-bottom: 15px; /* 內側下方留 15px 空白 */
  border-bottom: 1px solid #eee; /* 在底部畫一條淺灰色的底線隔開下一個商品 */
} /* 單一商品樣式結束 */

.item-image {
  /* 商品圖片的樣式 */
  width: 80px; /* 寬度設定為 80 像素 */
  height: 80px; /* 高度設定為 80 像素 */
  object-fit: cover; /* 讓圖片比例維持正常，多餘的邊緣裁切掉 */
  margin-right: 15px; /* 圖片右側留 15px 空白，不讓文字黏太緊 */
} /* 圖片樣式結束 */

.item-info {
  /* 文字資訊區塊 */
  flex: 1; /* 盡量佔滿剩下的寬度空間 */
} /* 文字區塊結束 */

.item-actions {
  /* 操作按鈕區塊 */
  display: flex; /* 讓加減號積木跟垃圾桶積木並排 */
  gap: 10px; /* 按鈕之間留 10px 空白 */
} /* 按鈕區塊結束 */

.summary-line {
  /* 摘要區每一行的文字 */
  display: flex; /* 啟動並排模式 */
  justify-content: space-between; /* 讓文字跑到左右最極端的位置（一個靠左、一個靠右） */
  margin-bottom: 10px; /* 下方留 10px 空白 */
} /* 摘要行結束 */

.summary-total {
  /* 最後結帳總額的文字 */
  display: flex; /* 啟動並排模式 */
  justify-content: space-between; /* 文字跑到左右最極端 */
  font-size: 1.2rem; /* 字體放大一些 */
  margin-bottom: 20px; /* 下方留 20px 空白 */
} /* 結帳總額樣式結束 */

.checkout-btn {
  /* 前往結帳的按鈕 */
  width: 100%; /* 寬度設定為 100%，撐滿整個右邊的摘要箱子 */
} /* 按鈕樣式結束 */
</style>
/* 化妝區域結束 */
