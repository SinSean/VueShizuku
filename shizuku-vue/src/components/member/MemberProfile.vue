<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { updateProfileAPI, updateAvatar } from '@/api/member';

const authStore = useAuthStore();
const API_BASE_URL = 'https://localhost:7197';

const profile = ref({
    fId: 0,
    fName: '',
    fGender: 0,
    fBirthday: '',
    fPhone: ''
});

const fileInputRef = ref(null);

// 同步 Store 資料到本地表單
watch(() => authStore.user, (newVal) => {
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

// 觸發隱藏的檔案選擇框
const triggerFileInput = () => {
    fileInputRef.value.click();
};

// 處理圖片上傳邏輯
const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 限制圖片格式與大小 (選擇性加入，保障系統安全)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        alert('只允許上傳 JPG、PNG 或 GIF 格式的圖片');
        return;
    }
    if (file.size > 2 * 1024 * 1024) { // 限制 2MB
        alert('圖片大小不能超過 2MB');
        return;
    }

    // 使用 FormData 包裝檔案
    const formData = new FormData();
    // 注意：這裡的 'file' 字串必須對應你 C# 後端 Action 參數的變數名稱 (例如 IFormFile file)
    formData.append('file', file);

    try {
        // 呼叫 API，傳入目前會員 ID 與 formData
        const res = await updateAvatar(profile.value.fId, formData);

        if (res.data.success) {
            // 假設後端 ApiResponse<T> 的 Data 會回傳新上傳成功的圖片名稱 (字串)
            const newImageName = res.data.data;

            // 同步更新 Pinia Store
            authStore.user = {
                ...authStore.user,
                fImage: newImageName
            };

            // 寫回 LocalStorage 保持持久化
            localStorage.setItem('memberUser', JSON.stringify(authStore.user));
            alert('大頭貼更換成功');
        } else {
            alert('上傳失敗：' + res.data.message);
        }
    } catch (error) {
        console.error('上傳頭像出錯:', error);
        alert('頭像上傳失敗，請檢查網路連線');
    } finally {
        // 清空 input 的值，確保使用者選同一張圖時仍能觸發 change 事件
        event.target.value = '';
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
                            <router-link :to="{ name: 'security', query: { type: 'password' } }"
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
                <button type="button" @click="triggerFileInput"
                    class="text-blue-600 font-medium text-sm hover:underline">
                    更換照片
                </button>
            </div>
        </form> <input type="file" ref="fileInputRef" @change="handleAvatarChange"
            accept="image/jpeg, image/png, image/gif" class="hidden" />
    </main>
</template>