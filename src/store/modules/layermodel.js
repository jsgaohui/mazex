// component/ILayerModel组件的store
// 整个tree可以有多个元素
// 越后面的node的层级会越高
// 多组件复用的layer model组件，同一个组件可以多次层叠
// 调用pop()方法关闭最上面的层级
// push()新增一个层级
// 详情查看component/ILayerModel组件
import Helper from '../../lib'
import _ from 'lodash'
const namespaced = true
// 数据结构像这样
// {
//   type: 'up',    // type有right left up bottom
//   name: 'Share',  // IlayerModel/child 下的子组件名
// },
const state = {
  tree: [],
}

const mutations = {
  PUSH(state, data) {
    // 参数类型判断
    if (Helper.isType(data, {})) {
      state.tree.push(_.cloneDeep(data))
    } else if (Helper.isType(data, [])) {
      state.tree = state.tree.concat(_.cloneDeep(data))
    } else {
      state.tree.push(_.cloneDeep({
        type: 'right',
        name: data,
        config: {},
        param: {},
      }))
    }
  },
  REPLACE(state, data) {
    // 参数类型判断
    if (Helper.isType(data, {})) {
      state.tree = [_.cloneDeep(data)]
    } else if (Helper.isType(data, [])) {
      state.tree = [].concat(data)
    } else {
      state.tree = [_.cloneDeep({
        type: 'right',
        name: data,
        config: {},
        param: {},
      })]
    }
  },
  POP(state) {
    state.tree.pop()
  },
  CLOSE(state) {
    state.tree = []
  },
}

const actions = {
  push({commit}, data) {
    commit('PUSH', data)
  },
  replace({commit}, data) {
    commit('REPLACE', data)
  },
  pop({commit}) {
    commit('POP')
  },
  close({commit}) {
    commit('CLOSE')
  },
}

export default {
  namespaced,
  state,
  mutations,
  actions,
}
