<template lang="html">
  <div>
    <ul class="bottom" v-for="(item, key) of menuList" :key="key">
      <li class="box" v-for="(li, key2) in item" :key="key2" @click="$emit('click', li)" v-if="!li.hidden">
        <div class="box">
        <div class="left box box-y-center box-col-flex" @click="toggle(li.sublistShow)">
          <i class="iconfont" v-if="li.icon" v-html="li.icon"/>
          <img :src="li.src" v-if="li.src"/>
          <span>{{ li.text }}</span>
        </div>

        <div class="icon box box-item" v-if="li.isSwitch" @click="toggle(li.sublistShow)">
          <ISwitch :value="li.switchValue" :autoChange="false" @input="Run(li.valueChangeFn, $event)"/>
        </div>
        <div class="icon box box-item" v-if="listType==='slide'" @click="toggle(li.sublistShow)">
          <div class="red-point error-bg" v-if="li.redPoint" />
          <span class="box box-item" v-html="li.rightText" />
          <i class="iconfont" v-if="li.rightIcon" v-html="li.rightIcon"/>
          <i class="iconfont" v-else>&#xe612;</i>
        </div>
        <div class="icon box box-item chose" v-if="listType==='chose' && listChosed === li.handle" @click="toggle(li.sublistShow)">
          <i class="iconfont" v-if="li.rightIcon" v-html="li.rightIcon"/>
          <i class="iconfont" v-else>&#xe60c;</i>
        </div>
        </div>
        <div class="bd" style="display:block" >

          <div class="con"   @click="jump(slist)" v-for="(slist, index) in li.sublist"  v-if="slist" v-show="li.sublistShow">
            <div class="half-x-line"/>
            {{slist.name}}
          </div>

        </div>
        <div class="half-x-line" :style="{top: linePosition === 'top' ? 0 : null, bottom: linePosition === 'bottom' || !linePosition ? 0 : null, }" />
      </li>
      <div class="half-x-line" v-if="linePosition === 'both'"/>
    </ul>
  </div>
</template>
<script>
import ISwitch from './ISwitch'
import {mapState} from 'vuex'
export default {
  components: {
    ISwitch,
  },
  data() {
    return {
      menuList: null,
    }
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
  computed: {
    ...mapState('basic', ['uid']),
  },
  watch: {},
  methods: {
    Run(name, params) {
      if (this.$Helper.isType(name, () => {})) {
        name.call(this, params)
        return
      }
    },
    toggle(status) {
      status = !status
    },
    jump(item) {
      if (!this.uid) {
        this.$Helper.jumpPage({ name: 'Login' }, this)
        return
      }
      let url = item.url
      this.$Helper.jumpPage({ name: url }, this)
    },
  },
  created() { this.menuList = this.list },
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

      line-height: 15.6vw;
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
  li.box{
    display: flex;
    flex-direction: column;
  }

  li.box .bd{
    margin-left:8.5vw;
    color:#666;

  }
  li.box .bd .con{


  }
  li.box .bd .con:first-child{
    border-bottom: 1px solid #f5f5f5;
  }
</style>
