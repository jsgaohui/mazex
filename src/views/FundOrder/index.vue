<template lang="html">
  <div class="overflow-y" id="foScrollList" ref="routerView">
    <div class="fund-detail ">

      <div class="list"  v-for="(item, index) in list" v-if="list">
        <div class="flex-x-space fund-title"><h2>{{item.fundName}}</h2><span>
           <span v-if="item.status==1">{{$t('fund.subscribe')}}</span>
                  <span  v-else-if="item.status==2">{{$t('fund.running')}}</span>
                  <span  v-else-if="item.status==3">{{$t('fund.settleing')}}</span>
                  <span  v-else-if="item.status==4">{{$t('fund.settled')}}</span>
        </span></div>
        <div class="flex-x-space" style="margin-top:1vw;"  v-if="item.status==4">
          <span class="info"><span>{{$t('fund.actual_profit')}}</span></span><p><b style="color:#f55858;font-size:5.5vw;">{{Number.parseFloat(item.yield*100).toFixed(2)}}%</b></p>
        </div>
        <div class="flex-x-space" style="margin-top:1vw;">
          <span class="info">
              <!--<span> {{item.oneDayProfilt?item.oneDayProfilt+' '+item.dcCode:"&#45;&#45;"}}</span>-->
            <span> {{$t('fund.buyVolume')}}</span>
          </span>
          <p><span class="error-color"> {{ Number.parseFloat(item.orderVolume).toFixed(8)}}</span>&nbsp;{{item.dcCode}}</p>

        </div>
        <div class="flex-x-space" style="margin-top:1vw;">
          <span class="info"><span>{{$t('fund.buyTime')}}</span></span><p><span class="time">{{item.orderTime}}</span></p>
        </div>

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
    name: 'FundAssertLog',
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
        if (this.scrollObj) return
        this.scrollObj = new MeScroll('foScrollList', {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initList, // 上拉回调
            htmlNodata: `<div class="box box-item empty-status">${this.$t('basic.not_more')}</div>`,
          },
        })
      },
      initList() {
        let $this = this
        this.$Helper.ajax({
          url: '/app/fundaccount/fundlist.api',
          method: 'POST',
          params: this.listQuery,
        }).then(
          // data => {
          //   let listt = _.get(data, 'rows') || []
          //   if (listt.length > 0) {
          //     this.list = this.list.concat(listt)
          //     this.listQuery.page++
          //   }
          //   this.scrollObj.endBySize(listt.length, data.total)
          //   //  this.scrollObj.endSuccess(list.length, list.length > 0)
          // },
           data => {
             let code = data.code
             let rows = data.rows
             let total = data.total
            // let size = data.size
             let page = data.pages
            // var currentPageDataLength = page === $this.listQuery.page ? total - (page - 1) * size : $this.listQuery.limit
             var hasNext = $this.listQuery.page < page
             if (code === 207) {
               this.scrollObj.endSuccess($this.listQuery.limit, true)
               return
             }
             var recordList = rows
             $this.total = total
             if (recordList.length > 0) {
               // $this.list = response.data.result.records
               $this.list = $this.list.concat(recordList)
               $this.listQuery.page++
             }
             if ($this.scrollObj) {
               $this.scrollObj.endSuccess($this.listQuery.limit, hasNext)
             }
           }
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');

  .fund-detail {
    background: #fff;
    padding-top:3vw;
  }

  .fund-detail .list {
    padding: 10px 15px;
    margin : 3vw;
    border: 1px solid #eee;
    line-height: 24px;
    cursor: pointer;
    background: #fff;
    border-radius: 1vw;
    box-shadow: 1px 3px 5px rgba(0,0,0,0.5);
  }

  .flex-x-space {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .flex-x-start {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .fund-detail .list .flex-x-space span.info {
    color: #ccc
  }

  .fund-title {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f9f9f9;
  }

  .fund-title h2 {
    font-size: 4vw;
    color: #646da9
  }

  .fund-detail .list span.error-color {
    font-size: 4vw
  }

  .tip-box{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
  }
  .tip-box .tip-con{
    display: inline-block;
    width: 96%;
    box-sizing: border-box;
    text-align: left;
    vertical-align: middle;
    background: #fff;
    padding:10px;
  }



  .tip-extra{
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  .tip-con .content{
    padding:0px;
    padding-bottom:20px;
  }
  .tip-con .content.info-box div{
    display:flex;
    justify-content: space-between;
    align-items: center;

    line-height:12vw;
    font-size:3.8vw;
    border-bottom: 1px solid #f5f5f5;
  }
  .tip-con .content.info-box div label{

  }
  .tip-con .content.info-box div p{
    color:#ccc;
  }
  .tip-con .btn{
    text-align: center;
    height: 11vw;
    line-height: 11vw;
    width:100%;
    margin: 0 auto;
    background: #646da9;
    color: #fff;
    font-size: 4.2vw;
    font-weight: 600;
    transition: all .4s;
  }
  span.link{
    color:#646da9
  }
  .router-view{
    background:#fff;
  }
  .fund-detail .list .flex-x-space{

  }
  .fund-detail .list .flex-x-space span.info{
    color:#666;
  }
</style>
