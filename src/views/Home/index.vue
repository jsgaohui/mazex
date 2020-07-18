<template lang="html">
  <div class="container box box-row" ref="routerView">
    <div v-if="!errorStatus" class="box box-row box-row-flex">
      <div class="head box box-y-center">
        <div class="head-l">
        <img src="static/images/masex.png"/>
        <div class="lang-con box box-item" @click="showLanguageSelct">
          <div v-for="(item, key) of countryArr">
            <div v-if="item.key===language">{{item.name}}</div>
          </div>
          <i class="iconfont">&#xe61f;</i>
        </div>
        </div>
        <div class="head-r">
          <div v-if="!uid">
            <span @click="Run('Login')">{{ $t('basic.login') }}</span>|<span @click="Run('EmailRegister')">{{ $t('basic.register') }}</span>
          </div>
          <i class="iconfont" @click="setting" style="font-size:5vw;">&#xe630;</i>
        </div>
        <!--<div class="btn-con box box-col-flex box-x-right" v-if="!uid && symbolList && symbolList.length > 0">-->
          <!--<div class="btn box box-item" @click="Run('Login')">-->
            <!--{{ $t('basic.login') }}-->
          <!--</div>-->
        <!--</div>-->
      </div>
      <div class="overflow-y box-row-flex">
        <!--<mescroll-vue class="mescroll" @init="scrollInit" :down="mescrollDown">-->
          <div class="my-money" v-if="uid && symbolList && symbolList.length > 0">
            <!-- <ILabel :title="$t('home.my_assets')">
              <i class="iconfont" @click="showFund=!showFund">&#xe61c;</i>
            </ILabel> -->
            <div class="half-x-line"/>
            <div class="bd">
              <dl class="box">
                <dt class="box box-item">
                  <i class="iconfont">&#xe641;</i>
                </dt>
                <dd class="box-col-flex">
                  <h3>{{ $t('home.udax_fund_count') }}({{sellteMarket}})</h3>
                  <p class="box box-y-center" v-if="showFund">
                    <span>{{ $Helper.numFixedLength(sumGold, 3, 15) }}</span>
                    ≈{{ $Helper.formatAmount(sumMoney) }} {{ currencyRate }}
                  </p>
                  <p v-else style="font-size: 4vw;padding-top:1vw;">
                    ********
                  </p>
                </dd>
              </dl>
            </div>
          </div>
          <!-- <div class="my-money" v-if="!uid && symbolList && symbolList.length > 0" :style="{backgroundImage: `url('static/images/home_notlogin.jpeg')`}">
            <ILabel :title="$t('home.my_assets')" style="background: transparent;"/>
            <h2>{{ $t('home.login_can_see') }}</h2>
            <div class="btn box box-item" @click="Run('Login')">
              {{ $t('basic.login') }}
            </div>
          </div> -->
          <Slider :images="sliderArr" @tap="tapFn" v-if="sliderArr && sliderArr.length > 0"/>
          <Notice :list="noticeList" @tap="openNoticeDetail" v-if="noticeList && noticeList.length > 0"/>
          <div class="half-x-line"/>
          <div class="hot-hangq box" v-if="symbolList && symbolList.length > 0">
            <div class="box-col-flex" v-for="(item, key) of symbolList.slice(0, 3)" :key="key"
                 @click="openDetail(item)">
              <h2>{{ item.symbol }}</h2>
              <h3 class="error-color">{{ $Helper.numFixedLength(item.lastPrice, item.tradePriceDigit, 30)}}</h3>
              <p :class="{'right-color': item.rose && item.rose >= 0, 'error-color': !item.rose || item.rose < 0}">{{
                item.rose }}%</p>
            </div>
          </div>
          <ul class="nav-bar">
            <li @click="toHelp()">
              <i class="iconfont nav-icon">&#xe663;</i>
              <h3>{{ $t('basic.help') }}</h3>
            </li>
            <li @click="selectDcCode(0)">
              <i class="iconfont nav-icon">&#xe661;</i>
              <h3>{{ $t('basic.recharge') }}</h3>
            </li>
            <li @click="selectDcCode(1)">
              <i class="iconfont nav-icon">&#xe662;</i>
              <h3>{{ $t('basic.extract') }}</h3></li>
          </ul>
          <!-- <div class="top-list" v-if="symbolList && symbolList.length > 0">
            <ILabel :title="$t('home.rise_list')"/>
            <div class="half-x-line"></div>
            <IListOne :list="symbolList" :rateList="rateList" :currencyRate="currencyRate"/>
          </div> -->
          <Market style="margin-top: 2vw;" :style="{height: symbolListHeight + 'vw'}"/>
        <!--</mescroll-vue>-->
      </div>
    </div>
    <error-status :status="errorStatus" class="box-row-flex" v-else style="background: #fff"/>
    <div v-show="showdown" style="display:block;position:fixed;left:0;right:0;bottom:13.5vw;width:100%;height:79px;z-index: 10000;">
      <i @click="closeapp" class="iconfont" style="position: absolute;roght:0px;top:-7px;font-size:25px;color:#646da9;z-index:9999">&#xe623;</i>
      <div style="position:relative;top:0;left:0; z-index: 9998;" @click="downapp">
        <img src="static/images/down-adc.png" style="width:100%;position: absolute;left:0;top:0;">
        <div style="position:absolute;left:2vw;height:79px;display:flex;justify-content:flex-start;align-items: center;">
          <div style="width:20%;"><img src="static/images/masex.png" style="width:100%"></div>
          <div style="width:49%;color:#fff;font-size:14px;margin:0px 2vw;">
            <h2 style="font-size:5.5vw">MASEx APP</h2>
            <P>{{$t('home.fasttrade')}}</P>
          </div>
          <div style="width:25%;background:#fff;padding:1.5vw 2vw;border-radius:2vw;color:#646da9;font-size:4vw;display:flex;justify-content:center;align-items: center;"><i class="iconfont" style="color:#646da9">&#xe64c;</i>{{$t('home.downloadapp')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Slider from './Slider'
