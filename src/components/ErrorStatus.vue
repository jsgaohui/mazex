<template lang="html">
  <div class="error-status" v-if="status">
    <div class="bac-image" :style="{backgroundImage: `url(${config.img})`}"/>
    <p class="box box-item">{{ config.text }}</p>
  </div>
</template>
<script>
export default {
  name: 'error-status',
  components: {},
  data() {
    return {
      statusConf: {
        error: {
          text: this.$t('basic.web_error'),
          img: 'static/images/no-wifi.png',
        },
        empty: {
          text: this.$t('basic.empty_error'),
          img: 'static/images/no-order.png',
        },
        loginout: {
          text: this.$t('basic.not_login_error'),
          img: 'static/images/no-order.png',
        },
        default: {
          text: '',
          img: '',
        },
      },
    }
  },
  props: {
    conf: {
      type: Object,
      default: () => {
        return {}
      },
    },
    status: {
      type: String,
    },
  },
  computed: {
    config() {
      return { ...this.statusConf[this.status], ...this.conf }
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
  .error-status{
    height: 100%;
    padding: 20vw;
    .bac-image{
      min-height: 20vw;
      max-height: 30vw;
      max-width: 40vw;
      margin: 0 auto;
      background-size: auto 100%;
      background-position: auto auto;
    }
    p{
      margin-top: 10%;
      font-size: 3.5vw;
    }
    .btn-container{
      height: 10vh;
      .btn{
        height: 4.5vh;
        width: 20vw;
        border: 0.5px solid @active-light;
        color: @active-deep;
        font-size: 3.5vw;
      }
    }
  }
</style>
