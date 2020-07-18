<template lang="pug">
  .container.box.box-row
    .top-con.box-row-flex.overflow-y.mescroll
      h5 {{ $t('myfund.avilable_fund') }}
      h2 {{ $Helper.numFixedLength(query.availableAmount) }} {{ query.dcCode }}
      .linkname
        h5(v-if="query.dcCode==='USDT'") {{$t('basic.chainname')}}
        ul(v-if="query.dcCode==='USDT'")
          li(v-for="item in usdtArray" :class="item===protocolType?'on':''" @click="changeProtocol(item)") {{item}}
      h5 {{ $t('myfund.extract_address') }}
      .num-con.box.box-y-center
        Iinput(inputType="text" v-model="address" maxlength="80" :placeholder="$t('myfund.input_address')")
        //- i.iconfont(@click="scanQrCode" v-if="isApp") &#xe618;
        i.iconfont(@click="scanQrCode") &#xe618;
        .half-y-line
        i.iconfont(@click="showHtEtcAddress") &#xe619;
        // .half-y-line
        // i.iconfont &#xe619;
      .half-x-line(v-if="query.dcCode==='XRP'")
      h5(v-if="query.dcCode==='XRP'") {{ $t('myfund.tag') }}
        span(style="font-size:2.5vw;color:#ff0000;font-weight:normal" v-if="query.dcCode==='XRP'")  ({{ $t('myfund.mustread') }})
      .num-con.box.box-y-center
        Iinput(v-if="query.dcCode==='XRP'" inputType="text" v-model="tag" :placeholder="$t('myfund.input_tag')")


      .half-x-line
      h5 {{ $t('basic.num') }}
      .num-con.box.box-y-center
        Iinput(inputType="number" v-model="num" :placeholder="`${$t('myfund.min_extract')} ${query.limitWithdraw}`")
        span {{ query.dcCode }}
        .half-y-line
        span.all(@click="num=query.availableAmount") {{ $t('basic.all') }}
      .half-x-line
      .amount ≈ {{ $Helper.formatAmount(caculatePrice(query.dcCode) * caculateRateNum({symbol: query.dcCode + '/' + sellteMarket, lastPrice: num })) }} {{ currencyRate }}
      h5 {{ $t('myfund.poundage') }}
      .num-con.box.box-y-center
        Iinput(inputType="text" :value="chargeAmount" :placeholder="$t('myfund.poundage')" :disabled="true")
        span {{ query.dcCode }}
      .half-x-line
      .info(v-html="query.remarks")
    .bottom-con
      .comfirm.box.box-y-center
        span {{ $t('myfund.account_num') }}
        .num.box.box-x-right.box-col-flex {{ $Helper.numFixedLength(actualNum > 0 ? actualNum : 0) }} {{ query.dcCode }}
      .login-btn.box.box-item(@click="extractFn" :class="{active: address && num && num >= query.limitWithdraw && num <= query.withdrawQuota && actualNum > 0}") {{ $t('basic.extract') }}
