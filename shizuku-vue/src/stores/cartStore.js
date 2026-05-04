import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  //. State (狀態)
  const items = ref([
    {
      id: 1,
      name: '日系簡約純棉 T-Shirt',
      price: 590,
      image: 'https://placehold.co/100x100/eeeeee/999999?text=Item+1',
      quantity: 1,
    },
    // 第二個假商品
    {
      id: 2,
      name: '復古寬鬆牛仔褲',
      price: 1280,
      image: 'https://placehold.co/100x100/eeeeee/999999?text=Item+2',
      quantity: 2,
    }
  ])

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

  // 最後，把這些東西 return 出去，別的檔案才拿得到
  return { 
    items, 
    totalPrice, 
    totalItems,
    addToCart, 
    removeFromCart, 
    clearCart 
  }
})
