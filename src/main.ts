import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { initializeAuth } from './composables/useAuth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

void initializeAuth()

app.mount('#app')
