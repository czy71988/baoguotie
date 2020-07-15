import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '@/utils/custom-vue-directive'
import 'amfe-flexible'
import { DatetimePicker, Popup, Swipe, SwipeItem, Toast, ImagePreview, Picker, Panel, List, Cell } from 'vant'
// import 'vant/lib/button/style'
import fileController from '@/utils/fileController'
import { getUserInf } from '@/utils/userInf'
Vue.use(ElementUI)
Vue.use(DatetimePicker)
Vue.use(Popup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Picker)
Vue.use(Toast)
Vue.use(ImagePreview)
Vue.use(Panel)
Vue.use(List)
Vue.use(Cell)
// Toast({
//   message: 'dfjf你好',
//   duration: 100000,
//   overlay: true
// })
Vue.prototype.$axios = axios
Vue.prototype.$fileController = fileController
Vue.prototype.$user = {
  getRegion: () => {
    return getUserInf().region
  },
  isAdmin: (tel) => {
    return ['13918508501', '15001955901', '18516678204', '13251931688', '18930660911'].indexOf(tel) > -1
  }
}
if (process.env.NODE_ENV === 'production') { axios.defaults.baseURL = 'http://139.196.178.156:8080/' }

// 关闭生产环境的提示消息
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
