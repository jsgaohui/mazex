<template lang="html">
  <div class="container overflow-y " v-if="item">
  <div class="tactics-con">
    <div class="flex-x-space fund-title"><h2>{{item.strategyType===1?$t('fund.steady'):$t('fund.aggressive')}}-{{item.fundName}}</h2>
      <span v-if="item.status==1">{{$t('fund.wait')}}</span>
      <span  v-else-if="item.status==2">{{$t('fund.collect')}}</span>
      <span  v-else-if="item.status==3">{{$t('fund.collectdone')}}</span>
      <span  v-else-if="item.status==4">{{$t('fund.run')}}</span>
      <span  v-else-if="item.status==5">{{$t('fund.clearing')}}</span>
      <span  v-else-if="item.status==6">{{$t('fund.cleared')}}</span>
    </div>
    <div class="gray-box"></div>
    <div class="info">
      <div><label>{{$t('fund.expectProfit')}}</label><span>{{Number.parseFloat(item.expectProfit*100).toFixed(2)}}%</span></div>
      <div><label>{{$t('fund.worth')}}</label><span>{{item.currOneWorth?item.currOneWorth:"--"}}</span></div>
      <div><label>{{$t('fund.lockday')}}</label><span>{{item.lockDate}}&nbsp;{{$t('fund.day')}}</span></div>
      <div><label>{{$t('fund.investTarget')}}</label><span>{{item.investTarget===1?$t('fund.spot'):item.investTarget===2?$t('fund.futures'):$t('fund.options')}}</span></div>
      <div><label>{{$t('fund.range')}}</label><span>{{item.dcCode}}</span></div>
      <div><label>{{$t('fund.investment')}}</label><span>{{item.minBuyNum}}&nbsp;{{item.dcCode}}</span></div>
      <!--<div><label>{{$t('fund.rate')}}</label><span>{{Number.parseFloat(item.subscripeRate*100).toFixed(2)}}%</span></div>-->
      <div><label>{{$t('fund.distribution')}}</label><span>{{Number.parseFloat(item.proportion*100).toFixed(2)}}%</span></div>
      <div class="flex-x-top"><label v-if="item.status===1">{{$t('fund.deallinebegin')}}</label>
        <label v-else-if="item.status===2||item.status===3">{{$t('fund.dealline')}}</label>
        <label v-else-if="item.status===4||item.status===5">{{$t('fund.cycleEndtime')}}</label>
        <label  v-else>{{$t('fund.cleartime')}}</label>
        <span v-if="item.status===1">{{item.buyStarttime}}（GMT+8）</span>
                <span v-else-if="item.status===2||item.status===3">{{item.buyEndtime}}（GMT+8）</span>
                <span v-else-if="item.status===4||item.status===5">{{item.cycleEndtime}}（GMT+8）</span>
                <span  v-else>{{item.clearTime}}(GMT+8)</span></div>
      <div class="flex-x-top"><label>{{$t('fund.locktime')}}</label><span>{{item.cycleStarttime}}（GMT+8）<br>{{item.cycleEndtime}}（GMT+8）</span></div>
      <div><label>{{$t('fund.cleartime')}}</label><span>{{item.clearTime?item.clearTime:item.cycleEndtime}}（GMT+8）</span></div>
      <div><label>{{$t('fund.expectScale')}}</label><span>{{item.expectScale}}&nbsp;{{item.dcCode}}</span></div>
    </div>
    <div class="gray-box"></div>
    <div class="introduce">
      <h4>{{$t('fund.manageintro')}}</h4>
      <p>{{item.manageintro}}</p>
      <h4>{{$t('fund.teamintro')}}</h4>
      <p>{{item.team}}</p>
      <h4>{{$t('fund.manageidea')}}</h4>
      <p>{{item.idea}}</p>
    </div>
  </div>
    <div class="bottom"><div v-bind:class="{'login-btn':true,'box':true,'box-item':true,'active':(item.status === 2) }"  @click="toggleDialog(item)">{{$t('fund.buyNow')}}</div></div>
    <!--弹出窗口-->
    <div class="tip-bg" v-show="showdiv" @click="toggle()"></div>
    <div class="tip-box" v-show="showdiv" style="display: block">
      <div class="tip-top">
        <div></div>
        <div class="tip-close" @click="toggle()"><i class="iconfont">&#xe620;</i></div>
      </div>

      <div class="tip-con">
        <div class="content">
          <h5 class="flex-x-space" style="margin-top:3vw;">{{$t('fund.buyVolume')}}<span>{{$t('fund.fund_balance')}}&nbsp;&nbsp;{{this.availableAmount}}&nbsp;{{this.item.dcCode}}</span></h5>
          <div class="flex-x-space"><Iinput  class="box-col-flex" inputType="number" v-model="buyFundForm.orderVolume" :placeholder="$t('fund.inputVolume')" maxlength="15" /><span class="add">{{item.minBuyNum}}&nbsp;{{item.dcCode}}&nbsp;{{$t('fund.qi')}}</span></div>
           <div class="half-x-line"></div>
          <div class="info flex-x-space">
            <!--<label>{{$t('fund.rate')}}&nbsp;</label><span class="error-color">{{Number.parseFloat(item.subscripeRate*100).toFixed(2)}}%</span>-->
            <div class="left">&nbsp;</div>
            <div class="right"><span class="link" @click="toAssert()">{{$t('fund.trans_in')}}</span></div>
          </div>
          <h5>{{$t('fund.payPassword')}}</h5>
          <div class="flex-x-space"><Iinput  class="box-col-flex" inputType="password" v-model="buyFundForm.payPassword" :placeholder="$t('fund.inputPassword')"  :maxlength="6"/></div>
          <div class="half-x-line"></div>
          <div style="padding-top:2vw;text-align:right"><span class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span></div>
        </div>
        <div  v-bind:class="{'login-btn':true,'active':(buyStatus === 0)}" @click="buyNow()">{{$t('fund.confirm')}}</div>
      </div>
      <div class="tip-extra"></div>
    </div>
  </div>
