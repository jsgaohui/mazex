<template lang="html">
  <div class=""  ref="routerView">
    <div class="layout">
      <div data-v-4dc07ef9="" class="container box box-row router-view" img-set="static/favicon.ico">
        <div data-v-4dc07ef9="" class="head box" style="padding:0px 5vw;">
          <div class="left box box-item"><i class="iconfont" @click="back"></i></div>
          <div data-v-4dc07ef9="" class="name box box-item box-col-flex">
            {{$t('at.atOrder')}}
          </div>
          <div data-v-4dc07ef9="" class="right box box-item">
            <i class="iconfont" style="font-size:4.5vw;" @click="editModel=!editModel">&#xe69a;</i>
          </div>
        </div>
        <div data-v-4dc07ef9="" class="half-x-line"></div>
        <!--跟单策略-->
        <div class="tactics-main">
          <div class="tactics-menu">
            <ul class="box box-space-bettwen">
              <li :class="{'active':tabActive}" v-if="!tabActive" @click="changeTab"> {{$t('at.followOrder')}}</li>
              <li :class="{'active':tabActive}" v-else> {{$t('at.followOrder')}}</li>
              <li :class="{'active':!tabActive}" v-if="tabActive" @click="changeTab"> {{$t('at.hisOrder')}}</li>
              <li :class="{'active':!tabActive}" v-else > {{$t('at.hisOrder')}}</li>
            </ul>
          </div>
          <div class="overflow-y router-view with-topbar"  v-if="list" style="top:24vw" id="atOrderScrollList">
            <div class="list is-active" v-for="(item,index) in list" >
              <div class="hd box box-space-bettwen">
                <h3 class="icon">{{item.stragetyName}}</h3><span class="r-text" @click="toDetail(item.batchId)">{{$t('at.orderDetail')}}</span>
              </div>
              <div class="half-x-line"></div>
              <div class="bd edit-con box box-c-start">
                <div class="left check-wrapper box box-x-left" v-if="ifEditModel">
                  <label role="checkbox" class="checkbox-wrapper" aria-checked="true" @click="check(item)">
                            <span aria-checked="mixed" :class="{'checkbox-input':true,'is-checked':item.checked}" >
                                <span class="checkbox-inner"></span>
                            </span>
                  </label>
                </div>
                <div class="right box box-row">

                    <div class="box box-space-bettwen"><label>{{$t('at.number')}}</label>  <span>{{item.batchId}}</span></div>
                    <div class="box box-space-bettwen"><label>{{$t('at.createtime')}}</label>  <span>{{item.createTime}}</span></div>
                    <div class="box box-space-bettwen"><label>{{$t('basic.num')}}</label>  <span>{{item.tradeVolumn}}&nbsp;{{item.direction===0?item.marketCode:item.dcCode}}</span></div>
                    <div class="box box-space-bettwen"><label>{{$t('at.bbcharge')}}</label><span>{{item.totalCharge?item.totalCharge:0}}&nbsp;{{item.marketCode}}</span></div>
                    <div class="box box-space-bettwen"><label>{{$t('at.preatcharge')}}</label><span>{{item.autoTradeCharge?item.autoTradeCharge:0}}&nbsp;CCASH</span></div>
                    <div class="box box-space-bettwen"><label>{{$t('at.atcharge')}}</label><span>{{item.tradeCharge?item.tradeCharge:0}}&nbsp;CCASH</span></div>
                    <div class="box box-space-bettwen" style="margin-top:2vw;padding-top:2vw;border-top:1px solid #eee;">
                      <div class="box-col-8">
                        <div class="box box-space-bettwen"><label>{{$t('at.totalProfit')}}</label><span>{{item.totalProfit?item.totalProfit:0}}&nbsp;{{item.direction===0?item.marketCode:item.dcCode}}</span></div>
                        <div class="box box-space-bettwen"><label>{{$t('at.again')}}</label><span>{{item.reinvest===0?$t('at.no'):$t('at.yes')}}</span></div>
                      </div>
                      <div class="k-line" style="width:18vw;" @click.stop="showProfit(item.autoTradeProInfoId)">
                        <!--<img src="/static/images/pic03.png" v-if="item.direction===1">-->
                        <!--<img src="/static/images/pic04.png" v-else>-->
                        <i class="iconfont" style="font-size:12vw;">&#xe659;</i>
                      </div>
                    </div>


                </div>
              </div>
              <div class="gray-line"></div>
            </div>
            <error-status :status="errorStatus" />
          </div>
        </div>
        <!--跟单策略 END-->
      </div>
      <!--底部菜单-->
      <div class="fixed-bottom edit-allselect box box-space-bettwen" v-if="ifEditModel">
        <div class="left check-wrapper box box-x-left">
          <label role="checkbox" class="checkbox-wrapper is-checked"  @click="allCheckedClick">
                <span aria-checked="mixed" :class="{'checkbox-input':true,'is-checked':allChecked}" >
                    <span class="checkbox-inner"></span>
                    <!--<input type="checkbox" aria-hidden="true" value=""  >-->
                </span>
            <span>{{$t('at.allselect')}}</span>
          </label>
        </div>
        <div class="right box box-x-right">
          <!--<div class="txt">-->
            <!--<b>总收益：<span class="blue">100BTC</span></b>-->
            <!--<P>单号:1234567897894561236</P>-->
          <!--</div>-->

          <div class="bottom-btn02 active" v-if="ifSelectOne" @click="showdiv=true">{{$t('otc.cancelOrder')}}</div>
          <div class="bottom-btn02" v-else >{{$t('otc.cancelOrder')}}</div>
        </div>
      </div>
      <!--底部菜单 END-->
    </div>
    <!--弹出窗口--取消订单-->
    <div class="tip-bg" v-show="showdiv" @click="showdiv=false" style="z-index:10000"></div>
    <div class="tip-box" style="display:block;z-index:10001" v-show="showdiv">
      <div class="tip-top">
        <div>{{$t('otc.cancelOrder')}}</div>
        <div class="tip-close" @click="showdiv=false"><i class="iconfont"></i></div>
      </div>
      <div class="tip-con" style="padding:0;padding-top:3vw;">
        <div class="content cancel-order">
          <div class="txt">
            <p>{{$t('at.tips7')}}</p>
            <p>{{$t('at.tips8')}}</p>
          </div>
          <!--<div class="radio-txt box box-x-left"><input type="radio" />{{$t('at.tips9')}}</div>-->
        </div>
        <div class="tip-bottom-btn box box-space-bettwen">
          <div class="btn btn-gray box-col-6" @click="showdiv=false">{{$t('basic.cancel')}}</div>
          <div class="btn box-col-6" @click="showDialog" style="margin-left:4vw;">{{$t('fund.confirm')}}</div>
        </div>
      </div>
    </div>

    <div class="tip-bg" @click="passDiv=false"  v-show="passDiv"></div>
    <div class="tip-box" style="display:block" v-show="passDiv">
      <div class="tip-top">
        <div>{{$t('fund.inputPass')}}</div>
        <div class="tip-close"><i class="iconfont" @click="passDiv=false" ></i></div>
      </div>
      <div class="tip-con" style="padding:0">
        <div class="content pass-con">
          <div>
            <input class="pass-input" type="password" maxlength="6" v-model="cancelParam.payPassword" autocomplete="off">
          </div>
          <div style="padding-top:2vw;text-align:right"><span class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span></div>
        </div>
        <div class="box box-space-bettwen">
          <div class="btn btn-gray box-col-6" @click="passDiv=false">{{$t('basic.cancel')}}</div>
          <div class="btn box-col-6" @click="cancel()" style="margin-left:4vw;">{{$t('basic.comfirm')}}</div>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
  import MeScroll from '@/lib/mescroll'
  import ErrorStatus from '@/components/ErrorStatus'
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState('basic', ['uid', 'isExitTradePwd']),
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
      // 是否编辑模式
      ifEditModel() {
        return this.editModel && this.listQuery.enable === 1
      },
      // 是否选择了一个订单
      ifSelectOne() {
        return this.cancelParam.batchId.length > 0
      },
    },
    components: {
      ErrorStatus,
    },
    name: 'AtOrder',
    data() {
      return {
        allChecked: false,
        editModel: false,
        tabActive: true,
        showdiv: false,
        passDiv: false,
        scrollObj: null,
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          enable: 1, // 1跟随中  2取消跟随的(历史)
          page: 1,
          limit: 10,
        },
        copyListQuery: {
          enable: 1, // 1跟随中  2取消跟随的(历史)
          page: 1,
          limit: 10,
        },
        cancelParam: {
          payPassword: '',
          batchId: [],
        },
        copyCancelParam: {
          payPassword: '',
          batchId: [],
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
      allCheckedClick() {
        this.allChecked = !this.allChecked
        this.list.forEach((item) => {
          item.checked = this.allChecked
        })
        this.countBatchId()
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
      // 计算batchId
      countBatchId() {
        this.cancelParam.batchId = []
        this.list.forEach((item) => {
          if (item.checked) {
            this.cancelParam.batchId.push(item.batchId)
          }
        })
      },
      check(ob) {
        let allChecked = true
        this.list.forEach((item) => {
          if (ob.batchId === item.batchId) {
            item.checked = !item.checked
          }
          if (!item.checked) {
            allChecked = false
          }
        })
        this.allChecked = allChecked
        this.countBatchId()
      },
      back() {
        this.$Helper.jumpPage({ name: 'Account' }, this)
      },
      toDetail(id) {
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'AutoTradeUserOrderDetail',
            type: 'right',
            params: {
              batchId: id,
              callback: item => {
              },
            },
          },
        )
      },
      changeTab() {
        this.tabActive = !this.tabActive
        this.list = []
        this.listQuery.page = 1
        // 如果是当前跟单列表
        if (this.tabActive) {
          this.listQuery.enable = 1
        } else {
          this.listQuery.enable = 2
        }
        this.initList()
      },
      validate(verifyPwd = true) {
        if (this.cancelParam.batchId.length < 1) {
          this.$Helper.emitAction('toast', {
            text: this.$t('at.chooseBatch'),
          })
          return false
        }
        if (this.cancelParam.payPassword.length !== 6) {
          this.$Helper.emitAction('toast', {
            text: this.$t('fund.paypassword'),
          })
          return false
        }
        return true
      },
      showDialog() {
        this.showdiv = false
        this.passDiv = true
        // this.$store.dispatch(
        //   'layermodel/push',
        //   {
        //     name: 'Password',
        //     type: 'top',
        //     params: {
        //       callback: item => {
        //         this.cancelParam.payPassword = item
        //         this.cancel()
        //       },
        //     },
        //   },
        // )
      },
      // 批量取消订单
      cancel() {
        if (!this.validate()) return
        this.$Helper.ajax({
          url: '/app/autotrade/cancel.api',
          method: 'POST',
          params: this.cancelParam,
        }).then(
          data => {
            this.passDiv = false
            this.$Helper.copyProperties(this.copyCancelParam, this.cancelParam)
            this.$Helper.copyProperties(this.copyListQuery, this.listQuery)
            if (this.$Helper.dealHttpCode(data.code, data.msg)) {
              this.$Helper.toast(this.$t('at.cancelSuccess'))
              this.list = []
              this.initList()
            }
          }
        )
      },
      initScroll() {
        if (this.scrollObj) return
        this.scrollObj = new MeScroll('atOrderScrollList', {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initList, // 上拉回调
            htmlNodata: `<div class="box box-item empty-status" style="display:none;">${this.$t('basic.not_more')}</div>`,
          },
        })
      },
      initList() {
        let $this = this
        this.$Helper.ajax({
          url: '/app/autotrade/proOrder.api',
          method: 'POST',
          params: this.listQuery,
        }).then(
           data => {
             if (this.$Helper.dealHttpCode(data.code, data.msg, $this.scrollObj, $this.listQuery)) {
               let list = data.rows
               if (list && list.length > 0) {
                 $this.list = $this.$Helper.dealPageResult(data.pages, $this.scrollObj, $this.listQuery, $this.list, list)
               }
               if ($this.list) {
                 $this.list = $this.list.map(item => ({ ...item, checked: false }))
               }
             }
           }
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
  .router-view{
    background: #fff;
  }
  .fixed-bottom{
    z-index: 9999;
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
  .router-view{
    background:#f9f9fc;
  }
  .container {
    background: white;
  }

  .tip-top{
    background:#ecf0f7;
    height:12vw;
    line-height:12vw;
    font-size:4.5vw;
    color:#1f405a;
  }
  .tip-box .tip-con{
    padding:4vw 0;
    padding-bottom:0px;
  }
  .tip-close {
    position: absolute;
    top: 0vw;
    right: 1.8vw;
    z-index: 101;
  }
  .tip-close i{
    color:#455070;
  }
  .tip-con .content{
    text-align: center;
    line-height:7vw;
    font-size:4.1vw;
    color:#455070
  }
  .tip-con .content p{
    font-size:3.5vw;
  }
  .half-x-line{
    background:#dcdcdf
  }
  .tip-con .box-space-bettwen {
    padding: 4vw;
    font-size: 4vw;
    color: #8398a6
  }
  .otc-btn{
    position:fixed;
    bottom:4vw;
    left:0;
    right:0;
    background: #fff;
    padding:0vw 4vw;
  }
  .otc-btn div{
    width:100%;
  }
</style>
