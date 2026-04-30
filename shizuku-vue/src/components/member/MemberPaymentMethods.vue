<script setup>
import { ref } from 'vue';

// 狀態管理：預設為空陣列，代表還沒有資料
const creditCards = ref([]);
const bankAccounts = ref([]);

const addCard = () => {
    console.log('打開新增信用卡視窗');
};

const addBankAccount = () => {
    console.log('打開新增銀行帳號視窗');
};
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen">
        <h2 class="text-2xl font-bold text-slate-800 mb-8">支付方式管理</h2>

        <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <i class="pi pi-credit-card text-blue-600"></i>
                    信用卡 / 金融卡
                </h3>
                <button 
                    @click="addCard"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <i class="pi pi-plus"></i> 新增信用卡
                </button>
            </div>

            <div v-if="creditCards.length === 0" class="py-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
                <i class="pi pi-credit-card text-3xl text-slate-300 mb-2"></i>
                <p class="text-slate-400">目前沒有綁定的信用卡</p>
            </div>
            <div v-else>
                </div>
        </section>

        <section class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <i class="pi pi-building text-blue-600"></i>
                    銀行帳號
                </h3>
                <button 
                    @click="addBankAccount"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <i class="pi pi-plus"></i> 新增銀行帳號
                </button>
            </div>

            <div v-if="bankAccounts.length === 0" class="py-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
                <i class="pi pi-building text-3xl text-slate-300 mb-2"></i>
                <p class="text-slate-400">目前沒有綁定的銀行帳號</p>
            </div>
            <div v-else>
                </div>
        </section>
    </div>
</template>

<style scoped>
/* 這裡可以放針對此頁面的特殊調整 */
.shadow-sm {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}
</style>