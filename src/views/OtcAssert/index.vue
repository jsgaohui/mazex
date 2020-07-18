<template lang="html">
  <!--跟单账户-->
  <div class="order-container box box-row">
    <Quotation ref="quotation"></Quotation>
    <div class="overflow-y"  v-if="getQuotation()">

        <div class="otc-asset-con overflow-y">
          <div class="otc-asset-top">
            <div class="txt">
              <!--<p>{{$t('otc.account')}}</p>-->
              <span >{{$t('myfund.my_fund')}} </span>
              <h3  v-if="list">{{getQuotation().getTotalAsset(this.list,false)}}</h3>
              <span v-if="list">≈ {{getQuotation().getTotalAsset(this.list)}}</span>
            </div>
            <div class="lookbtn" @click="showLog">{{$t('otc.fbLog')}}</div>
          </div>
          <div class="otc-seach issue-form">
            <div class="input-block">
              <label>{{$t('otc.currency')}}</label>
              <div class="rel" style="width:90%">
                <input type="text" class="input-t" v-model="text" :placeholder="$t('otc.queryDcCode')" style="font-size:4vw;">
              </div>
            </div>
          </div>
          <div class="asset-list" v-for="(item, index) in selectList" >
            <div class="asset-top box box-space-bettwen">
              <div class="txt box box-x-left">
                <!--<label class="icon-bg">-->
                 <!--<i class="iconfont">&#xe674;</i>-->
              <!--</label>-->
                <b>{{item.dcCode}}</b></div>
              <div class="r-btn"><span  @click="digitalCoinDeal(item,5)">{{$t('fund.turn_in')}}</span><span  @click="digitalCoinDeal(item,4)" style="background:#bfcadd;">{{$t('fund.turn_out')}}</span></div>
            </div>
            <div class="asset-con">
              <div class="box box-space-bettwen"><span>{{$t('otc.available')}}</span>
                 <span>{{$Helper.format(item.availableAmount,8)}} ≈ {{$Helper.format(getQuotation().getRealTimePrice(item.dcCode)*item.availableAmount,2)}} {{getQuotation().getCurrency() }}</span>

              </div>
              <div class="box box-space-bettwen"><span>{{$t('otc.freeze')}}</span><span>{{$Helper.format(item.freezeAmount,8)}} ≈ {{$Helper.format(getQuotation().getRealTimePrice(item.dcCode)*item.freezeAmount,2)}} {{getQuotation().getCurrency() }}</span></div>
            </div>
          </div>
        </div>


    </div>
    <!--弹出窗口-->
    <div class="tip-bg" v-show="showdiv" @click="toggle()" style="z-index: 9999"></div>
    <div class="tip-box"   v-show="showdiv" style="display:block;z-index: 10000">
      <div class="tip-top">
        <div></div>
        <div class="tip-close" @click="toggle()"><i class="iconfont">&#xe620;</i></div>
      </div>

      <div class="tip-con">
        <div class="content">
          <div class="info flex-x-space">
            <h5>{{this.dcForm.dcCode}}</h5>
            <span style="font-size:3vw;">{{Number.parseInt(this.dcForm.changeType)===5?$t('fund.enableInVolume'):$t('fund.enableOutVolume')}}：{{this.availableAmount}}</span>
          </div>
          <h5 style="font-size:3vw;">{{Number.parseInt(this.dcForm.changeType)===5?$t('fund.inVolumeTip'):$t('fund.outVolumeTip')}}</h5>
          <div class="flex-x-space"><Iinput  class="box-col-flex" inputType="number" v-model="dcForm.changeAmount" :placeholder="$t('fund.inputVolume')" /></div>
          <div class="half-x-line"></div>
          <h5 style="margin-top:2vw;"></h5>
          <div class="flex-x-space"><Iinput  class="box-col-flex" inputType="password" v-model="dcForm.payPassword" :placeholder="$t('fund.inputPassword')"  :maxlength="6" /></div>
          <div class="half-x-line"></div>
          <div style="padding-top:2vw;text-align:right"><span class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span></div>
        </div>
        <div  class="login-btn active" v-if="buyStatus" @click="dealOtcaccount()">{{$t('fund.confirm')}}</div>
        <div  class="login-btn" v-else>{{$t('fund.confirm')}}</div>
      </div>
      <div class="tip-extra"></div>
    </div>
    <!--弹出窗口END-->
    <error-status :status="errorStatus" />
  </div>
