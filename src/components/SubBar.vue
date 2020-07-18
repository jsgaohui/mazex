<template lang="html">
  <div class="container box" v-show="!hideSubbar">
    <div class="half-x-line"/>
    <div class="subbar-item box-col-flex" v-for="(item, key) in list" :key="key" :class="{ active: activeKey === item.key }" @click="choseItem(item.key)">
      <div class="icon box box-item">
        <i class="un-active iconfont" v-if="item.icon && activeKey !== item.key" v-html="item.icon"/>
        <i class="active iconfont" v-html="item.activeIcon || item.icon" v-if="(item.activeIcon || item.icon) && activeKey === item.key"/>
        <img v-if="item.src && activeKey !== item.key" :src="item.src" alt="subbar-img" />
        <img v-if="item.activeSrc && activeKey === item.key" :src="item.activeSrc" alt="subbar-active-img" />
      </div>
      <div class="text box box-item">{{item.text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hideSubbar: false,
    }
  },
  computed: {},
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
    activeKey: {
      default: 0,
    },
  },
  watch: {
    '$route'(to, from) {
      this.toggleSubber(to.name)
    },
  },
  methods: {
    choseItem(name) {
      this.$emit('change', name)
    },
    toggleSubber(name) {
      this.hideSubbar = this.list.indexOf(name) === -1 && this.list.map(item => item.key).indexOf(name) === -1
    },
  },
  created() {
    this.toggleSubber(this.$route.name)
  },
}
</script>

<style lang="less" scoped>
@import '../theme/index.less';
.container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 13.5vw;
  // border-top: 1px solid #eee;
  background: #fff;
  z-index: 10;
}

.half-x-line{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #eee;
}

.subbar-item {
  color: #aaa;
  padding-top: .6vh;
  text-align: center;
  i {
    color: #ccc;
  }
  &.active {
    &>.icon{
      &>i{
        color: @icon-color;
      }
    }
    &>.text{
      color: @icon-color;
    }
  }
  &>.icon{
    height: 55%;
    &>img{
      height:4.6vw;
      margin:1.7vw 0;
      max-width: 5vw;
    }
    &>i{
      font-size: 6.7vw;
      font-weight:400;
    }
  }
  &>.text{
    height: 45%;
    font-size: 2.7vw;
    font-weight: 600;
  }
}

</style>
