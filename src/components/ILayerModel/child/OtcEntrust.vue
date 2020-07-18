<template lang='html'>
  <div class='layout'  style='width:100%'>
    <Quotation ref="quotation"></Quotation>
    <!--法币交易-->
    <div class='container box box-row ' style='width:100%;height:100%' img-set='static/favicon.ico'  v-if="getQuotation()">
      <div class='head box'>
        <div class='left box box-item'><i class='iconfont' @click='closeDialog'></i></div>
        <div class='name box box-item box-col-flex' @click='showSymbolSelect'>
          <span>{{symbol.name}}&nbsp;<i class='iconfont' style='color:#646da9' >&#xe676;</i></span>
        </div>
        <div class='right box box-item'>

        </div>
      </div>
      <div class='half-x-line'></div>
      <div class='issue-con overflow-y' style="height:150vw;">
        <div class='issue-top'>
          <div class='txt'><h5>{{$t('otc.realTimePrice')}}：<em>{{$Helper.format(getQuotation().getRealTimePrice(symbol.dcCode),2)}}&nbsp;{{entrustForm.currencySymbol}}</em></h5>
            <span style="text-align: right">{{entrustForm.direction===2  ? $t('otc.sellEvaluate'):$t('otc.buyEvaluate')}}：{{$Helper.format(getQuotation().getRealTimePrice(symbol.dcCode),2)}}&nbsp;{{entrustForm.currencySymbol}}</span></div>
          <div class='info box box-x-left'><span>{{$t('otc.upsAndDowns')}}：
               <em class='color-sell' v-if='getQuotation().getUpsAndDowns(symbol.dcCode) < 0'>{{getQuotation().getUpsAndDowns(symbol.dcCode)}}%↓</em>
                <em class='color-buy' v-else>{{getQuotation().getUpsAndDowns(symbol.dcCode)}}&nbsp;%↑</em>
            </span>
            <span>{{$t('otc.highestPrice')}}：{{getQuotation().getHighestPrice(symbol.dcCode)}}&nbsp;{{entrustForm.currencySymbol}}</span>
            <span>{{$t('otc.floorPrice')}}：{{getQuotation().getLowestPrice(symbol.dcCode)}}&nbsp;{{entrustForm.currencySymbol}}</span>
          </div>
        </div>
        <div class='issue-form'>
          <div class='txt'>{{$t('otc.amount')}}&nbsp;{{entrustForm.currencySymbol}}</div>
          <div class='input-block'><label>{{$t('otc.entrustDirection')}}</label>
            <div class='box box-x-left' style='width:80%;align-items: center;'>
              <span :class="{'pay-btn':true,'active':isSell()}" @click="entrustForm.direction=2">{{$t('otc.sell')}}</span>
              <span :class="{'pay-btn':true,'active':!isSell()}" @click="entrustForm.direction=1">{{$t('otc.buy')}}</span>
            </div>
          </div>
          <div class='input-block'><label>{{$t('otc.priceType')}}</label>
            <div class='box box-x-left' style='width:80%;align-items: center;'>
               <span :class="{'pay-btn':true,'active':!isFloor()}" @click="changeFloowMarket">{{$t('otc.fixedPricing')}}</span>
                <span :class="{'pay-btn':true,'active':isFloor()}" @click="changeFloowMarket">{{$t('otc.floatingPricing')}}</span>

            </div>
          </div>
          <template v-if='isFloor()'>
            <div class='input-block'><label>{{$t('otc.spreadRange')}}</label><input type='number' class='input-t'  v-model='entrustForm.spread'  @change="spreadChange()"/></div>
            <div class='input-block'><label>{{$t('otc.transactionDeviation')}}</label><input type='number' class='input-t' v-model='entrustForm.offset' @change="offsetChange()" /></div>
          </template>
          <template v-else>
            <div class='input-block'><label>{{$t('otc.amount')}}</label><input type='number' class='input-t' v-model='entrustForm.initOrderPrice'  @change="priceChange()"/></div>
          </template>

          <div class='txt box box-space-bettwen'><div>{{$t('otc.tradeLimit')}}<span v-if="entrustForm.direction===2">({{$t('userlevel.balance')}} {{Number.parseFloat(assetMap[entrustForm.dcCode]).toFixed(2)}}&nbsp;{{entrustForm.dcCode}})</span></div>
            <div style="font-weight: normal" @click="toAssert()">{{$t('otc.transferToMore')}}</div></div>
          <div class='input-block'><label>{{$t('otc.numberOfTransactions')}}</label><input type='number' class='input-t'  v-model='entrustForm.orderVolume' /></div>
          <div class='input-block'><label>{{$t('otc.minimumSingleLimit')}}</label><input type='number' class='input-t'  style='width:72%' v-model='entrustForm.limitMin' @change="minChange()" /></div>
          <div class='input-block'><label>{{$t('otc.maximumSingleLimit')}}</label><div class='rel' style='width:72%'><input type='number' class='input-t' v-model='entrustForm.limitMax'  @change="maxChange()" />
            <span  @click='setLimitMax'>
             <i class='iconfont' style='color:#fff;'></i></span></div></div>


          <div class='input-block'><label>{{ isSell() ? $t('payment.paymentMethod'):$t('otc.mPayMethod') }}</label>
            <div class='box box-x-left' style='width:80%;align-items: center;'>
                 <template v-if='myPayMethod'>
                     <!--<span :class="{'pay-btn':true,'active':p.selected}"  @click="choosePayType(p)" v-for='(p,index) in myPayMethod'>{{p.paymentTypeName}}</span>-->

                   <div :class="'pay-icon '+ p.cssName+ '-bg'" v-for='(p,index) in myPayMethod'>
                     <input    :id="'a'+index" :value="p.paymentTypeId" v-model="entrustForm.payTypes" type="checkbox" class="small online-icon" >
                     <label :for="'a'+index"><i :class="'iconfont icon-'+p.cssName"></i></label>
                   </div>

                 </template>

              <em @click='showAddPayment()'><template  v-if='myPayMethod.length < 1'>({{$t('payment.addPayMethod')}})</template><i class='iconfont' style='font-size:7vw;color:#d0d9de;margin-left:5vw'>&#xe67f;</i></em>
             </div>
          </div>
          <div class='input-block'><label>{{$t('fund.payPassword')}}</label><div class='rel' style='width:80%'><input type='password' class='input-t' :disabled='isExitTradePwd === 0 ? true:false' v-model='entrustForm.payPassword' maxLength="6"/><em class='time'></em></div></div>
          <!--<div class="check-wrapper">-->
            <!--<label role="checkbox" class="checkbox-wrapper is-checked" aria-checked="true">-->
                          <!--<span aria-checked="mixed" class="checkbox-input is-checked">-->
                            <!--&lt;!&ndash;<span class="checkbox-inner"></span>&ndash;&gt;-->
                            <!--<input type="checkbox" aria-hidden="true" v-model="protocol">-->
                          <!--</span>-->
              <!--<span class="checkbox__label">{{$t('otc.agreedToTheTransaction')}}</span>-->
              <!--<span class="checkbox__label" @click.prevent="showDiv=true">{{$t('otc.legalCurrencyTradingInstructions')}}</span>-->
            <!--</label>-->

          <!--</div>-->
          <div class='check-wrapper box box-space-bettwen' style='padding-top:0;'>
            <label role='checkbox' class='checkbox-wrapper is-checked' aria-checked='true'>
              <span aria-checked='mixed' class='checkbox-input is-checked'>
                  <input type="checkbox" aria-hidden="true" v-model="protocol">
              </span>
              <span class="checkbox__label">{{$t('otc.agreedToTheTransaction')}}</span>
              <span class="checkbox__label" @click.prevent="showDiv=true">{{$t('otc.legalCurrencyTradingInstructions')}}</span>
            </label>
            <div style='font-size:3.5vw; text-align: right;' @click="toPassword()" >{{  this.isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</div>
          </div>
        </div>


      </div>
      <!--底部按钮-->
      <div class="otc-btn">
      <div class='bottom-btn02 active' v-if="protocol.length === 1"  @click='publishOrder'>{{$t('otc.confirmRelease')}}</div>
      <div class='bottom-btn02' v-else  >{{$t('otc.confirmRelease')}}</div>
      </div>
    </div>
    <!--法币交易END-->
    <!--交易须知--->
    <div class="tip-bg" @click="showDiv=!showDiv"  v-show="showDiv"></div>
    <div class="tip-box "  style="display:block;top:10%;"  v-show="showDiv" >
      <div class="tip-top" style="background:#ecf0f7;height:12vw;line-height:12vw;font-size:4.5vw;color:#1f405a;">
        <div>{{$t('otc.tradingInstructionsTitle')}}</div>
        <div class="tip-close" ><i class="iconfont" @click="showDiv=!showDiv">&#xe620;</i></div>
      </div>

      <div class="tip-con" style="padding:0;">
        <div style="padding:4vw 9vw;font-size:3.6vw;line-height:7vw;color:#1f405a;text-align: left;height:100vw" class="overflow-y">
          <p>
            <template v-for="k in 13">
              {{$t('otc.tradingInstructionsDes'+k)}}<br/>
            </template>
          </p>

        </div>
        <div class="btn box box-space-bettwen" style="background:none">
          <div style="width:50%;background:#ecf0f7;color:#646da9" @click="disAgree()" >{{$t('otc.disagree')}}</div>
          <div class="bottom-btn02 active" style="width:50%;" @click="agree()" >{{$t('otc.agree')}}</div>
        </div>
      </div>
    </div>
      <!--购买END-->
    <error-status :status='errorStatus' />
    </div>
</template>
<script>
import {mapState} from 'vuex'
import ErrorStatus from '@/components/ErrorStatus'
import Quotation from '@/components/Quotation'
import _ from 'lodash'
export default {
  components: {
    ErrorStatus,
    Quotation,
  },
  data() {
    return {
      showDiv: false,
      protocol: [null],
      symbol: '', // 当前交易对
      fbTradeCoinList: [], // 可以发布委托的币币订单列表
      currencySymbol: [], // 当前支持的法币
      assetMap: '', // 币币的可用资产
      myPayMethod: [], // 我的收款方式
      cloneForm: null,
      entrustForm: {
        dcCode: '', // 代币编码
        direction: 2, // 买卖方向（1买入；2卖出）
        currencySymbol: '', // 币种符号
        initOrderPrice: null, // 发布价
        currOrderPrice: null, // 当前价（行情+点差）
        priceFloowMarket: 0, // 是否跟随行情变动(0:不跟随，1:跟随)
        spread: null, // 行情价点差
        offset: null, // 允许成交的偏差范围值
        orderVolume: null, // 挂牌数量
        limitMin: null, // 单次最小配对数量
        limitMax: null, // 单次最大配对数量
        payTypes: [], // 支付方式
        payPassword: '', // 支付密码
      },
    }
  },
  computed: {
    ...mapState('basic', ['uid', 'isValid', 'isMerchant', 'isExitTradePwd']),
    merchant() {
      return this.isValid === 2 && this.isMerchant
    },
    coinList() {
      // 初始化交易对列表
      let coinList = []
      _.map(this.fbTradeCoinList, dcCode => {
        _.map(this.currencySymbol, currency => {
          coinList.push({dcCode: dcCode, currency: currency, name: dcCode + '/' + currency})
        })
      })
      return coinList
    },
    errorStatus() {
      let flag = this.fbTradeCoinList.length < 1 || this.currencySymbol.length < 1
      if (!this.uid) {
        return 'loginout'
      } else if (flag) {
        return 'default'
      }
      return 'default'
    },
  },
  watch: {
    // 动态监听当前的交易对   自动拆分成代币和法币
    symbol(newValue, oldValue) {
      let arr = newValue.name.split('/')
      this.entrustForm.currencySymbol = arr[1]
      this.entrustForm.dcCode = arr[0]
      this.getQuotation().setCurrency(this.entrustForm.currencySymbol)
    },
  },
  methods: {
    spreadChange() {
      this.entrustForm.spread = this.$Helper.floor(this.entrustForm.spread, 2)
    },
    offsetChange(data) {
      this.entrustForm.offset = this.$Helper.floor(this.entrustForm.offset, 2)
    },
    priceChange() {
      this.entrustForm.initOrderPrice = this.$Helper.floor(this.entrustForm.initOrderPrice, 2)
    },
    minChange() {
      this.entrustForm.limitMin = this.$Helper.floor(this.entrustForm.limitMin, 2)
    },
    maxChange() {
      this.entrustForm.limitMax = this.$Helper.floor(this.entrustForm.limitMax, 2)
    },
    agree() {
      this.showDiv = !this.showDiv
      this.protocol = [null]
    },
    disAgree() {
      this.showDiv = !this.showDiv
      this.protocol = []
    },
    toAssert() {
      this.$Helper.jumpPage({name: 'OtcAssert'}, this)
    },
    toPassword() {
      // 跳转重构之密码页面
      this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
      // }
    },
    closeDialog() {
      this.$Helper.emitAction('closeModel')
    },
    getQuotation() {
      return this.$refs.quotation
    },
    // 选择收款方式
    choosePayType(item) {
      // var index = this.entrustForm.payTypes.indexOf(item.paymentTypeId)
      // // 如果存在 删除
      // if (index > -1) {
      //   this.entrustForm.payTypes.splice(index, 1)
      // } else {
      //   // this.entrustForm.payTypes.push(item.id)
      //   this.entrustForm.payTypes.push(item.paymentTypeId)
      // }
      // item.selected = !item.selected
    },
    // 弹出添加窗口
    showAddPayment(payType) {
      let $this = this
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'Payment',
          type: 'right',
          params: {
            callback: item => {
              $this.loadPayType()
            },
          },
        })
    },
    // 是否可以下单
    ifCanOrder() {
      let result = {flag: true}
      if (!this.validSpreadNumber().flag) {
        result = this.validSpreadNumber()
      } else if (!this.validOffsetNumber().flag) {
        result = this.validOffsetNumber()
      } else if (!this.validOrderVolume().flag) {
        result = this.validOrderVolume()
      } else if (!this.validLimitMinNumber().flag) {
        result = this.validLimitMinNumber()
      } else if (!this.validLimitMaxNumber().flag) {
        result = this.validLimitMaxNumber()
      } else if (!this.validOrderPrice().flag) {
        result = this.validOrderPrice()
      } else if (!this.validSpreadNumber().flag) {
        result = this.validSpreadNumber()
      } else if (!this.validPayPassword().flag) {
        result = this.validPayPassword()
      } else if (!this.validPayTypes().flag) {
        return this.validPayTypes()
      }
      return result
    },
    // 发布委托单数量验证
    validOrderVolume() {
      if (!this.entrustForm.orderVolume || Number.parseFloat(this.entrustForm.orderVolume) < 0) {
        return {flag: false, tips: this.$t('otc.tradeRightVolume')}
      }
      // 卖出才判断余额
      if (this.entrustForm.direction === 2) {
        if (Number.parseFloat(this.entrustForm.orderVolume) > Number.parseFloat(this.assetMap[this.entrustForm.dcCode])) {
          return {flag: false, tips: this.$t('transaction.available_less_toast')}
        }
      }
      return { flag: true }
    },
    // 交易密码限制
    validPayPassword() {
      if (!this.entrustForm.payPassword || this.entrustForm.payPassword.length < 6) {
        return {flag: false, tips: this.$t('fund.paypassword')}
      }
      return { flag: true }
    },
    // 匹配数量限制
    validLimitMaxNumber() {
      if (!this.entrustForm.limitMax) {
        return {flag: false, tips: this.$t('otc.maxTips')}
      }
      if (this.entrustForm.limitMax <= this.entrustForm.limitMin) {
        return {flag: false, tips: this.$t('otc.limitMaxNumber')}
      }
      return { flag: true }
    },

    validLimitMinNumber() {
      if (!this.entrustForm.limitMin) {
        return {flag: false, tips: this.$t('otc.minTips')}
      }
      if (this.entrustForm.limitMax) {
        if (Number.parseFloat(this.entrustForm.limitMin) >= Number.parseFloat(this.entrustForm.limitMax)) {
          return {flag: false, tips: this.$t('otc.limitMinNumber')}
        }
      }
      // 最低限额不能高于当前总额
      if (this.isFloor() && this.entrustForm.spread && this.entrustForm.orderVolume && Number.parseFloat(this.entrustForm.orderVolume) > 0) {
        let amountTemp = ((Number.parseFloat(this.realTimePrice) + Number.parseFloat(this.entrustForm.spread)) * Number.parseFloat(this.entrustForm.orderVolume))
        if (amountTemp < this.entrustForm.limitMin) {
          return {flag: false, tips: this.$t('otc.theMinimumCannotBeLowerTotal')}
        }
      }
      // 最低限额不能高于当前总额
      if (!this.isFloor() && this.entrustForm.orderVolume && this.entrustForm.orderVolume > 0) {
        if (this.realTimePrice * this.entrustForm.orderVolume < this.entrustForm.limitMin) {
          return {flag: false, tips: this.$t('otc.theMinimumCannotBeLowerTotal')}
        }
      }
      if (this.entrustForm.limitMin > this.getLimitMax()) {
        return {flag: false, tips: this.$t('otc.theMinimumCannotBeLowerTotal')}
      }
      return { flag: true }
    },
    // 价格验证
    validOrderPrice() {
      this.entrustForm.currOrderPrice = this.$Helper.format(this.getQuotation().getRealTimePrice(this.entrustForm.dcCode), 2)
      if (this.isFloor()) {
        this.entrustForm.initOrderPrice = this.entrustForm.currOrderPrice
      }
      if (!this.entrustForm.initOrderPrice || Number.parseFloat(this.entrustForm.initOrderPrice) < 0) {
        return {flag: false, tips: this.$t('otc.priceTips')}
      }
      return { flag: true }
    },
    // 偏差验证
    validOffsetNumber() {
      if (this.isFloor()) {
        if (!this.entrustForm.offset || Number.parseFloat(this.entrustForm.offset) < 0) {
          return {flag: false, tips: this.$t('otc.spreadTips')}
        }
      }
      return { flag: 'true' }
    },
    // 点差验证
    validSpreadNumber() {
      if (this.isFloor()) {
        if (!this.entrustForm.spread) {
          return {flag: false, tips: this.$t('otc.offsetTips')}
        }
      }
      return { flag: 'true' }
    },
    //  支付方式验证
    validPayTypes() {
      if (this.entrustForm.payTypes.length <= 0) {
        return {flag: false, tips: this.$t('otc.paymentIsNeed')}
      }
      return { flag: true }
    },
    // 是否卖出 1买入 2卖出
    isSell() {
      return this.entrustForm.direction === 2
    },
    // 是否浮动价格
    isFloor() {
      return this.entrustForm.priceFloowMarket === 1
    },
    // 切换定价方式
    changeFloowMarket() {
      this.entrustForm.priceFloowMarket === 1 ? this.entrustForm.priceFloowMarket = 0 : this.entrustForm.priceFloowMarket = 1
      this.setLimitMax()
    },
    // 设置最大限额
    setLimitMax() {
      // 设置最大限额 = (点差 + 实时价)* 数量
      let max = this.getLimitMax()
      if (max) {
        this.entrustForm.limitMax = max
      } else {
        this.entrustForm.limitMax = ''
      }
    },
    getLimitMax() {
      // 设置最大限额 = (点差 + 实时价)* 数量
      if (this.isFloor() && this.entrustForm.spread && this.entrustForm.orderVolume) {
        return this.$Helper.format((Number.parseFloat(this.getQuotation().getRealTimePrice(this.entrustForm.dcCode)) + Number.parseFloat(this.entrustForm.spread)) * Number.parseFloat(this.entrustForm.orderVolume), 2)
      }
      if (!this.isFloor() && this.entrustForm.orderVolume && this.entrustForm.initOrderPrice) {
        // 设置最大限额 =  实时价* 数量
        return this.$Helper.format(this.entrustForm.initOrderPrice * this.entrustForm.orderVolume, 2)
      }
      return null
    },
    // 交易对选择,回调重新计算价格
    showSymbolSelect() {
      let $this = this
      this.$store.dispatch(
        'layermodel/push',
        { name: 'RightSelect',
          type: 'right',
          params: {
            callback: item => {
              $this.setSymbol(item)
            },
            list: this.coinList,
          },
        },
      )
    },
    // 下单挂牌单之后跳转
    showResult(orderNo) {
      this.$store.dispatch(
        'layermodel/push',
        { name: 'OtcEntrustResult',
          type: 'right',
          params: {
            makerOrderNo: orderNo, // 委托单号
          },
        },
      )
    },
    // 切换交易对
    setSymbol(item) {
      // 重置表单数据
      this.entrustForm = _.cloneDeep(this.cloneForm)
      this.symbol = item
      // this.initSymbolList()
    },
    // 获取可以发布的币币列表,当前市场,当前域名支持的法币,
    init() {
      this.$Helper
        .ajax({
          url: '/app/otc/getFbBusinessCoinList.api',
          method: 'POST',
        }).then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.fbTradeCoinList = _.get(data, 'fbTradeCoinList') // 可以发布的代币列表
            this.currencySymbol = _.get(data, 'currencySymbol') // 当前可以发布的法币列表
            this.assetMap = _.get(data, 'assetMap') // 法币资产
            this.symbol = this.coinList[0] // 当前待发布的交易队
            let flag = this.fbTradeCoinList.length < 1 || this.currencySymbol.length < 1
            if (flag) {
              this.$Helper.toast(this.$t('httpCode.403'))
              this.closeDialog()
            }
          }
        })
    },

    // 加载我的支付类型
    loadPayType() {
      let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/myPayType.api?ifValid=true',
          method: 'POST',
        }).then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            this.myPayMethod = _.get(data, 'myPayMethod') // 我的支付方式
            if (this.myPayMethod && this.myPayMethod.length > 0) {
              this.myPayMethod.forEach((item) => {
                $this.$set(item, 'selected', false)
              })
            }
          }
        })
    },
    // 下单
    publishOrder() {
      let result = this.ifCanOrder()
      if (!result.flag) {
        this.$Helper.emitAction('toast', {
          text: result.tips,
          type: 'top',
        })
        return
      }
      let $this = this
      if (!$this.entrustForm.spread) {
        $this.entrustForm.spread = 0
      }
      if (!$this.entrustForm.offset) {
        $this.entrustForm.offset = 0
      }
      this.$Helper
        .ajax({
          url: '/app/otc/publishOrder.api',
          method: 'POST',
          params: $this.entrustForm,
        })
        .then(({code, data, msg}) => {
          if (this.$Helper.dealHttpCode(code, msg)) {
            // 跳转到展示页面
            $this.closeDialog()
            $this.showResult(data)
          }
        })
    },
  },
  created() {
    // 初始化参数
    this.init()
    this.loadPayType()
  },
  mounted() {
    if (!this.merchant) this.closeDialog()
    // 参数拷贝  用于还原参数
    this.cloneForm = _.cloneDeep(this.entrustForm)
  },
  destroyed() {
    window.clearInterval(this.interval)
  },
}
</script>

