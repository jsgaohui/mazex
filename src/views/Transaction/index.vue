<template lang="html">
  <!--mescroll-vue.mescroll(@init='scrollInit', :down='mescrollDown')-->
    <div class="container box box-row">
      <div class="head box box-no-shrink">
        <div class="name box box-y-center box-col-flex">
          <i class="iconfont" @click="showSlideModel">&#xe647;</i>
          <span v-if="tradeSymbol && basicSymbol">{{ tradeSymbol }}/{{ basicSymbol }}</span>
          <span v-else> {{$t('transaction.trade_chose_error') }}</span>
        </div>
        <div class="icon box box-item">
          <!--// i.iconfont &#xe602;-->
          <i class="iconfont" @click="getTradeDetail">&#xe61a;</i>
        </div>
      </div>
      <div class="half-x-line"></div>
      <div class="content box-row-flex overflow-y" ref="routerView" id="transcation_con">
        <div class="top box">
          <div class="left">
            <div class="left-top box box-y-center">
              <div class="select right-color right-border" :class="{ 'hide': direction !== 1 }" @click="direction=1"> {{ $t('transaction.buy') }}</div>
              <div class="select error-color error-border" :class="{ 'hide': direction !== 2 }" @click="direction=2" >{{ $t('transaction.sell') }}</div>
              <div class="switch box box-x-right box-y-center box-col-flex" @click="showtradeType" v-if="0">
                <div>{{ tradeType === 1 ? '限价' : '市价' }}</div>
                <i class="iconfont">&#xe61f;</i>
              </div>
            </div>
            <number-widget :style="{'margin-top': '4vw'}" v-model="price" :showRange="true" :min="0" :step="getStep(tradePriceDigit)" :fixed="tradePriceDigit" @blur="checkPrice(price)" />
            <div class="number-about box box-y-center"> ≈ {{ $Helper.formatAmount(caculateRateNum({ lastPrice: price, symbol })) }} {{ currencyRate }}</div>
            <number-widget :style="{'margin-top': '5vw'}" v-model="volumn" @input="changeVolmn" :showRange="false" :fixed="minTradeDigit" :rightText="tradeSymbol" :placeholder="$t('basic.num')" @blur="setPrecent" :min="0" />
            <div class="number-about active box box-y-center"> {{ $t('transaction.can_use') }} {{ $Helper.numFixedLength(availableNum,  direction===1?tradePriceDigit:minTradeDigit) }} {{ direction===1 ? basicSymbol : tradeSymbol }}</div>
            <div class="range box box-y-center">
              <Ranger v-model="percent" @input="changeRanger" :color="direction === 1 ? rightColor : errorColor" >
                <!--// div(slot="left") {{ $Helper.numFixedLength((direction===1 ? volumn * price : volumn / price) || 0, minTradeDigit)}}-->
               <div slot="right"> {{ maxTradeNum }} {{ tradeSymbol }}</div>
              </Ranger>
            </div>
            <div class="sent-num box boxy-center">
              <div class="left-c"> {{ $t('transaction.trade_num') }}</div>
            </div>
          <div class="about-num box box-x-right">{{ $Helper.numFixedLength( volumn * price || 0, tradePriceDigit)}} {{ basicSymbol }} ≈ {{ $Helper.formatAmount(caculateRateNum({ lastPrice: volumn * price, symbol })) }} {{ currencyRate }}</div>
            <div class="sent-num box boxy-center">
              <div class="left-c"> {{ $t('otc.transactionFees') }}</div>
            </div>
            <div class="about-num box box-x-right">
              {{ volumn > 0 ? $Helper.format(volumn * price * tradeRate, 8) : 0 }}&nbsp;{{basicSymbol}}
            </div>
            <div class="btn box box-item" :class="{'right-bg': direction===1, 'error-bg': direction!==1}" v-if="!uid" @click="jumpPage('Login')"> {{ $t('basic.login') }}</div>
            <div class="btn box box-item" :class="{'right-bg': direction===1, 'error-bg': direction!==1}" v-else @click="validTransaction"> {{ direction === 1 ? $t('transaction.buy') : $t('transaction.sell') }} {{ tradeSymbol }}</div>
          </div>
          <div class="right box-col-flex">
            <Itable :list="sellList" :showList="showList" :reverse="true" style="height: 43vw" @tap="handerSellClick($event)" :num="5" :baseRowHeight="7.4" />
            <div class="right-num error-color"> {{ $Helper.numFixedLength(lastPrice, tradePriceDigit) }}</div>
              <span> {{ basicSymbol }}</span>
            <div class=".right-info"> ≈ {{ $Helper.formatAmount(caculateRateNum({ lastPrice, symbol })) }} {{ currencyRate }}</div>
            <Itable :list="buyList" :showList="showList2" :showTr="false" style="height: 43vw" @tap="handerBuyClick($event)" :baseRowHeight="7.4" />
          </div>
        </div>
        <Orders style="border-top: 2vw solid #f9f9f9" ref="Orders" :symbol="symbol" />
      </div>

      <!--弹出窗口-->
      <div class="tip-bg" v-show="showDiv" @click="showDiv=false"></div>
      <div class="tip-box" v-show="showDiv"  style="display:block">
        <div class="tip-top" style="background:#ecf0f7;height:12vw;line-height:12vw;font-size:4.5vw;color:#1f405a;">
          <div>{{this.direction === 1 ? $t('transaction.buy') : $t('transaction.sell')}}&nbsp;{{tradeSymbol}}</div>
          <div class="tip-close" @click="showDiv=false"><i class="iconfont">&#xe620;</i></div>
        </div>

        <div class="tip-con">
          <div class="content">
            <div class="info flex-x-space">
              <h5>{{this.direction === 1 ? $t('basic.buy') : $t('basic.sell')}}{{$t('basic.price')}}</h5>
              <!--<span style="font-size:3vw;">{{this.dcForm.tradeType==6?$t('fund.enableInVolume'):$t('fund.enableOutVolume')}}：{{this.availableAmount}}</span>-->
              <div class="flex-x-space"> {{$Helper.format(price,8)}}&nbsp;{{basicSymbol}} ≈ {{ $Helper.formatAmount(caculateRateNum({ lastPrice: price, symbol })) }}&nbsp;{{currencyRate}}</div>
            </div>
            <h5 >{{this.direction === 1 ? $t('basic.buy') : $t('basic.sell')}}{{$t('basic.num')}}</h5>
            <div class="flex-x-space">  {{$Helper.format(volumn,8)}}&nbsp;{{tradeSymbol}}</div>
            <h5 >{{$t('transaction.trade_num') }}</h5>
            <div class="flex-x-space">  {{ $Helper.numFixedLength( volumn * price || 0, tradePriceDigit)}} {{ basicSymbol }} ≈ {{ $Helper.formatAmount(caculateRateNum({ lastPrice: volumn * price, symbol })) }} {{ currencyRate }}</div>
            <h5 >{{$t('otc.transactionFees') }}</h5>
            <div class="flex-x-space">
              {{ volumn > 0 ? $Helper.format(volumn * price * tradeRate, 8) : 0 }}&nbsp;{{basicSymbol}}
            </div>
            <h5 style="margin-top:2vw;"></h5>
            <template v-if="!this.pwdValid">
              <div class="flex-x-space"><Iinput  class="box-col-flex" inputType="password" v-model="payPassword" :placeholder="$t('fund.inputPassword')"  :maxlength="6" /></div>
              <div class="half-x-line"></div>
              <div style="padding-top:2vw;text-align:right"><span class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span></div>
            </template>
          </div>
          <div  v-bind:class="{'login-btn':true,'active':true }" @click="tradeFn()">{{$t('fund.confirm')}}</div>
        </div>
        <div class="tip-extra"></div>
      </div>
      <!--弹出窗口END-->


    </div>