</template>
<script>
  import components from '@/components'
  import {mapState} from 'vuex'
  import _ from 'lodash'
  export default {
    name: 'fundDetail',
    computed: {
      ...mapState('basic', ['isExitTradePwd']),
      buyStatus() {
        // 大于可用数量或者没有设置交易密码,按钮变灰色
        if (!this.buyFundForm.orderVolume) {
          return 1
        }
        if (parseFloat(this.buyFundForm.orderVolume) > parseFloat(this.availableAmount) || this.isExitTradePwd === 0) {
          return 1
        }
        return 0
      },
    },
    components: {
      ...components,
    },
    data() {
      return {
        showdiv: false,
        maxLength: 6,
        total: 0,
        listLoading: true,
        item: null,
        minNum: 0,
        availableAmount: 0,
        dcCode: '',
        buyFundForm: {
          orderVolume: 0,
          fundId: 0,
          payPassword: '',
        },
      }
    },
    created() {
      var id = this.$route.params.id
      if (id) {
        this.$Helper.setCache('FundDetailCache', id)
      } else {
        id = this.$Helper.getCache('FundDetailCache')
      }
      this.getFundDetail(id)
    },
    methods: {
      toggle() {
        this.showdiv = !this.showdiv
      },
      toAssert() {
        // 跳转详情页面
        this.$Helper.jumpPage({ name: 'FundAssert' }, this)
        // }
      },
      toPassword() {
        // 跳转重构之密码页面
        this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
        // }
      },
      isZNum(num, floatNum = 5) {
        let reg = new RegExp(`(^[1-9]([0-9]+)?(.[0-9]{1,${floatNum}})?$)|(^[0-9].[0-9]{1,${floatNum}}$)`)
        return reg.test(num) && parseFloat(num) > 0
      },
      validate(needVeriCode = false) {
        if (!this.isZNum(this.buyFundForm.orderVolume, 8)) {
          this.$Helper.emitAction('toast', {
            text: this.$t('transaction.tradenum_error_toast'),
          })
          return false
        }
        if (parseFloat(this.buyFundForm.orderVolume) < this.minNum) {
          this.$Helper.emitAction('toast', {
            text: this.$t('fund.less_than_minnum'),
          })
          return false
        }
        if (this.buyFundForm.payPassword.length !== 6) {
          this.$Helper.emitAction('toast', {
            text: this.$t('fund.paypassword'),
          })
          return false
        }
        return true
      },
      buyNow() {
        if (this.buyStatus === 1) return
        if (!this.validate(true)) return
        this.$Helper.ajax({
          url: '/app/fund/buyfund.api',
          method: 'POST',
          params: this.buyFundForm,
        }).then(
          ({code, data, msg}) => {
            if (code !== 200) {
              this.$Helper.emitAction('toast', {
                text: msg,
              })
              return
            }
            this.showdiv = false
            this.$Helper.emitAction('toast', {
              text: this.$t('fund.buy_success'),
            })
          },
        )
      },
      toggleDialog(item) {
        // let $this=this;
        if (this.item.status !== 2) return
        this.$Helper.ajax({
          url: '/app/fundaccount/' + item.dcCode + '/fundassertByDccode.api',
          method: 'POST',
        }).then(
          data => {
            let rspData = _.get(data, 'data')
            this.availableAmount = Number.parseFloat(rspData).toFixed(8)
            this.buyFundForm.fundId = item.fundId
            this.showdiv = true
            this.minNum = item.minBuyNum
            this.buyFundForm.orderVolume = item.minBuyNum
          },
        )
      },
      getFundDetail(id) {
        // let $this=this;
        this.$Helper.ajax({
          url: '/app/fund/funddetail.api',
          method: 'POST',
          params: { 'id': id },
        }).then(
          data => {
            this.item = _.get(data, 'data')
            if (this.item.fundManageInfo) {
              var jsonOb = JSON.parse(this.item.fundManageInfo)
              this.$set(this.item, 'manageintro', jsonOb.manageintro)
              this.$set(this.item, 'team', jsonOb.team)
              this.$set(this.item, 'idea', jsonOb.idea)
            }
            this.buyFundForm.orderVolume = this.item.minBuyNum
            this.buyFundForm.fundId = this.item.id
            this.dcCode = this.item.dcCode
            this.minNum = this.item.minBuyNum
            this.listLoading = false
          },
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');
  .top-container {
    // border-bottom: 1px solid #eee;
    position:fixed;
    top:0px;
    left:0px;
    right:0px;
    background: #646da9;
    height: 12vw;
    line-height: 12vw;
    // background: linear-gradient(to right, #2e2b36, #141318);
    z-index: 1;
    &>div{
      color:#fff;
      width: 12vw;
      font-size: 4.4vw;
      font-weight: 600;
      i{
        font-size: 4.5vw;
        font-weight: 300;
        color: #fff;
      }
    }
  }
  .top-container .iconfont{
    color:#fff;
    margin-left:15px;
  }
  .router-view{
    top:12vw;
  }
  .flex-x-space{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .tactics-con{
    background:#fff;
  }
  .tactics-con .info div.flex-x-top{
    display:flex;
    justify-content: space-between;
    align-items:flex-start;
  }
  .fund-title{
    padding:10px 15px;
    border-bottom: 2vw solid rgb(249, 249, 249);
  }
  .fund-title h2{
    font-size:16px;
    color:#646da9
  }
  .tactics-con{

    line-height:24px;
  }
  .tactics-con .info{
    border-top:1px solid #f5f5f5;
    border-bottom: 2vw solid rgb(249, 249, 249);
  }
  .tactics-con .info div{
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-bottom:1px solid #f5f5f5;
    padding:8px 0px;
    margin-left:15px;
    padding-right:15px;
  }
  .tactics-con .info div label{
    width:35%;
  }
  .introduce{
    border-top:1px solid #f5f5f5;
    padding:0px 15px;
    padding-bottom:80px;
  }
  .introduce h4{
    font-size:14px;
    color:#646da9;
    padding-top:10px;
  }

  .introduce p{
    border-bottom:1px solid #f5f5f5;
    padding-bottom:10px;
    color:#999;
  }
  .footer-box{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    background:#fff;
    padding:15px;
  }
  .bottom{
    position:fixed;
    left:0px;
    right:0px;
    bottom:0px;
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
  .tip-top{
    background:#ecf0f7;
    height:12vw;
    line-height:12vw;
    font-size:4.5vw;
    color:#1f405a;
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
  .tip-con .content{
    padding:1vw 0 3vw 0;
  }
  .tip-con .content h5{
    font-size:4vw;
    padding: 2vw 0;
  }
  .tip-con .content h5 span{
    font-size:3.4vw;
    color:#666;
    font-weight: normal;
  }
  .tip-con .content input{
    width:100%;
    border:none;
    padding:5px;
    margin:5px 0px;

  }
  .tip-con .content .info{
    margin:6px 0px;
    margin-bottom:20px;
    font-size:14px;
    color:#ccc;
  }
  .tip-con .content .info .left{
    color:#333;
  }
  .tip-extra{
    display: inline-block;
    height: 100%;
    vertical-align: middle;
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
  .tip-close{
    position:absolute;
    top:0vw;
    right:1.5vw;
    z-index: 101;
  }
  .tip-close i{
    font-size:4.5vw;

  }
 span.link{
    color:#646da9
  }
  .login-btn.off-btn{
    background: #aaa;
  }
  span.add{
    background:#aed6ff;
    color:#fff;
    padding:1vw 2vw;
    border-radius: 0.5vw;
  }
  </style>

