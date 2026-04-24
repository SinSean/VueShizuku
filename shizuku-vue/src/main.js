import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import 'primeicons/primeicons.css'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import Divider from 'primevue/divider'
import Aura from '@primevue/themes/aura'
const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})

app.use(createPinia())
app.use(router)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputGroup', InputGroup)
app.component('Divider', Divider)

app.mount('#app')
