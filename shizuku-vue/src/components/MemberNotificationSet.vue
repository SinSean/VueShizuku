<script setup>
import { ref } from 'vue';

// 模擬資料結構：將設定檔拆分，便於未來擴充
const emailSettings = ref([
    { id: 'email_security', title: '帳戶安全通知', desc: '包含登入提醒、密碼變更及重要帳號異動，無法關閉。', enabled: true, disabled: true },
    { id: 'email_order', title: '訂單狀態更新', desc: '通知訂單付款、出貨及配送進度。', enabled: true },
    { id: 'email_marketing', title: '優惠與活動資訊', desc: '接收最新的促銷活動與個人化推薦。', enabled: false },
    { id: 'email_survey', title: '使用者滿意度問卷', desc: '協助我們改善服務，偶爾發送問卷邀請。', enabled: true },
]);

const smsSettings = ref([
    { id: 'sms_security', title: '帳戶安全簡訊', desc: '緊急安全通知，為保障您的帳號安全。', enabled: true, disabled: true },
    { id: 'sms_marketing', title: '獨家優惠簡訊', desc: '接收第一手的限時折扣與閃購活動。', enabled: true },
]);

const toggleSetting = (item) => {
    if (item.disabled) return;
    item.enabled = !item.enabled;
    console.log(`Setting ${item.id} changed to: ${item.enabled}`);
};
</script>

<template>
    <div class="max-w-2xl mx-auto py-8">
        <h2 class="text-2xl font-bold text-slate-800 mb-6">通知設定</h2>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 class="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                <i class="pi pi-envelope"></i> Email 通知
            </h3>
            <div class="space-y-6">
                <div v-for="item in emailSettings" :key="item.id" class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-slate-700">{{ item.title }}</p>
                        <p class="text-sm text-slate-400 mt-0.5">{{ item.desc }}</p>
                    </div>
                    <button @click="toggleSetting(item)" :class="['w-12 h-6 rounded-full transition-colors duration-300 relative',
                        item.enabled ? 'bg-blue-600' : 'bg-slate-300',
                        item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
                        <span :class="['absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300',
                            item.enabled ? 'translate-x-6' : '']"></span>
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                <i class="pi pi-comment"></i> 簡訊通知
            </h3>
            <div class="space-y-6">
                <div v-for="item in smsSettings" :key="item.id" class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-slate-700">{{ item.title }}</p>
                        <p class="text-sm text-slate-400 mt-0.5">{{ item.desc }}</p>
                    </div>
                    <button @click="toggleSetting(item)" :class="['w-12 h-6 rounded-full transition-colors duration-300 relative',
                        item.enabled ? 'bg-blue-600' : 'bg-slate-300',
                        item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
                        <span :class="['absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300',
                            item.enabled ? 'translate-x-6' : '']"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 這裡不需要特別寫額外的 CSS，全部用 Tailwind 的 utility class 完成 */
</style>