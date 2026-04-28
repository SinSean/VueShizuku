import { createRouter, createWebHistory } from 'vue-router'
import Basic from '@/layout/Basic.vue'
import AuthLayout from '@/layout/AuthLayout.vue';

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
            //我的帳戶
            {
              path: '',
              redirect: { name: 'MemberProfile' }
            },
            {
              path: 'profile',
              name: 'MemberProfile',
              component: () => import('../components/MemberProfile.vue'),
            },
            {
              path: 'paymentmetod',
              name: 'MemberPayMentmetod',
              component: () => import('../components/MemberPaymentMethods.vue'),
            },
            {
              path: 'address',
              name: 'MemberAddress',
              component: () => import('../components/MemberAddress.vue'),
            },
            {
              path: 'password',
              name: 'MemberSetPassword',
              component: () => import('../components/MemberSetPassword.vue'),
            },
            {
              path: 'notificationset',
              name: 'MemberNotificationSet',
              component: () => import('../components/MemberNotificationSet.vue'),
            },
            {
              path: 'privacysetting',
              name: 'MemberPrivacySetting',
              component: () => import('../components/MemberPrivacySetting.vue'),
            },
            //其他
            {
              path: 'pointsdashboard',
              name: 'MemberPointsDashboard',
              component: () => import('../components/MemberPointsDashboard.vue'),
            },
            {
              path: 'vouchers',
              name: 'MemberVouchers',
              component: () => import('../components/MemberVouchers.vue'),
            },
            {//空白頁面，表示未做vue
              path: 'empty',
              name: 'MemberEmpty',
              component: () => import('../components/MemberEmpty.vue'),
            },
          ],
        },
      ],
    },
    // 2. 這是登入/註冊專區 (獨立於 Basic 之外)
    {
      path: '/auth',
      component: AuthLayout, // 只有背景與表單的 Layout
      children: [
        {
          path: '',
          redirect: { name: 'Login' }
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import('../components/AppLogin.vue'),
        },
        // {
        //   path: 'register',
        //   name: 'Register',
        //   component: () => import('../views/auth/RegisterView.vue'),
        // }
      ]
    },
    // 輸入錯誤路徑，導回首頁
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果按了「上一頁/下一頁」，回到之前的位置
      return savedPosition;
    } else {
      // 否則，每次切換新路由都強制回到頂端
      return { top: 0 };
    }
  }
})

export default router
