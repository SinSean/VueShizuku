<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const newsletterEmail = ref('')
</script>

<template>
  <footer class="bg-gray-100 pt-8 pb-8 mt-auto">
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 ps-24 pe-24">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold tracking-tighter text-gray-900 uppercase">
              shizuku
            </span>
            <span class="text-[8px] text-gray-400">しずく</span>
          </div>

          <p class="text-gray-500 text-sm leading-relaxed tracking-wide">
            「如水滴般純粹，包容生活的所有姿態。」<br /><br />
            SHIZUKU
            誕生於台灣，我們褪去繁複的裝飾，回歸剪裁的本質與材質的溫度。致力於提供如水般透明、毫無負擔的高品質日常服飾。
          </p>

          <div>
            <RouterLink
              :to="{ name: 'about' }"
              class="inline-block mt-2 text-xs text-gray-800 font-medium border-b border-gray-800 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              閱讀完整品牌故事 &gt;
            </RouterLink>
          </div>
        </div>

        <div>
          <h4 class="font-bold text-gray-900 mb-6">購物指南</h4>
          <ul class="flex flex-col gap-4 text-sm text-gray-600">
            <li>
              <RouterLink
                :to="{ name: 'guide' }"
                class="hover:text-primary transition-colors block"
              >
                如何購買
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'shippingPolicy' }"
                class="hover:text-primary transition-colors block"
              >
                運送政策
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'returnPolicy' }"
                class="hover:text-primary transition-colors block"
              >
                退換貨說明
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'faq' }"
                class="hover:text-primary cursor-pointer transition-colors block"
              >
                常見問題 FAQ
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-gray-900 mb-6">會員服務</h4>
          <ul class="flex flex-col gap-4 text-sm text-gray-600">
            <li>
              <RouterLink
                :to="{ name: 'customer' }"
                class="hover:text-primary cursor-pointer transition-colors block"
              >
                聯絡我們
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'privacyPolicy' }"
                class="hover:text-primary transition-colors block"
              >
                隱私權政策
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'termsOfService' }"
                class="hover:text-primary transition-colors block"
              >
                服務條款
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-gray-900 mb-6">追蹤我們</h4>

          <!-- 精美icons -->
          <div class="flex gap-4">
            <Button
              icon="pi pi-facebook"
              iconClass="!text-3xl"
              severity="secondary"
              rounded
              variant="text"
              as="a"
              href="#"
              class="!text-gray-600 hover:!text-blue-600 transition-colors"
            />

            <Button
              icon="pi pi-instagram"
              iconClass="!text-3xl"
              severity="secondary"
              rounded
              variant="text"
              as="a"
              href="#"
              class="!text-gray-600 hover:!text-pink-600 transition-colors"
            />

            <Button
              icon="pi pi-youtube"
              iconClass="!text-3xl"
              severity="secondary"
              rounded
              variant="text"
              as="a"
              href="#"
              class="!text-gray-600 hover:!text-red-600 transition-colors"
            />
          </div>
        </div>
      </div>

      <Divider style="--p-divider-border-color: gray" />
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 px-24">
        <p class="text-xs text-gray-400 mx-auto md:mx-0">
          © 2026 shizuku Fashion Group. All rights reserved.
        </p>
        <div class="flex items-center justify-center gap-6 w-full md:w-auto">
          <i class="pi pi-paypal text-xl text-gray-300"></i>
          <i class="pi pi-apple text-xl text-gray-300"></i>
          <i class="pi pi-credit-card text-xl text-gray-300"></i>
        </div>
      </div>
    </div>
  </footer>
</template>
