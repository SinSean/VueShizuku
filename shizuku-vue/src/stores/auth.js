import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { getAddressesAPI } from '@/api/member';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('userToken') || '');
    // 新增：用來存放抓回來的地址
    const addressList = ref([]);

    const isLogin = computed(() => user.value !== null);
    ///////////// 判斷是否為員工帳號 ////////////////
    const isAdmin = computed(() => user.value?.isEmployee === true)

    // 從 user 物件裡提取名字，如果 user 為空就顯示 '訪客'
    // 這裡的 fName 請根據你資料庫回傳的欄位名稱調整 (例如你的資料庫欄位是 fName)
    const userName = computed(() => user.value ? user.value.fName : '訪客');

    // 1：加上 async
    async function login(userData, userToken = '') {
        user.value = userData;
        token.value = userToken;
        localStorage.setItem('user', JSON.stringify(userData));
        if (userToken) {
            localStorage.setItem('userToken', userToken);
        }
        return true;
    }

    // 2：新增抓取地址的 Action
    async function fetchUserAddress() {
        // 從目前的 user 狀態拿 ID
        const memberId = user.value?.fId || user.value?.fMemberId;
        if (!memberId) return;

        try {
            const res = await getAddressesAPI(memberId);
            if (res.data.success) {
                addressList.value = res.data.data;
                console.log("Store: 地址預載成功");
            }
        } catch (error) {
            console.error("Store: 抓取地址失敗", error);
            throw error; // 丟出錯誤讓外部 catch
        }
    }

    function logout() {
        user.value = null;
        token.value = '';
        addressList.value = []; // 清空地址
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
    }

    
    return { user, token, userName, isLogin, isAdmin, login, logout, addressList, fetchUserAddress };
});
