<template lang="pug">
  .radio-con.box.box-y-center(@click="toggleFn")
    .radio-index.box.box-item(:class="{active: active}" :style="{borderColor: color}")
      i.iconfont(:style="{color: color}") &#xe626;
    slot
</template>
<script>
export default {
  components: {},
  data() {
    return {
      active: false,
    }
  },
  computed: {},
  props: {
    value: {
      default: false,
    },
    autoChange: {
      type: Boolean,
      default: true,
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
    color: {
      type: String,
      default: '#fff',
    },
  },
  watch: {
    value() {
      this.active = this.value
    },
  },
  methods: {
    toggleFn() {
      if (this.autoChange) this.active = !this.active
      this.$emit('input', this.active)
    },
  },
  created() {
    this.active = this.value
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .radio-con{
    .radio-index{
      height: 4vw;
      width: 4vw;
      padding: 0.6vw;
      border: 1px solid white;
      border-radius: 2px;
      transition: all 0.4s;
      margin-right: 2vw;
      background: transparent;
      &.active{
        i{
          opacity: 1;
        }
      }
      i{
        transition: all 0.4s;
        opacity: 0;
        color: white;
        font-size: 3vw;
      }
    }
  }
</style>
