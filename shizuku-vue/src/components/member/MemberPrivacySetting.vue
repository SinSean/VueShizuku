<script setup>
import { ref } from 'vue';

const sessions = ref([
    { device: 'Windows 10 · Chrome', location: 'Kaohsiung, TW', current: true },
    //{ device: 'iPhone 15 · Safari', location: 'Kaohsiung, TW', current: false },
]);

const is2FAEnabled = ref(false);

const revokeSession = (device) => {
    console.log(`登出裝置: ${device}`);
};
</script>

<template>
    <div class="max-w-2xl mx-auto py-8">
        <h2 class="text-2xl font-bold text-slate-800 mb-6">隱私與安全設定</h2>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 class="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                <i class="pi pi-desktop"></i> 目前登入裝置
            </h3>
            <div class="space-y-4">
                <div v-for="session in sessions" :key="session.device"
                    class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                        <p class="font-medium text-slate-700">{{ session.device }}
                            <span v-if="session.current"
                                class="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">目前裝置</span>
                        </p>
                        <p class="text-xs text-slate-500">{{ session.location }}</p>
                    </div>
                    <button v-if="!session.current" @click="revokeSession(session.device)"
                        class="text-sm text-red-500 hover:text-red-700 font-medium">登出</button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 class="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                <i class="pi pi-shield"></i> 帳號安全
            </h3>
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium text-slate-700">雙重驗證 (2FA)</p>
                    <p class="text-sm text-slate-400">啟用後，登入時需進行額外驗證。</p>
                </div>
                <button @click="is2FAEnabled = !is2FAEnabled"
                    :class="['w-12 h-6 rounded-full transition-colors duration-300 relative', is2FAEnabled ? 'bg-blue-600' : 'bg-slate-300']">
                    <span
                        :class="['absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300', is2FAEnabled ? 'translate-x-6' : '']"></span>
                </button>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-red-100 p-6">
            <h3 class="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <i class="pi pi-exclamation-triangle"></i> 帳號控制
            </h3>
            <p class="text-sm text-slate-500 mb-4">刪除帳號將會移除所有歷史訂單與會員資料，此動作無法復原。</p>
            <button
                class="w-full py-2.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
                申請永久刪除帳號
            </button>
        </div>
    </div>
</template>