</template>
<script>
  import components from '@/components'
  import caculateMixin from '@/mixin/caculate'
  import { mapState } from 'vuex'
  export default {
    name: 'Extract',
    components,
    data() {
      return {
        query: {},
        address: null,
        tag: '',
        num: 0,
        canwithdraw: 0,
        usdtArray: ['ERC20', 'OMNI'],
        protocolType: '',
      }
    },
    mixins: [caculateMixin],
    computed: {
      ...mapState('basic', ['mobile', 'openPhoneValid', 'openEmailValid']),
      ...mapState('commonParam', ['paramAddress', 'chainProtocol']),
      actualNum() {
        return this.num - this.chargeAmount
      },
      isApp() {
        return window.api || (window.webkit && window.webkit.messageHandlers)
      },
      chargeAmount() {
        return this.$Helper.numFixedLength(this.query.chargeType === 1 ? this.query.chargeAmount : (this.query.chargeAmount * this.num), 8, 30)
      },
    },
    watch: {},
    methods: {
      Run(name) {
        if (this.$Helper.isType(name, () => {})) {
          name.call(this)
          return
        }
        this.$Helper.jumpPage(name, this)
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
      showHtEtcAddress() {
        let query = {dcCode: this.query.dcCode, protocolType: this.protocolType}
        this.$Helper.jumpPage({ name: 'HtEtcAddress', params: query }, this)
      },
      changeProtocol(protocolType) {
        this.protocolType = protocolType
        this.address = ''
        this.initBasicInfo()
      },
      initBasicInfo() {
        this.$Helper.ajax({
          url: `/app/account/withdrawReq.api`,
          params: {
            symbol: this.query.dcCode,
            protocolType: this.protocolType,
          },
        })
          .then(({data}) => {
            this.query = { ...this.query, ...data }
          })
      },
      validate() {
        if (!this.address) {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.extract_address_empty'),
          })
          return false
        }
        if (!this.num) {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.extract_num_empty'),
          })
          return false
        }
        if (this.num < this.query.limitWithdraw) {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.extract_num_less_toast'),
          })
          return false
        }
        if (this.num > this.query.withdrawQuota) {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.extract_num_more_quota'),
          })
          return false
        }
        if (this.num > this.query.availableAmount) {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.extract_num_more_toast'),
          })
          return false
        }
        if (this.actualNum < 0) {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.avalible_num_less_toast'),
          })
          return false
        }
        return true
      },
      extractFn() {
        if (!this.validate()) return
        // create a action id activity
        const actionId = `ModifyValidate_withdrawRequest_actionId_${this.$Helper.getTime()}`
        // subcribe the action when validate success
        this.$Helper.onAction(actionId, smsCode => {
          if (this.canwithdraw > 0) return
          this.canwithdraw++
          let params = {
            chargeAmount: this.chargeAmount,
            arrivalAmoumt: this.actualNum,
            symbol: this.query.dcCode,
            userAddress: this.address,
            tradeAmount: this.num,
            tag: this.tag,
            protocolType: this.protocolType,
          }
          if (smsCode[0]) params.mobileCode = smsCode[0]
          if (smsCode[1]) params.emailCode = smsCode[1]
          this.$Helper.ajax({
            url: `/app/account/withdrawals.api`,
            params,
          })
            .then(({data, msg, code}) => {
              if (code === 200) {
                this.$store.dispatch('commonParam/setCommonParam', { paramAvailable: this.query.availableAmount - this.num }) // 将提币后的余额放入store,返回到上一页面更新可用余额值
                setTimeout(() => {
                  this.canwithdraw = 0
                  this.$Helper.jumpBack()
                }, 600)
                msg = this.$t('httpCode.200')
              } else {
                this.canwithdraw = 0
              }
              this.$Helper.emitAction('toast', {
                text: msg,
              })
            })
        })
        // dispatch the action to show the validate model 弹出验证码框
        this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: { bindType: this.openPhoneValid === 1 ? 'mobile' : 'email', sendMsgType: 12, actionId } })
      },
    },
    created() {
      this.query = this.$Helper.getUrlParams()
      this.address = this.paramAddress
      if (this.chainProtocol) {
        this.protocolType = this.chainProtocol
        this.$store.dispatch('commonParam/setCommonParam', { chainProtocol: '' })
      } else {
        if (this.query.dcCode === 'USDT') {
          this.protocolType = 'ERC20'
        }
      }
      this.$store.dispatch('commonParam/setCommonParam', { paramAddress: '' }) // 清空store里的值
      this.$store.dispatch('commonParam/setCommonParam', { paramAvailable: this.query.availableAmount }) // 将数据库查询出来的可用余额放入store
      this.$Helper.emitAction('setCustomTitle', this.query.dcCode + ' ' + this.$t('basic.extract'))
      this.initBasicInfo()
      // android
      window['callQRCode'] = (qrCode) => {
        this.address = qrCode
      }
      // ios
      window['scanResult'] = (qrCode) => {
        this.address = qrCode
      }
      const actionId = `showShareMenu`
      this.$Helper.onAction(actionId, showHistory => {
        let query = {dcCode: this.query.dcCode, bottomSelect: 1}
        this.$Helper.jumpPage({ name: 'History', query: query }, this)
      })
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    .top-con{
      overflow-x: hidden;
      overflow-y: auto;
      padding: 3vw 4vw;
    }
    h5{
      font-size: 3.8vw;
      padding: 2vw 0;
      margin-top: 3vw;
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
      margin-bottom: 2vw;
    }
    .amount{
      font-size: 3.4vw;
      color: #444;
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
    .num-con{
      span{

        font-size: 4vw;
        &.all{
          color: @icon-color;
          flex-shrink: 0;
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
    .bottom-con{
      background: #fff;
      padding: 3vw 4vw;
      padding-top: 0;
      box-shadow: 1px 0px 7px #ddd;
      z-index: 1;
      .comfirm{
        margin: 4vw 0;
        span{
          color: #c8c8c8;
          font-size: 3.8vw;
        }
        .num{
          font-size: 4vw;
          font-weight: 500;
        }
      }
      .login-btn{
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
    }
    .linkname{
      ul{
        display:flex;
        justify-content: flex-start;
        align-items: center;
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
</style>
