<template lang="html">
  <!--跟单账户-->
  <div class="order-container box box-row">
    <div class="overflow-y " ref="routerView" v-if="list">
      <div class="container overflow-y mescroll" >
        <div class="card" style="position:relative;margin-bottom:20px;">
          <h2 style="color:#646da9;">{{$t('fund.assert')}}</h2>
          <p>
             <span v-if="worthList&&worthList.length > 0">
                 <span v-for="item in this.worthList">
                     {{item}}
                 </span>
              </span>
            <span v-else>--</span>
          </p>
          <h2 class="num" style="    color: #646da9;">{{$t('fund.profitLoss')}}</h2>
          <p>
             <span v-if="profitMap">
                      <span  v-for="(k,v) in this.profitMap" >
                     <b :class="k > 0 ? 'color-sell':'color-buy'"> <b v-if="k >0">+</b>{{k}}</b>&nbsp;{{v}}
                   </span>
                 </span>
            <span v-else>--</span>
          </p>
          <!--<router-link class="more" to="fundaccountlog"> {{$t('fund.fundlog')}}</router-link>-->
          <span class="more" @click="jumpToLog()">{{$t('fund.fundlog')}}</span>
        </div>

        <div class="table">
          <div class="row head box box-space-bettwen">
            <div class="name box box-y-center" style="width:45%">
              {{$t('fund.dcCode')}}
            </div>
            <div class="info ">
              {{$t('fund.enable')}}
            </div>

            <div class="half-x-line" />
          </div>
              <div v-for="(item, index) in list" class="dataClass">
                  <div class="row box box-space-bettwen">
                    <div class="name box box-y-center">
                      {{item.dcCode}}
                    </div>
                    <div class="info box-y-center">
                      <div class="num">
                        {{Number.parseFloat(item.availableAmount).toFixed(8)}}
                      </div>
                    </div>
                    <div class="half-x-line" />
                  </div>

                  <div class="gold-btn" style="display:block">
                    <div class="flex-x-space"><div @click="digitalCoinDeal(item,6)" class="transferButton"> {{$t('fund.bb2fund')}}</div><div @click="digitalCoinDeal(item,5)" class="transferButton"> {{$t('fund.fund2bb')}}</div></div>
                  </div>

             </div>
        </div>
      </div>
      <!--弹出窗口-->
      <div class="tip-bg" v-show="showdiv" @click="toggle()"></div>
      <div class="tip-box" v-show="showdiv"  style="display:block">
        <div class="tip-top" style="background:#ecf0f7;height:12vw;line-height:12vw;font-size:4.5vw;color:#1f405a;">
          <div></div>
          <div class="tip-close" @click="toggle()"><i class="iconfont">&#xe620;</i></div>
        </div>

        <div class="tip-con">
          <div class="content">
<div class="info flex-x-space">
              <h5>{{this.dcForm.dcCode}}</h5>
              <span style="font-size:3vw;">{{this.dcForm.tradeType==6?$t('fund.enableInVolume'):$t('fund.enableOutVolume')}}：{{this.availableAmount}}</span>
            </div>
            <h5 style="font-size:3vw;">{{this.dcForm.tradeType==6?$t('fund.inVolumeTip'):$t('fund.outVolumeTip')}}</h5>
            <div class="flex-x-space"><Iinput  class="box-col-flex" inputType="number" v-model="dcForm.amount" :placeholder="$t('fund.inputVolume')" /></div>
            <div class="half-x-line"></div>
            <h5 style="margin-top:2vw;"></h5>
            <div class="flex-x-space"><Iinput  class="box-col-flex" inputType="password" v-model="dcForm.payPassword" :placeholder="$t('fund.inputPassword')"  :maxlength="6" /></div>
            <div class="half-x-line"></div>
            <div style="padding-top:2vw;text-align:right"><span class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span></div>
          </div>
          <div  v-bind:class="{'login-btn':true,'active':(buyStatus === 0)}" @click="dealFundaccount()">{{$t('fund.confirm')}}</div>
        </div>
        <div class="tip-extra"></div>
      </div>
      <!--弹出窗口END-->

    </div>
    <error-status :status="errorStatus" />
  </div>
