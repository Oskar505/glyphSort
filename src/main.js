import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import glyphCard from './components/glyphCard.vue'
import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import FileInput from './components/FileInput.vue'
import GlyphSetInfo from './components/GlyphSetInfo.vue'
import HeaderBar from './components/HeaderBar.vue'
import Loader from './components/Loader.vue'

const app = createApp(App)

app.component('glyph-card', glyphCard)
app.component('line-chart', LineChart)
app.component('bar-chart', BarChart)
app.component('file-input', FileInput)
app.component('glyph-set-info', GlyphSetInfo)
app.component('header-bar', HeaderBar)
app.component('loader', Loader)

app.use(createPinia())
app.use(router)



app.config.globalProperties.$getCookie = function (name) {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return null;
}



app.mount('#app')
