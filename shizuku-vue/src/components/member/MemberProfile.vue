<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { updateProfileAPI } from '@/api/member';

const authStore = useAuthStore();
const API_BASE_URL = 'https://localhost:7197';

const profile = ref({
    fId: 0,
    fName: '',
    fGender: 0,
    fBirthday: '',
    fPhone: ''
});

// 同步 Store 資料到本地表單
watch(() => authStore.user, (newVal) => {
    console.log("【偵錯】Pinia Store 目前的 user 物件內容：", newVal);
    console.log("【偵錯】試著讀取圖片欄位：", newVal?.fImage, newVal?.FImage);
    if (newVal) {
        profile.value = {
            fId: newVal.fId || 0,
            fName: newVal.fName || '',
            fGender: newVal.fGender !== null ? Number(newVal.fGender) : 0,
            fBirthday: newVal.fBirthday ? newVal.fBirthday.split('T')[0] : '',
            fPhone: newVal.fPhone || ''
        };
    }
}, { immediate: true });

const saveProfile = async () => {
    // 根據你的 DTO 規範，確保屬性名稱正確 (PascalCase)
    const updateData = {
        FId: profile.value.fId,
        FName: profile.value.fName,
        FGender: profile.value.fGender
    };

    try {
        const res = await updateProfileAPI(updateData);

        // 對應你的 ApiResponse<T> 規範: res.data.success
        if (res.data.success) {
            // 同步更新 Pinia Store
            authStore.user = {
                ...authStore.user,
                fName: profile.value.fName,
                fGender: profile.value.fGender
            };

            // 修正鍵名為 memberUser，確保重新整理後資料還在
            localStorage.setItem('memberUser', JSON.stringify(authStore.user));

            alert('個人資料已儲存');
        } else {
            alert('儲存失敗：' + res.data.message);
        }
    } catch (error) {
        console.error('儲存出錯:', error);
        alert('連線伺服器失敗');
    }
};

// Email 遮蓋處理
const maskEmail = (email) => {
    if (!email) return '未設定';
    const [name, domain] = email.split('@');
    return `${name.substring(0, 2)}******@${domain}`;
};

// 手機遮蓋處理 (範例: 0912****52)
const maskPhone = (phone) => {
    if (!phone) return '未設定';
    if (phone.length < 10) return phone;
    return `${phone.substring(0, 4)}****${phone.substring(8)}`;
};

// 生日格式化 (將 1998-05-20 轉為 1998/05/20)
const formatBirthday = (dateStr) => {
    if (!dateStr) return '未設定';
    return dateStr.replace(/-/g, '/');
};
</script>

<template>
    <main class="w-full bg-white p-10 shadow-sm border border-slate-100 rounded-xl">
        <div class="mb-8 border-b border-slate-100 pb-6">
            <h2 class="text-2xl font-bold text-slate-800">個人檔案</h2>
            <p class="text-slate-500 text-sm mt-1">管理你的基本身分資訊與帳戶安全</p>
        </div>

        <form class="grid grid-cols-1 md:grid-cols-3 gap-12" @submit.prevent="saveProfile">
            <div class="md:col-span-2 space-y-8">

                <!-- 基本資料 (可編輯區域) -->
                <div class="space-y-6">
                    <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <i class="pi pi-user-edit text-blue-600"></i> 基本資料
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-slate-700">姓名</label>
                            <input type="text" v-model="profile.fName"
                                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-slate-700">性別</label>
                            <div class="flex gap-6 pt-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" v-model="profile.fGender" :value="1" class="text-blue-600" />
                                    <span class="text-slate-700">男性</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" v-model="profile.fGender" :value="0" class="text-blue-600" />
                                    <span class="text-slate-700">女性</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 帳戶安全 (帳號保護資訊區域) -->
                <div class="space-y-6 pt-6 border-t border-slate-100">
                    <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <i class="pi pi-shield text-blue-600"></i> 帳戶安全
                    </h3>

                    <div class="space-y-4">
                        <!-- 電子郵件 -->
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase">電子郵件</p>
                                <p class="text-slate-700 font-medium">{{ maskEmail(authStore.user?.fEmail) }}</p>
                            </div>
                            <router-link to="/verify/email"
                                class="text-blue-600 font-medium hover:underline text-sm">[變更]</router-link>
                        </div>

                        <!-- 手機號碼 -->
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase">手機號碼</p>
                                <p class="text-slate-700 font-medium">{{ maskPhone(profile.fPhone) }}</p>
                            </div>
                            <router-link :to="{ name: 'security', query: { type: 'phone' } }"
                                class="text-blue-600 font-medium hover:underline text-sm">[變更]</router-link>
                        </div>

                        <!-- 生日 -->
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase">生日</p>
                                <p class="text-slate-700 font-medium">{{ formatBirthday(profile.fBirthday) }}</p>
                            </div>
                            <router-link :to="{ name: 'security', query: { type: 'birthday' } }"
                                class="text-blue-600 font-medium hover:underline text-sm">[變更]</router-link>
                        </div>

                        <!-- 密碼 -->
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p class="text-xs text-slate-400 font-semibold uppercase">帳戶密碼</p>
                                <p class="text-slate-700 font-medium">********</p>
                            </div>
                            <router-link to="/member/change-password"
                                class="text-blue-600 font-medium hover:underline text-sm">[修改密碼]</router-link>
                        </div>
                    </div>
                </div>

                <div class="pt-4">
                    <button type="submit"
                        class="bg-blue-600 text-white px-10 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95">
                        儲存變更
                    </button>
                </div>
            </div>

            <!-- 右側頭像 -->
            <div class="flex flex-col items-center border-l border-slate-100 pl-8">
                <div
                    class="w-32 h-32 bg-slate-100 rounded-full mb-6 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden">

                    <img v-if="authStore.user?.fImage"
                        :src="authStore.user.fImage.startsWith('http') ? authStore.user.fImage : `${API_BASE_URL}/uploads/avatars/${authStore.user.fImage}`"
                        class="w-full h-full object-cover" />

                    <i v-else class="pi pi-user text-slate-400 text-5xl"></i>
                </div>
                <button type="button" class="text-blue-600 font-medium text-sm hover:underline">更換照片</button>
            </div>
        </form>
    </main>
</template>