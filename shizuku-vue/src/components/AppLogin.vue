<script setup>
import { ref } from 'vue';
import { loginAPI, getCaptchaAPI } from '@/api/member';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const email = ref('sealll4001@gmail.com');
const password = ref('Password123!1');
const isRemember = ref(false);
const isLoading = ref(false);
const router = useRouter();

// 驗證碼相關的響應式變數
const captchaAnswer = ref('');   // 使用者輸入的答案
const captchaId = ref('');       // 後端傳來的驗證碼 ID
const captchaImg = ref('');      // 驗證碼圖片的 Base64 網址
const showCaptcha = ref(false);  // 是否顯示驗證碼欄位 (預設隱藏)

// 向後端獲取新驗證碼的函式
const fetchCaptcha = async () => {
    try {
        const response = await getCaptchaAPI();
        const res = response.data;
        if (res.success) {
            captchaId.value = res.data.captchaId;
            captchaImg.value = res.data.imgBase64;
            captchaAnswer.value = ''; // 切換驗證碼時清空輸入框
        }
    } catch (error) {
        console.error("無法取得驗證碼:", error);
    }
};

const handleLogin = async () => {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
        // 送出的 DTO 加上驗證碼欄位 (若沒觸發，預設就是 null/空字串)
        const response = await loginAPI({
            fEmail: email.value,
            fPassword: password.value,
            captchaAnswer: captchaAnswer.value || null,
            captchaId: captchaId.value || null
        });

        const res = response.data;
        if (res.success) {
            // 將後端回傳含有 token 的整個物件傳進 store
            await authStore.login(res.data);

            try {
                await authStore.fetchUserAddress();
            } catch (e) {
                console.warn("預載地址失敗，但不影響登入流程");
            }

            alert('登入成功');
            router.push({ name: 'home' });
        } else {
            alert(res.message || '登入失敗，請檢查帳密');
        }
    } catch (error) {
        console.error("捕捉到錯誤:", error);

        // 攔截後端的 401 Unauthorized 狀態碼
        if (error.response && error.response.status === 401) {
            const apiMessage = error.response.data?.message || '認證失敗';
            alert(apiMessage);

            // 如果錯誤訊息提及驗證碼、失敗上限，或者畫面上已經在顯示驗證碼了
            if (apiMessage.includes('驗證碼') || apiMessage.includes('上限') || showCaptcha.value) {
                showCaptcha.value = true;

                // 不管是驗證碼錯還是密碼錯，只要在驗證碼模式下失敗，舊驗證碼就失效了，必須刷新
                await fetchCaptcha();
            }
        } else if (error.code === 'ECONNABORTED') {
            alert('伺服器回應太久（逾時），請檢查後端是否掛掉');
        } else {
            const errorMsg = error.response?.data?.message || '系統連線錯誤';
            alert(errorMsg);
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

                <div v-if="showCaptcha" class="space-y-2 animate-fade-in">
                    <label class="block text-sm font-medium text-slate-700 ml-1">圖形驗證碼</label>
                    <div class="flex gap-3 items-center">
                        <!-- 驗證碼圖片，點擊可更換 -->
                        <img :src="captchaImg" @click="fetchCaptcha" alt="點擊更換驗證碼"
                            class="h-12 rounded-xl cursor-pointer hover:opacity-80 transition border border-slate-200 shadow-sm"
                            title="看不清？點擊換一張" />

                        <input v-model="captchaAnswer" type="text" placeholder="輸入 4 位驗證碼" maxLength="4"
                            class="flex-1 p-3 bg-white/60 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition placeholder:text-slate-400 uppercase font-mono tracking-widest text-center text-lg">
                    </div>
                    <p class="text-[11px] text-slate-500 ml-1">看不清圖片？點擊圖片即可更換新驗證碼</p>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-600 mt-2">
                    <label class="flex items-center gap-2 cursor-pointer hover:text-slate-800 transition">
                        <input v-model="isRemember" type="checkbox" class="accent-emerald-600">
                        記住我
                    </label>

                    <RouterLink :to="{ name: 'ForgotPassword' }"
                        class="hover:text-emerald-700 hover:underline transition">
                        忘記密碼？
                    </RouterLink>
                </div>

                <button type="submit" :disabled="isLoading"
                    class="w-full py-4 mt-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:bg-slate-400">
                    {{ isLoading ? '處理中...' : '登入帳號' }}
                </button>
            </form>

            <div class="mt-8 text-center text-sm text-slate-600">
                還不是會員？
                <RouterLink :to="{ name: 'Register' }" class="font-bold text-emerald-700 hover:underline">
                    立即註冊
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    font-family: 'Georgia', serif;
}

/* 讓驗證碼欄位跑出來時有個淡入效果 */
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>