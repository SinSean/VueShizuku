<script setup>
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Divider from 'primevue/divider';
import { ref } from 'vue'

const newsletterEmail = ref('')
const handleSubscribe = () => {
  console.log('訂閱信箱:', newsletterEmail.value) // 機器啟動後，
}
</script>

<template>
  <footer class="bg-gray-100 pt-8 pb-8 mt-auto ">
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 ps-24 pe-24">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <!-- <img src="../assets/img/LOGO.png" alt="shizuku" class="w-8 h-8 object-contain" /> -->
            <span class="text-lg font-bold tracking-tighter text-gray-900 uppercase">
              shizuku
            </span>
            <span class="text-[8px] text-gray-400">しずく</span>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">
            滴落於日常的時尚靈感。shizuku
            致力於提供如水般純粹、高品質的設計服飾，探索簡約美學的無限可能。
          </p>
          <div class="flex gap-3">
            <Button icon="pi pi-facebook" severity="secondary" rounded variant="text" />
            <Button icon="pi pi-instagram" severity="secondary" rounded variant="text" />
            <Button icon="pi pi-twitter" severity="secondary" rounded variant="text" />
          </div>
        </div>
        <div>
          <h4 class="font-bold text-gray-900 mb-6">購物指南</h4>
          <ul class="flex flex-col gap-4 text-sm text-gray-600">
            <li class="hover:text-primary cursor-pointer transition-colors">如何購買</li>
            <li class="hover:text-primary cursor-pointer transition-colors">運送政策</li>
            <li class="hover:text-primary cursor-pointer transition-colors">退換貨說明</li>
            <li class="hover:text-primary cursor-pointer transition-colors">常見問題 FAQ</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-gray-900 mb-6">會員服務</h4>
         <ul class="flex flex-col gap-4 text-sm text-gray-600">
            <li>
              <RouterLink to="/customer" class="hover:text-primary cursor-pointer transition-colors block">
                聯絡我們
              </RouterLink>
            </li>
            <li class="hover:text-primary cursor-pointer transition-colors">訂單查詢</li>
            <li class="hover:text-primary cursor-pointer transition-colors">隱私權政策</li>
            <li class="hover:text-primary cursor-pointer transition-colors">服務條款</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-gray-900 mb-6">追蹤我們</h4>
          <div class="flex gap-4">
            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-1 3h-2v6.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>

            <a href="#" class="text-gray-600 hover:text-pink-600 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2c3.27 0 3.66.01 4.95.07 1.25.06 2.11.26 2.86.56.77.3 1.43.71 2.06 1.35.64.64 1.05 1.3 1.35 2.06.3.75.5 1.61.56 2.86.06 1.29.07 1.68.07 4.95s-.01 3.66-.07 4.95c-.06 1.25-.26 2.11-.56 2.86-.3.77-.71 1.43-1.35 2.06-.64.64-1.3 1.05-2.06 1.35-.75.3-1.61.5-2.86.56-1.29.06-1.68.07-4.95.07s-3.66-.01-4.95-.07c-1.25-.06-2.11-.26-2.86-.56-.77-.3-1.43-.71-2.06-1.35-.64-.64-1.05-1.3-1.35-2.06-.3-.75-.5-1.61-.56-2.86-.06-1.29-.07-1.68-.07-4.95s.01-3.66.07-4.95c.06-1.25.26-2.11.56-2.86.3-.77.71-1.43 1.35-2.06.64-.64 1.3-1.05 2.06-1.35.75-.3 1.61-.5 2.86-.56C8.33 2.01 8.72 2 12 2zm0 2.16c-3.2 0-3.58.01-4.85.07-.97.04-1.5.2-1.85.34-.46.18-.79.4-1.14.75-.35.35-.57.68-.75 1.14-.14.35-.3.88-.34 1.85-.06 1.27-.07 1.65-.07 4.85s.01 3.58.07 4.85c.04.97.2 1.5.34 1.85.18.46.4.79.75 1.14.35.35.68.57 1.14.75.35.14.88.3 1.85.34 1.27.06 1.65.07 4.85.07s3.58-.01 4.85-.07c.97-.04 1.5-.2 1.85-.34.46-.18.79-.4 1.14-.75.35-.35.57-.68.75-1.14.14-.35.3-.88.34-1.85.06-1.27.07-1.65.07-4.85s-.01-3.58-.07-4.85c-.04-.97-.2-1.5-.34-1.85-.18-.46-.4-.79-.75-1.14-.35-.35-.68-.57-1.14-.75-.35-.14-.88-.3-1.85-.34-1.27-.06-1.65-.07-4.85-.07zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 7.84c-1.57 0-2.84-1.27-2.84-2.84S10.43 9.16 12 9.16s2.84 1.27 2.84 2.84-1.27 2.84-2.84 2.84zm6.5-9.34c-.65 0-1.18.53-1.18 1.18s.53 1.18 1.18 1.18 1.18-.53 1.18-1.18-.53-1.18-1.18-1.18z" />
              </svg>
            </a>

            <a href="#" class="text-gray-600 hover:text-red-600 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <Divider style="--p-divider-border-color: gray" />
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
        <p class="text-xs text-gray-400 mx-auto">© 2026 shizuku Fashion Group. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <i class="pi pi-paypal text-xl text-gray-300"></i>
          <i class="pi pi-apple text-xl text-gray-300"></i>
          <i class="pi pi-credit-card text-xl text-gray-300"></i>
        </div>
      </div>
    </div>
  </footer>
</template>
// 結束視覺藍圖樣板區塊
