<template lang="pug">
  .login-container
    .head.box-y-center
      .close(@click="$Helper.jumpBack")
        i.iconfont &#xe620;
      .box-x-right-flex.login(@click="jumpPage('EmailRegister')") {{ $t('login.register_free') }}
    .con
      h2 {{ $t('basic.login') }}
      .num-con.box.box-y-center(style="margin-top: 25vw")
        Iinput(class="box-col-flex" inputType="text" v-model="form.username" :placeholder="$t('login.phone_email')")
        .half-x-line
      .num-con.box.box-y-center
        Iinput(v-if="showPwd" class="box-col-flex" inputType="text" v-model="form.password" :placeholder="$t('basic.password')")
        Iinput(v-else class="box-col-flex" inputType="password" v-model="form.password" :placeholder="$t('basic.password')")
        i.iconfont(v-if="!showPwd" @click="showPwd=true") &#xe8eb;
        i.iconfont(v-else  @click="showPwd=false") &#xe601;
        .half-x-line
      .num-con.box.box-y-center
        Iinput(class="box-col-flex" inputType="text" v-model="form.veriCode" :placeholder="$t('login.verifycode')" :style="{fontSize: baseFontSize + 'vw'}" maxlength="4")
        // span(@click="getCodeFn" :style="{fontSize: 0.86 * baseFontSize + 'vw'}") {{ endingTime ? `${endingTime} s` : $t('login.send_verifycode') }}
        img(style="height:80vm;" :src="`${verifyImage}`" @click="getVerifyImage")
        .half-x-line
      //GetVerifyCode(v-model="form.veriCode" :accept="form.username" :acceptType="[1, 2]" sendMsgType="2")
      IButton(class="button" :class="{active: testForm.length === 0 && sendType}" @click="loginFn") {{ $t('basic.login') }}
      .bottom.box
        .left
        .right.box-x-right-flex(@click="jumpPage({name: 'ForgetPwdOne', query: { from: 'Login' }})") {{ $t('login.forget_password') }}
