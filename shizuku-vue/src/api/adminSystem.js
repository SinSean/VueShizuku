import request from '@/api/index';

// 取得後台系統設定
export const getSystemConfig = () => {
    return request.get('/SystemApi/config');
};

// 後台系統設定
export const updateSystemConfig = (data) => {
    return request.put('/SystemApi/config', data);
};