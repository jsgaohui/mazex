<template lang="html">
  <div class="order-container">
    <div class="container"   >
      <!--法币订单-->
      <div  class="market-container box box-row"  >
        <div class="content" >
          <NewScrollTopMenu :list="statusArr" :activeKey="activeKey" @change="changeTopMenu" :lessCenter="false" whichPage="AppealOrder"/>
          <div class="otc-list-con overflow-y router-view with-topbar" v-if="myAppealOrderList" id="AppealOrderScrollList" >
            <template>
              <div class="list" v-for="(item,index) in myAppealOrderList" @click.stop="goViewAppealDetail(item)">
                <div class="hd rel box box-space-bettwen">
                  <div class="box box-x-left" style="align-items: center">
                    <div class="order-rel">
                      <img src="/static/images/buy-bg.png">
                      <span v-if="isMyBuy(item.appealUserId,item.appealDirection)">{{$t('otc.buy')}}</span>
                      <span v-else>{{$t('otc.sell')}}</span>
                    </div>
                    <b style="color:#1f3b60;">{{$Helper.format(Number.parseFloat(item.orderPrice*item.orderVolume),2)}}&nbsp;{{item.currencySymbol}}</b></div>
                    <span v-show="item.appealFlag===1||item.appealFlag===2||item.appealFlag===3" class="appeal">{{$t('appeal.appeal')}}</span>
                  <div>
                    <span class="detail-btn" v-if="item.status===4">{{$t('appeal.toBeAppealThree')}}</span>
                    <span class="detail-btn" v-if="item.status===5">{{$t('appeal.toBeAppealFour')}}</span>
                    <span class="detail-btn" v-if="item.status===6">{{$t('appeal.toBeAppealFive')}}</span>
                  </div>
                </div>
                <div class="half-x-line"></div>
                <div class="bd">
                  <div class="box box-space-bettwen"><label>{{$t('otc.oddNumber')}}</label><span class="r-txt"> {{item.relateOrderId}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.unitPrice')}}</span><span class="r-txt"> {{Number.parseFloat(item.orderPrice)}}&nbsp;{{item.currencySymbol}} </span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.quantity')}}</span><span class="r-txt"> {{Number.parseFloat(item.orderVolume)}}&nbsp;{{item.dcCode}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.time')}}</span><span class="r-txt"> {{item.createTime}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.orderStatus')}}</span><span class="r-txt">{{taterStatus[item.orderStatus]}}</span></div>
                  <div class="box box-x-right"><span><i class="iconfont">&#xe612;</i></span></div>
                </div>
              </div>
            </template>
            <error-status :status="errorStatus" />
          </div>
        </div>
        <!---->
      </div>
    </div>
    <!--法币交易END-->
  </div>
