<script setup>
// 商品資料跟邏輯全包在這裡
const products = [
  { id: 1, name: '日系透膚輕薄針織衫', price: 'NT$ 1,280', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800' },
  { id: 2, name: '高腰顯瘦垂墜寬褲', price: 'NT$ 1,580', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800' },
  { id: 3, name: '法式復古碎花無袖洋裝', price: 'NT$ 1,880', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800' },
  { id: 4, name: '簡約純棉V領休閒上衣', price: 'NT$ 890', image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800' },
  { id: 5, name: '落肩純棉短T (淺米色)', price: 'NT$ 1,280', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: '挺版牛津襯衫 (天藍色)', price: 'NT$ 1,580', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop' },
  { id: 7, name: '寬版連帽上衣 (墨綠色)', price: 'NT$ 1,880', image: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=600&auto=format&fit=crop' },
  { id: 8, name: '丹寧牛仔外套 (水洗藍)', price: 'NT$ 890', image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=600&auto=format&fit=crop' },
];
</script>

<!-- 
const products = ref([
    {
        fId: 1,
        fName: '都市日常 - 落肩純棉短T (淺米色)',
        fPrice: 790,
        fImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop'
    },
    {
        fId: 2,
        fName: '極簡主義 - 挺版牛津襯衫 (天藍色)',
        fPrice: 1480,
        fImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    },
    {
        fId: 3,
        fName: '復古街頭 - 寬版連帽上衣 (墨綠色)',
        fPrice: 1980,
        fImage: 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=600&auto=format&fit=crop'
    },
    {
        fId: 4,
        fName: '經典重磅 - 丹寧牛仔外套 (水洗藍)',
        fPrice: 2880,
        fImage: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=600&auto=format&fit=crop'
    },
    {
        fId: 5,
        fName: '都會休閒 - 斜紋工裝長褲 (卡其色)',
        fPrice: 1680,
        fImage: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=600&auto=format&fit=crop'
    },
    {
        fId: 6,
        fName: '輕量旅行 - 防風連帽夾克 (曜石黑)',
        fPrice: 3200,
        fImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop'
    },
    {
        fId: 7,
        fName: '運動時尚 - 吸濕排汗 Polo 衫 (白色)',
        fPrice: 990,
        fImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
    },
    {
        fId: 8,
        fName: '簡約百搭 - V領羊毛針織衫 (深灰色)',
        fPrice: 2280,
        fImage: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=600&auto=format&fit=crop'
    },
]);
-->

  //  商品內容
<template>
  <section class="max-w-6xl mx-auto px-6 py-20">
    <div class="text-center mb-16">
      <h2 class="text-2xl tracking-[0.3em] text-gray-800 uppercase font-light">New Arrivals</h2>
      <p class="text-gray-400 text-xs mt-3 italic">最新上架單品</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      <div v-for="item in products" :key="item.id" class="group cursor-pointer">
        <div class="relative overflow-hidden mb-4 bg-gray-50 aspect-[3/4]">
          <img :src="item.image" :alt="item.name"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div
            class="absolute bottom-0 left-0 w-full bg-white/90 text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span class="text-xs tracking-widest text-gray-800">快速預覽</span>
          </div>
        </div>
        <div class="text-center mt-4">
          <h3 class="text-sm text-gray-600 mb-2 tracking-wide">{{ item.name }}</h3>
          <p class="text-sm font-medium text-gray-900">{{ item.price }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

