// 行情的全局数据
import _ from 'lodash'
const namespaced = true
// 这里的数据结构对应appInitQuotation接口的返回
const state = {
  availableList: [],   // user's avilable symbol list
  lastPrices: {},     // the newest symbol's info(like price)
  rateList: [],     // the newest symbol's price to cny or the orthers
  symbolMap: [],   // all of the symbol
  currencyRate: null,   // currencyRate
  sellteMarket: null,
}

const mutations = {
  REFREASHDATA(state, data) {
    Object.assign(state, data)
  },
}

const actions = {
  //  调用这个方法去更新整体数据
  refreshData({ commit }, data) {
    // 动态计算rose数据，合并lastPreices里
    if (data.lastPrices) {
      let lastPrices = data.lastPrices
      _.map(lastPrices, (item, key) => {
        lastPrices[key].rose = ((100 * (item.lastPrice - item.openPrice) / item.openPrice) || 0).toFixed(2)
      })
      data.lastPrices = lastPrices
    }
    // 从symbolMap里面拿该币种的保留小数位数，合并到lastprice数据中
    if (data.symbolMap) {
      let symbolMap = _.flatten(_.map(data.symbolMap, item => item))
      let lastPrices = data.lastPrices
      _.map(lastPrices, (item, key) => {
        let tradePriceDigit = _.get(symbolMap.filter(s => s.symbol === key), '[0].tradePriceDigit')
        let minTradeDigit = _.get(symbolMap.filter(s => s.symbol === key), '[0].minTradeDigit')
        lastPrices[item.symbol] = { ...item, tradePriceDigit, minTradeDigit }
      })
      data.lastPrices = lastPrices
    }
    commit('REFREASHDATA', data)
  },
}

export default { namespaced, state, mutations, actions }
