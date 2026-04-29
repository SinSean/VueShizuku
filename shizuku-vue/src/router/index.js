// 每一行程式碼的中文註解：

// 從工具箱拿出必要的路由工具
import { createRouter, createWebHistory } from 'vue-router'

// ====== 靜態引進區塊（買好的蘋果，直接拿來用） ======
// 我們把所有要用的頁面都先在上面「點名」點好
import Basic from '@/layout/Basic.vue'
import HomeView from '@/views/HomeView.vue'
import OrdersListView from '@/views/OrdersListView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'
import CartDetailView from '@/views/CartDetailView.vue'
import PaymentListView from '@/views/PaymentListView.vue'
import PaymentDetailView from '@/views/PaymentDetailView.vue'

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
          component: HomeView,
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersListView,
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: OrderDetailView,
        },
        {
          path: 'orders/:id/payments',
          name: 'payment-list',
          component: PaymentListView,
        },
        {
          path: 'PaymentList',
          name: 'payment-list-root',
          component: PaymentListView,
        },
        {
          path: 'orders/:id/payments/:transactionId',
          name: 'payment-detail',
          component: PaymentDetailView,
        },
      ],
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartDetailView,
    },
  ],
})
export default router
