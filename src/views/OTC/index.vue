<template lang="html">
  <div class="order-container box box-row "  @click="optionShow = false">
    <div class="layout ">
           <div class="container box box-row" img-set="static/favicon.ico">
                <div class="head box" style="padding:0 4vw;">
                  <div class="left box box-item">

                  </div>
                  <div class="name box box-item box-col-flex">
                   <!-- 1 商家发布的买入单  2 商家发布的卖出单 -->
                    <!--<span>OTC{{$t('otc.merchant')}}{{listQuery.direction===1?$t('otc.buyCoin'):$t('otc.sellCoin')}}{{listQuery.dcCode}}<i class="iconfont" style="color:#64acf5">&#xe676;</i></span>-->
                    <div class="sell-tab box box-space-bettwen" >
                      <span :class="{'active':listQuery.direction===1}"  @click="changeDirection(2)">{{$t('otc.buyCoin')}}</span>
                      <span :class="{'active':listQuery.direction===2}"  @click="changeDirection(1)">{{$t('otc.sellCoin')}}</span>

                    </div>
                  </div>
                  <div class="right box box-item" style="position:relative">
                    <i class="iconfont icon-list" style="font-size:5vw;" @click.stop="optionShowClick()">&#xe630;</i>
                    <div class="hint-box" v-show="optionShow" @click="optionShow = !optionShow">
                      <b class="angle" style="right:3.5vw;"></b>
                      <ul>
                        <li @click="entrust()" v-if="isMerchant === 2"><i class="iconfont" style="font-size:6vw;font-weight:bold">&#xe684;</i>{{$t('otc.releaseCommission')}}</li>
                        <li @click="showOption()"><i class="iconfont">&#xe675;</i>{{$t('otc.option')}}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="half-x-line"></div>
                <!--<ScrollTopMenu :list="bblist" :activeKey="activeKey" @change="changeTopMenu" :lessCenter="false"/>-->
                <!--法币交易-->
                <div class="market-container box box-row" style="height: 150vw;" v-if="this.fbCoinList">
                  <div class="content box-row-flex box box-row ">
                            <div class="container box">
                              <div class="list-con box box-y-center mescroll-touch-x box-col-flex">
                                <ul class="list">
                                  <ScrollTopMenu :list="fbCoinList" :activeKey="activeKey" @change="changeTopMenu" :lessCenter="false"/>
                                  <!--<li  class="active">USDT</li>-->
                                  <!--<li  class="">ETH</li>-->
                                </ul>
                              </div>

                            </div>
                            <template v-if="this.orderList" >
                              <div class="otc-list-con box-row-flex overflow-y"   id="otcScroll">
                                <div v-for="(item,index) in this.orderList">
                                <div class="list" @click="buyOtc(item)">
                                  <div class="hd box box-space-bettwen">
                                    <div>{{item.nickName}}<i :class="'iconfont v'+item.userLevel">&#xe65e;<b>{{item.userLevel}}</b></i></div>
                                    <div>{{$Helper.floor(item.currOrderPrice,2)}}&nbsp;{{item.currencySymbol}}</div>
                                  </div>
                                  <div class="half-x-line"></div>
                                  <div class="bd box box-space-bettwen">
                                    <div class="left box box-row">
                                      <span>{{$t('otc.quota')}}&nbsp;{{item.limitMin}}&nbsp;-&nbsp;{{item.limitMax}}&nbsp;{{item.currencySymbol}}</span>
                                      <span>{{$t('otc.quantity')}}&nbsp;{{item.availableVolume}}&nbsp;{{item.dcCode}}</span>
                                    </div>
                                    <div class="right box-col-4">
                                      <!--<span>目前状态：在线</span>-->
                                      <span class="box box-x-right">
                                        <div  :class="'pay-icon'+' '+p.cssName+'-bg'" v-for="(p,index) in item.payTypeList">
                                          <label><i  :class="'iconfont icon-'+p.cssName"></i></label>
                                        </div>
                                    </span>
                                      <span class="more box box-x-right"><i class="iconfont"></i></span>
                                    </div>
                                  </div>
                                </div>
                                <!--<div class="gray-line"></div>-->
                                </div>
                              </div>
                            </template>

                    <error-status :status="errorStatus" />

                </div>
              </div>

           </div>
        <!--法币交易END-->

        </div>

  </div>
