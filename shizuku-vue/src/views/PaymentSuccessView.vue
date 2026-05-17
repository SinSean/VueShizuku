<script setup>
import { useRoute } from 'vue-router'
import { usePaymentConfirmation } from '@/composables/usePaymentConfirmation'

const route = useRoute()

// 引入高去耦、單一職責的支付確認組合式函數 (SoC / SRP)
const {
  status,
  errorMessage,
  countdownSeconds,
  closeWindow
} = usePaymentConfirmation(route)
</script>

<template>
  <!-- 完美優化：以 CSS 原生三色徑向漸變取代重度模糊 HTML 發光球，0 效能開銷，滿滿奢華星空感！ -->
  <div class="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-900 py-12 px-4 relative overflow-hidden font-sans">
    
    <!-- 優質輕量級硬體加速卡片本體 -->
    <div class="bg-white p-10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-slate-100 max-w-md w-full text-center relative overflow-hidden z-10 translate-z-0 will-change-transform">
      
      <!-- 狀態 1：處理中 (Processing) -->
      <div v-if="status === 'processing'" class="flex flex-col items-center py-6">
        <!-- 精緻綠色旋轉載入圈圈 (開啟 3D GPU 加速) -->
        <div class="relative w-20 h-20 mb-8 flex items-center justify-center translate-z-0 will-change-transform">
          <div class="absolute inset-0 border-4 border-emerald-50 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin translate-z-0 will-change-transform"></div>
          <i class="pi pi-lock text-2xl text-emerald-500"></i>
        </div>

        <h2 class="text-2xl font-black text-slate-800 mb-3 tracking-tight">正在連線請款中...</h2>
        <p class="text-slate-400 text-sm max-w-xs leading-relaxed">
          正在與銀行進行安全加密驗證，請勿關閉或重新整理此視窗，以確保交易完整。
        </p>
      </div>

      <!-- 狀態 2：付款成功 (Success) -->
      <div v-else-if="status === 'success'" class="flex flex-col items-center">
        
        <!-- 頂級擴散心跳脈衝 Check Icon (優化 GPU 渲染開銷) -->
        <div class="relative w-20 h-20 mb-6 flex items-center justify-center translate-z-0 will-change-transform">
          <div class="absolute w-16 h-16 bg-emerald-500/10 rounded-full animate-ping-lite z-0"></div>
          <div class="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-100 z-10">
            <i class="pi pi-check text-2xl font-black"></i>
          </div>
        </div>

        <span class="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
          Transaction Completed
        </span>
        <h2 class="text-3xl font-black text-slate-800 mb-3 tracking-tight">付款成功！</h2>
        
        <!-- 動態倒數跳動數字 -->
        <div class="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 mb-8">
          <span class="text-xs font-bold text-slate-400">視窗將於</span>
          <span class="text-xl font-mono font-black text-emerald-600 animate-bounce-lite leading-none" :key="countdownSeconds">
            {{ countdownSeconds }}
          </span>
          <span class="text-xs font-bold text-slate-400">秒後自動關閉</span>
        </div>

        <button 
          @click="closeWindow" 
          class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-2xl font-bold tracking-widest shadow-lg shadow-emerald-100 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>立即關閉</span>
          <i class="pi pi-sign-out text-sm"></i>
        </button>
      </div>

      <!-- 狀態 3：付款失敗 (Fail) -->
      <div v-else-if="status === 'fail'" class="flex flex-col items-center">
        
        <!-- 頂級震動警告 Times Icon (優化 GPU 動畫) -->
        <div class="relative w-20 h-20 mb-6 flex items-center justify-center animate-shake-gpu translate-z-0 will-change-transform">
          <div class="absolute inset-0 bg-red-50 rounded-full scale-105"></div>
          <div class="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md shadow-red-100 z-10">
            <i class="pi pi-times text-xl font-black"></i>
          </div>
        </div>

        <span class="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full mb-3">
          Transaction Failed
        </span>
        <h2 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">付款失敗</h2>
        <p class="text-red-500 text-sm mb-8 font-bold bg-red-50/50 px-4 py-2.5 rounded-xl border border-red-100 max-w-xs leading-normal">
          {{ errorMessage || '請款失敗，請確認扣款餘額。' }}
        </p>

        <button 
          @click="closeWindow" 
          class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold tracking-widest transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>關閉視窗</span>
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 輕量級 ping 動畫：只動 transform-scale，降低 GPU 像素重繪負擔 */
.animate-ping-lite {
  animation: pingLite 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes pingLite {
  0% { transform: scale(1); opacity: 0.5; }
  70%, 100% { transform: scale(1.4); opacity: 0; }
}

/* 3D 硬體加速的失敗震動動畫 */
.animate-shake-gpu {
  animation: shakeGpu 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shakeGpu {
  10%, 90% { transform: translate3d(-1.5px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}

/* 輕量級 bounce 數字跳動動畫 */
.animate-bounce-lite {
  animation: bounceLite 0.4s ease-out;
}
@keyframes bounceLite {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* 強制將物件上推至單獨的 GPU 合成層 */
.translate-z-0 {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.will-change-transform {
  will-change: transform;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
