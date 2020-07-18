<template lang="pug">
  .container.box.box-row
    .head.box-row-flex.mescroll(id="scroll_list")
      .box
        .col.box-col-flex
          .title {{ $t('transaction.can_use') }}
          .num {{ $Helper.numFixedLength(query.availableAmount) }}
        .col.box-col-flex(style="padding-left: 3vw;")
          .title {{ $t('myfund.freeze_fund') }}
          .num {{ $Helper.numFixedLength(query.freezeAmount) }}
      .half-x-line
      i-label(:title="$t('myfund.fund_record')" style="padding:0;")
        .switch.box.box-x-right.box-y-center.box-col-flex(@click="showBottomSelect")
          span {{ !bottomSelect ? $t('basic.recharge') : $t('basic.extract') }}
          i.iconfont &#xe61f;
      Itable(:list="recordList" :showList="tableShowList" :baseFontSize="3.8" :baseRowHeight="14" style="margin-top: 2vw;" @tap="toDetail($event)" )
    .bottom.box.box-y-center.box-x-center
      .btn.box.box-item(@click="rechargeFn") {{ $t('basic.recharge') }}
      .btn.box.box-item.error(@click="extractFn") {{ $t('basic.extract') }}
      .chose.box-col-flex(v-show="isShow" @click="goTransaction")
        .box.box-item.i-con
          i.iconfont &#xe615;
        .box.box-item {{ $t('subbar.transaction') }}
