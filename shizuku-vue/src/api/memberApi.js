import axios from 'axios';

// 建立 axios 實體
const memberRequest = axios.create({
    baseURL: 'https://localhost:7197/api', // 替換成你的 .NET API 埠號
    headers: {
        'Content-Type': 'application/json'
    }
});

export const apiMemberRegister = (data) => {
    return memberRequest.post('/MemberApi/Register', data);
};