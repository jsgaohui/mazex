<template lang="html">
  <div class="container overflow-y " v-if="item">
    <div class="layout">
      <div data-v-4dc07ef9="" class="container box box-row" img-set="static/favicon.ico" style="background:#f9f9fc;height:100%">
        <div data-v-4dc07ef9="" class="head box" style="padding:0px 5vw;">
          <div class="left box box-item"><i data-v-2b663b10="" class="iconfont" @click="back()"></i></div>
          <div data-v-4dc07ef9="" class="name box box-item box-col-flex">
            {{$t('at.setting')}}
          </div>
          <div data-v-4dc07ef9="" class="right box box-item">


          </div>
        </div>
        <div data-v-4dc07ef9="" class="half-x-line"></div>
        <!--跟单策略-->
        <div class="tactics-main" >
          <div class="list">
            <div class="hd box box-space-bettwen">
              <span>{{this.item.stragetyName}}</span><h3> {{$t('at.direction')}}: <span :class="{'color-sell':item.direction === 0,'color-buy':item.direction === 1}">{{item.direction === 0 ? $t('at.open'):$t('at.close')}}</span></h3>
            </div>
            <div class="half-x-line"></div>
            <div class="bd box box-space-bettwen">
              <div class="left box box-row box-col-8">
                <div class=" box box-space-bettwen"><label>{{$t('at.stragetyType')}}</label><span>{{this.item.stragetyTypeName}}</span></div>
                <div class=" box box-space-bettwen"><label>{{$t('at.symbol')}}&nbsp;</label>  <span>{{item.dcCode}}/{{item.marketCode}}</span></div>
                <div class=" box box-space-bettwen"><label>{{$t('at.weekRate')}} </label>  <span class="color-buy">{{Number.parseFloat(item.weekRate*100).toFixed(2)}}%</span></div>

              </div>
              <div class="right">
                <div class="k-line" @click.stop="showProfit(item.id)">
                  <i class="iconfont" style="font-size:12vw;">&#xe659;</i>
                </div>
              </div>
            </div>
          </div>
          <div class="tactics-set">
            <h4>{{$t('at.inputNum')}}</h4>
            <div class="input-block box box-space-bettwen"><input type="number" @change="changeAmount()"  :placeholder="'>'+item.minimum" autocomplete="off" v-model="form.tradeVolume" style="width:70%;"><span>{{item.direction === 0 ? item.marketCode:item.dcCode}}{{$t('at.follow')}}</span></div>
            <div style="padding-top:2vw;" class=" box ">{{$t('userlevel.balance')}}: &nbsp;<span class="blue">{{$Helper.format(this.availableAmount,4)}}</span>&nbsp;{{item.direction === 0 ? item.marketCode:item.dcCode}} &nbsp;&nbsp;&nbsp;<span class="blue">{{$Helper.format(this.ccashAssert,4)}}</span>&nbsp;CCASH</div>


            <div class="check-wrapper box box-x-left">
              <label role="checkbox" class="checkbox-wrapper" aria-checked="true">
                <!--<span aria-checked="mixed" :class="{'checkbox-input':true,'is-checked':agree.length === 0}" >-->
                <!--<span class="checkbox-inner"> </span>-->
                <input type="checkbox" aria-hidden="true" v-model="agree" value="1"  />
                <!--</span>-->
                <span class="checkbox__label" style="font-size:3.5vw;">{{$t('at.again')}}</span>
              </label>
              <div class="blue" style="font-size:3.5vw;">（{{$t('at.againTip')}}）</div>
            </div>
            <div class="text-info">
              <p>{{$t('at.tip1')}}：{{atCharge}} CCASH({{$t('at.tip2')}}{{$Helper.format(item.minimum,8)}}{{item.direction === 0 ? item.marketCode:item.dcCode}}{{$t('at.tip3')}}{{$Helper.format(item.buyChargeRate,8)}}CCASH)</p>
              <p>{{$t('at.tip4')}}{{item.withholdTime}}{{$t('at.tip5')}}</p>
            </div>
          </div>
        </div>
        <!--跟单策略 END-->
      </div>

      <!--底部按钮-->
      <div class="bottom-btn02 active" style="position:fixed; bottom:0;left:0;right:0;" @click="openRisk">{{$t('at.next')}}</div>
      <!--底部按钮 END-->
    </div>

    <div class="tip-bg" @click="showdiv=false"  v-show="showdiv"></div>
    <div class="tip-box" style="display:block" v-show="showdiv">
      <div class="tip-top">
        <div>{{$t('fund.inputPass')}}</div>
        <div class="tip-close"><i class="iconfont" @click="showdiv=false" ></i></div>
      </div>
      <div class="tip-con" style="padding:0">
        <div class="content pass-con">
          <div>
            <input class="pass-input" type="password" maxlength="6" v-model="form.payPassword" autocomplete="off">
          </div>
          <div style="padding-top:2vw;text-align:right"><span class="link" @click="toPassword()">{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</span></div>
        </div>
        <div class="box box-space-bettwen">
          <div class="btn btn-gray box-col-6" @click="showdiv=false">{{$t('basic.cancel')}}</div>
          <div class="btn box-col-6" @click="buyNow()" style="margin-left:4vw;">{{$t('basic.comfirm')}}</div>
        </div>
      </div>
    </div>

    <error-status :status="errorStatus" />
  </div>
</template>
<script>
  import components from '@/components'
  import {mapState} from 'vuex'
  import _ from 'lodash'
  export default {
    name: 'atDetail',
    computed: {
      ...mapState('basic', ['isExitTradePwd', 'uid']),
      errorStatus() {
        let item = this.item
        if (!this.uid) {
          return 'loginout'
        } else if (!item) {
          return 'error'
        }
        return null
      },
      atCharge() {
        let minimum = Number.parseFloat(this.item.minimum)
        let buyCharge = Number.parseFloat(this.item.buyChargeRate)
        let withholdtime = this.item.withholdTime
        if (minimum && buyCharge && withholdtime && this.form.tradeVolume) {
          return this.$Helper.format(this.$Helper.floor((Number.parseFloat(this.form.tradeVolume) * buyCharge * withholdtime) / minimum, 4), 8)
        }
        return 0
      },
    },
    watch: {
      agree(newVal, oldVal) {
        this.form.reinvest = this.agree.length > 0 ? 1 : 0
      },
    },
    components: {
      ...components,
    },
    data() {
      return {
        agree: [],
        ccashAssert: 0,
        showdiv: false,
        total: 0,
        listLoading: true,
        item: null,
        availableAmount: 0,
        form: {
          tradeVolume: '', // 跟随数量
          id: 0,
          reinvest: 0, // 是否复投
          payPassword: '', // 支付密码
        },
      }
    },
    created() {
      var id = this.$route.params.id
      if (id) {
        this.$Helper.setCache('AutoTradeDetailCache', id)
      } else {
        id = this.$Helper.getCache('AutoTradeDetailCache')
      }
      this.getAtDetail(id)
    },
    methods: {
      changeAmount() {
        // 如果数量大于可用数量
        if (Number.parseFloat(this.form.tradeVolume) < Number.parseFloat(this.item.minimum)) {
          this.form.tradeVolume = Number.parseFloat(this.item.minimum)
        }
      },
      back(buyFlag = false) {
        let params = {buyFlag: buyFlag}
        this.$Helper.jumpPage({ name: 'AutoTrade', params }, this)
      },
      toggle() {
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'Password',
            type: 'top',
            params: {
              callback: item => {
                this.form.payPassword = item
                this.buyNow()
              },
            },
          },
        )
      },
      toPassword() {
        // 跳转重构之密码页面
        this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
        // }
      },
      // 展开同意条款
      openRisk() {
        // if (!this.validate(false)) return
        let $this = this
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'AutoTradeRisk',
            type: 'right',
            params: {
              callback: item => {
                // $this.toggle()
                $this.showdiv = true
              },
            },
          },
        )
      },
      isZNum(num, floatNum = 5) {
        let reg = new RegExp(`(^[1-9]([0-9]+)?(.[0-9]{1,${floatNum}})?$)|(^[0-9].[0-9]{1,${floatNum}}$)`)
        return reg.test(num) && parseFloat(num) > 0
      },
      validate(verifyPwd = true) {
        if (!this.isZNum(this.form.tradeVolume, 8)) {
          this.$Helper.emitAction('toast', {
            text: this.$t('transaction.tradenum_error_toast'),
          })
          return false
        }
        if (parseFloat(this.form.tradeVolume) < this.minNum) {
          this.$Helper.emitAction('toast', {
            text: this.$t('at.less_than_minnum'),
          })
          return false
        }
        if (parseFloat(this.form.tradeVolume) > this.availableAmount) {
          this.$Helper.emitAction('toast', {
            text: this.$t('at.gt_than'),
          })
          return false
        }
        // 手续费余额
        if (this.atCharge > Number.parseFloat(this.ccashAssert)) {
          this.$Helper.emitAction('toast', {
            text: this.$t('at.gt_than'),
          })
          return false
        }
        if (verifyPwd) {
          if (this.form.payPassword.length !== 6) {
            this.$Helper.emitAction('toast', {
              text: this.$t('fund.paypassword'),
            })
            return false
          }
        }
        return true
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
      buyNow() {
        if (!this.validate()) return
        this.$Helper.ajax({
          url: '/app/autotrade/follow.api',
          method: 'POST',
          params: this.form,
        }).then(
          ({code, data, msg}) => {
            if (code !== 200) {
              this.$Helper.emitAction('toast', {
                text: msg,
              })
              return
            }
            if (code === 200) {
              this.back(true)
            }
            this.showdiv = false
          },
        )
      },
      query(dcCode) {
        this.$Helper.ajax({
          url: '/app/common/' + dcCode + '/assertByDccode.api',
          method: 'POST',
        }).then(
          data => {
            this.availableAmount = _.get(data, 'data')
            // this.availableAmount = Number.parseFloat(rspData).toFixed(8)
            // this.buyFundForm.fundId = item.fundId
            // this.showdiv = true
            // this.minNum = item.minBuyNum
            // this.buyFundForm.orderVolume = item.minBuyNum
          },
        )
      },
      getAtDetail(id) {
        // let $this=this;
        this.$Helper.ajax({
          url: '/app/autotrade/proDetail.api?orderId=' + id,
          method: 'POST',
        }).then(
          data => {
            this.item = _.get(data, 'data.data')
            this.ccashAssert = _.get(data, 'data.ccashAssert')
            // 0是做多  用的是市场币, 1是做空  用的是代币
            let dcCode = this.item.direction === 0 ? this.item.marketCode : this.item.dcCode
            this.form.id = this.item.id
            this.query(dcCode) // 查询币种余额
            // this.buyFundForm.orderVolume = this.item.minBuyNum
            // this.buyFundForm.fundId = this.item.id
            // this.dcCode = this.item.dcCode
            // this.minNum = this.item.minBuyNum
            this.listLoading = false
          },
        )
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');
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

  input:-webkit-autofill{
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    -webkit-text-fill-color: #333;
  }
</style>
