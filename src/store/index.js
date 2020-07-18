import Vue from 'vue'
import Vuex from 'vuex'
import basic from './modules/basic'
import setting from './modules/setting'
import layermodel from './modules/layermodel'
import quotation from './modules/quotation'
import commonParam from './modules/commonParam'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  modules: {
    basic,
    setting,
    layermodel,
    quotation,
    commonParam,
  },
  strict: debug,
})

if (module.hot) {
  module.hot.accept(
    [
      './modules/basic',
      './modules/setting',
      './modules/layermodel',
      './modules/quotation',
      './modules/commonParam',
    ],
    () => store.hotUpdate({
      modules: {
        basic: require('./modules/basic').default,
        setting: require('./modules/setting').default,
        layermodel: require('./modules/layermodel').default,
        quotation: require('./modules/quotation').default,
        commonParam: require('./modules/commonParam').default,
      },
    }))
}

export default store
