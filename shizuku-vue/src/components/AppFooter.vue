<script setup>
import { ref } from 'vue'

const newsletterEmail = ref('')
const handleSubscribe = () => {
  console.log('訂閱信箱:', newsletterEmail.value) // 機器啟動後
}
</script>

<template>
  <footer class="bg-white border-t border-gray-100 pt-4 pb-6 px-4 md:px-12 mt-auto">
    <div class="w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-6">
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
            <li class="hover:text-primary cursor-pointer transition-colors">我的帳戶</li>
            <li class="hover:text-primary cursor-pointer transition-colors">訂單查詢</li>
            <li class="hover:text-primary cursor-pointer transition-colors">隱私權政策</li>
            <li class="hover:text-primary cursor-pointer transition-colors">服務條款</li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-gray-900 mb-6">獲取最新優惠</h4>
          <p class="text-sm text-gray-500 mb-4">訂閱電子報，即刻獲得 9 折優惠券！</p>
          <div class="flex flex-col gap-2">
            <InputGroup>
              <InputText v-model="newsletterEmail" placeholder="您的電子郵件" class="text-sm" />
              <Button label="訂閱" severity="contrast" @click="handleSubscribe" />
            </InputGroup>
            <span class="text-[10px] text-gray-400">我們尊重您的隱私，不會發送垃圾郵件。</span>
          </div>
        </div>
      </div>

      <Divider />

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
        <p class="text-xs text-gray-400">© 2026 shizuku Fashion Group. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <i class="pi pi-paypal text-xl text-gray-300"></i>
          <i class="pi pi-apple text-xl text-gray-300"></i>
          <i class="pi pi-credit-card text-xl text-gray-300"></i>
        </div>
      </div>
    </div>
  </footer>
</template>
