<script setup>
import { ref, computed } from 'vue'

// --- 控制邏輯 ---
const visible = ref(false) // 控制側邊欄 Drawer 的開關
const handleCartClick = () => console.log('開啟購物車清單')
const handleNotificationClick = () => console.log('查看最新促銷通知')

//  導覽列資料」
const items = ref([
  {
    label: '女裝專區',
    root: true,
    items: [
      [
        {
          items: [
            { label: '熱銷上衣', icon: 'pi pi-heart', subtext: '本週最受歡迎款式' },
            { label: '優雅洋裝', icon: 'pi pi-star', subtext: '約會與派對必備' },
            { label: '質感下身', icon: 'pi pi-clone', subtext: '顯瘦修身牛仔褲、裙裝' },
          ],
        },
      ],
      [
        {
          items: [
            {
              image:
                'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
              label: '2026 春夏系列',
              subtext: '探索最新的法式簡約風格。',
            },
          ],
        },
      ],
    ],
  },
  { label: '男裝專區', root: true },
  { label: '限時折扣', root: true },
])

// --- 將導覽列內資料轉移到PanelMenu內 ---
const mobileItems = computed(() => {
  return items.value.map((rootItem) => {
    if (!rootItem.items) return rootItem
    const flattenedSubItems = rootItem.items.flatMap((columnArray) => {
      return columnArray.flatMap((subGroup) => {
        return subGroup.items || []
      })
    })
    return {
      ...rootItem,
      items: flattenedSubItems, // 這裡變成了簡單的一維陣列
    }
  })
})

//  側邊欄資料
const selectedSizes = ref([])
const sizes = ref(['XS', 'S', 'M', 'L', 'XL'])
const priceRange = ref([0, 5000])
const serviceLinks = ref([
  { label: '配送與運費', icon: 'pi pi-truck' },
  { label: '退換貨政策', icon: 'pi pi-refresh' },
  { label: '聯繫客服', icon: 'pi pi-comments' },
])

//  會員選單資料
const profileMenu = ref(null)
const profileItems = ref([
  { label: '會員中心', icon: 'pi pi-user' },
  { label: '訂單查詢', icon: 'pi pi-box' },
  { separator: true },
  { label: '登出', icon: 'pi pi-sign-out' },
])

