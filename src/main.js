import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import glyphCard from './components/glyphCard.vue'
import LineChart from './components/LineChart.vue'

const app = createApp(App)

app.component('glyph-card', glyphCard)
app.component('line-chart', LineChart)

app.use(createPinia())
app.use(router)

app.mount('#app')
