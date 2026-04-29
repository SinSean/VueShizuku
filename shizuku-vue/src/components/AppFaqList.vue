<script setup>
import { ref } from 'vue';

// 關鍵邏輯：紀錄目前哪一個 ID 的問題是被展開的 (null 代表全部關閉)
const activeId = ref(null);

// 點擊事件：切換展開狀態
const toggle = (id) => {
  // 如果點擊的是目前已經展開的，就把 activeId 設回 null (關閉)
  // 如果點擊的是別的，就把 activeId 變成那個新點擊的 ID (展開新的，同時關閉舊的)
  activeId.value = activeId.value === id ? null : id;
};

// 常見問題資料 (補上 answer 欄位)
const faqList = ref([
  { 
    id: 1, 
    title: '【04/01起報名】SHIZUKU TW Style Creator 青春風格特派員 熱烈招募中！',
    answer: '歡迎熱愛穿搭的你加入！報名連結與詳細活動辦法，請參考官方 IG 主頁連結或首頁最新公告。'
  },
  { 
    id: 2, 
    title: '實體店鋪 | 退換貨規則與辦法',
    answer: '於實體店鋪購買之商品，請於購買日起 30 日內攜帶發票原本、購買明細及原商品（含吊牌）至原購買店鋪辦理退換貨。'
  },
  { 
    id: 3, 
    title: '網路商店 | 常見問題',
    answer: '網路商店訂單成立後即無法修改內容。若需更改款式、顏色或尺寸，請先取消訂單後再重新下單。'
  },
  { 
    id: 4, 
    title: '網路商店 | 換貨規則',
    answer: '網路商店目前僅提供「退貨」服務，恕不提供換貨。請將原商品辦理退貨後，重新下單購買所需的商品。'
  },
  { 
    id: 5, 
    title: '網路商店 | 退貨規則',
    answer: '自收到商品起算 7 天內為猶豫鑑賞期，退貨商品必須保持全新未使用、下水，且吊牌未剪之完整狀態。'
  },
  { 
    id: 6, 
    title: '網路商店 | 運費規則',
    answer: '單筆訂單滿 NT$1,500 即享免運優惠；未滿免運門檻將酌收 NT$80 物流運費。'
  }
]);
</script>

<style scoped>
/* 淡入與微微往下滑動的動畫效果 */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


<template>
  <div>
    <h2 class="text-xl text-center font-bold text-gray-800 mb-6 tracking-widest">常見問題</h2>
    
    <div class="border-t border-gray-200">
      <div 
        v-for="item in faqList" 
        :key="item.id"
        class="border-b border-gray-200"
      >
        <div 
          @click="toggle(item.id)"
          class="py-4 px-2 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors group"
        >
          <span class="text-sm font-medium text-gray-800 group-hover:text-black">
            Q: {{ item.title }}
          </span>
          <span 
            class="text-gray-400 transform transition-transform duration-300"
            :class="{ 'rotate-90': activeId === item.id }"
          >
            &gt;
          </span>
        </div>
        
        <div 
          v-show="activeId === item.id"
          class="px-2 pb-6 pt-2 text-sm text-gray-600 leading-relaxed animate-fade-in bg-gray-50/50"
        >
          <span class="font-bold mr-1">A:</span> {{ item.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

