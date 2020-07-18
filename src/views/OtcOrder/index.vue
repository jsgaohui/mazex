<template lang="html">
  <div class="order-container" >
    <div class="container"   >
      <!--<div class="head box" style="padding:0px 5vw;">-->

      <!--法币订单-->
      <div data-v-4b1c1eba="" class="market-container box box-row"  >
        <div class="content" >

          <NewScrollTopMenu :list="statusArr" :activeKey="activeKey" @change="changeTopMenu" :lessCenter="false" whichPage="OtcOrder"/>

          <div class="otc-list-con overflow-y router-view with-topbar" v-if="orderList"  id="otcScrollList">
            <template v-if="this.orderType === 0">
              <div class="list" v-for="(item,index) in orderList" @click="toDetail(item)">
                <div class="hd rel box box-space-bettwen">
                  <div class="box box-x-left" style="align-items: center">
                    <div class="order-rel">
                      <img src="/static/images/buy-bg.png">
                      <!-- 1是买 2是卖 -->
                      <!-- 如果委托单是买单,并且userId = 登录id  显示买单,如果是卖单  显示卖单-->
                      <span v-if="item.direction === 1">
                      {{item.userId === id ? $t('otc.b'): $t('otc.s')}}
                    </span>
                      <span v-else>{{item.userId === id ? $t('otc.s'): $t('otc.b')}}</span>
                    </div>
                    <b style="color:#1f3b60;">{{$Helper.format(Number.parseFloat(item.orderPrice*item.orderVolume),2)}}&nbsp;{{item.currencySymbol}}</b>
                    <span v-show="item.appealFlag===1||item.appealFlag===2||item.appealFlag===3" class="appeal">{{$t('appeal.appeal')}}</span>
                    </div>
                  <div>{{item.remainingTimes}}
                    <!-- <span class="look-btn" @click.stop="goToAppeal(item)" v-if="item.remainSeconds <= 0&&(!item.appealFlag||item.appealFlag===0)">{{$t('appeal.goToAppeal')}}</span>
                    <span class="detail-btn" @click.stop="goViewAppealDetail(item)" v-if="item.remainSeconds <= 0&&item.appealFlag&&item.appealFlag!==0">{{$t('appeal.appealDetail')}}</span> -->
                  </div>
                </div>
                <div class="half-x-line"></div>
                <div class="bd">
                  <div class="box box-space-bettwen"><label>{{$t('otc.oddNumber')}}</label><span class="r-txt"> {{item.takerOrderId}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.unitPrice')}}</span><span class="r-txt"> {{Number.parseFloat(item.orderPrice)}}&nbsp;{{item.currencySymbol}} </span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.time')}}</span><span class="r-txt"> {{item.createTime}}</span></div>
                  <!--&lt;!&ndash; 1是买 2是卖 委托单是买入单,挂牌单是卖出单 买入的本人才可以操作 或者  委托单是卖出单,挂牌单是买入单 买入的本人才可以操作 &ndash;&gt;-->
                  <div class="box box-space-bettwen"><span>{{id === item.userId ? $t('otc.otherSideNickName'): $t('otc.nameOfTheOtherParty')}}</span><span class="r-txt">{{id === item.userId ? item.makerRealName: item.takerRealName}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.quantity')}}</span><span class="r-txt"> {{Number.parseFloat(item.orderVolume)}}&nbsp;{{item.dcCode}}</span></div>
                  <div class="box box-x-right"><span><i class="iconfont">&#xe612;</i></span></div>
                  <!--<div class="left box box-row">-->
                    <!--<span>{{$t('otc.oddNumber')}}: {{item.takerOrderId}}</span>-->
                    <!--<span>{{$t('otc.unitPrice')}}: {{Number.parseFloat(item.orderPrice)}}&nbsp;{{item.currencySymbol}} </span>-->
                    <!--<span>{{$t('otc.time')}}: {{item.createTime}}</span>-->
                  <!--</div>-->
                  <!--<div class="right box-col-5">-->
                    <!--&lt;!&ndash; 1是买 2是卖 委托单是买入单,挂牌单是卖出单 买入的本人才可以操作 或者  委托单是卖出单,挂牌单是买入单 买入的本人才可以操作 &ndash;&gt;-->
                    <!--<span class="box box-x-right">-->
                    <!--{{$t('otc.nameOfTheOtherParty')}}:-->
                      <!--&lt;!&ndash;({{this.id == item.markerUserId ? $t('otc.user'):$t('otc.merchant')}})&ndash;&gt;-->
                         <!--{{id === item.userId ? item.makerRealName: item.takerRealName}}-->
                  <!--</span>-->
                      <!--<span class="box box-x-right">{{$t('otc.quantity')}}: {{Number.parseFloat(item.orderVolume)}}&nbsp;{{item.dcCode}}</span>-->
                    <!--<span class="more box box-x-right"><i class="iconfont">&#xe612;</i></span>-->
                  <!--</div>-->
                </div>
                <!--<div class="gray-line"></div>-->
              </div>
            </template>
            <template v-else>
              <div class="list" v-for="(item,index) in orderList" @click="toEntrustDetail(item)">
                <div class="hd box box-space-bettwen">
                  <div class="box box-x-left" style="align-items: center">
                    <div class="order-rel">
                      <img src="/static/images/buy-bg.png">
                      <!-- 1是买 2是卖 -->
                      <span>{{item.direction===1 ? $t('otc.b'): $t('otc.s')}}</span>
                    </div>
                    <b style="color:#1f3b60;">{{$Helper.format(item.currOrderPrice*item.orderVolume,2)}}&nbsp;{{item.currencySymbol}}</b></div>
                </div>
                <div class="half-x-line"></div>
                <div class="bd ">
                  <!--&lt;!&ndash; 1是买 2是卖 委托单是买入单,挂牌单是卖出单 买入的本人才可以操作 或者  委托单是卖出单,挂牌单是买入单 买入的本人才可以操作 &ndash;&gt;-->
                  <!--&lt;!&ndash;  0.正常; 1.冻结; 2.待撤单(商家主动撤销处理中); 3.待下架 4下架 &ndash;&gt;-->
                  <div class="box box-x-right" v-if="item.orderStatus===0 || item.orderStatus===1"><span class="r-btn">{{$t('otc.itHasBeenAddedTo')}}</span></div>
                  <div class="box box-x-right" v-if="item.orderStatus===2"><span class="r-btn-g">{{$t('otc.freeze')}}</span></div>
                  <div class="box box-x-right" v-if="item.orderStatus===3"><span class="r-btn-g">{{$t('otc.backgroundProcessingInTheRack')}}</span></div>
                  <div class="box box-x-right" v-if="item.orderStatus===4"><span class="r-btn-g">{{$t('otc.hasBeenRemoved')}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.oddNumber')}}</span><span class="r-txt"> {{item.makerOrderId}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.price')}}</span><span class="r-txt"> {{Number.parseFloat(item.currOrderPrice)}}&nbsp;{{item.currencySymbol}} </span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.time')}}</span><span class="r-txt"> {{item.createTime}}</span></div>
                  <div class="box box-space-bettwen"><span>{{$t('otc.theRemainingAmount')}}:</span><span class="r-txt"> {{Number.parseFloat(item.availableVolume)}}&nbsp;{{item.dcCode}}</span></div>
                  <div class="box box-x-right"><span><i class="iconfont">&#xe612;</i></span></div>
                  <!--<div class="left box box-row">-->
                    <!--<span>{{$t('otc.oddNumber')}}: {{item.makerOrderId}}</span>-->
                    <!--<span>{{$t('otc.price')}}: {{Number.parseFloat(item.currOrderPrice)}}&nbsp;{{item.currencySymbol}} </span>-->
                    <!--<span>{{$t('otc.time')}}: {{item.createTime}}</span>-->
                  <!--</div>-->
                  <!--<div class="right box-col-5">-->
                    <!--&lt;!&ndash; 1是买 2是卖 委托单是买入单,挂牌单是卖出单 买入的本人才可以操作 或者  委托单是卖出单,挂牌单是买入单 买入的本人才可以操作 &ndash;&gt;-->
                    <!--&lt;!&ndash;  0.正常; 1.冻结; 2.待撤单(商家主动撤销处理中); 3.待下架 4下架 &ndash;&gt;-->
                    <!--<span class="box box-x-right" v-if="item.orderStatus===0 || item.orderStatus===1">{{$t('otc.itHasBeenAddedTo')}}</span>-->
                    <!--<span class="box box-x-right" v-if="item.orderStatus===2">{{$t('otc.freeze')}}</span>-->
                    <!--<span class="box box-x-right" v-if="item.orderStatus===3">{{$t('otc.backgroundProcessingInTheRack')}}</span>-->
                    <!--<span class="box box-x-right" v-if="item.orderStatus===4">{{$t('otc.hasBeenRemoved')}}</span>-->

                    <!--<span class="box box-x-right">{{$t('otc.theRemainingAmount')}}: {{Number.parseFloat(item.availableVolume)}}&nbsp;{{item.dcCode}}</span>-->
                    <!--<span class="more box box-x-right"><i class="iconfont">&#xe612;</i></span>-->
                  <!--</div>-->
                </div>

                <!--<div class="gray-line"></div>-->
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
  import _ from 'lodash'
  import { fbOrders, removeListenRuner } from '@/lib/quotation'
  // import _ from 'lodash'
  export default {
    name: 'OtcOrders',
    components: {
      ErrorStatus,
      NewScrollTopMenu,
    },
    data() {
      return {
        currentItem: null, // 当前tab信息
        activeKey: 0,
        scrollObj: null,
        makerScrollObj: null,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          orderStatus: [],
          // direction: '', // 買賣
          startTime: '', // 开始时间
          endTime: '', // 结束时间
        },
        nowDateTimer: null,
        data: null,
        orderType: 0, // 0 委托單  1 挂牌單
        // 筛选条件
        optionParam: {
          countryCode: '', // 国家
          currencySymbol: '', // 法币币种
          payId: '', // 支付方式Id
          payMethod: '',
          amount: '', //  订单金额
        },
        orderList: [],  // 当前币币的挂单数量列表
        // 挂牌单查询*/
        fbMakerQuery: {
          dcCode: '', // 币种*/
          currencySymbol: '', // 法币币种*/
          countryCode: '', // /*国家*/
          payMethod: '',  // 支付方式
          direction: null, // 买卖方向*/
          orderStatus: null,  // 挂牌单状态*/
          amount: '', // 金额*/
          limit: 10,
          page: 1,
        },
        topicArr: [],
        statusArr: [
          { text: this.$t('otc.pendingPayment'), // 待付款
            key: 1,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 1, // 订单状态
            quantity: 0, // 数量
          },
          { text: this.$t('otc.paid'), // 已付款
            key: 3,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 3,
            quantity: 0, // 数量
          },
          { text: this.$t('otc.dealDone'), // 已完成
            key: 5,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 5,
            quantity: 0, // 数量
          },
          // { text: this.$t('otc.appeal'), // 申诉中
          //   key: 6,
          // }, myMakerList
          { text: this.$t('otc.IPosted'), // 已发布
            key: 7,
            type: 1,  // 类型  0代表委托单 1代表挂牌单
            status: '',
            quantity: 0, // 数量
          },
          { text: this.$t('otc.cancelled'), // 已取消
            key: 2,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 2,
            quantity: 0, // 数量
          },
          { text: this.$t('otc.backgroundBilling'), // 已收款
            key: 4,
            type: 0,  // 类型  0代表委托单 1代表挂牌单
            status: 4,
            quantity: 0, // 数量
          },
        ],
      }
    },
    computed: {
      ...mapState('basic', ['uid', 'id']),
      errorStatus() {
        let list = this.orderList
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
        window.clearInterval(this.nowDateTimer) // 清楚定时器
        this.orderType = item.type // 0 委托单  1 挂牌单
        this.activeKey = item.key // tab对应的key
        this.orderList = []

        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
        this.listQuery.page = 1
        this.fbMakerQuery.page = 1
        // 发布的委托单
        if (item.type === 1) {
          // 我的发布订单
          this.listQuery.orderStatus = []
          // this.initMakerOrderList()
        } else {
          this.listQuery.orderStatus = [item.status]
          // 重新加载订单
          // this.initOrderList()
        }
        this.initScroll(item)
      },
      // 展开筛选条件
      toDetail(item) {
        // 跳转详情页面
        // 不同的订单状态跳转到不同的地方
        let modulName = 'OtcPendingPayment'
        let $this = this
        switch (item.orderStatus) {
          case 1:
            modulName = 'OtcPendingPayment'
            break
          case 2:
            modulName = 'OtcPayed'
            break
          default:modulName = 'OtcPayed'
        }
        $this.$Helper.dialog(modulName, 'right', {
          takeOrderNo: item.takerOrderId,
          callback: item => {
            $this.changeTopMenu(item) // 重新刷新頁面
          }}, $this.$store
        )
      },
      // 跳转到委托详情
      toEntrustDetail(item) {
        // 跳转详情页面
        let $this = this
        this.$Helper.dialog('OtcEntrustResult', 'right', {
          makerOrderNo: item.makerOrderId,
          callback: item => {
            $this.changeTopMenu(item) // 重新刷新頁面
          }}, $this.$store
        )
      },
      // 跳转到申诉资料填写页面
      goToAppeal(item) {
        let $this = this
        this.$Helper.dialog('OtcWriteAppealInfo', 'right', {
          appealRecord: item,
          callback: item => {
            $this.changeTopMenu(item) // 重新刷新頁面
          }}, $this.$store
        )
      },
      goViewAppealDetail(item) {
        let $this = this
        this.$Helper.dialog('OtcViewAppealInfo', 'right', {
          takerOrderId: item.takerOrderId,
          callback: item => {
            $this.changeTopMenu(item) // 重新刷新頁面
          }}, $this.$store
        )
      },
      // 更新现在的时间
      updateNowTime() {
        this.nowDateTimer = setInterval(() => {
          this.updateMyRemainingTimes()
        }, 1000)
      },
      // 更新我的剩余时间
      updateMyRemainingTimes() {
        for (let i = 0; i < this.orderList.length; i++) {
          let record = this.orderList[i]
          if (record.remainSeconds <= 0) {
            this.remainTime = this.$t('otc.timedOut')
          } else {
            // 计算剩余时间转换成对应的显示
            this.remainTime = this.$Helper.getTheRemainingTime(record.remainSeconds)
            if (!this.remainTime) {
              this.remainTime = this.$t('otc.timedOut')
            }
          }
          this.$set(record, 'remainingTimes', this.remainTime)
          // 剩余时间--
          record.remainSeconds--
        }
      },
      // 初始化下拉刷新控件
      initScroll(item) {
        if (this.scrollObj) {
          this.initOrderList()
          return
        }
        let $this = this
        this.scrollObj = new MeScroll('otcScrollList', {
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
      // 根据状态查询对应的委托单
      initMakerOrderList() {
        let $this = this
        this.$Helper.ajax({
          url: `/app/otc/myMakerList.api`,
          params: $this.fbMakerQuery,
          method: 'POST',
        }).then(
          data => {
            // 处理异常httpcode 以及 207重复操作
            if (this.$Helper.dealHttpCode(data.code, data.msg, $this.scrollObj, $this.fbMakerQuery)) {
              let list = data.rows
              if (list && list.length > 0) {
                $this.orderList = $this.$Helper.dealPageResult(data.pages, $this.scrollObj, $this.fbMakerQuery, $this.orderList, list)
              }
            }
          }
        )
      },
      // 根据状态查询对应的委托单
      initOrderList() {
        if (this.currentItem.type === 1) {
          this.initMakerOrderList()
          return
        }
        let $this = this
        this.$Helper.ajax({
          url: `/app/otc/myTakeList.api`,
          params: $this.listQuery,
          method: 'POST',
        }).then(
          data => {
            // 处理异常httpcode 以及 207重复操作
            if (this.$Helper.dealHttpCode(data.code, data.msg, $this.scrollObj, $this.listQuery)) {
              $this.data = data.data
              let list = $this.data.myTakeList.records
              $this.orderList = $this.$Helper.dealPageResult($this.data.myTakeList.pages, $this.scrollObj, $this.listQuery, $this.orderList, list)
              // 待付款以及已付款才显示倒计时
              if ($this.listQuery.orderStatus.indexOf(1) > -1 || $this.listQuery.orderStatus.indexOf(3) > -1) {
                $this.updateNowTime()
              }
            }
          }
        )
      },
    },
    beforeDestroy() {
      // 销毁创建的监听组件
      window.clearInterval(this.nowDateTimer)
    },
    activated() {
      removeListenRuner('reloadQuotation')
      removeListenRuner('reloadRate')
      removeListenRuner('reloadSymbolKline')
      removeListenRuner('reloadOrders')
      removeListenRuner('reloadGearQuotation')
      fbOrders() // 订阅订单状态变更
    },
    created() {
      let $this = this
      this.$Helper.onAction('fbOrders', ({list}) => {
        if (!$this.orderList) return
        // 相同状态和单号的过滤掉
        for (let i = 0; i < $this.topicArr.length; i++) {
          if ($this.topicArr[i].orderNo === list.takerOrderId && $this.topicArr[i].orderStatus === list.orderStatus) {
            return
          }
        }
        // 保存状态和单号
        $this.topicArr.unshift({orderNo: list.takerOrderId, orderStatus: list.orderStatus})
        // 不是委托单tab   其他tab提示数字++
        if ($this.currentItem.type !== 0) {
          // 遍历tab  找到需要加数字的tab
          _.map($this.statusArr, item => {
            if (item.type === 0 && item.status === list.orderStatus) {
              item.quantity++ // 其他tab提示数字++
              return
            }
          })
          return
        }
        // 如果当前tab的状态和推送的状态不一致,移除当前tab ,其他tab提示数字++
        if ($this.currentItem.status !== list.orderStatus) {
          for (let i = 0; i < $this.orderList.length; i++) {
            // 判断重复推送的订单
            if ($this.orderList[i].takerOrderId === list.takerOrderId) {
              $this.orderList.splice(i, 1) // 移除当前数组
              if ($this.currentItem.quantity > 0) {
                $this.currentItem.quantity--
              }
              break
            }
          }
        } else {
          // 如果是状态相同的
          for (let i = 0; i < $this.orderList.length; i++) {
            // 判断重复推送的订单 如果已经存在订单号相同的 直接返回
            if ($this.orderList[i].takerOrderId === list.takerOrderId) {
              return
            }
          }
          $this.orderList.unshift(list) // 加入当前数组
        }

        // 遍历tab  找到需要加数字的tab
        _.map($this.statusArr, item => {
          if (item.type === 0 && item.status === list.orderStatus) {
            item.quantity++ // 其他tab提示数字++
            return
          }
        })
      })
    },
    mounted() {
      // 設置 tab一個默認值
      let item = this.statusArr[0]
      if (this.$route.params != null && this.$route.params.status != null && this.$route.params.type != null) {
        // 如果其他頁面跳轉過來的 并且帶狀態的
        item = this.$route.params
      }
      this.listQuery.orderStatus = [item.status]
      this.activeKey = item.key
      this.changeTopMenu(item)
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container .head{
    height:12vw!important;
    min-height: 12vw;
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
    background:#fff
  }
</style>
