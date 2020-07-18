<template lang="pug">
  .switch-con.box.box-y-center(:class="{active: active}" @click="toggleFn")
    .switch-range(:class="{active: active}")
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
  .switch-con{
    height: 6vw;
    width: 12vw;
    padding: 0.6vw;
    background: #eee;
    border-radius: 2px;
    transition: all 0.4s;
    &.active{
      background: @icon-color;
    }
    .switch-range{
      height: 5.2vw;
      width: 5.2vw;
      background: white;
      border-radius: 2px;
      transition: all 0.4s;
      &.active{
        margin-left:5.4vw;
      }
    }
  }
</style>
