import request from '@/api/index';

// 後台系統設定
export const updateSystemConfig = (data) => {
    return request.put('/SystemApi/config', data);
};