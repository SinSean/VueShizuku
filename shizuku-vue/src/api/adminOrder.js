import request from '@/api/index'

// 取得全站所有訂單
export const getAllOrdersForAdminAPI = async () => {
  const response = await request.get('/AdminOrderApi')
  return response.data
}

// 取得單筆訂單明細 (後台專用，不須傳 memberId)
export const getAdminOrderDetailAPI = async (orderNo) => {
  const response = await request.get(`/AdminOrderApi/${orderNo}`)
  return response.data
}

// 更改訂單狀態
export const updateOrderStatusAPI = async (orderNo, newStatus) => {
  const response = await request.patch(`/AdminOrderApi/${orderNo}/status`, { newStatus })
  return response.data
}

// 強制取消訂單並回補庫存
export const cancelOrderForAdminAPI = async (orderNo) => {
  const response = await request.patch(`/AdminOrderApi/${orderNo}/cancel`)
  return response.data
}
