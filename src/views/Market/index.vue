<template lang="html">
  <div class="market-container box box-row">
    <div class="content box-row-flex box box-row" v-if="!errorStatus">
      <ScrollTopMenu :list="list" :activeKey="activeKey" @change="changeTopMenu" :lessCenter="false"/>
      <div class="list-con box-row-flex">
        <transition :name='transitionName'>
          <IListOne class="slide-inner overflow-y mescroll" :showRank="false" v-for="(item, key) of list" :list="item.list" :rateList="rateList" :currencyRate="currencyRate" :lastPrices="lastPrices"  v-if="activeKey===key" :key="key"/>
        </transition>
      </div>
    </div>
    <error-status :status="errorStatus" />
  </div>
</template>
<script>
import ErrorStatus from '@/components/ErrorStatus'
import ScrollTopMenu from '@/components/ScrollTopMenu'
import IListOne from '@/components/IListOne'
import basicMixin from '@/mixin/basic'
import _ from 'lodash'
export default {
  name: 'Market',
  components: {
    ErrorStatus,
    ScrollTopMenu,
    IListOne,
  },
  mixins: [basicMixin],
  data() {
    return {
      activeKey: 0,
      transitionName: 'fade',
      errorStatus: null,
    }
  },
  computed: {
    list() {
      return _.map(this.symbolList, (item, key) => ({ text: key, list: item }))
    },
    symbolList() {
      // return _.map(this.lastPrices, item => item)
      let lastPrices = this.lastPrices || {}
      let symbolMap = {}
      _.map(this.symbolMap, (tradeArr, tradeName) => {
        let sObj = tradeArr.map(item => {
          if (item && item.symbol) {
            return lastPrices[item.symbol] || item
          }
        }).filter(s => !!s)
        if (sObj && sObj.length > 0) symbolMap[tradeName] = sObj
      })
      return symbolMap
    },
  },
  watch: {
    activeKey(newVal, oldVal) {
      // save the activekey to cache
      this.$Helper.setCache('MarketActiveKey', newVal)
      this.transitionName = newVal > oldVal ? 'slide-left' : 'slide-right'
    },
    list() {
      if (this.list.length === 0) this.setErrorStatus('empty')
      if (this.list.length > 0) this.setErrorStatus(null)
      if (!this.list[this.activeKey]) this.activeKey = 0
    },
  },
  methods: {
    changeTopMenu(key) {
      this.activeKey = key
    },
    jumpPage(name) {
      this.$Helper.jumpPage(name, this)
    },
    initList() {
      return this.$Helper.ajax({
        url: '/app/trade/appQuotation.api',
        params: {},
      })
      .then(
        ({data}) => {
          if (!data) {
            this.setErrorStatus('error')
            return
          }
          let { resultMap, lastPrices, rateList, currencyRate, sellteMarket } = data
          // update the store
          this.$store.dispatch('quotation/refreshData', { rateList, lastPrices, symbolMap: resultMap, currencyRate, sellteMarket })
        },
        () => {
          this.setErrorStatus('error')
        },
      )
    },
    setErrorStatus(status) {
      if (!this.list || this.list.length === 0) {
        this.errorStatus = status
      } else {
        this.errorStatus = null
      }
    },
    initPage() {
      this.errorStatus = null
      this.initList()
    },
  },
  created() {
    if (!this.list || this.list.length === 0) this.initPage()
    this.activeKey = this.$Helper.getCache('MarketActiveKey') || 0
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .market-container {
    // background: #fff;
    overflow: hidden;
    .top{
      height: 12vw;
      background: @active-deep;
      color: white;
      font-size: 4.4vw;
      font-weight: 600;
      &>div{
        width: 16vw;
        font-size: 4vw;
        i{
          color: white;
        }
      }
    }
    .list-con{
      position: relative;
      .slide-inner{
        transition: all 0.4s ease;
        position: absolute;
        top:0;
        bottom: 0;
        left:0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
</style>
