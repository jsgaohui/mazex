<template lang="pug">
  .login-container
    .head.box-y-center
      .close(@click="$Helper.jumpBack")
        i.iconfont &#xe620;
      .box-x-right-flex.login(@click="jumpPage('Login')") {{ $t('basic.login') }}
    .con
      .tab-menu.box.box-y-c-y-center
          h2(style="margin-top:1vh;") {{ $t('register.mobile_register') }}
          h3(style="margin-top:2.5vh;margin-left:2vh;font-size:3vh")(@click="jumpPage('EmailRegister')") {{ $t('register.email_register') }}
      h5
        i.iconfont &#xe622;
        span {{ $t('register.address_cannot_change') }}
      .num-con.box.box-y-center(style="margin-top: 2vh")
        span(@click="showCountryModel") {{ countrySelect || $t('identity.contry_toast') }}
        i.iconfont(style="margin-right: 4vw;font-size: 4vw" @click="showSlideModel") &#xe61f;
      .num-con.box.box-y-center
        span(@click="showSlideModel") +{{ addressSelect }}
        i.iconfont(style="margin-right: 4vw;font-size: 4vw" @click="showSlideModel") &#xe61f;
        Iinput(class="box-col-flex" inputType="text" v-model="form.username" :placeholder="$t('basic.mobile')")
        .half-x-line
      .num-con.box.box-y-center
        Iinput(v-if="showPwd" class="box-col-flex" inputType="text" v-model="form.password" :placeholder="$t('basic.password')")
        Iinput(v-else class="box-col-flex" inputType="password" v-model="form.password" :placeholder="$t('basic.password')")
        i.iconfont(v-if="!showPwd" @click="showPwd=true") &#xe8eb;
        i.iconfont(v-else  @click="showPwd=false") &#xe601;
        .half-x-line
      GetVerifyCode(v-model="form.smsCode" :accept="form.username" :interceptor="interceptor" :acceptType="[regType]" sendMsgType="1" :countryCode="addressSelect" )
      .num-con.box.box-y-center
        Iinput(class="box-col-flex" inputType="text" v-model="form.visitCode" :placeholder="$t('register.visitCode')")
        i.iconfont(@click="scanQrCode" style="font-size: 4vw;" v-if="isApp") &#xe618;
        .half-x-line
      IButton(class="button" :class="{active: testForm.length === 0 && sendType === 1 && checked}" @click="registerFn") {{ $t('basic.register') }}
      .bottom.box.box-y-center
        .left
          i-radio(v-model="checked")
            span(@click="jumpPage('Legal')" style="word-wrap:break-word;word-break: break-all;") {{ $t('register.have_read_handbook') }}
        </span>
        <!--.right.box-x-right-flex(@click="jumpPage('EmailRegister')") {{ $t('register.email_register') }}-->
