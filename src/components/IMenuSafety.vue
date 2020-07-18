<template lang="html">
  <div>
    <ul class="bottom" v-for="(item, key) of list" :key="key">
      <li class="box" v-for="(li, key2) in item" :key="key2" @click="$emit('click', li)" v-if="!li.hidden">
        <div class="left box box-y-center box-col-flex">
          <i class="iconfont" v-if="li.icon" v-html="li.icon"/>
          <img :src="li.src" v-if="li.src"/>
          <span>{{ li.text }}</span>
        </div>
        <div class="icon box box-item" v-if="li.isSwitch">
          <ISwitch :value="li.switchValue" :autoChange="false" @input="Run(li.valueChangeFn, $event)"/>
        </div>
        <div class="icon box box-item" v-if="listType==='slide'">
          <div class="red-point error-bg" v-if="li.redPoint" />
          <span class="box box-item" v-html="li.rightText" />
          <i class="iconfont" v-if="li.rightIcon" v-html="li.rightIcon"/>
          <i class="iconfont" v-else>&#xe612;</i>
        </div>
        <div class="icon box box-item chose" v-if="listType==='chose' && listChosed === li.handle">
          <i class="iconfont" v-if="li.rightIcon" v-html="li.rightIcon"/>
          <i class="iconfont" v-else>&#xe60c;</i>
        </div>
        <div class="half-x-line" :style="{top: linePosition === 'top' ? 0 : null, bottom: linePosition === 'bottom' || !linePosition ? 0 : null, }" />
      </li>
      <div class="half-x-line" v-if="linePosition === 'both'"/>
    </ul>
  </div>
</template>
<script>
import ISwitch from './ISwitch'
export default {
  components: {
    ISwitch,
  },
  data() {
    return {}
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    linePosition: {
      type: String,
      default: 'bottom',
    },
    listType: {
      type: String,
      default: 'slide',   // slide chose
    },
    listChosed: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  methods: {
    Run(name, params) {
      if (this.$Helper.isType(name, () => {})) {
        name.call(this, params)
        return
      }
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .bottom {
    margin-bottom:1vh;
    padding: 0 3vw;
    background: white;
    .half-x-line{
      background: #ccc;
      transform-origin: 0 0;
      transform: scale(1, 0.4);
      -webkit-transform-origin: 0 0;
      -webkit-transform: scale(1, 0.4);
    }
    li {
      // margin-top: 1.2vh;
      height: 15.6vw;
      position:relative;
      // &:before{
      //   content: '';
      //   position:absolute;
      //   left:0;
      //   right:0;
      //   bottom: 0;
      //   height: 1px;
      //   background: #ccc;
      //   transform-origin: 0 0;
      //   transform: scale(1, 0.4);
      //   -webkit-transform-origin: 0 0;
      //   -webkit-transform: scale(1, 0.4);
      // }
      .half-x-line{
        position:absolute;
        left:0;
        right:0;
      }
      .left{
        i{
          font-size: 5.4vw;
          margin-right: 3vw;
        }
      }
      img{
        height:5vw;
        margin-right: 3vw;
      }
      span {
        font-size: 4vw;
        font-weight: 400;
        color:#222;
      }
      .icon{
        // width: 10vw;
        &.chose{
          i{
            color: @icon-color;
            font-size: 4vw;
          }
        }
        span{
          color: @icon-color;
          font-size: 3.4vw;
          font-weight: 400;
        }
        i{
          color: #ccc;
          font-size:3.4vw;
          margin-left: 1vw;
        }
        .red-point{
          height: 2vw;
          width: 2vw;
          border-radius: 100%;
          margin-right: 2vw;
        }
      }
    }
  }

</style>
