export function usePaymentWindow() {
  // 接收三個參數：金流網址、成功時要做什麼、失敗時要做什麼
  const openPaymentWindow = (paymentUrl, onSuccess, onFail) => {
    const paymentWindow = window.open(paymentUrl, '_blank', 'width=600,height=800')
    let paymentComplete = false

    const receiveMessage = (event) => {
      // 直接讀取 .env 配置
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7197/api'
      const backendOrigin = new URL(backendUrl).origin

      // 安全性檢查：只接受來自我們自己或後端的訊息
      if (event.origin !== window.location.origin && event.origin !== backendOrigin) return

      if (event.data === 'PAYMENT_SUCCESS') {
        paymentComplete = true
        window.removeEventListener('message', receiveMessage)
        onSuccess() // 觸發元件傳進來的成功邏輯
      } else if (event.data === 'PAYMENT_FAILED') {
        paymentComplete = true
        window.removeEventListener('message', receiveMessage)
        onFail('付款取消或失敗。') // 觸發元件傳進來的失敗邏輯
      }
    }

    window.addEventListener('message', receiveMessage)

    // 每秒檢查使用者是否把視窗按叉叉關掉了
    const checkWindowClosed = setInterval(() => {
      if (paymentWindow && paymentWindow.closed) {
        clearInterval(checkWindowClosed)
        if (!paymentComplete) {
          window.removeEventListener('message', receiveMessage)
          onFail('您已關閉付款視窗。付款未完成。')
        }
      }
    }, 1000)
  }

  // 將方法拋出給外部元件使用
  return { openPaymentWindow }
}
