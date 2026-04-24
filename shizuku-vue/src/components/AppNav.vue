<template>

  <nav class="bg-white relative border-0.5 border-t border-b border-gray py-4">
    <div class="flex justify-center items-center px-4">
      <div class="absolute left-4 lg:left-8">
        <span class="text-2xl font-bold italic tracking-tighter cursor-pointer text-black">Shizuku</span>
      </div>
      <ul class="left-4 flex justify-center gap-8 text-[13px] font-bold tracking-widest uppercase text-gray-700">
        <li class="hover:text-gray-400 cursor-pointer">首頁</li>
        <li class="hover:text-gray-400 cursor-pointer">所有商品</li>
        <li class="hover:text-gray-400 cursor-pointer ">風格搭配 ▽</li>
        <li class="hover:text-gray-400 cursor-pointer ">聯名款商品 ▽</li>
        <li class="hover:text-gray-400 cursor-pointer ">"限時折扣專區"</li>
      </ul>
      <div class="absolute right-4 lg:right-10 flex items-center gap-5 text-gray-600">

        <button class="hover:text-gray-400 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>

        <button class="flex items-center gap-1 hover:text-gray-400 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
          <span class="text-xs font-bold">0</span>
        </button>

        <button class="border border-gray-300 px-3 py-1 rounded-full text-xs hover:bg-gray-50 transition-colors">
          登入/註冊
        </button>
      </div>
    </div>
  </nav>
</template>