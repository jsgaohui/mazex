<template lang="pug">
<div class="container">
  .content
    ul
      //- li.box(v-for="i in 5" :key="i")
      li.box(v-for="(item, key) of addressList" :id="item.id" @click="showBottomSelect(item.id,item.withdrawAdd)")
        .left
          i.iconfont &#xe668;
        .right.box-col-flex
          .name {{ item.remark }}
          .address {{ item.withdrawAdd }}
        .half-x-line
    <error-status :status="errorStatus" />
  .bottom
    .login-btn.box.box-item(@click="addFn") {{ $t('route.AddAddress') }}

</div>
</template>
<script>
import components from '@/components'
import ErrorStatus from '@/components/ErrorStatus'
export default {
  name: 'ExtractAddress',
  components: {
    ...components,
    ErrorStatus,
  },
  data() {
    return {
      addressList: [],
      bottomSelect: '',
      selectAddress: '',
      selectId: '',
      errorStatus: null,
      currentNum: 0,
    }
  },
  computed: {},
  watch: {
    // addressList() {
    //   // if (this.addressList && this.addressList.length > 0) this.errorStatus = null
    //   // if (this.addressList && this.addressList.length === 0) this.errorStatus = 'empty'
    //   // if (!this.addressList) this.errorStatus = 'error'
    // },
    bottomSelect() {
      if (this.bottomSelect === 0) {
        this.copyFn()
      } else if (this.bottomSelect === 1) {
        this.delAddress(this.selectId)
      }
    },
  },
  methods: {
    initAddressList(dcCode) {
      let $this = this
      this.$Helper.ajax({
        url: '/app/withdraw/getAddressByDcCode.api?dcCode=' + dcCode + '&protocolType=',
        method: 'post',
      })
      .then(
        ({data}) => {
          $this.addressList = data.resultList
          this.currentNum = $this.addressList.length
          if (this.addressList && this.addressList.length > 0) this.errorStatus = null
          if (this.addressList && this.addressList.length === 0) this.errorStatus = 'empty'
          if (!this.addressList) this.errorStatus = 'error'
        },
        () => {
          this.errorStatus = 'error'
        },
      )
    },
    delAddress(id) {
      this.bottomSelect = ''
      this.$Helper.emitAction('comfirm', {
        text: this.$t('withdAddress.is_delete'),
        btn: [
          {
            text: this.$t('basic.cancel'),
          },
          {
            text: this.$t('basic.comfirm'),
            callback: () => {
              let $this = this
              this.$Helper.ajax({
                url: '/app/withdraw/deleteAddress.api?id=' + id,
                method: 'post',
              })
              .then(
                ({code, msg}) => {
                  if (code === 200) {
                    this.$Helper.emitAction('toast', {
                      type: 'bottom',
                      text: this.$t('withdAddress.deleteSuccess'),
                    })
                    this.query.addressNum = this.query.addressNum - 0 - 1
                    $this.initAddressList(this.query.dcCode)
                    return
                  }
                  this.$Helper.emitAction('toast', { text: msg })
                },
                () => {
                  this.errorStatus = 'error'
                },
              )
            },
          },
        ],
      })
    },
    showBottomSelect(id, address) {
      this.selectAddress = address
      this.selectId = id
      this.$Helper.copyToClipboard(this.selectAddress) // 选中就复制
      this.$store.dispatch('layermodel/push', { name: 'BottomSelect', type: 'up', params: { active: this.bottomSelect, list: [{text: this.$t('invite.copy'), key: 0, hander: () => { this.bottomSelect = 0 }}, {text: this.$t('withdAddress.delete'), key: 1, hander: () => { this.bottomSelect = 1 }}] } })
    },
    copyFn() {
      // this.$Helper.copyToClipboard(this.selectAddress)
      this.$Helper.emitAction('toast', {
        type: 'bottom',
        text: this.$t('myfund.copy_success'),
      })
      this.bottomSelect = ''
    },
    addFn() {
      let query = {dcCode: this.query.dcCode, addressNum: this.currentNum}
      this.$Helper.jumpPage({ name: 'AddAddress', query }, this)
    },
  },
  created() {
    // this.query = this.$route.params
    this.query = this.$Helper.getUrlParams()
    this.$Helper.emitAction('setCustomTitle', this.query.dcCode + this.$t('withdAddress.address'))
    this.initAddressList(this.query.dcCode)
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    overflow-x: hidden;
    overflow-y: auto;
    background: white;
    .content{
      height:85vh;
      overflow-y: auto;
      padding: 3vw 4vw;

    }
    ul{
      li{
        position: relative;
        padding:3vw 0;
        .left{
          padding-top: 0.6vw;
          i{
            font-size: 4.5vw;
          }
        }
        .right{
          padding:0 2vw;
          .name{
            font-size: 4.5vw;
            font-weight: 600;
            padding-bottom: 1vw;
          }
          .address{
            font-size: 3.8vw;
            font-weight: 400;
            color: #aaa;
          }
        }
        .half-x-line{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }
    .mescroll{
      height:25vh;
    }
  }
  .bottom{
    position:absolute;
    left:0;
    right:0;
    bottom:0;
    background:#fff;
    height:18vw;
    .login-btn{
    position: absolute;
    bottom: 4vw;
    left: 0;
    right: 0;
    height: 11vw;
    width: 92vw;
    margin:0 auto;
    background: @icon-color;
    color: white;
    font-size: 4.2vw;
    font-weight: 600;
    border-radius: 1px;
    }
  }

</style>
