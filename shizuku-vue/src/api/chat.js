import request from '@/api/index'

export const chatApi = {
  getHistory: (memberId) => request.get(`/ChatApi/GetHistory/${memberId}`),
  getAdminHistory: (memberId) => request.get(`/ChatApi/GetHistory/${memberId}`),
  getChatMembers: () => request.get('/ChatApi/GetChatMembers'),
}
