import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // 狀態 (State)
    // 嘗試從 localStorage 讀取 user 物件，如果沒有就給 null
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('userToken') || ''); // 預留 token

    // 修飾語 (Getters)
    // 直接判斷 user 是否存在來決定登入狀態
    const isLogin = computed(() => user.value !== null);
    //判斷是否為員工帳號
    const isAdmin = computed(() => user.value?.isEmployee === true)

    // 從 user 物件裡提取名字，如果 user 為空就顯示 '訪客'
    // 這裡的 fName 請根據你資料庫回傳的欄位名稱調整 (例如你的資料庫欄位是 fName)
    const userName = computed(() => user.value ? user.value.fName : '訪客');

    // 動作 (Actions)
    // 登入時存入整個 User 物件
    function login(userData, userToken = '') {
        user.value = userData;
        token.value = userToken;

        localStorage.setItem('user', JSON.stringify(userData));
        if (userToken) {
            localStorage.setItem('userToken', userToken);
        }
    }

    /* 我想預留給TOKEN
    function login(userData, userToken) {
        user.value = userData;
        token.value = userToken;
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userToken', userToken);
    }
    */

    function logout() {
        user.value = null;
        token.value = '';
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
    }

    return { user, token, userName, isLogin, isAdmin, login, logout };
});

