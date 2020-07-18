<template lang="html">
  <div class="container box">
    <input class="box-col-flex" :class="classList" :style="styleList" type="number" :value="numValue" :min="min" :max="max" @input="inputFn($event.target.value)" @focus="focus($event)" @blur="blur($event)" :placeholder="placeholder"/>
    <div class="range box box-y-center" v-if="showRange">
      <div class="range-one box box-item box-col-flex" @click="add(-1)">
        <i class="iconfont">&#xe60a;</i>
      </div>
      <div class="half-y-line"/>
      <div class="range-one box box-item box-col-flex" @click="add(1)">
        <i class="iconfont">&#xe619;</i>
      </div>
    </div>
    <div class="right-text box box-item" v-if="rightText">
      {{ rightText }}
    </div>
  </div>
</template>
<script>
import i18n from '@/language'
export default {
  components: {},
  data() {
    return {
      pageHeight: null,
      numValue: null,
      focusing: false,
    }
  },
  computed: {},
  props: {
    inputType: {
      type: String,
      default: 'input',
    },
    value: {
      default: null,
    },
    placeholder: {
      type: String,
      default: i18n.t('basic.please_input'),
    },
    classList: {
      type: Object,
      default: () => {
        return {}
      },
    },
    styleList: {
      type: Object,
      default: () => {
        return {}
      },
    },
    container: {
      type: String,
    },
    fixHeight: {
      type: Boolean,
      default: true,
    },
    step: {
      type: Number,
      default: 1,
    },
    showRange: {
      type: Boolean,
      default: false,
    },
    rightText: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
    },
    fixed: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    value() {
      this.numValue = this.value
    },
  },
  methods: {
    focus(e) {
      this.focusing = true
      if (this.$Helper.isAndroid() && this.fixHeight) {
        let offsetTop = this.getTop(e.target)
        let top = offsetTop > this.pageHeight * 0.4 ? this.pageHeight * 0.4 : offsetTop
        let container = document.getElementById(this.container) || document.body
        container.style.height = this.pageHeight + 'px'
        container.style.top = -top + this.pageHeight * 0.2 + 'px'
        setTimeout(() => {
          let blur = () => {
            e.target.blur()
            window.removeEventListener('resize', blur, false)
          }
          window.addEventListener('resize', blur, false)
        }, 1000)
      }
    },
    blur(e) {
      this.focusing = false
      if (this.$Helper.isAndroid() && this.fixHeight) {
        let container = document.getElementById(this.container) || document.body
        container.style.top = 0
      }
      this.$emit('blur')
    },
    getTop(e) {
      let offset = e.offsetTop
      if (e.offsetParent != null) offset += this.getTop(e.offsetParent)
      return offset
    },
    add(single = 0) {
      let num = parseFloat(this.numValue) || 0
      let eNum = parseFloat(num) + single * this.step
      this.$emit('input', (eNum < this.min ? this.min : (eNum > this.max ? this.max : eNum)).toFixed(this.fixed))
    },
    inputFn(value) {
      this.$emit('input', value)
    },
  },
  created() {
    this.numValue = this.value
  },
  mounted() {
    // save body height
    this.pageHeight = document.body.offsetHeight
  },
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .container {
    border: 1px solid #ddd;
    height: 13vw;
    input {
      color: #2c3e50;
      font-size: 4.3vw;
      padding: 1vw 2vw;
    }
    .range{
      width: 19vw;
      border-left: 1px solid #ddd;
      i{
        font-size: 4vw;
      }
    }
    .half-y-line{
      background: #ddd;
      height: 7vw;
    }
    .right-text{
      color: @icon-color;
      font-weight: 500;
      padding: 0 2vw;
      font-size: 4.6vw;
    }
  }
</style>
