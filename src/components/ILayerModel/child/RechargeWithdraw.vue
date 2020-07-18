<template lang="html">
  <div class="layout  container box box-row router-view">
    <div class="head box">
      <div class="left box box-item"><i data-v-2b663b10="" class="iconfont" @click="$Helper.emitAction('closeModel')"></i></div>
      <div class="name box box-item box-col-flex">
       {{item.enable === 1 ? $t('route.FriendChargeRecord') : $t('basic.extractRecord')}}
      </div>

    </div>
    <div class="withdraw-detail" v-if="item">
      <h2>{{type ===0 ? item.rechargeAmount:item.tradeAmount}} {{item.symbol}}</h2>
      <dl><dt>{{$t('otc.type')}}</dt><dd>{{type ===0 ? $t('basic.recharge'):$t('basic.extract')}}</dd></dl>
      <dl><dt>{{$t('basic.status')}}</dt>
        <dd v-if="type===0">{{item.enable === 1 ? $t('basic.success'):$t('basic.error')}}</dd>
        <dd v-else>
             <template v-if="item.enable === 0">{{$t('basic.auding')}}</template>
             <template v-else-if="item.enable === 1">{{$t('basic.audited')}}</template>
            <template v-else-if="item.enable === 2">{{$t('basic.execing')}}</template>
            <template v-else-if="item.enable === 3">{{$t('basic.withdrawing')}}</template>
            <template v-else-if="item.enable === 4">{{$t('basic.withdrawfail')}}</template>
            <template v-else-if="item.enable === 5">{{$t('basic.withdrawsucc')}}</template>
            <template v-else-if="item.enable === 6">{{$t('basic.failfreeze')}}</template>
            <template v-else-if="item.enable === 7">{{$t('basic.withsubmit')}}</template>
        </dd>
      </dl>
      <dl style="align-items: flex-start"><dt>{{type ===0 ? $t('basic.rechargeAdd'):$t('basic.extractAdd')}}</dt><dd>{{item.userAddress}}</dd></dl>
      <dl><dt>{{$t('myfund.poundage')}}</dt><dd>{{type ===0 ? item.rechargeFee :item.chargeAmount}} {{item.symbol}}</dd></dl>
      <dl><dt>{{$t('fund.time')}}</dt><dd>{{item.createTime}}</dd></dl>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      item: null,
      type: 0,
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    // this.init()
    if (this.params) {
      this.item = this.params.item
      this.type = this.params.type
    }
  },
}
</script>
<style lang="less" scoped>
  .container .head{
    border-bottom:1px solid #eee;
    min-height:12vw!important;
  }
  .router-view{
    background:#fff
  }
  .withdraw-detail{
    padding:0 4vw;
    h2{
      padding:8vw 0;
      font-size:8vw;
      color:#64acf5;
      font-weight: normal;
      border-bottom:1px solid #f5f5f5;
    }
    dl{
      padding:4vw 0;
      display:flex;
      justify-content: space-between;
      align-items: center;
      border-bottom:1px solid #f5f5f5;
      dt{
        color:#999;
      }
      dd{
        width:60%;
        text-align: right;
        word-wrap: break-word;
      }
    }
  }
</style>
