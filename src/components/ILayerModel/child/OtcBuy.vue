<template lang="html">
  <div class="layout"  style="width:100%">
      <!--购买-->
      <div class="container box box-row router-view "  style="width:100%" v-if="item">
        <div class="head box">
          <div class="left box box-item"><i class="iconfont" @click="closeDialog()"></i></div>
          <div class="name box box-item box-col-flex">
            <span>{{item.direction === 1 ? $t('otc.sell'):$t('otc.buy')}}&nbsp;{{item.dcCode}}</span>
          </div>

        </div>
        <div class="half-x-line"></div>
        <div class="otc-list-con box-row-flex">
          <div class="list">
            <div class="hd box box-space-bettwen">
              <div>{{item.nickName}}</div>
              <div>{{item.currOrderPrice}}&nbsp;{{item.currencySymbol}}</div>
            </div>
            <div class="half-x-line"></div>

            <div class="bd box box-space-bettwen">
              <div class="left box box-row">
                <span>{{$t('otc.quota')}}&nbsp;{{item.limitMin}}&nbsp;-&nbsp;{{item.limitMax}}&nbsp;{{item.currencySymbol}}</span>
                <span>{{$t('otc.quantity')}}&nbsp;{{item.availableVolume}}&nbsp;{{item.dcCode}}</span>
                <span v-if="item.direction===1">{{$t('otc.available')}}&nbsp;{{$Helper.format(availableAmount, 2)}}&nbsp;{{item.dcCode}}
                  <b style="color:#646da9" @click="toAssert()">{{$t('otc.transferToMore')}}</b>
                </span>
              </div>
              <div class="right box-col-5">
                    <span class="box box-x-right">
                        <div  :class="'pay-icon'+' '+p.cssName+'-bg'" v-for="(p,index) in orderPayType">
                                          <label><i  :class="'iconfont icon-'+p.cssName"></i></label>
                                        </div>


                    </span>
                <!--<span class="more box box-x-right"><i class="iconfont">&#xe612;</i></span>-->
              </div>
            </div>
          </div>
          <div class="otc-buycon">
            <div class="from-main">
              <div class="from-box box box-space-bettwen">
                <div class="left"><i class="iconfont">&#xe66b;</i></div>
                <div class="right">
                  <div class="input-t box box-space-bettwen"><input type="number" style="width:100%" :placeholder="maxBuyVolume" v-model="buyParam.tradeVolume" @change="changeAmount()">
                    <!--<span><i class="iconfont">&#xe671;</i></span>-->
                  </div>
                  <div class="line"></div>
                  <div class="input-t box box-space-bettwen"><input type="number" style="width:100%" :placeholder="maxBuyPrice" v-model="buyParam.tradeAmount" @change="changeVolume()"></div>
                </div>
              </div>
              <div class="from-box pwd box box-space-bettwen">
                <div class="left"></div>
                <div class="right">
                  <div class="input-t box box-y-center box-space-bettwen">
                    <div>
                      <i class="iconfont icon-pwd">&#xe672;</i>
                      <input type="password" :placeholder="$t('payment.tradePwdIsNull')" v-model="buyParam.payPassword" maxlength="6" style="width:70vw;">
                    </div>
                    <!--<span>有效期2小时</span>-->
                  </div>
                </div>
              </div>

              <div class="check-wrapper box box-space-bettwen">
                <label role="checkbox" class="checkbox-wrapper is-checked" aria-checked="true">
                          <span aria-checked="mixed" class="checkbox-input is-checked">
                            <!--<span class="checkbox-inner"></span>-->
                            <input type="checkbox" aria-hidden="true" v-model="protocol">
                          </span>
                  <span class="checkbox__label">{{$t('otc.agreedToTheTransaction')}}</span>
                  <span class="checkbox__label" @click.prevent="showDiv=true">{{$t('otc.legalCurrencyTradingInstructions')}}</span>
                </label>
                <span style="color:#646da9;text-align:right;padding-left:2vw;" class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span>
              </div>

              <div style="padding-bottom:3vw;color:#646da9;text-align: right"><span v-if="item.direction===1"><em @click='showAddPayment()'><template  v-if='userPaymentList && userPaymentList.length < 1'>({{$t('payment.addPayMethod')}})</template></em></span></div>
              <div class="otc-btn box box-space-bettwen">
                <div class="btn-cancel" @click="closeDialog">{{lockTime}}S&nbsp;{{$t('otc.cancel')}}</div>
                <div class="btn-cancel" v-if="ifCanOrder" @click="buyOrder" style="margin-left:4vw;">{{$t('otc.confirm')}}{{item.direction === 1 ? $t('otc.sell'):$t('otc.buy')}}</div>
                <div class="btn-order" v-else >{{$t('otc.confirm')}}{{item.direction === 1 ? $t('otc.sell'):$t('otc.buy')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!--交易须知--->
    <div class="tip-bg" @click="showDiv=!showDiv"  v-show="showDiv"></div>
    <div class="tip-box "  style="display:block;top:10%;"  v-show="showDiv" >
      <div class="tip-top" style="background:#ecf0f7;height:12vw;line-height:12vw;font-size:4.5vw;color:#1f405a;">
        <div>{{$t('otc.tradingInstructionsTitle')}}</div>
        <div class="tip-close" ><i class="iconfont" @click="showDiv=!showDiv">&#xe620;</i></div>
      </div>

      <div class="tip-con" style="padding:0;">
        <div style="padding:4vw 9vw;font-size:3.6vw;line-height:7vw;color:#1f405a;text-align: left;height:100vw" class="overflow-y">
          <p>
            <template v-for="k in 13">
               {{$t('otc.tradingInstructionsDes'+k)}}<br/>
            </template>
          </p>

        </div>
        <div class="btn box box-space-bettwen" style="background:none">
          <div style="width:50%;background:#ecf0f7;color:#646da9" @click="disAgree()" >{{$t('otc.disagree')}}</div>
          <div class="bottom-btn02 active" style="width:50%;" @click="agree()" >{{$t('otc.agree')}}</div>
        </div>
      </div>
    </div>

      <!--购买END-->
    <error-status :status="errorStatus" />
    </div>
</template>
<script>
import ErrorStatus from '@/components/ErrorStatus'
import {mapState} from 'vuex'
import _ from 'lodash'
export default {
  components: {
    ErrorStatus,
  },
  data() {
    return {
      showDiv: false,
      availableAmount: 0, // 账户代币可用数量
      protocol: [null],
      interval: null,
      userPaymentList: [], // 用户收款方式
      makerOrderId: '',
      dcCode: '', // 购买的币种
      item: null, // 订单信息
      lockTime: 60, // 弹窗关闭时间
      buyParam: {
        tradePrice: 0, // 交易价格
        tradeAmount: '', // 交易数量
        payPassword: '', // 交易密码
        makerId: 0, // 订单号
        tradeVolume: '', // 买入量
      },
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('basic', ['uid', 'isValid', 'isMerchant', 'isExitTradePwd', 'mobile']),
    agree() {
      this.showDiv = !this.showDiv
      this.protocol = [null]
    },
    disAgree() {
      this.showDiv = !this.showDiv
      this.protocol = []
    },
    // 订单选择的支付方式
    orderPayType() {
      let $this = this
      return this.item.payTypeList.filter(payType => $this.item.payTypes.indexOf(payType.paymentTypeId + '') !== -1)
    },
    // 是否可以下单
    ifCanOrder() {
      if (Number.parseFloat(this.buyParam.tradeVolume) > 0 && Number.parseFloat(this.buyParam.tradeAmount) > 0 && this.buyParam.payPassword !== '' && this.protocol.length > 0) {
        return true
      }
      return false
    },
    // 最大购买数量
    maxBuyVolume() {
      return this.$t('otc.maxDcCode') + (this.item.direction === 2 ? this.$t('otc.buy') : this.$t('otc.sell')) + ' ' + this.$Helper.format(this.maxAailableAmount, 2) + ' ' + this.item.dcCode
    },
    maxAailableAmount() {
      if (this.item.direction === 1) {
        return this.item.availableVolume > this.availableAmount ? this.availableAmount : this.item.availableVolume
      } else {
        return this.item.availableVolume
      }
    },
    // 最大法币的购买量
    maxBuyPrice() {
      return this.$t('otc.maximumSingleLimit') + ' ' + Math.floor(Number.parseFloat(this.maxAailableAmount * this.item.currOrderPrice) * 100) / 100 + ' ' + this.item.currencySymbol
    },
    errorStatus() {
      // let item = null
      if (!this.uid) {
        return 'loginout'
      }
    },
  },
  watch: {
  },
  methods: {
    toAssert() {
      this.$Helper.replaceHis('Account')
      this.$Helper.jumpPage({name: 'OtcAssert'}, this)
    },
    toPassword() {
      // 跳转重构之密码页面
      this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
    },
    // 买入量变化  买入价格相应变化
    changeAmount() {
      let min = this.item.limitMin // 最小法币购买量
      let max = this.item.limitMax // 最大法币购买量
      // 大于可用数量 强制置为最大数量
      if (Number.parseFloat(this.buyParam.tradeVolume) > Number.parseFloat(this.item.availableVolume)) {
        this.buyParam.tradeVolume = this.item.availableVolume
      }
      this.buyParam.tradeAmount = this.buyParam.tradeVolume * this.item.currOrderPrice
      // 数量*单价 < 最小法币购买量
      if (Number.parseFloat(this.buyParam.tradeVolume * this.item.currOrderPrice) < Number.parseFloat(min)) {
        this.buyParam.tradeAmount = Number.parseFloat(min)
        this.buyParam.tradeVolume = Number.parseFloat(this.buyParam.tradeAmount) / Number.parseFloat(this.item.currOrderPrice)
      }
      // 数量*单价 > 最大法币购买量
      if (Number.parseFloat(this.buyParam.tradeVolume * this.item.currOrderPrice) > Number.parseFloat(max)) {
        this.buyParam.tradeAmount = Number.parseFloat(max)
        this.buyParam.tradeVolume = Number.parseFloat(this.buyParam.tradeAmount) / Number.parseFloat(this.item.currOrderPrice)
      }
      // 大于可用数量 强制置为最大数量
      if (Number.parseFloat(this.buyParam.tradeVolume) > Number.parseFloat(this.item.availableVolume)) {
        this.buyParam.tradeVolume = this.item.availableVolume
        this.buyParam.tradeAmount = this.buyParam.tradeVolume * this.item.currOrderPrice
      }
      this.buyParam.tradeAmount = this.$Helper.floor(this.buyParam.tradeAmount, 2)
      this.buyParam.tradeVolume = this.$Helper.format(this.buyParam.tradeVolume, 8)
    },
    // 买入价格变化  买入量相应变化
    changeVolume() {
      let min = this.item.limitMin // 最小法币购买量
      let max = this.item.limitMax // 最大法币购买量
      // 输入的的总价大于  可用* 价格
      if (Number.parseFloat(this.buyParam.tradeAmount) > Number.parseFloat(this.item.availableVolume * this.item.currOrderPrice)) {
        this.buyParam.tradeVolume = this.item.availableVolume
        this.buyParam.tradeAmount = Number.parseFloat(this.item.availableVolume * this.item.currOrderPrice)
      }
      if (Number.parseFloat(this.buyParam.tradeAmount) < Number.parseFloat(min)) {
        this.buyParam.tradeAmount = Number.parseFloat(min)
        this.buyParam.tradeVolume = Number.parseFloat(this.buyParam.tradeAmount) / Number.parseFloat(this.item.currOrderPrice)
      }
      if (Number.parseFloat(this.buyParam.tradeAmount) > Number.parseFloat(max)) {
        this.buyParam.tradeAmount = Number.parseFloat(max)
        this.buyParam.tradeVolume = Number.parseFloat(this.buyParam.tradeAmount) / Number.parseFloat(this.item.currOrderPrice)
      }
      this.buyParam.tradeAmount = this.$Helper.floor(this.buyParam.tradeAmount, 2)
      this.buyParam.tradeVolume = this.$Helper.floor(Number.parseFloat(this.buyParam.tradeAmount) / Number.parseFloat(this.item.currOrderPrice), 8)
      if (this.$Helper.floor(this.maxAailableAmount * this.item.currOrderPrice, 2) === this.buyParam.tradeAmount) {
        this.buyParam.tradeVolume = this.$Helper.format(this.maxAailableAmount, 2)
      }
    },
    closeDialog() {
      this.$Helper.emitAction('closeModel')
      let fn = this.params.callback
      if (fn && this.$Helper.isType(fn, () => {})) fn()
    },
    queryOrder() {
      this.$Helper
      .ajax({
        url: '/app/otc/' + this.buyParam.makerId + '/getOtcOrder.api',
        method: 'POST',
      })
      .then(({data, code}) => {
        this.item = _.get(data, 'data')// 订单数据
        this.lockTime = _.get(data, 'lockTime') // 弹窗关闭时间
        this.userPaymentList = _.get(data, 'userPaymentList') // 弹窗关闭时间
        this.buyParam.tradePrice = this.item.currOrderPrice // 当前对应法币的价格
        this.initLockTime()
         // 1 代表商户挂买单  2代表挂卖单
        if (this.item.direction === 1) {
          this.queryAssert(this.item.dcCode)
          this.loadPayType() // 查询收款方式
        }
      })
    },
    // 查询用户otc账户指定代币可用数量
    queryAssert(dcCdoe) {
      this.$Helper
        .ajax({
          url: '/app/otc/' + dcCdoe + '/otcAssertByDccode.api',
          method: 'POST',
        })
        .then(({data, code}) => {
          this.availableAmount = data // 代币可用数量
        })
    },
    // 处理锁定时间,锁定时间之后 关闭弹窗
    initLockTime() {
      let $this = this
      $this.interval = setInterval(function() {
        $this.lockTime = $this.lockTime - 1
        if ($this.lockTime <= 0) {
          $this.closeDialog()
        }
      }, 1000)
    },
    validate() {
      if (!this.mobile) {
        this.$Helper.toast(this.$t('otc.needPhone'))
        return
      }
      if (this.isValid !== 2) {
        this.$Helper.toast(this.$t('otc.notValid'))
        return
      }
      // 用户卖币需要判断账户余额
      if (this.item.direction === 1) {
        if (Number.parseFloat(this.buyParam.tradeVolume) > Number.parseFloat(this.availableAmount)) {
          this.$Helper.toast(this.$t('fund.balance_not_enough'))
          return false
        }
        if (!this.userPaymentList || this.userPaymentList.length < 1) {
          this.$Helper.toast(this.$t('otc.payTypeTips'))
          return false
        }
      }
      return true
    },
    // 弹出添加窗口
    showAddPayment(payType) {
      let $this = this
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'Payment',
          type: 'right',
          params: {
            callback: item => {
              $this.loadPayType()
            },
          },
        })
    },
    // 加载我的支付类型
    loadPayType() {
      this.$Helper
        .ajax({
          url: '/app/otc/myPayType.api?ifValid=true',
          method: 'POST',
        }).then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.userPaymentList = _.get(data, 'myPayMethod') // 我的支付方式
          }
        })
    },
    // 下单
    buyOrder() {
      if (!this.validate()) return
      let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/buyOrder.api',
          method: 'POST',
          params: $this.buyParam,
        })
        .then(({code, data, msg}) => {
          // 提示信息
          if (this.$Helper.dealHttpCode(code, msg)) {
            // 关闭弹窗
            this.closeDialog()
            // 跳转到待付款页面
            setTimeout(() => this.$Helper.dialog('OtcPendingPayment', 'right', { takeOrderNo: data.takerOrderId }, this.$store), 100)
          }
        })
    },
  },
  created() {
    // 初始化参数
    this.buyParam.makerId = this.params.orderId
    this.queryOrder()
  },
  mounted() {},
  destroyed() {
    window.clearInterval(this.interval)
  },
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');

  .otc-list-con{
    background: #f9f9fc;
  }
</style>
