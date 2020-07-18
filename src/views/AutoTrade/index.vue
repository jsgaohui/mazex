<template lang="html">
  <div >
    <div class="container box box-row router-view " img-set="static/favicon.ico">
      <div class="head box" style="padding:0px 5vw;">
        <div class="left box box-item"></div>
        <div class="name box box-item box-col-flex">
          {{$t('at.atList')}}
        </div>
        <div class="right box box-item" style="position:relative"  @click="showOption()">
          <i class="iconfont" style="font-size:5vw;">&#xe675;</i>
        </div>
      </div>
      <div class="half-x-line"></div>
      <!--跟单策略-->
      <div class="tactics-main overflow-y" id="atScrollList">
        <div class="list" v-for="(item, index) in list" @click="toDetail(item)">
          <div class="hd box box-space-bettwen">
            <span>{{item.stragetyName}}</span><h3>{{$t('at.direction')}}: <span :class="{'color-sell':item.direction === 0,'color-buy':item.direction === 1}">{{item.direction === 0 ? $t('at.open'):$t('at.close')}}</span></h3>
          </div>
          <div class="half-x-line"></div>
          <div class="bd box box-space-bettwen">
            <div class="left box box-row box-col-8">
              <div class="box box-space-bettwen"><label>{{$t('at.stragetyType')}}</label>  <span>{{item.stragetyTypeName}}</span></div>
              <div class="box box-space-bettwen"><label>{{$t('at.symbol')}}</label>  <span>{{item.dcCode}}/{{item.marketCode}}</span></div>
              <div class="box box-space-bettwen"><label>{{$t('at.weekRate')}}</label>  <span class="color-buy">{{Number.parseFloat(item.weekRate*100).toFixed(2)}}%</span></div>
            </div>
            <div class="right box-col-3">
              <div class="k-line" @click.stop="showProfit(item.id)">

                <i class="iconfont" style="font-size:12vw;">&#xe659;</i>
              </div>
            </div>
          </div>
          <div class="gray-line"></div>
        </div>

      </div>
      <!--跟单策略 END-->
    </div>

    <div class="tip-bg" v-show="showDiv" @click="showDiv=false"></div>
    <div class="tip-box" style="display:block" v-show="showDiv">
      <div class="tip-top">
        <div>{{$t('at.followSuccess')}}</div>
        <div class="tip-close"><i class="iconfont"></i></div>
      </div>
      <div class="tip-con" style="padding:0">
        <div class="content">
          <p style="text-align:center;padding:5vw 0;font-size:4vw;line-height:6vw">{{$t('at.followSuccess')}},<br>
            {{$t('at.tip6')}}
          </p>
        </div>
        <div class="tip-bottom-btn box box-space-bettwen">
          <div class="btn btn-gray box-col-6" @click="toOrder">{{$t('at.queryDetail')}}</div>
          <div class="btn box-col-6" @click="showDiv=false" style="margin-left:4vw;">{{$t('at.toOrder')}}</div>
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
    name: 'AutoTrade',
    data() {
      return {
        showDiv: false,
        listLoading: true,
        scrollObj: null,
        // 筛选条件
        optionParam: {
          dcCode: '', // 币种
          direction: '', // 方向
          directionName: '', // 方向描述
          stragetyId: '', // 策略类型名称
          stragetyTypeName: '',
          dcCodeList: [], // 币种list
          stragetyTypeList: [], // 策略类型
        },
        total: 0,
        list: [],
        listQuery: {
          dcCode: '',
          direction: '',
          stragetyId: '', // 策略类型名称
          page: 1,
          limit: 10,
        },
      }
    },
    created() {
      if (this.$route.params && this.$route.params.buyFlag) {
        this.showDiv = this.$route.params.buyFlag
      }
    },
    mounted() {
      this.initScroll()
    },
    methods: {
      toOrder() {
        this.$Helper.jumpPage({ name: 'AutoTradeOrder' }, this)
      },
      toDetail(item) {
        // 跳转详情页面
        if (!this.uid) {
          this.$Helper.jumpPage({ name: 'Login' }, this)
          return
        }
        let query = {id: item.id}
        this.$Helper.jumpPage({ name: 'AutoTradeDetail', params: query }, this)
      },
      showProfit(id) {
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'AutoTradeChart',
            type: 'right',
            params: {
              batchId: id,
              callback: item => {
              },
            },
          },
        )
      },
      // 展开筛选条件
      showOption() {
        let $this = this
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'AutoTradeProOption',
            type: 'right',
            params: {
              initParam: $this.optionParam,
              callback: item => {
                $this.$Helper.copyProperties(item, this.listQuery)
                $this.$Helper.copyProperties(item, this.optionParam)
                this.listQuery.page = 1
                this.list = []
                $this.initList()
              },
            },
          },
        )
      },
      initScroll() {
        if (this.scrollObj) return
        this.scrollObj = new MeScroll('atScrollList', {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initList, // 上拉回调
            warpClass: '',
            htmlNodata: `<div class="box box-item empty-status" style="display:none;"></div>`,
            htmlLoading: `<p class="upwarp-progress mescroll-rotate" style="display:none;"></p><p class="upwarp-tip"></p>`,
          },
        })
      },
      initList() {
        let $this = this
        this.$Helper.ajax({
          url: '/app/autotrade/proList.api',
          method: 'POST',
          params: this.listQuery,
        }).then(
          data => {
            // 处理异常httpcode 以及 207重复操作
            if (this.$Helper.dealHttpCode(data.code, data.msg, $this.scrollObj, $this.listQuery)) {
              let list = data.data.autoTradeProductPage.records
              if (list && list.length > 0) {
                $this.list = $this.$Helper.dealPageResult(data.data.autoTradeProductPage.pages, $this.scrollObj, $this.listQuery, $this.list, list)
              }
              this.optionParam.dcCodeList = data.data.symbolList
              this.optionParam.stragetyTypeList = data.data.autoTradeStragetyList
            }
          },
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container .head{
    height:12vw!important;
    min-height: 12vw;
  }
  .tip-top{
    background:#ecf0f7;
    height:12vw;
    line-height:12vw;
    font-size:4.5vw;
    color:#1f405a;
  }
  .tip-con .box-space-bettwen{
    padding: 4vw;
    font-size: 4vw;
    color: #8398a6
  }
</style>

