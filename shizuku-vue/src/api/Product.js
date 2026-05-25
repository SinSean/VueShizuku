import request from '@/api/index'

export const productApi = {
  // 查詢列表 新增分類篩選
  getList: (keyword, categoryId) => request.get('/product', { params: { keyword, categoryId } }),

  // 查單筆
  getById: (id) => request.get(`/product/${id}`),

  // 查規格
  getVariants: (id) => request.get(`/product/${id}/variants`),

  // 查下拉選單
  getDropdowns: () => request.get('/product/dropdowns'),

  // 新增商品
  create: (dto) => request.post('/product', dto),

  // 上傳圖片
  uploadImage: (id, file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return request.post(`/product/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadImageExtra: (id, file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return request.post(`/product/${id}/image/extra`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 更新商品
  update: (id, dto) => request.put(`/product/${id}`, dto),

  // 更新庫存
  updateVariants: (id, variants) => request.put(`/product/${id}/variants`, variants),

  // 刪除
  delete: (id) => request.delete(`/product/${id}`),

  getStats: () => request.get('/product/stats'),
  getInventory: () => request.get('/product/inventory'),

  //結帳時檢查庫存與價格
  checkItems: (variantIds) => request.post('/product/check-items', variantIds),

  getImages: (id) => request.get(`/product/${id}/images`),
  getRelated: (id) => request.get(`/product/${id}/related`),

  getStockRecords: () => request.get('/product/stock-records'),
  addStockRecord: (dto) => request.post('/product/stock-records', dto),
  getPurchaseOrders: () => request.get('/product/purchase-orders'),
  getPurchaseOrder: (id) => request.get(`/product/purchase-orders/${id}`),
  createPurchaseOrder: (dto) => request.post('/product/purchase-orders', dto),
}
