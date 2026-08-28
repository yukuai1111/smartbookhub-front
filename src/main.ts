import { createApp } from 'vue'
import { createPinia } from 'pinia'
const pinia = createPinia()
import './assets/style/reset.scss'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'




import App from './App.vue'
import router from './router'
createApp(App).use(router).use(pinia).mount('#app')
