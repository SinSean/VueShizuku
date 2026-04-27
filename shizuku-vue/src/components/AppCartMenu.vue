<script setup>
import { ref } from 'vue'
import Menu from 'primevue/menu'
const menu = ref()
const items = ref([
  {
    id: 1,
    name: '日系簡約純棉 T-Shirt',
    price: 'NT$ 590',
    image: 'https://placehold.co/100x100/eeeeee/999999?text=Item+1',
  },
  {
    id: 2,
    name: '復古寬鬆牛仔褲',
    price: 'NT$ 1,280',
    image: 'https://placehold.co/100x100/eeeeee/999999?text=Item+2',
  },
])

// 移除商品
const removeItem = (id) => {
  items.value = items.value.filter((item) => item.id !== id)
}

const toggle = (event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="inline-block">
    <button class="flex items-center gap-1 hover:text-gray-400 transition-colors" @click="toggle">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
      <span class="text-xs font-bold">{{ items.length }}</span>
    </button>

    <Menu
      ref="menu"
      id="overlay_menu"
      :model="items"
      :popup="true"
      class="w-80 p-2 !bg-white !border !border-gray-200 !shadow-xl"
    >
      <template #item="{ item }">
        <div
          class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors group"
        >
          <img :src="item.image" alt="商品縮圖" class="w-14 h-14 object-cover rounded" />

          <div class="flex flex-col flex-1">
            <span class="text-sm font-bold text-gray-800">{{ item.name }}</span>
            <span class="text-xs text-gray-500 mt-1">{{ item.price }}</span>
          </div>

          <button
            @click.stop="removeItem(item.id)"
            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="刪除商品"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>
      </template>

      <template #end>
        <div class="p-2 mt-2 border-t border-gray-100">
          <button
            class="w-full bg-black text-white py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            檢視購物車
          </button>
        </div>
      </template>
    </Menu>
  </div>
</template>
