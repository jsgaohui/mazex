<template lang="pug">
  .container.box.box-row
    .back.box-y-center(@click="$Helper.emitAction('closeModel')")
      i.iconfont &#xe603;
      div {{ $t('basic.back') }}
    h2.box.box-item {{ $t('route.Encrypt') }}
    .icon-con.box.box-item
      i.iconfont &#xe63e;
    p.box.box-item {{ $t('verify.encrypt_toast') }}
    .box-row-flex.con(ref="con")
      .end.box.box-item(:style="{left: endPos.left + 'px', top: endPos.top + 'px'}" :class="{success: success}")
        i.iconfont &#xe619;
      .ank.box.box-item(:style="{left: ankPos.left + 'px', top: ankPos.top + 'px'}" :class="{touch: isTouch}" @touchmove="modifyRange" @touchend="touchend")
        i.iconfont &#xe625;
</template>
<script>
import _ from 'lodash'
export default {
  name: 'Encrypt',
  components: {},
  data() {
    return {
      endPos: {
        top: null,
        left: null,
      },
      oldAnkPos: {
        top: 200,
        left: 50,
      },
      ankPos: {
        top: null,
        left: null,
      },
      startPosition: {
        top: null,
        left: null,
      },
      success: false,
      isTouch: false,
    }
  },
  computed: {},
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    oldAnkPos() {
      this.ankPos = _.cloneDeep(this.oldAnkPos)
    },
    ankPos() {
      this.success = Math.abs(this.endPos.left - this.ankPos.left) < 20 && Math.abs(this.endPos.top - this.ankPos.top) < 20
    },
  },
  methods: {
    modifyRange(e) {
      let touch = e.touches[0]
      let startPosition = {
        left: touch.pageX,
        top: touch.pageY,
      }
      if (this.startPosition.top !== null && this.startPosition.left !== null) { // move
        let left = startPosition.left - this.startPosition.left + this.ankPos.left
        let top = startPosition.top - this.startPosition.top + this.ankPos.top
        let conWidth = this.$refs.con.offsetWidth
        let conLeft = this.$refs.con.offsetLeft
        // let conHeight = this.$refs.con.offsetHeight
        // let conTop = this.$refs.con.offsetTop
        this.ankPos = {
          left: left < conLeft + 8 ? conLeft + 8 : (left > conWidth - 90 ? conWidth - 90 : left),
          // top: (top < conTop - conHeight + 10) ? (conTop - conHeight + 10) : (top > conTop - 80 ? conTop - 80 : top),
          top,
        }
      }
      this.startPosition = startPosition
      this.isTouch = true
    },
    touchend() {
      this.isTouch = false
      if (this.success) {
        this.ankPos = {
          left: this.endPos.left + 10,
          top: this.endPos.top + 10,
        }
        this.successFn()
      } else {
        this.ankPos = _.cloneDeep(this.oldAnkPos)
        this.startPosition = {
          top: null,
          left: null,
        }
      }
    },
    randomPos() {
      let con = this.$refs.con
      let conWidth = con.offsetWidth
      let conHeight = con.offsetHeight
      let dPos = {
        top: Math.random() * (conHeight - 110),
        left: Math.random() * (conWidth - 110),
      }
      this.endPos = dPos
      this.oldAnkPos = this.getAnkRandomPos(dPos)
    },
    getAnkRandomPos(dPos) {
      let con = this.$refs.con
      let conWidth = con.offsetWidth
      let conHeight = con.offsetHeight
      let ePos = {
        top: Math.random() * (conHeight - 110),
        left: Math.random() * (conWidth - 110),
      }
      if (Math.abs(dPos.left - ePos.left) > 100 && Math.abs(dPos.top - ePos.top) > 100) {
        return ePos
      } else {
        return this.getAnkRandomPos(dPos)
      }
    },
    successFn() {
      setTimeout(() => this.$Helper.emitAction('closeModel'), 1000)
      if (this.$Helper.isType(this.params.callback, () => {})) this.params.callback()
    },
  },
  mounted() {
    this.randomPos()
  },
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
    background: white;
    width: 100vw;
    user-select: none;
    -webkit-user-select: none;
    .back{
      padding: 4vw 3vw;
      font-size: 4vw;
      color: @active-deep;
      i{
        font-size: 4vw;
      }
    }
    h2{
      margin-top: 10vw;
      font-size: 8vw;
      font-weight: 500;
    }
    .icon-con{
      margin: 4vw;
      i{
        font-size: 20vw;
        color: #ccc;
      }
    }
    p{
      text-align: center;
      padding: 8vw;
    }
    .con{
      position: relative;
      .end{
        position: absolute;
        border: 2px dashed @icon-color;
        color: @icon-color;
        width: 100px;
        height: 100px;
        border-radius: 100%;
        animation: star 1.2s infinite;
        -webkit-animation: star 1.2s infinite;
        transform-origin: center center;
        -webkit-transform-origin: center center;
        i{
          font-size: 8vw;
        }
        &.success{
          border: 2px dashed @right-color;
          i{
            color: @right-color;
          }
        }
      }
      .ank{
        background: white;
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 100%;
        i{
          font-size: 80px;
          color: @active-deep;
        }
        &.touch{
          transform-origin: center center;
          -webkit-transform-origin: center center;
          -webkit-transform: scale(1.2, 1.2);
          transform: scale(1.2, 1.2);
        }
      }
    }
  }
  @keyframes star{
    0% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.2, 1.2);
    }
    100% {
      transform: scale(1, 1);
    }
  }
  @keyframes star{
    0% {
      -webkit-transform: scale(1, 1);
    }
    50% {
      -webkit-transform: scale(1.2, 1.2);
    }
    100% {
      -webkit-transform: scale(1, 1);
    }
  }
</style>
