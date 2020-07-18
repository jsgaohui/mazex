<template lang="pug">
  .container
    h1 {{ $t('forgetPwd.modify_password') }}
    Iinput(v-model="account" inputType="text" :placeholder="$t('login.phone_email')")
    .half-x-line
    // GetVerifyCode(v-model="verifyCode" :accept="account" :acceptType="[1]" sendMsgType="3" :baseFontSize="4.8" :judgeExist="true" style="margin-top: 8vw;margin-bottom: 2vw;font-size: 4vw;")
    // .half-x-line
    .h-button.box.box-item(@click="nextPage" :class="{active: account}") {{ $t('basic.submit') }}
    p.box.box-item {{ $t('forgetPwd.pwd_modify_toast') }}
</template>
<script>
import components from '@/components'
import GetVerifyCode from '../Login/GetVerifyCode'
export default {
  name: 'ForgetPwdOne',
  components: {
    ...components,
    GetVerifyCode,
  },
  data() {
    return {
      account: null,
      canPost: false,
      interceptMsg: '',
    }
  },
  computed: { },
  watch: {},
  methods: {
    nextPage() {
      if (!this.account) {
        this.$Helper.emitAction(
          'toast',
          {
            text: this.$t('login.phone_error_toast'),
            type: 'bottom',
          },
        )
        return
      }
      this.$Helper.ajax({
        url: '/app/chkAccount.api',
        params: {
          account: this.account,
        },
      })
      .then(
        ({ msg, code, data }) => {
          // this.$Helper.emitAction('toast', { text: msg })
          if (code === 200) {
            if (!data || !data.exists) {
              this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.no_user') })
              return
            }
            // create a action id activity
            const actionId = `ModifyValidate_ForgetPwd_actionId_${this.$Helper.getTime()}`
            // subcribe the action when validate success
            this.$Helper.onAction(actionId, smsCode => {
              // check validate code
              this.$Helper.ajax({
                url: '/app/checkSmsCode.api',
                params: {
                  // phone: data.mobile,
                  // email: data.email,
                  username: this.account,
                  mobileCode: smsCode[0],
                  emailCode: smsCode[1],
                },
              })
              .then(
                ({code, msg}) => {
                  if (code === 200) {
                    this.$Helper.jumpPage({name: 'ForgetPwdTwo', query: this.$Helper.getUrlParams(), params: { mobile: this.account, smsCode: smsCode }}, this)
                  }
                  this.$Helper.emitAction('toast', { text: msg })
                },
              )
            })
            // set login basic data
            this.$store.dispatch('basic/setLoginData', { mobile: data.mobile, email: data.email, openEmailValid: data.openEmailValid ? 1 : 0, openPhoneValid: data.openPhoneValid ? 1 : 0 })
            // dispatch the action to show the validate model
            this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: { bindType: data.openPhoneValid === 1 ? 'mobile' : 'email', sendMsgType: 8, actionId } })
          } else {
            this.$Helper.emitAction('toast', { text: msg })
          }
        },
      )
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 10vw 5vw;
    h1 {
      font-size: 8vw;
      color: #646da9;
      font-weight: 500;
      margin-bottom: 14vw;
    }
    input{
      font-size: 4.8vw;
      padding: 2vw 0;
      margin-top: 6vw;
    }
    .half-x-line{
      background: #ddd;
    }
    .h-button {
      margin-top: 30vw;
    }
    p {
      font-size: 3.5vw;
      color: #aaa;
      margin-top: 3vw;
    }
  }
</style>