</template>
<script>
import ScrollTopMenu from '@/components/ScrollTopMenu'
import ErrorStatus from '@/components/ErrorStatus'
import {mapState} from 'vuex'
import MeScroll from 'mescroll.js'
import _ from 'lodash'
export default {
  name: 'OTC',
  components: {
    ErrorStatus,
    ScrollTopMenu,
  },
  data() {
    return {
      optionShow: false,
      activeKey: 0,
      scrollObj: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        dcCode: '',
        direction: 2, // 1 商家发布的买入单  2 商家发布的卖出单
        countryCode: '', // 国家
        currencySymbol: '', // 法币币种
        payMethod: '', // 支付方式Id
        amount: '', //  订单金额
      },
      cloneQuery: null,
      // 筛选条件
      optionParam: {
        countryCode: '', // 国家
        currencySymbol: '', // 法币币种
        payId: '', // 支付方式Id
        payMethod: '',
        amount: '', //  订单金额
      },
      orderList: [],  // 当前币币的挂单数量列表
      fbCoinList: [], // 法币可以交易的币币的币种列表
    }
  },
  computed: {
    ...mapState('basic', ['uid', 'mobile', 'isMerchant', 'isValid']),
    errorStatus() {
      let list = this.orderList
      if (!list) {
        return 'error'
      } else if (list.length === 0) {
        return 'empty'
      }
      return null
    },
  },
  methods: {
    // 切换币币列表
    changeTopMenu(key) {
      this.activeKey = key
      this.orderList = [] // 清空分页数据
      this.listQuery.dcCode = this.fbCoinList[key] // 修改查询条件
      this.listQuery.page = 1
      // 重新加载订单
      this.initOrderList()
    },
    // 发布委托
    entrust() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'OtcEntrust',
          type: 'right',
        },
      )
     // this.$Helper.jumpPage({name: 'OtcEntrust'}, this)
    },
    changeDirection(direction) {
      let dcCode = this.listQuery.dcCode
      this.orderList = [] // 清空分页数据
      this.listQuery = _.cloneDeep(this.cloneQuery)
      this.listQuery.direction = direction
      this.listQuery.dcCode = dcCode
      this.initOrderList()
    },
    // //身份认证
    // authStatus() {
    //   authStatus().then((response) => {
    //     if (response.code === 200) {
    //       this.validStatus = (response.data.validStatus === 2);
    //     }
    //   })
    // },
    // getFbUserInfo(){
    //
    // },
    // 展开下拉筛选
    optionShowClick() {
      let $this = this
      this.optionShow = !this.optionShow
      if (!this.optionShow) return
      if (!$this.uid) return // 未登录不查询
      if ($this.isMerchant !== 2) { // 已经是商家不需要再查询
        $this.$Helper.ajax({
          url: `/app/common/getCertifedinfo.api`, // 获取商户认证和实名认证信息
          method: 'POST',
        })
        .then(
          data => {
            // 更新store值
            $this.$store.dispatch('basic/setLoginData', {isValid: data.data.isValid, isMerchant: data.data.isMerchant})
          }
        )
      }
    },
    // 展开筛选条件
    showOption() {
      let $this = this
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'OtcOrderOption',
          type: 'right',
          params: {
            initParam: $this.optionParam,
            callback: item => {
              $this.$Helper.copyProperties(item, this.listQuery)
              this.listQuery.payMethod = item.payId
              this.listQuery.page = 1
              this.orderList = []
              $this.initOrderList()
            },
          },
        },
      )
    },
    // 购买法币
    buyOtc(item) {
      // 跳转登录页面
      let $this = this
      if (!this.uid) {
        this.$Helper.jumpPage({ name: 'Login' }, this)
        return
      }
      if (!this.mobile) {
        this.$Helper.toast(this.$t('otc.needPhone'))
        return
      }
      if ($this.isValid !== 2) { // 已经实名认证不需要再查询
        $this.$Helper.ajax({
          url: `/app/common/getCertifedinfo.api`, // 获取商户认证和实名认证信息
          method: 'POST',
        })
        .then(
          data => {
            if (data.data.isValid !== 2) {
              this.$Helper.toast(this.$t('otc.notValid'))
              return
            }
            this.$store.dispatch( // 跳转购买页面
              'layermodel/push',
              {
                name: 'OtcBuy',
                type: 'right',
                params: {
                  orderId: item.makerOrderId,
                },
              },
            )
            // 更新store值
            $this.$store.dispatch('basic/setLoginData', {isValid: data.data.isValid, isMerchant: data.data.isMerchant})
          }
        )
      } else {
        this.$store.dispatch( // 跳转购买页面
          'layermodel/push',
          {
            name: 'OtcBuy',
            type: 'right',
            params: {
              orderId: item.makerOrderId,
            },
          },
        )
      }
    },
    // 初始化下拉刷新控件
    initScroll() {
      if (this.scrollObj) return
      this.scrollObj = new MeScroll('otcScroll', {
        down: {
          use: false,
          auto: false,
        },
        up: {
          callback: this.initOrderList,
          // clearEmptyId: `scroll_list`,
          htmlNodata: `<div class="box box-item empty-status"></div>`,
          warpClass: '',
        },
      })
    },
    initOrderList() {
      let $this = this
      this.$Helper.ajax({
        url: `/app/otc/makerList.api`,
        params: $this.listQuery,
        method: 'POST',
      })
        .then(
          data => {
            let code = data.code
            let rows = data.rows
            let page = data.pages
            if (code === 207) {
              $this.scrollObj.endSuccess($this.listQuery.limit, true)
              return
            }
            var recordList = rows
            if (recordList.length > 0) {
              // $this.list = response.data.result.records
              $this.orderList = $this.orderList.concat(recordList)
              $this.listQuery.page++
            }
            if ($this.scrollObj) {
              let hasNext = $this.listQuery.page < page
              $this.scrollObj.endSuccess($this.listQuery.limit, hasNext)
            }
            //  $this.orderList = $this.$Helper.dealPageResult(data, $this.scrollObj, $this.listQuery, $this.orderList)
           // $this.orderList = $this.orderList.concat($this.orderList)
          }
        )
    },
    initFbCoin() {
      let $this = this
      this.$Helper.ajax({
        url: `/app/otc/getFbCoinList.api`,
      })
        .then(
          data => {
            // 获取当前语言下法币可以兑换的币种
            let list = _.get(data, 'data.fbTradeCoinList')
            $this.fbCoinList = _.map(list, function(item) {
              return item.dcCode
            })
            if ($this.fbCoinList && $this.fbCoinList.length > 0) {
              $this.listQuery.dcCode = $this.fbCoinList[0]
              $this.initScroll()
            }
          }
        )
    },
  },
  created() {
  },
  mounted() {
    this.cloneQuery = _.cloneDeep(this.listQuery)
    this.initFbCoin()
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
  .container {
    background: white;

    .head {
      padding: 4vw;
      height:12vw;
      .name{
        font-size: 4.6vw;
        font-weight: 600;
        color: #646da9;
      }
      .col {
        padding-bottom: 4vw;
        .title {
          font-size: 3.8vw;
          color: #aaa;
        }
        .num {
          font-size: 6vw;
          color: #333;
          font-weight: 500;
          padding-top: 3vw;
        }
      }
    }
  }
  .list-con{
    background: #fff;
    border-bottom: 1px solid #eee;
    height: 11vw;
  }

</style>