</template>
<script>
  import NewScrollTopMenu from '@/components/NewScrollTopMenu'
  import ErrorStatus from '@/components/ErrorStatus'
  import {mapState} from 'vuex'
  import MeScroll from 'mescroll.js'
  // import _ from 'lodash'
  export default {
    name: 'AppealOrder',
    components: {
      ErrorStatus,
      NewScrollTopMenu,
    },
    data() {
      return {
          // 委托单状态 1.申请;2.已取消;3.买方付款确认;4.卖方收款确认;5.已成交;6.申诉处理中;-
        taterStatus: {
          1: this.$i18n.t('otc.pendingPayment'),
          2: this.$i18n.t('otc.cancelled'),
          3: this.$i18n.t('otc.paid'),
          4: this.$i18n.t('otc.paidFor'),
          5: this.$i18n.t('otc.dealDone'),
          6: this.$i18n.t('otc.appeal'),
        },
        currentItem: null, // 当前tab信息
        activeKey: 1,
        scrollObj: null,
        total: 0,
        appealQuery: { // 待处理的单
          status: [], // 订单状态
          limit: 10,
          page: 1,
        },
        myAppealOrderList: [], // 当前申诉单数量
        statusArr: [
          { text: this.$t('appeal.toBeProcessed'), // 待处理
            key: 1,
            status: [1, 2], // 申诉订单状态
            quantity: 0, // 数量
          },
          { text: this.$t('appeal.doProcessing'), // 正在处理
            key: 2,
            status: [3],
            quantity: 0, // 数量
          },
          { text: this.$t('appeal.haveProcessed'), // 已处理
            key: 3,
            status: [4, 5, 6],
            quantity: 0, // 数量
          },
        ],
      }
    },
    computed: {
      ...mapState('basic', ['uid', 'id']),
      errorStatus() {
        let list = this.myAppealOrderList
        if (!this.uid) {
          return 'loginout'
        } else if (list.length === 0) {
          return 'empty'
        }
      },
    },
    methods: {
      // 切换币币列表
      changeTopMenu(item) {
        this.currentItem = item
        this.currentItem.quantity = 0
        this.activeKey = item.key // tab对应的key
        this.myAppealOrderList = []
        this.appealQuery.page = 1
        this.appealQuery.status = item.status
        if (!item.key) {
          this.showTabFromOter(item.status)
        }
        this.initScroll(item)
      },
      // 从其他页面跳转回来,回显tab
      showTabFromOter(status) {
        if (status[0] === 1 || status[0] === 2) {
          this.activeKey = 1
          this.appealQuery.status = [1, 2]
        } else if (status[0] === 3) {
          this.activeKey = 2
          this.appealQuery.status = [3]
        } else if (status[0] === 4 || status[0] === 5 || status[0] === 6) {
          this.activeKey = 3
          this.appealQuery.status = [4, 5, 6]
        } else {
          this.activeKey = 1
          this.appealQuery.status = [1, 2]
        }
      },
      isMyBuy(userId, direction) { // userId为发起申诉方 direction为申诉方的买卖方向
        if (this.id) {
          // console.log("userId " + userId,this.user);
          // 买卖方向（1买入;2卖出）
          if (direction === 1) {
            if (this.id === userId) {
              return true
            } else {
              return false
            }
          } else { // direction === 2
            if (this.id === userId) {
              return false
            } else {
              return true
            }
          }
        }
        return false
      },
      goViewAppealDetail(item) {
        let $this = this
        this.$Helper.dialog('OtcViewAppealInfo', 'right', {
          takerOrderId: item.relateOrderId,
          callback: item => {
            $this.changeTopMenu(item) // 重新刷新頁面
          }}, $this.$store
        )
      },
      // 初始化下拉刷新控件
      initScroll(item) {
        if (this.scrollObj) {
          this.initOrderList()
          return
        }
        let $this = this
        this.scrollObj = new MeScroll('AppealOrderScrollList', {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initOrderList,
            htmlNodata: `<div class="box box-item empty-status"></div>`,
            htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip"></p>',
            warpClass: '',
            showNoMore: function(mescroll, upwarp) {
              // 如果只有一页数据  就不提示无数据了
              if ($this.appealQuery.page > 2) {
                $this.$Helper.emitAction('toast', {
                  text: $this.$t('basic.not_more'),
                })
              }
              upwarp.innerHTML = mescroll.optUp.htmlNodata
            },
          },
        })
      },
      // 根据状态查询对应的申诉单
      initOrderList() {
        let $this = this
        this.$Helper.ajax({
          url: '/app/otc/myAppealOrderList.api',
          params: $this.appealQuery,
          method: 'POST',
        }).then(
          data => {
            // 处理异常httpcode 以及 207重复操作
            if (this.$Helper.dealHttpCode(data.code, data.msg, $this.scrollObj, $this.appealQuery)) {
              // $this.myAppealOrderList = data.rows
              // $this.total = data.total
              let list = data.rows
              if (list && list.length > 0) {
                $this.myAppealOrderList = $this.$Helper.dealPageResult(data.pages, $this.scrollObj, $this.appealQuery, $this.myAppealOrderList, list)
              }
            }
          }
        )
      },
    },
    created() {
      this.appealQuery.status = [1, 2]
      this.initOrderList()
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .router-view{
    z-index: 8;
  }
  .order-container {
    background: white;
    .right-text{
      font-size: 3.6vw;
    }
    .box-x-right{
      text-align: right;
    }
  }
  .otc-list-con .list .bd{
    padding-top:2vw
  }
  .otc-list-con .list .bd .box-space-bettwen span.r-txt{
    color:#1f405a
  }
  .otc-list-con .list .bd span.r-btn{

    color:#03c087;
    padding:2vw 0vw;
  }
  .otc-list-con .list .bd span.r-btn-g{

    color:#ccc;
    padding:2vw 0vw;
  }
  .router-view{
    background:#fff;
  }
</style>
