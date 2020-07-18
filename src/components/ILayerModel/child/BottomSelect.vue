<template lang="pug">
  ul
    li.box.box-item(v-for="(item, key) of params.list" :key="key" :class="{active: params.active === item.key}" @click="clickLi(item)")
      .box.box-item(v-html="item.text")
      .half-x-line
    li.box.box-item.refuse(@click="$Helper.emitAction('closeModel')") {{ $t('basic.cancel') }}
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  },
  props: {
    params: {
      type: Object,
      default() {
        return {
          list: [],
          active: null,
        }
      },
    },
  },
  computed: {},
  watch: {},
  methods: {
    clickLi(item) {
      if (item.hander && this.$Helper.isType(item.hander, () => {})) item.hander(item)
      this.$Helper.emitAction('closeModel')
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  ul{
    padding: 1.5vw;
    li{
      padding:3vw 4vw;
      font-size: 4vw;
      background: white;
      position: relative;
      font-weight: 500;
      word-wrap: normal;
      word-break: keep-all;
      &.refuse{
        margin-top: 1.5vw;
      }
      &.active{
        color: @icon-color;
      }
      .half-x-line{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }
  .box-item{
    flex-shrink: initial;
  }
</style>
