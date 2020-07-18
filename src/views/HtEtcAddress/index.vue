<template lang="pug">
<div class="container">
  <div class="overflow-y mescroll box-row-flex">
    ul
      //- li.box(v-for="i in 5" :key="i")
      li.box(v-for="(item, key) of addressList" :id="item.id" @click="showSelect(item.withdrawAdd)")
        .left
          i.iconfont &#xe668;
        .right.box-col-flex
          .name {{ item.remark }}
          .address {{ item.withdrawAdd }}
        .half-x-line
    <error-status :status="errorStatus" />
  </div>
</div>
</template>
<script>
import components from '@/components'
import ErrorStatus from '@/components/ErrorStatus'
import { mapState } from 'vuex'
export default {
  name: 'ExtractAddress',
  components: {
    ...components,
    ErrorStatus,
  },
  data() {
    return {
      addressList: [],
      errorStatus: null,
    }
  },
  computed: {
    ...mapState('commonParam', ['paramAddress']),
  },
  watch: {
    // addressList() {
    //   if (this.addressList && this.addressList.length > 0) this.errorStatus = null
    //   if (this.addressList && this.addressList.length === 0) this.errorStatus = 'empty'
    //   if (!this.addressList) this.errorStatus = 'error'
    // },
  },
  methods: {
    initAddressList(dcCode, protocolType) {
      let $this = this
      this.$Helper.ajax({
        url: '/app/withdraw/getAddressByDcCode.api?dcCode=' + dcCode + '&protocolType=' + protocolType,
        method: 'post',
      })
      .then(
        ({data}) => {
          $this.addressList = data.resultList
          if (this.addressList && this.addressList.length > 0) this.errorStatus = null
          if (this.addressList && this.addressList.length === 0) this.errorStatus = 'empty'
          if (!this.addressList) this.errorStatus = 'error'
        },
        () => {
          this.errorStatus = 'error'
        },
      )
    },
    showSelect(address) {
      this.$store.dispatch('commonParam/setCommonParam', { paramAddress: address })
      if (this.query.protocolType) {
        this.$store.dispatch('commonParam/setCommonParam', { chainProtocol: this.query.protocolType })
      }
      this.$Helper.jumpBack()
      // let query = {dcCode: this.query.dcCode, address: address}
      // this.$Helper.jumpPage({ name: 'Extract', query }, this)
    },
  },
  created() {
    this.query = this.$route.params
    // this.query = this.$Helper.getUrlParams()
    this.$Helper.emitAction('setCustomTitle', this.query.dcCode + this.$t('withdAddress.address'))
    this.initAddressList(this.query.dcCode, this.query.protocolType)
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
    padding: 3vw 4vw;
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
  }
  .login-btn{
    position: absolute;
    bottom: 7vw;
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
</style>
