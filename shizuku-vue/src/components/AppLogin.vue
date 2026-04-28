<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const isRemember = ref(false);

const handleLogin = () => {
    console.log('Login attempt:', { email: email.value, password: password.value });
};
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center p-6 bg-slate-900">

        <div
            class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
        </div>

        <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

        <div
            class="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">

            <div class="text-center mb-8">
                <h1 class="text-3xl font-serif font-bold text-slate-800 mb-2 tracking-wide">Shizuku</h1>
                <p class="text-slate-600 text-sm">探索您的專屬風格</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">電子信箱</label>
                    <input v-model="email" type="email" placeholder="example@shizuku.com"
                        class="w-full p-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition placeholder:text-slate-400">
                </div>

                <div>
                    <div class="flex justify-between items-center mb-1.5">
                        <label class="block text-sm font-medium text-slate-700 ml-1">密碼</label>
                    </div>
                    <input v-model="password" type="password" placeholder="請輸入您的密碼"
                        class="w-full p-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition placeholder:text-slate-400">
                </div>

                <div class="flex items-center justify-between text-xs text-slate-600 mt-2">
                    <label class="flex items-center gap-2 cursor-pointer hover:text-slate-800 transition">
                        <input v-model="isRemember" type="checkbox" class="accent-emerald-600">
                        記住我
                    </label>
                    <a href="#" class="hover:text-emerald-700 hover:underline transition">忘記密碼？</a>
                </div>

                <button type="submit"
                    class="w-full py-4 mt-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                    登入帳號
                </button>
            </form>

            <div class="mt-8 text-center text-sm text-slate-600">
                還不是會員？ <a href="#" class="font-bold text-emerald-700 hover:underline">立即註冊</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    font-family: 'Georgia', serif;
}
</style>