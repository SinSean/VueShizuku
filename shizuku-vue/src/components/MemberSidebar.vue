<script setup>
const menuItems = [
    {
        title: '我的帳戶',
        children: [{ name: '個人檔案' }, { name: '銀行帳號 / 信用卡' }, { name: '地址' }]
    },
    {
        title: '購買清單',
        children: [{ name: '購買清單' }, { name: '通知總覽' }]
    }
];
</script>

<template>
    <aside class="w-1/4">
        <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
            <div>
                <h3 class="font-bold">userName</h3>
                <p class="text-sm text-gray-500 cursor-pointer">✏️ 編輯個人簡介</p>
            </div>
        </div>

        <nav class="space-y-4">
            <div v-for="section in menuItems" :key="section.title">
                <div class="font-bold text-gray-700 mb-2">{{ section.title }}</div>
                <ul class="space-y-2 ml-2">
                    <li v-for="item in section.children" :key="item.name"
                        class="cursor-pointer hover:text-orange-500 text-gray-600">
                        {{ item.name }}
                    </li>
                </ul>
            </div>
        </nav>
    </aside>
</template>
