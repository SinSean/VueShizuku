import { createRouter, createWebHistory } from 'vue-router'
import Basic from '@/layout/Basic.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Basic,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
      ],
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartDetailView.vue'),
    },
  ],
})

export default router
