import Helper from '../../lib'
import _ from 'lodash'
const namespaced = true
const emptyState = {
  language: 'zh',
}

const state = { ...emptyState, ..._.cloneDeep(Helper.getCache('setting')) }

const mutations = {
  SETDATA(state, data) {
    Object.assign(state, data)
  },
}

const actions = {
  setData({ commit }, data) {
    Helper.setCache('setting', { ...state, ...data })  // save to cache
    commit('SETDATA', data)
  },
}

export default { namespaced, state, mutations, actions }
