<script setup>
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = () => {
    // 這裡加入註冊邏輯
    console.log('Register attempt:', {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    });
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
                class="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 mx-auto lg:mx-0">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-serif font-bold text-slate-800 mb-2">建立帳號</h2>
                    <p class="text-slate-600 text-sm">歡迎加入我們的行列</p>
                </div>

                <form @submit.prevent="handleRegister" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">名稱</label>
                        <input v-model="name" type="text" placeholder="請輸入您的暱稱"
                            class="w-full p-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition placeholder:text-slate-400">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">電子信箱</label>
                        <input v-model="email" type="email" placeholder="example@shizuku.com"
                            class="w-full p-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition placeholder:text-slate-400">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">密碼</label>
                        <input v-model="password" type="password" placeholder="設定您的密碼"
                            class="w-full p-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition placeholder:text-slate-400">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">確認密碼</label>
                        <input v-model="confirmPassword" type="password" placeholder="再次確認密碼"
                            class="w-full p-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition placeholder:text-slate-400">
                    </div>

                    <button type="submit"
                        class="w-full py-4 mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-95">
                        立即註冊
                    </button>
                </form>

                <div class="mt-8 text-center text-sm text-slate-600">
                    已經有帳號了？ <RouterLink :to="{ name: 'Login' }" class="font-bold text-emerald-700 hover:underline">返回登入
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
</style>