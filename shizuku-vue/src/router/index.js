import { createRouter, createWebHistory } from 'vue-router'
import Basic from '@/layout/Basic.vue'
import ProductView from '../views/ProductView.vue'
import ProductDetail from '@/components/ProductDetail.vue'

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
        {
      path: 'all', //<--- 這裡定義了「路徑名稱」
      name: 'ProductView',
      component: () => import('../views/ProductView.vue'),     
    },
    {
  path: 'product/:id', // :id 是動態參數
  name: 'product-detail',
  component: () => import('../views/ProductDetail.vue')
}
    
      ],     
    },
    
  ],
})

export default router
