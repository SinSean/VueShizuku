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

// 全局非同步請求載入狀態
const isLoading = ref(false);

// 倒數計時狀態
const countdown = ref(60);
const isCounting = ref(false);
let timer = null;

onMounted(() => {
    const queryType = route.query.type;
    switch (queryType) {
        case 'phone':
            currentType.value = 1;
            break;
        case 'birthday':
            currentType.value = 2;
            break;
        // 未來若要擴充其他類型，直接在這裡加 case 即可
        // case 'password':
        //     currentType.value = 3;
        //     break;
        default:
            // 預設防呆：如果網址沒帶 type 或亂打，預設回歸手機號碼修改 (1)
            currentType.value = 1;
            break;
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

    isLoading.value = true; // 開啟讀取中狀態

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
    } finally {
        isLoading.value = false; // 關閉讀取中狀態
    }
};

// 步驟 2：點選「下一步」 -> 驗證驗證碼
const handleVerifyCode = async () => {
    errorMessage.value = '';
    if (!code.value) {
        errorMessage.value = '請輸入驗證碼';
        return;
    }

    isLoading.value = true;

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
    } finally {
        isLoading.value = false;
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

        isLoading.value = true;

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
        } finally {
            isLoading.value = false;
        }
    } else if (currentType.value === 2) {
        // 處理生日更動
        if (!newBirthday.value) {
            errorMessage.value = '請選擇新出生日期';
            return;
        }

        isLoading.value = true;

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
        } finally {
            isLoading.value = false;
        }
    }
};

const goBack = () => {
    if (step.value > 1 && !isLoading.value) { // 發送中不允許返回，避免狀態衝突
        step.value--;
        errorMessage.value = '';
    }
};
</script>

<template>
    <div
        class="relative max-w-[480px] mx-auto my-[60px] p-10 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
        <!-- 當載入中時，停用返回按鈕 -->
        <div v-if="step > 1" class="absolute left-[30px] top-[35px]"
            :class="isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'" @click="goBack">
            <span class="text-2xl text-blue-600 font-bold">&larr;</span>
        </div>

        <!-- 步驟 1：輸入 Email -->
        <div v-if="step === 1">
            <h3 class="text-xl text-gray-800 font-semibold mt-2.5 mb-7.5">{{ titleText }}</h3>
            <div class="mb-6">
                <input type="email" v-model="email" placeholder="請輸入原帳號 Email" :disabled="isLoading"
                    class="w-full h-12 px-4 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-base box-border disabled:bg-gray-50 disabled:text-gray-400" />
            </div>
            <button
                class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded text-base font-medium transition-colors duration-200 cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                :disabled="isLoading" @click="handleSendEmail">
                <span v-if="isLoading">發送中...</span>
                <span v-else>下一個</span>
            </button>
        </div>

        <!-- 步驟 2：輸入驗證碼 -->
        <div v-if="step === 2">
            <h3 class="text-xl text-gray-800 font-semibold mt-2.5 mb-7.5">輸入驗證碼</h3>
            <p class="text-sm text-gray-400 mb-1">您的驗證碼已透過電子郵件傳送至</p>
            <p class="text-sm text-gray-800 font-medium mb-6">{{ email }}</p>

            <div class="mb-6">
                <input type="text" v-model="code" placeholder="請輸入 6 位數驗證碼" maxlength="6" :disabled="isLoading"
                    class="w-full h-14 border-b-2 border-gray-300 text-2xl text-center tracking-[8px] focus:border-blue-600 focus:outline-none bg-transparent box-border disabled:text-gray-400" />
            </div>

            <div class="text-xs text-gray-400 mb-7.5">
                <span v-if="isCounting">{{ countdown }} 秒後重新傳送</span>
                <!-- 在發送中時，阻斷重新傳送的點擊 -->
                <span v-else class="underline"
                    :class="isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 cursor-pointer'"
                    @click="!isLoading && handleSendEmail">重新傳送驗證碼</span>
            </div>

            <button
                class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded text-base font-medium transition-colors duration-200 cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                :disabled="isLoading" @click="handleVerifyCode">
                <span v-if="isLoading">驗證中...</span>
                <span v-else>下一步</span>
            </button>
        </div>

        <!-- 步驟 3：設定新資料 -->
        <div v-if="step === 3">
            <h3 class="text-xl text-gray-800 font-semibold mt-2.5 mb-7.5">{{ step3TitleText }}</h3>
            <div class="mb-6">
                <input v-if="currentType === 1" type="tel" v-model="newPhone" :placeholder="inputPlaceholder"
                    :disabled="isLoading"
                    class="w-full h-12 px-4 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-base box-border disabled:bg-gray-50 disabled:text-gray-400" />

                <input v-if="currentType === 2" type="date" v-model="newBirthday" :disabled="isLoading"
                    class="w-full h-12 px-4 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-base box-border disabled:bg-gray-50 disabled:text-gray-400" />
            </div>
            <button type="button"
                class="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded text-base font-medium transition-colors duration-200 cursor-pointer flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
                :disabled="isLoading" @click="handleUpdateSubmit">
                <span v-if="isLoading">儲存中...</span>
                <span v-else>儲存變更</span>
            </button>
        </div>

        <p v-if="errorMessage" class="text-red-500 text-xs text-center mt-4">{{ errorMessage }}</p>
    </div>
</template>

<style scoped></style>