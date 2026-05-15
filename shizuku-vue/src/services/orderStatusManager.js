/*
 * 訂單狀態機 (Finite State Machine) 管理器
 * 負責定義合法的狀態轉移路徑與顯示邏輯
 */

export const ORDER_STATUS = {
  PENDING: 1, // 待付款
  PAID: 2, // 已付款 (準備出貨)
  SHIPPING: 3, // 已出貨 (配送中)
  DELIVERED: 4, // 已送達 (完成)
  CANCELLED: 5, // 已取消
}

const statusMap = {
  [ORDER_STATUS.PENDING]: { text: '待付款', color: '#f59e0b', icon: 'pi pi-clock' },
  [ORDER_STATUS.PAID]: { text: '已付款', color: '#3b82f6', icon: 'pi pi-shopping-bag' },
  [ORDER_STATUS.SHIPPING]: { text: '已出貨', color: '#6366f1', icon: 'pi pi-truck' },
  [ORDER_STATUS.DELIVERED]: { text: '已送達', color: '#10b981', icon: 'pi pi-check-circle' },
  [ORDER_STATUS.CANCELLED]: { text: '已取消', color: '#ef4444', icon: 'pi pi-times-circle' },
}

/**
 * 定義合法的狀態轉移路徑
 * Key: 目前狀態, Value: 允許轉向的狀態陣列
 */
const validTransitions = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PAID]: [ORDER_STATUS.SHIPPING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [], // 已送達為終點狀態
  [ORDER_STATUS.CANCELLED]: [], // 已取消為終點狀態
}

export const orderStatusManager = {
  // 取得狀態顯示資訊
  getStatusInfo(status) {
    return statusMap[status] || { text: '未知', color: '#9ca3af', icon: 'pi pi-question' }
  },

  // 驗證狀態轉移是否合法
  isValidTransition(current, next) {
    if (current === next) return true
    const allowed = validTransitions[current] || []
    return allowed.includes(next)
  },

  // 取得時間軸所需的節點數據
  getTimelineSteps(currentStatus) {
    // 這裡定義標準的進度順序
    const steps = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.PAID,
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.DELIVERED,
    ]

    return steps.map((status) => {
      const info = this.getStatusInfo(status)
      const isCompleted = status <= currentStatus && currentStatus !== ORDER_STATUS.CANCELLED
      const isCurrent = status === currentStatus

      return {
        status,
        label: info.text,
        icon: info.icon,
        color: isCompleted ? info.color : '#e5e7eb', // 未完成則變灰色
        active: isCurrent,
      }
    })
  },
}