</template>
<script>
  import components from '@/components'
  import _ from 'lodash'
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState('basic', ['isExitTradePwd']),
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
      buyStatus() {
        // 大于可用数量或者没有设置交易密码,按钮变灰色
        if (parseFloat(this.dcForm.amount) > parseFloat(this.availableAmount) || this.isExitTradePwd === 0) {
          return 1
        }
        return 0
      },
    },
    components: {
      ...components,
    },
    name: 'FundAssert',
    data() {
      return {
        showdiv: false,
        list: null,
        worthList: [], // 净值列表
        profitMap: null, // 浮动阴亏map
        availableAmount: 0, // 可用数量
        listLoading: true,
        dcForm: {
          amount: null,
          dcCode: 0,
          tradeType: 0, // 1是币币转基金  2是基金转币币
          payPassword: '',
        },
      }
    },
    created() {
      // setTimeout(() => this.$Helper.emitAction('loading', { show: true }), 200)
      // this.$Helper.onAction('getFundAssert', () => {
      this.getFundAssert()
      // })
    },
    methods: {
      jumpToLog() {
        this.$Helper.jumpPage({name: 'FundAccountLog'}, this)
      },
      toggle() {
        this.showdiv = !this.showdiv
      },
      toPassword() {
        // 跳转重构之密码页面
        this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
        // }
      },
      digitalCoinDeal(item, type) {
        this.dcForm.dcCode = item.dcCode
        this.showdiv = true
        this.dcForm.tradeType = type
        this.dcForm.amount = null
        this.dcForm.payPassword = null
        if (type === 5) {
          this.availableAmount = item.availableAmount
        } else if (type === 6) {
          this.availableAmount = item.bbAvailableAmount
        }
      },
      // 是否正确的数字
      isZNum(num, floatNum = 5) {
        let reg = new RegExp(`(^[1-9]([0-9]+)?(.[0-9]{1,${floatNum}})?$)|(^[0-9].[0-9]{1,${floatNum}}$)`)
        return reg.test(num) && parseFloat(num) > 0
      },
      validate(needVeriCode = false) {
        if (!this.isZNum(this.dcForm.amount, 8)) {
          this.$Helper.emitAction('toast', {
            text: this.$t('fund.amount_tip'),
          })
          return false
        }
        if (this.dcForm.amount <= 0) {
          this.$Helper.emitAction('toast', {
            text: this.$t('fund.amount_tip'),
          })
          return false
        }
        if (Number.parseFloat(this.dcForm.amount) > Number.parseFloat(this.availableAmount)) {
          this.$Helper.emitAction('toast', {
            text: this.$t('fund.balance_not_enough'),
          })
          return false
        }
        if (this.dcForm.payPassword.length !== 6) {
          this.$Helper.emitAction('toast', {
            text: this.$t('fund.paypassword'),
          })
          return false
        }
        return true
      },
      // 账户转入转出
      dealFundaccount() {
        if (this.buyStatus === 1) return
        if (!this.validate(true)) return
        this.$Helper.ajax({
          url: '/app/fundaccount/fundAccountTrade.api',
          method: 'POST',
          params: this.dcForm,
        }).then(
          ({code, data, msg}) => {
            if (code !== 200) {
              this.$Helper.emitAction('toast', {
                text: msg,
              })
              return
            }
            this.$Helper.emitAction('toast', {
              text: this.$t('fund.op_success'),
            })
            //  location.reload();
            this.getFundAssert()
            this.showdiv = false
          },
        )
      },
      getFundAssert() {
        // let $this=this;
        this.$Helper.ajax({
          url: '/app/fundaccount/fundassert.api',
          method: 'POST',
        }).then(
          data => {
            this.list = _.get(data, 'data.assert')
            this.profitMap = _.get(data, 'data.profitMap')
            this.worthList = _.get(data, 'data.worthList')
            this.listLoading = false
          },
        )
      },
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    padding: 3vw 0vw;
    background: white;
    .card {
      color:#555;
      // background:#8dbaf9;
      box-shadow: 1px 1px 7px #ddd;
      border-radius: 4px;
      padding: 4vw;
      margin:0px 4vw;
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
        margin:0px 4vw;
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
  .card span.more{
    position:absolute;
    right:2vw;
    bottom:2vw;
    background:#646da9;
    display: inline-block;
    padding:1vw 3vw;
    border-radius: 4px;
    color:#fff;
  }
  .gold-btn{
    text-align:center;
   padding:2.2vw 0px;
    margin:0 2vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
   // background:#64acf5;
   // border-bottom: 1px solid #f5f5f5;
  }
  .gold-btn .flex-x-space div {
    width:50%;
    color:#fff;
    text-align: center;
padding:2vw 0;
  }
  .gold-btn .flex-x-space div:first-child{
    border-right:1px solid #fff;
    margin:0px 1vw;
  }
  .gray-box {
    background: #f9f9f9;
    height: 5px;
    line-height: 10px;
    //margin:0px 4vw;
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
  .tip-bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.6);
  }
  .tip-box{
    position:fixed;
    top:15%;
    right: 2vw;
    left:2vw;
    z-index: 100;
    text-align: center;
    background: #fff;
  }
  .tip-box .tip-con{
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
    vertical-align: middle;
    background: #fff;
    padding:2.5vw;
    position: relative;
  }



  .tip-extra{
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  .tip-con .content{
    padding:1vw 0 3vw 0;
  }
  .tip-con .content h5{
    font-size:4vw;
    padding: 2vw 0;
  }
  .tip-con .content input{
    width:100%;
    border:none;

    padding:5px;
    margin:5px 0px;

  }
  .tip-con .content .info{
    padding:3vw 0;


  }
  .tip-con .content .info h5{
    font-size:4.5vw;
  }
  .tip-con .content .info span{

    margin-left:3vw;
    color:#666;
  }
  .tip-close{
    position:absolute;
    top:0vw;
    right:1.5vw;
    z-index: 101;
  }
  .tip-close i{
    font-size:4.5vw;

  }
  .login-btn{
    text-align: center;
    height: 11vw;
    line-height: 11vw;
    width:100%;
    margin: 0 auto;
    background: #aaa;
    color: #fff;
    font-size: 4.2vw;
    font-weight: 600;
    transition: all .4s;
  }
  .login-btn.active{
    background:#646da9
  }
  span.link{
    color:#646da9
  }
  .dataClass{
    padding: 10px 15px;
    margin : 3vw;
    border: 1px solid #eee;
    border-radius: 1vw;
    box-shadow: 1px 1px 1px rgba(0,0,0,0.1);
  }
  .transferButton{
    background:#646da9;
    border-radius: 1vw;
    height:100%
  }
</style>
