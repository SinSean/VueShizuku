import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // 狀態 (State)
    const userName = ref(localStorage.getItem('userName') || null);

    // 修飾語 (Getters)
    const isLogin = computed(() => userName.value !== null);

    // 動作 (Actions)
    function login(name) {
        userName.value = name;
        localStorage.setItem('userName', name);
    }

    function logout() {
        userName.value = null;
        localStorage.removeItem('userName');
    }

    return { userName, isLogin, login, logout };
});