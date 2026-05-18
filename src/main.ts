import '@/assets/styles/theme.css'
import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import all base components
import BaseButton from '@/components/shared/button/BaseButton.vue'
import BaseTextField from '@/components/shared/input/BaseTextField.vue'
import BaseTextarea from '@/components/shared/input/BaseTextarea.vue'
import BaseCheckbox from '@/components/shared/input/BaseCheckbox.vue'
import BaseRadio from '@/components/shared/input/BaseRadio.vue'

// Import layout components
import AuthLayout from '@/components/auth/AuthLayout.vue'
import AuthHero from '@/components/auth/AuthHero.vue'
import AuthTabs from '@/components/auth/AuthTabs.vue'

// Import landing components
import LandingNavbar from '@/components/landing/LandingNavbar.vue'
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingCards from '@/components/landing/LandingCards.vue'
import LandingCardItem from '@/components/landing/LandingCardItem.vue'

const app = createApp(App)

// Register global components
app.component('BaseButton', BaseButton)
app.component('BaseTextField', BaseTextField)
app.component('BaseTextarea', BaseTextarea)
app.component('BaseCheckbox', BaseCheckbox)
app.component('BaseRadio', BaseRadio)

app.component('AuthLayout', AuthLayout)
app.component('AuthHero', AuthHero)
app.component('AuthTabs', AuthTabs)

app.component('LandingNavbar', LandingNavbar)
app.component('LandingHero', LandingHero)
app.component('LandingCards', LandingCards)
app.component('LandingCardItem', LandingCardItem)

app.use(createPinia())
app.use(router)
app.mount('#app')