import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import glyphCard from './components/glyphCard.vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import FileInput from './components/FileInput.vue'
import GlyphSetInfo from './components/GlyphSetInfo.vue'

const app = createApp(App)

app.component('glyph-card', glyphCard)
app.component('line-chart', LineChart)
app.component('bar-chart', BarChart)
app.component('file-input', FileInput)
app.component('glyph-set-info', GlyphSetInfo)

app.use(createPinia())
app.use(router)

app.mount('#app')
