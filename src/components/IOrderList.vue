<template lang="html">
  <div class="list-con">
    <div class="list" v-for="(item, key) of list" :key="key">
      <div class="head box box-y-center">
        <div class="h-left box-col-flex" :class="{'right-color': item.direction === 1, 'error-color': item.direction !== 1}">
          {{ item.direction === 1 ? $t('basic.buy') : $t('basic.sell') }} {{ item.symbol }}<span v-if="!isHis"> {{ getDate(item.clientOrderTime) }}</span>
        </div>
        <div class="do" v-if="!isHis" @click="doFn(item)">
          {{ $t('basic.revoke') }}
        </div>
      </div>
      <div class="tr td box box-y-center" v-if="!isHis">
        <div class="price">{{ $t('basic.price') }}</div>
        <div class="num">{{ $t('basic.num') }}</div>
        <div class="said box box-col-flex box-x-right">{{ $t('basic.actual_transcation') }}</div>
      </div>
      <div class="td box box-y-center" v-if="!isHis">
        <div class="price">{{ $Helper.numFixedLength(item.orderPrice, getTradePriceDigit(item.symbol)) }}</div>
        <div class="num">{{ $Helper.numFixedLength(item.orderVolume) }}</div>
        <div class="said box box-col-flex box-x-right">{{ $Helper.numFixedLength(item.matchVolume) }}</div>
      </div>
      <div class="tr td box box-y-center" v-if="isHis">
        <div class="price">{{ $t('basic.time') }}</div>
        <div class="num">{{ $t('basic.entrustment_price') }}</div>
        <div class="said box box-col-flex box-x-right">{{ $t('basic.entrustment_num') }}</div>
      </div>
      <div class="td box box-y-center" v-if="isHis">
        <div class="price">{{ getDate(item.clientOrderTime) }}</div>
        <div class="num">{{ $Helper.numFixedLength(item.orderPrice, getTradePriceDigit(item.symbol)) }}</div>
        <div class="said box box-col-flex box-x-right">{{ $Helper.numFixedLength(item.orderVolume) }}</div>
      </div>
      <div class="tr td box box-y-center" v-if="isHis">
        <div class="price">{{ $t('basic.total_volume') }}</div>
        <div class="num">{{ $t('basic.trade_price') }}</div>
        <div class="said box box-col-flex box-x-right">{{ $t('basic.trade_volume') }}</div>
      </div>
      <div class="td box box-y-center" v-if="isHis">
        <div class="price">{{ $Helper.numFixedLength(item.matchAmount) }}</div>
        <div class="num">{{ $Helper.numFixedLength(item.matchAmount > 0 ? item.matchAmount / item.matchVolume : 0) }}</div>
        <div class="said box box-col-flex box-x-right">{{ $Helper.numFixedLength(item.matchVolume) }}</div>
      </div>
      <div class="half-x-line"/>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import caculateMixin from '@/mixin/caculate'
export default {
  components: {},
  data() {
    return {}
  },
  mixins: [caculateMixin],
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    isHis: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  watch: {},
  methods: {
    getDate(d) {
      let days = dayjs(d)
      return days.format('HH:mm MM/DD')
    },
    doFn(data) {
      let $this = this
      // 如果id为空
      if (!data.id) {
        // 重新加载
        this.$Helper.toast(this.$t('basic.revoke') + this.$t('basic.error'))
        this.$Helper.emitAction('reloadOrderList')
        return
      }
      if (!this.isHis) {
        this.$Helper.emitAction('comfirm', {
          text: this.$t('verify.cancel_anilyse_comfirm'),
          btn: [
            {
              text: this.$t('basic.cancel'),
            },
            {
              text: this.$t('basic.comfirm'),
              callback: () => {
                this.$Helper.ajax({
                  url: `/app/trade/appOrderCancel.api?orderId=${data.id}`,
                })
                .then(({code, msg}) => {
                  // 撤销之后   移除数组
                  for (let i in $this.list) {
                    if ($this.list[i].orderId === data.orderId) {
                      $this.list.splice(i, 1)
                    }
                  }
                  if (code === 200) {
                    this.$Helper.emitAction('reloadOrderList')
                    msg = this.$t('verify.cancel_success')
                  }
                  this.$Helper.emitAction('toast', {
                    text: msg,
                  })
                })
              },
            },
          ],
        })
      }
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .list-con {
    background: white;
    padding: 0 3vw;
    .list{
      .half-x-line{
        margin-bottom: 6vw;
        margin-top: 6vw;
      }
      .head{
        margin-top: 4vw;
        .h-left{
          font-size: 4.6vw;
          font-weight: bold;
          span{
            font-size: 3.6vw;
            color: #666;
            font-weight: 400;
          }
        }
        .do{
          font-size: 3.7vw;
          color: @icon-color;
          font-weight: 600;
        }
      }
      .td{
        &.tr{
          color: #777;
          margin-top: 5.5vw;
          margin-bottom: 3.5vw;
        }
        color: #222;
        .price{
          width: 30%;
        }
        .num{
          width: 30%;
        }
        .said{}
      }
    }
  }
</style>
