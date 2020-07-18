<template lang="pug">
  .range-con(@touchstart="modifyRange" @touchmove="modifyRange")
    .slider
      .bar(:style="{ left:`calc( ${fliterFn(value)}% - 2.5vw )`, background: color }" @touchstart="modifyRange" @touchmove="modifyRange")
      .line(:style="{ width:`calc( ${fliterFn(value)}% - 2.5vw )`, background: color }")
    .info.box
      .left.box.box-col-flex
        slot(name="left")
      .right.box-col-flex.box.box-x-right
        slot(name="right")
</template>
<script>
export default {
  name: 'Ranger',
  components: {},
  data() {
    return {}
  },
  computed: {},
  props: {
    value: {
      type: [Number, String],
      default: 0,
      min: 0,
      max: 100,
    },
    fixedNum: {
      type: Number,
      default: 3,
    },
    color: {
      type: String,
      default: '',
    },
  },
  watch: {},
  methods: {
    modifyRange(e) {
      let touch = e.touches[0]
      let el = e.target
      let startPosition = {
        x: touch.pageX,
        y: touch.pageY,
      }
      let xLen = startPosition.x - el.offsetLeft
      let xWidth = el.offsetWidth
      let xPercent = (xLen / xWidth) * 100
      xPercent = xPercent < 0 ? 0 : xPercent
      xPercent = xPercent > 100 ? 100 : xPercent
      this.$emit('input', xPercent.toFixed(this.fixedNum))
    },
    fliterFn(num) {
      if (num > 100) return 100
      if (num < 0) return 0
      return num
    },
  },
  created() {
    this.$nextTick(() => this.$emit('input', this.value.toFixed(this.fixedNum)))
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .range-con{
    width: 100%;
    padding: 3vw 2vw;
    .slider{
      width: 100%;
      height:2px;
      background:#e7ebee;
      position:relative;
      .bar{
        position:absolute;
        left:20%;
        top:0;
        bottom:0;
        margin:auto;
        height:5vw;
        width:5vw;
        border-radius: 100%;
        pointer-events: none;
      }
      .line{
        content:'';
        position:absolute;
        left:0;
        top:0;
        bottom:0;
        margin:auto;
        height:100%;
        width:20%;
        pointer-events: none;
      }
    }
    .info{
      margin-top: 3vw;
      font-size: 3.4vw;
      color: #999;
      // height: 10vw;
      .left{
        &>div{
          text-align: left;
          word-wrap:break-word;
          word-break: normal;
          width: 100%;
        }
      }
      .right{
        &>div{
          text-align: right;
          word-wrap:break-word;
          word-break: normal;
          width: 100%;
        }
      }
    }
  }
</style>
