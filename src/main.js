import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // 导入 Vuex Store
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { autoLogin } from './utils/auth' // 导入自动登录函数

// 创建 Vue 实例
const app = createApp(App)

// 自动登录
autoLogin(store)

// 使用插件
app.use(router)
  .use(store)
  .use(ElementPlus)
  .mount('#app')