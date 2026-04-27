<template>
    <aside class="w-64 bg-slate-50 border-r border-slate-200 h-full p-4">
        <div class="flex items-center gap-3 mb-8 px-2">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                <i class="pi pi-user text-2xl"></i>
            </div>
            <div>
                <h3 class="font-bold text-slate-800">Andy</h3>
                <p class="text-xs text-blue-600 cursor-pointer hover:underline">編輯個人簡介</p>
            </div>
        </div>

        <nav class="space-y-1">
            <div v-for="section in menuItems" :key="section.title">

                <div @click="toggleSection(section)"
                    class="flex items-center justify-between py-3 px-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">
                    <div class="flex items-center gap-3">
                        <i :class="[section.icon, 'text-lg']"></i>
                        <span class="font-medium text-sm">{{ section.title }}</span>
                    </div>
                    <i v-if="section.children"
                        :class="['pi text-xs transition-transform', isAccountOpen ? 'pi-chevron-down' : 'pi-chevron-right']">
                    </i>
                </div>

                <div v-if="section.children && isAccountOpen" class="mt-1 mb-2 ml-4 border-l border-slate-200">
                    <ul class="space-y-1 ml-4">
                        <li v-for="child in section.children" :key="child.name"
                            class="py-2 px-3 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 cursor-pointer text-sm transition-colors">
                            {{ child.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </aside>
</template>

<script setup>
import { ref } from 'vue';

// 狀態管理：控制是否展開
const isAccountOpen = ref(true);

const toggleSection = (section) => {
    if (section.children) {
        isAccountOpen.value = !isAccountOpen.value;
    } else {
        // 這裡處理點擊沒有子選單的項目 (如購買清單的路由跳轉)
        console.log('跳轉到:', section.title);
    }
};

const menuItems = [
    {
        title: '我的帳戶',
        icon: 'pi pi-user',
        children: [
            { name: '個人檔案' },
            { name: '銀行帳號 / 信用卡' },
            { name: '地址' },
            { name: '更改密碼' },
            { name: '通知設置' },
            { name: '隱私設定' }
        ]
    },
    { title: '購買清單', icon: 'pi pi-list' },
    { title: '通知總覽', icon: 'pi pi-bell' },
    { title: '我的優惠券', icon: 'pi pi-ticket' },
    { title: '我的點數', icon: 'pi pi-wallet' },
    { title: '交易支付及退款查詢', icon: 'pi pi-credit-card' }
];
</script>