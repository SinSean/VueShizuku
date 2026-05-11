<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  status: String, // 'success' | 'fail' | 'warn' | 'processing'
  message: String
})

// 定義發射事件，當倒數結束時通知外層元件
const emit = defineEmits(['update:visible', 'countdown-end'])

const countdown = ref(3)

let timer = null

// 監聽 visible 與 status 屬性，當狀態是成功或失敗時才開始倒數
watch([() => props.visible, () => props.status], ([newVisible, newStatus]) => {
  if (timer) clearInterval(timer) // 先清空之前的計時器
  
  if (newVisible && (newStatus === 'success' || newStatus === 'fail' || newStatus === 'warn')) {
    countdown.value = 3
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        emit('countdown-end') // 倒數結束，觸發跳轉事件
      }
    }, 1000)
  }
})
</script>

<template>
  <!-- 黑色半透明遮罩，帶有毛玻璃效果 -->
  <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
    <!-- 白色彈出卡片 -->
    <div class="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center transform scale-100 animate-fade-in-up">
      
      <!-- 處理中狀態的 UI -->
      <div v-if="status === 'processing'">
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-6">
          <i class="pi pi-spinner pi-spin text-5xl text-blue-500"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3 tracking-wide">訂單處理中</h2>
        <p class="text-gray-500 text-sm mb-4 leading-relaxed">{{ message }}</p>
      </div>

      <!-- 成功狀態的 UI -->
      <div v-if="status === 'success'">
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-6 animate-bounce-soft">
          <i class="pi pi-check text-5xl text-green-500"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3 tracking-wide">付款成功！</h2>
        <p class="text-gray-500 text-sm mb-4 leading-relaxed">{{ message }}</p>
        <div class="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
          <div class="bg-green-500 h-1.5 rounded-full animate-progress" :style="{ animationDuration: '3s' }"></div>
        </div>
        <p class="text-gray-400 text-xs font-bold">{{ countdown }} 秒後為您轉跳訂單列表...</p>
      </div>

      <!-- 失敗狀態的 UI -->
      <div v-if="status === 'fail'">
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-50 mb-6 animate-shake">
          <i class="pi pi-times text-5xl text-red-500"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-900 mb-3 tracking-wide">付款失敗</h2>
        <p class="text-red-500 text-sm mb-4 font-medium leading-relaxed">{{ message }}</p>
        <p class="text-gray-400 text-xs font-bold">{{ countdown }} 秒後關閉視窗...</p>
      </div>

      <!-- 尚未登入狀態的 UI -->
       <div v-if="status === 'warn'">
  <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-50 mb-6">
    <i class="pi pi-exclamation-triangle text-5xl text-yellow-500"></i>
  </div>
  <h2 class="text-2xl font-black text-gray-900 mb-3 tracking-wide">請先登入</h2>
  <p class="text-gray-500 text-sm mb-4 font-medium leading-relaxed">{{ message }}</p>
  <p class="text-gray-400 text-xs font-bold">{{ countdown }} 秒後為您轉跳登入頁面...</p>
</div>

    </div>
  </div>
</template>

<style scoped>
/* 卡片淡入往上浮現的動畫 */
.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* 輕柔的彈跳動畫 (成功用) */
.animate-bounce-soft {
  animation: bounceSoft 1s cubic-bezier(0.28, 0.84, 0.42, 1) forwards;
}

@keyframes bounceSoft {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* 震動動畫 (失敗用) */
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* 底部倒數進度條動畫 */
.animate-progress {
  animation: progress linear forwards;
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}
</style>
