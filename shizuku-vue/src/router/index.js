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
        // 會員頁面
        {
          path: '/member',
          component: () => import('../views/MemberView.vue'),
          children: [
            {
              path: '',
              redirect: { name: 'MemberProfile' }
            },
            {
              path: 'profile',
              name: 'MemberProfile',
              component: () => import('../views/MemberProfileView.vue'),
            },
            {
              path: 'address',
              name: 'MemberAddress',
              component: () => import('../views/MemberAddressView.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
