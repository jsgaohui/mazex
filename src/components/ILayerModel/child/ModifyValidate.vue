<template lang="pug">
  .container
    .head.box.box-y-center
      .left {{ $t('verify.safety_verify') }}
      .right.box.box-col-flex.box-x-right(@click="$Helper.emitAction('closeModel')") {{ $t('basic.cancel') }}
    .half-x-line
    .con
      .item(v-if="showMobile")
        h5 {{ $Helper.secretStr({str: params.mobile ? params.mobile : mobile, length: 4}) }}
        .num-con.box.box-y-center
          Iinput(v-model="smsCode[0]" class="box-col-flex" inputType="text" value="" :placeholder="$t('verify.input_mobile_verify_toast')" :maxlength="6")
          span(@click="showVerify(0)") {{ endingTime[0] ? `${endingTime[0]} s` : $t('login.send_verifycode') }}
        .half-x-line
      .item(v-if="showEmail")
        h5 {{ $Helper.secretStr({str: params.email ? params.email : email, length: 7}) }}
        .num-con.box.box-y-center
          Iinput(v-model="smsCode[1]" class="box-col-flex" inputType="text" value="" :placeholder="$t('verify.input_email_verify_toast')" :maxlength="6")
          span(@click="showVerify(1)") {{ endingTime[1] ? `${endingTime[1]} s` : $t('login.send_verifycode') }}
        .half-x-line
      IButton(class="btn" @click="saveFn") {{ $t('basic.submit') }}
</template>
<script>
import Iinput from '../../Iinput'
import IButton from '../../IButton'
import { mapState } from 'vuex'
export default {
  components: {
    Iinput,
    IButton,
  },
  data() {
    return {
      endingTime: {
        0: 0,
        1: 0,
      },
      timer: [null, null],
      verifyCode: [],
      smsCode: [null, null],
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('basic', ['mobile', 'email', 'openPhoneValid', 'openEmailValid']),
    showEmail() {
       // 如果是重新绑定手机或者邮箱那么要验证邮箱
      if ((this.params.bindType === 'bindPhone' && this.openEmailValid === 1) || (this.params.bindType === 'bindEmail')) return true
      if (this.params.bindType === 'mobile' && this.openPhoneValid === 0) return false  // haven't bind the mobile, and the action is to bind
      if (this.params.bindType === 'mobile' && this.openPhoneValid === 1 && this.email && this.openEmailValid) return true   // action is to unbind the mobile
      if (this.params.bindType === 'email') return true  // action id unbind or bind the email
    },
    showMobile() {
      // 如果是重新绑定手机或者邮箱那么要验证新手机
      if (this.params.bindType === 'bindPhone' || this.params.bindType === 'bindEmail') return true
      if (this.params.bindType === 'email' && this.openEmailValid === 0) return false  // haven't bind the email, and the action is to bind
      if (this.params.bindType === 'email' && this.openEmailValid === 1 && this.mobile && this.openPhoneValid) return true   // action is to unbind the email
      if (this.params.bindType === 'mobile') return true  // action id unbind or bind the mobile
    },
  },
  watch: {},
  methods: {
    saveFn() {
      if (this.showMobile && !this.smsCode[0]) {
        this.$Helper.emitAction('toast', {
          text: this.$t('verify.input_mobile_verify_toast'),
        })
        return
      }
      if (this.showEmail && !this.smsCode[1]) {
        this.$Helper.emitAction('toast', {
          text: this.$t('verify.input_email_verify_toast'),
        })
        return
      }
      // dispatch the action
      this.$Helper.emitAction(this.params.actionId, this.smsCode)
    },
    showVerify(type) {
      if (this.endingTime[type] !== 0) {
        this.$Helper.emitAction('toast', {
          text: `${this.$t('login.please_wait')} ${this.endingTime[type]}s`,
          type: 'bottom',
        })
        return
      }
      this.sendacceptCode(type)
      // const actionId = `validate_verify_action_${this.$Helper.getTime()}`
      // this.$Helper.onAction(actionId, verifyCode => {
      //   this.verifyCode[type] = verifyCode
      //   this.sendacceptCode(type)
      // })
      // this.$store.dispatch(
      //   'layermodel/push',
      //   {
      //     type: 'up',
      //     name: 'Verify',
      //     locked: false,
      //     params: {
      //       actionId,
      //     },
      //   },
      // )
    },
    sendacceptCode(type) {
      this.$Helper
      .ajax({
        url: '/app/sendsms.api',
        method: 'POST',
        params: {
          sendType: type + 1,
          sendMsgType: this.params.sendMsgType || 10,
          mobile: type === 0 ? (this.params.mobile ? this.params.mobile : this.mobile) : (this.params.email ? this.params.email : this.email),
          verifyCode: this.verifyCode[type],
          countryCode: this.params.countryCode,
        },
      }).then(
        ({code, msg}) => {
          if (code === 400) {  // verify code error
            this.showVerify(type)
          } else if (code === 200) { // success
            this.setTimer(type)
          }
          this.$Helper.emitAction('toast', {
            text: msg,
            type: 'top',
          })
        },
        () => {
          this.$Helper.emitAction('toast', {
            text: '验证码发送失败，请联系管理员',
            type: 'bottom',
          })
        }
      )
    },
    setTimer(type) {
      if (this.endingTime[type] === 0) {
        if (this.timer[type]) clearInterval(this.timer[type])
        this.endingTime[type] = 60
        this.timer[type] = setInterval(() => {
          this.endingTime[type]--
          if (this.endingTime[type] === 0) clearInterval(this.timer[type])
        }, 1000)
      } else {
        this.$Helper.emitAction('toast', {
          text: `${this.endingTime[type]}s后再试`,
          type: 'bottom',
        })
      }
    },
  },
  created() {
    // this.params.bindType ['mobile', 'email']
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
    background: white;
    .con{
      padding: 5vw 3vw;
      h5{
        font-size: 3.8vw;
        padding: 2vw 0;
        font-weight: 500;
        margin: 2vw 0;
      }
      .num-con{
        padding: 3vw 0;
        span{
          font-size: 3.6vw;
          color: @icon-color;
        }
        i{
          font-size: 4vw;
          padding: 2vw;
        }
        .half-y-line{
          height: 3vw;
          margin:0 2vw;
        }
      }
    }
    .head{
      height: 15vw;
      padding: 0 3vw;
      .left{
        font-size: 4.5vw;
        font-weight: 600;
      }
      .right{
        font-size: 3.8vw;
        color: #888;
      }
    }
    .btn{
      margin-top: 10vw;
    }
  }
</style>
