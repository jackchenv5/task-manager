// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
// ...
import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx'
import ExcelJS from 'exceljs'

VxeUITable.use(VxeUIPluginExportXLSX, {
  ExcelJS
})

import App from './App.vue'
import router from './router'

const app = createApp(App)



app.use(createPinia())
// app.use(ElementPlus)
app.use(router)
app.use(VxeUIAll)
app.use(VxeUITable)

app.mount('#app')
