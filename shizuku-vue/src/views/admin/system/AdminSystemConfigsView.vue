<script setup>
import { ref } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'
import InputNumber from 'primevue/inputnumber'
import Message from 'primevue/message'

// 狀態管理：使用本地 ref 模擬資料庫撈出來的資料
const configs = ref([
    {
        fConfigKey: 'Captcha',
        fFailedAttemptsThreshold: 3,
        fIsActive: true,
        fDescription: '圖形驗證碼機制（錯誤達門檻需輸入驗證碼，可由後台關閉）'
    },
    {
        fConfigKey: 'Lockout',
        fFailedAttemptsThreshold: 6,
        fIsActive: true,
        fDescription: '帳號硬鎖定機制（錯誤達門檻直接凍結帳號）'
    }
])

// 模擬前端測試區的狀態
const loading = ref(false)
const fakeFailedCount = ref(0)
const testMessage = ref('')
const testSeverity = ref('info')
const showFakeCaptcha = ref(false)
const isAccountLocked = ref(false)

// 模擬更新設定
const handleConfigChange = (config) => {
    // 重置下方的模擬測試狀態，讓開發者重新測試
    resetTest()
}

// 模擬重整按鈕
const refreshConfigs = () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 500)
}

// 模擬使用者登入失敗的邏輯（完完全全對應你寫的 C# 後端邏輯！）
const simulateFailedLogin = () => {
    if (isAccountLocked.value) {
        testSeverity.value = 'error'
        testMessage.value = '您的帳號已被鎖定或停用，請聯繫客服人員處理。'
        return
    }

    // 1. 失敗次數加 1
    fakeFailedCount.value++

    // 2. 抓取目前的設定值
    const captchaConfig = configs.value.find(c => c.fConfigKey === 'Captcha')
    const lockoutConfig = configs.value.find(c => c.fConfigKey === 'Lockout')

    // 3. 判斷硬鎖定是否觸發
    if (lockoutConfig.fIsActive && fakeFailedCount.value >= lockoutConfig.fFailedAttemptsThreshold) {
        isAccountLocked.value = true
        showFakeCaptcha.value = false
        testSeverity.value = 'error'
        testMessage.value = '密碼錯誤次數已達上限，帳號已被鎖定，請聯繫客服人員處理。'
        return
    }

    // 4. 判斷驗證碼是否觸發
    if (captchaConfig.fIsActive && fakeFailedCount.value >= captchaConfig.fFailedAttemptsThreshold) {
        showFakeCaptcha.value = true
        testSeverity.value = 'warn'
        testMessage.value = '電子信箱或密碼輸入錯誤，下次登入請輸入驗證碼。'
        return
    }

    // 5. 一般失敗
    testSeverity.value = 'secondary'
    testMessage.value = '電子信箱或密碼輸入錯誤。'
}

// 重置測試區
const resetTest = () => {
    fakeFailedCount.value = 0
    testMessage.value = ''
    showFakeCaptcha.value = false
    isAccountLocked.value = false
}
</script>

