import request from '@/api/index';

export const loginAPI = (data) => {
    return request.post('/MemberApi/login', data);
};

// 之後開發會員中心就直接加在這裡
// export const getMemberInfoAPI = (id) => request.get(`/MemberApi/${id}`);