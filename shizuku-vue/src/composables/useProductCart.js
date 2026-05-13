// src/composables/useProductCart.js
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'

export function useProductCart(product, variants, selectedColor, selectedSize, quantity) {
  const cartStore = useCartStore()

  // 找出目前選中的規格物件
  const currentVariant = computed(() => {
    return variants.value.find(
      (v) => v.fColor === selectedColor.value && v.fSize === selectedSize.value,
    )
  })

  // 計算庫存
  const currentStock = computed(() => currentVariant.value?.fStock ?? 0)

  // 加入購物車邏輯
  const handleAddToCart = () => {
    if (!currentVariant.value) {
      alert('請先選擇規格！')
      return
    }

    const itemToAdd = {
      id: currentVariant.value.fId,
      name: product.value.fName,
      price: currentVariant.value.fPrice ?? product.value.fPrice,
      image: product.value.fImage,
      color: selectedColor.value,
      size: selectedSize.value,
    }

    cartStore.addToCart(itemToAdd, quantity.value)
    alert(`已將 ${product.value.fName} 加入購物車！`)
  }

  return {
    currentStock,
    handleAddToCart,
  }
}
