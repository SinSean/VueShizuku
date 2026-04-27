import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomerView from '../views/CustomerView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      //載入版型檔案Basic.vue 當作外殼
      component: () => import('../layout/Basic.vue'),
      //children 就是這個外殼裡面裝的小孩(裡面的頁面)
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        }
      ]
    },
    // 等你之後準備好客服頁面，就可以這樣加：
    // {
    //   path: '/customer',
    //   name: 'customer',
    //   component: () => import('../views/CustomerView.vue')
    // }
  {
      path: '/customer',
      name: 'customer',
      component: CustomerView // 這裡的名字要跟上面 import 的一樣
    }
  ]
})

export default router