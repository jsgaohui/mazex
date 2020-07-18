<template lang="html">
  <div class="container">
    <div class="status">
      <div class="img-con box box-item">
        <i class="iconfont right-color" v-if="status === 2||status === 1">&#xe65c;</i>
        <i class="iconfont error-color" v-else>&#xe685;</i>
      </div>
      <h1 class="box box-item" :class="{'right-color': status === 2||status === 1, 'error-color': status == 0}">{{ status === 2 ? $t('basic.success') : $t('verify.verifying') }}</h1>
      <p class="box box-item">{{ status === 2 ? $t('verify.verify_complete') : $t('verify.verify_success') }}</p>
    </div>
  </div>
</template>
<script>
import components from '@/components'
export default {
  name: 'Identity',
  components,
  data() {
    return {
      status: null,
    }
  },
  computed: {},
  watch: {},
  methods: {
    judgeAnalyze() {
      this.$Helper.ajax({
        url: '/app/user/authStatus.api',
        method: 'POST',
      })
      .then(
        ({data}) => {
          let { validStatus } = data
          if (validStatus === 0) {
            this.$Helper.jumpPage('IdentityOne', this)
          } else {
            this.status = validStatus
          }
        },
        (data) => {},
      )
    },
  },
  created() {
    this.judgeAnalyze()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 3vw 4vw;
    .status{
      i{
        font-size: 20vw;
        margin-top: 15vh;
        margin-bottom: 3vh;
      }
      h1 {
        font-size: 7vw;
        margin-bottom: 2vw;
      }
      p {
        font-size: 4vw;
        color: #999;
      }
    }
  }
</style>
