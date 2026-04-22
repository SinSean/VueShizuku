import 'primeicons/primeicons.css'
import router from './router'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import BadgeDirective from 'primevue/badgedirective'
import Aura from '@primevue/themes/aura'
import MegaMenu from 'primevue/megamenu'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Drawer from 'primevue/drawer'
import Badge from 'primevue/badge'
import Ripple from 'primevue/ripple'

import PanelMenu from 'primevue/panelmenu'

import App from './App.vue'
const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(router)
app.directive('badge', BadgeDirective)
app.component('Badge', Badge) // 註冊小徽章
app.directive('ripple', Ripple) // 註冊水波紋指令
app.component('PanelMenu', PanelMenu)
app.component('Drawer', Drawer)
app.component('Menu', Menu)
app.component('MegaMenu', MegaMenu)
app.component('Avatar', Avatar)
app.component('Button', Button)
app.mount('#app')
