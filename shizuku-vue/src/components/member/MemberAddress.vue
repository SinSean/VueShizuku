<script setup>
import { ref, onMounted } from 'vue';
import { getAddressesAPI, updateAddressesAPI } from '@/api/member';

// 狀態管理
const addressList = ref([]);
const loading = ref(false);

// 動態取得會員 ID (從 localStorage)
const getMemberId = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    // 優先抓取 fId，如果沒有則嘗試 fMemberId
    return user.fId || user.fMemberId || user.FMemberId;
  }
  return null;
};

const memberId = getMemberId();

// 取得地址列表
const fetchAddresses = async () => {
  if (!memberId) {
    console.warn('未偵測到登入資訊');
    return;
  }

  loading.value = true;
  try {
    const res = await getAddressesAPI(memberId);
    if (res.data.success) {
      addressList.value = res.data.data;
    }
  } catch (error) {
    console.error('取得地址失敗:', error);
  } finally {
    loading.value = false;
  }
};

// 設為預設地址
const setDefault = async (index) => {
  // 先在本地端調整狀態：只有點擊的那筆為 true，其餘為 false
  const newList = addressList.value.map((addr, i) => ({
    ...addr,
    fIsDefault: i === index
  }));

  try {
    const res = await updateAddressesAPI(memberId, newList);
    if (res.data.success) {
      addressList.value = newList; // 更新成功後同步本地狀態
      alert("預設地址已更新");
    }
  } catch (error) {
    console.error('更新失敗:', error);
  }
};

// 刪除地址
const deleteAddress = async (index) => {
  if (!confirm('確定要刪除此地址嗎？')) return;

  const newList = [...addressList.value];
  newList.splice(index, 1);

  try {
    const res = await updateAddressesAPI(memberId, newList);
    if (res.data.success) {
      addressList.value = newList;
    }
  } catch (error) {
    console.error('刪除失敗:', error);
  }
};

onMounted(() => {
  fetchAddresses();
});
</script>

<template>
  <main class="w-full bg-white p-10 shadow-sm border border-slate-100 rounded-xl">
    <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">我的地址</h2>
        <p class="text-slate-500 text-sm mt-1">管理收件地址，提升結帳效率</p>
      </div>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
        <i class="pi pi-plus text-sm"></i>
        新增地址
      </button>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="loading" class="text-center py-10 text-slate-400">載入中...</div>

    <!-- 地址列表 -->
    <div v-else class="space-y-6">
      <!-- 無地址時的提示 -->
      <div v-if="addressList.length === 0"
        class="text-center py-20 text-slate-400 border border-dashed border-slate-200 rounded-xl">
        <i class="pi pi-map-marker text-4xl mb-3 block"></i>
        目前沒有儲存的地址
      </div>

      <div v-for="(addr, index) in addressList" :key="index"
        class="border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-300 group">

        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <!-- 姓名與電話 -->
              <h3 class="font-bold text-lg text-slate-800">{{ addr.fReceiverName }}</h3>
              <span class="text-slate-400">|</span>
              <span class="text-slate-600">{{ addr.fReceiverPhone }}</span>

              <!-- 預設標籤 -->
              <span v-if="addr.fIsDefault" class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-semibold">
                預設地址
              </span>
            </div>

            <!-- 地址詳情 -->
            <p class="text-slate-600 mt-2">
              {{ addr.fCity }}{{ addr.fArea }}{{ addr.fAddressDetail }}
            </p>
            <p class="text-slate-400 text-sm">{{ addr.fZipCode }}</p>
          </div>

          <div class="flex items-center gap-4 text-sm font-medium">
            <button v-if="!addr.fIsDefault" @click="setDefault(index)"
              class="text-slate-500 hover:text-blue-600 transition-colors">設為預設</button>
            <button class="text-slate-500 hover:text-blue-600 transition-colors">編輯</button>
            <button @click="deleteAddress(index)"
              class="text-slate-500 hover:text-red-600 transition-colors">刪除</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 這裡可以放你的樣式 */
</style>