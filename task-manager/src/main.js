// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
// ...
import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// main.ts

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.use(VxeUIAll)
app.use(VxeUITable)

app.mount('#app')
