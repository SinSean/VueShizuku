<script setup>
import { ref, reactive } from 'vue';

// 根據 DTO 結構定義，建議使用 reactive 管理表單
// 提醒：對接後端時，屬性名稱建議符合 .NET camelCase 慣例 
const form = reactive({
    fName: '',
    fEmail: '',
    fPhone: '',
    fGender: null, // 性別使用 int [cite: 145, 146]
    fBirthday: '',
    fPassword: '',
    confirmPassword: ''
});

const handleRegister = () => {
    // 這裡加入 API 提交邏輯
    console.log('提交註冊資料:', form);
};
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <div
            class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
        </div>
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

        <div class="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div class="hidden lg:flex flex-col text-white space-y-6 p-8">
                <h1 class="text-6xl font-serif font-bold tracking-wider">Shizuku</h1>
                <p class="text-xl text-slate-200 leading-relaxed">
                    加入 Shizuku。<br>
                    開啟您的專屬時尚探索之旅。
                </p>
                <div class="w-16 h-1 bg-emerald-500 rounded-full"></div>
            </div>

            <div
                class="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 mx-auto lg:mx-0 overflow-y-auto max-h-[90vh] py-1">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-serif font-bold text-slate-800 mb-2">建立帳號</h2>
                    <p class="text-slate-600 text-sm">歡迎加入我們的行列</p>
                </div>

                <form @submit.prevent="handleRegister" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">名稱</label>
                        <input v-model="form.fName" type="text" placeholder="請輸入您的暱稱"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">電子信箱</label>
                        <input v-model="form.fEmail" type="email" placeholder="example@shizuku.com"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">電話號碼</label>
                        <input v-model="form.fPhone" type="tel" placeholder="0912345678"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">性別</label>
                        <div class="flex space-x-4 p-1">
                            <label class="flex items-center cursor-pointer text-slate-600 text-sm">
                                <input type="radio" v-model="form.fGender" :value="1"
                                    class="mr-2 text-emerald-500 focus:ring-emerald-500"> 男
                            </label>
                            <label class="flex items-center cursor-pointer text-slate-600 text-sm">
                                <input type="radio" v-model="form.fGender" :value="2"
                                    class="mr-2 text-emerald-500 focus:ring-emerald-500"> 女
                            </label>
                            <label class="flex items-center cursor-pointer text-slate-600 text-sm">
                                <input type="radio" v-model="form.fGender" :value="0"
                                    class="mr-2 text-emerald-500 focus:ring-emerald-500"> 其他
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">生日日期</label>
                        <input v-model="form.fBirthday" type="date"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">密碼</label>
                        <input v-model="form.fPassword" type="password" placeholder="密碼"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">確認密碼</label>
                        <input v-model="form.confirmPassword" type="password" placeholder="確認"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <button type="submit"
                        class="w-full py-4 mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                        立即註冊
                    </button>
                </form>

                <div class="mt-6 text-center text-sm text-slate-600">
                    已經有帳號了？
                    <RouterLink :to="{ name: 'Login' }" class="font-bold text-emerald-700 hover:underline">返回登入
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1,
h2 {
    font-family: 'Georgia', serif;
}

/* 隱藏 Chrome 的 Date Input 預設圖示以保持美觀 */
input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
}
</style>