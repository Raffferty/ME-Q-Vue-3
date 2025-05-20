import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const pinia = createPinia()

// Example: Restore saved state (e.g. from localStorage)
const savedState = JSON.parse(localStorage.getItem('app-state') || '{}')

console.log('savedState', savedState)

// ⚠️ Set initial state BEFORE mounting
pinia.state.value = {
  ...pinia.state.value,
  ...savedState,
}

const app = createApp(App)

app.use(pinia)
app.use(router)

export { pinia } // 👈 export the instance

app.mount('#app')
