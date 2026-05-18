<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

const totalPoints = ref('50');
const expiringSoon = ref(0);

totalPoints.value = authStore.userPoints.toLocaleString();

// 模擬資料
const pointsHistory = ref([
    { id: 1, type: 'order', title: '完成訂單 #12345', amount: +50, date: '2026-04-28' },
    { id: 2, type: 'use', title: '兌換折價券', amount: -100, date: '2026-04-20' },
]);
</script>

<template>
    <div class="max-w-4xl mx-auto py-8">
        <h2 class="text-2xl font-bold text-slate-800 mb-6">點數中心</h2>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-500 to-emerald-400 rounded-2xl p-6 text-white shadow-lg">
                <p class="text-amber-100 mb-1">可用點數</p>
                <h3 class="text-4xl font-black mb-4">{{ totalPoints }} <span class="text-xl font-normal">pts</span></h3>
                <div class="flex justify-between items-end">
                    <p class="text-sm opacity-90">即將到期：{{ expiringSoon }} pts</p>
                    <router-link to="/points/mall"
                        class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-lg text-sm transition">
                        前往商城
                    </router-link>
                </div>
            </div>

            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <h4 class="font-bold text-slate-700 mb-4">如何快速累積點數？</h4>
                <div class="space-y-3">
                    <div class="flex items-center gap-3 text-sm text-slate-600">
                        <i class="pi pi-check-circle text-green-500"></i> 每日簽到 (+5 pts)
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-600">
                        <i class="pi pi-check-circle text-green-500"></i> 完成訂單 (消費金額 1%)
                    </div>
                    <div class="flex items-center gap-3 text-sm text-slate-600">
                        <i class="pi pi-check-circle text-green-500"></i> 評論商品 (+20 pts)
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="text-lg font-bold text-slate-800 mb-4">點數紀錄</h3>
            <div class="overflow-hidden">
                <table class="w-full text-left">
                    <thead>
                        <tr class="text-slate-400 text-sm border-b border-slate-100">
                            <th class="pb-3 font-medium">項目</th>
                            <th class="pb-3 font-medium">日期</th>
                            <th class="pb-3 font-medium text-right">變動</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in pointsHistory" :key="item.id" class="border-b border-slate-50 last:border-0">
                            <td class="py-4 text-slate-700">{{ item.title }}</td>
                            <td class="py-4 text-slate-500 text-sm">{{ item.date }}</td>
                            <td
                                :class="['py-4 text-right font-bold', item.amount > 0 ? 'text-green-600' : 'text-slate-600']">
                                {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 漸層卡片微調 */
.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);
}
</style>