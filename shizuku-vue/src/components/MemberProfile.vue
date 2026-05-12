<template>
    <main class="w-full bg-white p-10 shadow-sm border border-slate-100 rounded-xl">
        <div class="mb-8 border-b border-slate-100 pb-6">
            <h2 class="text-2xl font-bold text-slate-800">個人檔案</h2>
            <p class="text-slate-500 text-sm mt-1">管理你的個人資料，確保帳號資訊準確</p>
        </div>

        <form class="grid grid-cols-1 md:grid-cols-3 gap-12" @submit.prevent="saveProfile">
            <div class="md:col-span-2 space-y-8">

                <div class="space-y-6">
                    <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <i class="pi pi-user-edit text-blue-600"></i> 基本資料
                    </h3>

                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-slate-700">使用者帳號</label>
                        <input type="text" disabled value="Andy"
                            class="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed" />
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-slate-700">姓名</label>
                        <input type="text" v-model="profile.name" placeholder="請輸入姓名"
                            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-semibold text-slate-700">性別</label>
                        <div class="flex gap-6 pt-2">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" v-model="profile.gender" value="male"
                                    class="text-blue-600 focus:ring-blue-500" />
                                <span class="text-slate-700">男性</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" v-model="profile.gender" value="female"
                                    class="text-blue-600 focus:ring-blue-500" />
                                <span class="text-slate-700">女性</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" v-model="profile.gender" value="other"
                                    class="text-blue-600 focus:ring-blue-500" />
                                <span class="text-slate-700">其他</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="space-y-6 pt-6 border-t border-slate-100">
                    <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <i class="pi pi-shield text-blue-600"></i> 帳戶安全
                    </h3>

                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase">電子郵件</p>
                                <p class="text-slate-700 font-medium">se******@gmail.com</p>
                            </div>
                            <router-link to="/verify/email"
                                class="text-blue-600 font-medium hover:underline text-sm">[變更]</router-link>
                        </div>

                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase">手機號碼</p>
                                <p class="text-slate-700 font-medium">**********52</p>
                            </div>
                            <router-link to="/verify/phone"
                                class="text-blue-600 font-medium hover:underline text-sm">[變更]</router-link>
                        </div>

                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase">生日</p>
                                <p class="text-slate-700 font-medium">1998/05/20</p>
                            </div>
                            <router-link to="/verify/birthday"
                                class="text-blue-600 font-medium hover:underline text-sm">[變更]</router-link>
                        </div>
                    </div>
                </div>

                <div class="pt-4">
                    <button type="submit"
                        class="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95">
                        儲存變更
                    </button>
                </div>
            </div>

            <div class="flex flex-col items-center border-l border-slate-100 pl-8">
                <div
                    class="w-32 h-32 bg-slate-100 rounded-full mb-6 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">
                    <i class="pi pi-user text-slate-400 text-5xl"></i>
                </div>
                <button type="button" class="text-blue-600 font-medium text-sm hover:underline">
                    選擇照片
                </button>
            </div>
        </form>
    </main>
</template>

<script setup>
import { ref } from 'vue';

// 假設這是後端撈回來的資料
const profile = ref({
    name: '大明',
    gender: 'male'
});

const saveProfile = () => {
    console.log('儲存基本資料:', profile.value);
    // 這裡呼叫 API 更新姓名與性別
};
</script>