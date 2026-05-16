import request from '@/api/index';

// 取得圖形驗證碼
export const getCaptchaAPI = () => {
    return request.get('/MemberApi/captcha');
};

// 登入
export const loginAPI = (data) => {
    return request.post('/MemberApi/login', data);
};

// 註冊
export const apiMemberRegister = (data) => {
    return request.post('/MemberApi/Register', data);
}

// 驗證電子郵件驗證碼
export const apiVerifyCode = (data) => {
    return request.post('/VerificationApi/verify-code', data);
};

// 會員資料 (預留)
// export const getMemberInfoAPI = (id) => request.get(`/MemberApi/${id}`);

// 取得地址列表 (GET: api/MemberAddressApi/{memberId})
export const getAddressesAPI = (memberId) => {
    return request.get(`/MemberAddressApi/${memberId}`);
};

// 更新地址清單 (PUT: api/MemberAddressApi/{memberId})
export const updateAddressesAPI = (memberId, data) => {
    return request.put(`/MemberAddressApi/${memberId}`, data);
};

// 會員更新個人資料
export const updateProfileAPI = (data) => {
    return request.put('/MemberApi/UpdateProfile', data);
};