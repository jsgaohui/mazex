<template lang="pug">
  .container
    h1 {{ this.isExitTradePwd === 1 ? this.$t('setting.reset_tradePwq') : this.$t('setting.add_tradePwq') }}
    Iinput(v-model="params.password" @input="onlyNumber" inputType="password" maxlength=6 :placeholder="$t('forgetPwd.new_pwd')")
    .half-x-line
    Iinput(v-model="params.comfirmPassword" @input="onlyNumber" inputType="password" maxlength=6 :placeholder="$t('forgetPwd.resuire_pwd')")
    .half-x-line
    .h-button.box.box-item(@click="postFn" :class="{active: canPost}") {{ $t('basic.send') }}
    p.box.box-item {{ this.isExitTradePwd === 1 ? $t('forgetPwd.tradePwd_reset_toast') : '' }}
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'ResetTradePwd',
  components,
  data() {
    return {
      params: {
        password: null,
        comfirmPassword: null,
        mobileCode: '000000',
        emailCode: '000000',
      },
      verifyCode: null,
    }
  },
  computed: {
    ...mapState('basic', ['mobile', 'isExitTradePwd', 'openPhoneValid', 'openEmailValid']),
    testParams() {
      return this.$Helper.testParamsComplete({params: this.params})
    },
    canPost() {
      return this.testParams.length === 0 && this.params.password === this.params.comfirmPassword
    },
  },
  watch: {},
  methods: {
    onlyNumber() {
      if (!/^[0-9]*[1-9][0-9]*$/g.test(this.params.password)) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.tradePwd_test_error') })
        return
      }
    },
    postFn() {
      if (this.testParams.length > 0) {
        let paramsConf = {
          password: this.$t('forgetPwd.input_pwd'),
          comfirmPassword: this.$t('forgetPwd.input_resuire_pwd'),
        }
        this.$Helper.emitAction('toast', { text: paramsConf[this.testParams[0]] })
        return
      }
      if (this.params.password.length !== 6) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.tradePwd_test_error') })
        return
      } else if (!/^[0-9]*[1-9][0-9]*$/g.test(this.params.password)) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.tradePwd_test_error') })
        return
      }
      if (this.params.password !== this.params.comfirmPassword) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.pwd_not_normal') })
        return
      }
      this.saveFn()
    },
    saveFn() {
      let $this = this
      // create a action id activity
      const actionId = `ModifyValidate_ResetTradePwd_actionId_${this.$Helper.getTime()}`
      // subcribe the action when validate success
      this.$Helper.onAction(actionId, smsCode => {
        let params = {
          password: this.params.password,
        }
        if (smsCode[0]) params.mobileCode = smsCode[0]
        if (smsCode[1]) params.emailCode = smsCode[1]
        this.$Helper.ajax({
          url: '/app/editTradePwd.api',
          params,
        })
        .then(
          ({code, msg}) => {
            if (code === 200) {
              setTimeout(() => {
                this.$Helper.jumpBack()
              }, 600)
              msg = $this.isExitTradePwd === 0 ? this.$t('forgetPwd.addTradePwdSuccess') : this.$t('forgetPwd.modifyTradePwdSuccess')
              this.$Helper.emitAction('toast', {
                text: msg,
              })
              // save to store
              this.$store.dispatch('basic/setLoginData', { isExitTradePwd: 1 })
            }
            this.$Helper.emitAction('toast', { text: msg })
          },
        )
      })
      // dispatch the action to show the validate model 弹出验证码框
      this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: { bindType: this.openPhoneValid === 1 ? 'mobile' : 'email', sendMsgType: 14, actionId } })
    },
  },
  created() {
    this.$Helper.emitAction('setCustomTitle', this.isExitTradePwd === 1 ? this.$t('setting.reset_tradePwq') : this.$t('setting.add_tradePwq'))
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 10vw 5vw;
    h1 {
      font-size: 9.5vw;
      color: #646da9;
      font-weight: 500;
      margin-bottom: 14vw;
    }
    input{
      font-size: 4.8vw;
      padding: 2vw 0;
      margin-top: 5vw;
    }
    .half-x-line{
      background: #ddd;
      margin-bottom: 4vw;
    }
    .h-button {
      margin-top: 20vw;
    }
    p {
      font-size: 3.5vw;
      color: #aaa;
      margin-top: 3vw;
    }
  }
</style>
