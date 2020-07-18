import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import Helper from '../lib'
Vue.use(VueI18n)
export default new VueI18n({
  locale: 'zh',  // init language as zh
  messages: {
    zh: require('./zh'),
    en: require('./en'),
    ko: require('./ko'),
    in: require('./in'),
  },
})

