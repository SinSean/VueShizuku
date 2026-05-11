import { createRouter, createWebHistory } from 'vue-router'

// --- Layouts ---
import Basic from '@/layout/Basic.vue'
import AuthLayout from '@/layout/AuthLayout.vue'

// --- Views ---
import HomeView from '@/views/HomeView.vue'
import OrdersListView from '@/views/OrdersListView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'
import CartDetailView from '@/views/CartDetailView.vue'
import PaymentListView from '@/views/PaymentListView.vue'
import PaymentDetailView from '@/views/PaymentDetailView.vue'
import CustomerView from '@/views/CustomerView.vue'
import FaqView from '@/views/FaqView.vue'
import AboutView from '@/views/AboutView.vue'
import GuideView from '@/views/GuideView.vue'
import ShippingPolicyView from '@/views/ShippingPolicyView.vue'
import ReturnPolicyView from '@/views/ReturnPolicyView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import TermsOfServiceView from '@/views/TermsOfServiceView.vue'
import ProductView from '@/views/ProductView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import PaymentSuccessView from '@/views/PaymentSuccessView.vue'

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
        // 首頁
        { path: '', name: 'home', component: HomeView },

        // 訂單與支付相關
        { path: 'orders', name: 'orders', component: OrdersListView },
        { path: 'orders/:id', name: 'order-detail', component: OrderDetailView },
        { path: 'orders/:id/payments', name: 'payment-list', component: PaymentListView },
        { path: 'PaymentList', name: 'payment-list-root', component: PaymentListView },
        { path: 'orders/:id/payments/:transactionId', name: 'payment-detail', component: PaymentDetailView },

        // 購物車
        { path: 'cart', name: 'cart', component: CartDetailView },
        

        // 商品頁面
        { path: 'all', name: 'ProductView', component: ProductView },
        {
          path: 'product/:id',
          name: 'product-detail',
          component: () => import('@/views/ProductDetail.vue')
        },

        // 資訊頁面
        { path: 'about', name: 'about', component: AboutView },
        { path: 'guide', name: 'guide', component: GuideView },
        { path: 'shipping-policy', name: 'shippingPolicy', component: ShippingPolicyView },
        { path: 'return-policy', name: 'returnPolicy', component: ReturnPolicyView },
        { path: 'faq', name: 'faq', component: FaqView },
        { path: 'privacy-policy', name: 'privacyPolicy', component: PrivacyPolicyView },
        { path: 'terms-of-service', name: 'termsOfService', component: TermsOfServiceView },

        // 會員中心
        {
          path: 'member',
          component: () => import('@/views/MemberView.vue'),
          children: [
            { path: '', redirect: { name: 'MemberProfile' } },
            { path: 'profile', name: 'MemberProfile', component: () => import('@/components/member/MemberProfile.vue') },
            { path: 'paymentmetod', name: 'MemberPayMentmetod', component: () => import('@/components/member/MemberPaymentMethods.vue') },
            { path: 'address', name: 'MemberAddress', component: () => import('@/components/member/MemberAddress.vue') },
            { path: 'password', name: 'MemberSetPassword', component: () => import('@/components/member/MemberSetPassword.vue') },
            { path: 'notificationset', name: 'MemberNotificationSet', component: () => import('@/components/member/MemberNotificationSet.vue') },
            { path: 'privacysetting', name: 'MemberPrivacySetting', component: () => import('@/components/member/MemberPrivacySetting.vue') },
            { path: 'pointsdashboard', name: 'MemberPointsDashboard', component: () => import('@/components/member/MemberPointsDashboard.vue') },
            { path: 'vouchers', name: 'MemberVouchers', component: () => import('@/components/member/MemberVouchers.vue') },
            { path: 'MemberOrders', name: 'MemberOrders', component: () => import('@/components/member/MemberOrders.vue') },
            { path: 'orders/:id', name: 'MemberOrderDetail', component: () => import('@/views/OrderDetailView.vue') },
            { path: 'empty', name: 'MemberEmpty', component: () => import('@/components/member/MemberEmpty.vue') }
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
        { path: 'login', name: 'Login', component: () => import('@/components/AppLogin.vue') },
        { path: 'register', name: 'Register', component: () => import('@/components/AppRegister.vue') },
        { path: 'forgot-password', name: 'ForgotPassword', component: () => import('@/components/AppForgotPassword.vue') }
      ]
    },


    { path: '/customer', name: 'customer', component: CustomerView },
    //結帳頁面
    { path: '/checkout', name: 'checkout', component: CheckoutView },

    // LINE Pay 指定要跳回來的網址
    {
      path: '/payment/success',
      name: 'PaymentSuccess',
      component: PaymentSuccessView,
      meta: {
        title: '付款處理中 - Shizuku'
      }
    },

    // 3. 錯誤路徑處理
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router