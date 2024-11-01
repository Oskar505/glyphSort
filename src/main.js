import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import glyphCard from './components/glyphCard.vue'

const app = createApp(App)

app.component('glyph-card', glyphCard)

app.use(createPinia())
app.use(router)

app.mount('#app')