<template>
    <div class="p-6 max-w-7xl mx-auto space-y-6">

        <!-- 頁頭標題區塊（與會員管理完全同步） -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 tracking-wide">安全機制測試面板</h1>
                <p class="text-sm text-slate-500 mt-1">模擬執行模式：可動態切換上方開關，並於下方即時測試登入反饋。</p>
            </div>

            <div class="flex items-center gap-3">
                <button @click="refreshConfigs" :disabled="loading"
                    class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-60 transition-all duration-200 shadow-sm">
                    <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
                    <span>重新整理</span>
                </button>
            </div>
        </div>

        <!-- 上半部：設定卡片網格區塊 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="config in configs" :key="config.fConfigKey"
                class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-md">

                <!-- 卡片頭部 -->
                <div class="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span
                            class="font-mono font-bold text-base text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-sm">
                            {{ config.fConfigKey }}
                        </span>
                        <span class="inline-flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full"
                                :class="config.fIsActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'"></span>
                            <span class="text-xs font-medium"
                                :class="config.fIsActive ? 'text-emerald-600' : 'text-slate-400'">
                                {{ config.fIsActive ? '機制執行中' : '已關閉測試' }}
                            </span>
                        </span>
                    </div>

                    <!-- 功能開關 -->
                    <ToggleSwitch v-model="config.fIsActive" @change="handleConfigChange(config)" />
                </div>

                <!-- 卡片內容物 -->
                <div class="p-6 space-y-5">
                    <div>
                        <label
                            class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">機制描述</label>
                        <p class="text-sm text-slate-600 leading-relaxed">{{ config.fDescription }}</p>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                            <label class="text-sm font-medium text-slate-700 block">觸發失敗次數門檻</label>
                            <span class="text-xs text-slate-400">當登入連續失敗達此上限時觸發</span>
                        </div>

                        <InputNumber v-model="config.fFailedAttemptsThreshold" showButtons buttonLayout="horizontal"
                            :min="1" :max="20" @input="handleConfigChange(config)" :disabled="!config.fIsActive"
                            class="custom-input-number"
                            inputClass="w-12 text-center !py-1.5 !border-slate-200 text-sm font-medium" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 下半部：即時互動模擬測試區 -->
        <div class="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-lg font-bold text-slate-800">沙盒模擬登入測試區</h2>
                    <p class="text-xs text-slate-500 mt-0.5">點擊按鈕模擬「密碼輸入錯誤」，觀察系統如何根據上方設定進行防禦。</p>
                </div>
                <button @click="resetTest"
                    class="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                    重置測試模擬
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <!-- 動作按鈕與計數 -->
                <div
                    class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">目前連續失敗次數</span>
                    <span class="text-4xl font-black text-slate-800 font-mono">{{ fakeFailedCount }}</span>

                    <button @click="simulateFailedLogin"
                        class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-[0.98]">
                        模擬登入失敗 1 次
                    </button>
                </div>

                <!-- 模擬畫面的動態反應 -->
                <div class="md:col-span-2 space-y-4">
                    <!-- 系統訊息回傳提示 -->
                    <div class="min-h-[52px]">
                        <Message v-if="testMessage" :severity="testSeverity" class="!rounded-xl !m-0" :closable="false">
                            {{ testMessage }}
                        </Message>
                        <div v-else
                            class="text-sm text-slate-400 italic border border-dashed border-slate-200 rounded-xl p-4 text-center bg-white/50">
                            暫無系統回傳訊息，請點擊左側按鈕開始模擬
                        </div>
                    </div>

                    <!-- 模擬登入表單的動態改變 -->
                    <div class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                        <span
                            class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">前台登入畫面模擬狀態</span>

                        <div class="p-4 rounded-xl border flex items-center justify-between"
                            :class="isAccountLocked ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-600'">
                            <span class="text-sm font-medium">帳號控制狀態：</span>
                            <span class="text-sm font-bold">{{ isAccountLocked ? '帳號已被硬鎖定（無法登入）' : '正常運作中' }}</span>
                        </div>

                        <!-- 模擬圖形驗證碼顯示 -->
                        <div v-if="showFakeCaptcha"
                            class="p-4 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-2 animate-fade-in">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-amber-800">觸發安全防禦：請輸入圖形驗證碼</span>
                                <span
                                    class="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-mono">驗證碼已啟用</span>
                            </div>
                            <div
                                class="h-10 bg-slate-200 rounded flex items-center justify-center text-slate-500 font-mono tracking-widest font-bold select-none border border-slate-300">
                                A 8 F 9
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* 深度優化 PrimeVue 橫向按鈕樣式 */
:deep(.custom-input-number .p-inputnumber-button) {
    background-color: #ffffff !important;
    border-color: #e2e8f0 !important;
    color: #64748b !important;
}

:deep(.custom-input-number .p-inputnumber-button:hover) {
    background-color: #f8fafc !important;
    color: #4f46e5 !important;
}

:deep(.custom-input-number .p-inputnumber-increment-button) {
    border-top-right-radius: 0.75rem !important;
    border-bottom-right-radius: 0.75rem !important;
}

:deep(.custom-input-number .p-inputnumber-decrement-button) {
    border-top-left-radius: 0.75rem !important;
    border-bottom-left-radius: 0.75rem !important;
}

:deep(.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider) {
    background-color: #10b981 !important;
}

/* 簡單的淡入動畫 */
.animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(2px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>