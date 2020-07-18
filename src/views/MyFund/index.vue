<template lang="html">
  <div class="container overflow-y mescroll" ref="routerView">
    <div class="card">
      <!--<h2>{{ $t('myfund.my_account') }}</h2>-->
      <p>{{ $t('myfund.my_fund') }} {{ sellteMarket }}</p>
      <h2 class="num">{{ $Helper.numFixedLength(sumGold) }}</h2>
      <p>≈{{ $Helper.formatAmount(sumMoney) }} {{ currencyRate }}</p>
    </div>
    <div class="cb-form box box-item">
      <div class="search box-col-flex">
        <i class="iconfont">&#xe606;</i>
        <input type="text" :placeholder="$t('myfund.search_fund')" v-model="searchText">
      </div>
      <i-radio v-model="hiddenZero" color="#646da9">
        <span>
          {{ $t('myfund.hide_zero_fund') }}
        </span>
      </i-radio>
    </div>
    <div class="half-x-line" style="background: #ddd;"/>
    <div class="table">
      <div class="row head box box-y-center">
        <div class="name box box-y-center">
          {{ $t('transaction.symbol_name') }}
        </div>
        <div class="info box-col-flex">
          {{ $t('myfund.avilable_fund') }}
        </div>
        <div class="info box-col-flex">
          {{ $t('myfund.freeze_fund') }}
        </div>
        <div class="half-x-line" />
      </div>
      <div class="row box box-y-center" v-for="(item, key) of showList" :key="key" @click="showHt(item)">
        <div class="name box box-y-center">
          {{ item.dcCode }}
        </div>
        <div class="info box-col-flex">
          <div class="num">
            {{ $Helper.numFixedLength(item.availableAmount, 5, 15) }}
          </div>
          <div class="status">
            ≈ {{ $Helper.formatAmount(caculatePrice(item.dcCode) * caculateRateNum({symbol: item.dcCode + '/' + sellteMarket, lastPrice:item.availableAmount })) }} {{ currencyRate }}
          </div>
        </div>
        <div class="info box-col-flex">
          <div class="num">
            {{$Helper.numFixedLength(item.freezeAmount, 5, 15)}}
          </div>
          <div class="status">
            ≈ {{ $Helper.formatAmount(caculatePrice(item.dcCode) * caculateRateNum({symbol: item.dcCode + '/' + sellteMarket, lastPrice:item.freezeAmount })) }} {{ currencyRate }}
          </div>
        </div>
        <div class="half-x-line" />
      </div>
      <error-status :status="errorStatus" />
    </div>
  </div>
</template>
<script>
import ErrorStatus from '@/components/ErrorStatus'
import components from '@/components'
import basicMixin from '@/mixin/basic'
import caculateMixin from '@/mixin/caculate'
import {removeListenRuner} from '@/lib/quotation'
export default {
  name: 'MyFund',
  components: {
    ...components,
    ErrorStatus,
  },
  mixins: [basicMixin, caculateMixin],
  data() {
    return {
      hiddenZero: false,
      searchText: '',
      errorStatus: null,
    }
  },
  computed: {
    showList() {
      let showList = this.availableList
      if (this.hiddenZero) showList = showList.filter(item => !!item.totolAmount)
      if (this.searchText) {
        showList = showList.filter(item => {
          let searchText = this.searchText.toUpperCase()
          return item.dcCode.indexOf(searchText) !== -1
        })
      }
      return showList
    },
  },
  watch: {
    showList() {
      if (this.showList && this.showList.length > 0) this.errorStatus = null
      if (this.showList && this.showList.length === 0) this.errorStatus = 'empty'
      if (!this.showList) this.errorStatus = 'error'
    },
  },
  methods: {
    caculateIcon(code) {
      let conf = {
        OMG: '&#xe62a;',
        USDT: '&#xe629;',
        ETH: '&#xe628;',
        TRX: '&#xe62c;',
        BTC: '&#xe674;',
        XRP: '&#xe637;',
        ETC: '&#xe725;',
        LTC: '&#xe650;',
        BCH: '&#xe723;',
        BSV: '&#xe690;',
        WESTO: '&#xe6ba;',
        TRAT: '&#xe6df;',
      }
      return conf[code]
    },
    showHt(data) {
      let query = { id: data.id, dcCode: data.dcCode, freezeAmount: data.freezeAmount, availableAmount: data.availableAmount, totolAmount: data.totolAmount, canRecharge: data.canRecharge, canWithdraw: data.canWithdraw, enable: data.enable }
      this.$Helper.jumpPage({ name: 'Ht', query }, this)
    },
    initSymbolCapital() {
      return this.$Helper
      .ajax({
        url: '/app/account/symbolCapital.api',
      })
      .then(
        ({data}) => {
          // update the store
          this.$store.dispatch('quotation/refreshData', { ...data, availableList: data.accountList })
        },
        () => {
          this.errorStatus = 'error'
        },
      )
    },
  },
  activated() {
    removeListenRuner('reloadOrders')
    removeListenRuner('fbOrders')
    removeListenRuner('reloadSymbolKline')
    removeListenRuner('reloadGearQuotation')
    removeListenRuner('reloadQuotation')
  },
  created() {
    this.initSymbolCapital()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    padding: 3vw 4vw;
    background: white;
    .card {
      color:#555;
      // background:#8dbaf9;
      box-shadow: 1px 1px 7px #ddd;
      border-radius: 4px;
      padding: 4vw;
      h2{
        font-weight: 600;
        font-size: 5vw;
      }
      p{
        font-weight: 400;
        font-size: 3.6vw;
        margin-bottom: 3vw;
        margin-top: 1vw;
      }
    }
    .cb-form{
      margin-top: 4vw;
      padding-bottom: 2vw;
      position:relative;
      .search input{
        line-height:24px;
        border:none;
      }

      .search .icon-search{
          font-size:16px;
          color:#ccc;
          margin-right:6px;

      }
    }
    .table {
      .row {
        padding: 4vw 0;
        position: relative;
        &.head{
          padding: 2.5vw 0;
          .name{
            font-size: 3.6vw;
            font-weight: 400;
          }
          .info{
            font-size: 3.6vw;
            font-weight: 400;
          }
        }
        .name {
          width: 20%;
          font-size: 4.4vw;
          font-weight: 600;
          color: #333;
          i{
            font-size: 5vw;
          }
        }
        .info {
          padding-left: 5vw;
          .num {
            font-size: 4.6vw;
            font-weight: 500;
            padding-bottom: 1vw;
          }
          .status {
            font-size: 3.4vw;
            color: #aaa;
          }
        }
        .half-x-line {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
        }
      }
    }
  }
</style>
