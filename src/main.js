import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Helper from './lib'
import VueResource from 'vue-resource'
import i18n from './language'

// use vue-resoure for http request
Vue.use(VueResource)
// bind helper method to globel
Vue.prototype.$Helper = Helper
// bind env to globel
Vue.prototype.$env = process.env.APP_MODULE
Vue.config.productionTip = false
// if product env, remove the basic console method
if (process.env.NODE_ENV === 'production') {
  window.console.log = () => {}
  window.console.error = () => {}
  window.console.info = () => {}
  window.console.warning = () => {}
}
// init
export default new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App },
})
