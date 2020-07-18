<template lang="pug">
  .container
    .linkname
      h5(v-if="query.dcCode==='USDT'") {{$t('basic.chainname')}}
      ul(v-if="query.dcCode==='USDT'")
        li(v-for="item in usdtArray" :class="item===protocolType?'on':''" @click="getAddress(item)") {{item}}
    .img-con.box.box-item
      // img(:src="qrCodeImage")
      #qrcode
    .save.box.box-item(@click="saveImageFn" v-if="isApp") {{ $t('myfund.save_image') }}
    .url-con
      p.box.box-item {{ userAddress }}
      .copy.box.box-item(@click="copyFn") {{ $t('myfund.copy_address') }}
      p.box.box-item(style="margin-top:20px;" v-if="tag") {{tag}}
      .copy.box.box-item(@click="copyTag" v-if="tag") {{ $t('myfund.copy_tag') }}
    .info(v-html="remark")
</template>
<script>
import _ from 'lodash'
import components from '@/components'
// import { target } from '@/config/setting'
import { mapState } from 'vuex'
export default {
  name: 'HtRecharge',
  components,
  data() {
    return {
      query: {},
      userAddress: null,
      tag: '',
      qrCodeImage: null,
      remark: '',
      usdtArray: ['ERC20', 'OMNI'],
      protocolType: 'ERC20',
      qrcode: null,
    }
  },
  computed: {
    ...mapState('basic', ['token']),
    ...mapState('setting', ['language']),
    isApp() {
      return window.api || (window.webkit && window.webkit.messageHandlers)
    },
  },
  watch: {},
  methods: {
    getAddress(protocolType) {
      if (protocolType) {
        this.protocolType = protocolType
      }
      return this.$Helper.ajax({
        url: '/app/account/bindAddress.api',
        params: {symbol: this.query.dcCode, protocolType: this.protocolType},
      })
      .then(res => {
        let userAddress = _.get(res, 'data.userAddress')
        let tag = _.get(res, 'data.tag')
        let remark = _.get(res, 'data.remark')
        if (userAddress) {
          this.checkAddress(userAddress, tag).then(() => this.getQrImage(userAddress))
          this.remark = remark
        } else {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.get_recharge_address_error'),
          })
        }
      })
    },
    // getQrImage(userAddress) {
    //   const THIS = this
    //   const url = `/app/account/qrcode.api?userAddress=${userAddress}`
    //   const xhr = new XMLHttpRequest()
    //   xhr.open('POST', url, true)
    //   xhr.responseType = `blob`
    //   xhr.setRequestHeader(`UUID`, this.token)
    //   xhr.onload = function() {
    //     if (this.status === 200) {
    //       var blob = this.response
    //       var img = document.createElement('img')
    //       img.onload = function(e) {
    //         window.URL.revokeObjectURL(img.src)
    //       }
    //       THIS.qrCodeImage = window.URL.createObjectURL(blob)
    //     }
    //   }
    //   xhr.send()
    // },
    getQrImage(userAddress) {
      if (!this.qrcode) {
        this.qrcode = new window.QRCode(document.getElementById('qrcode'), {
          width: 120,
          height: 120,
        })
      }
      this.qrcode.clear()
      this.qrcode.makeCode(userAddress)
    },
    checkAddress(userAddress, tag) {
      let tokenAddress = userAddress
      if (tag) {
        tokenAddress = userAddress + '_' + tag
      }
      return this.$Helper.ajax({
        url: '/app/account/checkAddress.api',
        params: {symbol: this.query.dcCode, userAddress: tokenAddress, protocolType: this.protocolType},
      })
      .then(res => {
        let exists = _.get(res, 'data.exists')
        if (exists === 1) {
          this.userAddress = userAddress
          this.tag = tag
          this.$Helper.emitAction('loading', {
            show: false,
          })
        } else {
          this.$Helper.emitAction('toast', {
            text: this.$t('myfund.recheck_address_error'),
          })
        }
      })
    },
    saveImageFn() {
      this.$Helper.emitAction('toast', {
        text: this.$t('basic.save_success'),
      })
      if (window.api) {
        window.api.saveQRCode(this.userAddress)
      } else {
        window.webkit.messageHandlers.iosMethod.postMessage({method: 'saveQrCode', params: { userAddress: this.userAddress, language: this.language }})
      }
    },
    copyFn() {
      this.$Helper.copyToClipboard(this.userAddress)
      this.$Helper.emitAction('toast', {
        type: 'bottom',
        text: this.$t('myfund.copy_success'),
      })
    },
    copyTag() {
      this.$Helper.copyToClipboard(this.tag)
      this.$Helper.emitAction('toast', {
        type: 'bottom',
        text: this.$t('myfund.copy_success'),
      })
    },
  },
  created() {
    this.query = this.$Helper.getUrlParams()
    this.$Helper.emitAction('setCustomTitle', this.query.dcCode + ' ' + this.$t('basic.recharge'))
    this.getAddress()
    const actionId = `showShareMenu`
    this.$Helper.onAction(actionId, showHistory => {
      let query = {dcCode: this.query.dcCode, bottomSelect: 0}
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
    padding: 3vw 4vw;
    .img-con{
      margin-top: 8vw;
      #qrcode{
        height: 120px;
        width: 120px;
      }
      img{
        height: 26vw;
      }
      .image{
        width: 26vw;
        height: 26vw;
      }
    }
    .save{
      color: @icon-color;
      font-size: 4vw;
      margin-top: 4vw;
    }
    .url-con{
      background: @bg;
      margin: 10vw auto;
      margin-bottom:1vw;
      padding: 3vw;
      p{
        height: 9vw;
        font-size: 4vw;
      }
      .copy{
        color: @icon-color;
        font-size: 4.2vw;
        margin-top: 1vw;
      }
    }
    .info{
      margin-top: 5vw;
      p{
        font-size: 3.3vw;
        line-height: 180%;
        color: #bbb;
      }
    }
    h5{
      font-size: 3.8vw;
      padding: 2vw 0;

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
