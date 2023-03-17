import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import _ from 'lodash'
// import './assets/main.css'
import Antd from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css';

window._ = _

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
