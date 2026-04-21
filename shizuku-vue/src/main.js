import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import MegaMenu from 'primevue/megamenu'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'

import App from './App.vue'
const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.component('MegaMenu', MegaMenu)
app.component('Avatar', Avatar)
app.component('Button', Button)
app.mount('#app')
