<template lang="html">
  <div class="overflow-y" id="falScrollList" ref="routerView">

     <div class="fund-detail " >
       <div class="list mescroll"  v-for="(item, index) in list">
         <div class="flex-x-space fund-title"><h2>{{item.remark}}</h2></div>
         <div class="flex-x-space">
           <p><span class="error-color">{{item.changeAmount}}</span>&nbsp;{{item.dcCode}}<br>
             <span class="info">
           <span v-if="item.changeType==1">{{$t('fund.out')}}</span>
                    <span  v-else-if="item.changeType==2">{{$t('fund.in')}}</span>
                    <span  v-else-if="item.changeType==3">{{$t('fund.out')}}</span>
                    <span  v-else-if="item.changeType==4">{{$t('fund.in')}}</span>
                    <span  v-else-if="item.changeType==5">{{$t('fund.turn_out')}}</span>
                    <span  v-else-if="item.changeType==6">{{$t('fund.turn_in')}}</span>
           </span></p>
           <p><span class="time">{{item.updateTime}}</span><br><span class="info">
                   <span v-if="item.changeType==1">{{$t('fund.freeze')}}</span>
                    <span  v-else-if="item.changeType==2">{{$t('fund.unfreeze')}}</span>
                    <span  v-else-if="item.changeType==3">{{$t('fund.chrge')}}</span>
                    <span  v-else-if="item.changeType==4">{{$t('fund.income')}} </span>
                    <span  v-else-if="item.changeType==5">{{$t('fund.turn_out_remark')}}</span>
                    <span  v-else-if="item.changeType==6">{{$t('fund.turn_in_remark')}}</span></span></p></div>

       </div>
       <error-status :status="errorStatus" />
     </div>

  </div>
</template>
<script>
  import MeScroll from '@/lib/mescroll'
  import _ from 'lodash'
  import components from '@/components'
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
      ...components,
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
        this.scrollObj = new MeScroll('falScrollList', {
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
        // let $this = this
        this.$Helper.ajax({
          url: '/app/fundaccount/userfundLoglist.api',
          method: 'POST',
          params: this.listQuery,
        }).then(
          data => {
            let listt = _.get(data, 'rows') || []
            if (listt.length > 0) {
              this.list = this.list.concat(listt)
              this.listQuery.page++
            }
            this.scrollObj.endBySize(listt.length, data.total)
            //  this.scrollObj.endSuccess(list.length, list.length > 0)
          },
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');
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
    color:#646da9
  }
  .fund-detail .list span.error-color{
    font-size:5vw
  }
  .router-view{
    background:#fff;
  }
</style>
