<template>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'Quotation',
  components: {},
  data() {
    return {
      rateList: [], // 所有法币和市场币的汇率的集合  结构[{currencyName:'USDCNY': rateMap:{ 'GOLDT':'1','BTC','2'}]
      lastPrices: [], // 所有交易对的最新价集合
      currencySymbol: '', // 當前法币
      sellteMarket: '', // 基准市场
      symbolParam: null, // 传进来的参数
    }
  },
  computed: {
    // 结算市场和法币的汇率 例如GoldT/CNY的比例
    exchangeRate() {
      let $this = this
      let exchangeRate = 0.0
      let symbol = this.symbolParam ? this.symbolParam : this.currencySymbol
      // 遍历map
      // 结构[{currencyName:'USDCNY': rateMap:{ 'GOLDT':'1','BTC','2'}]
      // 返回例如GoldT/CNY的比例  GLOdT = $this.sellMarket;CNY = $this.entrustForm.currencySymbol
      _.map(this.rateList, rate => {
        if (rate.currencyName === 'USD' + symbol) {
          exchangeRate = rate.rateMap[$this.sellMarket]
          return
        }
      })
      return exchangeRate
    },
  },
  watch: {},
  methods: {
    // 获取行情信息
    getMarketTrade() {
      this.$Helper
        .ajax({
          url: '/app/common/getQuotation.api',
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.rateList = _.get(data, 'rateList')
            this.lastPrices = _.get(data, 'lastPrices')
            this.currencySymbol = _.get(data, 'currency')
            this.sellMarket = _.get(data, 'sellMarket')
          }
        })
    },
    setSellMarket(sellMarket) {
      this.sellMarket = sellMarket
    },
    setCurrency(currency) {
      this.currencySymbol = currency
      this.symbolParam = currency
    },
    setRateLit(rateList) {
      this.rateList = rateList
    },
    getCurrency() {
      return this.currencySymbol
    },
    getSellMarket() {
      return this.sellMarket
    },
    ifReady() {
      return this.lastPrices && this.sellMarket
    },
    // 获取交易对的最新信息
    getLastPriceByDcCode(dcCode) {
      return this.lastPrices[dcCode + '/' + this.sellMarket]
    },
    // 获取交易对的比例  例如BTC/GOLDT 的值
    getSymbolPrice(dcCode) {
      if (dcCode === this.sellMarket) {
        return 1
      }
      let lastPrice = this.getLastPriceByDcCode(dcCode)
      if (lastPrice) {
        return lastPrice.lastPrice
      }
      return 0
    },
    // 实时价格
    getRealTimePrice(dcCode) {
      let lastPrice = this.getLastPriceByDcCode(dcCode)
      // 假设没有usdt/usdt goldt/goldt 交易对
      // 如果代币代码和基准市场一样
      if (!lastPrice && dcCode === this.sellMarket) {
        return this.exchangeRate
      }
      let price = 0
      if (!lastPrice) {
        // 没有交易对  取反
        lastPrice = this.lastPrices[this.sellMarket + '/' + dcCode]
        if (lastPrice && lastPrice.lastPrice) {
          let temp = 1 / lastPrice.lastPrice
          price = Number.parseFloat(this.exchangeRate * temp).toFixed(2)
        }
      } else {
        price = lastPrice && this.exchangeRate ? Number.parseFloat(lastPrice.lastPrice * this.exchangeRate).toFixed(2) : 0
      }

      return price
    },
    // 涨跌幅
    getUpsAndDowns(dcCode) {
      let lastPrice = this.getLastPriceByDcCode(dcCode)
      if (lastPrice == null) {
        return 0
      }
      let roseNum = 0
      if (lastPrice.lastPrice > 0) {
        roseNum = Number((((lastPrice.lastPrice - lastPrice.openPrice) / lastPrice.openPrice) * 100)).toFixed(2)
      }
      return roseNum
    },
    // 最高价
    getHighestPrice(dcCode) {
      let lastPrice = this.getLastPriceByDcCode(dcCode)
      // if (lastPrice == null) {
      //   return 0
      // }
      let price = 0
      if (!lastPrice) {
        // 没有交易对  取反
        lastPrice = this.lastPrices[this.sellMarket + '/' + dcCode]
        if (lastPrice && lastPrice.highestPrice) {
          // lastPrice.highestPrice = 1 / lastPrice.highestPrice
          let temp = 1 / lastPrice.highestPrice
          price = Number.parseFloat(temp * this.exchangeRate).toFixed(2)
        }
      } else {
        price = lastPrice && this.exchangeRate ? Number.parseFloat(lastPrice.highestPrice * this.exchangeRate).toFixed(2) : 0
      }
      return price
    },
    // 最低价
    getLowestPrice(dcCode) {
      let lastPrice = this.getLastPriceByDcCode(dcCode)
      // if (lastPrice == null) {
      //   return 0
      // }
      let price = 0
      if (!lastPrice) {
        // 没有交易对  取反
        lastPrice = this.lastPrices[this.sellMarket + '/' + dcCode]
        if (lastPrice && lastPrice.lowestPrice) {
          //  lastPrice.lowestPrice = 1 / lastPrice.lowestPrice
          let temp = 1 / lastPrice.lowestPrice
          price = Number.parseFloat(temp * this.exchangeRate).toFixed(2)
        }
      } else {
        price = lastPrice && this.exchangeRate ? Number.parseFloat(lastPrice.lowestPrice * this.exchangeRate).toFixed(2) : 0
      }
      return price
    },
    /**
     *   获取总资产
     * @param assert
     * @param fb  true 换算成法币 false 换算成基准市场价值例如等于多少goldt
     * @returns {string}
     */
    getTotalAsset(assert, fb = true) {
      let total = 0.00
      let $this = this
      if (assert && assert.length > 0) {
        _.map(assert, item => {
          if (Number.parseFloat(item.availableAmount) <= 0) {
            return
          }
          if (fb) {
            total = total + $this.getRealTimePrice(item.dcCode) * item.availableAmount
          } else {
            total = total + $this.getSymbolPrice(item.dcCode) * item.availableAmount
          }
        })
      }
      return this.$Helper.format(total, 2) + ' ' + (fb ? this.currencySymbol : this.sellMarket)
    },
  },
  created() {
    this.getMarketTrade()
  },
  mounted() {
  },
}
</script>
