<template lang="pug">
  .v-container
    .share.box.box-item
      .line
      span 分享链接
      .line
    ul.box.box-wrap
      li.box.box-item(v-for="(item, key) of shareList" :key="key")
        i.iconfont(v-html="item.icon")
    IButton(class="btn" @click="$Helper.emitAction('closeModel')") 取消
</template>
<script>
import Iinput from '../../Iinput'
import IButton from '../../IButton'
// import { mapState } from 'vuex'
export default {
  components: {
    Iinput,
    IButton,
  },
  data() {
    return {
      verifyImage: null,
      verifyCode: null,
      shareList: [
        {
          hander: 'wechat',
          icon: '&#xe66a;',
        },
        {
          hander: 'timeline',
          icon: '&#xe660;',
        },
        {
          hander: 'twitter',
          icon: '&#xe68b;',
        },
        {
          hander: 'facebook',
          icon: '&#xe682;',
        },
        {
          hander: 'telegram',
          icon: '&#xe600;',
        },
      ],
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {},
  watch: {},
  methods: {
    getVerifyImage() {
      this.verifyImage = `/verify/?d=` + Math.random()
    },
    sendVerifyFn() {
      this.$Helper.emitAction(this.params.actionId, this.verifyCode)
      this.$Helper.emitAction('closeModel')
    },
  },
  created() {
    this.getVerifyImage()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .v-container {
    background: white;
    padding: 5vw 3vw;
    .share{
      .line{
        height: 1px;
        width: 7vw;
        background: #94aff0;
      }
      span{
        color:#94aff0;
        font-size: 3.6vw;
        margin: 0 2vw;
      }
    }
    ul{
      margin-top: 5vw;
      li{
        width: 12vw;
        height: 12vw;
        margin: 3vw 5.4vw;
        background: #94aff0;
        i{
          color: white;
          font-size: 6vw;
        }
      }
    }
    .btn{
      margin-top: 5vw;
    }
  }
</style>
