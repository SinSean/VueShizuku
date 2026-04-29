import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomerView from '../views/CustomerView.vue'
// ⚠️ 重點 1：記得引入 FaqView
import FaqView from '../views/FaqView.vue'
import AboutView from '../views/AboutView.vue' // 引入品牌故事
import GuideView from '../views/GuideView.vue' // 引入購物指南
import ShippingPolicyView from '../views/ShippingPolicyView.vue' // 引入運送政策
import ReturnPolicyView from '../views/ReturnPolicyView.vue' // 引入退貨政策

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // 載入版型檔案Basic.vue 當作外殼
      component: () => import('../layout/Basic.vue'),
      // children 就是這個外殼裡面裝的小孩(裡面的頁面)
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView
        },
        { 
          path: 'guide', 
          name: 'guide', 
          component: GuideView 
        },
        {
          path: 'shipping-policy',
          name: 'shippingPolicy',
          component: ShippingPolicyView
        },
        {
          path: 'return-policy',
          name: 'returnPolicy',
          component: ReturnPolicyView
        },
         {
      path: '/faq', // 這裡也要加斜線 /
      name: 'faq',      
      component: FaqView
    }
      ]
    },
    // ⚠️ 重點 2：搬到最外層的獨立頁面，path 前面一定要加斜線 /
    {
      path: '/customer', 
      name: 'customer',
      component: CustomerView 
    },
    
  ]
})

export default router