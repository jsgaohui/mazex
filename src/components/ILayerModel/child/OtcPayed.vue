<template lang="html">
  <div class="layout overflow-y"  style="width:100% " v-if="item">
    <!--付款-->
    <div class="container box box-row router-view" img-set="static/favicon.ico">
      <div class="head box">
        <div class="left box box-item"><i class="iconfont" @click="toOtcOrder(item.orderStatus)"></i></div>
        <div class="name box box-item box-col-flex">
          <span>{{orderStatus}}</span>
        </div>

      </div>
      <div class="half-x-line"></div>
      <div class="payment-con box-row-flex">
        <div class="paid-box box-row box-y-center">
          <div class="txt"><i class="iconfont">&#xe673;</i>{{orderStatus}}</div>
          <p>{{$t('otc.theTransactionAmount')}}
            <span>{{$Helper.format(Number.parseFloat(item.orderPrice*item.orderVolume),2)}}&nbsp;{{item.currencySymbol}}</span>
            <span v-show="item.appealFlag===1||item.appealFlag===2||item.appealFlag===3" class="appeal" style="color:#fff;">{{$t('appeal.appeal')}}</span>
          </p>
        </div>
        <div class="pay-info">
           <!-- 只有已付款才有这个 -->
          <div class="pay-td time-td" v-if="item.orderStatus === 3">
            <label><i class="iconfont">&#xe60f;</i>{{$t('otc.waitForGather')}}</label><span>{{remainTime}}</span>
          </div>
          <div class="pay-td">
            <label>{{id === item.userId ? $t('otc.otherSideNickName'): $t('otc.nameOfTheOtherParty')}}</label><span>
                       {{id === item.userId ? item.makerRealName: item.takerRealName}}
          </span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.price')}}</label><span>{{Number.parseFloat(item.orderPrice)}}&nbsp;{{item.currencySymbol}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.quantity')}}</label><span>{{Number.parseFloat(item.orderVolume)}}&nbsp;{{item.dcCode}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.oddNumber')}}</label>
            <span>{{item.takerOrderId}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.time')}}</label>
            <span>{{item.createTime}}</span>
          </div>
          <div class="pay-td">
            <label>{{$t('otc.paymentReferenceMark')}}</label><span>{{item.relatedCode}}</span>
          </div>
          <div class="pay-td" v-if="item.orderStatus < 3">
            <label>{{(item.direction === 2 && id === item.makerUserId) || (item.direction === 1 && id === item.userId) ? $t('payment.paymentMethod'):$t('otc.mPayMethod') }}</label>
            <template v-for=" item in payment">
              {{item.paymentTypeName}}
            </template>
          </div>
          <div class="pay-td" v-if="item.orderStatus >= 3">
            <label>{{(item.direction === 2 && id === item.makerUserId) || (item.direction === 1 && id === item.userId) ? $t('payment.paymentMethod'):$t('otc.mPayMethod') }}</label>
            <template v-for=" i in payment">
              <template v-if="item.paymentTypeId === i.paymentTypeId">{{i.paymentTypeName}}</template>
            </template>
          </div>
        </div>

        <div class="fixed-btn otc-btn box box-space-bettwen">
          <!-- <div class="btn-look" @click="toOtcOrder(item.orderStatus)">{{$t('otc.reviewOrder')}}</div> -->
          <div v-if="(item.remainSeconds <= 0||item.orderStatus === 2||item.orderStatus === 5)&&(!item.appealFlag||item.appealFlag===0)" class="btn-look" @click="goToAppeal(item)">{{$t('appeal.goToAppeal')}}</div>
          <div v-if="(item.remainSeconds <= 0||item.orderStatus === 2||item.orderStatus === 5)&&item.appealFlag&&item.appealFlag!==0" class="btn-look" @click="goViewAppealDetail(item)">{{$t('appeal.appealDetail')}}</div>
          <div class="btn-look" style="margin-left:2vw" v-if="!ifOverTime && item.orderStatus === 3 && ((item.direction===2 && id === item.userId) || (item.direction===1 && id === item.makerUserId))" 
          @click="confirmDiv=true">{{$t('otc.confirmRemittance')}}</div>
        </div>
      </div>
    </div>
    <div class="tip-bg" @click="confirmDiv=!confirmDiv"  v-show="confirmDiv"></div>
    <div class="tip-box"  style="display:block;top:30%;"   v-show="confirmDiv">

      <div class="tip-con" style="padding:0;" >
        <div style="padding:3vw 9vw;font-size:3.8vw;line-height:7vw;color:#1f405a;"><p>
          {{$t('otc.gatherTips')}}</p>
        </div>
        <div class="btn box box-space-bettwen" style="background:none;padding:0">
          <div style="width:50%;background:#ecf0f7;color:#64acf5"  @click="confirmDiv=!confirmDiv">{{$t('otc.cancel')}}</div>
          <div style="width:50%;" class="bottom-btn02 active"  @click="confirmRemittance()">{{$t('otc.confirmRemittance')}}</div>
        </div>
      </div>
    </div>
    <!--选择支付方式END--->
      <!--购买END-->
    <error-status :status="errorStatus" />
  </div>
</template>
<script>
import {mapState} from 'vuex'
import ErrorStatus from '@/components/ErrorStatus'
import _ from 'lodash'
export default {
  components: {
    ErrorStatus,
  },
  data() {
    return {
      ifOverTime: false,
      confirmDiv: false,
      remainTime: '',
      nowDateTimer: null,
      dcCode: '', // 购买的币种
      item: null, // 订单信息
      config: null, // 法币配置
      payment: [], // 支付方式
      formParam: {
        paymentTypeId: '', // 交易数量
        takeOrderNo: 0, // 委托單號
      },
      butonStatus: true,
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('basic', ['uid', 'id']),
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
      let item = this.item
      if (!this.uid) {
        return 'loginout'
      } else if (!item) {
        return 'error'
      }
    },
  },
  methods: {
    toAssert() {
      this.$Helper.replaceHis('Account')
      this.$Helper.jumpPage({name: 'OtcAssert'}, this)
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

    // 确认收款
    confirmRemittance() {
      if (!this.butonStatus) return
      let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/confirmRemittance.api?takerId=' + this.formParam.takeOrderNo,
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          $this.butonStatus = true
          if ($this.$Helper.dealHttpCode(code, msg)) {
            $this.toOtcOrder(5)
          }
        })
    },
    // 查詢委托單
    queryOrder() {
      // let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/' + this.formParam.takeOrderNo + '/getTakeOrder.api',
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.item = _.get(data, 'data')
            this.config = _.get(data, 'config')
            this.payment = _.get(data, 'payment')
            // this.payment.forEach((p) => {
            //   $this.$set(p, 'show', false)
            // })
            this.updateNowTime()
          }
        })
    },
  },
  created() {
    // 初始化参数
    this.formParam.takeOrderNo = this.params.takeOrderNo
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
  .fixed-btn{
    background:#fff;
    padding:4vw;
  }
  .detail-btn,.look-btn{
    background: #f9a167;
    color:#fff;
    font-size:3.5vw;
    padding:1vw 2vw;
    position:initial;

  }
  .look-btn{
    background: #64acf5;
  }
</style>
