<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiMemberRegister } from '@/api/member';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

// 依據 DTO 結構定義響應式表單
const form = reactive({
    fName: '',
    fEmail: '',
    fPhone: '',
    fGender: 1,
    fBirthday: '',
    fPassword: '',
    confirmPassword: ''
});

const handleRegister = async () => {
    // 1. 基本前端檢查
    if (form.fPassword !== form.confirmPassword) {
        errorMessage.value = '兩次密碼輸入不一致';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
        // 2. 呼叫 API 函式
        const response = await apiMemberRegister(form);

        // 3. 處理後端 ApiResponse 結構
        if (response.data.success) {
            alert(response.data.message || '註冊成功！');
            router.push({ name: 'Login' });
        }
    } catch (error) {
        // 4. 錯誤處理 (抓取後端 BadRequest 或 Conflict 的訊息)
        if (error.response && error.response.data) {
            errorMessage.value = error.response.data.message || '註冊失敗';
        } else {
            errorMessage.value = '連線伺服器失敗，請檢查網路狀況';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <div
            class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
        </div>
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

        <div class="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24">
            <!-- 左側文字區 -->
            <div class="hidden lg:flex flex-col text-white space-y-6 p-8">
                <h1 class="text-6xl font-serif font-bold tracking-wider">Shizuku</h1>
                <p class="text-xl text-slate-200 leading-relaxed">
                    加入 Shizuku。<br>開啟您的專屬時尚探索之旅。
                </p>
                <div class="w-16 h-1 bg-emerald-500 rounded-full"></div>
            </div>

            <!-- 右側表單區 -->
            <div
                class="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 mx-auto lg:mx-0 overflow-y-auto max-h-[90vh] py-1">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-serif font-bold text-slate-800 mb-2">建立帳號</h2>
                    <p class="text-slate-600 text-sm">歡迎加入我們的行列</p>
                </div>

                <!-- 錯誤顯示區 -->
                <div v-if="errorMessage"
                    class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleRegister" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">名稱</label>
                        <input v-model="form.fName" type="text" required placeholder="請輸入您的暱稱"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">電子信箱</label>
                        <input v-model="form.fEmail" type="email" required placeholder="example@shizuku.com"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">電話號碼</label>
                        <input v-model="form.fPhone" type="tel" required placeholder="0912345678"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">性別</label>
                        <div class="flex space-x-4 p-1">
                            <label class="flex items-center cursor-pointer text-slate-600 text-sm">
                                <input type="radio" v-model="form.fGender" :value="1" class="mr-2 text-emerald-500"> 男
                            </label>
                            <label class="flex items-center cursor-pointer text-slate-600 text-sm">
                                <input type="radio" v-model="form.fGender" :value="0" class="mr-2 text-emerald-500"> 女
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">生日日期</label>
                        <input v-model="form.fBirthday" type="date" required
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">密碼</label>
                        <input v-model="form.fPassword" type="password" required minlength="6" placeholder="密碼長度至少需 6 碼"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1 ml-1">確認密碼</label>
                        <input v-model="form.confirmPassword" type="password" required placeholder="再次確認密碼"
                            class="w-full p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition">
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full py-4 mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:bg-slate-400">
                        <span v-if="isLoading">註冊中...</span>
                        <span v-else>立即註冊</span>
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

input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
}
</style>