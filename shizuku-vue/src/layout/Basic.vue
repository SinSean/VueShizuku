<template>
  <div class="layout-basic">
    <AppNav />

    <div class="page-body">
      <AppSideBar />

      <main class="main-content">
        <!-- Announcement Bar -->
        <div class="announce-bar">
          <span class="announce-text">最新消息 or 公告 or xxx</span>
        </div>

        <!-- Banner Carousel -->
        <div class="banner-carousel">
          <div class="banner-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="(slide, i) in banners" :key="i" class="banner-slide">
              <div class="banner-placeholder">
                <span class="banner-label">{{ slide.label }}</span>
              </div>
            </div>
          </div>

          <!-- Dots -->
          <div class="carousel-dots">
            <button
              v-for="(_, i) in banners"
              :key="i"
              class="dot"
              :class="{ active: currentSlide === i }"
              @click="currentSlide = i"
            />
          </div>
        </div>

        <!-- Product Grid -->
        <div class="product-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <div class="product-img-wrap">
              <img :src="product.img" :alt="product.name" class="product-img" />
              <span class="product-badge" v-if="product.badge">{{ product.badge }}</span>
            </div>
            <div class="product-info">
              <p class="product-name">{{ product.name }}</p>
              <div class="product-price-row">
                <span class="product-price">NT${{ product.price.toLocaleString() }}</span>
                <span class="product-orig" v-if="product.orig">NT${{ product.orig.toLocaleString() }}</span>
              </div>
              <div class="product-colors">
                <span
                  v-for="color in product.colors"
                  :key="color"
                  class="color-dot"
                  :style="{ background: color }"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppNav from '../components/AppNav.vue'
import AppFooter from '../components/AppFooter.vue'
import AppSideBar from '../components/AppSidebar.vue'

// --- Carousel ---
const banners = ref([
  { label: 'Banner 1' },
  { label: 'Banner 2' },
  { label: 'Banner 3' },
])
const currentSlide = ref(0)
let autoPlay = null

onMounted(() => {
  autoPlay = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % banners.value.length
  }, 3500)
})

onUnmounted(() => clearInterval(autoPlay))

// --- Products ---
const products = ref([
  {
    id: 1,
    name: 'ARC ARC Fabric Convertible Trousers',
    price: 22640,
    orig: null,
    img: 'https://placehold.co/220x260/e8e8e8/888?text=Trousers',
    colors: ['#b0b0b0', '#ffffff'],
    badge: null,
  },
  {
    id: 2,
    name: 'YANG Weekend Yacht Short',
    price: 23383,
    orig: null,
    img: 'https://placehold.co/220x260/ee4d2d/fff?text=Short',
    colors: ['#ee4d2d', '#c0392b'],
    badge: null,
  },
  {
    id: 3,
    name: 'YANG Distressed Gym Jersey Short',
    price: 54886,
    orig: null,
    img: 'https://placehold.co/220x260/1a2744/fff?text=Jersey',
    colors: ['#1a2744', '#b0b0b0'],
    badge: null,
  },
  {
    id: 4,
    name: 'ARC ARC Fabric Convertible Trousers',
    price: 22640,
    orig: null,
    img: 'https://placehold.co/220x260/e8e8e8/888?text=Trousers',
    colors: ['#b0b0b0', '#ffffff'],
    badge: null,
  },
  {
    id: 5,
    name: 'YANG Weekend Yacht Short',
    price: 23383,
    orig: null,
    img: 'https://placehold.co/220x260/ee4d2d/fff?text=Short',
    colors: ['#ee4d2d', '#c0392b'],
    badge: null,
  },
  {
    id: 6,
    name: 'YANG Distressed Gym Jersey Short',
    price: 54886,
    orig: null,
    img: 'https://placehold.co/220x260/1a2744/fff?text=Jersey',
    colors: ['#1a2744', '#b0b0b0'],
    badge: null,
  },
  {
    id: 7,
    name: 'ARC ARC Fabric Convertible Side Trousers',
    price: 22640,
    orig: null,
    img: 'https://placehold.co/220x260/e8e8e8/888?text=Side+Trousers',
    colors: ['#b0b0b0', '#ffffff'],
    badge: null,
  },
  {
    id: 8,
    name: 'YANG Weekend Yacht Short',
    price: 23383,
    orig: null,
    img: 'https://placehold.co/220x260/ee4d2d/fff?text=Short',
    colors: ['#ee4d2d', '#c0392b'],
    badge: null,
  },
  {
    id: 9,
    name: 'YANG Distressed Gym Jersey Short',
    price: 54886,
    orig: null,
    img: 'https://placehold.co/220x260/1a2744/fff?text=Jersey',
    colors: ['#1a2744', '#b0b0b0'],
    badge: null,
  },
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');

.layout-basic {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: 'Noto Sans TC', sans-serif;
}

/* ---- Page Body ---- */
.page-body {
  display: flex;
  /* max-width: 1280px; */
  /* margin: 0 auto; */
  padding: 0 24px;
  gap: 0;
  align-items: flex-start;
}

/* ---- Main ---- */
.main-content {
  flex: 1;
  padding: 20px 0 20px 20px;
  min-width: 0;
}

/* ---- Announce ---- */
.announce-bar {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 8px;
  padding: 10px 20px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #555;
}

/* ---- Banner Carousel ---- */
.banner-carousel {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin-bottom: 28px;
}

.banner-track {
  display: flex;
  transition: transform 0.45s cubic-bezier(.4,0,.2,1);
}

.banner-slide {
  min-width: 100%;
}

.banner-placeholder {
  height: 200px;
  background: linear-gradient(120deg, #f7f7f7 60%, #ececec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-label {
  font-size: 18px;
  color: #bbb;
  letter-spacing: 1px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 10px 0 12px;
}

.dot {
  width: 22px;
  height: 8px;
  border-radius: 4px;
  border: none;
  background: #ddd;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, width 0.2s;
}

.dot.active {
  background: #ee4d2d;
  width: 30px;
}

/* ---- Product Grid ---- */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.product-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ececec;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}

.product-card:hover {
  box-shadow: 0 6px 24px rgba(238,77,45,0.10);
  transform: translateY(-2px);
}

.product-img-wrap {
  position: relative;
  background: #f5f5f5;
}

.product-img {
  width: 100%;
  display: block;
  object-fit: cover;
  aspect-ratio: 4/5;
}

.product-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ee4d2d;
  color: #fff;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 700;
}

.product-info {
  padding: 10px 12px 12px;
}

.product-name {
  font-size: 12px;
  color: #333;
  margin: 0 0 6px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.product-price {
  font-size: 14px;
  font-weight: 700;
  color: #ee4d2d;
}

.product-orig {
  font-size: 12px;
  color: #aaa;
  text-decoration: line-through;
}

.product-colors {
  display: flex;
  gap: 5px;
  align-items: center;
}

.color-dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1.5px solid #e0e0e0;
  display: inline-block;
}
</style>