import request from '@/api/index';

//  建立訂單
export const createOrderAPI = async (data) => {
    const response = await request.post('/orderApi/create', data);
    //先拔掉 Axios 的第一層 data
    return response.data; 
};

//  確認付款
export const confirmPaymentAPI = async (data) => {
    const response = await request.post('/orderApi/confirm', data);
    return response.data;
};

//  取得會員訂單
export const getMemberOrdersAPI = async (memberId) => {
    const response = await request.get(`/orderApi/member/${memberId}`);
    return response.data;
};
