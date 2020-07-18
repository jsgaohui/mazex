<template lang="html">
  <div class='layout'  style='width:100%'>
    <div class="order-container box box-row" >
      <!--付款-->
      <div class="container box box-row router-view" img-set="static/favicon.ico">
        <div class="head box">
          <div class="left box box-item"><i data-v-2b663b10="" class="iconfont" @click="closeDialog"></i></div>
          <div class="name box box-item box-col-flex">
            <span>{{$t('payment.paymentMethod')}}</span>
          </div>

        </div>
        <div class="half-x-line"></div>
        <div class="otc-payment-term overflow-y" style="height:170vw;">
          <div class="pay-infocard rel" v-for="(method, index) in myPayMethod" @click="showAddPayment(method)">
            <!-- 1激活  0不激活 -->
            <img :src="'/static/images/'+method.cssName+'-bg.png'" :class="{'gray': method.status === 0}">
            <i class="iconfont" style="" v-if="method.status===1">&#xe65c;</i>
            <div>
              <h3>{{shortForField(method.bankName)}}
                <template v-if="method.subBank">({{shortForField(method.subBank)}})</template>
              </h3>
              <h4>{{shortForField(method.name)}}</h4>
              <p>{{shortForField(method.account)}}</p>
              <p>{{shortForField(method.swiftInfo)}}</p>
            </div>
          </div>
          <div class="pay-add box box-space-bettwen"  @click="showAddPayment()">
            <div><i class="iconfont" style="font-size:5vw;font-weight:bold;margin-right:2vw;">&#xe619;</i>{{$t('payment.addPayMethod')}}</div><i class="iconfont">&#xe612;</i>
          </div>
        </div>
      </div>
      <error-status :status="errorStatus" />
      <!--付款END-->
    </div>
    <div class="tip-bg" @click="confirmDiv=!confirmDiv"  v-show="confirmDiv"></div>
    <div class="tip-box"  style="display:block;top:30%;"   v-show="confirmDiv">

      <div class="tip-con" style="padding:0;" >
        <div style="padding:3vw 9vw;font-size:3.8vw;line-height:7vw;color:#1f405a;"><p>
          {{$t('payment.doVerification')}}</p>
        </div>
        <div class="btn box box-space-bettwen" style="background:none;padding:0">
          <div style="width:50%;background:#ecf0f7;color:#646da9"  @click="confirmDiv=!confirmDiv">{{$t('otc.cancel')}}</div>
          <div style="width:50%;" class="bottom-btn02 active"  @click="toAuth()">{{$t('account.authentication')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ErrorStatus from '@/components/ErrorStatus'
import {mapState} from 'vuex'
import _ from 'lodash'
export default {
  name: 'OtcOrders',
  components: {
    ErrorStatus,
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      confirmDiv: false,
      show: false,
      isValid: 0,
      myPayMethod: [], // 我的支付方式
      payType: [], // 所有支付方式
      name: null, // 姓名
      inBankList: [], // 印度尼西亚银行列表
    }
  },
  computed: {
    ...mapState('basic', ['uid']),
    errorStatus() {
      if (!this.uid) {
        return 'loginout'
      }
    },
  },
  methods: {
    toAuth() {
      // 跳转详情页面
      this.$Helper.jumpPage({ name: 'Personal' }, this)
      // }
    },
    shortForField(data) {
      if (data && data.length) {
        return data.length > 20 ? data.substr(0, 19) + '...' : data
      }
      return data
    },
    closeDialog() {
      this.$Helper.emitAction('closeModel')
      if (this.params && this.params.callback) {
        let fn = this.params.callback
        if (fn && this.$Helper.isType(fn, () => {})) fn()
      }
    },
    // 弹出添加窗口
    showAddPayment(payType) {
      if (this.isValid !== 2) {
        this.confirmDiv = true
        return
      }
      let $this = this
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'AddPayment',
          type: 'right',
          params: {
            payType: $this.payType,
            name: $this.name,
            chooseType: payType, // 待修改的方法
            inBankList: $this.inBankList, // 印度尼西亚银行列表
            callback: item => {
              $this.queryPayment()
            },
          },
        })
    },
    // 根据状态查询对应的委托单
    queryPayment() {
      let $this = this
      this.$Helper.ajax({
        url: `/app/otc/myPayType.api`,
        method: 'POST',
      }).then(
          data => {
            // 处理异常httpcode 以及 207重复操作
            if (this.$Helper.dealHttpCode(data.code, data.msg)) {
              $this.isValid = _.get(data, 'data.isValid')
              $this.isMerchant = _.get(data, 'data.isMerchant')
              $this.myPayMethod = _.get(data, 'data.myPayMethod')
              $this.payType = _.get(data, 'data.payType')
              $this.name = _.get(data, 'data.name')
              $this.inBankList = _.get(data, 'data.inBankList')
              // 更新isValid的store值
              this.$store.dispatch('basic/setLoginData', {isValid: $this.isValid, isMerchant: $this.isMerchant})
            }
          }
        )
    },
  },
  created() {

  },
  mounted() {
    this.queryPayment()
  },
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .order-container {
    background: white;
    .right-text{
      font-size: 3.6vw;
    }
    .pay-infocard.rel i{
      position:absolute;
      top:2vw;
      right:2vw;
      font-size:6vw;
      color:#fff;
    }
    .router-view{
      background: #fff;
    }
  }
</style>
