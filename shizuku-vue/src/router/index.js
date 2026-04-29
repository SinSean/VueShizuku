import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import Basic from '@/layout/Basic.vue'
import AuthLayout from '@/layout/AuthLayout.vue'

// Views
import HomeView from '../views/HomeView.vue'
import CustomerView from '../views/CustomerView.vue'
import FaqView from '../views/FaqView.vue'
import AboutView from '../views/AboutView.vue'
import GuideView from '../views/GuideView.vue'
import ShippingPolicyView from '../views/ShippingPolicyView.vue'
import ReturnPolicyView from '../views/ReturnPolicyView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import TermsOfServiceView from '../views/TermsOfServiceView.vue'
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // 統一管理滾動行為
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },

  routes: [
    // 1. 一般頁面 (使用 Basic Layout)
    {
      path: '/',
      component: Basic,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'about', name: 'about', component: AboutView },
        { path: 'guide', name: 'guide', component: GuideView },
        { path: 'shipping-policy', name: 'shippingPolicy', component: ShippingPolicyView },
        { path: 'return-policy', name: 'returnPolicy', component: ReturnPolicyView },
        { path: 'faq', name: 'faq', component: FaqView },
        { path: 'privacy-policy', name: 'privacyPolicy', component: PrivacyPolicyView },
        { path: 'terms-of-service', name: 'termsOfService', component: TermsOfServiceView },
        { path: 'all', name: 'ProductView', component: ProductView },
        {
          path: 'product/:id',
          name: 'product-detail',
          component: () => import('../views/ProductDetail.vue')
        },
        // 客服頁面
        { path: 'customer', name: 'customer', component: CustomerView },
        // 會員中心
        {
          path: 'member',
          component: () => import('../views/MemberView.vue'),
          children: [
            { path: '', redirect: { name: 'MemberProfile' } },
            { path: 'profile', name: 'MemberProfile', component: () => import('../components/MemberProfile.vue') },
            { path: 'paymentmetod', name: 'MemberPayMentmetod', component: () => import('../components/MemberPaymentMethods.vue') },
            { path: 'address', name: 'MemberAddress', component: () => import('../components/MemberAddress.vue') },
            { path: 'password', name: 'MemberSetPassword', component: () => import('../components/MemberSetPassword.vue') },
            { path: 'notificationset', name: 'MemberNotificationSet', component: () => import('../components/MemberNotificationSet.vue') },
            { path: 'privacysetting', name: 'MemberPrivacySetting', component: () => import('../components/MemberPrivacySetting.vue') },
            { path: 'pointsdashboard', name: 'MemberPointsDashboard', component: () => import('../components/MemberPointsDashboard.vue') },
            { path: 'vouchers', name: 'MemberVouchers', component: () => import('../components/MemberVouchers.vue') },
            { path: 'empty', name: 'MemberEmpty', component: () => import('../components/MemberEmpty.vue') }
          ]
        }
      ]
    },
    // 2. 登入/註冊專區 (使用 AuthLayout)
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: '', redirect: { name: 'Login' } },
        { path: 'login', name: 'Login', component: () => import('../components/AppLogin.vue') },
        { path: 'register', name: 'Register', component: () => import('../components/AppRegister.vue') },
        { path: 'forgot-password', name: 'ForgotPassword', component: () => import('../components/AppForgotPassword.vue') }
      ]
    },
    // 3. 錯誤路徑處理
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router