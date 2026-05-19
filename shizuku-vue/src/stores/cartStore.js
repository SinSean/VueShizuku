import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  //初始化狀態,先看 localstorage 有沒有東西,沒有就給空陣列
  const savedCart = localStorage.getItem('shizuku_cart')
  const items = ref(savedCart ? JSON.parse(savedCart) : [])

  //監聽items 變動
  watch(items, (newItems) =>{
    localStorage.setItem('shizuku_cart', JSON.stringify(newItems));
  }, { deep: true })

  //  Getters (計算屬性)
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })
// 計算總件數 (用來顯示購物車上小紅點的數字)
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Actions (操作方法)
  const addToCart = (product, quantity = 1) => {
    // 先檢查購物車是不是已經有這個商品了？
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      // 有的話，數量往上加就好
      existingItem.quantity += quantity
    } else {
      // 沒有的話，把新商品推進去
      items.value.push({ ...product, quantity })
    }
  }

  // Actions：移除特定商品
  const removeFromCart = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
  }

  // Actions：結帳完清空購物車
  const clearCart = () => {
    items.value = []
  }

  // Actions：更換商品規格（換顏色/尺寸）
  // 若目標規格 ID 已在購物車中，直接合併數量後移除原條目；否則直接更新
  const updateItemVariant = (oldVariantId, newVariant) => {
    const oldItem = items.value.find(item => item.id === oldVariantId)
    if (!oldItem) return

    const existingTarget = items.value.find(item => item.id === newVariant.id)
    if (existingTarget) {
      // 目標規格已存在 → 數量合併
      existingTarget.quantity += oldItem.quantity
      items.value = items.value.filter(item => item.id !== oldVariantId)
    } else {
      // 目標規格不存在 → 直接更新
      oldItem.id    = newVariant.id
      oldItem.color = newVariant.color
      oldItem.size  = newVariant.size
      oldItem.price = newVariant.price
    }
  }

  // 最後，把這些東西 return 出去，別的檔案才拿得到
  return { 
    items, 
    totalPrice, 
    totalItems,
    addToCart, 
    removeFromCart, 
    clearCart,
    updateItemVariant,
  }
})