<style lang='less' scoped>
  @import url('../../../theme/index.less');
  .container {
    background: white;
    width: 80vw;
    .num-con{
      padding: 3vw 4vw;
      span{
        margin-left: 2vw;
        font-size: 3.6vw;
        color: @icon-color;
      }
      i{
        font-size: 4vw;
        color: #aaa;
        margin-right: 2vw;
      }
    }
    .half-x-line{
      margin-top: 2vw;
      margin: 0 0vw;
    }
    ul{
      margin-top:3vw;
      padding: 3vw 4vw;
      li{
        padding: 5vw 0;
        .left{
          font-size: 4vw;
          font-weight: 600;
        }
        .right{
          font-size:3.7vw;
          color: #555;
        }
      }
    }
    .lay{
      padding-top: 30vw;
      background: #fff;
    }
  }
  .issue-top .txt h5{
    padding-bottom: 0;
  }
  .issue-top .txt span{
    padding-top:0;
    padding-bottom:2vw;
    text-align: right;
    display: block;
  }
  .otc-btn{
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    background: #fff;
    padding:4vw 4vw;
  }
  .otc-btn div{
    width:100%;
  }
  .input-block .pay-icon{
    width:initial;
    height:12vw;
    margin-left:6vw;
  }
  .input-block .pay-icon i{
    font-size:8vw;
  }
</style>
