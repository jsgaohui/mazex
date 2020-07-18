// 此处定义接收quotation的mixin方法和属性
import {mapState} from 'vuex'
import { reloadQuotation, reloadRate } from '@/lib/quotation'
import _ from 'lodash'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('quotation', ['availableList', 'lastPrices', 'rateList', 'symbolMap', 'currencyRate', 'sellteMarket']),
    ...mapState('setting', ['language']),
    rate() {
      // console.log(_.get(this.rateList.filter(item => item.currencyName === `USD${this.currencyRate}`), '[0].currencyRate'))
      // console.log(_.get(this.rateList.filter(item => item.currencyName === `USD${this.currencyRate}`), '[0].currencyRate') || 0)
      return _.get(this.rateList.filter(item => item.currencyName === `USD${this.currencyRate}`), `[0].rateMap.${this.sellteMarket}`) || 0
    },
    // 总的glodt的数量
    sumGold() {
      let sumGold = 0
      let lastPrices = this.lastPrices
      if (!this.$Helper.isType(lastPrices, {})) lastPrices = {}
      this.availableList.map(item => {
        // find out this kind of currency' rate
        let rateObj = lastPrices[`${item.dcCode}/${this.sellteMarket}`]
        if (rateObj) {
          sumGold += rateObj.lastPrice * item.totolAmount
        } else {
          rateObj = lastPrices[`${this.sellteMarket}/${item.dcCode}`]
          if (rateObj) {
            sumGold += (1 / rateObj.lastPrice) * item.totolAmount
          }
        }
        if (item.dcCode === this.sellteMarket) sumGold += item.totolAmount
      })
      return sumGold
    },
    // 换算成货币的数量
    sumMoney() {
      return this.sumGold * this.rate
    },
    // 韩语和其他语言不同的颜色定义
    rightColor() {
      if (this.language === 'ko') return '#d60000'
      return '#03C087'
    },
    errorColor() {
      if (this.language === 'ko') return '#0051c7'
      return '#F55858'
    },
  },
  methods: {
    // 监听socket
    listen() {
      reloadQuotation()
      reloadRate()
      // 处理收到的行情信息
      this.$Helper.onAction('reloadQuotation', ({list}) => {
        if (list.lastPrice < 0 || !this.lastPrices) return
        let lastPrices = this.lastPrices
        lastPrices[list.symbol] = { ...list, oldStatus: lastPrices[list.symbol] }
        // 发送给store
        let symbolMap = this.symbolMap
        this.$store.dispatch('quotation/refreshData', { lastPrices, symbolMap })
      })
      // 监听汇率变化
      this.$Helper.onAction('reloadRate', ({list}) => {
        this.$store.dispatch('quotation/refreshData', { rateList: list })
      })
    },
  },
  created() {
    if (['Market', 'Home'].indexOf(this.$route.name) === -1) this.listen()
  },
  activated() {
    this.listen()
  },
}
