import axios from 'axios'

// 專屬購物車、訂單、金流防區的專用網路客戶端
const myRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7197/api',
})

export default myRequest
