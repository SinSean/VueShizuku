import axios from 'axios'

// 專屬後台登入、管理員功能的網路客戶端
const myRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7197/api',
})

// 【JWT】
myRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default myRequest

