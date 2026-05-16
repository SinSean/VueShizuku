<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const isAccountOpen = ref(true);

const toggleSection = (section) => {
    if (section.children) {
        isAccountOpen.value = !isAccountOpen.value;
    } else {
        console.log('跳轉到:', section.title);
    }
};

const menuItems = [
    {
        title: '我的帳戶',
        icon: 'pi pi-user',
        children: [
            { name: '個人檔案', routeName: 'MemberProfile' }, //已完成
            { name: '銀行帳號 / 信用卡', routeName: 'MemberPayMentmetod' },//已完成畫面
            { name: '地址', routeName: 'MemberAddress' },  //已完成
            { name: '更改密碼', routeName: 'MemberSetPassword' },//已完成畫面
            { name: '通知設置', routeName: 'MemberNotificationSet' },//已完成畫面
            { name: '隱私設定', routeName: 'MemberPrivacySetting' }//已完成畫面
        ]
    },
    { title: '訂單列表', icon: 'pi pi-list', routeName: 'MemberOrders' },//已完成轉接
    //{ title: '通知總覽', icon: 'pi pi-bell', routeName: 'MemberEmpty' },
    { title: '我的優惠券', icon: 'pi pi-ticket', routeName: 'MemberVouchers' },
    { title: '我的點數', icon: 'pi pi-wallet', routeName: 'MemberPointsDashboard' },//已完成畫面
    //{ title: '交易支付及退款查詢', icon: 'pi pi-credit-card', routeName: 'MemberEmpty' }
];
</script>

<template>
    <aside class="w-64 bg-slate-50 border-r border-slate-200 h-full p-4">
        <div class="flex items-center gap-3 mb-8 px-2">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                <i class="pi pi-user text-2xl"></i>
            </div>
            <div>
                <h3 class="font-bold text-slate-800">{{ authStore.userName }}</h3>
                <p class="text-xs text-blue-600 cursor-pointer hover:underline">編輯個人簡介</p>
            </div>
        </div>

        <nav class="space-y-1">
            <div v-for="section in menuItems" :key="section.title">

                <div v-if="section.children" @click="toggleSection(section)"
                    class="flex items-center justify-between py-3 px-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">
                    <div class="flex items-center gap-3">
                        <i :class="[section.icon, 'text-lg']"></i>
                        <span class="font-medium text-sm">{{ section.title }}</span>
                    </div>
                    <i
                        :class="['pi text-xs transition-transform', isAccountOpen ? 'pi-chevron-down' : 'pi-chevron-right']"></i>
                </div>

                <router-link v-else :to="{ name: section.routeName }"
                    class="flex items-center py-3 px-3 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all"
                    active-class="bg-blue-100 text-blue-700 font-bold">
                    <div class="flex items-center gap-3">
                        <i :class="[section.icon, 'text-lg']"></i>
                        <span class="font-medium text-sm">{{ section.title }}</span>
                    </div>
                </router-link>

                <div v-if="section.children && isAccountOpen" class="mt-1 mb-2 ml-4 border-l border-slate-200">
                    <ul class="space-y-1 ml-4">
                        <router-link v-for="child in section.children" :key="child.name" :to="{ name: child.routeName }"
                            class="block py-2 px-3 rounded-lg text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
                            active-class="bg-blue-100 text-blue-600 font-bold">
                            {{ child.name }}
                        </router-link>
                    </ul>
                </div>
            </div>
        </nav>
    </aside>
</template>
