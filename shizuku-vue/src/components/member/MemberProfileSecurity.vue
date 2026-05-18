<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    sendSecurityCodeAPI,
    verifySecurityCodeAPI,
    updatePhoneWithCodeAPI,
    updateBirthdayWithCodeAPI
} from '@/api/member';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 流程狀態：1=輸入Email驗證, 2=輸入驗證碼, 3=輸入新資料
const step = ref(1);

// 根據路由參數（例如 /security/update?type=birthday）動態判斷目前是改什麼
// 1 = 修改手機, 2 = 修改生日
const currentType = ref(1);

// 動態標題與輸入框提示字
const titleText = computed(() => currentType.value === 1 ? '重新設定手機' : '重新設定生日');
const step3TitleText = computed(() => currentType.value === 1 ? '建立新手機號碼' : '設定新出生日期');
const inputPlaceholder = computed(() => currentType.value === 1 ? '請輸入新手機號碼' : '請選擇出生日期');

// 表單資料
const email = ref('sealll4001@gmail.com');
const code = ref('');
const newPhone = ref('');
const newBirthday = ref(''); // 新增生日綁定變數
const errorMessage = ref('');

// 倒數計時狀態
const countdown = ref(60);
const isCounting = ref(false);
let timer = null;

onMounted(() => {
    // 從網址 query 取得 type，若為 'birthday' 則切換為 Type 2
    if (route.query.type === 'birthday') {
        currentType.value = 2;
    } else {
        currentType.value = 1;
    }
});

const startTimer = () => {
    isCounting.value = true;
    countdown.value = 60;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        if (countdown.value > 1) {
            countdown.value--;
        } else {
            clearInterval(timer);
            isCounting.value = false;
        }
    }, 1000);
};

// 步驟 1：點選「下一個」 -> 發送 Email 驗證碼
const handleSendEmail = async () => {
    errorMessage.value = '';
    if (!email.value) {
        errorMessage.value = '請輸入 Email 地址';
        return;
    }

    try {
        const res = await sendSecurityCodeAPI({
            fEmail: email.value,
            fType: currentType.value
        });

        if (res.data && res.data.success) {
            step.value = 2;
            startTimer();
        } else {
            errorMessage.value = res.data?.message || '發送失敗';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || '系統錯誤，請稍後再試';
    }
};

// 步驟 2：點選「下一步」 -> 驗證驗證碼
const handleVerifyCode = async () => {
    errorMessage.value = '';
    if (!code.value) {
        errorMessage.value = '請輸入驗證碼';
        return;
    }

    try {
        const res = await verifySecurityCodeAPI({
            fEmail: email.value,
            fCode: code.value,
            fType: currentType.value
        });

        if (res.data && res.data.success) {
            step.value = 3;
        } else {
            errorMessage.value = res.data?.message || '驗證碼錯誤';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || '驗證失敗，請確認驗證碼';
    }
};

// 步驟 3：點選「儲存變更」 -> 依據 type 分流處理最後的寫入
const handleUpdateSubmit = async () => {
    errorMessage.value = '';

    if (currentType.value === 1) {
        // 處理手機更動
        if (!newPhone.value) {
            errorMessage.value = '請輸入新手機號碼';
            return;
        }

        try {
            const res = await updatePhoneWithCodeAPI({
                fNewPhone: newPhone.value,
                fVerifiedCode: code.value
            });

            if (res.data && res.data.success) {
                alert('手機號碼修改成功！');
                if (timer) clearInterval(timer);

                if (authStore.user) {
                    authStore.user.fPhone = newPhone.value;
                    localStorage.setItem('memberUser', JSON.stringify(authStore.user));
                }
                router.push({ name: 'MemberProfile' });
            } else {
                errorMessage.value = res.data?.message || '變更失敗';
            }
        } catch (error) {
            errorMessage.value = error.response?.data?.message || '變更失敗，請稍後再試';
        }
    } else if (currentType.value === 2) {
        // 處理生日更動
        if (!newBirthday.value) {
            errorMessage.value = '請選擇新出生日期';
            return;
        }

        try {
            const res = await updateBirthdayWithCodeAPI({
                fNewBirthday: newBirthday.value,
                fVerifiedCode: code.value
            });

            if (res.data && res.data.success) {
                alert('生日修改成功！');
                if (timer) clearInterval(timer);

                if (authStore.user) {
                    authStore.user.fBirthday = newBirthday.value;
                    localStorage.setItem('memberUser', JSON.stringify(authStore.user));
                }
                router.push({ name: 'MemberProfile' });
            } else {
                errorMessage.value = res.data?.message || '變更失敗';
            }
        } catch (error) {
            errorMessage.value = error.response?.data?.message || '變更失敗，請稍後再試';
        }
    }
};

const goBack = () => {
    if (step.value > 1) {
        step.value--;
        errorMessage.value = '';
    }
};
</script>

<template>
    <div
        class="relative max-w-[480px] mx-auto my-[60px] p-10 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
        <div v-if="step > 1" class="absolute left-[30px] top-[35px] cursor-pointer" @click="goBack">
            <span class="text-2xl text-blue-600 font-bold">&larr;</span>
        </div>

        <div v-if="step === 1">
            <h3 class="text-xl text-gray-800 font-semibold mt-2.5 mb-7.5">{{ titleText }}</h3>
            <div class="mb-6">
                <input type="email" v-model="email" placeholder="請輸入原帳號 Email"
                    class="w-full h-12 px-4 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-base box-border" />
            </div>
            <button
                class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded text-base font-medium transition-colors duration-200 cursor-pointer"
                @click="handleSendEmail">
                下一個
            </button>
        </div>

        <div v-if="step === 2">
            <h3 class="text-xl text-gray-800 font-semibold mt-2.5 mb-7.5">輸入驗證碼</h3>
            <p class="text-sm text-gray-400 mb-1">您的驗證碼已透過電子郵件傳送至</p>
            <p class="text-sm text-gray-800 font-medium mb-6">{{ email }}</p>

            <div class="mb-6">
                <input type="text" v-model="code" placeholder="請輸入 6 位數驗證碼" maxlength="6"
                    class="w-full h-14 border-b-2 border-gray-300 text-2xl text-center tracking-[8px] focus:border-blue-600 focus:outline-none bg-transparent box-border" />
            </div>

            <div class="text-xs text-gray-400 mb-7.5">
                <span v-if="isCounting">{{ countdown }} 秒後重新傳送</span>
                <span v-else class="text-blue-600 cursor-pointer underline" @click="handleSendEmail">重新傳送驗證碼</span>
            </div>

            <button
                class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded text-base font-medium transition-colors duration-200 cursor-pointer"
                @click="handleVerifyCode">
                下一步
            </button>
        </div>

        <div v-if="step === 3">
            <h3 class="text-xl text-gray-800 font-semibold mt-2.5 mb-7.5">{{ step3TitleText }}</h3>
            <div class="mb-6">
                <input v-if="currentType === 1" type="tel" v-model="newPhone" :placeholder="inputPlaceholder"
                    class="w-full h-12 px-4 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-base box-border" />

                <input v-if="currentType === 2" type="date" v-model="newBirthday"
                    class="w-full h-12 px-4 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-base box-border" />
            </div>
            <button type="button"
                class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded text-base font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center"
                @click="handleUpdateSubmit">
                儲存變更
            </button>
        </div>

        <p v-if="errorMessage" class="text-red-500 text-xs text-center mt-4">{{ errorMessage }}</p>
    </div>
</template>

<style scoped></style>