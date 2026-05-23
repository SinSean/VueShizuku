import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' //會員登入狀態

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
        {
          path: 'orders/:id/payments/:transactionId',
          name: 'payment-detail',
          component: PaymentDetailView,
        },

        // 購物車
        { path: 'cart', name: 'cart', component: CartDetailView },

        // 商品頁面
        { path: 'all', name: 'ProductView', component: ProductView },
        {
          path: 'product/:id',
          name: 'product-detail',
          component: () => import('@/views/ProductDetail.vue'),
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
            {
              path: 'profile',
              name: 'MemberProfile',
              component: () => import('@/components/member/MemberProfile.vue'),
            },
            {
              path: 'paymentmetod',
              name: 'MemberPayMentmetod',
              component: () => import('@/components/member/MemberPaymentMethods.vue'),
            },
            {
              path: 'address',
              name: 'MemberAddress',
              component: () => import('@/components/member/MemberAddress.vue'),
            },
            {
              path: 'password',
              name: 'MemberSetPassword',
              component: () => import('@/components/member/MemberSetPassword.vue'),
            },
            {
              path: 'notificationset',
              name: 'MemberNotificationSet',
              component: () => import('@/components/member/MemberNotificationSet.vue'),
            },
            {
              path: 'privacysetting',
              name: 'MemberPrivacySetting',
              component: () => import('@/components/member/MemberPrivacySetting.vue'),
            },
            {
              path: 'pointsdashboard',
              name: 'MemberPointsDashboard',
              component: () => import('@/components/member/MemberPointsDashboard.vue'),
            },
            {
              path: 'vouchers',
              name: 'MemberVouchers',
              component: () => import('@/components/member/MemberVouchers.vue'),
            },
            {
              path: '/security',
              name: 'security',
              component: () => import('@/components/member/MemberProfileSecurity.vue'),
            },
            {
              path: 'MemberOrders',
              name: 'MemberOrders',
              component: () => import('@/components/member/MemberOrders.vue'),
            },
            {
              path: 'orders/:id',
              name: 'MemberOrderDetail',
              component: () => import('@/views/OrderDetailView.vue'),
            },
            {
              path: 'empty',
              name: 'MemberEmpty',
              component: () => import('@/components/member/MemberEmpty.vue'),
            },
          ],
        },
        { path: '/point-store', name: 'point-store', component: () => import('@/components/member/MemberStore.vue'), },
      ],
    },

    // 2. 登入/註冊專區 (使用 AuthLayout)
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: '', redirect: { name: 'Login' } },
        { path: 'login', name: 'Login', component: () => import('@/components/AppLogin.vue') },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/components/AppRegister.vue'),
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: () => import('@/components/AppForgotPassword.vue'),
        },
      ],
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
        title: '付款處理中 - Shizuku',
      },
    },

    // 3. 後台登入頁面 (獨立，不帶 Sidebar)
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
    },
    // 4. 後台管理區 (使用 AdminView 作為 Layout)
    {
      path: '/admin',
      component: () => import('@/views/AdminView.vue'),
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminDashboardView.vue'),
        },
        {
          path: 'members',
          name: 'admin-members',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/member/AdminMembersView.vue'),
        },
        {
          path: 'members/block',
          name: 'admin-members-block',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/member/AdminMembersBlockView.vue'),
        },
        {
          path: 'system/vertify/settings',
          name: 'admin-system-settings',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/system/AdminSystemConfigsView.vue'),
        },
        {
          path: 'system/logs',
          name: 'admin-system-logs',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/system/AdminSystemLogsView.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminProductsView.vue'),
        },
        {
          path: 'products/create',
          name: 'admin-products-create',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminProductCreateView.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'admin-products-edit',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminProductEditView.vue'),
        },
        {
          path: 'inventory',
          name: 'admin-inventory',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminInventoryView.vue'),
        },
        {
          path: 'inventory/create',
          name: 'admin-inventory-create',
          component: () => import('@/views/admin/AdminPurchaseCreateView.vue'),
        },
        {
          path: 'categories',
          name: 'admin-categories',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminCategoriesView.vue'),
        },
        {
          path: 'orders',
          name: 'admin-orders',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminOrdersView.vue'),
        },
        {
          path: 'payments',
          name: 'admin-payments',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminPaymentsView.vue'),
        },
        {
          path: 'customer-service',
          name: 'admin-customer-service',
          meta: { requiresAdmin: true },
          component: () => import('@/views/admin/AdminCustomerServiceView.vue'),
        },
      ],
    },
    // 4. 錯誤路徑處理(永遠放最後一個)
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

/////後台權限檢查/////
router.beforeEach((to) => {
  if (to.meta.requiresAdmin) {
    const user = JSON.parse(localStorage.getItem('adminUser'))
    if (!user || !user.isEmployee) {
      return { name: 'admin-login' }
    }
  }
})

// 前台檢測
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  // 1. 定義哪些頁面是「只有會員才能進去」的
  // 檢查路徑是否以 /member 開頭，或是否為 checkout 頁面
  const isMemberPage = to.path.startsWith('/member') || to.name === 'checkout'

  // 2. 定義哪些頁面是「登入後就不該再進去」的（例如登入頁、註冊頁）
  const isAuthPage = to.path.startsWith('/auth')

  if (isMemberPage && !authStore.isLogin) {
    // 如果要去會員頁但沒登入 -> 踢回登入頁
    alert('請先登入會員')
    await router.push({ name: 'Login' })
  } else if (isAuthPage && authStore.isLogin) {
    // 如果已經登入了還想去登入頁 -> 踢回首頁
    await router.push({ name: 'home' })
  }

  // 這裡完全不需要寫任何 return 與 next()，沒進 if 的情況 Vue 3 就會預設直接放行
})

export default router
