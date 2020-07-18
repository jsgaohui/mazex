import Cache from '@/lib/cache'
import _ from 'lodash'
const namespaced = true
// 数据结构与登录后接口返的一致
const emptyState = {
  countryCode: null,
  countryName: null,
  email: null,
  firstName: null,
  idCard: null,
  mobile: null,
  realName: null,
  uid: null,
  username: null,
  visitCode: null,
  token: null,
  openPhoneValid: null,
  openEmailValid: null,
  isExitTradePwd: null,
  isMerchant: null, // 是否商家
  isValid: null, // // 0未上传，1待认证，2已认证
  id: null,
}
// 初始化页面时从userInfo拿到用户数据
// 和emptyState合并得到最新数据
const state = { ...emptyState, ..._.cloneDeep(Cache.getCache('userInfo')) }

const mutations = {
  SETLOGINDATA(state, data) {
    Object.assign(state, data)
  },
  CLEARLOGINDATA(state, data) {
    Object.assign(state, _.cloneDeep(emptyState))
  },
}

const actions = {
  setLoginData({ commit }, data) {
    let { dontSave } = data
    if (!dontSave) Cache.setCache('userInfo', { ...state, ...data })  // save to cache 存储到localstorage
    commit('SETLOGINDATA', data)
    // 存储用户信息，使设备可以启用锁屏
    if (state.uid) {
      if (_.get(window, 'api.setData')) {
        window.api.setData('uid', state.uid) // Android
      } else if (_.get(window, 'webkit') && _.get(window, 'webkit.messageHandlers') && _.get(window, 'webkit.messageHandlers')) {
        window.webkit.messageHandlers.setData.postMessage({uid: state.uid}) // iOS
      }
    }
    // 存储用户信息，使设备可以启用锁屏
  },
  clearLoginData({ commit }) {
    Cache.setCache('userInfo', emptyState)     // removeCache
    commit('CLEARLOGINDATA')
    // 清除用户信息，使设备不启用锁屏
    if (_.get(window, 'api.setData')) {
      window.api.setData('uid', '') // Android
    } else if (_.get(window, 'webkit') && _.get(window, 'webkit.messageHandlers') && _.get(window, 'webkit.messageHandlers')) {
      window.webkit.messageHandlers.setData.postMessage({uid: ''}) // iOS
    }
  },
}

export default { namespaced, state, mutations, actions }
