import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { getAddressesAPI } from '@/api/member';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('memberUser')) || null);
    const token = ref(localStorage.getItem('memberToken') || '');
    // 新增：用來存放抓回來的地址
    const addressList = ref([]);

    const isLogin = computed(() => user.value !== null);
    const userName = computed(() => user.value ? user.value.fName : '訪客');

    // 1：加上 async
    async function login(userData, userToken = '') {
        user.value = userData;
        token.value = userToken;
        localStorage.setItem('memberUser', JSON.stringify(userData));
        if (userToken) {
            localStorage.setItem('memberToken', userToken);
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
        localStorage.removeItem('memberUser');
        localStorage.removeItem('memberToken');
    }

    return { user, token, userName, isLogin, login, logout, addressList, fetchUserAddress };
});
