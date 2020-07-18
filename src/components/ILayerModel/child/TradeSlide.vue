<template lang="html">
  <div class="s-container box box-row">
    <div class="box head box box-y-center">
      <div class="name">{{ $t('subbar.market') }}</div>
      <div class="box box-x-right box-col-flex icon">
        <i class="iconfont" @click="closeModel">&#xe644;</i>
      </div>
    </div>
    <div class="half-x-line" />
    <Market class="box-row-flex"/>
  </div>
</template>
<script>
import Market from '@/views/Market'
export default {
  name: 'TradeSlide',
  components: {
    Market,
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    closeModel() {
      this.$Helper.emitAction('closeModel')
    },
  },
  created() {
    this.$Helper.onAction('MarketChoseTrade', item => {
      this.closeModel()
    })
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .s-container {
    width: 86vw !important;
    background: white;
    .head{
      height: 13vw;
      padding: 0 3vw;
      .name{
        font-size: 5vw;
        color: @icon-color;
        font-weight: 500;
      }
      .icon{
        i{
          font-size: 5vw;
          color: @icon-color;
        }
      }
    }
    // .list-con{
    //   position: relative;
    //   overflow: hidden;
    //   .slide-inner{
    //     transition: all 0.4s ease;
    //     position: absolute;
    //     top:0;
    //     bottom: 0;
    //     left:0;
    //     right: 0;
    //     padding:0 3vw;
    //     overflow-x: hidden;
    //     overflow-y: auto;
    //   }
    // }
  }
</style>
