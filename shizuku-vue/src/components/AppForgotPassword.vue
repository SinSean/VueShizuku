<script setup>
import { ref } from 'vue';

// 控制目前的找回方式 ('email' 或 'phone')
const recoveryMethod = ref('email');
const email = ref('');
const phoneNumber = ref('');

const handleSubmit = () => {
    if (recoveryMethod.value === 'email') {
        console.log('正在為信箱發送重設連結:', email.value);
    } else {
        console.log('正在為手機發送驗證碼:', phoneNumber.value);
    }
    // 在這裡加入後端 API 呼叫
};
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center p-6">
        <div
            class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
        </div>
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

        <div
            class="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl p-10 md:p-12 rounded-3xl shadow-2xl border border-white/20">

            <div class="text-center mb-10">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 border-4 border-white mb-6 shadow-sm">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                        </path>
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-slate-900 tracking-tight">重設您的密碼</h1>
                <p class="text-slate-600 mt-2 text-base">別擔心，這很常見。請選擇一種方式來找回您的帳號。</p>
            </div>

            <div class="grid grid-cols-2 p-1.5 bg-slate-200/50 rounded-xl mb-8">
                <button @click="recoveryMethod = 'email'" :class="[
                    'py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2',
                    recoveryMethod === 'email'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                ]">
                    電子信箱
                </button>
                <button @click="recoveryMethod = 'phone'" :class="[
                    'py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2',
                    recoveryMethod === 'phone'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                ]">
                    手機號碼
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div v-if="recoveryMethod === 'email'">
                    <label class="block text-sm font-semibold text-slate-700 mb-2 ml-1">輸入註冊時的電子信箱</label>
                    <div class="relative">
                        <input v-model="email" type="email" placeholder="example@shizuku.com"
                            class="w-full px-4 py-3.5 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition placeholder:text-slate-400 text-slate-900">
                    </div>
                </div>

                <div v-else>
                    <label class="block text-sm font-semibold text-slate-700 mb-2 ml-1">輸入註冊時的手機號碼</label>
                    <div class="relative flex">
                        <span
                            class="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200/60 bg-slate-50/50 text-slate-600 text-sm">
                            +886
                        </span>
                        <input v-model="phoneNumber" type="tel" placeholder="912345678"
                            class="w-full px-4 py-3.5 bg-white/60 border border-slate-200/60 rounded-r-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition placeholder:text-slate-400 text-slate-900">
                    </div>
                </div>

                <button type="submit"
                    class="w-full py-4 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95 text-base">
                    {{ recoveryMethod === 'email' ? '發送重設連結' : '發送驗證碼' }}
                </button>
            </form>

            <div class="mt-10 text-center text-sm border-t border-slate-200/50 pt-8">
                想起密碼了？ <RouterLink :to="{ name: 'Login' }"
                    class="font-semibold text-blue-700 hover:text-blue-900 hover:underline transition">返回登入頁面
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 針對手機號碼輸入框，移除 number 類型自帶的上下箭頭 */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>