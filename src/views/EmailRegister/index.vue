<template lang="pug">
  .login-container.overflow-y
    .head.box-y-center
      .close(@click="$Helper.jumpBack")
        i.iconfont &#xe620;
      .box-x-right-flex.login(@click="jumpPage('Login')") {{ $t('basic.login') }}
    .con
      .tab-menu.box.box-y-c-y-center
        h2(style="margin-top:1vh;") {{ $t('register.email_register') }}
        <!--h3(style="margin-top:2.5vh;margin-left:2vh;font-size:3vh")(@click="jumpPage('Register')") {{ $t('register.mobile_register') }}-->
      h5
        <!--i.iconfont &#xe622;-->
        <!--span {{ $t('register.address_cannot_change') }}-->
      .num-con.box.box-y-center
        <!--span(@click="showSlideModel") {{ countryName || $t('identity.please_chose') }}-->
        <!--i.iconfont(style="margin-right: 4vw;font-size: 4vw" @click="showSlideModel") &#xe61f;-->
        Iinput(class="box-col-flex" inputType="text" v-model="form.username" :placeholder="$t('basic.email')")
        .half-x-line
      .num-con.box.box-y-center
        Iinput(v-if="showPwd" class="box-col-flex" inputType="text" v-model="form.password" :placeholder="$t('basic.password')")
        Iinput(v-else class="box-col-flex" inputType="password" v-model="form.password" :placeholder="$t('basic.password')")
        i.iconfont(v-if="!showPwd" @click="showPwd=true") &#xe8eb;
        i.iconfont(v-else  @click="showPwd=false") &#xe601;
        .half-x-line
      .num-con.box.box-y-center
        Iinput(v-if="showComfirePwd" class="box-col-flex" inputType="text" v-model="form.comfirepassword" :placeholder="$t('basic.comfirepassword')")
        Iinput(v-else class="box-col-flex" inputType="password" v-model="form.comfirepassword" :placeholder="$t('basic.comfirepassword')")
        i.iconfont(v-if="!showComfirePwd" @click="showComfirePwd=true") &#xe8eb;
        i.iconfont(v-else  @click="showComfirePwd=false") &#xe601;
        .half-x-line
      GetVerifyCode(v-model="form.smsCode" :accept="form.username" :interceptor="interceptor" :acceptType="[regType]" sendMsgType="1" )
      .num-con.box.box-y-center
        Iinput(class="box-col-flex" inputType="text" maxlength="6" v-model="form.visitCode" :placeholder="$t('register.visitCode')")
        .half-x-line
      .bottom.box.box-y-center(style="margin-top:4vw")
        .left
          i-radio(v-model="notam")
            div(style="word-wrap:break-word;word-break: normal;") {{ $t('register.notam') }}
      .bottom.box.box-y-center(style="margin-top:4vw")
        .left
          i-radio(v-model="checked")
            div(@click="openLegal('Legal')" style="word-wrap:break-word;word-break: normal;") {{ $t('register.have_read_handbook') }}
      IButton(class="button" :class="{active: testForm.length === 0 && sendType === 2 && checked}" @click="registerFn" style="margin-top:4vw") {{ $t('basic.register') }}

        <!--</span>-->
        <!--.right.box-x-right-flex(@click="jumpPage('Register')" style="word-wrap:break-word;word-break: normal;") {{ $t('register.mobile_register') }}-->
</template>
<script>
import components from '@/components'
import GetVerifyCode from '../Login/GetVerifyCode'
export default {
  name: 'Register',
  components: {
    ...components,
    GetVerifyCode,
  },
  data() {
    return {
      regType: 2,
      showPwd: false,
      showComfirePwd: false,
      addressSelect: '',
      countryName: '',
      addressConf: {},
      form: {
        username: null,
        password: null,
        comfirepassword: null,
        smsCode: null,
        visitCode: null,
      },
      checked: false,
      notam: false,
    }
  },
  computed: {
    testForm() {
      return this.$Helper.testParamsComplete({ params: this.form, except: ['visitCode'] })
    },
    sendType() {
      if (this.form.username && (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.form.username))) return 2
      if (this.form.username && /^\d{8,30}$/.test(this.form.username)) return 1
      return 0
    },
  },
  watch: {},
  methods: {
    jumpPage(name) {
      this.$Helper.jumpPage(name, this)
    },
    openLegal(name) {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: name,
          type: 'right',
        },
      )
    },
    showSlideModel() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'CountrySelect',
          type: 'right',
          params: {
            callback: item => {
              this.addressSelect = item.countryCode
              this.countryName = item.code
            },
          },
        },
      )
    },
    interceptor(next) {
      if (!this.validate(true)) return
      next()
    },
    validate(exceptSmsCode = false) {
      if (!this.notam) {
        this.$Helper.emitAction('toast', {
          text: this.$t('register.amcheck'),
        })
        return false
      }
      if (!this.checked) {
        this.$Helper.emitAction('toast', {
          text: this.$t('login.protocol'),
        })
        return false
      }
      let testForm = this.$Helper.testParamsComplete({ params: this.form, except: !exceptSmsCode ? ['visitCode'] : ['visitCode', 'smsCode'] })
      // if (!this.countryName) {
      //   this.$Helper.emitAction('toast', { text: this.$t('identity.contry_toast') })
      //   return false
      // }
      if (testForm.length > 0) {
        let formConf = {
          username: this.$t('forgetPwd.input_email'),
          password: this.$t('forgetPwd.input_pwd'),
          comfirepassword: this.$t('forgetPwd.input_pwd'),
          smsCode: this.$t('verify.verify_code_toast'),
        }
        this.$Helper.emitAction(
          'toast',
          {
            text: formConf[testForm[0]],
            // type: 'bottom',
          },
        )
        return false
      }
      if (this.sendType !== 2) {
        this.$Helper.emitAction('toast', {
          text: this.$t('login.email_error_toast'),
        })
        return false
      }
      if (!this.$Helper.checkPassword(this.form.password)) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.pwd_test_error') })
        return false
      }
      if (this.form.password !== this.form.comfirepassword) {
        this.$Helper.emitAction('toast', { text: this.$t('basic.pwdComfirmErr') })
        return false
      }
      return true
    },
    registerFn() {
      if (document.domain.indexOf('udax.my') !== -1) {
        return
      }
      if (!this.validate(false)) return
      this.$Helper.ajax({
        url: '/app/regin.api',
        params: {
          ...this.form,
          countryCode: this.addressSelect,
          countryName: this.countryName,
          regType: this.regType,
        },
        method: 'POST',
      })
      .then(
        ({code, msg, data}) => {
          if (code === 500) {  // verify code error
          } else if (code === 200) { // success
            this.$Helper.setCache('Login', { username: this.form.username })
            // register success, jump to login
            setTimeout(() => this.$Helper.jumpPage('Login', this), 400)
          }
          this.$Helper.emitAction('toast', {
            text: msg,
            type: 'bottom',
          })
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
  .login-container {
    .con{
      h5{
        // opacity: 0;
      }
    }
  }
</style>
