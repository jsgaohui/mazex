<template lang="html">
    <div class="fund-detail " style="height:100%;width:100%;"  >
      <div data-v-2b663b10="" class="top-container box">
        <div data-v-2b663b10="" class="left box box-item"><i data-v-2b663b10="" class="iconfont" @click="$Helper.emitAction('closeModel')"></i></div>
        <div data-v-2b663b10="" class="center box-col-flex box box-item">
        {{$t('otc.fbLog')}}
      </div> <div data-v-2b663b10="" class="right box box-item"></div></div>
      <div class="overflow-y "  style="height:166vw;width:100%;"  id="otcLogScrollList" v-if="list && list.length > 0">
        <div class="list mescroll"  v-for="(item, index) in list">
          <!--<div class="flex-x-space fund-title"><h2>{{item.remark}}</h2></div>-->
          <div class="flex-x-space">
            <p><span class="error-color">{{item.changeAmount}}</span>&nbsp;{{item.dcCode}}<br>
              <span class="info">
           <span v-if="item.changeType==1">{{$t('otc.frenchCurrencyTradingBuy')}}</span>
                    <span  v-else-if="item.changeType==2">{{$t('otc.legalCurrencyTrading')}}</span>
                    <span  v-else-if="item.changeType==3">{{$t('otc.transactionFees')}}</span>
                    <span  v-else-if="item.changeType==4">{{$t('otc.legalCurrencyTransferCoin')}}</span>
                    <span  v-else-if="item.changeType==5">{{$t('otc.coinToCurrency')}}</span>
           </span></p>
            <p><span class="time">{{item.createTime}}</span><br><span class="info">
                 {{$t('otc.time')}}
          </span></p></div>
        </div>
      </div>
      <error-status :status="errorStatus" />
    </div>
</template>
<script>
  import MeScroll from '@/lib/mescroll'
  import ErrorStatus from '@/components/ErrorStatus'
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState('basic', ['uid']),
      errorStatus() {
        let list = this.list
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
    components: {
      ErrorStatus,
    },
    name: 'OtcAssertLog',
    data() {
      return {
        scrollObj: null,
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
        },
      }
    },
    created() {
      // this.initScroll()
    },
    mounted() {
      this.initScroll()
    },
    methods: {
      initScroll() {
        let $this = this
        if (this.scrollObj) return
        this.scrollObj = new MeScroll('otcLogScrollList', {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initList, // 上拉回调
            htmlNodata: `<div class="box box-item empty-status"></div>`,
            showNoMore: function(mescroll, upwarp) {
              // 如果只有一页数据  就不提示无数据了
              if ($this.listQuery.page > 2) {
                $this.$Helper.emitAction('toast', {
                  text: $this.$t('basic.not_more'),
                })
              }
              upwarp.innerHTML = mescroll.optUp.htmlNodata
            },
          },
        })
      },
      initList() {
        let $this = this
        this.$Helper.ajax({
          url: '/app/otc/getMyAssetLog.api',
          method: 'POST',
          params: this.listQuery,
        }).then(
          data => {
            // 处理异常httpcode 以及 207重复操作
            if (this.$Helper.dealHttpCode(data.code, data.msg, $this.scrollObj, $this.listQuery)) {
              let list = data.rows
              $this.list = $this.$Helper.dealPageResult(data.pages, $this.scrollObj, $this.listQuery, $this.list, list)
              // if (list && list.length > 0) {
              //   $this.list = $this.$Helper.dealPageResult(data.pages, $this.scrollObj, $this.listQuery, $this.list, list)
              // }
            }
          },
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .fund-detail{
    background:#fff;
  }
  .fund-detail .list{
    padding:10px 15px;

    line-height:24px;
    cursor: pointer;
    background:#fff;
    border-bottom: 2vw solid rgb(249, 249, 249);
  }
  .flex-x-space{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .flex-x-start{
    display:flex;
    justify-content: flex-start;
    align-items: center;
  }
  .fund-detail .list .flex-x-space span.info{
    color:#ccc
  }
  .fund-title{
    margin-bottom:15px;
    padding-bottom:10px;
    border-bottom:1px solid #f9f9f9;
  }
  .fund-title h2{
    font-size:4vw;
    color:#64acf5
  }
  .fund-detail .list span.error-color{
    font-size:5vw
  }
  .router-view{
    background:#fff;
  }
</style>
