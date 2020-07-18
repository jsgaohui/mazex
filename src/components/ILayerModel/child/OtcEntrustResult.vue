<template lang="html">
  <div class="layout overflow-y"  style="width:100% " v-if="item">
    <!--付款-->
    <div class="container box box-row router-view" img-set="static/favicon.ico">
      <div class="head box">
        <div class="left box box-item"><i class="iconfont" @click="toOtcOrder()"></i></div>
        <div class="name box box-item box-col-flex">
          <span>{{$t('otc.entrustStatus')}}</span>
        </div>

      </div>
      <div class="half-x-line"></div>
      <div class="payment-con box-row-flex overflow-y">
        <div class="paid-box box-row box-y-center">
          <div class="txt"><i class="iconfont" >&#xe673;</i>
            <template v-if="item.orderStatus ===0 || item.orderStatus ===1">{{$t('otc.successfulAcceptance')}}</template>
            <template v-else-if="item.orderStatus === 2">{{$t('otc.freeze')}}</template>
            <template v-else-if="item.orderStatus === 3">{{$t('otc.backgroundProcessingInTheRack')}}</template>
            <template v-else-if="item.orderStatus === 4">{{$t('otc.hasBeenRemoved')}}</template>
          </div>
          <p>{{$t('basic.total_volume')}} <span>{{$Helper.format(Number.parseFloat(item.currOrderPrice*item.tradeVolume),2)}}&nbsp;{{item.currencySymbol}}</span></p>
        </div>
        <div class="pay-info">
          <!--<div class="pay-td time-td" style="color: #8196a5;">-->
            <!--<span style="color: #8196a5;">日涨跌：<em class="color-sell">-0.86%↓</em></span>  <span style="color: #8196a5;">最高价：￥6.94</span>  <span style="color: #8196a5;">最低价：￥6.54</span>-->
          <!--</div>-->
          <div class="pay-td">
            <label>{{$t('otc.oddNumber')}}</label><span>{{item.makerOrderId}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.currency')}}</label><span>&nbsp;{{item.dcCode}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.type')}}</label><span>{{item.direction===2 ? $t('otc.sell'):$t('otc.buy')}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.price')}}</label>
            <span>{{item.currOrderPrice}}&nbsp;{{item.currencySymbol}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.priceType')}}</label><span>{{item.priceFloowMarket===1? $t('otc.floatingPricing'):$t('otc.fixedPricing')}}</span>
          </div>
          <template v-if="item.priceFloowMarket === 1">
            <div class="pay-td">
              <label>{{$t('otc.spreadRange')}}</label><span>{{item.spread}}</span>
            </div>
            <div class="pay-td">
              <label>{{$t('otc.transactionDeviation')}}</label><span>{{item.offset}}</span>
            </div>
          </template>
        </div>
        <div class="pay-info">

          <div class="pay-td">
            <label>{{$t('otc.numberOfTransactions')}}</label><span>{{item.tradeVolume}}&nbsp;{{item.dcCode}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.theRemainingAmount')}}</label><span>{{item.availableVolume}}&nbsp;{{item.dcCode}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.numberOfFreezes')}}</label><span>{{item.freezeVolume}}&nbsp;{{item.dcCode}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.minimumSingleLimit')}}</label>
            <span>{{item.limitMin}}&nbsp;{{item.currencySymbol}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.maximumSingleLimit')}}</label>
            <span>{{item.limitMax}}&nbsp;{{item.currencySymbol}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.releaseTime')}}</label><span>{{item.createTime}}</span>
          </div>
          <div class="pay-td">
            <label>{{item.direction === 2 ? $t('payment.paymentMethod'):$t('otc.mPayMethod') }}</label>
            <template v-for=" item in orderPayType">
                {{item.paymentTypeName}}
            </template>
          </div>
        </div>

        <div class="fixed-btn otc-btn box box-space-bettwen" style="background: #fff;">
          <!--<div class="btn-look" style="margin-right:2vw;">查看卖出订单</div>-->
          <div class="btn-look" @click="cnacleOrder()" v-if="item.orderStatus === 0 || item.orderStatus ===1">{{$t('otc.obtained')}}</div>
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
import _ from 'lodash'
export default {
  components: {
    ErrorStatus,
  },
  data() {
    return {
      dcCode: '', // 委托的币种
      item: null, // 订单信息
      config: null, // 法币配置
      payment: [], // 支付方式
      formParam: {
        makerOrderNo: 0, // 委托單號
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
    // 订单选择的支付方式
    orderPayType() {
      let $this = this
      return this.item.payTypeList.filter(payType => $this.item.payTypes.indexOf(payType.paymentTypeId + '') !== -1)
    },
    orderStatus() {
      switch (this.item.orderStatus) {
        case 2: return this.$t('otc.cancelled')
        case 3: return this.$t('otc.paid')
        case 4: return this.$t('otc.paidFor')
        case 5: return this.$t('otc.dealDone')
        case 6: return this.$t('otc.appeal')
        default: this.$t('otc.cancelled')
      }
    },
    errorStatus() {
      if (!this.uid) {
        return 'loginout'
      }
    },
  },
  methods: {
    // 查詢挂牌单
    queryOrder() {
      // let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/' + this.formParam.makerOrderNo + '/getOtcOrder.api',
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.item = _.get(data, 'data')
          }
        })
    },
    // 下架挂牌单
    cnacleOrder() {
      let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/cancelMakerOrder.api?makerOrderId=' + $this.item.makerOrderId,
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.toOtcOrder()
          }
        })
    },
    toOtcOrder() {
      let currentPath = this.$route.path // 当前路径
      // 如果是在当前路径 直接关闭
      if (currentPath.indexOf('OtcOrder'.toLowerCase()) > -1) {
        this.$Helper.emitAction('closeModel')
        let fn = this.params && this.params.callback ? this.params.callback : null
        let param = {key: 7, type: 1, status: 10}
        if (fn && this.$Helper.isType(fn, () => {})) {
          fn(param)
        }
      } else {
        this.$Helper.toOtcOrder(this, 7, 10, 1)
      }
    },
  },

  created() {
    // 初始化参数
    this.formParam.makerOrderNo = this.params.makerOrderNo
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
  .payment-con{
    padding-bottom:18vw;
  }
  .otc-btn{
    position:fixed;
    left:0;
    bottom:0;
    right:0;
    background:#fff;
    padding:4vw 4vw;
  }
  .fixed-btn{
    background:#fff;
    padding:4vw;
  }
</style>
