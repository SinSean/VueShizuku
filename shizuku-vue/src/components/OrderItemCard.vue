<script setup>
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

const router = useRouter()

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const goToDetail = () => {
  router.push({
    name: 'order-detail',
    params: { id: props.order.id },
  })
}
</script>

<template>
  <Card
    class="shadow-sm border border-gray-100 rounded-xl mb-4 hover:border-blue-300 transition-all"
  >
    <template #content>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <span class="text-lg font-bold text-gray-800">{{ props.order.id }}</span>
            <Tag :value="props.order.status" severity="success" class="text-xs" />
          </div>
          <p class="text-sm text-gray-400 mt-1">訂購時間：{{ props.order.date }}</p>
        </div>

        <div class="flex items-center md:px-10">
          <span class="text-2xl font-black text-blue-800">$ {{ props.order.total }}</span>
        </div>

        <div class="flex items-center">
          <Button
            label="查看詳情"
            icon="pi pi-angle-right"
            iconPos="right"
            outlined
            @click="goToDetail"
            class="p-button-sm px-6"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
