<template lang="pug">
  .container
    h1 {{ $t('forgetPwd.modify_password') }}
    Iinput(v-model="params.oldPassword" inputType="password" :placeholder="$t('forgetPwd.old_pwd')")
    .half-x-line
    Iinput(v-model="params.password" inputType="password" :placeholder="$t('forgetPwd.new_pwd')")
    .half-x-line
    Iinput(v-model="params.comfirmPassword" inputType="password" :placeholder="$t('forgetPwd.resuire_pwd')")
    .half-x-line
    .h-button.box.box-item(@click="postFn" :class="{active: canPost}") {{ $t('basic.send') }}
    p.box.box-item {{ $t('forgetPwd.pwd_modify_toast') }}
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'ResetPwd',
  components,
  data() {
    return {
      params: {
        oldPassword: null,
        password: null,
        comfirmPassword: null,
      },
      verifyCode: null,
    }
  },
  computed: {
    ...mapState('basic', ['mobile']),
    testParams() {
      return this.$Helper.testParamsComplete({params: this.params})
    },
    canPost() {
      return this.testParams.length === 0 && this.params.password === this.params.comfirmPassword
    },
  },
  watch: {},
  methods: {
    postFn() {
      if (this.testParams.length > 0) {
        let paramsConf = {
          oldPassword: this.$t('forgetPwd.input_old_pwd'),
          password: this.$t('forgetPwd.input_pwd'),
          comfirmPassword: this.$t('forgetPwd.input_resuire_pwd'),
        }
        this.$Helper.emitAction('toast', { text: paramsConf[this.testParams[0]] })
        return
      }
      if (!this.$Helper.checkPassword(this.params.password)) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.pwd_test_error') })
        return
      }
      if (this.params.password !== this.params.comfirmPassword) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.pwd_not_normal') })
        return
      }
      this.saveFn()
    },
    saveFn() {
      this.$Helper.ajax({
        url: '/app/editpwd.api',
        params: this.params,
      })
      .then(
        ({msg, code}) => {
          if (code === 200) {
            setTimeout(() => { this.$Helper.jumpBack() }, 600)
          }
          this.$Helper.emitAction('toast', { text: msg })
        },
      )
    },
    showVerify() {
      return new Promise((resolve, reject) => {
        const actionId = `resetpwd_verify_action_${this.$Helper.getTime()}`
        this.$Helper.onAction(actionId, verifyCode => {
          this.verifyCode = verifyCode
          this.sendacceptCode(
            () => {
              resolve()
            },
            () => {
              reject()
            }
          )
        })
        this.$store.dispatch(
          'layermodel/push',
          {
            type: 'up',
            name: 'Verify',
            locked: false,
            params: {
              actionId,
            },
          },
        )
      })
    },
    sendacceptCode(cb, errorCb) {
      this.$Helper
      .ajax({
        url: '/app/sendsms.api',
        method: 'POST',
        params: {
          sendType: 1,
          sendMsgType: 3,
          mobile: this.mobile,
          verifyCode: this.verifyCode,
        },
      }).then(
        ({code, msg}) => {
          if (code === 400) {  // verify code error
            this.showVerify()
          } else if (code === 200) { // success
            if (cb && this.$Helper.isType(cb, () => {})) cb()
          }
          this.$Helper.emitAction('toast', {
            text: msg,
            type: 'top',
          })
        },
        () => {
          this.$Helper.emitAction('toast', {
            text: this.$t('login.verifycode_send_error'),
            type: 'top',
          })
          if (errorCb && this.$Helper.isType(errorCb, () => {})) errorCb()
        }
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
