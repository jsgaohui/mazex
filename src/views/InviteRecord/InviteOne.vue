<template lang="pug">
  ol.box-row-flex.overflow-y.mescroll
    li(v-for="(item, key) of list" :key="key" :style="{marginBottom: splitHeight ? splitHeight + 'px' : '2vw'}" @click="$emit('tap', item)")
      .head.box.box-y-center
        .left.name {{ item.createTime }}
        .right.box.box-x-right.box-col-flex.right-color {{ $t(`invite.validate${item.isValid}`) || '-' }}
      .bottom.box.box-y-center
        .left.box.box-y-center {{ $t('basic.mobile') }}:
          span {{ item.mobile || '~' }}
        .right.box.box-x-right.box-col-flex.box-y-center {{ $t('invite.country') }}:
          span {{ item.locationCountry || '~' }}
      .bottom.box.box-y-center
        .left.box.box-y-center {{ $t('basic.email') }}:
          span {{ item.email || '~' }}
        .right.box.box-x-right.box-col-flex.box-y-center {{ $t('basic.level') }}:
          span {{ getLevelText(item.teamId) || '~' }}
      // .bottom.box.box-y-center
      //   .right.box.box-x-right.box-col-flex.box-y-center.s-color
      //     span 充币记录 >>
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
  ol{
    li{
      padding: 0 3vw 5vw 3vw;
      font-size: 3.4vw;
      background: #fff;
      margin-bottom: 2vw;
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
      .bottom{
        margin-top: 6vw;
        span{
          margin-left: 1vw;
        }
      }
      .left{
        span{
          margin-left: 1vw;
        }
      }
      .right{
        img{
          height: 6vw;
          margin-left: 2vw;
        }
      }
    }
  }
</style>
