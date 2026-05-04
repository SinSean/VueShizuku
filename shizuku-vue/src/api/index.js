import axios from 'axios';

const request = axios.create({
    baseURL: 'https://localhost:7197/api',
    //timeout: 5000   //不放延遲時間
});

// 你可以在這裡統一處理錯誤攔截 (Interceptors)
export default request;