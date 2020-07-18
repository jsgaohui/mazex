<template lang="html">
  <div class="overflow-y" id="fundScrollList">
  <div class="fund-main" >

    <div class="list" v-for="(item, index) in list" @click="toDetail(item)">
      <div class="flex-x-space fund-title"><h2>{{item.strategyType===1?$t('fund.steady'):$t('fund.aggressive')}}-{{item.fundName}}</h2>
        <span v-if="item.status==1" class="color04">{{$t('fund.wait')}}</span>
        <span  v-else-if="item.status==2" >{{$t('fund.collect')}}</span>
        <span  v-else-if="item.status==3" >{{$t('fund.collectdone')}}</span>
        <span  v-else-if="item.status==4"  class="color04">{{$t('fund.run')}}</span>
        <span  v-else-if="item.status==5" class="color04">{{$t('fund.clearing')}}</span>
        <span  v-else-if="item.status==6"  class="color04">{{$t('fund.cleared')}}</span>
      </div>
      <div class="flex-x-space" style="margin-top:1vw;" v-if="item.status==6">
        {{$t('fund.actual_profit')}}&nbsp;({{item.lockDate}}&nbsp;{{$t('fund.day')}})<p><span class="error-color" style="font-size:5vw;"><b>{{Number.parseFloat((item.currOneWorth - 1)*100).toFixed(2)}}%</b></span></p>

      </div>
      <div class="flex-x-space" style="margin-top:1vw;">
        {{$t('fund.expectProfit')}}<p><span style="color:#64acf5;font-size:4vw;">{{Number.parseFloat(item.expectProfit*100).toFixed(2)}}%</span></p>

      </div>

      <div class="flex-x-space" style="margin-top:1vw;"><p><span style="font-size:4vw">{{item.minBuyNum}}&nbsp;{{item.dcCode}}</span>&nbsp;{{$t('fund.qi')}}</p><p></p></div>
      <div class="flex-x-space bar-box">

        <div class="line"><div class="line-on" :style="{'width':itemRate(item) }"></div></div>
        <div class="txt">{{(item.status > 2 && item.rate < 100 ? 100 : item.rate) }}%</div>
      </div>
    </div>

  </div>


  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import MeScroll from 'mescroll.js'
  export default {
    computed: {
      ...mapState('basic', ['token']),
      ...mapState('basic', ['uid']),
    },
    name: 'fundindex',
    data() {
      return {

        listLoading: true,
        scrollObj: null,
        dcForm: {
          orderVolume: '',
          payPassword: '',
          fundId: '',
        },
        total: 0,
        list: [],
        listQuery: {
          page: 1,
          limit: 10,
        },
      }
    },
    created() {
      //  this.getFundList()
    },
    mounted() {
      this.initScroll()
    },
    methods: {
      itemRate(item) {
        return (item.status > 2 && item.rate < 100 ? 100 : (item.rate > 100 ? 100 : item.rate)) + '%'
      },
      toDetail(item) {
        // 跳转详情页面
        if (!this.uid) {
          this.$Helper.jumpPage({ name: 'Login' }, this)
          return
        }
        let query = {id: item.fundId}
        this.$Helper.jumpPage({ name: 'FundDetail', params: query }, this)
      },
      initScroll() {
        if (this.scrollObj) return
        this.scrollObj = new MeScroll('fundScrollList', {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initList, // 上拉回调
            htmlNodata: `<div class="box box-item empty-status">${this.$t('basic.not_more')}</div>`,
            htmlLoading: `<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">${this.$t('home.loading')}..</p>`,
          },
        })
      },
      initList() {
        let $this = this
        this.$Helper.ajax({
          url: '/app/fund/fundlist.api',
          method: 'POST',
          params: this.listQuery,
        }).then(
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
            if (recordList && recordList.length > 0) {
              // $this.list = response.data.result.records
              $this.list = $this.list.concat(recordList)
              $this.listQuery.page++
            }
            if ($this.scrollObj) {
              $this.scrollObj.endSuccess($this.listQuery.limit, hasNext)
            }
          },
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');
  .fund-main{
    padding-bottom:13.5vw;
    padding-top:3vw;
    background: #fff;
  }
  .fund-main .list{
    padding:10px 15px;
    border: 1px solid #eee;
    margin : 3vw;
    margin-top:0px;
    line-height:24px;
    cursor: pointer;
    background:#fff;
    border-radius: 1vw;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.3);
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
  .fund-main .list .flex-x-start p{
    width:50%;
    color:#999;
  }
  .fund-title{
    margin-bottom:15px;
  }
  .fund-title h2{
    font-size:4vw;
    color:#646da9
  }
  .bar-box{
    padding-top:10px;
    margin-top:0px;
  }
  .bar-box .line{
    background:#e7ebee;
    height:1.5vw;
    width:85%;
    position:relative;
    z-index: 1;
  }
  .bar-box .line .line-on{
    height:1.5vw;
    background:#646da9;
    position:absolute;
    top:0px;
    left:0px;
    z-index: 2;
  }
  .bar-box .txt{
    text-align: right;
    margin-left:5px;
    width:15%;
  }
  span.error-color,span.num{
    font-size:4vw;
    color:#f55858
  }
  span.num{
    font-size:4vw;
    color:#646da9
  }
  .color01{
    color:#00a824
  }
  .color02{
    color:#ff83ef
  }
  .color03{
    color:#ff3600
  }
  .color04{
    color:#ccc
  }
  .gray-bg{
    background:#ccc;
    height:2vw;
  }
</style>

