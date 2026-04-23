import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Button from 'primevue/button'; // 匯入元件



import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue);

// 全域註冊，之後任何頁面都能直接寫 <Button />
app.component('Button', Button);

app.mount('#app')
