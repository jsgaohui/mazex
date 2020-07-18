<template lang="pug">
  .container
    h1 {{ $t('forgetPwd.modify_password') }}
    Iinput(v-model="params.password" inputType="password" :placeholder="$t('forgetPwd.new_pwd')")
    .half-x-line
    Iinput(v-model="params.comfirmPassword" inputType="password" :placeholder="$t('forgetPwd.resuire_pwd')")
    .half-x-line
    .h-button.box.box-item(@click="saveFn" :class="{active: canPost}") {{ $t('basic.submit') }}
    p.box.box-item {{ $t('forgetPwd.pwd_modify_toast') }}
</template>
<script>
import components from '@/components'
export default {
  name: 'ResetPwd',
  components,
  data() {
    return {
      params: {
        password: null,
        comfirmPassword: null,
      },
    }
  },
  computed: {
    testParams() {
      return this.$Helper.testParamsComplete({params: this.params})
    },
    canPost() {
      return this.testParams.length === 0 && this.params.password === this.params.comfirmPassword && this.$Helper.checkPassword(this.params.password)
    },
  },
  watch: {},
  methods: {
    saveFn() {
      if (this.testParams.length > 0) {
        let paramsConf = {
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
      this.$Helper.ajax({
        url: '/app/resetPwd.api',
        params: {
          username: this.$route.params.mobile,
          password: this.params.password,
          mobileCode: this.$route.params.smsCode[0],
          emailCode: this.$route.params.smsCode[1],
        },
      })
      .then(
        ({msg, code}) => {
          if (code === 200) {
            setTimeout(() => { this.$Helper.jumpPage(this.$Helper.getUrlParamsByKey('from') || 'Account', this) }, 600)
          }
          this.$Helper.emitAction('toast', { text: msg })
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
      font-size: 9.5vw;
      color: #646da9;
      font-weight: 500;
      margin-bottom: 14vw;
    }
    input{
      font-size: 4.8vw;
      padding: 2vw 0;
      margin-top: 3vw;
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
