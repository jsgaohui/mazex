<template lang="html">
  <div class="layout overflow-y"  style="width:100%">
    <div class="tip-box" style="display:block" >
      <div class="tip-top">
        <div>{{$t('fund.inputPass')}}</div>
        <div class="tip-close"><i class="iconfont"></i></div>
      </div>
      <div class="tip-con" style="padding:0">
        <div class="content pass-con">
          <div>
            <input class="pass-input" type="password" maxlength="6" v-model="payPassword" autocomplete="off">
          </div>
          <div style="padding-top:2vw;text-align:right"><span class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span></div>
        </div>
        <div class="box box-space-bettwen">
          <div class="btn btn-gray box-col-6" @click="closeDialog(true)">{{$t('basic.cancel')}}</div>
          <div class="btn box-col-6" @click="closeDialog()" style="margin-left:4vw;">{{$t('basic.comfirm')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ErrorStatus from '@/components/ErrorStatus'
import {mapState} from 'vuex'
// import _ from 'lodash'
export default {
  components: {
    ErrorStatus,
  },
  data() {
    return {
      payPassword: '',
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('basic', ['uid', 'isValid', 'isMerchant', 'isExitTradePwd']),
  },
  methods: {
    toPassword() {
      // 跳转重构之密码页面
      this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
      // }
    },
    closeDialog(flag = false) {
      if (flag) {
        this.$Helper.emitAction('closeModel')
        return
      }
      if (!this.validate()) return
      this.$Helper.emitAction('closeModel')
      let fn = this.params.callback
      if (fn && this.$Helper.isType(fn, () => {})) fn(this.payPassword)
    },
    validate() {
      if (this.payPassword.length !== 6) {
        this.$Helper.emitAction('toast', {
          text: this.$t('fund.paypassword'),
        })
        return false
      }
      return true
    },
  },
  created() {
  },
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
    background: white;
  }

  .tip-top{
    background:#ecf0f7;
    height:12vw;
    line-height:12vw;
    font-size:4.5vw;
    color:#1f405a;
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
  .tip-con .box-space-bettwen {
    padding: 4vw;
    font-size: 4vw;
    color: #8398a6
  }
  .otc-btn{
    position:fixed;
    bottom:4vw;
    left:0;
    right:0;
    background: #fff;
    padding:0vw 4vw;
  }
  .otc-btn div{
    width:100%;
  }

</style>
