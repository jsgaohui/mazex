<template lang="pug">
  .code-container
    h2 {{ $t('verify.verify_code_toast') }}
    ul.box.box-item(@click="focus")
      li.box.box-item(v-for="i in 6" :key="i")
        span {{ value.substr(i - 1, 1) }}
        .half-y-line(v-if="value.length + 1 === i && showFocus")
      input(v-model="value" type="number" placeholder="" id="code_input")
    .again-con.box.box-y-center.box-x-right
      .again(@click="showVerify") {{ $t('basic.send_again') }}{{ endingTime ? `( ${endingTime}s )` : '' }}
    .login-btn.box.box-item(:class="{active: this.value.length === 6}" @click="nextPage") {{ $t('basic.next_step') }}
</template>
<script>
import components from '@/components'
import _ from 'lodash'
export default {
  name: 'Code',
  components,
  data() {
    return {
      mobile: null,
      value: '',
      countryCode: undefined,
      type: null,
      verifyCode: null,
      showFocus: false,
      timer: null,
      endingTime: 0,
    }
  },
  computed: {},
  watch: {
    value() {
      this.value = this.value.substr(0, 6)
    },
  },
  methods: {
    focus() {
      document.getElementById('code_input').focus()
      this.showFocus = true
    },
    nextPage() {
      if (!this.value || this.value.length < 6) {
        this.$Helper.emitAction('toast', {
          text: this.$t('verify.verify_code_toast'),
        })
        return
      }
      this.$Helper.ajax({
        url: this.type === 'mobile' ? '/app/bindPhone.api' : '/app/bindEmail.api',
        params: {
          phone: this.mobile,
          smsCode: this.value,
          countryCode: this.countryCode,
        },
      })
      .then(
        ({msg, code}) => {
          this.$Helper.emitAction('toast', {
            text: msg,
          })
          if (code === 200) {
            setTimeout(() => {
              let params = {}
              params[this.type || 'email'] = this.mobile
              this.$store.dispatch('basic/setLoginData', params)
              this.$Helper.jumpPage({name: 'Account'}, this)
            }, 600)
          }
        },
      )
    },
    sendacceptCode() {
      this.$Helper
      .ajax({
        url: '/app/sendsms.api',
        method: 'POST',
        params: {
          sendType: this.type === 'mobile' ? 1 : 2,
          sendMsgType: 5,
          mobile: this.mobile,
          verifyCode: this.verifyCode,
        },
      }).then(
        ({code, msg}) => {
          if (code === 400) {  // verify code error
            this.showVerify()
          } else if (code === 200) { // success
            this.setTimer()
            this.focus()
          }
          this.$Helper.emitAction('toast', {
            text: msg,
            type: 'top',
          })
        },
        () => {
          this.$Helper.emitAction('toast', {
            text: '验证码发送失败，请联系管理员',
            type: 'top',
          })
        }
      )
    },
    setTimer() {
      if (this.endingTime === 0) {
        if (this.timer) clearInterval(this.timer)
        this.endingTime = 60
        this.timer = setInterval(() => {
          this.endingTime--
          if (this.endingTime === 0) clearInterval(this.timer)
        }, 1000)
      } else {
        this.$Helper.emitAction('toast', {
          text: `${this.endingTime}s后再试`,
          type: 'bottom',
        })
      }
    },
    showVerify() {
      if (this.endingTime !== 0) {
        this.$Helper.emitAction('toast', {
          text: `${this.endingTime}s后再试`,
          type: 'bottom',
        })
        return
      }
      this.showFocus = false
      const actionId = `code_verify_action_${this.$Helper.getTime()}`
      this.$Helper.onAction(actionId, verifyCode => {
        this.verifyCode = verifyCode
        this.sendacceptCode()
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
    },
  },
  created() {
    this.mobile = _.get(this, '$route.params.mobile')
    this.countryCode = _.get(this, '$route.params.countryCode')
    this.type = _.get(this, '$route.params.type')
    setTimeout(() => this.showVerify(), 200)
  },
  mounted() {
    // this.$nextTick(() => {
    //   setTimeout(() => this.focus(), 400)
    // })
  },
  // directives: {
  //   focus: {
  //     inserted: el => {
  //       setTimeout(() => el.focus(), 400)
  //     },
  //   },
  // },
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .code-container {
    background: white;
    padding: 3vw 4vw;
    ul{
      margin-top: 10vw;
      position: relative;
      li{
        border: 1px solid #ddd;
        width: 14vw;
        height: 14vw;
        margin: 1vw;
        .half-y-line{
          background: @active-deep;
          height: 70%;
          animation: flicker 1s infinite;
          -webkit-animation: flicker 1s infinite;
        }
        span{
          color: @icon-color;
          font-size: 8vw;
          font-weight: 500;
        }
      }
      input{
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        font-size: 8vw;
        text-align: center;
        // color: @active-deep;
        line-height: 100%;
        // border: 1px solid red;
        opacity: 0;
        color:transparent;
        text-indent: -999em; /*文本向左缩进*/
        margin-left: -100%; /*输入框光标起始点向左左移*／
        width: 200%; /*输入框增大一倍*/
        // pointer-events: none;
      }
    }
    .again-con{
      height: 14vw;
      .again{
        font-size: 3.8vw;
        color: #666;
      }
    }
    h5{
      font-size: 3.8vw;
      padding: 2vw 0;
    }
    h2{
      font-size: 4.5vw;
      margin-bottom: 7vw;
      color: #333;
    }
    input {
      margin-top: 3vw;
      margin-bottom: 1.8vw;
      width: 100%;
    }
    .half-x-line{
      background: #ccc;
      margin-bottom: 5vw;
    }
    .login-btn{
      position: absolute;
      bottom: 5vh;
      left: 0;
      right: 0;
      height: 11vw;
      width: 90vw;
      margin:0 auto;
      background: #909399;
      color: white;
      font-size: 4.2vw;
      font-weight: 600;
      border-radius: 3px;
      transition: all 0.4s;
      &.active{
        background: @icon-color;
      }
    }
  }
  @keyframes flicker{
    0% {opacity: 0.5;}
    50% {opacity: 0;}
    100% {opacity: 1;}
  }
  @-webkit-keyframes flicker{
    0% {opacity: 0.5;}
    50% {opacity: 0;}
    100% {opacity: 1;}
  }
</style>
