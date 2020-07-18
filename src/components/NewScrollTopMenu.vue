<template lang="html">
  <div class="container box">
    <div class="left-btn box box-item" v-if="leftBtnConf.show">
      <i class="iconfont" v-if="leftBtnConf.type === 'icon'" v-html="leftBtnConf.src" />
      <img v-else :src="leftBtnConf.src" alt="left-img" />
    </div>
    <div v-if="whichPage === 'OtcOrder'" class="list-con box box-y-center mescroll-touch-x box-col-flex">
      <ul class="list" :style="{ margin: lessCenter ? '0 auto' : '' }">
        <li @click="changeItem(item)" :class="{active: activeKey === (item.key ? item.key : key), rel:true}" v-for="(item, key) in list" :key="key">{{ $Helper.isType(item, '') ? item : item.text }}
           <em v-if="item.quantity > 0">{{item.quantity}}</em></li>
      </ul>
    </div>
    <div v-if="whichPage === 'AppealOrder'" class="list-con list-con02 box box-y-center mescroll-touch-x box-col-flex">
      <ul class="list" :style="{ margin: lessCenter ? '0 auto' : '' }">
        <li @click="changeItem(item)" :class="{active: activeKey === (item.key ? item.key : key), rel:true}" v-for="(item, key) in list" :key="key">{{ $Helper.isType(item, '') ? item : item.text }}
          <em v-if="item.quantity > 0">{{item.quantity}}</em></li>
      </ul>
    </div>
    <div class="right-btn box box-item" v-if="rightBtnConf.show">
      <i class="iconfont" v-if="rightBtnConf.type === 'icon'" v-html="rightBtnConf.src" />
      <img v-else :src="rightBtnConf.src" alt="right-img" />
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      leftBtnConf: {
        show: false,
        type: 'icon',
        src: '',
        fn: () => {},
      },
      rightBtnConf: {
        show: false,
        type: 'icon',
        src: '&#xe6b3;',
        fn: () => {},
      },
    }
  },
  computed: {},
  props: {
    leftBtn: {
      type: Object,
    },
    rightBtn: {
      type: Object,
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
    activeKey: {
      default: 1,
    },
    lessCenter: {
      type: Boolean,
      default: true,
    },
    whichPage: '', // 申诉 订单页面和OTC页面都调用了此组件,但样式不一致,根据此变量来选择对应的样式
  },
  watch: {},
  methods: {
    changeItem(item) {
      this.$emit('change', item)
    },
  },
  created() {
    if (this.leftBtn) this.leftBtnConf = { ...this.leftBtnConf, ...this.leftBtn, show: true }
    if (this.rightBtn) this.rightBtnConf = { ...this.rightBtnConf, ...this.rightBtn, show: true }
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .container {
    background: white;
    border-bottom: 1px solid #eee;
    height: 11vw;
    ::-webkit-scrollbar {
      background: transparent;
      height: 0;
      display: none;
    }
    .left-btn, .right-btn{
      width: 6vh;
      i{
        color:#111;
        font-size: 4vw;
      }
    }
    .list-con{
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;

      .list{
        white-space: nowrap;

        height: 100%;

        li{
          display: inline-block;
          // vertical-align: middle;
          font-family: sans-serif;
          color: #444;
          font-size: 3.9vw;
          margin-right: 4vw;
          margin-left: 3vw;
          font-weight: 600;
          border-bottom: 2px solid transparent;
          height: 100%;
          line-height: 270%;
          &.active{
            color: @icon-color;
            border-bottom: 2px solid @icon-color;
            // font-size: 4vw;
          }
          em{
            font-weight: normal;
            font-size:2.5vw;
          }
        }
      }
    }

  }
  .container .list-con.list-con02{
    display:flex;
    justify-content: center;
    align-items: center;
  }
  .container .list-con.list-con02 ul li{
    padding:0px 2vw;
    margin-right: 5vw;
    margin-left: 5vw;
  }
</style>
