<template lang="pug">
  .container
    .linkname
      h5(v-if="query.dcCode==='USDT'") {{$t('basic.chainname')}}
        ul(v-if="query.dcCode==='USDT'")
          li(v-for="item in usdtArray" :class="item===protocolType?'on':''" @click="changeProtocol(item)") {{item}}
    h5 {{ $t('withdAddress.address') }}
    .num-con.box.box-y-center
      Iinput(inputType="text" v-model="address" :placeholder="$t('myfund.input_address')")
      i.iconfont(@click="scanQrCode") &#xe618;
    .half-x-line
    h5 {{ $t('withdAddress.remark') }}

    Iinput(inputType="text" v-model="remark" :value= "remarkValue" )
    .half-x-line
    //- .login-btn.box.box-item(@click="$Helper.jumpBack") 确定
    .login-btn.box.box-item(@click="addAddressClick"  :class="{active: address && remark }") {{ $t('basic.comfirm') }}
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'AddAddress',
  components,
  data() {
    return {
      address: '',
      remark: '',
      dcCode: '',
      addressNum: 0,
      usdtArray: ['OMNI', 'ERC20'],
      protocolType: 'OMNI',
    }
  },
  computed: {
    ...mapState('basic', ['mobile', 'openPhoneValid', 'openEmailValid']),
    isApp() {
      return window.api || (window.webkit && window.webkit.messageHandlers)
    },
    remarkValue() {
      this.remark = this.query.dcCode + '-Address' + (this.query.addressNum - 0 + 1)
      return this.query.dcCode + '-Address' + (this.query.addressNum - 0 + 1)
    },
  },
  watch: {},
  methods: {
    scanQrCode() {
      if (this.$Helper.isAndroid()) {
        // andriod
        window.api.scanQRCode()
      } else {
        // ios
        window.webkit.messageHandlers.iosMethod.postMessage('scanQR')
      }
    },
    Run(name) {
      if (this.$Helper.isType(name, () => {})) {
        name.call(this)
        return
      }
      this.$Helper.jumpPage(name, this)
    },
    validate() {
      if (!this.address) {
        this.$Helper.emitAction('toast', {
          text: this.$t('myfund.extract_address_empty'),
        })
        return false
      }
      if (!this.remark) {
        this.$Helper.emitAction('toast', {
          text: this.$t('withdAddress.remarkEmpty'),
        })
        return false
      }
      return true
    },
    changeProtocol(protocolType) {
      this.protocolType = protocolType
    },
    addAddressClick() {
      if (!this.validate()) return
      // create a action id activity
      const actionId = `ModifyValidate_AddAddress_actionId_${this.$Helper.getTime()}`
      // subcribe the action when validate success
      this.$Helper.onAction(actionId, smsCode => {
        let params = {
          dcCode: this.query.dcCode,
          address: this.address,
          remark: this.remark,
          protocolType: this.protocolType,
        }
        if (smsCode[0]) params.mobileCode = smsCode[0]
        if (smsCode[1]) params.emailCode = smsCode[1]
        this.$Helper.ajax({
          url: '/app/withdraw/addAddress.api',
          params,
        })
        .then(
          ({code, msg}) => {
            if (code === 200) {
              // let query = {dcCode: this.query.dcCode, addressNum: this.query.addressNum - 0 + 1}
              // this.$Helper.jumpPage({ name: 'ExtractAddress', query }, this)
              // this.$store.dispatch('layermodel/close')
              setTimeout(() => {
                this.$Helper.jumpBack()
              }, 600)
              msg = this.$t('withdAddress.add_success')
              this.$Helper.emitAction('toast', {
                text: msg,
              })
            }
            this.$Helper.emitAction('toast', { text: msg })
          },
        )
      })
      // dispatch the action to show the validate model 弹出验证码框
      this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: { bindType: this.openPhoneValid === 1 ? 'mobile' : 'email', sendMsgType: 11, actionId } })
    },
  },
  created() {
    this.query = this.$Helper.getUrlParams()
    // android
    window['callQRCode'] = (qrCode) => {
      this.address = qrCode
    }
    // ios
    window['scanResult'] = (qrCode) => {
      this.address = qrCode
    }
  },
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
      font-size: 6.4vw;
      margin-bottom: 7vw;
      font-weight: 600;
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
    .info{
      background: #f9f9f9;
      border-radius: 6px;
      padding: 2vw 3vw;
      p{
        font-size: 3.5vw;
        color: #c8c8c8;
      }
    }
    .comfirm{
      margin-top: 5vw;
      span{
        color: #c8c8c8;
        font-size: 3.8vw;
      }
      .num{
        font-size: 4vw;
        font-weight: 500;
      }
    }
    .num-con{
      span{
        width: 15vw;
        font-size: 4vw;
        &.all{
          color: @active-deep;
        }
      }
      i{
        font-size: 4.6vw;
        padding: 2vw;
      }
      .half-y-line{
        height: 3vw;
        margin:0 2vw;
      }
    }
    .linkname{
      ul{
        display:flex;
        justify-content: flex-start;
        align-items: center;
        padding:0.5rem 0;
      }

      li{
        background:#f1f1f1;
        border:1px solid #f1f1f1;
        border-radius: 4px;
        margin-right:10px;
        padding:8px 20px;

        text-align: center;
      }
      li.on{
        border:1px solid #64acf5;
        color:#64acf5
      }
    }
  }
  .login-btn{
    position: absolute;
    bottom: 4vw;
    left: 0;
    right: 0;
    height: 11vw;
    width: 92vw;
    margin:0 auto;
    background: #bbb;
    color: white;
    font-size: 4.2vw;
    font-weight: 600;
    border-radius: 1px;
    &.active{
          background: @icon-color;
    }
  }
</style>
