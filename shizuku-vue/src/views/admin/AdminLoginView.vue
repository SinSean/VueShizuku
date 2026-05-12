<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { employeeLoginAPI } from '@/api/employee'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  fNumber: '',
  fPassword: '',
})
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!form.value.fNumber || !form.value.fPassword) {
    errorMessage.value = '請填寫員工編號與密碼'
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  try {
    const data = await employeeLoginAPI({
      fNumber: form.value.fNumber,
      fPassword: form.value.fPassword,
    })
    if (data.success) {
      authStore.login(data.data)
      router.push({ name: 'admin-dashboard' })
    } else {
      errorMessage.value = data.message || '帳號或密碼錯誤'
    }
  } catch (error) {
    errorMessage.value = '無法連線至伺服器，請稍後再試'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- 左側品牌視覺區 -->
    <div
      class="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex-col items-center justify-center p-16 relative overflow-hidden"
    >
      <!-- 背景裝飾圓圈 -->
      <div
        class="absolute top-[-80px] left-[-80px] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"
      ></div>

      <!-- 品牌內容 -->
      <div class="relative z-10 text-center">
        <div
          class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-500/30"
        >
          <i class="pi pi-bolt text-white text-3xl"></i>
        </div>
        <h1 class="text-4xl font-black text-white tracking-widest uppercase mb-4">Shizuku</h1>
        <p class="text-indigo-300 text-lg font-medium mb-2">後台管理系統</p>
        <p class="text-slate-500 text-sm max-w-xs leading-relaxed">
          統一管理訂單、商品與會員資料，讓您的業務運作更有效率。
        </p>

        <!-- 分隔裝飾線 -->
        <div class="flex items-center gap-3 justify-center mt-12">
          <div class="w-8 h-[2px] bg-indigo-600 rounded"></div>
          <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
          <div class="w-8 h-[2px] bg-indigo-600 rounded"></div>
        </div>

        <!-- 功能列表 -->
        <div class="mt-10 flex flex-col gap-4 text-left">
          <div
            v-for="feature in ['訂單即時管理與狀態追蹤', '商品庫存與分類管理', '會員資料統計總覽']"
            :key="feature"
            class="flex items-center gap-3 text-slate-400 text-sm"
          >
            <div
              class="w-5 h-5 rounded-full bg-indigo-600/30 flex items-center justify-center flex-shrink-0"
            >
              <i class="pi pi-check text-indigo-400 text-xs"></i>
            </div>
            {{ feature }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右側登入表單區 -->
    <div class="w-full lg:w-1/2 flex flex-col items-center justify-center bg-slate-50 px-8 py-16">
      <div class="w-full max-w-md">
        <!-- 手機版 Logo -->
        <div class="lg:hidden text-center mb-10">
          <div
            class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-bolt text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-black text-slate-800 tracking-widest uppercase">Shizuku</h1>
        </div>

        <!-- 標題 -->
        <div class="mb-10">
          <h2 class="text-3xl font-black text-slate-800">員工登入</h2>
          <p class="text-slate-500 text-sm mt-2">請使用您的員工帳號進行身份驗證</p>
        </div>

        <!-- 表單 -->
        <div class="flex flex-col gap-7">
          <!-- 員工編號 -->
          <FloatLabel>
            <InputText
              id="fNumber"
              v-model="form.fNumber"
              class="w-full"
              @keyup.enter="handleLogin"
            />
            <label for="fNumber">員工編號</label>
          </FloatLabel>

          <!-- 密碼 -->
          <FloatLabel>
            <Password
              id="fPassword"
              v-model="form.fPassword"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
              @keyup.enter="handleLogin"
            />
            <label for="fPassword">密碼</label>
          </FloatLabel>

          <!-- 錯誤訊息 -->
          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>

          <!-- 登入按鈕 -->
          <Button
            label="登入後台"
            icon="pi pi-sign-in"
            iconPos="right"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full !py-3 !bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700 hover:!border-indigo-700"
            @click="handleLogin"
          />
        </div>

        <!-- 底部說明 -->
        <p class="text-center text-xs text-slate-400 mt-10">
          此系統僅限授權員工使用。如有問題請聯繫系統管理員。
        </p>
      </div>
    </div>
  </div>
</template>
