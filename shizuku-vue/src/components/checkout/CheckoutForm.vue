<script setup>
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { PAYMENT_METHOD } from '@/services/orderStatusManager'

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  paymentOptions: {
    type: Array,
    required: true,
  },
  cartTotal: {
    type: Number,
    required: true,
  },
  addressList: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:form', 'submit', 'back'])

// 用來更新父元件的 form 資料（深層屬性）
const updateField = (field, value) => {
  emit('update:form', { ...props.form, [field]: value })
}

// 快速選擇常用地址
const selectSavedAddress = (addr) => {
  const fullAddress = `${addr.fCity}${addr.fArea}${addr.fAddressDetail}`
  emit('update:form', {
    ...props.form,
    receiverName: addr.fReceiverName,
    receiverPhone: addr.fReceiverPhone,
    receiverAddress: fullAddress,
  })
}
</script>

<template>
  <div class="p-6 sm:p-10">
    <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <span class="w-1.5 h-5 bg-black rounded-full"></span>
      聯絡與配送資訊
    </h2>

    <div class="flex flex-col gap-6">
      <!-- 常用收件資訊快速填入 -->
      <div v-if="props.addressList && props.addressList.length > 0" class="mb-2">
        <h3
          class="text-xs font-bold text-gray-400 mb-3 tracking-wider flex items-center gap-1.5 uppercase"
        >
          <i class="pi pi-address-book"></i>常用地址
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="(addr, idx) in props.addressList"
            :key="idx"
            @click="selectSavedAddress(addr)"
            class="border border-gray-200 hover:border-black rounded-xl p-4 cursor-pointer transition-all bg-gray-50/30 hover:bg-gray-50 flex flex-col gap-1.5 relative overflow-hidden group"
          >
            <div class="flex items-center gap-2">
              <span
                class="font-bold text-sm text-black group-hover:text-blue-600 transition-colors"
                >{{ addr.fReceiverName }}</span
              >
              <span class="text-xs text-gray-300">|</span>
              <span class="text-xs text-gray-600 font-mono">{{ addr.fReceiverPhone }}</span>
              <span
                v-if="addr.fIsDefault"
                class="bg-black text-white text-[9px] px-1.5 py-0.5 rounded font-black scale-90 origin-left"
              >
                預設
              </span>
            </div>
            <p class="text-xs text-gray-500 truncate">
              {{ addr.fCity }}{{ addr.fArea }}{{ addr.fAddressDetail }}
            </p>
          </div>
        </div>
      </div>

      <!-- 收件人姓名 -->
      <FloatLabel>
        <InputText
          id="name"
          :modelValue="props.form.receiverName"
          @update:modelValue="updateField('receiverName', $event)"
          class="w-full h-14 bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition"
        />
        <label for="name" class="text-gray-500 text-sm">收件人姓名 (Receiver Name)</label>
      </FloatLabel>

      <!-- 行動電話 -->
      <FloatLabel>
        <InputText
          id="phone"
          :modelValue="props.form.receiverPhone"
          @update:modelValue="updateField('receiverPhone', $event)"
          class="w-full h-14 bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition"
        />
        <label for="phone" class="text-gray-500 text-sm">行動電話 (Mobile Phone)</label>
      </FloatLabel>

      <!-- 完整地址 -->
      <FloatLabel>
        <InputText
          id="address"
          :modelValue="props.form.receiverAddress"
          @update:modelValue="updateField('receiverAddress', $event)"
          class="w-full h-14 bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition"
        />
        <label for="address" class="text-gray-500 text-sm">完整地址 (Shipping Address)</label>
      </FloatLabel>

      <!-- 運送方式選擇 -->
      <div class="mt-2">
        <h3 class="text-sm font-bold text-gray-900 mb-3 tracking-wide">選擇運送方式</h3>
        <div
          class="border-2 border-black bg-gray-50 rounded-lg p-4 flex justify-between items-center cursor-pointer shadow-sm"
        >
          <div class="flex items-center gap-4">
            <i class="pi pi-truck text-xl"></i>
            <div>
              <p class="font-bold text-black text-sm">標準宅配</p>
              <p class="text-xs text-gray-500 mt-1">預計 2-3 個工作天送達</p>
            </div>
          </div>
          <span class="font-bold text-black text-sm">{{
            props.cartTotal >= 1500 ? '免運費' : 'NT$ 60'
          }}</span>
        </div>
      </div>

      <!-- 付款方式選擇 -->
      <div class="mt-4">
        <h3 class="text-sm font-bold text-gray-900 mb-3 tracking-wide">選擇付款方式</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="option in props.paymentOptions"
            :key="option.id"
            @click="updateField('paymentMethodId', option.id)"
            :class="[
              'border-2 rounded-lg p-4 cursor-pointer transition-all shadow-sm',
              props.form.paymentMethodId === option.id
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 bg-white',
            ]"
          >
            <div class="flex flex-col items-center text-center gap-2">
              <i
                :class="[
                  'pi',
                  option.icon,
                  'text-2xl',
                  props.form.paymentMethodId === option.id ? 'text-black' : 'text-gray-400',
                ]"
              ></i>
              <div>
                <p
                  :class="[
                    'font-bold text-sm',
                    props.form.paymentMethodId === option.id ? 'text-black' : 'text-gray-600',
                  ]"
                >
                  {{ option.name }}
                </p>
                <p class="text-xs text-gray-400 mt-1">{{ option.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 貨到付款運費提示 -->
        <Transition name="fade">
          <div
            v-if="props.form.paymentMethodId === PAYMENT_METHOD.COD"
            class="mt-4 p-4 rounded-lg text-sm flex items-start gap-3 border"
            :class="
              props.cartTotal >= 1500
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            "
          >
            <i class="pi pi-info-circle mt-0.5 flex-shrink-0"></i>
            <span>
              <template v-if="props.cartTotal >= 1500">
                本訂單已達免運門檻，貨到付款免收運費！
              </template>
              <template v-else>
                選擇貨到付款時，訂單金額未滿
                <strong class="text-amber-900">NT$ 1,500</strong>
                將加收 <strong class="text-amber-900">NT$ 60</strong> 運費。
              </template>
            </span>
          </div>
        </Transition>
      </div>

      <!-- 備註 -->
      <FloatLabel class="mt-2">
        <Textarea
          id="note"
          :modelValue="props.form.note"
          @update:modelValue="updateField('note', $event)"
          rows="3"
          class="w-full bg-white !rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition resize-none pt-4"
        />
        <label for="note" class="text-gray-500 text-sm">給店家的備註</label>
      </FloatLabel>
    </div>

    <!-- 底部按鈕區 -->
    <div
      class="mt-10 pt-8 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4"
    >
      <button
        @click="emit('back')"
        class="text-sm text-gray-500 hover:text-black transition flex items-center justify-center gap-2 group w-full sm:w-auto py-3"
      >
        <i class="pi pi-angle-left group-hover:-translate-x-1 transition-transform"></i>
        回到購物車
      </button>
      <button
        @click="emit('submit')"
        class="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-md font-bold tracking-widest transition flex items-center justify-center gap-3 shadow-lg shadow-gray-200"
      >
        確認送出 <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
