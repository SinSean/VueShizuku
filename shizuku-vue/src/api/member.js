import request from '@/api/index';

// 登入
export const loginAPI = (data) => {
    return request.post('/MemberApi/login', data);
};

// 註冊
export const apiMemberRegister = (data) => {
    return request.post('/MemberApi/Register', data);
}

// 會員資料 (預留)
// export const getMemberInfoAPI = (id) => request.get(`/MemberApi/${id}`);
