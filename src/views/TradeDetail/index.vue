<template lang="pug">
  .trade-detail.box.box-row
    .head.box.box-no-shrink
      .name.box.box-y-center.box-col-flex(@click="$Helper.jumpBack")
        i.iconfont &#xe603;
        span {{ query.symbol }}
    .half-x-line
    .content.box-row-flex.overflow-y.mescroll
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
      .half-x-line
      .box
        .menu-nav.box-col-flex.box-y-center
          ul
            li(class="active" @click="changeItem(0)") {{ $t('transaction.chat') }}
            li(@click="changeItem(1)") {{ $t('transaction.history') }}
            li(@click="changeItem(2)") {{ $t('transaction.securityDetail') }}
            li(@click="changeItem(3)") {{ $t('transaction.companyProfile') }}
            li(@click="changeItem(4)") {{ $t('transaction.financials') }}
            li(@click="changeItem(5)") {{ $t('transaction.news') }}
            li(@click="changeItem(6)") {{ $t('transaction.vedio') }}
      //市场行情
      Chart(:tradeInfo="tradeInfo" v-if="tradeInfo.symbol &&activeItem===0")
      Itable(style="padding:3vw;" v-if="tradeInfo.symbol &&activeItem===0" :list="tradeList.slice(0, 50)" :showList="showList" :baseFontSize="3.8" :baseRowHeight="12" )
      <!--.empty-status.box.box-item(v-else)-->
      <!--Spiner(color="#333")-->
      //历史记录
      .table#transcation_con(v-if="activeItem===1")
        <div class="list-con">
        <div class="list"  v-for="(item, itemKey) in tslas">
        <div  class="tr td box box-y-center">
        <div  class="price">Data</div>
        <div  class="num">Open</div>
        <div  class="said box box-col-flex box-x-right">High</div>
        </div>
        <div  class="td box box-y-center">
        <div  class="price">{{item.showtime}}</div>
        <div  class="num">{{item.open}}</div>
        <div  class="said box box-col-flex box-x-right">{{item.high}}</div>
        </div>
        <div  class="tr td box box-y-center">
        <div  class="price">Low</div>
        <div  class="num">Close</div>
        <div  class="said box box-col-flex box-x-right">Volume</div>
        </div>
        <div  class="td box box-y-center">
        <div  class="price">{{item.low}}</div>
        <div  class="num">{{item.close}}</div>
        <div  class="said box box-col-flex box-x-right">{{item.volume}}</div>
        </div>
        <div class="half-x-line"></div>
        </div>
        </div>
      //币种简介
      .detail(v-if="activeItem===2")
        p.time {{ $t('Market Cap') }}:
          span 45,690,014,956
        p.issueVolume {{ $t('Authorized Shares') }}:
          span Not Available
        p.circulationNum {{ $t('Outstanding Shares') }}:
          span 172,721,487
        p.whitePaperUrl {{ $t('Restricted') }}:
          span Not Available
        p.basicUrl {{ $t('Unrestricted') }}:
          span Not Available
        p.blockUrl {{ $t('Held at DTC') }}:
          span Not Available
        p.blockUrl {{ $t('Float') }}:
          span Not Available
        p.blockUrl {{ $t('Par Value') }}:
          span Not Available
      .summary(v-if="activeItem===3")
        p(v-html="digitalSymbol.summary")
      .table#transcation_con(v-if="activeItem===4")
        <div class="list-con">
        <div class="list"  v-for="(item, itemKey) in filings">
        <div  class="tr td box box-y-center">
        <div  class="price">FORM TYPE</div>
        <div  class="num">RECEIVED</div>
        <div  class="said box box-col-flex box-x-right">PERIOD END DATE</div>
        </div>
        <div  class="td box box-y-center">
        <div  class="price">{{item.formType}}</div>
        <div  class="num">{{item.receivedDate}}</div>
        <div  class="said box box-col-flex box-x-right">{{item.periodEndDate}}</div>
        </div>
        <div class="half-x-line"></div>
        </div>
        </div>
      .notice(v-if="activeItem===5" class="mescroll overflow-y" id="noticeScroll")
        ul
          li(class="box box-space-bettwen" v-for="(item, key) in noticeList" :key="key" @click="openNoticeDetail(item)")
            p.box-col-7 {{item.noticeTitle}}
            span {{item.createTime}}
          div.more(@click="initNoticeList"  v-show="noticeHasNext")
            i.iconfont &#xe666;
      .notice(v-if="activeItem===6" class="mescroll overflow-y")
        ul
          li(class="box box-space-bettwen")
            p.box-col-7 Inroduction Video - Aaron Tsai
            span
              a(style="color:#0d97fe" href="https://drive.google.com/uc?export=download&confirm=VZbu&id=1ZRRI-4tgUs7cf0MxhzaWCwWursMLMveb") Download
          li(class="box box-space-bettwen")
            p.box-col-7 MASX Speech (LA) 08-04-19
            span
              a(style="color:#0d97fe" href="https://admin.udax.kr/upload/masex.pdf") Download
        <!--video(style="width:100%;height=100%;object-fit:fill" src="https://drive.google.com/uc?export=download&confirm=VZbu&id=1ZRRI-4tgUs7cf0MxhzaWCwWursMLMveb" controls)-->
          <!--Your browser does not support <code>video</code> tag.-->
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
  import Orders from '../Orders'
  import basicMixin from '@/mixin/basic'
  import caculateMixin from '@/mixin/caculate'
  import {removeListenRuner} from '@/lib/quotation'
  import MeScroll from '@/lib/mescroll'

  export default {
    name: 'TradeDetail',
    components: {
      ...Component,
      Chart,
      Orders,
    },
    mixins: [basicMixin, caculateMixin],
    data() {
      return {
        activeItem: 0,
        switchKey: 0,
        number: '1.6949',
        noticeHasNext: true,
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
        tabArr: [
          {
            text: this.$t('transaction.chat'),
            key: 1,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 1, // 订单状态
            quantity: 0, // 数量
          },
          {
            text: this.$t('transaction.history'),
            key: 3,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 3,
            quantity: 0, // 数量
          },
          {
            text: this.$t('transaction.securityDetail'),
            key: 5,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 5,
            quantity: 0, // 数量
          },
          // { text: this.$t('otc.appeal'), // 申诉中
          //   key: 6,
          // }, myMakerList
          {
            text: this.$t('transaction.companyProfile'),
            key: 7,
            type: 1,  // 类型  0代表委托单 1代表挂牌单
            status: '',
            quantity: 0, // 数量
          },
          {
            text: this.$t('transaction.news'),
            key: 2,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 2,
            quantity: 0, // 数量
          },
        ],
        noticeList: [],
        pageNumber: 1,
        scrollObj: null,
        tslas: [],
        filings: [],
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
      initScroll() {
        if (this.scrollObj) return
        this.scrollObj = new MeScroll('noticeScroll', {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initNoticeList,
            // clearEmptyId: `scroll_list`,
            htmlNodata: `<div class="box box-item empty-status"></div>`,
          },
        })
      },
      marketChoseTrade(direction) {
        let [symbolName, marketName] = this.tradeInfo.symbol.split('/')
        this.$Helper.jumpPage({name: 'Transaction', params: {symbol: {symbolName, marketName}, direction}}, this)
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
              let {resultMap, lastPrices, currencyRate, rateList, sellteMarket} = data
              // update the store
              this.$store.dispatch('quotation/refreshData', {
                rateList,
                lastPrices,
                symbolMap: resultMap,
                currencyRate,
                sellteMarket,
              })
            },
            () => {
              this.errorStatus = 'error'
            },
          )
      },
      changeItem(num) {
        let el = event.target
        let childs = el.parentNode.childNodes
        childs.forEach(v => {
          if (v === el) {
            v.setAttribute('class', 'active')
          } else {
            v.setAttribute('class', '')
          }
        })
        this.activeItem = num
      },
      initNoticeList() {
        this.$Helper.ajax({
          url: '/app/help/notice.api',
          params: {
            limit: 10,
            page: this.pageNumber,
            clientType: 'APP',
          },
        })
          .then(
            ({code, msg, data}) => {
              if (!data) return
              let resultList = data.result.records
              let query = {limit: 10, page: this.pageNumber}
              if (this.$Helper.dealHttpCode(code, msg, this.scrollObj, query)) {
                if (resultList && resultList.length > 0) {
                  this.noticeList = this.$Helper.dealPageResult(data.result.pages, this.scrollObj, query, this.noticeList, resultList)
                  this.pageNumber++
                  if (data.result.pages + 1 <= this.pageNumber) {
                    this.noticeHasNext = false
                  }
                } else {
                  this.noticeHasNext = false
                }
              }
            },
            () => {
              this.errorStatus = 'error'
            },
          )
      },
      openNoticeDetail(data) {
        this.$Helper.jumpPage({name: 'NoticeDetail', params: data}, this)
      },
      showHistory() {
        this.$Helper.ajax({
          method: 'get',
          url: '/v8',
        })
          .then(
            (response) => {
              let quotation = response
              let timeArray = quotation.chart.result[0].timestamp
              let timelen = timeArray.length
              for (let i = 0; i < timelen; i++) {
                let highs = quotation.chart.result[0].indicators.quote[0]['high'][timelen - i - 1]
                let lows = quotation.chart.result[0].indicators.quote[0]['low'][timelen - i - 1]
                let opens = quotation.chart.result[0].indicators.quote[0]['open'][timelen - i - 1]
                let closes = quotation.chart.result[0].indicators.quote[0]['close'][timelen - i - 1]
                let volumes = quotation.chart.result[0].indicators.quote[0]['volume'][timelen - i - 1]
                let quota = {}
                quota.showtime = this.getLocalTime(timeArray[timelen - i - 1] * 1000)
                quota.high = parseFloat(highs).toFixed(2)
                quota.low = parseFloat(lows).toFixed(2)
                quota.open = parseFloat(opens).toFixed(2)
                quota.close = parseFloat(closes).toFixed(2)
                quota.volume = parseFloat(volumes).toFixed(2)
                this.tslas.push(quota)
              }
            })
      },
      showFilings() {
        this.$Helper.ajax({
          method: 'get',
          url: '/sec-filings',
        })
          .then(
            (response) => {
              let quotation = response
              let records = quotation.records
              let len = records.length
              for (let i = 0; i < len; i++) {
                let quota = {}
                quota.receivedDate = this.getLocalTime(records[i].receivedDate)
                quota.periodEndDate = this.getLocalTime(records[i].periodEndDate)
                quota.formType = records[i].formType
                this.filings.push(quota)
              }
            })
      },
      getLocalTime(timestamp) {
        if (timestamp) {
          var time = new Date(timestamp)
          var y = time.getFullYear() // getFullYear方法以四位数字返回年份
          var M = time.getMonth() + 1 // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
          var d = time.getDate() // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
          // var h = time.getHours() // getHours方法返回 Date 对象的小时 (0 ~ 23)
          // var m = time.getMinutes() // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
          // var s = time.getSeconds() // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
          return y + '-' + M + '-' + d
          // + ' ' + h + ':' + m + ':' + s;
        } else {
          return ''
        }
      },
    },
    activated() {
      removeListenRuner('reloadGearQuotation')
      removeListenRuner('fbOrders')
    },
    created() {
      if (this.$route.params.symbol) {
        this.query = this.$route.params
        // save to cache
        this.$Helper.setCache('TradeDetailCache', this.query)
      } else {
        this.query = this.$Helper.getCache('TradeDetailCache')
      }
      this.initAppQuotation().then(() => this.initDigitalSymbol())
      this.$Helper.onAction('reloadQuotation', ({list}) => {
        if (list.lastPrice < 0 || !this.lastPrices) return
        // if (this.tradeList.filter(item => item.))
        if (list.symbol === this.query.symbol) {
          if (this.tradeList.length > 0) {
            if (list.totolVolume <= this.tradeList[0].totolVolume) {
              return
            }
          }
          if (list.lastVolume && list.updateTime && list.lastPrice) {
            this.tradeList.unshift({
              ...list,
              tradeTime: list.updateTime,
              direction: list.orderDir,
              price: list.lastPrice,
              volume: list.lastVolume,
              totolVolume: list.totolVolume,
            })
          }
        }
      })
      this.initNoticeList()
      this.showHistory()
      this.showFilings()
    },
    mounted() {
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');

  .trade-detail {
    background: white;
    .head {
      height: 12vw;
      background: white;
      padding: 0 2vw;
      .name {
        font-size: 4.6vw;
        font-weight: 600;
        color: @icon-color;
        i {
          font-size: 5vw;
          margin-right: 2vw;
          color: @icon-color;
        }
      }
      .icon {
        i {
          font-size: 5vw;
          margin: 0 2.5vw;
        }
      }
    }
    .content {
      padding: 0;
      .info {
        padding: 5vw 4vw;
        padding-top: 3vw;
        .left {
          width: 60%;
          h1 {
            font-size: 7vw;
            font-weight: 600;
            padding: 0;
          }
          p {
            color: #aaa;
            margin-top: 5vw;
            font-size: 3.8vw;
            span {
              margin-left: 2vw;
            }
          }
        }
        .right {
          font-size: 3.8vw;
          margin-top: 2vw;
          & > .box {
            margin-bottom: 1.2vw;
          }
          .title {
            color: #888;
          }
          .num {
            color: #222;
          }
        }
      }
      .top-select {
        margin-top: 2vw;
        background: white;
        .box {
          height: 12vw;
          border-bottom: 2px solid transparent;
          font-size: 4vw;
          font-weight: 400;
          transition: all 400ms;
          &.active {
            color: @icon-color;
            border-color: @icon-color;
          }
        }
      }
      .table {
        background: white;
        padding: 0 3vw;
        padding-top: 2vw;
      }
      .detail {
        min-height: 50vh;
        background: white;
        padding: 3vw;
        .name {
          font-weight: 600;
          font-size: 5.6vw;
        }
        .code {
          margin-top: 2vw;
          margin-bottom: 3vw;
        }
        p {
          font-size: 3.6vw;
          margin-top: 2vw;
          word-break: break-all;
          line-height: 1.6;
          height: 10vw;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #666;
          a {
            color: @icon-color;
            font-size: 3.4vw;
          }
          span {

            color: #646da9;
          }
        }
      }
    }
    .empty-status {
      height: 480px;
    }
    .bottom {
      height: 14vw;
      background: white;
      box-shadow: 1px 0px 7px #ddd;
      z-index: 1;
      padding: 0 3vw;
      .btn {
        height: 80%;
        width: 31vw;
        font-size: 4.2vw;
        font-weight: 500;
        color: white;

      }
      .chose {
        font-size: 3.4vw;
        color: @active-deep;
        .i-con {
          i {
            color: @active-deep;
            font-size: 5vw;
          }
        }
      }
    }
  }

  .box-item.error-bg {
    margin-left: 3vw;
  }

  .menu-nav {
    background: white;
    border-bottom: 1px solid #eee;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .menu-nav ul {
    white-space: nowrap;
    height: 100%;
  }

  .menu-nav li {
    display: inline-block;
    font-family: sans-serif;
    color: #666;
    font-size: 3.5vw;
    margin-right: 3vw;
    margin-left: 3vw;
    font-weight: 600;
    border-bottom: 2px solid transparent;
    padding: 3vw 0;
  }

  .menu-nav li.active {
    color: #646da9;
    border-bottom: 2px solid #646da9;
  }

  .notice {
    padding: 3vw;
    .more {
      text-align: center;
      padding-top: 4vw;
      padding-bottom: 1vw;
      i {
        font-size: 4.5vw;
      }
    }
  }

  .notice ol {
    color: #646da9;
    font-size: 4vw;
    font-weight: bold;
    padding-bottom: 2vw;
  }

  .notice li {
    padding: 3vw 0;
    border-bottom: 1px solid #eee;
  }

  .notice li span {
    color: #ccc;
  }

  .summary {
    p {
      padding: 5vw 3vw;
      line-height: 220%;
      color: #666;
    }
  }

  .vid-wrap{
    /*width:100%;background: #000;*/
    /*position:relative;*/
    /*padding-bottom:56.25%;    !*需要用padding来维持16:9比例,也就是9除以16*!*/
    /*height: 0;*/
  }
  /*.vid-wrap video {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%*/
  /*}*/

  .list-con {
    background: white;
    padding: 0 3vw;
    .list {
      .half-x-line {
        margin-bottom: 6vw;
        margin-top: 6vw;
      }
      .head {
        margin-top: 4vw;
        .h-left {
          font-size: 4.6vw;
          font-weight: bold;
          span {
            font-size: 3.6vw;
            color: #666;
            font-weight: 400;
          }
        }
        .do {
          font-size: 3.7vw;
          color: @icon-color;
          font-weight: 600;
        }
      }
      .td {
        &.tr {
          color: #777;
          margin-top: 5.5vw;
          margin-bottom: 3.5vw;
        }
        color: #222;
        .price {
          width: 30%;
        }
        .num {
          width: 30%;
        }
        .said {
        }
      }
    }
  }
</style>

