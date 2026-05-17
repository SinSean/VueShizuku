import request from '@/api/myRequest'

//  建立訂單
export const createOrderAPI = async (data) => {
  const response = await request.post('/orderApi/create', data)
  //先拔掉 Axios 的第一層 data
  return response.data
}

//  確認付款
export const confirmPaymentAPI = async (data) => {
  const response = await request.post('/orderApi/confirm', data)
  return response.data
}

//  根據會員ID 取得訂單列表
export const getMemberOrdersAPI = async (memberId) => {
  const response = await request.get(`/orderApi/member/${memberId}`)
  return response.data
}

//取得單筆訂單詳情
export const getOrderDetailAPI = async (orderNo, memberId) => {
  const response = await request.get(`/orderApi/${orderNo}`, { params: { memberId } })
  return response.data
}

// 重新付款
export const repayOrderAPI = async (orderNo, paymentMethodId) => {
  const response = await request.post(`/orderApi/repay/${orderNo}`, { paymentMethodId })
  return response.data
}

//取消訂單
export const cancelOrderApi = async (orderNo) => {
  const response = await request.patch(`/orderApi/${orderNo}/cancel`)
  return response.data
}