import Component from '@/components'
import basicMixin from '@/mixin/basic'
import Market from '../Market'
import Notice from './Notice'
import _ from 'lodash'
import {mapState} from 'vuex'
// import { addQueue } from '@/lib/debonce'
import MescrollVue from 'mescroll.js/mescroll.vue'
import {removeListenRuner} from '@/lib/quotation'
export default {
  name: 'Home',
  components: {
    Slider,
    Notice,
    Market,
    MescrollVue,
    ...Component,
  },
  mixins: [basicMixin],
  data() {
    return {
      showdown: false,
      adviceList: [],
      socket: null,
      noticeList: [],
      showFund: true,
      errorStatus: null,
      symbolListHeight: 100,
      downTip: this.$t('basic.login'),
      downReTip: this.$t('basic.login'),
      loadTip: this.$t('basic.login'),
      lastRefreshTime: 0,
      mescroll: null, // mescroll实例对象
      dcCodeList: [], // 可用代币列表
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
      countryArr: [
        {
          name: '中文',
          // img: 'zh',
          key: 'zh',
        },
        {
          name: '한국어',
          // img: 'ko',
          key: 'ko',
        },
        {
          name: 'English',
          // img: 'pro',
          key: 'en',
        },
        {
          name: 'Indonesia',
          // img: 'pro',
          key: 'in',
        },
      ],
    }
  },
  computed: {
    ...mapState('basic', ['uid']),
    ...mapState('setting', ['language']),
    sliderArr() {
      return this.adviceList.map(item => ({
        ...item,
        imgUrl: item.url,
      }))
    },
    symbolList() {
      // return _.map(this.lastPrices, item => item)
      let lastPrices = this.lastPrices || {}
      let symbolMap = {}
      _.map(this.symbolMap, (tradeArr, tradeName) => {
        symbolMap[tradeName] = tradeArr.map(item => {
          if (item && item.symbol) {
            return lastPrices[item.symbol] || item
          }
        })
      })
      let returnArr = []
      _.map(symbolMap, item => {
        if (item && item.length > 0) returnArr = returnArr.concat(item.filter(s => !!s))
      })
      return returnArr
    },
  },
  watch: {},
  methods: {
    toHelp() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'Help',
          type: 'right',
        }
      )
    },
    // 查询可用的币种
    queryAvailbleDcCode(type) {
      this.$Helper.ajax({
        url: '/app/common/availableDcCodeList.api',
      })
        .then(
          data => {
            this.dcCodeList = _.get(data, 'rows') || []
            this.openModal(type)
          },
        )
    },
    // 选择币种
    // 0代表可充值 1代表可提币
    selectDcCode(type) {
      // if (this.dcCodeList.length === 0) {
      this.queryAvailbleDcCode(type)
      // } else {
        // this.openModal(type)
      // }
    },
    openModal(type) {
      var list = []
      if (type === 0) {
        // 可以充值
        this.dcCodeList.forEach((item) => {
          if (item.canRecharge === 0) {
            list.push(item.dcCode)
          }
        })
      } else {
        // 可以提现
        this.dcCodeList.forEach((item) => {
          if (item.canWithdraw === 0) {
            list.push(item.dcCode)
          }
        })
      }
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'DcCodeSelect',
          type: 'right',
          params: {
            dcCodeList: list,
            callback: item => {
              if (!this.uid) {
                this.$Helper.jumpPage('Login', this)
                return
              }
              // 跳转充值页面
              if (type === 0) {
                this.$Helper.jumpPage({name: 'HtRecharge', query: { dcCode: item }}, this)
              } else {
                // 跳转提现页面
                this.$Helper.jumpPage({name: 'Extract', query: { dcCode: item }}, this)
              }
            },
          },
        }
      )
    },
    setting() {
      // let $this = this
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'HomeSetting',
          type: 'right',
          params: {
            // initParam: $this.optionParam,
            // callback: item => {
            //   $this.$Helper.copyProperties(item, this.listQuery)
            //   this.listQuery.payMethod = item.payId
            //   this.listQuery.page = 1
            //   this.orderList = []
            //   $this.initOrderList()
            // },
          },
        },
      )
    },
    showLanguageSelct() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'BottomSelect',
          type: 'up',
          params: {

            active: this.language,
            list: this.countryArr.map(item => ({
              // text: `<img src="static/lang/${item.img}.png" style="height: 7vw; margin-right: 2vw;"/> ${item.name}`,
              text: `${item.name}`,
              hander: () => {
                this.setLanguage(item.key)
              },
            })),
          },
        },
      )
    },
    setLanguage(language) {
      if (language === this.language) return
      this.$store.dispatch('setting/setData', { language })
      this.$Helper.emitAction('loading', { show: true })
      this.initSymbolList()
    },
    tapFn(data) {
      if (data.extendUrl) window.location.href = data.extendUrl
    },
    initSymbolList() {
      this.$Helper.ajax({
        url: '/app/appInitQuotation.api',
      })
      .then(
        data => {
          let { adviceList, symbolMap, noticeList, lastPrices, rateList, currencyRate, sellteMarket } = _.get(data, 'data') || {}
          if (adviceList && this.$Helper.isType(adviceList, [])) {
            this.adviceList = adviceList.filter(item => item.clientType !== 'PC')
          }
          if (noticeList && this.$Helper.isType(noticeList, [])) {
            this.noticeList = noticeList
          }
          // update the store
          // 获取信息，更新store
          this.$store.dispatch('quotation/refreshData', { rateList, lastPrices, symbolMap, currencyRate, sellteMarket })
          this.$Helper.emitAction('loading', { show: false })
          if (this.uid) this.initSymbolCapital()
          // get max symbol list height
          // 获取列表数据最多的子项，动态计算高度
          let maxNum = _.max(_.map(symbolMap, item => item.length))
          this.symbolListHeight = maxNum * 16 + 12
        },
        () => {
          this.setErrorStatus('error')
        },
      )
    },
    initSymbolCapital() {
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
        () => {
          this.setErrorStatus('error')
        },
      )
    },
    openNoticeDetail(data) {
      this.$Helper.jumpPage({name: 'NoticeDetail', params: data}, this)
    },
    openDetail(item) {
      this.$Helper.jumpPage({name: 'TradeDetail', params: item}, this)
    },
    setErrorStatus(status) {
      this.$Helper.emitAction('loading', { show: false })
      if (!this.currencyRate) {
        this.errorStatus = status
      } else {
        this.$Helper.emitAction('toast', {
          text: this.$t('basic.web_error'),
        })
      }
    },
    Run(name) {
      if (this.$Helper.isType(name, () => {})) {
        name.call(this)
        return
      }
      this.$Helper.jumpPage(name, this)
    },
    scrollInit(mescroll) {
      this.mescroll = mescroll
    },
    downRefresh() {
      let timestamp = Date.parse(new Date())
      if (timestamp - this.lastRefreshTime > 1500) {
        this.lastRefreshTime = timestamp
        this.$Helper.emitAction('loading', {show: true})
        this.initSymbolList()
      }
      this.mescroll.endSuccess()
    },
    closeapp() {
      this.showdown = false
    },
    downapp() {
      this.$Helper.jumpPage('downapp', this)
    },
  },
  activated() {
    removeListenRuner('reloadOrders')
    removeListenRuner('fbOrders')
    removeListenRuner('reloadSymbolKline')
    removeListenRuner('reloadGearQuotation')
    this.errorStatus = null
    if (!this.currencyRate) this.$Helper.emitAction('loading', { show: true })
    this.initSymbolList()
  },
  mounted() {
    if (!this.$Helper.isApp()) {
      this.showdown = true
    }
    // let s = 1
    // setInterval(() => {
    //   addQueue(
    //     {
    //       symbol: 'ETH',
    //       s,
    //     },
    //     (res) => {
    //       console.log('addQueue call now', res)
    //     },
    //   )
    //   s++
    // }, 2000)
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
    overflow-x: hidden;
    overflow-y: auto;
    .head{
      background: white;
      height: 11vw;
      padding: 0 3vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .head-l{
        display:flex;
        justify-content: flex-start;
        align-items: center;
        &>img{
          height: 7vw;
        }
      }
      .lang-con{
        padding: 0 5vw;
        img{
          height: 6vw;
          margin-right: 2vw;
        }
        i{
          font-size: 3.6vw;
          color: #777;
        }
      }
      .btn{
        color: #646da9;
        height: 7.5vw;
        font-size: 3.4vw;
      }
      .head-r{
        color:#646da9;
        display:flex;
        justify-content: flex-end;
        align-items: center;
        font-size:3.6vw;
        span{
            padding:0 2vw;
        }
        i{
          margin-left:2vw;
          font-size:4vw;
        }
      }
    }
    .hot-hangq{
      background:#fff;
      padding:20px 0px;
      line-height: 24px;
      overflow: hidden;
      &>div{
        padding-left:3vw;
        border-right:1px solid #e5e5e5;
        // float:left;
        // color:#F55858;
        // color:#03C087;
        &:last-child{
          border-right:none;
        }
        h2{
          font-size: 4vw;
          color:#646da9;
        }
        h3{
          font-size:3.8vw;
        }
        p{
          font-size:3.2vw;
          font-weight: bold;
        }
      }
    }


    .notice{
      height:10vw;
      padding:0px 15px;
      font-size:3.6vw;
      color:@icon-color;
      background: white;
      i{
        font-size:3.8vw;
        margin-right:2vw;
      }
    }


    .my-money {
      overflow:hidden;
      background: #fff;
      background-size: auto 100%;
      background-position: 100% center;
      background-repeat: no-repeat;
      h2{
        margin-top: 3vw;
        margin-bottom: 5vw;
        padding-left: 3vw;
      }
      .btn{
        background: #646da9;
        color: white;
        height: 10vw;
        width: 35vw;
        margin-bottom: 3vw;
        font-size: 4vw;
        margin-left: 3vw;
      }
      .bd{
        background: #fff;
        dl{
          width:100%;
          &:last-child {
            dd{
              border-bottom:none;
            }
          }
          dt{
            width:18%;
            i{
              font-size:7vw;
            }
          }
          dd{
            float:left;
            width:85%;
            font-size:3.4vw;
            padding:5vw 0px;
            border-bottom:1px solid #e5e5e5;
            h3{
              font-weight: 400;
            }
            span{
              font-size:5vw;
              color:#000;
              margin-right:10px
            }
          }
        }
      }
    }


    .top-list {
      background: white;
      margin-top: 2vw;
    }
  }
  .nav-bar{
    background:#fff;
    margin-top:2vw;
    padding:2vw 4vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li{
      display:flex;
      align-items: center;
      flex-direction: column;
      width:33%;
      .nav-icon{
        background: #646da9;
        border: 1px solid #646da9;
        border-radius: 100%;
        width: 9vw;
        height: 9vw;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2vw 0 2vw 0;
        color: #fff;
        font-size:5vw;
      }
    }
  }

</style>
