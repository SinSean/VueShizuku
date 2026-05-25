import request from '@/api/index'
import myRequest from '@/api/myRequest'

export const customerApi = {
  getChatbotReply: (message) => request.post('/CustomerApi/bot', { Message: message }),
  getCategories: () => request.get('/CustomerApi/Categories'),
  submitForm: (formData) => request.post('/CustomerApi/Submit', formData),
  getHistory: (memberId) => request.get(`/CustomerApi/History/${memberId}`),
}

export const adminCustomerApi = {
  getAllTickets: () => myRequest.get('/CustomerApi/Admin/AllTickets'),
  updateTicketStatus: (ticketId, newStatus) =>
    myRequest.put('/CustomerApi/Admin/TicketStatus', { ticketId, newStatus }),
}

