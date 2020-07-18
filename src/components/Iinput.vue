<template lang="html">
  <input :class="classList" :style="styleList" :type="inputType" :value="value" @input="$emit('input', $event.target.value)" @focus="focus($event)" @blur="blur($event)" :placeholder="placeholder" :disabled="disabled"/>
</template>
<script>
import i18n from '@/language'
export default {
  components: {},
  data() {
    return {
      pageHeight: null,
    }
  },
  computed: {
    isIos() {
      return !this.$Helper.isAndroid() && process.env.NODE_ENV === 'production' ? 1 : 0
    },
  },
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
      default: 'app',
    },
    fixHeight: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  methods: {
    focus(e) {
      if (this.$Helper.isAndroid() && this.fixHeight) {
        let offsetTop = this.getTop(e.target)
        let container = document.getElementById(this.container) || document.body
        let top = offsetTop > this.pageHeight * 0.5 ? this.pageHeight * 0.5 : 0
        if (!top) return
        container.style.height = this.pageHeight + 'px'
        container.style.top = -top + this.pageHeight * 0.2 + 'px'
        container.style.transition = 'top 100ms'
        setTimeout(() => {
          let blur = () => {
            e.target.blur()
            window.removeEventListener('resize', blur, false)
          }
          window.addEventListener('resize', blur, false)
        }, 800)
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
  },
  mounted() {
    // save body height
    this.pageHeight = document.body.offsetHeight
  },
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  input {
    background: white;
    box-shadow: none;
    outline: none;
    border: none;
    color: #2c3e50;
    font-size: 4vw;
    padding: 1vw 0;
    letter-spacing: 1px;
    // height: 100%;
    width: 100%;
    line-height: 140%;
    -webkit-user-select: auto;
    user-select: auto;
    &[type="password"]{
      &[isios="1"]{
        font-size: 2vw !important;
        font-weight: 100 !important;
        &::-webkit-input-placeholder {
          color: #c0c0c0;
          letter-spacing: 0;
          font-weight: 400;
          font-size: 4vw;
        }
      }
    }
    &::-webkit-input-placeholder {
      color: #c0c0c0;
      letter-spacing: 0;
      font-weight: 400;
      // font-size: 4vw;
    }
  }
</style>
