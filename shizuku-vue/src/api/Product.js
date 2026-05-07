import axios from 'axios'

const base = 'https://localhost:7197/api/product'

export const productApi = {
    // 查詢列表
    getList: (keyword) => axios.get(base, { params: { keyword } }),

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
        return axios.post(`${base}/${id}/image`, formData)
    },

    // 更新商品
    update: (id, dto) => axios.put(`${base}/${id}`, dto),

    // 更新庫存
    updateVariants: (id, variants) => axios.put(`${base}/${id}/variants`, variants),

    // 刪除
    delete: (id) => axios.delete(`${base}/${id}`)
}