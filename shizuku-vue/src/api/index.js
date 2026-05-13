import axios from 'axios';
import router from '@/router'; // 引入路由以便處理過期跳轉

const request = axios.create({
    baseURL: 'https://localhost:7197/api',
});

// 【JWT 自動化】請求攔截器
request.interceptors.request.use(
    (config) => {
        // 先抓出整個 user 字串
        const userStr = localStorage.getItem('memberUser');

        if (userStr) {
            const userData = JSON.parse(userStr);
            // 注意：這裡要對應你貼出的資料結構，屬性名是小寫 "token"
            const token = userData.token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 【安全性優化】回應攔截器
request.interceptors.response.use(
    (response) => response,
    (error) => {
        // 如果後端回傳 401 Unauthorized，代表 Token 過期或無效
        if (error.response && error.response.status === 401) {
            alert('登入時效已過，請重新登入');
            localStorage.removeItem('memberUser');
            localStorage.removeItem('memberToken');
            router.push('/login'); // 自動踢回登入頁
        }
        return Promise.reject(error);
    }
);

export default request;