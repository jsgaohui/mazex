<template lang="pug">
  .trade-detail.box.box-row
    .head.box.box-no-shrink
      .name.box.box-y-center.box-col-flex(@click="$Helper.jumpBack")
        .left
          i.iconfont &#xe603;
          // span {{ query.symbol }}
        .center.box.box-item.box-col-flex {{ query.symbol }}
        .right
    // .half-x-line
    ScrollTopMenu(:list="topList" :activeKey="topActive" @change="changeTopMenu($event)")
    .content.box-row-flex.overflow-y.mescroll.box.box-row
      .inner(v-show="topActive===0")
        .info.box
          .left
            h1.error-color {{ $Helper.numFixedLength(tradeInfo.lastPrice, tradeInfo.tradePriceDigit) }}
            p(v-if="tradeInfo.symbol") ≈ {{ $Helper.formatAmount(caculateRateNum(tradeInfo)) }} {{ currencyRate }}
              span(:class="{'right-color': tradeInfo.rose >= 0, 'error-color': tradeInfo.rose < 0}") {{ tradeInfo.rose }}%
          .right.box-col-flex
            .box.box-y-center
              .title {{ $t('chart.high') }}
              .num.box-col-flex.box.box-x-right {{ $Helper.numFixedLength(tradeInfo.highestPrice, tradeInfo.tradePriceDigit) }}
            .box.box-y-center
              .title {{ $t('chart.low') }}
              .num.box-col-flex.box.box-x-right {{ $Helper.numFixedLength(tradeInfo.lowestPrice, tradeInfo.tradePriceDigit) }}
            .box.box-y-center
              .title {{ $t('chart.24_hour_volume') }}
              .num.box-col-flex.box.box-x-right {{ $Helper.numFixedLength(tradeInfo.totolVolume, 2, 20) }}
        Chart(:tradeInfo="tradeInfo" v-if="tradeInfo.symbol")
        .empty-status.box.box-item(v-else)
          Spiner(color="#333")
      .inner(v-show="topActive===1")
      .inner(v-show="topActive===2")
      // .top-select.box
      //   .box-col-flex.box.box-item(:class="{active: activeItem===0}" @click="activeItem=0") {{ $t('chart.deal') }}
      //   .box-col-flex.box.box-item(:class="{active: activeItem===1}" @click="activeItem=1") {{ $t('chart.abstract') }}
      // .half-x-line
      // .table(v-if="activeItem===0")
      //   Itable(:list="tradeList.slice(0, 50)" :showList="showList" :baseFontSize="3.8" :baseRowHeight="12" )
      // .detail(v-else)
      //   .name {{ digitalSymbol.dcName }}
      //   .code {{ digitalSymbol.dcCode }}
      //   p.time {{ $t('chart.issueTime') }}: {{ digitalSymbol.issueTime }}
      //   p.issueVolume {{ $t('chart.issueNum') }}: {{ digitalSymbol.issueNum }}{{ $t('chart.w') }}
      //   p.circulationNum {{ $t('chart.circulationNum') }}: {{ digitalSymbol.circulationNum }}{{ $t('chart.w') }}
      //   p.whitePaperUrl {{ $t('chart.whitePaperUrl') }}:
      //     a {{ digitalSymbol.whitePaperUrl }}
      //   p.basicUrl {{ $t('chart.basicUrl') }}:
      //     a {{ digitalSymbol.basicUrl }}
      //   p.blockUrl {{ $t('chart.blockUrl') }}:
      //     a {{ digitalSymbol.blockUrl }}
      //   p.summary(v-html="digitalSymbol.summary")
    .bottom.box.box-y-center.box-no-shrink
      .btn.box.box-item.right-bg.box-col-flex(@click="marketChoseTrade(1)") {{ $t('basic.buy') }}
      .btn.box.box-item.error-bg.box-col-flex(@click="marketChoseTrade(2)") {{ $t('basic.sell') }}
      // .chose.box-col-flex
      //   .box.box-item.i-con
      //     i.iconfont &#xe602;
      //   .box.box-item 添加自选
