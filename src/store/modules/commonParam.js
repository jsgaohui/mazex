const namespaced = true

 // 从下一页面返回到上一页面时的参数传递公共store
const state = {
  paramAddress: null, // 需要可以新增其他参数,此参数HtEtcAddress页面用到
  paramAvailable: null, // 提币跳转后返回到上一页面更新可用余额值
}

const mutations = {
  SETCOMMONPARAM(state, data) {
    Object.assign(state, data)
  },
}

const actions = {
  setCommonParam({ commit }, data) {
    commit('SETCOMMONPARAM', data)
  },
}

export default { namespaced, state, mutations, actions }