</template>
<script>
import components from '@/components'
import GetVerifyCode from '../Login/GetVerifyCode'
import _ from 'lodash'
export default {
  name: 'Register',
  components: {
    ...components,
    GetVerifyCode,
  },
  data() {
    return {
      regType: 1,
      addressSelect: '86',
      countrySelect: '',
      showPwd: false,
      form: {
        username: null,
        password: null,
        smsCode: null,
        visitCode: null,
      },
      checked: false,
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
    addressName() {
      return _.get(this, `addressConf[${this.addressSelect}].name`)
    },
    isApp() {
      return window.api || (window.webkit && window.webkit.messageHandlers)
    },
  },
  watch: {},
  methods: {
    jumpPage(name) {
      this.$Helper.jumpPage(name, this)
    },
    showCountryModel() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'CountrySelect',
          type: 'right',
          params: {
            callback: item => {
              this.countrySelect = item.code
              this.addressSelect = item.countryCode
            },
          },
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
            },
          },
        },
      )
    },
    interceptor(next) {
      if (!this.validate(true)) return
      next()
    },
    validate(exceptSmsCode = true) {
      if (!this.countrySelect) {
        this.$Helper.emitAction('toast', {
          text: this.$t('identity.contry_toast'),
          type: 'bottom',
        })
        return false
      }
      if (!this.form.username || this.form.username.length < 8 || this.form.username.length > 30) {
        this.$Helper.emitAction('toast', {
          text: this.$t('login.phone_length_error_toast'),
          type: 'bottom',
        })
        return false
      }
      if (this.form.username.indexOf('-') !== -1) {
        this.$Helper.emitAction('toast', {
          text: this.$t('login.phone_less_error_toast'),
          type: 'bottom',
        })
        return false
      }
      if (!this.$Helper.checkPassword(this.form.password)) {
        this.$Helper.emitAction('toast', { text: this.$t('forgetPwd.pwd_test_error') })
        return false
      }
      let testForm = this.$Helper.testParamsComplete({ params: this.form, except: !exceptSmsCode ? ['visitCode'] : ['visitCode', 'smsCode'] })
      if (testForm.length > 0) {
        let formConf = {
          username: this.$t('basic.mobile'),
          password: this.$t('basic.password'),
          smsCode: this.$t('basic.smscode'),
        }
        this.$Helper.emitAction(
          'toast',
          {
            text: `${this.$t('basic.please_input')}${formConf[testForm[0]]}`,
            type: 'bottom',
          },
        )
        return false
      }
      if (this.sendType !== 1) {
        this.$Helper.emitAction('toast', {
          text: this.$t('login.phone_error_toast'),
          type: 'bottom',
        })
        return false
      }
      return true
    },
    registerFn() {
      if (!this.validate(false)) return
      this.$Helper.ajax({
        url: '/app/regin.api',
        params: {
          ...this.form,
          countryCode: this.addressSelect,
          countryName: this.countrySelect,
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
    scanQrCode() {
      if (this.$Helper.isAndroid()) {
        // andriod
        window.api.scanQRCode()
      } else {
        // ios
        window.webkit.messageHandlers.iosMethod.postMessage('scanQR')
      }
    },
  },
  created() {
    // get visitedcode
    this.form.visitCode = this.$Helper.getUrlParamsByKey('visitCode')
    // android
    window['callQRCode'] = (qrCode) => {
      this.form.visitCode = qrCode
    }
    // ios
    window['scanResult'] = (qrCode) => {
      this.form.visitCode = qrCode
    }
  },
  mounted() {},
}
</script>

<style lang="less">
  @import url('../../theme/index.less');
  .login-container {
    .con{
      h5{
        margin-top: 1.5vh;
        font-size: 3.4vw;
        font-weight: 300;
        color: rgba(255,255,255,0.7);
        i{
          font-size: 3.8vw;
          margin-right: 1vw;
          color: rgba(255,255,255,0.7);
        }
      }
      .bottom{
        // [type='checkbox'] {
        //     background-color: #262A42;
        // }
        // [type='checkbox'] + label:before {
        //     border: 1px solid #D1D3DF;
        //     background: #F2F3F8;
        // }
        // [type='checkbox'] + label:after {
        //     color: #fff;
        // }
        // [type='checkbox'] + label:hover:before {
        //     border-color: #7A98F7;
        // }
        // [type='checkbox']:checked + label:after {
        //     background-color: #7A98F7;
        // }
        // input.small[type='checkbox'] {
        //     box-sizing: border-box;
        //     width: 14px;
        //     height: 14px;
        //     position: absolute;
        //     left: -999999px;
        // }
        // input.small[type='checkbox'] + label {
        //     font-size: 3.5vw;
        //     line-height: 1;
        //     position: relative;
        //     display: inline-block;
        //     height: 14px;
        //     padding-left: 1.5em;
        //     cursor: pointer;
        //     color: #90baf8;
        // }
        // input.small[type='checkbox'] + label:before {
        //     content: ' ';
        //     position: absolute;
        //     left: 0;
        //     top: 0;
        //     width: 14px;
        //     height: 14px;
        //     border-radius: 2px;
        //     box-sizing: border-box;
        // }
        // input.small[type='checkbox'] + label:after {
        //     content: "\2713";
        //     font-size: 14px;
        //     line-height: 1;
        //     display: inline-block;
        //     height: 14px;
        //     width: 14px;
        //     text-align: center;
        //     border-radius: 2px;
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     transition: all .2s ease-in-out;
        // }
        // input.small[type='checkbox']:not(:checked) + label:after {
        //     opacity: 0;
        //     transform: scale(0);
        // }
        // input.small[type='checkbox']:checked + label:after {
        //     opacity: 1;
        //     transform: scale(1);
        // }
      }
    }
  }
</style>
