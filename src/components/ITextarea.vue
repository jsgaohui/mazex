<template lang="html">
  <div class="t-con">
    <textarea :class="classList" :style="styleList" :rows="rows" @input="inputFn($event)" @focus="focus($event)" @blur="blur($event)" :placeholder="placeholder">{{ value }}</textarea>
    <div class="bottom-info box box-x-right box-y-center" :class="{ error: innerValue.length > max }" v-if="max">
      {{ innerValue.length }}/{{ max }}
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      pageHeight: null,
      innerValue: this.value,
    }
  },
  computed: {},
  props: {
    value: {
      type: String,
      default: '',
    },
    rows: {
      type: Number,
      default: 6,
    },
    max: {
      type: Number,
    },
    placeholder: {
      type: String,
      default: '请输入',
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
  },
  watch: {},
  methods: {
    focus(e) {
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
      if (this.$Helper.isAndroid() && this.fixHeight) {
        let container = document.getElementById(this.container) || document.body
        container.style.top = 0
      }
    },
    getTop(e) {
      let offset = e.offsetTop
      if (e.offsetParent != null) offset += this.getTop(e.offsetParent)
      return offset
    },
    inputFn(e) {
      this.innerValue = e.target.value
      this.$emit('input', this.innerValue)
    },
  },
  mounted() {
    // save body height
    this.pageHeight = document.body.offsetHeight
  },
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .t-con {
    background: white;
    &>textarea{
      background: transparent;
      box-shadow: none;
      outline: none;
      border: none;
      resize: none;
      padding: 3vw;
      font-size: 4vw;
      color: #222;
      &::-webkit-input-placeholder {
        color: #c0c0c0;
        letter-spacing: 0;
        font-weight: 400;
        font-size: 3.4vw;
      }
    }
    &>.bottom-info{
      font-size: 3.4vw;
      color: #666;
      padding: 3vw;
      &.error{
        color: @error-deep;
      }
    }
  }
</style>
