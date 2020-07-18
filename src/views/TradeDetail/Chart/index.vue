<template lang="html">
  <div class="container">
    <div class="lay box box-item" v-if="!chartReady">
      <Spiner/>
    </div>
    <!-- <div class="half-x-line"/> -->
    <div class="setter">
      <ul class="box">
        <li class="box box-item box-col-flex" :class="{'color-right': activeRes === key}" v-for="(item, key) in buttons" :key="key" @click="setResolution(item, key)">
          {{ $t(`chart.${item.label}`) }}
        </li>
      </ul>
      <ul class="box">
        <li class="box box-item" v-for="(item, key) in childButtons" :key="key" @click="setChilsResolution(item, 5)">
          {{ $t(`chart.${item.label}`) }}
        </li>
      </ul>
    </div>
    <!-- <div class="half-x-line"/> -->
    <div id="tv_chart_container"/>
  </div>
</template>
<script>
// import a from './charting_library.min'
import Datafeeds from './datafeed'
import utils from './utils'
import Spiner from '@/components/Spiner'
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  name: 'Chart',
  components: {
    Spiner,
  },
  data() {
    return {
      chart: null,
      chartReady: false,
      activeRes: 3,
      buttons: [
        {
          label: 'h',
          resolution: '1',
          chartType: 3,
        },
        {
          label: '1min',
          resolution: '1',
          chartType: 1,
        },
        {
          label: '5min',
          resolution: '5',
          chartType: 1,
        },
        {
          label: '15min',
          resolution: '15',
          chartType: 1,
        },
        {
          label: '30min',
          resolution: '30',
          chartType: 1,
        },
        {
          label: 'more',
          hander: () => {
            if (this.childButtons.length > 0) {
              this.childButtons = []
              return
            }
            this.childButtons = [
              {
                label: '1hour',
                resolution: '60',
                chartType: 1,
              },
              {
                label: '1day',
                resolution: '1D',
                chartType: 1,
              },
              {
                label: '1week',
                resolution: '1W',
                chartType: 1,
              },
              {
                label: '1mon',
                resolution: '1M',
                chartType: 1,
              },
            ]
          },
        },
      ],
      childButtons: [],
    }
  },
  props: {
    tradeInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('quotation', ['lastPrices']),
    symbolInfo() {
      return {
        name: this.tradeInfo.symbol,
        ticker: this.tradeInfo.symbol,
        description: '',
        session: '24x7',
        supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
        minmov: 1,
        minmov2: 0,
        pricescale: Math.pow(10, this.tradeInfo.tradePriceDigit || this.getTradeDigit() || 4),
        has_intraday: true,
        has_daily: true,
        has_empty_bars: false,
        has_seconds: false,
        volume_precision: 4,
        data_status: 'streaming',
        has_weekly_and_monthly: true,
        timezone: 'Asia/Seoul',
        datafeed: null,
      }
    },
  },
  watch: {},
  methods: {
    getTradeDigit() {
      return _.get(this.lastPrices, `[${this.tradeInfo.symbol}].tradePriceDigit`)
    },
    initChart() {
      this.$nextTick(() => {
        this.datafeed = new Datafeeds.UDFCompatibleDatafeed(this.symbolInfo)
        let params = {
          resolution: '15',
          datafeeds: this.datafeed,
          symbolInfo: this.symbolInfo,
        }
        const { TradingView } = require('./charting_library.min')
        const Widget = TradingView.widget
        let chart = new Widget(utils.datafeedConfig(params))
        chart.onChartReady(() => {
          utils.chartReady(chart)
          this.$Helper.emitAction('loading', { show: false })
          this.chartReady = true
          // setTimeout(() => chartHander.setResolution('60'), 3000)
        })
        this.datafeed.subcribeKline(15)
        this.chart = chart
      })
    },
    removeChart() {
      if (this.chart) {
        this.chart.remove()
        this.chart = null
      }
    },
    setResolution({chartType, resolution, hander}, key, isChild = false) {
      if (hander) {
        hander()
        return
      }
      if (this.chart && this.chartReady) {
        let chartHander = this.chart.chart()
        if (resolution) chartHander.setResolution(resolution)
        if (chartType) chartHander.setChartType(chartType)
        if (!isChild) this.buttons.splice(5, 1, { ...this.buttons[5], label: 'more' })
        this.activeRes = key
        this.datafeed.subcribeKline(resolution)
      }
    },
    setChilsResolution(item, key) {
      this.setResolution(item, key, true)
      this.buttons.splice(5, 1, { ...this.buttons[5], label: item.label })
      this.childButtons = []
    },
  },
  created() {
    this.getTradeDigit()
  },
  mounted() {
    this.removeChart()
    this.initChart()
  },
  activated() {
    if (this.chart && this.chartReady) {
      let chartHander = this.chart.chart()
      if (this.tradeInfo.symbol) {
        chartHander.setSymbol(this.tradeInfo.symbol, () => {
        })
      }
    }
  },
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  // .selected{
  //   color: red;
  // }
  // .half-x-line{
  //   background: #eee;
  //   transform-origin: 0 0;
  //   transform: scale(1, 0.4);
  //   -webkit-transform-origin: 0 0;
  //   -webkit-transform: scale(1, 0.4);
  //   z-index: 2;
  //   position: relative;
  // }
  .container{
    background: #fff;
    position: relative;
    // background: #1d1d29;
    // left: -2px;
    // right: -2px;
    width: 100%;
    .setter{
      background: #fff;
      position: relative;
      z-index: 10;
      bottom: -2px;
      width: 100%;
      background: #f8f8f8;
      // border-top: 1px solid #eee;
      // border-bottom: 1px solid #eee;
      ul{
        li{
          height: 9.4vw;
          font-size: 3.4vw;
          // background: white;
          color: #888;
          width: 16.67vw;
          transition: all 0.4s;
          border-bottom: 1px solid transparent;
          &.color-right{
            color: #222;
            border-bottom: 1px solid #333;
          }
        }
      }
    }
    #tv_chart_container{
      z-index: 1;
      position: relative;
      // border-left: 1px solid #c8c9cc;
      // border-right: 1px solid #c8c9cc;
    }
    .lay{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      z-index: 10000000;
    }
  }
</style>
