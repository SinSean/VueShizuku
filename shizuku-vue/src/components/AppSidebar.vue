<template>
  <aside class="app-sidebar">
    <nav class="sidebar-nav">
      <button
        v-for="item in categories"
        :key="item.key"
        class="sidebar-btn"
        :class="{ active: activeCategory === item.key }"
        @click="setCategory(item.key)"
      >
        {{ item.label }}
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const categories = [
  { key: 'all',       label: '所有商品' },
  { key: 'home',      label: '居家系列' },
  { key: 'fairy',     label: '仙女' },
  { key: 'tops',      label: '上衣' },
  { key: 'bottoms',   label: '下身 ...' },
  { key: 'acc',       label: '配件' },
  { key: 'sale',      label: '限時優惠' },
]

const activeCategory = ref('all')

function setCategory(key) {
  activeCategory.value = key
}
</script>

<style scoped>
.app-sidebar {
  width: 160px;
  flex-shrink: 0;
  padding: 24px 0 24px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-btn {
  width: 130px;
  padding: 10px 0;
  border: 1.5px solid #ee4d2d;
  border-radius: 8px;
  background: #fff;
  color: #ee4d2d;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Noto Sans TC', sans-serif;
  cursor: pointer;
  text-align: center;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  letter-spacing: 0.5px;
}

.sidebar-btn:hover,
.sidebar-btn.active {
  background: #ee4d2d;
  color: #fff;
  box-shadow: 0 2px 8px rgba(238,77,45,0.18);
}
</style>