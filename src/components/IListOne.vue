<template lang="html">
  <ul>
    <li class="box box-y-center" v-for="(item, key) of selfList" :key="key" @click="openDetail(item)">
      <!-- <dl class="box box-item">
        <dt v-if="showRank"><span :class="{ 'right-bg': key < 3 }">{{ key + 1 }}</span></dt>
        <dt class="box box-item icon">
          <i class="iconfont" v-html="caculateIcon(item)"/>
        </dt>
        <dd class="name">
          <b>{{ item.symbol }}</b>
          <br>{{ $Helper.numFixedLength(count(item, 'lastPrice'), count(item, 'tradePriceDigit'), 20) }}
        </dd>
        <dd class="num" style="padding-top:2vw;">
          <b>≈ {{ $Helper.numFixedLength(caculateRateNum(item), 2, 10) }} {{ currencyRate }}</b>
        </dd>
        <dd class="btn box-col-flex">
          <span :class="{ 'right-bg': count(item, 'rose') >= 0, 'error-bg': count(item, 'rose') < 0 }">{{ count(item, 'rose') }}%</span>
        </dd>
      </dl> -->
      <div class="icon box box-item">
        <i class="iconfont" v-html="caculateIcon(item)"/>
      </div>
      <div class="content">
        <div class="top">
          {{ item.symbol }}
        </div>
        <div class="bottom">
          {{ $Helper.numFixedLength(count(item, 'lastPrice'), count(item, 'tradePriceDigit'), 20) }}
        </div>
      </div>
      <div class="amost">
        ≈
      </div>
      <div class="price box-col-flex box-item">
        {{ $Helper.formatAmount(caculateRateNum(item))}} {{ currencyRate }}
      </div>
      <div class="rose-con box box-item">
        <div class="btn" :class="{ 'right-bg': count(item, 'rose') >= 0, 'error-bg': count(item, 'rose') < 0 }">{{
          count(item, 'rose') >= 0 ? '+' : '' }}{{ count(item, 'rose') }}%
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
  import caculateMixin from '@/mixin/caculate'
  import _ from 'lodash'

  export default {
    components: {},
    data() {
      return {
        selfList: [],
      }
    },
    mixins: [caculateMixin],
    computed: {},
    props: {
      list: {
        type: Array,
        default: () => ([]),
      },
      showRank: {
        type: Boolean,
        default: true,
      },
    },
    watch: {
      list() {
        // this.selfList = _.sortBy(this.list.map((item, key) => ({...this.selfList[key], ...item})), item => -item.rose) //暂不进行涨幅排序
        this.selfList = this.list.map((item, key) => ({...this.selfList[key], ...item}))
      },
      lastPrices() {
        this.initselfList()
      },
    },
    methods: {
      caculateIcon(item) {
        let conf = {
          OMG: '&#xe62a;',
          USDT: '&#xe629;',
          ETH: '&#xe628;',
          TRX: '&#xe62c;',
          BTC: '&#xe674;',
          XRP: '&#xe637;',
          ETC: '&#xe725;',
          LTC: '&#xe650;',
          BCH: '&#xe723;',
          BSV: '&#xe690;',
          WESTO: '&#xe6ba;',
          TRAT: '&#xe6df;',
        }
        return conf[item.symbol.split('/')[0]]
      },
      parseFloatFn(str) {
        return parseFloat(str)
      },
      openDetail(item) {
        if (this.$route.name === 'Transaction') {
          this.$Helper.emitAction('MarketChoseTrade', {symbol: item})
        } else {
          this.$Helper.jumpPage({name: 'TradeDetail', params: item}, this)
        }
      },
      count(item, key) {
        return _.get(item, key)
      },
      // getRateNum(item) {
      //   let lastPrice = this.count(item, 'lastPrice')
      //   let rate = _.get(this.rateList.filter(item => item.currencyName === `USD${this.currencyRate}`), '[0].currencyRate') || 0
      //   return lastPrice * rate
      // },
      initselfList() {
        // this.selfList = _.sortBy(  //暂不进行排序
        //   this.list.map(item => {
        //     let s = { ...item, ..._.get(this, `lastPrices[${item.symbol}]`) }
        //     s.rose = ((100 * (s.lastPrice - s.openPrice) / s.openPrice) || 0).toFixed(2)
        //     return s
        //   }),
        //   item => -item.rose,
        // )
        this.selfList = this.list.map(item => {
          let s = {...item, ..._.get(this, `lastPrices[${item.symbol}]`)}
          s.rose = ((100 * (s.lastPrice - s.openPrice) / s.openPrice) || 0).toFixed(2)
          return s
        })
      },
    },
    created() {
      // 将初始化时lastprice的值赋给每一个币种
      this.initselfList()
      this.$Helper.onAction('reloadQuotation', ({socket, list}) => {
        if (list.lastPrice > 0) {
          this.initselfList()
        }
      })
    },
    mounted() {
    },
  }
</script>

<style lang="less" scoped>
  @import url("../theme/index.less");

  ul {
    li {
      background: #fff;
      height: 16vw;
      padding: 0 3vw;
      .icon {
        padding-right: 2vw;
        i {
          font-size: 5vw;
        }
      }
      .content {
        .top {
          font-size: 3.4vw;
          font-weight: 600;
          margin-bottom: 1vw;
        }
        .bottom {
          font-size: 3.2vw;
          font-weight: 400;
          color: #888;
        }
      }
      .amost {
        font-size: 3.6vw;
        font-weight: 600;
        margin: 0 3vw;
      }
      .price {
        font-size: 3.4vw;
        font-weight: 600;
        color: #222;
        word-break: break-all;
      }
      .rose-con {
        margin-left: 2vw;
        .btn {
          width: 18vw;
          height: 9vw;
          transition: all 0.4s;
          line-height: 9vw;
          text-align: center;
          font-size: 3.6vw;
          color: #fff;
        }
      }
    }
  }

  .bd {
    padding: 0px 3vw;
    padding-left: 0;
    background: white;
    .list {
      width: 100%;
      height: 16vw;
    }
    dl {
      align-items: flex-start;
      justify-content: flex-start;
      font-size: 4vw;
      width: 100%;
      .icon {
        height: 100%;
        width: 10%;
        padding-top: 2vw;
        i {
          font-size: 5vw;
        }
      }
      dd {
        color: #aaa;
        font-size: 3.2vw;
        &.name {
          width: 30%;
          line-height: 150%;
          word-break: normal;
          word-wrap: break-word;
          b {
            font-weight: 600;
          }
        }
        &.num {
          width: 35%;
          line-height: 150%;
          b {
            font-weight: 600;
            word-break: break-all;
          }
          p {
            word-break: break-all;
            padding-right: 2vw;
          }
        }
        &.btn {
          width: 22%;
          text-align: right;
          span {
            width: 18vw;
            height: 9vw;
            transition: all 0.4s;
            line-height: 9vw;
            text-align: center;
            font-size: 3.6vw;
            color: #fff;
            display: inline-block;
          }
        }
        b {
          color: #646da9;
          font-size: 3.6vw;
        }
      }
    }
    dt {
      width: 8%;
      span {
        width: 16px;
        font-size: 13px;
        color: #fff;
        height: 16px;
        line-height: 16px;
        text-align: center;
        margin-top: 2px;
        background: #aaa;
        display: inline-block;
        border-radius: 2px;
      }
    }
  }
</style>