</template>
<script>
import Component from '@/components'
import Ranger from './ranger'
import Orders from '../Orders'
import {mapState} from 'vuex'
import basicMixin from '@/mixin/basic'
import caculateMixin from '@/mixin/caculate'
import _ from 'lodash'
import {reloadGearQuotation, reloadOrders, removeListenRuner} from '@/lib/quotation'
// let cssName = 'transaction'
// require(`../../theme/transaction.less`)
// import MescrollVue from 'mescroll.js/mescroll.vue'
// import { reloadQuotation, reloadRate, disconnectSocket } from '@/lib/quotation'
export default {
  name: 'Transaction',
  components: {
    ...Component,
    Ranger,
    Orders,
    // MescrollVue,
  },
  mixins: [basicMixin, caculateMixin],
  data() {
    return {
      pwdValid: false,
      showDiv: false,
      downTip: this.$t('basic.login'),
      downReTip: this.$t('basic.login'),
      loadTip: this.$t('basic.login'),
      lastRefreshTime: 0,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        auto: false,
        callback: this.downRefresh,
        htmlContent: '<p class="downwarp-progress"></p>',
        // inOffset: function(mescroll) {
        //   // 下拉的距离进入offset范围内那一刻的回调
        //   if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = this.downTip
        //   if (mescroll.downProgressDom) mescroll.downProgressDom.classList.remove('mescroll-rotate')
        // },
        // outOffset: function(mescroll) {
        //   // 下拉的距离大于offset那一刻的回调
        //   if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = this.downReTip
        // },
        // showLoading: function(mescroll) {
        //   // 显示下拉刷新进度的回调
        //   if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = this.loadTip
        //   if (mescroll.downProgressDom) mescroll.downProgressDom.classList.add('mescroll-rotate')
        // },
      },
      direction: 1,
      percent: 0,
      tradeType: 1,
      price: 0,
      volumn: 0,
      tradeSymbol: null,
      basicSymbol: null,
      lastPrice: 0,
      buyList: [],
      sellList: [],
      maxShowUnit: 0,  // every input, fixed num
      minTradeUnit: 0,    // min trade volume
      tradePriceDigit: 0, // max trade price fixed
      minTradeDigit: 0,   // max trade volume fixed
      tradeRate: 0, // 交易手续费
      payPassword: '', // 支付密碼
    }
  },
  computed: {
    ...mapState('basic', ['uid', 'isExitTradePwd']),
    ...mapState('setting', ['language']),
    ...mapState('quotation', ['symbolMap']),
    // 币币交易费率
    getTradeRate() {
      let rate = Number.parseFloat(this.tradeRate)
      if (Number.parseFloat(rate) > 0) {
        rate = Number.parseFloat(1 + rate) // 计算扣除手续费之后的比例手续费
      } else {
        rate = 1
      }
      return rate
    },
    // 最大可交易数量
    maxTradeNum() {
      return this.$Helper.numFixedLength(this.direction === 1 ? (this.availableNum / this.getTradeRate) / this.price : this.availableNum, this.minTradeDigit)
    },
    // 可用余额
    availableNum() {
      let aArr = this.availableList.filter(item => item.dcCode === (this.direction === 1 ? this.basicSymbol : this.tradeSymbol))
      return _.get(aArr, '[0].availableAmount') || 0
    },
    symbol() {
      return `${this.tradeSymbol}/${this.basicSymbol}`
    },
    showList() {
      return {
        KEY: {
          text: this.$t('transaction.handicap'),
          align: 'left',
          color: this.language === 'ko' ? '#0051c7' : '#f36365',
          width: 17,
        },
        price: {
          text: this.$t('basic.price'),
          align: 'right',
          color: this.language === 'ko' ? '#0051c7' : '#f36365',
        },
        totalVolume: {
          text: this.$t('basic.num'),
          align: 'right',
        },
      }
    },
    showList2() {
      return {
        KEY: {
          text: this.$t('transaction.handicap'),
          align: 'left',
          color: this.language === 'ko' ? '#d60000' : '#1fbe6c',
          width: 17,
        },
        price: {
          text: this.$t('basic.price'),
          align: 'right',
          color: this.language === 'ko' ? '#d60000' : '#1fbe6c',
        },
        totalVolume: {
          text: this.$t('basic.num'),
          align: 'right',
        },
      }
    },
    rightColor() {
      return this.language === 'ko' ? '#d60000' : '#1fbe6c'
    },
    errorColor() {
      return this.language === 'ko' ? '#0051c7' : '#f36365'
    },
  },
  watch: {
    // 选择买入卖出时重置表单
    direction() {
      this.resetFormFn()
    },
    volumn() {
      if (Number.parseFloat(this.volumn) > Number.parseFloat(this.maxTradeNum)) {
        this.volumn = this.maxTradeNum
        if (this.volumn.split('.')[1].length > this.minTradeDigit) {
          this.volumn = this.maxTradeNum
        }
      }
    },
  },
  methods: {
    toPassword() {
      // 跳转重构之密码页面
      this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
      // }
    },
    // 免密交易的剩余时间
    getPwdTtl() {
      this.$Helper.ajax({
        url: '/app/common/pwdTtl.api',
        method: 'POST',
      })
        .then(
          ({code, msg, data}) => {
            if (code === 200) {
              let ttl = data
              this.pwdValid = ttl > 0
            }
          },
        )
    },
    scrollInit(mescroll) {
      this.mescroll = mescroll
    },
    downRefresh() {
      let timestamp = Date.parse(new Date())
      if (timestamp - this.lastRefreshTime > 1500) {
        this.lastRefreshTime = timestamp
        this.$Helper.emitAction('loading', {show: true})
        // show loading
        setTimeout(() => this.$Helper.emitAction('loading', { show: true }), 100)
        this.getTradeList()
      }
      this.mescroll.endSuccess()
    },
    // 判断是否可以成交
    validVolume() {
      if (this.volumn < this.minTradeUnit) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.tradenum_less_toast') + ':' + this.minTradeUnit,
        })
      }
      if (this.direction === 1 && this.volumn > this.availableNum / this.price) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.available_less_toast'),
        })
      }
      if (this.direction === 2 && this.volumn > this.availableNum) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.available_less_toast'),
        })
      }
    },
    // Ranger组件滑动时设定交易量
    changeRanger() {
      if (this.direction === 1) {
        this.volumn = this.$Helper.numFixedLength(this.percent * this.availableNum * 0.01 / this.getTradeRate / this.price, this.minTradeDigit)
      } else {
        this.volumn = this.$Helper.numFixedLength(this.percent * this.availableNum * 0.01 / this.getTradeRate, this.minTradeDigit)
      }
      this.validVolume()
    },
    // 输入交易量后回调
    changeVolmn() {
      this.validVolume()
      // set percent
      this.setPrecent()
    },
    // 获取+-是单步大小
    getStep(num = 1) {
      let r = 1
      for (let i = 0; i < num; i++) {
        r = r * 0.1
      }
      return r
    },
    // 输入价格后，保留小数位
    checkPrice(num) {
      this.price = this.$Helper.numFixedLength(this.price, this.tradePriceDigit)
    },
    // 是否是一个正确的数字
    isZNum(num, floatNum = 5) {
      let reg = new RegExp(`(^[1-9]([0-9]+)?(.[0-9]{1,${floatNum}})?$)|(^[0-9].[0-9]{1,${floatNum}}$)`)
      return reg.test(num) && parseFloat(num) > 0
    },
    jumpPage(name) {
      this.$Helper.jumpPage(name, this)
    },
    // 显示行情列表
    showSlideModel() {
      this.$store.dispatch('layermodel/push', { name: 'TradeSlide', type: 'left', params: {} })
    },
    // 市价还是限价
    showtradeType() {
      this.$store.dispatch('layermodel/push', { name: 'BottomSelect', type: 'up', params: { active: this.tradeType, list: [{text: '限价', key: 1, hander: () => { this.tradeType = 1 }}, {text: '市价', key: 2, hander: () => { this.tradeType = 2 }}] } })
    },
    // 获取对应币种换算成货币的数量
    getRateNumFn(num) {
      return (this.rate || 0) * (num || 0)
    },
    // 验证交易的参数
    validTransaction() {
      let params = {
        direction: this.direction,
        tradeType: this.tradeType,
        tradeSymbol: this.tradeSymbol,
        basicSymbol: this.basicSymbol,
      }
      let paramsConf = {
        direction: this.$t('transaction.business_type'),
        tradeType: this.$t('transaction.price_type'),
        tradeSymbol: this.$t('transaction.symbol_name'),
        basicSymbol: this.$t('transaction.market_name'),
      }
      // judge params complete
      // 判断数据完整
      let emptyParams = this.$Helper.testParamsComplete({params})
      if (emptyParams.length > 0) {
        this.$Helper.emitAction('toast', { text: `${this.$t('basic.require')}${paramsConf[emptyParams[0]]}` })
        return
      }
      // 是否是正确的价格
      if (!this.isZNum(this.price, this.tradePriceDigit)) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.tradeprice_less_toast'),
        })
        return
      }
      // 小于最小交易量
      if (this.volumn < this.minTradeUnit) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.tradenum_less_toast') + ':' + this.minTradeUnit,
        })
        return
      }
      // 数量是否是数字
      if (!this.isZNum(this.volumn, this.minTradeDigit)) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.tradenum_error_toast'),
        })
        return
      }
      // 价格和数量是否小于0
      if (!this.price || !this.volumn || this.price <= 0 || this.volumn <= 0) {
        this.$Helper.emitAction('toast', { text: this.$t('transaction.price_less_toast') })
        return
      }
      // 可余额不足
      if (this.direction === 1 && this.volumn > (this.availableNum / this.getTradeRate / this.price)) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.available_less_toast'),
        })
        return
      }
      // 可余额不足
      if (this.direction === 2 && this.volumn > this.availableNum) {
        this.$Helper.emitAction('toast', {
          text: this.$t('transaction.available_less_toast'),
        })
        return
      }
      // 获取是否在免密期
      this.getPwdTtl()
      this.showDiv = true
    },
    // 开始交易
    tradeFn() {
      // 如果需要校验密码
      if (!this.pwdValid) {
        if (!this.payPassword || this.payPassword.length !== 6) {
          this.$Helper.toast(this.$t('fund.paypassword'))
          return
        }
      }
      let params = {
        direction: this.direction,
        tradeType: this.tradeType,
        tradeSymbol: this.tradeSymbol,
        basicSymbol: this.basicSymbol,
        payPassword: this.payPassword,
      }
      if (this.direction === 1) {
        params.buyPrice = this.price
        params.buyVolumn = this.volumn
      } else {
        params.sellPrice = this.price
        params.sellVolumn = this.volumn
      }
      this.$Helper.emitAction('loading', { show: true })
      this.$Helper.ajax({
        url: '/app/trade/tradeCoin.api',
        params,
      })
      .then(
        ({code, msg, data}) => {
          this.$Helper.emitAction('toast', { text: msg })
          // reload orderList
          // 订单列表添加一条数据
          this.$refs.Orders.reloadOrders(data)
          // reset
          // 重置表单
          this.resetFormFn()
          setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 400)
          // update avalibleList
          // 更新可用余额列表
          this.reloadAvalibleList()
        }
      ).then(() => {
        this.showDiv = false // 隐藏弹窗
        this.payPassword = '' // 清空密码
      })
    },
    reloadAvalibleList() {
      return this.$Helper
      .ajax({
        url: '/app/account/symbolCapital.api',
      })
      .then(
        ({data}) => {
          let { accountList, sellteMarket } = data
          // update the store
          this.$store.dispatch('quotation/refreshData', { availableList: accountList, sellteMarket })
        },
      )
    },
    // 设定百分比
    setPrecent() {
      if (!this.availableNum || !this.$Helper.isType(this.availableNum, 0)) return
      let volumn = this.volumn ? this.volumn : 0
      if (this.direction === 1) {
        this.percent = 100 * volumn * this.price / this.availableNum
      } else {
        this.percent = 100 * volumn / this.availableNum
      }
    },
    // 跳转到详情页
    getTradeDetail() {
      this.$Helper.setCache('Transaction', { symbolName: this.tradeSymbol, marketName: this.basicSymbol })// 放入缓存,从交易详情页返回时从缓存获取
      this.$Helper.jumpPage({name: 'TradeDetail', params: { symbol: this.tradeSymbol + '/' + this.basicSymbol }}, this)
    },
    resetFormFn() {
      if (!this.sellList || this.sellList.length === 0 || !this.buyList || this.buyList.length === 0) {
        this.price = 0
      } else {
        this.price = this.$Helper.numFixedLength(this.direction === 1 ? this.sellList[0].price : this.buyList[0].price, this.tradePriceDigit, 100)
      }
      // this.volumn = this.$Helper.numFixedLength(this.direction === 1 ? this.sellList[0].totalVolume : this.buyList[0].totalVolume, this.minTradeDigit, 100)
      this.volumn = 0
      this.setPrecent()
    },
    // 初始化数据
    getTradeList({params} = {}) {
      // reset buylist selllist
      this.buyList = []
      this.sellList = []
      // 获取目标币种
      let { symbol, direction } = params || this.$route.params   // if seted symbol && direction
      let cachedSymbol = this.$Helper.getCache('Transaction')  // { symbolName: this.tradeSymbol, marketName: this.basicSymbol }
      if (symbol) {
        if (symbol.symbol) {
          symbol.symbolName = symbol.symbol.split('/')[0]
          symbol.marketName = symbol.symbol.split('/')[1]
        }
        if (direction) this.direction = direction
        this.tradeSymbol = symbol.symbolName
        this.basicSymbol = symbol.marketName
      } else if (cachedSymbol && cachedSymbol.symbolName && cachedSymbol.marketName) {
        this.tradeSymbol = cachedSymbol.symbolName
        this.basicSymbol = cachedSymbol.marketName
      } else if (this.symbolMap) {
        let symbolMap = this.symbolMap
        let count = 0
        // 默认取第一个交易对
        _.map(symbolMap, (item, key) => {
          if (count === 0) {
            this.tradeSymbol = item[0].targetDcCode
            this.basicSymbol = item[0].basicDcCode
            count++
          }
        })
      }
      // 判断是否初始市场和交易目标币种存在，存在订阅当前交易对的档位行情
      if (this.tradeSymbol && this.basicSymbol) {
        reloadGearQuotation(this.tradeSymbol + '/' + this.basicSymbol)
      }
      // this.$Helper.setCache('Transaction', '') // 清空缓存
      return this.$Helper.ajax({
        url: `/app/trade/appMarketTrade.api`,
        params: {
          symbol: this.tradeSymbol && this.basicSymbol ? this.tradeSymbol + '/' + this.basicSymbol : undefined,
        },
      })
      .then(
        data => {
          let { availableList = [], basicTradeSymbol = {}, rateList = [], currencyRate, lastPrices, tradePriceDigit, minTradeUnit, minTradeDigit, maxShowUnit, tradeRate, getGearQuotation } = _.get(data, 'data') || {}
          if (basicTradeSymbol && (!this.tradeSymbol || !this.basicSymbol)) {
            // 没有目标币种时使用推荐市场
            if (basicTradeSymbol.tradeSymbol) this.tradeSymbol = basicTradeSymbol.tradeSymbol
            if (basicTradeSymbol.basicSymbol) this.basicSymbol = basicTradeSymbol.basicSymbol
            reloadGearQuotation(this.tradeSymbol + '/' + this.basicSymbol)
          }
          // this.$Helper.setCache('Transaction', { symbolName: this.tradeSymbol, marketName: this.basicSymbol })
          // update the store
          this.$store.dispatch('quotation/refreshData', { availableList, rateList, currencyRate, lastPrices })
          this.maxShowUnit = maxShowUnit
          this.tradePriceDigit = tradePriceDigit
          this.minTradeUnit = minTradeUnit
          this.minTradeDigit = minTradeDigit
          this.tradeRate = tradeRate // 币币交易手续费
          this.caculateTradeList(this.lastPrices)
          if (getGearQuotation) {
            this.gearTradeList(getGearQuotation)
          }
          // the first time init, get the newest price
          this.resetFormFn()
          setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 400)
        },
        () => {
          this.$Helper.emitAction('toast', {text: this.$t('basic.web_error')})
        },
      )
    },
    // 获取盘口信息
    caculateTradeList(arr = []) {
      _.map(arr, list => {
        if (list.symbol === this.symbol) {
          // refresh the lastPrice
          if (list.lastPrice) this.lastPrice = list.lastPrice
        }
      })
    },
    gearTradeList(list) {
      if (list.symbol === this.symbol) {
        if (list && list.bidPrices && this.$Helper.isType(list.bidPrices, []) && list.askVolumes && this.$Helper.isType(list.askVolumes, [])) {
          this.buyList = list.bidPrices
            .map((item, key) => ({
              price: this.$Helper.format(item, this.tradePriceDigit),
              totalVolume: this.$Helper.numFixedLength(list.bidVolumes[key], this.minTradeDigit),
            }))
            .slice(0, 5)
          this.sellList = list.askPrices
            .map((item, key) => ({
              price: this.$Helper.format(item, this.tradePriceDigit),
              totalVolume: this.$Helper.numFixedLength(list.askVolumes[key], this.minTradeDigit),
            }))
            .slice(0, 5)
        }
      }
    },
    // 盘口点击
    handerSellClick(params) {
      // if (this.direction === 1) {
      this.price = this.$Helper.numFixedLength(params.price, this.tradePriceDigit)
      // this.volumn = this.$Helper.numFixedLength(params.totalVolume, this.tradePriceDigit)
      this.setPrecent()
      // }
    },
    // 盘口点击
    handerBuyClick(params) {
      // if (this.direction === 2) {
      this.price = this.$Helper.numFixedLength(params.price, this.tradePriceDigit)
      // this.volumn = this.$Helper.numFixedLength(params.totalVolume, this.tradePriceDigit)
      this.setPrecent()
      // }
    },
  },
  activated() {
    removeListenRuner('fbOrders')
    removeListenRuner('reloadSymbolKline')
  },
  created() {
    // show loading
    setTimeout(() => this.$Helper.emitAction('loading', { show: true }), 100)
    this.getTradeList()
    reloadOrders()
    // when click market symbol list, change trade coin
    // 点击左侧行情时，切换币种
    this.$Helper.onAction('MarketChoseTrade', params => {
      this.$Helper.emitAction('loading', { show: true })
      this.getTradeList({params})
    })
    // when get quotation' socket, caculate the trade list
    // 收到socket推送时，更新行情信息
    this.$Helper.onAction('reloadQuotation', ({list}) => {
      if (list.lastPrice < 0 || !this.lastPrices) return
      let lastPrices = this.lastPrices
      lastPrices[list.symbol] = list
      this.caculateTradeList(lastPrices)
    })
    // 收到socket推送时，计算最新盘口信息
    this.$Helper.onAction('reloadGearQuotation', ({list}) => {
      this.gearTradeList(list)
    })
    // when receive order's socket, judge it orderStatus, and when it same symbol, reload the avilible list
    // 收到订单数据时，更新可用列表
    this.$Helper.onAction('reloadAvalibleList', ({symbol}) => {
      if (symbol === this.symbol && this.uid) this.reloadAvalibleList()
    })
  },
  mounted() {},
  beforeDestroy() {
    // 销毁创建的监听组件
    this.$Helper.destroy('MarketChoseTrade')
  },
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .mescroll{
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto; /*如设置bottom:50px,则需height:auto才能生效*/
  }
  .container {
    background: #fff;
    .head{
      height: 12vw;
      background: white;
      padding: 0 2vw;
      .name{
        font-size: 4.6vw;
        font-weight: 600;
        color: @icon-color;
        i{
          font-size: 5vw;
          margin-right: 2vw;
          color: @icon-color;
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
      .top{
        background: white;
        padding: 3vw;
        .left{
          width: 56%;
          padding-right: 3vw;
          .left-top{
            .select {
              font-size: 5vw;
              font-weight: 600;
              margin-right: 7vw;
              padding-bottom: 1vw;
              // border-bottom: 3px solid transparent;
              border-bottom-width: 3px;
              border-bottom-style: solid;
              // border-bottom-color: transparent;
              position: relative;
              transition: all 0.4s;
              &.hide{
                border-color: transparent !important;
              }
            }
            .switch{
              font-size: 4vw;
              color: @icon-color;
              i{
                font-size: 2.7vw;
                color: #aaa;
                margin-left: 1vw;
              }
            }
          }
          .number-about{
            font-size: 3vw;
            color: #aaa;
            margin-top: 1vw;
            &.active{
              color: #aaa;
            }
          }
          .sent-num{
            font-size: 3.6vw;
            .left-c{
              padding-right: 1vw;
            }
            .right-c{
              color: @icon-color;
              text-align: right;
            }
          }
          .about-num{
            font-size: 3vw;
            color: #aaa;
          }
          .btn{
            height: 12vw;
            color: white;
            font-size: 4.5vw;
            font-weight: 600;
            margin-top: 3vw;
          }
          .range{
            height: 16vw;
            margin: 1.5vw 0;
          }
        }
        .right{
          .right-num{
            font-size: 3.5vw;
            padding: 1vw 0;
            font-weight: 600;
            margin-top: 3vw;
            span{
              font-size: 3vw
            }
          }
          .right-info{
            color: #999;
            font-size: 3.2vw;
            margin-bottom: 4vw;
          }
        }
      }
    }
  }
  .login-btn{
    text-align: center;
    height: 11vw;
    line-height: 11vw;
    width:100%;
    margin: 0 auto;
    background: #aaa;
    color: #fff;
    font-size: 4.2vw;
    font-weight: 600;
    transition: all .4s;
  }
  .login-btn.active{
    background:#64acf5
  }
</style>
