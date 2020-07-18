<template lang="html">
  <div class="hd box">
    <b class="box-col-flex box box-y-center">{{ title }}</b>
    <div class="right box box-y-center box-x-right">
      <slot/>
    </div>
    <div class="half-x-line"/>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .hd {
    background: white;
    height: 12vw;
    // margin-top: 2vw;
    padding: 0 3vw;
    b{
      font-size: 4.4vw;
      font-weight: 600;
    }
    .right{
      width: 20vw;
      font-size: 4vw;
      color: @icon-color;
      i{
        font-size: 3.8vw;
        margin-right: 1vw;
      }
    }
  }
</style>
