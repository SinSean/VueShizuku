import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // 載入版型檔案 Basic.vue 當作外殼
      component: () => import('../layout/Basic.vue'),
      // children 就是這個外殼裡面裝的小孩 (裡面的頁面)
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
      ],
    },
    {
      path: '/CartDetail',
      name: 'CartDetail',
      component: () => import('@/views/CartDetailView.vue'),
    },
  ],
})

export default router
