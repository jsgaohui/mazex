// 某些公用的计算方法
import {mapState} from 'vuex'
import _ from 'lodash'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('quotation', ['availableList', 'lastPrices', 'rateList', 'symbolMap', 'currencyRate', 'sellteMarket']),
    // 返回汇率
    rate() {
      let oldRate = _.get(this.rateList.filter(item => item.currencyName === `USD${this.currencyRate}`), '[0].currencyRate')
      let newRate = _.get(this.rateList.filter(item => item.currencyName === `USD${this.currencyRate}`), `[0].rateMap.${this.sellteMarket}`)
      return oldRate || newRate || 0
    },
  },
  methods: {
    // 计算当前货币在汇率换算之后的价格
    caculateRateNum(item) {
      let { lastPrice, symbol } = item
      let marketName = symbol.split('/')[1]
      let rate = this.rate
      if (marketName !== this.sellteMarket) {
        // get the symbol to sellteMarket' rate, then count the final rate
        rate = rate * (_.get(this.lastPrices, `[${marketName}/${this.sellteMarket}].lastPrice`) || 0)
      }
      return lastPrice * rate
    },
    // 获取该币种的保留小数
    getTradePriceDigit(name) {
      return _.get(this, `lastPrices[${name}].tradePriceDigit`)
    },
    // 获取lastPrices里对应货币的信息
    getTradeInfoByName(symbol) {   // get the symbol's info from lastprices
      let [ symbolName, marketName ] = symbol.split('/')
      marketName = marketName || this.sellteMarket
      return this.lastPrices[`${symbolName}/${marketName}`] || {}
    },
    // 获取lastPrices里对应货币的信息
    geLastPriceByName(symbol) {   // get the symbol's info from lastprices
      let [ symbolName, marketName ] = symbol.split('/')
      marketName = marketName || this.sellteMarket
      return this.lastPrices[`${marketName}/${symbolName}`] || {}
    },
    // 从lastPrice中获取该货币的最新价格
    caculatePrice(marketName) {   // get the symbol's price from lastprices
      return this.getTradeInfoByName(marketName).lastPrice || 1 / this.geLastPriceByName(marketName).lastPrice || 1
    },
  },
}
