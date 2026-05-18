import axios from 'axios'

const base = 'https://localhost:7197/api/product'

export const productApi = {
  // 查詢列表 新增分類篩選
  getList: (keyword, categoryId) => axios.get(base, { params: { keyword, categoryId } }),

  // 查單筆
  getById: (id) => axios.get(`${base}/${id}`),

  // 查規格
  getVariants: (id) => axios.get(`${base}/${id}/variants`),

  // 查下拉選單
  getDropdowns: () => axios.get(`${base}/dropdowns`),

  // 新增商品
  create: (dto) => axios.post(base, dto),

  // 上傳圖片
  uploadImage: (id, file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return axios.post(`${base}/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadImageExtra: (id, file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return axios.post(`${base}/${id}/image/extra`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 更新商品
  update: (id, dto) => axios.put(`${base}/${id}`, dto),

  // 更新庫存
  updateVariants: (id, variants) => axios.put(`${base}/${id}/variants`, variants),

  // 刪除
  delete: (id) => axios.delete(`${base}/${id}`),

  getStats: () => axios.get(`${base}/stats`),
  getInventory: () => axios.get(`${base}/inventory`),
  getImages: (id) => axios.get(`${base}/${id}/images`),

  getStockRecords: () => axios.get(`{{base}}/stock-records`),
  addStockRecord: (dto) => axios.post(`{{base}}/stock-records`, dto),
  getPurchaseOrders: () => axios.get(`${base}/purchase-orders`),
  getPurchaseOrder: (id) => axios.get(`${base}/purchase-orders/${id}`),
  createPurchaseOrder: (dto) => axios.post(`${base}/purchase-orders`, dto),
}
