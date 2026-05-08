<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('全部');
const tabs = ['全部', '折扣券', '點數回饋', '免運券'];

// 模擬 8 筆優惠券資料 (全數為服飾相關)
const vouchers = ref([
    { id: 1, type: 'discount', title: '夏季新品 9折', desc: '全館指定服飾系列適用 | 低消 $1,000', event: '新品上市', expiry: '2026.05.31', type_text: '商城折扣券', count: 2 },
    { id: 2, type: 'points', title: '6% 點數回饋', desc: '結帳金額 6% 回饋 | 低消 $1,500', event: '會員日', expiry: '2026.05.15', type_text: 'Shizuku 點數', count: 1 },
    { id: 3, type: 'discount', title: '滿額折 $200', desc: '服飾類單筆滿 $2,500 現折 $200', event: '限時折扣', expiry: '2026.05.10', type_text: '全館優惠', count: 1 },
    { id: 4, type: 'shipping', title: '全館免運費', desc: '不限金額 | 僅限超商取貨', event: '免運活動', expiry: '2026.06.01', type_text: '運費補貼', count: 3 },
    { id: 5, type: 'discount', title: '襯衫類 85折', desc: '指定長袖/短袖襯衫適用', event: '商務專區', expiry: '2026.05.20', type_text: '分類專屬', count: 1 },
    { id: 6, type: 'points', title: '評論加碼 20 pts', desc: '購買後完成評論即可獲得', event: '好評活動', expiry: '2026.05.30', type_text: 'Shizuku 點數', count: 5 },
    { id: 7, type: 'shipping', title: '免運券 (宅配)', desc: '滿 $1,500 宅配免運', event: 'VIP專享', expiry: '2026.06.15', type_text: '運費補貼', count: 1 },
    { id: 8, type: 'discount', title: '下單即享 95折', desc: '不限品項 | 首購限定', event: '新人見面禮', expiry: '2026.12.31', type_text: '全館優惠', count: 1 },
]);

// 篩選邏輯：對應 Tab 切換
const filteredVouchers = computed(() => {
    if (activeTab.value === '全部') return vouchers.value;

    const typeMap = {
        '折扣券': 'discount',
        '點數回饋': 'points',
        '免運券': 'shipping'
    };

    return vouchers.value.filter(v => v.type === typeMap[activeTab.value]);
});

const registerVoucher = () => {
    console.log('註冊優惠券');
};
</script>

<template>
    <div class="max-w-6xl mx-auto py-8">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800">我的優惠券夾</h2>
            <router-link to="/vouchers/history" class="text-sm text-blue-600 hover:underline flex items-center gap-1.5">
                <i class="pi pi-clock text-xs"></i> 檢視歷史紀錄
            </router-link>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex items-center gap-4">
            <label class="text-slate-700 font-medium shrink-0">新增優惠券</label>
            <input type="text" placeholder="請輸入優惠代碼"
                class="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none" />
            <button @click="registerVoucher"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">儲存</button>
        </div>

        <div class="border-b border-slate-200 mb-8 flex items-center gap-8">
            <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="['pb-4 text-sm font-semibold transition-colors relative',
                activeTab === tab ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600']">
                {{ tab }}
                <span v-if="activeTab === tab"
                    class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
            </button>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            <div v-for="voucher in filteredVouchers" :key="voucher.id" class="relative group">

                <div v-if="voucher.count > 1"
                    class="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                    x{{ voucher.count }}
                </div>

                <div
                    class="flex h-36 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-lg">
                    <div
                        class="w-1/3 bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 flex flex-col justify-between items-center relative">
                        <div class="absolute right-[-6px] top-0 h-full w-[12px] flex flex-col justify-around z-10">
                            <div v-for="i in 8" :key="i" class="w-[12px] h-[12px] bg-white rounded-full"></div>
                        </div>

                        <div class="text-center">
                            <i :class="['pi',
                                voucher.type === 'discount' ? 'pi-percentage' :
                                    voucher.type === 'points' ? 'pi-wallet' : 'pi-car',
                                'text-3xl text-blue-200']"></i>
                            <p class="text-xs font-medium text-blue-100 mt-2">{{ voucher.type_text }}</p>
                        </div>
                    </div>

                    <div class="flex-grow p-6 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <h4 class="font-black text-xl text-slate-800 tracking-tight">{{ voucher.title }}</h4>
                                <span v-if="voucher.event"
                                    class="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded">{{
                                    voucher.event }}</span>
                            </div>
                            <p class="text-sm text-slate-500 line-clamp-1">{{ voucher.desc }}</p>
                        </div>

                        <div
                            class="flex justify-between items-center text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
                            <span><i class="pi pi-clock mr-1"></i> {{ voucher.expiry }} 到期</span>
                            <button class="text-blue-600 font-bold hover:underline">立即使用</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="filteredVouchers.length === 0" class="col-span-2 py-10 text-center text-slate-400">
                目前沒有相關的優惠券
            </div>
        </div>
    </div>
</template>