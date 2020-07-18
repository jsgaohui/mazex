<template lang="pug">
  ul.box-row-flex.overflow-y.mescroll
    li(v-for="(list, key) of list" :key="key")
      .head.box.box-y-center
        .left.s-color {{ list.orderId }}
        .right.box.box-x-right.box-col-flex.name {{ list.createTime }}
      .content.box-y-center
        span.s-color(style="margin-right: 2vw;font-size: 4.2vw;font-weight: 600;") {{ $Helper.numFixedLength(list.rechargeAmount, 5, 30) }}
        .name {{ list.symbol }}
      // .bottom.box-y-center
      //   .left 手机：
      //     span.s-color 18027364282
      //   .right.box.box-x-right.box-col-flex 邮箱：
      //     span.s-color 131831371@qq.com  
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    splitHeight: {
      type: Number,
    },
  },
  watch: {},
  methods: {
    getLevelText(code) {
      if (code === 2) return this.$t('invite.vip')
      if (code === 1) return this.$t('invite.corop')
      return this.$t('invite.common')
    },
    getCountryImage(code) {
      if (code === '86') return 'static/lang/zh.png'
      if (code === '82') return 'static/lang/ko.png'
      if (code === '44') return 'static/lang/en.png'
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  ul{
    li{
      padding: 0 3vw 3vw;
      font-size: 3.4vw;
      background: #fff;
      margin: 2vw 0;
      .s-color{
        color: @icon-color;
      }
      .name{
        color: #888;
        font-size: 3.4vw;
      }
      .head{
        height: 11vw;
        border-bottom: 1px dashed #eee;
      }
      .content{
        height: 15vw;
        font-size: 4vw;
      }
      .bottom{
        height: 11vw;
      }
    }
  }
</style>
