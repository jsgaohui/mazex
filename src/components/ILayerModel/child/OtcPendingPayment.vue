<template lang="html">
  <div class="layout "  style="width:100% " v-if="item">
    <!--付款-->
    <div  class="container box box-row router-view  " style="width:100%" >
      <div class="head box">
        <div class="left box box-item"><i data-v-2b663b10="" class="iconfont" @click="toOtcOrder(1)"></i></div>
        <div class="name box box-item box-col-flex">
          <span>{{$t('otc.pendingPayment')}}</span>
        </div>

      </div>
      <div class="half-x-line"></div>
      <div class="payment-con box-row-flex overflow-y">
        <div class="money-box box box-space-bettwen">
          <div class="left">
            <div class="box box-space-bettwen"><label>{{$t('otc.theTransactionAmount')}}</label><span>{{$Helper.format(Number.parseFloat(item.orderPrice*item.orderVolume),2)}}&nbsp;{{item.currencySymbol}}</span></div>
            <div class="line"></div>
            <div class="box box-space-bettwen"><label>{{$t('otc.waitingForBuyersPayment')}}</label><span>{{remainTime}}</span></div>
          </div>
          <div class="coin-icon"><div class="coin-bg"><i class="iconfont" v-html="caculateIcon(item.dcCode)" /> </div></div>
        </div>
        <div class="pay-info">
          <div class="pay-td">
            <label>{{$t('otc.oddNumber')}}</label><span>{{formParam.takerId}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.price')}}</label>
            <span>{{Number.parseFloat(item.orderPrice)}}&nbsp;{{item.currencySymbol}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.quantity')}}</label><span>{{Number.parseFloat(item.orderVolume)}}&nbsp;{{item.dcCode}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.time')}}</label><span>{{item.createTime}}</span>
          </div>

          <template v-for="(item,index) in payment">
            <div class="pay-txt box box-y-center box-x-left">
              <div :class="'pay-icon ' +item.cssName+'-bg'">
                <label><i :class="'iconfont icon-'+item.cssName"></i></label>
              </div>
              <label>{{item.paymentTypeName}}</label>
            </div>
            <div class="pay-td">
              <label>{{$t('otc.sellerName')}}</label><div><span>{{item.name}}</span><em @click="copyFn(item.name)">{{$t('invite.copy')}}</em></div>
            </div>
            <div v-if="item.paymentTypeId===1" class="pay-td"><label>{{$t('otc.bankName')}}</label><div><span>{{item.bankName}}</span><em @click="copyFn(item.bankName)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===1 && item.subBank" class="pay-td" ><label>{{$t('otc.subbranch')}}</label><div><span>{{item.subBank}}</span><em @click="copyFn(item.subBank)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===1" class="pay-td"><label>{{$t('otc.bankCardNumber')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===2" class="pay-td"><label>{{$t('otc.wechatAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===3" class="pay-td"><label>{{$t('otc.alipayAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===4" class="pay-td"><label>{{$t('payment.payPalAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===5" class="pay-td" style="align-items: flex-start"><label style="line-height:4vw;">{{$t('payment.westernUnionAccount')}}</label><div><span style="width:60%;word-break:break-all">{{item.swiftInfo}}</span><em @click="copyFn(item.bankName)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===6" class="pay-td"><label>{{$t('payment.swiftAccount')}}</label><div><span style="word-break:break-all">{{item.swiftInfo}}</span><em @click="copyFn(item.swiftInfo)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===7" class="pay-td"><label>{{$t('payment.payNowAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===8" class="pay-td"><label>{{$t('payment.PaytmAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===9" class="pay-td"><label>{{$t('payment.qiwiAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===10" class="pay-td"><label>{{$t('payment.interacAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===11" class="pay-td"><label>{{$t('payment.bankAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===11" class="pay-td"><label>{{$t('payment.ifscCode')}}</label><div><span>{{item.ifscCode}}</span><em @click="copyFn(item.ifscCode)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===11" class="pay-td"><label>{{$t('payment.bankHead')}}</label><div><span>{{item.bankName}}</span><em @click="copyFn(item.bankName)">{{$t('invite.copy')}}</em></div></div>
            <div v-if="item.paymentTypeId===12" class="pay-td"><label>{{$t('payment.UPIAccount')}}</label><div><span>{{item.account}}</span><em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
            <div class="pay-td" v-if="item.paymentTypeId===2 || item.paymentTypeId===3 || item.paymentTypeId===8 || item.paymentTypeId===12">
              <template v-if="item.qrCode"><label>{{$t('otc.qrCode')}}</label><div><span><i class="iconfont" @click="">&#xe64d;</i></span><em @click="blowUp(item.qrCode)">{{$t('otc.blowUp')}}</em></div></template>
            </div>
          </template>
        </div>
        <div class="info-box box box-x-left box-y-center">
          <i class="iconfont">&#xe685;</i>
          <p>1.{{$t('otc.doNotNote')}}<br/>
            2.{{$t('otc.consistentName')}}<br/>
            3.{{$t('otc.paymentReferenceCode')}}{{item.relatedCode}}
          </p>
        </div>
        <!-- 委托单是买入单,挂牌单是卖出单 买入的本人才可以操作 或者  委托单是卖出单,挂牌单是买入单 买入的本人才可以操作 -->

      </div>
      <div class="otc-btn box box-space-bettwen" style="padding:4vw;"  v-if="(item.direction===1 && id === item.userId) || (item.direction===2 && id === item.makerUserId) ">
        <div class="btn-cancel" @click="cancelDiv = true" v-if="!ifOverTime">{{$t('otc.cancelOrder')}}</div>
        <div class="btn-cancel" style="margin-left: 4vw"  @click="confirmDiv = true" v-if="!ifOverTime">{{$t('otc.iHavePaid')}}</div>
        <div class="btn-look" @click="goToAppeal(item)"  v-if="ifOverTime&&(!item.appealFlag||item.appealFlag===0)">{{$t('appeal.goToAppeal')}}</div>
        <div class="btn-look" @click="goViewAppealDetail(item)" v-if="ifOverTime&&item.appealFlag&&item.appealFlag!==0">{{$t('appeal.appealDetail')}}</div>
      </div>
    </div>
    <!--弹出窗口-->
    <div class="tip-bg" @click="imgDiv=!imgDiv"  v-show="imgDiv"></div>
    <div class="tip-box"  style="display:block;top:10%;"   v-show="imgDiv" @click="imgDiv=!imgDiv">
      <div class="tip-con" style="padding:0;" >
        <div style="padding:3vw 9vw;font-size:3.8vw;line-height:7vw;color:#1f405a;">
           <img :src="imgUrl" />
        </div>
      </div>
    </div>
    <!--选择支付方式--->
    <div class="tip-bg"  @click="confirmDiv=!confirmDiv" v-show="confirmDiv"></div>
    <div class="tip-box"   style="top:initial;left:0;right:0;bottom:0"  v-show="confirmDiv" >
      <div class="tip-top">
        <div>{{$t('otc.paymentMethod')}}</div>
        <div class="tip-close" ><i class="iconfont"  @click="confirmDiv=!confirmDiv">&#xe620;</i></div>
      </div>
      <div class="half-x-line"></div>
      <div class="tip-con">
        <div class="content">
          <!--<h3>支付金额 <span class="color-sell">300.00</span>CNY</h3>-->
          <p>{{$t('otc.supportedPayment')}}</p>
        </div>
        <template v-for="(p,index) in payment">
          <div class="box box-space-bettwen" @click="chooseThisPayType(p)">
            <!--<div class="box box-x-left"><div class="pay-icon card-bg"><i class="iconfont">&#xe631;</i></div>银行卡</div>-->

            <div class="box box-x-left">
              <div  :class="'pay-icon'+' '+p.cssName+'-bg'" >
                  <i  :class="'iconfont icon-'+p.cssName"></i>
              </div>
              {{p.paymentTypeName}}
            </div>
            <div v-show="p.show"><i class="iconfont">&#xe65c;</i></div>
          </div>
          <div class="half-x-line"></div>
        </template>

        <!-- 委托单是买入单,挂牌单是卖出单 买入的本人才可以操作 或者  委托单是卖出单,挂牌单是买入单 买入的本人才可以操作 -->
        <template v-if="(item.direction===1 && id === item.userId) || (item.direction===2 && id === item.makerUserId) ">
         <div class="bottom-btn02 active" v-if="ifCanConfirm" @click="confirm()">{{$t('otc.iHavePaid')}}</div>
         <div class="bottom-btn02 " v-else>{{$t('otc.iHavePaid')}}</div>
        </template>
      </div>
    </div>

    <div class="tip-bg" @click="cancelDiv=!cancelDiv"  v-show="cancelDiv"></div>
    <div class="tip-box"  style="display:block;top:30%;"   v-show="cancelDiv">
      <div class="tip-top" style="background:#ecf0f7;height:12vw;line-height:12vw;font-size:4.5vw;color:#1f405a;">
        <div>{{$t('otc.cancelledOrder')}}</div>
        <div class="tip-close" ><i class="iconfont" @click="cancelDiv=!cancelDiv">&#xe620;</i></div>
      </div>

      <div class="tip-con" style="padding:0;" >
        <div style="padding:3vw 9vw;font-size:3.8vw;line-height:7vw;color:#1f405a;"><p>{{$t('otc.doNotCancelTheTransaction')}}
          {{$t('otc.restrictTradingFunction',{hour:config.cancelCountHour,num:config.cancelNum})}}</p>
          <div style="color:#bdc4ce;padding:2vw 0"> <input type="checkbox" aria-hidden="true" v-model="agree" />{{$t('otc.noPayment')}}</div>
        </div>
        <div class="btn box box-space-bettwen" style="background:none;padding:0">
           <div style="width:50%;background:#ecf0f7;color:#646da9"  @click="cancelDiv=!cancelDiv">{{$t('otc.cancel')}}</div>
           <div style="width:50%;" class="bottom-btn02 active"   v-if="ifCanCancel" @click="cancel()">{{$t('otc.confirm')}}</div>
           <div  style="width:50%;" class="bottom-btn02"  v-else>{{$t('otc.confirm')}}</div>
        </div>
      </div>
    </div>

    <!--选择支付方式END--->
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

  computed: {
    ...mapState('basic', ['uid', 'id']),
    // 是否可以确认付款
    ifCanConfirm() {
      return this.formParam.paymentTypeId > 0
    },
    // 是否可以取消
    ifCanCancel() {
      return this.agree.length > 0
    },
    errorStatus() {
      let item = this.item
      if (!this.uid) {
        return 'loginout'
      } else if (!item) {
        return 'error'
      }
    },
  },
  data() {
    return {
      ifOverTime: false,
      imgUrl: null, // 二维码地址
      agree: [],
      imgDiv: false,
      cancelDiv: false,
      confirmDiv: false,
      remainTime: '',
      nowDateTimer: null,
      item: null, // 订单信息
      config: null, // 法币配置
      payment: [], // 支付方式
      formParam: {
        paymentTypeId: '', // 交易数量
        takerId: 0, // 委托單號
        paymentTypeName: '', // 交易数量
      },
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    blowUp(url) {
      this.imgDiv = true
      this.imgUrl = url
    },
    copyFn(data) {
      this.$Helper.copyToClipboard(data)
      this.$Helper.emitAction('toast', {
        type: 'top',
        text: this.$t('myfund.copy_success'),
      })
    },
    caculateIcon(code) {
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
      return conf[code]
    },
    // 跳转到申诉资料填写页面
    goToAppeal(item) {
      let $this = this
      this.$Helper.dialog('OtcWriteAppealInfo', 'right', {
        appealRecord: item,
        callback: item => {
          $this.queryOrder(item.takeOrderNo) // 重新刷新頁面
        }}, $this.$store
      )
    },
    goViewAppealDetail(item) {
      let $this = this
      this.$Helper.dialog('OtcViewAppealInfo', 'right', {
        takerOrderId: item.takerOrderId,
        callback: item => {
          $this.queryOrder(item.takeOrderNo) // 重新刷新頁面
        }}, $this.$store
      )
    },
    chooseThisPayType(item) {
      let $this = this
      this.payment.forEach((p) => { $this.$set(p, 'show', false) }) // 把所有勾选去掉
      $this.$set(item, 'show', true) // 设置选中的支付方式显示图标
      this.$Helper.copyProperties(item, this.formParam)// 设置支付方式id
    },
    toOtcOrder(status) {
      let currentPath = this.$route.path // 当前路径
      // 如果是在当前路径 直接关闭
      if (currentPath.indexOf('OtcOrder'.toLowerCase()) > -1) {
        this.$Helper.emitAction('closeModel')
        let fn = this.params.callback
        let param = {key: status, type: 0, status: status}
        if (fn && this.$Helper.isType(fn, () => {})) {
          fn(param)
        }
      } else {
        this.$Helper.toOtcOrder(this, status, status)
      }
    },
    // 更新现在的时间
    updateNowTime() {
      this.nowDateTimer = setInterval(() => {
        this.updateMyRemainingTimes()
      }, 1000)
    },
    // 更新我的剩余时间
    updateMyRemainingTimes() {
      if (this.item.remainSeconds <= 0) {
        window.clearInterval(this.nowDateTimer)
        this.remainTime = this.$t('otc.timedOut')
        this.ifOverTime = true
      } else {
        // 计算剩余时间转换成对应的显示
        this.remainTime = this.$Helper.getTheRemainingTime(this.item.remainSeconds)
        if (!this.remainTime) {
          window.clearInterval(this.nowDateTimer)
          this.remainTime = this.$t('otc.timedOut')
          this.ifOverTime = true
        }
        this.item.remainSeconds--
      }
    },
    // 取消訂單
    cancel() {
      this.$Helper
        .ajax({
          url: '/app/otc/cancelTakerOrder.api?takerId=' + this.formParam.takerId,
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          this.$Helper.dealHttpCode(code, msg)
          this.toOtcOrder(2)
        })
    },
    // 确认付款
    confirm() {
      let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/confirmPayment.api',
          method: 'POST',
          params: $this.formParam,
        })
        .then(({code, data, msg}) => {
          this.$Helper.dealHttpCode(code, msg)
          this.toOtcOrder(3)

          // if (this.$Helper.dealHttpCode(code, msg)) {
          //   this.$Helper.emitAction('closeModel')
          //   // this.showPayedDetail(this.formParam.takerId) // 显示已支付详情
          //   this.toOtcOrder(3)
          // } else {
          //   this.toOtcOrder(3)  // 失败跳转到我的订单
          // }
        })
    },
    // 展示订单详细
    showPayedDetail(orderNo) {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'OtcPayed',
          type: 'right',
          params: {
            takeOrderNo: orderNo,
          },
        }
      )
    },
    // 查詢委托單
    queryOrder() {
      let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/' + this.formParam.takerId + '/getTakeOrder.api',
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.item = _.get(data, 'data')
            // 如果订单状态不是待付款,直接关闭
            if (this.item.orderStatus !== 1) {
              $this.toOtcOrder(1)
              return
            }
            this.config = _.get(data, 'config')
            this.payment = _.get(data, 'payment')
            this.payment.forEach((p) => {
              $this.$set(p, 'show', false)
            })
            this.updateNowTime()
          }
        })
    },
  },
  created() {
    // 初始化参数
    this.formParam.takerId = this.params.takeOrderNo
    this.queryOrder()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
    background: white;
  }
  .payment-con{
    padding-bottom:0
  }
  .pay-icon{
    margin-left:0
  }
  .tip-top{
    height:12vw;
    line-height:12vw;
    color:#455070;
    font-size:4vw;
    font-weight: bold
  }
  .tip-box .tip-con{
    padding:4vw 0;
    padding-bottom:0px;
  }
  .tip-close {
    position: absolute;
    top: 0vw;
    right: 1.8vw;
    z-index: 101;
  }
  .tip-close i{
    color:#455070;
  }
  .tip-con .content{
    text-align: center;
    line-height:7vw;
    font-size:4.1vw;
    color:#455070
  }
  .tip-con .content p{
    font-size:3.5vw;
  }
  .half-x-line{
    background:#dcdcdf
  }
  .tip-con .box-space-bettwen{
    padding:4vw 5vw;
    font-size:4vw;
    color:#8398a6
  }
  .pay-td div{
    display: flex;
    justify-content: flex-end;
    align-items: center
  }
  .pay-td div em{
    margin-left:2vw;
    text-align: right;
    word-break:keep-all;
    color:#64acf5
  }
</style>