</template>
<script>
import Component from '@/components'
import Chart from './Chart/index.vue'
import _ from 'lodash'
import basicMixin from '@/mixin/basic'
import caculateMixin from '@/mixin/caculate'
export default {
  name: 'TradeDetail',
  components: {
    ...Component,
    Chart,
  },
  mixins: [basicMixin, caculateMixin],
  data() {
    return {
      topList: [
        {
          text: '行情',
        },
        {
          text: '成交',
        },
        {
          text: '简介',
        },
      ],
      topActive: 0,
      activeItem: 0,
      switchKey: 0,
      number: '1.6949',
      list: [
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
        {
          time: '16:22:14',
          type: 1,
          price: 0.1314221,
          num: 1413.21,
        },
      ],
      showList: {
        tradeTime: {
          text: this.$t('basic.time'),
          align: 'left',
        },
        direction: {
          text: this.$t('basic.direction'),
          align: 'left',
          caculate: data => {
            if (data === 1) return this.$t('basic.buy')
            return this.$t('basic.sell')
          },
          color: data => {
            if (data === 1) return this.rightColor
            return this.errorColor
          },
        },
        price: {
          text: this.$t('basic.price'),
          align: 'left',
        },
        volume: {
          text: this.$t('basic.num'),
          align: 'right',
        },
      },
      digitalSymbol: {},
      tradeList: [],
      query: {},
    }
  },
  computed: {
    tradeInfo() {
      return _.map(this.lastPrices, item => item).filter(item => item.symbol === this.query.symbol)[0] || this.query
    },
  },
  watch: {
    activeKey(newVal, oldVal) {
      this.transitionName = newVal > oldVal ? 'slide-left' : 'slide-right'
    },
  },
  methods: {
    marketChoseTrade(direction) {
      let [symbolName, marketName] = this.tradeInfo.symbol.split('/')
      this.$Helper.jumpPage({name: 'Transaction', params: { symbol: { symbolName, marketName }, direction }}, this)
    },
    changeTopMenu(key) {
      this.topActive = key
    },
    initDigitalSymbol() {
      return this.$Helper.ajax({
        url: `/app/trade/appTradeDetail.api?symbol=${this.query.symbol}`,
      })
      .then(
        data => {
          this.digitalSymbol = _.get(data, 'data.digitalSymbol') || {}
          this.tradeList = _.map(_.get(data, 'data.tradeList') || [], item => ({
            ...item,
            price: this.$Helper.numFixedLength(item.price, this.tradeInfo.tradePriceDigit),
            volume: this.$Helper.numFixedLength(item.volume, this.tradeInfo.minTradeDigit),
          }))
        },
      )
    },
    initAppQuotation() {
      return this.$Helper.ajax({
        url: '/app/trade/appQuotation.api',
        params: {},
      })
      .then(
        ({data}) => {
          if (!data) return
          let { resultMap, lastPrices, currencyRate, rateList, sellteMarket } = data
          // update the store
          this.$store.dispatch('quotation/refreshData', { rateList, lastPrices, symbolMap: resultMap, currencyRate, sellteMarket })
        },
        () => {
          this.errorStatus = 'error'
        },
      )
    },
  },
  created() {
    this.$Helper.emitAction('loading', { show: true })
    if (this.$route.params.symbol) {
      this.query = this.$route.params
      // save to cache
      this.$Helper.setCache('TradeDetailCache', this.query)
    } else {
      this.query = this.$Helper.getCache('TradeDetailCache')
    }
    this.initAppQuotation().then(() => this.initDigitalSymbol())
    // listen
    this.$Helper.onAction('reloadQuotation', ({list}) => {
      if (list.lastPrice < 0 || !this.lastPrices) return
      if (list.symbol === this.query.symbol) {
        // get the old status
        let totolVolume = this.getTradeInfoByName(list.symbol).oldStatus.totolVolume
        if (list.lastVolume && list.updateTime && list.lastPrice && list.totolVolume > totolVolume) { // when totalVolume changed, unshift the item
          this.tradeList.unshift({ ...list, tradeTime: list.updateTime, direction: list.orderDir, price: list.lastPrice, volume: list.lastVolume })
        }
      }
    })
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .trade-detail {
    background: white;
    .head{
      // height: 12vw;
      background: white;
      padding: 1vw 2vw;
      padding-top: 2.5vw;
      .name{
        font-size: 4.6vw;
        font-weight: 600;
        color: @icon-color;
        &>div{
          width: 10%;
        }
        .center{
          color: #333;
        }
        i{
          font-size: 5vw;
          margin-right: 2vw;
          color: #666;
        }
      }
      .icon{
        i{
          font-size: 5vw;
          margin: 0 2.5vw;
        }
      }
    }
    .content{
      padding: 0;
      .info{
        padding:2vw 4vw;
        .left{
          width: 60%;
          h1{
            font-size: 7vw;
            font-weight: 600;
            padding: 0;
          }
          p{
            color: #aaa;
            margin-top: 4.5vw;
            font-size: 3.5vw;
            span{
              margin-left: 2vw;
            }
          }
        }
        .right{
          font-size: 3.8vw;
          &>.box{
            margin-bottom: 1.4vw;
          }
          .title{
            color: #888;
            font-size: 3.5vw;
          }
          .num{
            color: #222;
            font-size: 3.8vw;
          }
        }
      }
      .top-select{
        margin-top: 2vw;
        background: white;
        .box{
          height: 12vw;
          border-bottom: 2px solid transparent;
          font-size: 4vw;
          font-weight: 400;
          transition: all 400ms;
          &.active{
            color: @active-deep;
            border-color: @active-deep;
          }
        }
      }
      .table{
        background: white;
        padding: 0 3vw;
        padding-top: 2vw;
      }
      .detail{
        min-height: 60vh;
        background: white;
        padding: 3vw;
        .name{
          font-weight: 600;
          font-size: 5.6vw;
        }
        .code{
          margin-top: 2vw;
          margin-bottom: 10vw;
        }
        p{
         font-size: 3.6vw;
         margin-top: 2vw;
         word-break: break-all;
         line-height: 1.6;
         a{
           color: @icon-color;
           font-size: 3.4vw;
         }
        }
      }
    }
    .empty-status{
      height: 420px;
    }
    .bottom{
      height: 13vw;
      background: white;
      box-shadow: 1px 0px 7px #ddd;
      z-index: 1;
      padding: 0 3vw;
      .btn{
        height: 80%;
        width: 31vw;
        font-size: 4vw;
        font-weight: 500;
        color: white;
        margin-right: 3vw;
      }
      .chose{
        font-size: 3.4vw;
        color: @active-deep;
        .i-con{
          i{
            color: @active-deep;
            font-size: 5vw;
          }
        }
      }
    }
  }
</style>

