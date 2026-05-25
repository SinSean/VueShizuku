import request from '@/api/index'

export const customerApi = {
  getChatbotReply: (message) => request.post('/CustomerApi/bot', { Message: message }),
  getCategories: () => request.get('/CustomerApi/Categories'),
  submitForm: (formData) => request.post('/CustomerApi/Submit', formData),
}
