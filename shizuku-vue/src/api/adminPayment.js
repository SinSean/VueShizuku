import request from '@/api/index'

// 取得全站所有金流交易列表 (後台專用)
export const getPaymentTransactionsForAdminAPI = async () => {
  const response = await request.get('/admin/payments')
  return response.data
}

// 取得特定交易的通訊日誌 (後台專用)
export const getPaymentTransactionLogsForAdminAPI = async (transactionId) => {
  const response = await request.get(`/admin/payments/${transactionId}/logs`)
  return response.data
}
