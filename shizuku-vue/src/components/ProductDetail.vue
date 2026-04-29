<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const product = ref(null)

// 選擇狀態
const selectedColor = ref('花灰')
const selectedSize = ref('F')
const quantity = ref(1)

// 手風琴狀態：預設開啟商品說明
const openSection = ref('description')

// 切換開關的 function
const toggleSection = (section) => {
  openSection.value = openSection.value === section ? null : section;
};

onMounted(() => {
  const productId = route.params.id
  product.value = {
    id: productId,
    promotion: '限定超值組合 2件 $630',
    name: '棉花糖 素面涼感短版合身上衣 四色售 S-XL',
    number: '01090574',
    soldCount: 913,
    price: 390,
    bigImages: [
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800',
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800',
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800',
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800',
    ],
    colors: [
      { name: '黑', bg: 'bg-black' },
      { name: '白', bg: 'bg-white border' },
      { name: '深咖', bg: 'bg-[#5D4037]' },
      { name: '花灰', bg: 'bg-[#E0E0E0]' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'F'],
    description: '此為特別企劃款。涼感面料，親膚舒適。短版剪裁修飾身形，搭配高腰下身即可展現完美比例。'
  }
})

const relatedProducts = ref([
  { id: 1, name: '棉花糖 滿版點點透膚木耳邊上衣', price: 390, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300' },
  { id: 2, name: '棉花糖 格紋透膚荷葉背心', price: 490, img: 'https://images.unsplash.com/photo-1529139572175-d2844448c5b2?w=300' },
  { id: 3, name: '棉花糖 緹花造型木耳邊短袖上衣', price: 390, img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300' },
  { id: 4, name: '棉花糖 豹紋誘紗造型蛋糕長裙', price: 790, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300' },
  { id: 5, name: '棉花糖 刷色剪接造型顯瘦喇叭褲', price: 790, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300' },
  { id: 6, name: '棉花糖 小花微光澤細帶短洋裝', price: 690, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300' },
]);
</script>

<template>
  <div v-if="product" class="pt-32 pb-20 bg-white">
    <div class="max-w-[1300px] mx-auto px-6">
      
      <div class="flex flex-col md:flex-row gap-16 items-start">
        
        <div class="flex-1 space-y-2">
          <div v-for="(img, index) in product.bigImages" :key="index" class="w-full">
            <img :src="img" :alt="product.name + index" class="w-full h-auto object-cover" />
          </div>
        </div>

        <div class="md:w-[380px] shrink-0 sticky top-32 h-auto space-y-4">
          
          <div class="space-y-1.5 text-left">
            <p class="text-xs text-red-600 font-medium tracking-wider">{{ product.promotion }}</p>
            <h1 class="text-xl font-normal text-gray-800 leading-snug">{{ product.name }}</h1>
            <div class="flex justify-between items-center text-xs text-gray-400 pt-1">
              <span>商品編號 {{ product.number }}</span>
              <span>已售出 {{ product.soldCount }} 件</span>
            </div>
          </div>

          <div class="text-left py-2 border-t border-gray-100">
            <p class="text-sm text-gray-400">NT.</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ product.price }}</p>
          </div>

          <div class="space-y-5 text-left text-sm">
            <div class="flex items-start gap-3">
              <span class="w-10 shrink-0 pt-1 text-gray-500">顏色</span>
              <div class="flex flex-wrap gap-2.5">
                <button 
                  v-for="color in product.colors" 
                  :key="color.name"
                  @click="selectedColor = color.name"
                  :class="['w-7 h-7 rounded-full', color.bg, selectedColor === color.name ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200']"
                />
              </div>
            </div>

            <div class="flex items-start gap-3">
              <span class="w-10 shrink-0 pt-1 text-gray-500">尺寸</span>
              <div class="flex flex-wrap gap-2.5">
                <button 
                  v-for="size in product.sizes" 
                  :key="size"
                  @click="selectedSize = size"
                  :class="['w-12 h-7 border text-xs font-medium tracking-wider transition-colors', selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400']"
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

            <button class="w-full bg-black text-white h-11 text-sm font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors">
              加入購物車
            </button>
          </div>

          <div class="pt-6 border-t border-gray-100">
            <div class="border-b border-gray-100">
              <div @click="toggleSection('size')" class="flex justify-between items-center cursor-pointer hover:text-black py-2 text-sm">
                <span class="font-medium">尺寸表</span>
                <span class="text-lg">{{ openSection === 'size' ? "−" : "+" }}</span>
              </div>
              <div v-show="openSection === 'size'" class="pb-4 text-xs text-gray-500 leading-loose">
                <div class="bg-gray-50 p-4 space-y-1">
                  <p>size：Free</p>
                  <p>全長：75 cm | 胸寬：50 cm</p>
                  <p class="text-[10px] text-gray-400 mt-2">※ 由於生產過程不同，可能會有 1-2cm 的誤差。</p>
                </div>
              </div>
            </div>

            <div class="border-b border-gray-100">
              <div @click="toggleSection('model')" class="flex justify-between items-center cursor-pointer hover:text-black py-2 text-sm">
                <span class="font-medium">Model 資訊</span>
                <span class="text-lg">{{ openSection === 'model' ? "−" : "+" }}</span>
              </div>
              <div v-show="openSection === 'model'" class="pb-4 text-xs text-gray-500">
                <p>Model 身高：162cm / 體重：45kg / 穿著尺寸：F</p>
              </div>
            </div>

            <div class="border-b border-gray-100">
              <div @click="toggleSection('description')" class="flex justify-between items-center cursor-pointer hover:text-black py-2 text-sm">
                <span class="font-medium">商品說明</span>
                <span class="text-lg">{{ openSection === 'description' ? "−" : "+" }}</span>
              </div>
              <div v-show="openSection === 'description'" class="pb-4 text-xs text-gray-500 leading-relaxed">
                <p>{{ product.description }}</p>
                <div class="mt-2 text-gray-400">
                  <p>材質：100% 純棉</p>
                  <p>產地：中國製</p>
                </div>
              </div>
            </div>
          </div> </div> </div> <div class="mt-32 border-t border-gray-100 pt-16 pb-32">
        <div class="text-center mb-12">
          <h2 class="text-gray-500 tracking-[0.2em] text-sm font-light">\ 我想妳應該會喜歡 /</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-1 gap-y-10">
          <RouterLink v-for="item in relatedProducts" :key="item.id" :to="'/product/' + item.id" class="group cursor-pointer block">
            <div class="aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
              <img :src="item.img" class="w-full h-full object-cover group-hover:opacity-80" />
            </div>
            <div class="px-2 space-y-1">
              <h3 class="text-[10px] text-gray-600 font-light line-clamp-2">{{ item.name }}</h3>
              <p class="text-[10px] text-gray-900 font-medium text-left">NT.{{ item.price }}</p>
            </div>
          </RouterLink>
        </div>
      </div>

    </div> </div>
</template>

<style scoped>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>