const toggleProfileMenu = (event) => {
  profileMenu.value.toggle(event)
}
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 px-4 py-2">
    <!-- 導覽列 -->
    <MegaMenu
      :model="items"
      class="shadow-lg border-gray-200/50 bg-white/80 backdrop-blur-lg rounded-2xl main-navigation"
    >
      <template #start>
        <div class="flex items-center gap-2 mr-6 ml-2">
          <Button
            icon="pi pi-bars"
            variant="text"
            severity="secondary"
            rounded
            @click="visible = true"
            class="mr-2 drawer-toggle-btn"
          />

          <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
            <i class="pi pi-palette text-white text-xl"></i>
          </div>
          <span class="text-xl font-bold tracking-tighter text-gray-900"
            >MODA<span class="text-primary">CORE</span></span
          >
        </div>
      </template>

      <template #item="{ item }">
        <a
          v-if="item.root"
          class="group flex items-center px-4 py-2 rounded-lg transition-all hover:bg-black/5 cursor-pointer"
        >
          <span class="font-bold text-gray-800 group-hover:text-primary transition-colors">{{
            item.label
          }}</span>
          <i
            v-if="item.items"
            class="pi pi-angle-down ml-2 text-[10px] text-gray-400 group-hover:text-primary"
          ></i>
        </a>

        <a
          v-else-if="!item.image"
          class="flex items-start p-3 rounded-xl hover:bg-gray-50 transition-all gap-4 w-full"
        >
          <div
            class="flex items-center justify-center rounded-full bg-primary/10 text-primary w-10 h-10"
          >
            <i :class="[item.icon, 'text-md']"></i>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-gray-800 text-sm">{{ item.label }}</span>
            <span class="text-[10px] text-gray-400 leading-tight">{{ item.subtext }}</span>
          </div>
        </a>

        <div v-else class="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
          <img :src="item.image" class="rounded-lg mb-2 h-24 w-full object-cover" alt="promo" />
          <span class="font-bold text-xs block mb-1">{{ item.label }}</span>
          <Button
            label="立即探索"
            size="small"
            severity="contrast"
            class="w-full text-[10px] h-8"
          />
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-1">
          <Button icon="pi pi-search" variant="text" severity="secondary" rounded />
          <Button
            icon="pi pi-shopping-cart"
            variant="text"
            severity="secondary"
            rounded
            v-badge.info="5"
            @click="handleCartClick"
          />
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
            class="cursor-pointer ml-2"
            @click="toggleProfileMenu"
          />
        </div>
      </template>
    </MegaMenu>
  </header>

  <!-- 各個vue內容顯示區塊 -->
  <main class="mt-20 px-4 md:px-8 py-6 min-h-screen bg-gray-50/50">
    <div class="max-w-7xl mx-auto">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </main>

  <!-- 側邊欄 -->
  <Drawer v-model:visible="visible" header="探索時尚" class="w-full md:w-[28rem]">
    <div class="flex flex-col gap-8 h-full">
      <section class="mobile-only-nav">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">主選單</h3>

        <!-- 側邊欄位內主選單與導覽列綁定 -->
        <PanelMenu :model="mobileItems" class="border-none custom-mobile-menu">
          <template #item="{ item }">
            <a
              v-if="item.root"
              class="flex items-center px-3 py-3 rounded-lg transition-all hover:bg-gray-100 cursor-pointer w-full"
            >
              <span class="font-bold text-gray-800 text-base">{{ item.label }}</span>
              <i
                v-if="item.items && item.items.length > 0"
                class="pi pi-angle-down ml-auto text-xs text-gray-400"
              ></i>
            </a>

            <a
              v-else-if="item.label && !item.image"
              class="flex items-start p-3 rounded-xl hover:bg-gray-50 transition-all gap-4 w-full ml-2"
            >
              <div
                class="flex items-center justify-center rounded-full bg-primary/10 text-primary min-w-[36px] h-9"
              >
                <i :class="[item.icon, 'text-sm']"></i>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-gray-800 text-sm">{{ item.label }}</span>
                <span class="text-[10px] text-gray-400 leading-tight">{{ item.subtext }}</span>
              </div>
            </a>

            <div
              v-else-if="item.image"
              class="p-3 bg-stone-50 rounded-xl border border-stone-100 text-center mx-2 my-2"
            >
              <img :src="item.image" class="rounded-lg mb-2 h-32 w-full object-cover" alt="promo" />
              <span class="font-bold text-xs block mb-2">{{ item.label }}</span>
              <Button
                label="立即探索"
                size="small"
                severity="contrast"
                class="w-full text-[10px] h-8"
              />
            </div>
          </template>
        </PanelMenu>
      </section>

      <section>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">精選分類</h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="tag in ['鞋款專區', '飾品配件', '時尚包款', '居家生活']"
            :key="tag"
            class="p-4 border border-gray-100 rounded-xl hover:bg-primary hover:text-white cursor-pointer transition-all text-center font-bold text-sm text-gray-600"
          >
            {{ tag }}
          </div>
        </div>
      </section>

      <section class="bg-gray-50 p-5 rounded-2xl border border-gray-100">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">購物篩選器</h3>

        <div class="mb-8">
          <label class="block font-bold text-gray-800 text-sm mb-4">依尺寸篩選</label>
          <div class="flex flex-wrap gap-2">
            <div v-for="size in sizes" :key="size">
              <ToggleButton
                v-model="selectedSizes"
                :onLabel="size"
                :offLabel="size"
                :value="size"
                class="w-12 h-10 text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <div class="flex justify-between mb-4">
            <label class="font-bold text-gray-800 text-sm">預算範圍</label>
            <span class="text-primary font-mono text-sm"
              >${{ priceRange[0] }} - ${{ priceRange[1] }}</span
            >
          </div>
          <Slider v-model="priceRange" range :min="0" :max="10000" />
        </div>
      </section>

      <section class="mt-auto pb-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">需要協助？</h3>
        <div class="flex flex-col gap-1">
          <a
            v-for="link in serviceLinks"
            :key="link.label"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
          >
            <i :class="link.icon" />
            <span class="text-sm">{{ link.label }}</span>
          </a>
        </div>
      </section>
    </div>
  </Drawer>

  <!-- 使用者抽屜 -->
  <Menu ref="profileMenu" :model="profileItems" :popup="true" class="shadow-2xl border-none">
    <template #start>
      <div class="p-4 border-b border-gray-50 flex items-center gap-3">
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          shape="circle"
        />
        <span class="font-bold text-sm text-gray-800">Amy Elsner</span>
      </div>
    </template>
  </Menu>
  <!-- 頁尾 -->
  <footer class="bg-white border-t border-gray-100 pt-16 pb-8 px-4 md:px-12 mt-auto">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <i class="pi pi-palette text-white text-sm"></i>
            </div>
            <span class="text-lg font-bold tracking-tighter text-gray-900"
              >MODA<span class="text-primary">CORE</span></span
            >
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">
            探索 2026
            最新流行趨勢，我們致力於提供高品質且具備設計感的時尚服飾，讓每個人都能穿出專屬自己的態度。
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

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
        <p class="text-xs text-gray-400">© 2026 MODACORE Fashion Group. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <i class="pi pi-paypal text-xl text-gray-300"></i>
          <i class="pi pi-apple text-xl text-gray-300"></i>
          <i class="pi pi-credit-card text-xl text-gray-300"></i>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 讓導覽列在滑動時保持在最上層，且內容有呼吸感 */
:deep(.p-megamenu) {
  padding: 0.5rem 1rem;
}

/* 側邊欄 ToggleButton 的選中樣式 */
:deep(.p-togglebutton.p-highlight) {
  background: black !important;
  border-color: black !important;
  color: white !important;
}

/* 頁面切換時的淡入淡出效果，讓質感更提升 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

/* 隱藏Drawer漢堡按鈕 */
.drawer-toggle-btn {
  display: none !important;
}
/* Drawer漢堡按鈕 寬度960以上顯示 */
@media (max-width: 960px) {
  .drawer-toggle-btn {
    display: inline-flex !important;
  }
  /* 鎖定 MegaMenu 內部的清單容器並隱藏 */
  :deep(.main-navigation .p-megamenu-root-list) {
    display: none;
  }
  /* 隱藏MegaMenu漢堡按鈕 */
  :deep(.main-navigation .p-megamenu-button) {
    display: none !important;
  }
}
</style>
