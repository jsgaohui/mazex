<template lang="html">
  <div class="order-container box box-row">
    <ILabel :title="`${showType ? $t('orders.history_entrust') : $t('orders.current_entrust')}`" style="margin:0">
      <i class="iconfont" @click="showType=showType?0:1">&#xe60f;</i>
      <span @click="showType=showType?0:1" class="right-text">{{ `${!showType ? $t('orders.history') : $t('orders.current')}` }}</span>
    </ILabel>
    <div class="half-x-line" />
    <div class="box-row-flex mescroll" id="scroll_list">
      <div v-show="showType===0 && !errorStatus">
        <IOrderList :list="nowList" :isHis="showType===1" key="0"/>
      </div>
      <div v-show="showType===1 && !errorStatus">
        <IOrderList :list="hisList" :isHis="showType===1" key="1"/>
      </div>
    </div>
    <error-status :status="errorStatus" />
  </div>
</template>
<script>
import IOrderList from '@/components/IOrderList'
import ILabel from '@/components/ILabel'
import ErrorStatus from '@/components/ErrorStatus'
import {mapState} from 'vuex'
// import { reloadOrders } from '@/lib/quotation'
import MeScroll from '@/lib/mescroll'
import _ from 'lodash'
import Vue from 'vue'
export default {
  name: 'Orders',
  components: {
    IOrderList,
    ILabel,
    ErrorStatus,
  },
  data() {
    return {
      status: 0,
      showType: 0,  // 0当前 1历史
      allList: {
        commisionList: [],
        hisResult: {
          records: [],
        },
        tradeResult: [],
      },
      concurrentFlag: false, // 并发标志
      executeArr: [], // 执行数组
      pageNumber: 1,
      scrollObj: null,
      nowList: [],
      hisList: [],
      repeatOrdersStatus: [],
    }
  },
  props: {
    symbol: {
      type: String,
    },
  },
  computed: {
    ...mapState('basic', ['uid']),
    errorStatus() {
      let list = !this.showType ? this.nowList : this.hisList
      if (!this.uid) {
        return 'loginout'
      } else if (!list) {
        return 'error'
      } else if (list.length === 0) {
        return 'empty'
      } else if (list.length > 0) {
        return null
      }
    },
  },
  watch: {
    showType() {
      if (this.uid && this.showType === 1 && this.scrollObj) {
        this.pageNumber = 1
        this.hisList = []
        this.scrollObj.resetUpScroll()
      }
    },
    symbol() {
      if (!this.uid) return
      if (this.showType === 0) {
        this.initOrderList()
      } else {
        this.showType = 0
        this.pageNumber = 1
        this.hisList = []
        this.scrollObj.resetUpScroll()
      }
    },
  },
  methods: {
    initScroll() {
      if (this.scrollObj) return
      this.scrollObj = new MeScroll(this.$route.name === 'Orders' ? 'scroll_list' : 'transcation_con', {
        down: {
          use: false,
          auto: false,
        },
        up: {
          callback: this.initOrderList,
          // clearEmptyId: `scroll_list`,
          htmlNodata: `<div class="box box-item empty-status"></div>`,
          htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip"></p>',
          warpClass: '',
        },
      })
    },
    initOrderList() {
      if (this.showType) {
        this.initHisList()
      } else {
        this.initNowList()
      }
      // this.$Helper.ajax({
      //   url: `/app/account/appTradeRecords.api?pageNumber=${this.pageNumber}`,
      //   // url: '/app/trade/curRecords.api?symbol=OMG%2FGOLDT',
      // })
      // .then(
      //   ({data}) => {
      //     // this.allList = data
      //     this.nowList = data.commisionList
      //     let hisList = data.hisResult.records
      //     if (hisList.length > 0) {
      //       this.hisList = this.hisList.concat(hisList)
      //       this.pageNumber++
      //     }
      //     if (!this.showType) {
      //       this.scrollObj.showNoMore()
      //     } else {
      //       this.scrollObj.endSuccess(hisList.length, hisList.length > 0)
      //     }
      //     setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 200)
      //   },
      //   () => {
      //     this.errorStatus = 'error'
      //     setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 200)
      //   },
      // )
    },
    initNowList() {
      this.nowList = []
      this.$Helper.ajax({
        url: `/app/trade/appCurRecords.api`,
        params: {
          symbol: this.symbol,
        },
      })
      .then(
        data => {
          this.nowList = _.get(data, 'data.curList') || []
          this.scrollObj.showNoMore()
          // setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 200)
        },
        () => {
          this.errorStatus = 'error'
          // setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 200)
        },
      )
    },
    initHisList() {
      this.$Helper.ajax({
        url: `/app/trade/appHisRecords.api`,
        params: {
          limit: 10,
          page: this.pageNumber,
          symbol: this.symbol,
        },
      })
      .then(
        ({msg, code, data}) => {
          //
          // if (hisList && hisList.length > 0) {
          //   this.hisList = this.hisList.concat(hisList)
          //   this.pageNumber++
          //   // scrollObj.endSuccess(listQuery.limit, hasNext)
          //   this.scrollObj.endSuccess(10, hisList.length > 0)
          // } else {
          //   this.scrollObj.showNoMore()
          // }
          // setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 200)
          let query = {limit: 10, page: this.pageNumber}
          let hisList = _.get(data, 'hisPage')
          if (this.$Helper.dealHttpCode(code, msg, this.scrollObj, query)) {
            let list = hisList.records
            if (list && list.length > 0) {
              this.hisList = this.$Helper.dealPageResult(hisList.pages, this.scrollObj, query, this.hisList, list)
              this.pageNumber ++
            }
          }
        },
        () => {
          this.errorStatus = 'error'
          setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 200)
        },
      )
    },
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero(str) {
      return ('00' + str).substr(str.length)
    },
    reloadOrders(list) {
      // let data = this.$Helper.getCache('Test')
      // if (!data) {
      //   data = []
      // }
      // data.push('id:' + list.id + ';orderId:' + list.orderId + ';status' + list.orderStatus + 'begin')
      // this.$Helper.setCache('Test', data)
      // if (this.concurrentFlag) {
      //   this.executeArr.push(list)
      //   return
      // }
      // this.concurrentFlag = true
      list.clientOrderTime = this.formatDate(new Date(list.clientOrderTime || list.createTime), 'yyyy-MM-dd hh:mm:ss')
      if (list.clientOrderTime.indexOf('NaN') !== -1) {
        list.clientOrderTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }
      if ([2, 3, 8].indexOf(list.orderStatus) === -1) {
        this.$Helper.emitAction('reloadAvalibleList', { symbol: list.symbol })
      }
      switch (list.orderStatus) {
        case 2:   // add a new order
          // data.push('id:' + list.id + ';' + list.orderStatus + ';orderId' + list.orderId + ';2begin')
          // this.$Helper.setCache('Test', data)
          // this.nowList.forEach((item) => {
          //   data.push('item2')
          //   data.push(item)
          // })
          // this.$Helper.setCache('Test', data)
          if (this.nowList.filter(item => item.orderId === list.orderId).length === 0) {
            // data.push('id:' + list.id + ';' + list.orderStatus + ';2unshift')
            // this.$Helper.setCache('Test', data)
            this.nowList.unshift(list)
          }
          break
        case 4:     // update the exsist order
          // test if order is complete
          // data.push('id:' + list.id + ';' + list.orderStatus + ';4begin')
          // this.$Helper.setCache('Test', data)
          let isComplete = this.repeatOrdersStatus.filter(item => item.orderId === list.orderId && item.orderStatus > list.orderStatus).length > 0
          if (isComplete) return
          // data.push('id:' + list.id + ';' + list.orderStatus + ';4 isComplete')
          // this.$Helper.setCache('Test', data)
          let flag = true
          for (let i in this.nowList) {
            let item = this.nowList[i]
            if (item.orderId === list.orderId) {
              // data.push('list4 equal' + item.matchVolume + 'list match' + list.matchVolume)
              // this.$Helper.setCache('Test', data)
              flag = false
              // 匹配数量大于原先的数量才替换
              if ((!item.matchVolume) || Number.parseFloat(list.matchVolume) > Number.parseFloat(item.matchVolume)) {
                // data.push('list4 replace' + item.matchVolume + 'list match' + list.matchVolume)
                // this.$Helper.setCache('Test', data)
                item.matchVolume = list.matchVolume
                Vue.set(this.nowList[i], 'matchVolume', list.matchVolume)
              }
            }
          }
          if (flag) {
            // data.push('id:' + list.id + ';' + list.orderStatus + ';4unshift')
            // this.$Helper.setCache('Test', data)
            // this.nowList.forEach((item) => {
            //   data.push('item4')
            //   data.push(item)
            // })
            // this.$Helper.setCache('Test', data)
            this.nowList.unshift(list)
          }
          break
        case 5:case 6:case 7:
          // test if status 4
          // data.push('id:' + list.id + ';' + list.orderStatus + ';6begin')
          // this.$Helper.setCache('Test', data)
          if (this.repeatOrdersStatus.filter(item => item.orderId === list.orderId).length > 0) return
          // add to the status arr
          this.repeatOrdersStatus.push(list)
          // data.push('id:' + list.id + ';' + list.orderStatus + ';6 no return')
          // this.$Helper.setCache('Test', data)
          for (let i in this.nowList) {
            let item = this.nowList[i]
            if (item.orderId === list.orderId) {
              this.nowList.splice(i, 1)
              list.clientOrderTime = item.clientOrderTime
              list.orderPrice = item.orderPrice
              list.direction = item.direction
              this.hisList.unshift(list)
              break
            }
          }
          break
        case 1001:
          for (let i in this.nowList) {
            let item = this.nowList[i]
            if (item.orderId === list.orderId) {
              this.nowList.splice(i, 1)
              break
            }
          }
          break
        default:
          break
      }
      // data.push('id:' + list.id + 'done')
      // this.$Helper.setCache('Test', data)
      // this.concurrentFlag = false
      // if (this.executeArr.length > 0) {
      //   let list = this.executeArr.shift()
      //   this.reloadOrders(list)
      // }
    },
  },
  created() {
    this.$Helper.onAction('reloadOrderList', () => {
      this.initOrderList()
    })
    setTimeout(() => this.$Helper.emitAction('loading', { show: true }), 200)
    this.$Helper.onAction('reloadOrders', ({ list }) => {
      this.reloadOrders(list)
    })
  },
  mounted() {
    if (this.uid) this.initScroll()
  },
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .order-container {
    background: white;
    .right-text{
      font-size: 3.6vw;
    }
  }
</style>
