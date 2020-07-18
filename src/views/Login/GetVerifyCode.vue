<template lang="pug">
  .num-con.box.box-y-center
    Iinput(class="box-col-flex" inputType="text" maxlength="6" v-model="inputValue" :placeholder="$t('register.verifycode')" :style="{fontSize: baseFontSize + 'vw'}")
    span(@click="getCodeFn" :style="{fontSize: 0.86 * baseFontSize + 'vw'}") {{ endingTime ? `${endingTime} s` : $t('login.send_verifycode') }}
    .half-x-line
</template>
<script>
import components from '@/components'
export default {
  components,
  data() {
    return {
      endingTime: 0,
      timer: null,
      verifyCode: null,
      inputValue: null,
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    accept: {
      type: [String, Number],
      default: '',
    },
    acceptType: {
      type: Array,
      default: [1, 2], // [phone, email]
    },
    sendMsgType: {
      type: [String, Number],
      default: '2',
    },
    baseFontSize: {
      type: Number,
      default: 4.2,
    },
    countryCode: {
      type: [Number, String],
    },
    interceptor: {
      type: Function,
    },
  },
  computed: {
    sendType() {
      if (this.accept && (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.accept))) return 2
      if (this.accept && /^\d{8,30}$/.test(this.accept)) return 1
      return 0
    },
  },
  watch: {
    value() {
      this.inputValue = this.value
    },
    inputValue() {
      this.$emit('input', this.inputValue)
    },
  },
  methods: {
    // judgeExistFn() {
    //   return new Promise((resolve, reject) => {
    //     if (!this.judgeExist) resolve()
    //     this.$Helper.ajax({
    //       url: '/app/chkAccount.api',
    //       params: {
    //         account: this.accept,
    //       },
    //     })
    //     .then(
    //       ({ msg, code }) => {
    //         this.$Helper.emitAction('toast', { text: msg })
    //         if (code === 200) {
    //           resolve()
    //         } else {
    //           reject()
    //         }
    //       },
    //       () => reject(),
    //     )
    //   })
    // },
    getCodeFn() {
      if (this.endingTime) {
        this.$Helper.emitAction('toast', {
          text: `${this.$t('login.please_wait')} ${this.endingTime}s`,
          // type: 'bottom',
        })
        return
      }
      if (this.acceptType.indexOf(this.sendType) === -1) {
        let acceptConf = [null, this.$t('basic.mobile'), this.$t('basic.email')]
        this.$Helper.emitAction('toast', {
          text: `${this.acceptType.map(item => acceptConf[item]).join(this.$t('basic.or'))} ${this.$t('login.format_error')}`,
          // type: 'bottom',
        })
        return
      }
      if (this.interceptor) {
        this.interceptor(() => this.sendacceptCode())
      } else {
        this.sendacceptCode()
      }
      // this.judgeExistFn().then(() => this.showVerify())
    },
    showVerify() {
      const actionId = `login_verify_action_${this.$Helper.getTime()}`
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
    sendacceptCode() {
      let params = {
        sendType: this.sendType,
        sendMsgType: this.sendMsgType,
        mobile: this.accept,
        verifyCode: this.verifyCode,
        countryCode: this.countryCode,
      }
      if (this.countryCode) params.countryCode = this.countryCode
      this.$Helper
      .ajax({
        url: '/app/sendsms.api',
        method: 'POST',
        params,
      }).then(
        ({code, msg}) => {
          if (code === 400) {  // verify code error
            this.showVerify()
          } else if (code === 200) { // success
            this.setTimer()
          }
          this.$Helper.emitAction('toast', {
            text: msg,
            type: 'top',
          })
        },
        () => {
          this.$Helper.emitAction('toast', {
            text: this.$t('login.verifycode_send_error'),
            type: 'bottom',
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
          text: `${this.$t('login.please_wait')} ${this.endingTime}s`,
          type: 'bottom',
        })
      }
    },
  },
  created() {
    this.inputValue = this.value
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {

  }
</style>
