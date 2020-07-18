<template lang="html">
  <div class="container">
    <div class="tb-form">
      <h5>{{ $t('basic.email') }}</h5>
      <Iinput inputType="text" v-model="newEmail" :placeholder="$t('forgetPwd.input_email')" />
      <div class="half-x-line" />
    </div>
    <div class="login-btn box box-item" :class="{active: newEmail}" @click="nextPage">
      {{ $t('basic.next_step') }}
    </div>
  </div>
</template>
<script>
  import components from '@/components'
  import { mapState } from 'vuex'
  export default {
    name: 'BindEmail',
    components,
    data() {
      return {
        newEmail: '',
      }
    },
    computed: {
      ...mapState('basic', ['mobile', 'email', 'openPhoneValid', 'openEmailValid']),
    },
    watch: {},
    methods: {
      nextPage() {
        if (!this.newEmail) {
          this.$Helper.emitAction('toast', {
            text: this.$t('login.email_error_toast'),
            type: 'center',
          })
          return
        }
        // create a action id activity
        const actionId = `ModifyValidate_BindEmail_actionId_${this.$Helper.getTime()}`
        // subcribe the action when validate success
        this.$Helper.onAction(actionId, smsCode => {
          let params = {
            phone: this.newEmail,
          }
          if (smsCode[0]) params.mobileCode = smsCode[0]
          if (smsCode[1]) params.emailCode = smsCode[1]
          this.$Helper.ajax({
            url: '/app/bindEmail.api',
            params,
          })
            .then(
              ({code, msg}) => {
                this.$Helper.emitAction('toast', { text: msg })
                if (code === 200) {
                  this.$store.dispatch('basic/setLoginData', { email: this.newEmail })
                  this.$Helper.jumpBack()
                }
              },
            )
        })
        // dispatch the action to show the validate model
        this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: {bindType: 'bindEmail', sendMsgType: 5, email: this.newEmail, actionId} })
        // this.$Helper.jumpPage({name: 'Code', params: { mobile: this.phone, countryCode: this.addressSelect, type: 'mobile' }}, this)
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
    },
    created() {},
    mounted() {},
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 3vw 4vw;
    h5{
      font-size: 3.8vw;
      padding: 2vw 0;
    }
    h2{
      font-size: 5vw;
      margin-bottom: 7vw;
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
</style>
