<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getAddressesAPI, updateAddressesAPI } from '@/api/member';

// 1. 狀態管理
const addressList = ref([]);
const loading = ref(false);
const showModal = ref(false); // 控制彈窗顯示
const isEdit = ref(false);    // 判斷是新增還是修改
const editIndex = ref(-1);    // 正在編輯哪一筆

// 2. 表單資料模型 (對應 DTO 欄位)
const addressForm = reactive({
  fReceiverName: '',
  fReceiverPhone: '',
  fCity: '',
  fArea: '',
  fAddressDetail: '',
  fZipCode: '',
  fIsDefault: false
});

const getMemberId = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    return user.fId || user.fMemberId || user.FMemberId;
  }
  return null;
};

// 3. 取得地址列表
const fetchAddresses = async () => {
  const memberId = getMemberId();
  if (!memberId) return;
  loading.value = true;
  try {
    const res = await getAddressesAPI(memberId);
    if (res.data.success) {
      addressList.value = res.data.data;
    }
  } finally {
    loading.value = false;
  }
};

// 4. 開啟新增彈窗
const openAddModal = () => {
  isEdit.value = false;
  // 重置表單
  Object.assign(addressForm, {
    fReceiverName: '',
    fReceiverPhone: '',
    fCity: '',
    fArea: '',
    fAddressDetail: '',
    fZipCode: '',
    fIsDefault: false
  });
  showModal.value = true;
};

// 5. 開啟編輯彈窗
const openEditModal = (addr, index) => {
  isEdit.value = true;
  editIndex.value = index;
  // 將舊資料填入表單
  Object.assign(addressForm, { ...addr });
  showModal.value = true;
};

// 6. 儲存地址 (新增/修改 共用)
const saveAddress = async () => {
  const newList = [...addressList.value];

  if (isEdit.value) {
    // 修改邏輯
    newList[editIndex.value] = { ...addressForm };
  } else {
    // 新增邏輯：如果是第一筆，自動設為預設
    if (newList.length === 0) addressForm.fIsDefault = true;
    newList.push({ ...addressForm });
  }

  // 處理「預設地址」互斥邏輯
  if (addressForm.fIsDefault) {
    newList.forEach((item, idx) => {
      const currentIdx = isEdit.value ? editIndex.value : newList.length - 1;
      if (idx !== currentIdx) item.fIsDefault = false;
    });
  }

  try {
    const res = await updateAddressesAPI(memberId, newList);
    if (res.data.success) {
      addressList.value = newList;
      showModal.value = false;
      alert(isEdit.value ? '修改成功' : '新增成功');
    }
  } catch (error) {
    alert('操作失敗，請檢查網路連線');
  }
};

// 7. 設為預設地址 (直接更新)
const setDefault = async (index) => {
  const newList = addressList.value.map((addr, i) => ({
    ...addr,
    fIsDefault: i === index
  }));

  try {
    const res = await updateAddressesAPI(memberId, newList);
    if (res.data.success) {
      addressList.value = newList;
      alert("預設地址已更新");
    }
  } catch (error) {
    console.error('更新失敗:', error);
  }
};

// 8. 刪除地址
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

onMounted(fetchAddresses);
</script>

<template>
  <main class="w-full bg-white p-10 shadow-sm border border-slate-100 rounded-xl">
    <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">我的地址</h2>
        <p class="text-slate-500 text-sm mt-1">管理收件地址，提升結帳效率</p>
      </div>
      <!-- 修改點：綁定 openAddModal -->
      <button @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95">
        <i class="pi pi-plus text-sm"></i>
        新增地址
      </button>
    </div>

    <div v-if="loading" class="text-center py-10 text-slate-400">載入中...</div>

    <div v-else class="space-y-6">
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
              <h3 class="font-bold text-lg text-slate-800">{{ addr.fReceiverName }}</h3>
              <span class="text-slate-400">|</span>
              <span class="text-slate-600">{{ addr.fReceiverPhone }}</span>
              <span v-if="addr.fIsDefault" class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-semibold">
                預設地址
              </span>
            </div>
            <p class="text-slate-600 mt-2">{{ addr.fCity }}{{ addr.fArea }}{{ addr.fAddressDetail }}</p>
            <p class="text-slate-400 text-sm">{{ addr.fZipCode }}</p>
          </div>

          <div class="flex items-center gap-4 text-sm font-medium">
            <button v-if="!addr.fIsDefault" @click="setDefault(index)"
              class="text-slate-500 hover:text-blue-600 transition-colors">設為預設</button>
            <!-- 修改點：綁定 openEditModal -->
            <button @click="openEditModal(addr, index)"
              class="text-slate-500 hover:text-blue-600 transition-colors">編輯</button>
            <button @click="deleteAddress(index)"
              class="text-slate-500 hover:text-red-600 transition-colors">刪除</button>
          </div>
        </div>
      </div>
    </div>

    <!--  新增：地址編輯彈窗 (Modal) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h3 class="text-xl font-bold mb-6 text-slate-800">{{ isEdit ? '修改收件地址' : '新增收件地址' }}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">收件人姓名</label>
            <input v-model="addressForm.fReceiverName" type="text"
              class="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="請輸入姓名" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">聯絡電話</label>
            <input v-model="addressForm.fReceiverPhone" type="text"
              class="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="請輸入電話" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">城市</label>
              <input v-model="addressForm.fCity" placeholder="如：台北市"
                class="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">地區</label>
              <input v-model="addressForm.fArea" placeholder="如：大安區"
                class="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">詳細地址</label>
            <input v-model="addressForm.fAddressDetail" placeholder="道路名稱與門牌號碼"
              class="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">郵遞區號</label>
            <input v-model="addressForm.fZipCode" placeholder="如：106"
              class="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div class="flex items-center gap-2 pt-2">
            <input type="checkbox" v-model="addressForm.fIsDefault" id="isDefault" class="w-4 h-4" />
            <label for="isDefault" class="text-sm text-slate-600 cursor-pointer">設為預設地址</label>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button @click="showModal = false"
            class="px-6 py-2.5 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">取消</button>
          <button @click="saveAddress"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all">儲存地址</button>
        </div>
      </div>
    </div>
  </main>
</template>