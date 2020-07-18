<template lang="pug">
  .container
    ul
      li.box(v-for="i in 5" :key="i")
        .left
          i.iconfont &#xe619;
        .right.box-col-flex
          .name etc
          .address shkahdkhigyqbkaagdagdafafafeaweqeq
        .half-x-line
    .login-btn.box.box-item(@click="addFn") 添加地址
</template>
<script>
import components from '@/components'
export default {
  name: 'EtcAddress',
  components,
  data() {
    return {
      settingConfig: [
        [
          {
            handle: 'Language',
            text: this.$t('setting.language'),
            rightText: this.$t('NAME'),
          },
          {
            handle: 'Identity',
            text: '行情刷新频率',
            rightText: '仅在wifi下实时行情',
          },
          {
            handle: 'Orders',
            text: '盘口样式',
            rightText: '竖版',
          },
        ],
      ],
    }
  },
  computed: {},
  watch: {},
  methods: {
    Run(name) {
      if (this.$Helper.isType(name, () => {})) {
        name.call(this)
        return
      }
      this.$Helper.jumpPage(name, this)
    },
    addFn() {
      this.$Helper.jumpPage('AddAddress', this)
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 3vw 4vw;
    ul{
      li{
        position: relative;
        padding:3vw 0;
        .left{
          padding-top: 0.6vw;
          i{
            font-size: 4.5vw;
          }
        }
        .right{
          padding-left: 4vw;
          padding-right: 2vw;
          .name{
            font-size: 5vw;
            font-weight: 500;
            padding-bottom: 2vw;
          }
          .address{
            font-size: 3.8vw;
            font-weight: 400;
            color: #aaa;
          }
        }
        .half-x-line{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
    }
  }
  .login-btn{
    position: absolute;
    bottom: 7vw;
    left: 0;
    right: 0;
    height: 11vw;
    width: 92vw;
    margin:0 auto;
    background: @icon-color;
    color: white;
    font-size: 4.2vw;
    font-weight: 600;
    border-radius: 1px;
  }
</style>
