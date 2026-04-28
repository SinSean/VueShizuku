<script setup>
import Drawer from 'primevue/drawer'

// 定義與外面連動的開關盒子
const visible = defineModel('visible')
</script>

<template>
  <Drawer v-model:visible="visible" position="right" class="w-full md:w-80 !bg-white">
    <template #header>
      <div class="flex items-baseline gap-2 px-2">
        <span class="text-2xl font-bold italic tracking-tighter text-black uppercase">
          shizuku
        </span>
        <span class="text-[10px] text-gray-400">しずく</span>
      </div>
    </template>
    <ul class="flex flex-col gap-2 mt-6">
      <li
        class="cursor-pointer transition-colors hover:bg-gray-50 rounded-xl"
        @click="visible = false"
      >
        <div class="flex items-center gap-4 px-4 py-3">
          <i class="pi pi-home text-xl text-gray-400"></i>
          <span class="text-[15px] font-bold tracking-widest uppercase text-gray-700">首頁</span>
        </div>
      </li>

      <li
        class="cursor-pointer transition-colors hover:bg-gray-50 rounded-xl"
        @click="visible = false"
      >
        <div class="flex items-center gap-4 px-4 py-3">
          <i class="pi pi-shopping-bag text-xl text-gray-400"></i>
          <span class="text-[15px] font-bold tracking-widest uppercase text-gray-700"
            >所有商品</span
          >
        </div>
      </li>

      <li
        class="cursor-pointer transition-colors hover:bg-gray-50 rounded-xl"
        @click="visible = false"
      >
        <div class="flex items-center gap-4 px-4 py-3">
          <i class="pi pi-sparkles text-xl text-gray-400"></i>
          <span class="text-[15px] font-bold tracking-widest uppercase text-gray-700"
            >風格搭配 ▽</span
          >
        </div>
      </li>

      <li
        class="cursor-pointer transition-colors hover:bg-gray-50 rounded-xl"
        @click="visible = false"
      >
        <div class="flex items-center gap-4 px-4 py-3">
          <i class="pi pi-star text-xl text-gray-400"></i>
          <span class="text-[15px] font-bold tracking-widest uppercase text-gray-700"
            >聯名款商品 ▽</span
          >
        </div>
      </li>

      <li
        class="cursor-pointer transition-colors hover:bg-gray-50 rounded-xl"
        @click="visible = false"
      >
        <div class="flex items-center gap-4 px-4 py-3">
          <i class="pi pi-tag text-xl text-red-400"></i>
          <span class="text-[15px] font-bold tracking-widest uppercase text-red-500"
            >"限時折扣專區"</span
          >
        </div>
      </li>
      <hr class="border-gray-100 my-6" />

      <li class="px-2">
        <button
          class="w-full bg-black text-white px-4 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors"
        >
          登入/註冊
        </button>
      </li>
    </ul>
  </Drawer>
</template>
