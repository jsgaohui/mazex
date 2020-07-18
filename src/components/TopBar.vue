<template lang="html">
  <div class="top-container box">
    <div class="left box box-item" @click="Fn('leftClick', topConf.leftIcon)">
      <i class="iconfont" v-html="topConf.leftIcon" v-if="topConf.leftIcon"/>
    </div>
    <div class="center box-col-flex box box-item">
      {{ customTitle || $t(`route.${$route.name}`) || $route.meta.title }}
    </div>
    <div class="right box box-item" @click="Fn('rightClick', topConf.rightIcon)">
      <i class="iconfont" v-html="topConf.rightIcon"
         v-if="topConf.rightIcon && ($route.name==='Extract' || $route.name==='HtRecharge')"/>
    </div>
  </div>
</template>

<script>
  import router from '@/router'

  export default {
    name: 'TopBar',
    data() {
      return {
        customTitle: null,
        topConf: {
          leftIcon: '&#xe603;',
          // rightIcon: '&#xe6a2;',
          leftClick: () => {
            router.go(-1)
          },
          rightClick: () => {
            this.$Helper.emitAction('showShareMenu')
          },
          rightIcon: '&#xe66e;',
        },
        isApp: false,
      }
    },
    computed: {},
    props: {},
    watch: {
      '$route'(to, from) {
        // this.toggleTopBar(to.name)
      },
    },
    methods: {
      choseItem(name) {
        this.$emit('change', name)
      },
      toggleTopBar(name) {
        // this.hideSubbar = this.list.indexOf(name) === -1 && this.list.map(item => item.key).indexOf(name) === -1
      },
      Fn(name, canDo) {
        if (!canDo) return
        let fn = this.topConf[name]
        if (this.$Helper.isType(fn, () => {
        })) fn()
      },
    },
    created() {
      this.isApp = this.$env === 'native'
      this.$Helper.onAction('setCustomTitle', title => {
        this.customTitle = title
      })
    },
  }
</script>

<style lang="less" scoped>
  @import '../theme/index.less';

  .top-container {
    border-bottom: 1px solid #eee;
    background: @active-deep;
    height: 12vw;
    // background: linear-gradient(to right, #2e2b36, #141318);
    z-index: 1;

    & > div {
      color: #58619d;
      width: 12vw;
      font-size: 4.4vw;
      font-weight: 600;

      i {
        font-size: 4.5vw;
        font-weight: 300;
        color: #58619d;
      }
    }
  }

</style>
