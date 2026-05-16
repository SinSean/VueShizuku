import { ref } from 'vue'
import { getPaymentTransactionsForAdminAPI } from '@/api/adminPayment'

export function usePaymentAdmin() {
  const transactions = ref([])
  const loading = ref(false)

  // 抓取交易列表
  const fetchTransactions = async () => {
    loading.value = true
    try {
      const res = await getPaymentTransactionsForAdminAPI()
      if (Array.isArray(res)) {
        transactions.value = res
      } else if (res && res.success) {
        if (res.data && res.data.$values) {
          transactions.value = res.data.$values
        } else {
          transactions.value = res.data
        }
      }
    } catch (err) {
      console.error('抓取金流資料失敗', err)
    } finally {
      loading.value = false
    }
  }

  const getStatusInfo = (status) => {
    const map = {
      0: { label: '待付款', severity: 'warning' },
      1: { label: '付款成功', severity: 'success' },
      2: { label: '交易失敗', severity: 'danger' },
      3: { label: '已退款', severity: 'info' },
    }
    return map[status] || { label: '未知', severity: 'info' }
  }

  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleString() : 'N/A')

  const getPaymentMethodIcon = (methodName) => {
    if (!methodName) return 'pi pi-credit-card'
    const name = methodName.toUpperCase()
    if (name.includes('LINE')) return 'pi pi-mobile text-green-500'
    if (name.includes('APPLE')) return 'pi pi-apple text-gray-900'
    return 'pi pi-credit-card text-blue-500'
  }

  return {
    transactions,
    loading,
    fetchTransactions,
    getStatusInfo,
    formatDate,
    getPaymentMethodIcon,
  }
}
