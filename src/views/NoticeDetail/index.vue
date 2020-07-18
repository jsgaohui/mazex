<template lang="html">
  <div class="container overflow-y mescroll">
    <h2>{{ params.noticeTitle }}</h2>
    <p v-html="params.remark"/>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      params: {},
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created() {
    this.params = this.$route.params
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 3vw 4vw;
    overflow-y: auto;
    h2{
      font-size: 4.4vw;
      font-weight: 600;
      margin-bottom: 2vw;
    }
    p{
      font-size: 4vw;
      font-weight: 400;
    }
  }
</style>
