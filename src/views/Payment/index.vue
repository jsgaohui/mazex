<template lang="html">
  <div class="order-container box box-row" >
    <!--付款-->
    <div class="container box box-row router-view" img-set="static/favicon.ico">
      <div class="half-x-line"></div>
      <div class="otc-payment-term overflow-y">
        <div class="pay-infocard rel" v-for="(method, index) in myPayMethod" @click="showAddPayment(method)">
          <!-- 1激活  0不激活 -->
          <img src="/static/images/icbc-bg.png" :class="{'gray': method.status === 0}">
          <div>
            <h3>{{method.bankName}}
              <template v-if="method.subBank">({{method.subBank}})</template>
            </h3>
            <h4>{{name}}</h4>
            <p>{{method.account}}</p>
          </div>
        </div>

        <div class="pay-add box box-space-bettwen"  @click="showAddPayment()">
          <div><i class="iconfont" style="font-size:5vw;font-weight:bold;margin-right:2vw;">&#xe619;</i>添加收款方式</div><i class="iconfont">&#xe612;</i>
        </div>
      </div>
    </div>
    <error-status :status="errorStatus" />
    <!--付款END-->
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
  data() {
    return {
      show: false,
      isValid: 0,
      myPayMethod: [], // 我的支付方式
      payType: [], // 所有支付方式
      name: null, // 姓名
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
    // 展开筛选条件
    showAddPayment(payType) {
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
              $this.myPayMethod = _.get(data, 'data.myPayMethod')
              $this.payType = _.get(data, 'data.payType')
              $this.name = _.get(data, 'data.name')
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
  @import url('../../theme/index.less');
  .order-container {
    background: white;
    .right-text{
      font-size: 3.6vw;
    }
  }
</style>