</template>
<script>
import components from '@/components'
import _ from 'lodash'
import { mapState } from 'vuex'
import MeScroll from 'mescroll.js'
export default {
  name: 'Ht',
  components,
  data() {
    return {
      bottomSelect: 0,
      page: 1,
      query: {},
      recordList: [],
      scrollObj: null,
      isShow: true,
      count: 0,
      tradeMarket: null,
    }
  },
  computed: {
    ...mapState('quotation', ['sellteMarket', 'symbolMap']),
    ...mapState('commonParam', ['paramAvailable']),
    showList() {
      return [
        {
          createTime: {
            text: this.$t('myfund.submit_time'),
            align: 'left',
            width: 60,
          },
          rechargeAmount: {
            text: this.$t('basic.num'),
            align: 'center',
          },
          enable: {
            text: this.$t('basic.status'),
            align: 'right',
            caculate: (res) => {
              if (res === 1) return this.$t('basic.complete')
              else return this.$t('basic.not_complete')
            },
          },
        },
        {
          createTime: {
            text: this.$t('myfund.submit_time'),
            align: 'left',
            width: 60,
          },
          tradeAmount: {
            text: this.$t('basic.num'),
            align: 'center',
          },
          enable: {
            text: this.$t('basic.status'),
            align: 'right',
            caculate: (res) => {
              if (res === 5) return this.$t('basic.complete')
              else return this.$t('basic.not_complete')
            },
          },
        },
      ]
    },
    tableShowList() {
      return this.showList[this.bottomSelect]
    },
  },
  watch: {
    bottomSelect() {
      this.recordList = []
      this.page = 1
      this.initRecordList()
    },
  },
  methods: {
    toDetail(item) {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'RechargeWithdraw',
          type: 'right',
          params: {item: item, type: this.bottomSelect}, // 0充值  1提现
        }
      )
    },
    jumpPage(name) {
      this.$Helper.jumpPage(name, this)
    },
    goTransaction() {
      let params = {}
      if (this.query.dcCode === 'GOLDT') {
        this.$Helper.setCache('Transaction', {})
      } else {
        params = {symbol: {symbolName: this.query.dcCode, marketName: this.tradeMarket || this.sellteMarket}}
      }
      this.$Helper.jumpPage({name: 'Transaction', params}, this)
    },
    rechargeFn() {
      if (this.query.canRecharge !== '0') {
        this.$Helper.emitAction('toast', {
          type: 'bottom',
          text: this.query.dcCode + this.$t('myfund.pause_recharge'),
        })
        return
      }
      this.$Helper.jumpPage({name: 'HtRecharge', query: this.query}, this)
    },
    showBottomSelect() {
      this.$store.dispatch('layermodel/push', { name: 'BottomSelect', type: 'up', params: { active: this.bottomSelect, list: [{text: this.$t('basic.recharge'), key: 0, hander: () => { this.bottomSelect = 0 }}, {text: this.$t('basic.extract'), key: 1, hander: () => { this.bottomSelect = 1 }}] } })
    },
    initRecordList() {
      this.$Helper.ajax({
        url: (!this.bottomSelect ? `/app/account/appQueryRecords.api` : `/app/account/appWithdrawRecords.api`) + `?symbol=${this.query.dcCode}`,
        params: {
          page: this.page,
          limit: 100,
        },
      })
      .then(
        data => {
          let list = _.get(data, 'data.pageResult.records')
          if (list && list.length > 0) {
            this.recordList = this.recordList.concat(list)
            this.page++
          }
          this.scrollObj.endSuccess(list.length, list && list.length > 0)
        },
      )
    },
    initScroll() {
      this.scrollObj = new MeScroll(`scroll_list`, {
        down: {
          use: false,
          auto: false,
        },
        up: {
          callback: this.initRecordList,
          isBounce: false,
          // clearEmptyId: `scroll_list`,
          htmlNodata: `<div class="box box-item empty-status">${this.$t('basic.not_more')}</div>`,
        },
      })
    },
    extractFn() {
      if (this.query.canWithdraw !== '0') {
        this.$Helper.emitAction('toast', {
          type: 'bottom',
          text: this.query.dcCode + this.$t('myfund.pause_withdraw'),
        })
        return
      }
      this.$Helper.jumpPage({name: 'Extract', query: this.query}, this)
    },
  },
  created() {
    let $this = this
    this.query = this.$Helper.getUrlParams()
    if (this.paramAvailable) { // 若store里有值,表示是提币后跳转回来的
      this.query.availableAmount = this.paramAvailable
    }
    this.$store.dispatch('commonParam/setCommonParam', { paramAvailable: '' }) // 获取到值后,清空store里的值
    this.$Helper.emitAction('setCustomTitle', this.query.dcCode)
    // 若选择的当前币为禁用状态则隐藏交易按钮
    if (this.query.enable !== '1') {
      this.isShow = false
      return
    }
    // 若选择的当前币为基准市场币则隐藏交易按钮
    if (this.query.dcCode === this.sellteMarket) {
      this.isShow = false
      return
    }
    // this.initRecordList()
    // 判断当前交易对是否有包含此代币,若无则隐藏交易按钮(不能进行交易)
    if (this.symbolMap) {
      let symbolMap = this.symbolMap
      _.map(symbolMap, (item, key) => {
        for (var i = 0; i < item.length; i++) {
          if ($this.count === 0 && $this.query.dcCode === item[i].targetDcCode) {
            $this.count++
            $this.tradeMarket = key
            break
          }
        }
      })
    }
    if (this.count === 0) {
      this.isShow = false
      return false
    }
  },
  mounted() {
    this.initScroll()
  },
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  @import url('../../theme/mescroll.min.css');
  .container {
    background: white;
    .head{
      padding: 4vw;
      .col{
        padding-bottom: 4vw;
        .title{
          font-size: 3.8vw;
          color: #aaa;
        }
        .num{
          font-size: 6vw;
          color: #333;
          font-weight: 500;
          padding-top: 3vw;
        }
      }
      // .label{
      //   font-size: 3.8vw;
      //   i{
      //     font-size: 4.3vw;
      //     margin-right: 1vw;
      //   }
      // }
      .switch{
        font-size: 4vw;
        color: @icon-color;
        i{
          font-size: 2.7vw;
          color: #aaa;
          margin-left: 1vw;
        }
      }
    }
    .bottom{
      height: 14vw;
      background: white;
      box-shadow: 1px 0px 7px #ddd;
      z-index: 1;
      padding: 0 3vw;
      .btn{
        background: @icon-color;
        height: 80%;
        width: 31vw;
        font-size: 4.2vw;
        font-weight: 500;
        color: #fff;
        margin-right: 3vw;
        &.error{
          background: @icon-color;
        }
      }
      .chose{
        font-size: 3.4vw;
        color: @icon-color;
        .i-con{
          i{
            color: @icon-color;
            font-size: 5vw;
          }
        }
      }
    }
  }
</style>