</template>
<script>
  import Components from '@/components/'
  import _ from 'lodash'
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState('basic', ['uid', 'isExitTradePwd']),
      selectList() {
        if (this.text) return this.list.filter(item => item.dcCode.indexOf(this.text.toUpperCase()) !== -1)
        return this.list
      },
      errorStatus() {
        let list = this.list
        if (!this.uid) {
          return 'loginout'
        } else if (!list) {
          return 'empty'
        } else if (list.length === 0) {
          return 'empty'
        } else if (list.length > 0) {
          return null
        }
      },
      buyStatus() {
        // 大于可用数量或者没有设置交易密码,按钮变灰色
        if (!this.dcForm.changeAmount || !this.dcForm.payPassword || Number.parseFloat(this.dcForm.changeAmount) > Number.parseFloat(this.availableAmount) || this.isExitTradePwd === 0) {
          return false
        }
        return true
      },
    },
    components: {
      ...Components,
    },
    name: 'OtcAssert',
    data() {
      return {
        text: null, // 过滤代币text
        showdiv: false,
        list: null, // 资产列表
        availableAmount: 0, // 可用数量
        listLoading: true,
        dcForm: {
          changeAmount: null,
          dcCode: '',
          changeType: 0, //  1.币币转法币(转入);2.法币转币币(转出);
          payPassword: null,
        },
      }
    },
    created() {
      this.getOtcAssert()
    },
    methods: {
      getQuotation() {
        return this.$refs.quotation
      },
      showLog() {
        this.$Helper.dialog('OtcLog', 'right', null, this.$store)
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
        this.dcForm.changeType = type
        this.dcForm.changeAmount = null
        this.dcForm.payPassword = null
        if (type === 4) {
          this.availableAmount = item.availableAmount
        } else if (type === 5) {
          this.availableAmount = item.bbAvailableAmount
        }
      },

      validate() {
        if (!this.$Helper.isZNum(this.dcForm.changeAmount, 8) || this.dcForm.changeAmount <= 0) {
          return {flag: false, tips: this.$t('fund.amount_tip')}
        }
        if (Number.parseFloat(this.dcForm.changeAmount) > Number.parseFloat(this.availableAmount)) {
          return {flag: false, tips: this.$t('fund.balance_not_enough')}
        }
        if (this.dcForm.payPassword.length !== 6) {
          return {flag: false, tips: this.$t('fund.paypassword')}
        }
        return {flag: true}
      },
      // 法币账户和币币账户转入转出   5.币币转法币;4.法币转币币
      dealOtcaccount() {
        let result = this.validate()
        if (!result.flag) {
          this.$Helper.emitAction('toast', {
            text: result.tips,
            type: 'up',
          })
          return
        }
        let $this = this
        this.$Helper.ajax({
          url: '/app/otc/assetTransfer.api',
          method: 'POST',
          params: this.dcForm,
        }).then(
          ({code, data, msg}) => {
            this.showdiv = false
            if (this.$Helper.dealHttpCode(code, msg)) {
              this.$Helper.emitAction('toast', {
                text: this.$t('fund.op_success'),
              })
              setTimeout(function() {
                $this.getOtcAssert()
              }, 500)
            }
          },
        )
      },
      getOtcAssert() {
        this.$Helper.ajax({
          url: '/app/otc/getMyAsset.api',
          method: 'POST',
        }).then(
          ({code, msg, data}) => {
            if (this.$Helper.dealHttpCode(code, msg)) {
              this.list = _.get(data, 'fbAccountAssertList') // 可用资产列表
            }
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

  .router-view{
    background: #fff;
  }
  .card span.more{
    position:absolute;
    right:2vw;
    bottom:2vw;
    background:#646da9;
    display: inline-block;
    padding:5px 10px;
    border-radius: 4px;
    color:#fff;
  }
  .gold-btn{
    text-align:center;
    line-height:30px;
   // padding:2.2vw 0px;
    margin:0 4vw;
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

  }
  .gold-btn .flex-x-space div:first-child{
    border-right:1px solid #fff;
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
    z-index: 9999;
    width:100%;
    height:100%;
    background: rgba(0, 0, 0, 0.6);
    transition: all 400ms linear;
  }
  .tip-box{
    position:fixed;
    top:15%;
    right: 2vw;
    left:2vw;
    z-index: 10000;
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
    top:0;
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
  .tip-top{
    background:#ecf0f7;
    height:12vw;
    line-height:12vw;
    font-size:4.5vw;
    color:#1f405a;
  }
  </style>