</template>
<script>
  import components from '@/components'
  import GetVerifyCode from './GetVerifyCode'
  export default {
    name: 'Login',
    components: {
      ...components,
      GetVerifyCode,
    },
    data() {
      return {
        verifyImage: null,
        showPwd: false,
        baseFontSize: 4.2,
        form: {
          username: '',
          password: '',
          veriCode: '',
        },
      }
    },
    computed: {
      testForm() {
        return this.$Helper.testParamsComplete({ params: this.form })
      },
      sendType() {
        if (this.form.username && (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.form.username))) return 2
        if (this.form.username && /^\d{8,30}$/.test(this.form.username)) return 1
        return 0
      },
    },
    watch: {},
    methods: {
      getVerifyImage() {
        this.form.veriCode = ''
        this.verifyImage = `/verify/?d=` + Math.random()
      },
      checkCode(len = 2, e) {
        // 37 ArrowLeft
        // 39 ArrowRight
        // 8 Backspace
        // 190、110 .
        // 48 0
        // 49-57 1-9
        let keyCode = e.keyCode
        // get the cursor position dynamic, because some event like click, will change the position unexpected, not only the input event
        let getCursorPos = (ctrl) => {
          var CaretPos = 0
          if (document.selection) {
            ctrl.focus()
            var Sel = document.selection.createRange()
            Sel.moveStart('character', -ctrl.value.length)
            CaretPos = Sel.text.length
          } else if (ctrl.selectionStart || ctrl.selectionStart === '0') {
            CaretPos = ctrl.selectionStart
          }
          return CaretPos
        }
        let cursorPosition = getCursorPos(e.target)
        let inputVal = e.key
        if ([37, 39, 8, 190, 110, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59].indexOf(keyCode) !== -1) {
          let valArr = e.target.value.split('')
          // remove useless input [ArrowLeft, ArrowRight]
          if ([37, 39].indexOf(keyCode) === -1) {
            if (keyCode === 8) {  // if delete
              valArr.splice(cursorPosition, 1)
            } else {
              valArr.splice(cursorPosition, 0, inputVal)
            }
          }
          let dummyVal = valArr.join('')
          let reg
          if (len > 0) {
            reg = new RegExp(`^(([1-9]+[0-9]*.?[0-9]{0,${len}})|(0.?[0-9]{0,${len}}))$`)
          } else {
            reg = /^(([1-9]+[0-9]*)|0)$/
          }
          if (!reg.test(dummyVal)) e.preventDefault()
        } else {
          e.preventDefault()
        }
      },
      // resetCursorPos(e) {
      //   e.target.cursorPosition = this.getCursorPos(e.target)
      //   console.log(e.target.cursorPosition)
      // },
      getCursorPos(ctrl) {
        var CaretPos = 0
        if (document.selection) {
          ctrl.focus()
          var Sel = document.selection.createRange()
          Sel.moveStart('character', -ctrl.value.length)
          CaretPos = Sel.text.length
        } else if (ctrl.selectionStart || ctrl.selectionStart === '0') {
          CaretPos = ctrl.selectionStart
        }
        return CaretPos
      },
      jumpPage(name) {
        this.$Helper.jumpPage(name, this)
      },
      loginFn() {
        if (this.testForm.length > 0) {
          let formConf = {
            username: this.$t('login.phone_email'),
            password: this.$t('basic.password'),
            veriCode: this.$t('login.verifycode'),
          }
          let tip = this.$t('basic.require')
          this.$Helper.emitAction('toast', {
            text: tip + `${formConf[this.testForm[0]]}`,
            // type: 'bottom',
          })
          return
        }
        if (!this.sendType) {
          this.$Helper.emitAction('toast', {
            text: this.$t('login.phone_email_error_toast'),
            // type: 'bottom',
          })
          return
        }
        this.$Helper.ajax({
          url: '/app/login.api',
          params: this.form,
          method: 'POST',
        })
          .then(
            ({code, msg, data}) => {
              if (code !== 200) {  // verify code error
                this.getVerifyImage()
              } else if (code === 200) { // success
                // set userinfo
                let { userInfo, token } = data
                this.$store.dispatch('basic/setLoginData', { ...userInfo, token })
                // deactivateSocket()
                this.$Helper.jumpPage('Home', this)
              }
              this.$Helper.emitAction('toast', {
                text: msg,
                // type: 'bottom',
              })
            },
          )
      },
    },
    created() {
      this.$store.dispatch('basic/clearLoginData')
      this.getVerifyImage()
    },
    mounted() {},
  }
</script>

<style lang="less">
  @import url('../../theme/index.less');
  .login-container {
    background: linear-gradient(150deg, #646da9 , #363e77);
    padding: 2vw 3vw;
    color: #fff;
    .close{
      i{
        color: #fff;
        font-size: 7vw;
      }
    }
    .login{
      font-size: 4vw;
    }
    .con{
      padding: 3vw;
      h2{
        font-size: 7.5vw;
        margin-top: 6vw;
        font-weight: 400;
      }
      .num-con{
        margin-top: 6vw;
        position: relative;
        input{
          background: transparent;
          margin: 3vw 0;
          color: white;
          font-size: 4.2vw;
          &::-webkit-input-placeholder {
            color: rgba(255,255,255,0.5);
            letter-spacing: 0;
            font-weight: 400;
            font-size: 5vw;
          }
        }
        span{
          font-size: 4.2vw;
          padding-right: 2vw;
        }
        i{
          font-size: 7vw;
          color: white;
        }
        .half-x-line{
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          transform-origin: 0 0;
          transform: scale(1, 0.4);
          -webkit-transform-origin: 0 0;
          -webkit-transform: scale(1, 0.4);
        }
        .half-y-line{
          height: 3vw;
          margin:0 2vw;
        }
      }
      .button{
        height: 13vw;
        margin-top: 10vw;
        border-radius: 5px;
        font-size: 4.5vw;
        transition: all 0.4s;
        background: rgba(255, 255, 255, 0.1);
        color: @icon-color;
         &.active{
          background: rgba(255, 255, 255, 1);
        }
      }
      .bottom{
        margin-top: 8vw;
        .left{}
        .right{
          color: white;
          font-size: 4.2vw;
        }
      }
    }
  }
</style>
