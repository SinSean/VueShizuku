<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const product = ref(null)

// 選擇狀態
const selectedColor = ref('花灰')
const selectedSize = ref('F')
const quantity = ref(1)

// 模擬從 API 抓取的 Queen Shop 風格資料
onMounted(() => {
  const productId = route.params.id
  // 實際開發會在這裡寫 axios.get(`/api/products/${productId}`)
  product.value = {
    id: productId,
    promotion: '限定超值組合 2件 $630', // 紅字活動
    name: '棉花糖 素面涼感短版合身上衣 四色售 S-XL', // 長標題
    number: '01090574',
    soldCount: 913,
    price: 390,
    // Queen Shop 詳情頁是由很多張很長的形象圖組成的
    bigImages: [
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800', // 模擬長圖 1
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800', // 模擬長圖 2
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800'  // 模擬長圖 3
    ],
    colors: [
      { name: '黑', bg: 'bg-black' },
      { name: '白', bg: 'bg-white border' },
      { name: '深咖', bg: 'bg-[#5D4037]' },
      { name: '花灰', bg: 'bg-[#E0E0E0]' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'F'],
    description: '此為特別企劃款。涼感面料，親膚舒適。短版剪裁修飾身形...'
  }
})
</script>

<template>
  <div v-if="product" class="pt-32 pb-20 bg-white">
    <div class="max-w-[1300px] mx-auto px-6">
      
      <div class="flex flex-col md:flex-row gap-16">
        
        <div class="flex-1 space-y-2">
          <div v-for="(img, index) in product.bigImages" :key="index" class="w-full">
            <img :src="img" :alt="product.name + index" class="w-full h-auto object-cover" />
          </div>
          </div>

        <div class="md:w-[450px] shrink-0 sticky top-32 h-fit space-y-6">
          
          <div class="space-y-1.5 text-left">
            <p class="text-xs text-red-600 font-medium tracking-wider">{{ product.promotion }}</p>
            <h1 class="text-xl font-normal text-gray-800 leading-snug">{{ product.name }}</h1>
            <div class="flex justify-between items-center text-xs text-gray-400 pt-1">
              <span>商品編號 {{ product.number }}</span>
              <span>已售出 {{ product.soldCount }} 件</span>
            </div>
          </div>

          <div class="text-left py-4 border-t border-gray-100">
            <p class="text-sm text-gray-400">NT.</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ product.price }}</p>
          </div>

          <div class="space-y-5 text-left text-sm">
            <div class="flex items-start gap-3">
              <span class="w-12 shrink-0 pt-1 text-gray-500">顏色</span>
              <div class="flex flex-wrap gap-2.5">
                <button 
                  v-for="color in product.colors" 
                  :key="color.name"
                  @click="selectedColor = color.name"
                  :class="[
                    'w-7 h-7 rounded-full',
                    color.bg,
                    selectedColor === color.name ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
                  ]"
                />
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="w-12 shrink-0 pt-1 text-gray-500">尺寸</span>
              <div class="flex flex-wrap gap-2.5">
                <button 
                  v-for="size in product.sizes" 
                  :key="size"
                  @click="selectedSize = size"
                  :class="[
                    'w-12 h-10 border text-xs font-medium tracking-wider transition-colors',
                    selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100 space-y-4">
            <div class="flex items-center gap-3">
              <span class="w-12 text-gray-500 text-sm">數量</span>
              <div class="flex items-center border border-gray-200 h-10">
                <button @click="quantity > 1 ? quantity-- : null" class="w-10 h-full text-gray-400 hover:text-black">-</button>
                <input type="number" v-model="quantity" class="w-16 h-full text-center text-sm font-bold outline-none" />
                <button @click="quantity++" class="w-10 h-full text-gray-400 hover:text-black">+</button>
              </div>
            </div>

            <button class="w-full bg-black text-white h-14 text-sm font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors">
              加入購物車
            </button>
          </div>

          <div class="text-sm text-gray-600 space-y-3 pt-6 text-left">
            <p>{{ product.description }}</p>
            <div class="border-t border-gray-100 pt-3 space-y-3">
              <div class="flex justify-between cursor-pointer hover:text-black"><span>尺寸表</span><span>+</span></div>
              <div class="flex justify-between cursor-pointer hover:text-black"><span>Model資訊</span><span>+</span></div>
              <div class="flex justify-between cursor-pointer hover:text-black"><span>商品說明</span><span>+</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
/* 隱藏 type="number" 的上下箭頭 */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>