<template lang="html">
  <div class="container">
    <div class="tb-form">
      <h5>{{ $t('basic.mobile') }}</h5>
      <div class="num-con box box-y-center">
        <span @click="showSlideModel">+{{ addressSelect }}</span>
        <i class="iconfont" @click="showSlideModel" style="margin-right: 4vw;font-size: 4vw">&#xe61f;</i>
        <Iinput inputType="text" class="box-col-flex" v-model="phone" :placeholder="$t('forgetPwd.input_mobile')" />
      </div>
      <div class="half-x-line" />
    </div>
    <div class="login-btn box box-item" :class="{active: phone}" @click="nextPage">
      {{ $t('basic.next_step') }}
    </div>
  </div>
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'BindPhone',
  components,
  data() {
    return {
      phone: '',
      addressSelect: '86',
    }
  },
  computed: {
    ...mapState('basic', ['mobile', 'email', 'openPhoneValid', 'openEmailValid']),
  },
  watch: {},
  methods: {
    nextPage() {
      if (!this.phone) {
        this.$Helper.emitAction('toast', {
          text: this.$t('login.phone_error_toast'),
          type: 'center',
        })
        return
      }
      if (this.phone === this.mobile) {
        this.$Helper.emitAction('toast', {
          text: this.$t('login.phone_same_error_toast'),
          type: 'center',
        })
        return
      }
      // create a action id activity
      const actionId = `ModifyValidate_BindPhone_actionId_${this.$Helper.getTime()}`
      // subcribe the action when validate success
      this.$Helper.onAction(actionId, smsCode => {
        let params = {
          countryCode: this.addressSelect,
          phone: this.phone,
        }
        if (smsCode[0]) params.mobileCode = smsCode[0]
        if (smsCode[1]) params.emailCode = smsCode[1]
        this.$Helper.ajax({
          url: '/app/bindPhone.api',
          params,
        })
        .then(
          ({code, msg}) => {
            this.$Helper.emitAction('toast', { text: msg })
            if (code === 200) {
              this.$store.dispatch('basic/setLoginData', { mobile: this.phone })
              this.$Helper.jumpBack()
            }
          },
        )
      })
      // dispatch the action to show the validate model
      this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: { bindType: 'bindPhone', sendMsgType: 5, mobile: this.phone, actionId, countryCode: this.addressSelect } })
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
    .num-con{
      margin-top: 6vw;
      position: relative;
      input{
        background: transparent;
        margin: 3vw 0;
        color: #333;
        font-size: 4.2vw;
        &::-webkit-input-placeholder {
          color: #aaa;
          letter-spacing: 0;
          font-weight: 400;
          font-size: 4vw;
        }
      }
      span{
        font-size: 4.2vw;
        padding-right: 2vw;
      }
      i{
        font-size: 7vw;
        color: #333;
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
