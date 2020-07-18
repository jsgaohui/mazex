<template>
  <div id='app' :class="{ko: language === 'ko'}">
    <TopBar v-show="withTopBar"/>
    <!-- <div class="ios-bar" :style="{ background: iosBarColor }"></div> -->
    <transition :name='transitionName' v-if="!errorStatus">
      <keep-alive include="Market,Home">
        <router-view class='router-view' v-if="initOver" img-set="static/favicon.ico" :class="{ 'with-subbar': withSubBar, 'with-topbar': withTopBar,}" :key="$route.name"></router-view>
      </keep-alive>
    </transition>
    <SubBar :list="subArr" :activeKey="$route.name" v-if="initOver" @change="changeSubItem"/>
    <ILayerModel/>
    <Toast/>
    <IComfirm/>

    <IImagePreview/>
    <Loading/>
    <error-status :status="errorStatus" v-if="errorStatus" style="background: #fff"/>
  </div>
</template>

<script>
import SubBar from '@/components/SubBar'
import TopBar from '@/components/TopBar'
import Toast from '@/components/Toast'
import IComfirm from '@/components/IComfirm'
import Loading from '@/components/Loading'
import ILayerModel from '@/components/ILayerModel'
import IImagePreview from '@/components/IImagePreview'
import ErrorStatus from '@/components/ErrorStatus'
import {mapState} from 'vuex'
import { disconnectSocket } from '@/lib/quotation'
import _ from 'lodash'
export default {
  name: 'app',
  components: {
    SubBar,
    Toast,
    TopBar,
    Loading,
    IComfirm,
    ILayerModel,
    IImagePreview,
    ErrorStatus,
  },
  data() {
    return {
      transitionName: null,
      initOver: true,
      errorStatus: null,
      setLanguageSuccess: false,
      fetchedAgain: false,
    }
  },
  watch: {
    '$route'(to, from) {
      // 路由变化时动态修改动画
      let toDeep = this.$Helper.getRouteIndex(to.name)
      let fromDeep = this.$Helper.getRouteIndex(from.name)
      let transitionName = toDeep > fromDeep ? 'slide-left' : (toDeep < fromDeep ? 'slide-keep-right' : 'fade')
      if (to.name === 'Login' && from.name !== 'Register') transitionName = 'slide-keep-top'
      if (from.name === 'Login' && to.name !== 'Register') transitionName = 'slide-left'
      this.transitionName = transitionName
      // 重置title
      // reset the customTitle
      this.$Helper.emitAction('setCustomTitle', null)
      // hide the loading
      this.$Helper.emitAction('loading', { show: false })
      // 派发一个disconnect事件
      // 如果跳转的是一个引入了basixmixin的路由
      // mixin中的creatd钩子会重新监听socket
      // 反之，会被销毁
      // when route change, dispatch a disconnect socket action, if 10s not listener stop the action, the socket will be disconnect
      disconnectSocket()
    },
    language() {
      // 设定语言
      this.setLanguage()
    },
  },
  computed: {
    ...mapState('setting', ['language']),
    withSubBar() {
      return this.subArr.map(item => item.key).indexOf(this.$route.name) !== -1
    },
    withTopBar() {
      return this.$Helper.getRouteIndex(this.$route.name) > 5
    },
    subArr() {
      // let autoTradekey = 'Fund'
      let domain = document.domain
      if (!domain) {
        domain = 'udax.pro'
      }
      if (domain.indexOf('udax.kr') !== -1) {
        // autoTradekey = 'AutoTrade'
      }
      return [
        {
          icon: '&#xeb1b;',
          text: this.$t('subbar.home'),
          key: 'Home',
        },
        // {
        //   icon: '&#xe64e;',
        //   text: this.$t('subbar.fb'),
        //   key: 'OTC',
        // },
        {
          icon: '&#xe615;',
          text: this.$t('subbar.transaction'),
          key: 'Transaction',
        },
        // {
        //   icon: '&#xe6a2;',
        //   text: this.$t('at.autoTrade'),
        //   key: autoTradekey,
        // },
        {
          icon: '&#xe632;',
          text: this.$t('subbar.account'),
          key: 'Account',
        },
      ]
    },
  },
  methods: {
    setLanguage() {
      let language = this.language || this.$Helper.getNavigatorLanguage()
      this.$i18n.locale = language
    },
    changeSubItem(item) {
      this.$Helper.jumpPage(item, this)
    },
    goApp() {
      this.$Helper.jumpPage(name, this)
    },
    // 初始化页面时请求基本信息，这个方法只会调用一次
    // 数据会被同步到store,全局公用
    initList() {
      // show loading
      setTimeout(() => this.$Helper.emitAction('loading', { show: true }), 100)
      return this.$Helper.ajax({
        url: '/app/trade/appQuotation.api',
        params: {},
      })
      .then(
        ({data}) => {
          let { resultMap, lastPrices, rateList, currencyRate, sellteMarket } = data || {}
          // update the store
          this.$store.dispatch('quotation/refreshData', { rateList, lastPrices, symbolMap: resultMap, currencyRate, sellteMarket })
          setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 200)
        },
        () => {
          // fetch again after 2 second
          // 初次调用时如果调用失败，2s后重新调用，若再失败显示error界面
          if (!this.fetchedAgain) {
            setTimeout(() => {
              this.initList().then(
                () => {
                  if (!this.symbolMap) {
                    this.errorStatus = 'error'
                    this.$Helper.emitAction('loading', { show: false })
                  }
                },
              )
            }, 2000)
          }
          this.fetchedAgain = true
        },
      )
    },
  },
  created() {
    // set language
    this.setLanguage()
    // set cache
    if (!_.get(this.$Helper.getCache('setting'), 'language')) {
      this.$store.dispatch('setting/setData', { language: this.language })
    }
    // get basic trade info
  //  this.initList()
  },
}
</script>

<style lang="less">
@import url('./theme/index.less');
.right-color{
  color: #03C087 !important;
}
.error-color{
  color: #F55858 !important;
}
.right-bg{
  background-color: #03C087 !important;
}
.error-bg{
  background-color: #F55858 !important;
}
.right-border{
  border-color: #03C087;
}
.error-border{
  border-color: #F55858;
}
.blue{
  color:#64acf5;
}
/** 清除内外边距 **/
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
pre, /* text formatting elements 文本格式元素 */
form, fieldset, legend, button, input, textarea, /* form elements 表单元素 */
th, td /* table elements 表格元素 */ {
  margin: 0;
  padding: 0;
}


/** 设置默认字体 **/
body,
button, input, select, textarea /* for ie */ {
  font-family:-apple-system, BlinkMacSystemFont, Helvetica Neue,Tahoma,PingFangSC-Regular,Hiragino Sans GB,Microsoft Yahei,Arial,sans-serif;
  font-weight: 400;
}
h1, h2, h3, h4, h5, h6 { font-size: 100%; }
address, cite, dfn, em, var { font-style: normal; } /* 将斜体扶正 */
code, kbd, pre, samp { font-family: courier new, courier, monospace; } /* 统一等宽字体 */
small { font-size: 12px; } /* 小于 12px 的中文很难阅读，让 small 正常化 */

/** 重置列表元素 **/
ul, ol { list-style: none; }

/** 重置文本格式元素 **/
a { text-decoration: none; }
a:hover { text-decoration: none; }


/** 重置表单元素 **/
legend { color: #000; } /* for ie6 */
fieldset, img { border: 0; } /* img 搭车：让链接里的 img 无边框 */
button, input, select, textarea { font-size: 100%; } /* 使得表单元素在 ie 下能继承字体大小 */
/* 注：optgroup 无法扶正 */

/** 重置表格元素 **/
table { border-collapse: collapse; border-spacing: 0; }
input{
  background: transparent;
  box-shadow: none;
  outline: none;
  border: none;
  font-size: 3.6vw;
  &::-webkit-input-placeholder {
    color: #c0c0c0;
    letter-spacing: 0;
    font-weight: 400;
    // font-size: 3.4vw;
  }
}

.mescroll{
  height: auto !important;
}
/*定义基础类*/

*,
body,
p {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;
  -webkit-touch-callout:none;
  // user-select: none;
  // -webkit-user-select:none;
  -webkit-tap-highlight-color:transparent;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

html,
body {
  height: 100%;
  overflow: hidden;
  // padding-top:10px;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}

img[src=""],img:not([src]){opacity:0;}
@font-face {
  font-family: iconfont;
  src: url(../static/fonts/iconfont.eot);
  src: url(../static/fonts/iconfont.eot#iefix) format("embedded-opentype"),
  url(../static/fonts/iconfont.woff) format("woff"),
  url(../static/fonts/iconfont.ttf) format("truetype"),
  url(../static/fonts/iconfont.svg#iconfont) format("svg")
}
.iconfont{
  font-family:"iconfont" !important;
  font-size:16px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @icon-color;
  font-size: 4vw;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


#app {
  color: #646da9;
  width: 100%;
  height: 100%;
  font-size: 3.4vw;
  position: relative;
  background: #fff;
  &.ko{
    .right-color{
      color: #d60000 !important;
    }
    .error-color{
      color: #0051c7 !important;
    }
    .right-bg{
      background-color: #d60000 !important;
    }
    .error-bg{
      background-color: #0051c7 !important;
    }
    .right-border{
      border-color: #d60000;
    }
    .error-border{
      border-color: #0051c7;
    }
  }
}

.ios-bar{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 20px;
}
.router-view {
  // transition: all 400ms cubic-bezier(.55, 0, .1, 1);
  transition: all 200ms linear;
  // transition-property: opacity;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #f2f4f5;
  // height: 100%;
  z-index: 10;
  &.with-subbar{
    bottom:13.5vw;
  }
  &.with-topbar{
    top:12vw;
  }
  // &.isIos{
  //   margin-top: 20px;
  // }
  // &.isAndroid{
  //   margin-top: 25px;
  // }
}


.dplayer-logo{
  top:1vh !important;
  left:1vh !important;
  img{
    width: 8vw;
  }
}

.mescroll-empty{
  margin: 0 !important;
  padding: 5vh 0 !important;
  img{
    width: 20vw !important;
  }
  .empty-tip{
    font-size: 3vw !important;
  }
}

.showMenu-content{
  padding:2vh 1vw;
  *{
    font-size: 3.4vw !important;
    color: #333 !important;
    font-weight: 100 !important;
  }
  p{
    padding:10px 0;
  }
  img{
    width: 100% !important;
  }
}

// .mescroll-upwarp{
//   display: none;
// }



/*transition*/


.fade-enter-active,
.fade-leave {
  opacity: 1
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}


.slide-left-enter,
.slide-keep-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter,
.slide-keep-right-enter {
  opacity: 1;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}

.slide-top-enter,
.slide-keep-top-enter,
.slide-bottom-leave-active {
  opacity: 0;
  -webkit-transform: translate(0, 100%);
  transform: translate(0, 100%);
}

.slide-top-leave-active,
.slide-bottom-enter,
.slide-keep-bottom-enter {
  opacity: 1;
  -webkit-transform: translate(0, -100%);
  transform: translate(0, -100%);
}

.scale-min-enter,
.scale-max-leave-active {
  opacity: 0;
  -webkit-transform: scale(1.2, 1.2);
  transform: scale(1.2, 1.2);
}

.scale-min-leave-enter,
.scale-max-enter {
  opacity: 0;
  -webkit-transform: scale(0.8, 0.8);
  transform: scale(0.8, 0.8);
}

.h-button {
  height: 13vw;
  color: white;
  font-size: 4.8vw;
  font-weight: 600;
  border-radius: 5px;
  background: #aaa;
  transition: all 0.4s;
  &.active{
    background: @icon-color;
  }
}

.c-tag{
  display: inline;
  color:#fff;
  border-radius: 6vw;
  background: linear-gradient(to right, #25c2f7, #1da0f2);
  // line-height: 200%;
  vertical-align: center;
  font-size: 2.3vw;
  padding:0.5vh 3vw;
  &[fill="0"] {
    background: transparent !important;
    border: 1px solid #25c2f7;
    color: #1da0f2;
    &[type='danger'] {
      border: 1px solid #f79595;
      color: #F56C6C;
    }
    &[type='warning'] {
      border: 1px solid #efb762;
      color: #E6A23C;
    }
  }
  &[size="mini"] {
    font-size: 2vw;
    padding:0.25vh 2.5vw;
  }
  &[size="small"] {
    font-size: 2.2vw;
    padding:0.45vh 2.7vw;
  }
  &[size="big"] {
    padding: 0.8vh 3.4vw;
    font-size: 2.4vw;
  }
  &[type='danger'] {
    background: linear-gradient(to right, #f79595, #F56C6C);
  }
  &[type='warning'] {
    background: linear-gradient(to right, #efb762, #E6A23C);
  }
  &[type='blank'] {
    background: rgba(0,0,0,0.3)
  }
}

.empty-status{
  font-size: 3.2vw;
}

.overflow-x {
  overflow-x: auto;
  overflow-y: hidden;
}

.overflow-y {
  overflow-x: hidden;
  overflow-y: auto;
}

.overflow-xy {
  overflow-x: auto;
  overflow-y: auto;
}


.box {
  display: -webkit-box;
  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
  display: -moz-box;
  /* 老版本语法: Firefox (buggy) */
  display: -ms-flexbox;
  /* 混合版本语法: IE 10 */
  display: -webkit-flex;
  /* 新版本语法: Chrome 21+ */
  display: flex;
  /* 新版本语法: Opera 12.1, Firefox 22+ */

  // 默认水平布局
  -moz-box-orient: horizontal; /*Firefox*/
  -webkit-box-orient: horizontal; /*Safari,Opera,Chrome*/
  box-orient: horizontal;
  flex-direction:row;
  -webkit-flex-direction:row;
}

.box-x-center {
  -webkit-box-pack: center;
  -moz-justify-content: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.box-x-left {
  -webkit-box-pack: start;
  -moz-justify-content: flex-start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
}

.box-x-right {
  -webkit-box-pack: end;
  -moz-justify-content: flex-end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
}

.box-x-right-flex {
  display: -webkit-box;
  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
  display: -moz-box;
  /* 老版本语法: Firefox (buggy) */
  display: -ms-flexbox;
  /* 混合版本语法: IE 10 */
  display: -webkit-flex;
  /* 新版本语法: Chrome 21+ */
  display: flex;
  /* 新版本语法: Opera 12.1, Firefox 22+ */

  // 默认水平布局
  -moz-box-orient: horizontal; /*Firefox*/
  -webkit-box-orient: horizontal; /*Safari,Opera,Chrome*/
  box-orient: horizontal;
  flex-direction:row;
  -webkit-flex-direction:row;
  -webkit-flex: 1;        /* Chrome */
  -ms-flex: 1;             /* IE 10 */
  flex: 1;                /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 1;     /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 1;       /* OLD - Firefox 19- */
  width: 1%;
  -webkit-box-pack: end;
  -moz-justify-content: flex-end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
}

.box-y-center {
  display: -webkit-box;
  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
  display: -moz-box;
  /* 老版本语法: Firefox (buggy) */
  display: -ms-flexbox;
  /* 混合版本语法: IE 10 */
  display: -webkit-flex;
  /* 新版本语法: Chrome 21+ */
  display: flex;
  /* 新版本语法: Opera 12.1, Firefox 22+ */

  // 默认水平布局
  -moz-box-orient: horizontal; /*Firefox*/
  -webkit-box-orient: horizontal; /*Safari,Opera,Chrome*/
  box-orient: horizontal;
  flex-direction:row;
  -webkit-flex-direction:row;
  -webkit-box-align: center;
  -moz-align-items: center;
  -webkit-align-items: center;
  align-items: center;
}


.box-y-bottom {
  -webkit-box-align: end;
  -moz-align-items: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;
}

.box-item {
  -webkit-box-pack: center;
  -moz-justify-content: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -moz-align-items: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-flex: 1.0;
  -moz-flex-shrink: 0;
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
  -moz-box-orient: horizontal; /*Firefox*/
  -webkit-box-orient: horizontal; /*Safari,Opera,Chrome*/
  box-orient: horizontal;
  flex-direction:row;
  -webkit-flex-direction:row;
}


.box-wrap {
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  -moz-box-lines: multiple; /*Firefox*/
  -webkit-box-lines: multiple; /*Safari,Opera,Chrome*/
  box-lines: multiple;
}
// 垂直排列
.box-row{
  -moz-box-orient: vertical; /*Firefox*/
  -webkit-box-orient: vertical; /*Safari,Opera,Chrome*/
  box-orient: vertical;
  flex-direction:column;
  -webkit-flex-direction:column;
}

.box-row-flex {
  -webkit-flex: 1;        /* Chrome */
  -ms-flex: 1;             /* IE 10 */
  flex: 1;                /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 1;     /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 1;       /* OLD - Firefox 19- */
  height: 1%;
}

.box-col-flex {
  -webkit-flex: 1;        /* Chrome */
  -ms-flex: 1;             /* IE 10 */
  flex: 1;                /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 1;     /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 1;       /* OLD - Firefox 19- */
  width: 1%;
}

.box-space-bettwen{
  -webkit-box-pack: justify;
  -moz-justify-content: space-between;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-box-align: center;
  -moz-align-items: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-flex: 1.0;
  -moz-flex-shrink: 0;
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
}

.box-col-1 {
  width: (1/12)*100%;
}

.box-col-2 {
  width: (2/12)*100%;
}

.box-col-3 {
  width: (3/12)*100%;
}

.box-col-4 {
  width: (4/12)*100%;
}

.box-col-5 {
  width: (5/12)*100%;
}

.box-col-6 {
  width: (6/12)*100%;
}

.box-col-7 {
  width: (7/12)*100%;
}

.box-col-8 {
  width: (8/12)*100%;
}

.box-col-9 {
  width: (9/12)*100%;
}

.box-col-10 {
  width: (10/12)*100%;
}

.box-col-11 {
  width: (11/12)*100%;
}

.box-col-12 {
  width: (12/12)*100%;
}

.box-offset-1 {
  margin-left: (1/12)*100%;
}

.box-offset-2 {
  margin-left: (2/12)*100%;
}

.box-offset-3 {
  margin-left: (3/12)*100%;
}

.box-offset-4 {
  margin-left: (4/12)*100%;
}

.box-offset-5 {
  margin-left: (5/12)*100%;
}

.box-offset-6 {
  margin-left: (6/12)*100%;
}

.box-offset-7 {
  margin-left: (7/12)*100%;
}

.box-offset-8 {
  margin-left: (8/12)*100%;
}

.box-offset-9 {
  margin-left: (9/12)*100%;
}

.box-offset-10 {
  margin-left: (10/12)*100%;
}

.box-offset-11 {
  margin-left: (11/12)*100%;
}

.box-no-shrink{
  -moz-flex-shrink: 0;
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
}


.half-x-line {
  height: 1px;
  background: #eee;
  transform-origin: 0 0;
  transform: scale(1, 0.7);
  -webkit-transform-origin: 0 0;
  -webkit-transform: scale(1, 0.7);
  &[size="mini"]{
    transform: scale(1, 0.4);
    -webkit-transform: scale(1, 0.4);
  }
  &.dark{
    background: #555;
  }
}

.half-y-line {
  width: 1px;
  height: 100%;
  background: #333;
  transform-origin: 0 0;
  transform: scale(.7, 1);
  -webkit-transform-origin: 0 0;
  -webkit-transform: scale(.7, 1);
  &[size="mini"]{
    transform: scale(0.3, 1);
    -webkit-transform: scale(0.3, 1);
  }
}

.Iinput {
  display: block;
  background: transparent;
  box-shadow: none;
  outline: none;
  border: none;
  color: #2c3e50;
  font-size: 4vw;
  letter-spacing: 1px;
  font-weight: 500;
  width: 100%;
  height: 100%;
  &::-webkit-input-placeholder {
    color: #c0c0c0;
    letter-spacing: 0;
    font-weight: 400;
    font-size: 3.4vw;
  }
}


.Ilabel {
  color: #5d5e5e;
  font-size: 14px;
  font-weight: bold;
}

.layer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.no-touch {
  pointer-events: none;
}

.cursor {
  cursor: pointer;
}

.overtext {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.overtext2{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bac-image {
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.bottom-btn{
  position: absolute;
  bottom: 5vh;
  left: 0;
  right: 0;
  height: 11vw;
  width: 90vw;
  margin:0 auto;
  background: #a6a6a6;
  color: white;
  font-size: 4.2vw;
  font-weight: 600;
  border-radius: 2px;
  transition: all 0.4s;
  &.active{
    background: @icon-color;
  }
}


.h-tag {
  background: #ecf0f1;
  display: inline-block;
  height: 22px;
  line-height: 23px;
  padding: 0 12px;
  border-radius: 22px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 3px;
  margin-bottom: 5px;
}

.h-tag.active {
  background: #95a5a6;
  color: white;
}

.h-btn {
  border: 1px solid #ccd2d4;
  display: inline-block;
  height: 22px;
  line-height: 21px;
  padding: 0 5px;
  border-radius: 1px;
  cursor: pointer;
  margin-right: 3px;
  font-size: 12px;
}

.h-btn.md {
  height: 25px;
  line-height: 24px;
  padding: 0 10px;
}

.h-y-btn {
  height: 32px;
  width: 70px;
  border-radius: 26px;
  background: #81868c;
  color: white;
  font-size: 16px;
  cursor: pointer;
  line-height: 100%;
}

.ts-btn {
  width: 60vw;
  height: 5.6vh;
  background: #bbbbbb;
  color: white;
  border-radius: 1vw;
  font-size: 4vw;
}

.ts-btn.active {
  background: #ff7373;
}

.border-red {
  border: 1px solid red;
}

.border-black {
  border: 1px solid black;
}

.bottom-border{
  position: relative;
  overflow: auto;
  &:before{
    content: '';
    position: absolute;
    bottom: 1px;
    left:0;
    right:0;
    height: 1px;
    background: #999;
    transform-origin: 0 0;
    transform: scale(1, 0.5);
    -webkit-transform-origin: 0 0;
    -webkit-transform: scale(1, 0.5);
    z-index: 2;
  }
}


#post_edit_container{
  color:#4a4a4a !important;
  font-size:4vw;
  word-break: break-all;
  text-align:justify;
}

#post_edit_container h1{
  font-size:6vw !important;
  margin:1vh 0;
  font-weight: 700 !important;
}
#post_edit_container h2{
  font-size:5.5vw !important;
  margin:1vh 0;
  font-weight: 600 !important;
}
#post_edit_container h3{
  font-size:5vw !important;
  margin:1vh 0;
  font-weight: 500 !important;
}
#post_edit_container h4{
  font-size:4.5vw !important;
  margin:1vh 0;
  font-weight: 400 !important;
}
#post_edit_container h5{
  font-size:4.2vw !important;
  margin:1vh 0;
  font-weight: 400 !important;
}

#post_edit_container p{
  margin:2vh 0;
  padding:0 2vw;
  color:#4a4a4a !important;
}

#post_edit_container p,#post_edit_container div,#post_edit_container span{
  font-size:4vw!important;
  word-break: break-word!important;
  text-align:justify!important;
  background:none!important;
  font-weight: 300 !important;
}

#post_edit_container img{
  width:90%!important;;margin:2vh 5%!important;;
}

#post_edit_container li {
  list-style: none;
}

#post_edit_container a {
  text-decoration: none;
  color:#4a4a4a !important;
}
#post_edit_container video{
  width:89vw;
  margin:2vh 2.7%;
  height:50vw;
  background: rgba(0,0,0,0.1);
}


/*OTC.css*/

/*等级*/
.v1,.v2,.v3{
  font-size:3.5vw;
  margin-left:1vw;
}
.v1{
  color:#52a583
}
.v2{
  color:#04a6ff
}
.v3{
  color:#ce008e
}

.container .head {
  height: 12vw;
  background: #fff;
  padding: 0 2vw;
}
.container .head .name{
  font-size: 4.6vw;
  font-weight: 600;
  color: #646da9;
}
img,object{max-width:100%}
img {
  height: auto;
  width: auto\9;
  //width:100%;
  -ms-interpolation-mode: bicubic;
  vertical-align:top;
} /*图片自适应*/

.rel{
  position: relative;
}
.color-sell{
  color:#ff0000
}
.color-buy{
  color:#03C087
}
.icon-addpay:before{
  content: "\e67f";
}
.gray-line{
  background: #efeff3;
  height:2vw;
}
.font-blue{
  color:#646da9
}


.bottom-btn02{
  text-align: center;
  height: 11vw;
  line-height: 11vw;
  width: 100%;
  margin: 0 auto;
  background: #bbb;
  color: #fff;
  font-size: 4.2vw;
  font-weight: 600;
  transition: all .4s;
}
.bottom-btn02.active{
  background:#646da9
}

.tabBar a{
  position: relative;
}
.tabBar a em{
  background:#f00;
  width:4vw;
  height:4vw;
  line-height:4vw;
  border-radius: 50%;
  font-size:2.8vw;
  color:#fff;
  position: absolute;
  right:-2vw;
  top:0;
}



.head .right.font-blue{
  font-size:4.2vw;
}
.otc-list-con .list{
  background: #fff;
  margin:3vw;
  color:#869aa8;
  border-radius: 1vw;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
}
.otc-list-con .list .hd,.tactics-main .list .hd{
  padding:0px 4vw;
  height:12vw;
  font-size:4.5vw;
}
.otc-list-con .list .bd,.tactics-main .list .bd{
  padding:4vw;
  line-height:6vw;
  font-size:3.6vw;
}
.otc-list-con .list .bd02{
  padding:2vw 4vw;
}
.otc-list-con .list .bd02 div:first-child{
  margin-right:2vw;
}
.otc-list-con .more{
  padding-top:1.6vw;
}
.otc-list-con .more i{
  color:#8fa1ae
}
.pay-icon{
  height: 6vw;
  width: 6vw;
  margin-left:2.5vw;
  border-radius: 50%;
  text-align: center;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
}
.pay-icon i{
  font-size:6vw;
}
.icon-card:before{
  content: "\e631"
}
.icon-alipay:before{
  content: "\e65f"
}
.icon-wechat:before{
  content: "\e652"
}
.icon-visa:before{
  content: "\e664"
}
.icon-paypal:before{
  content: "\e633"
}
.icon-westernunion:before{
  content: "\e649"
}
.icon-swift:before{
  content: "\e63f"
}
.icon-paynow:before{
  content: "\e640"
}
.icon-paytm:before{
  content: "\e642"
}
.icon-qiwi:before{
  content: "\e645"
}
.icon-interac:before{
  content: "\e646"
}
.icon-imps:before{
  content: "\e64a"
}
.icon-upi:before{
  content: "\e64b"
}
.pay-btn-icon i{
  font-size:7vw
}
.pay-btn-icon{
  margin-left:5vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.card-bg i{
  color:#ffb669
}
.alipay-bg i{
  color:#00bbee;
}
.wechat-bg i{
  color:#47b24a;
}
.visa-bg i{
  color:#7888bb;
}
.paypal-bg i{
  color:#0179c0;
}
.westernunion-bg i{
  color:#ffda31;
}
.swift-bg i{
  color:#7c6f69;
}
.paynow-bg i{
  color:#fb7c13;
}
.paytm-bg i{
  color:#02306c
}
.qiwi-bg i{
  color:#fd9907
}
.interac-bg i{
  color:#1e1a0f
}
.imps-bg i{
  color:#1c62a0
}
.upi-bg i{
  color:#01b8fc
}


.tip-box .tip-con .pay-icon{
  margin-right:5vw;
}

[type='checkbox'],[type='radio']  {
  background-color: #fff;
}
[type='checkbox'] + label:before,[type='radio'] + label:before {
  border: 1px solid #03c087;
  background: #fff;
}
[type='checkbox'] + label:after,[type='radio'] + label:after {
  color: #fff;
  filter:alpha(opacity=10);
}
[type='checkbox'] + label:hover:before,[type='radio'] + label:hover:before {
  border-color: #03c087;
}
[type='checkbox']:checked + label:after,[type='radio']:checked + label:after {
  background-color: #fff;
  border: 1px solid #03c087;
  color: #03c087;
}

input.small[type='checkbox']:not(:checked) + label:after {
  opacity: 0;
  transform: scale(0);
}
input.small[type='checkbox']:checked + label:after {
  opacity: 1;
  transform: scale(1);
}
input.input_text:read-only {
  border-color: #eeefef;
}

.pay-icon  input.small[type='checkbox'],.pay-icon  input.small[type='radio']{
  box-sizing: border-box;
  width: 2.5vw;
  height: 2.5vw;
  position: absolute;
  left: -999999px;
}
.pay-icon input.small[type='checkbox'] + label,.pay-icon  input.small[type='radio'] + label{
  font-size: 2vw;
  position:relative;
  display: inline-block;
  padding-left: 0;
  cursor: pointer;
  text-align:center;
}
.pay-icon input.small[type='checkbox'] + label:before,.pay-icon  input.small[type='radio'] + label:before{
  content: ' ';
  position: absolute;
  right: 0vw;
  bottom: 0vw;
  width:3vw;
  height:3vw;
  box-sizing: border-box;
  font-size:2vw
}
.pay-icon input.small[type='checkbox'] + label:after,.pay-icon  input.small[type='radio'] + label:after{
  content: "\2713";
  font-size: 4vw;
  line-height: 0.5;
  display: inline-block;
  height: 2.5vw;
  width: 2.5vw;
  text-align: center;
  position: absolute;
  right: 0;
  bottom: 0;
  transition: all .2s ease-in-out;
}

/*发布委托*/
.sell-tab{
  background:#646da9;
  width:50%;
  border:1px solid #646da9
}
.sell-tab span{
  width:50%;
  height:6.6vw;
  line-height:6.6vw;
  display:block;
  text-align: center;
  color:#fff;
  font-size:4vw;
}
.sell-tab span.active{
  background:#fff;
  color:#646da9
}

.issue-topnav{
  background: #646da9;
  color:#646da9;
  font-size:3.2vw;
  padding:1px;
  width:24vw;
  height:5.4vw;
  line-height:5vw;
}
.issue-topnav li{
  text-align: center;
  width:50%;
  background: #fff;
}
.issue-topnav li.active{
  background:none;
  color:#fff
}
.issue-con{

  padding:4vw;
  font-size:4vw;
  color:#869aa8;
}
.issue-top{
  background: #f8fafc;
  color:#869aa8;
}
.issue-top .txt{
  padding:0px 4vw;
  border-bottom:1px solid #fff;
}
.issue-top .txt h5{
  font-size:5vw;
  padding:3vw 0px;
  font-weight: normal
}
.issue-top .txt h5 em{
  color:#1f405a;
}
.issue-top .txt span{
  font-size:3.5vw;
  padding-top:5vw;
}
.issue-top .info{
  padding:3vw 5vw;
  font-size:3.8vw;
  flex-wrap:wrap
}
.issue-top .info span{
  margin-right:1vw;
}
.issue-form .txt{
  font-size:4vw;
  color:#455070;
  font-weight: bold;
  padding:2vw 0px;
}
.input-t{
  background: #f8fafc;
  height:8vw;
  padding-left:2vw;
}
.issue-form .input-block{
  margin-bottom:2.5vw;
  display:flex;
  justify-content: space-between;
  align-items: center;
}
.issue-form label{
  font-size: 3.6vw;
}
.issue-form .input-t{
  width:80%;
}
.issue-form .input-block .rel span{
  position: absolute;
  right:0px;
  top:0px;
  background:#d0d9de;
  width:8vw;
  height:8vw;
  display: flex;
  justify-content: center;
  align-items: center
}
.issue-form .input-block .rel .input-t{
  width:100%;

}
.issue-form .input-block .rel em.time{
  position: absolute;
  right:2vw;
  top:1.8vw;
  color:#c7c7cd;
  font-size:3vw;
}
.issue-form span.pay-btn{
  border:1px solid #869aa8;
  border-radius: 4px;
  padding:1.5vw 4vw;
  display:inline-block;
  text-align: center;
  margin-right: 2vw;
  font-size:3.6vw;
}
.issue-form span.pay-btn.active{
  background:#646da9;
  color:#fff;
  border-color:#646da9;
}


.otc-buycon{
  padding:4vw;
}
.otc-buycon .from-main{
  padding:0vw;
}
.from-box{
  border:1px solid #dfdfdf;
  background:#fff;
  height:24vw;
}
.from-box .left{
  padding:0;
  background:#fff;
}
.from-box .left i{
  color:#dfdfdf;
  font-size:8vw;
}
.from-box .line{
  background:#dfdfdf;
  height:1px;
}
.from-box .right{
  width:84vw;
}
.from-box .input-t{
  height:11.5vw;
  background:#fff;
}
.from-box .input-t input{
  height:11.5vw;
  font-size:4vw;
  background:#fff;
}
.from-box .input-t span{
  background:#d0d9de;
  width:12vw;
  min-width: 12vw;
  max-width: 12vw;
  height:12vw;
  text-align:center;
  padding-top:3vw;
}
.from-box .input-t i{
  color:#fff;
  font-size:6vw;
  padding-top:1.8vw;
}
.from-box .input-t i.icon-pwd{
  font-size:5vw;
  color:#c7c7cd;
}
.from-box .info{
  height:11vw;
  color:#a9adbe;
  font-size:4.2vw;
  padding-right:2vw;
}
.from-main p{
  padding:3vw 0;
  text-align: right;
  color:#a1b2bf;
}

.otc-buycon .from-box.pwd{
  height:13vw;
  margin-top:4vw;
}
.otc-buycon .from-box.pwd .input-t span{
  background: none;
  width:inherit;
  height: inherit;
  padding:0;
  font-size:4vw;
  color:#1f3b60;
  line-height:13vw;
  padding-right:2vw;
}
.otc-btn div{
  width:48%;
  flex-grow: 1;
  height:11vw;
  line-height:11vw;
  font-size:4.5vw;
  text-align: center
}

.btn-cancel{
  background:#ebf0f8;
  color:#646da9;

}
.btn-order{
  background:#cfd9de;
  color:#fff;
  margin-left:2vw;
}
.btn-look{
  background:#646da9;
  color:#fff;

}
.check-wrapper{
  padding:3vw 0;
}
.checkbox-wrapper{
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  user-select: none;
}
.checkbox-input{
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;
}
.checkbox-inner {
  display: inline-block;
  position: relative;
  border-radius: 2vw;
  box-sizing: border-box;
  width: 4vw;
  height: 4vw;
  background-color: #409eff;
  z-index: 1;
  transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}
.checkbox-input.is-checked .checkbox-inner {
  background-color: #409eff;
  border-color: #fff;
}
.checkbox-inner:after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 2.5vw;
  left: 1.2vw;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 1.2vw;
  transition: transform .15s ease-in .05s;
  transform-origin: center;
}
.checkbox-input.is-checked .checkbox-inner:after {
  transform: rotate(45deg) scaleY(1);
}
.checkbox-original {
  opacity: 0;
  outline: none;
  position: absolute;
  margin: 0;
  width: 0;
  height: 0;
  z-index: -1;
}
.checkbox__label {

  padding-left: 0px;
  line-height: 19px;
  font-size: 4vw;
}

.screen-list .screen-box{
  background:#fff;
  height: 14vw;
  margin-top:4vw;
  font-size:4vw;
  padding:0 4vw;
}
.screen-list .screen-box .icon i{
  color:#cdd4d9
}
.screen-box .text{
  color:#1f3b60;
}
.screen-box .input{
  color:#999;
}
.reset{
  padding:4vw 4vw 0 0;
  text-align: right;
  color:#646da9;
  font-size:4.2vw;
}
.payment-con{
  padding:4vw;
}
.money-box{
  background: #f8fafc;
  padding:0px 3.5vw;
}
.money-box .left{
  font-size:3.6vw;
  color:#8196a5;

  width:80%;
}
.money-box .left .box{
  padding-right:4vw;
  height:12vw;
}
.money-box .left span{
  color:#1f405a
}
.money-box .line{
  border-color:#fff;
}
.money-box .coin-icon{
  margin-left:3vw;
  width:12vw;
  text-align: right
}
.money-box .coin-bg{
  width:12vw;
  height:12vw;
  border-radius: 50%;
  background:#d1ddf2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.money-box .coin-bg i{
  font-size: 8vw;
  color:#fff;
}
.pay-info{
  background: #f8fafc;
  margin-top:4vw;
  margin-bottom:4vw;
  padding:5px 4vw;
}
.info-box{
  background: #f8fafc;
  padding:4vw;
  margin-top:3vw;
  line-height:6vw;
  color:#8398a6;
  font-size:3.5vw;
  margin-bottom:4vw;
}
.info-box i{
  color:#d7e5ef;
  font-size:6vw;
  margin:0 3vw;
  margin-right:6vw;

}
.pay-txt{
  padding:2vw 0;
  padding-top:6vw;
  color:#455070;
  font-size:4.2vw;
}
.pay-txt .pay-icon{
  margin-right:2vw;
}
.pay-td{
  display:flex;
  justify-content: space-between;
  align-items: center;
  height: 8vw;
  font-size:3.6vw;
}
.pay-td label{
  color:#8196a5;
}
.pay-td span{
  color:#1f405a;
  text-align: right;
}
.pay-td div em{
  margin-left:2vw;
  text-align: right;
  word-break:keep-all;
  color:#64acf5;
}
.paid-box{
  padding:6vw 0;
}
.paid-box .txt{
  font-size:7vw;
  color:#646da9;
  margin-bottom:3vw;
}
.paid-box .txt i{
  font-size:7.8vw;

}
.paid-box p{
  color:#8196a5;
  font-size:4vw;
}
.paid-box p span{
  color:#1f405a;
}
.time-td{
  padding:3vw 0 2vw 0;
}
.time-td i{
  font-size:5vw;
  margin-right:3vw;
}
.hint-box{
  background:#646da9;
  padding:0 4vw;
  color:#fff;
  border-radius: 0.5vw;
  position:absolute;
  right:-3vw;
  top:13vw;
  width:40vw;
  z-index: 99;
}
.angle {
  position: absolute;
  top: -14px;
  right: 39px;
  border: 7px solid transparent;
  border-bottom-color: #f2f2f2;
  margin-right: 0px;
}
.angle:after {
  content: '';
  position: absolute;
  top: -5px;
  left: -7px;
  border: 7px solid transparent;
  border-bottom-color: #646da9;
}
.hint-box ul{
  font-size:4vw;
  line-height: 12vw;
}
.hint-box ul li{
  display: flex;
  justify-content: flex-start;
  align-items: center
}
.hint-box ul li:nth-of-type(2){
  border-top:1px solid #fff;
}
.hint-box ul li i{
  color:#fff;
  margin-right:2vw;
  font-size:5vw;
}

/*订单*/
.list-con li.rel em{
  background: #ff0000;
  font-size:2.5vw;
  color:#fff;
  position: absolute;
  right:-4.5vw;
  top:1vw;
  display:inline-block;
  min-width: 4vw;
  height:4vw;
  line-height:4vw;
  border-radius: 2vw;
  padding:0 0.5vw;
  text-align: center
}
.order-rel{
  position: relative;
  width:9vw;
  height:9vw;
  margin-right:2vw;
}
.order-rel span{
  position:absolute;
  top:0;
  left:0;
  width:9vw;
  height:9vw;
  line-height:9vw;
  text-align:center;
  color:#fff;
  font-size:3vw;

}


.tip-bg{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.6);
}
.tip-top{
  position: relative;
}

.tip-box{
  position:fixed;
  top:15%;
  right: 2vw;
  left:2vw;
  z-index: 100;
  text-align: center;
  background: #fff;
}
.tip-box .tip-con{
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  vertical-align: middle;

  padding:2.5vw;
  position: relative;
}



.tip-extra{
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.tip-con .content{
  padding:1vw 0 3vw 0;
}
.tip-con .content h5{
  font-size:4vw;
  padding: 2vw 0;
}
.tip-con .content input{
  width:100%;
  border:none;

  padding:5px;
  margin:5px 0px;

}
.tip-con .content .info{
  padding:3vw 0;
}
.tip-con .content .info h5{
  font-size:4.5vw;
}
.tip-con .content .info span{

  margin-left:3vw;
  color:#666;
}
.tip-close{
  position:absolute;
  top:0vw;
  right:1.5vw;
  z-index: 101;

}
.tip-close i{
  font-size:4.5vw;
  color:#1f405a;
}
.tip-con .btn {
  text-align: center;
  height: 11vw;
  line-height: 11vw;
  width: 100%;
  margin: 0 auto;
  background: #646da9;
  color: #fff;
  font-size: 4.2vw;
  font-weight: 600;
  transition: all .4s;
}

/*资产*/
.otc-asset-con{
  background:#fff;
  padding:3vw;
}
.otc-asset-top{
  background:#4fc2c4;
  padding:4vw;
  color:#fff;
  font-size:3.8vw;
  height:35vw;
  position:relative;
}
.otc-asset-top .txt p{
  font-size:4.4vw;
}
.otc-asset-top .txt h3{
  font-size:6.5vw;
  padding-bottom:1vw;
  font-weight:700
}
.otc-asset-top .lookbtn{
  background:#67d4d6;
  padding:1vw 3vw;
  border-radius: 1px;
  display:inline-block;
  position: absolute;
  right:3vw;
  bottom:3vw;
}
.otc-seach{
  margin-top:4vw;
}
.asset-list{
  background:#f8fafc;
  font-size:3.8vw;
  color:#a9adbe;
  margin-top:3.6vw;
}
.asset-top{
  border-bottom:1px solid #fff;
  padding:2vw 3vw;
  height:12vw;
}
.asset-top .txt{
  color:#1f3b60;
  align-items: center
}
.asset-top .txt label.icon-bg{
  background:#d1ddf2;
  width:8vw;
  height:8vw;
  border-radius: 4vw;
  display:flex;
  justify-content: center;
  align-items: center;
  margin-right:2vw;
}
.asset-top .txt label.icon-bg i{
  color:#fff;
  font-size:4.8vw;
}
.asset-top .r-btn span{
  padding:1.5vw 5vw;
  color:#fff;
  background: #d1ddf2;
  margin-left:2vw;
}
.asset-con{
  line-height:7vw;
  padding:3vw 3vw;
  padding-bottom:5vw;
}
.asset-con div span:nth-child(2){
  color:#1f3b60;
}

/*身份认证*/
.otc-auth-con{
  padding:4vw;
}
.otc-auth-con .input-t{
  height:12vw;
}
.otc-auth-con .issue-form .input-block .rel span{
  width:12vw;
  height:12vw;
}
.auth-pic-block{
  background: #ebf0f8;
  height:40vw;
}
.auth-pic-block i{
  font-size:20vw;
}
.auth-pic-block .box-center{
  height:100%;
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color:#c7c7cd
}
.otc-auth-con  p.pay-info{

  font-size:4vw;
  color:#8196a5;
  background: none
}
.pay-option{
  background:#fff;
  border:1px solid #556693;
  margin-top:5px;
  position: absolute;
  left:0;
  right:0;
  top:11vw;
  z-index: 4;
}
.pay-option .pay-name{
  padding:10px 0px;
  cursor: pointer;
}
.pay-option .pay-name:hover{
  background: #3a4258
}


/*消息管理*/
.news-tab{

}

.news-tab li{
  height:11vw;
  line-height:11vw;
  width:50%;
  font-size:4.5vw;
  color:#8c9fad;
  text-align: center;
  border-bottom:2px solid #e7eaee
}

.news-tab li:first-child{
  border-right:1px solid #e7eaee
}

.news-tab li.active{
  color:#646da9;
  border-bottom:2px solid #646da9;
}
.news-tab-con{
  background:#efeff3;
}
.news-tab-con div{
  padding:4vw 6vw;
  line-height: 6vw;
  color:#869aa8;
  font-size:3.5vw;
  background: #fff;
  margin-bottom:2vw;
}
.news-tab-con div h5{
  color:#1f3b60;
  font-size:4vw;
}

/*收款方式*/
.otc-payment-term{
  padding:4vw;
}
.otc-payment-term .pay-add{
  background:#f5f9fc;
  height:12vw;
  padding:0 4vw;
  font-size:5vw;
  color:#8196a5;
}
.pay-infocard{

  color:#fff;
  font-size:4vw;
  margin-bottom:4vw;
}
.pay-infocard div{
  position: absolute;
  left:15vw;
  top:0;
  padding-top:3.3vw;
}
.pay-infocard img{
  background-size: cover;
  background-position: center;

}
.pay-infocard h3{
  font-size:5vw;
  font-weight: normal
}
.pay-infocard p{
  font-size:6vw;
  margin-top:4vw;
  word-break:break-all
}
.otc-payment-term .pay-add i{
  color:#8196a5;
}

img.gray{
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
}
/*跟单策略*/
.box-c-start{
  justify-content: flex-start;
  align-items: center
}
.fixed-bottom{
  position:fixed;
  left:0;
  right:0;
  bottom:0;
}
.tactics-main .list{
  background:#fff;
}
.tactics-main .list .hd{
  color:#112f57;
}
.tactics-main .list .hd h3.icon{
  display:flex;
  justify-content: flex-start;
  align-items: center
}
h3.icon .coin-bg{
  width:8vw;
  height:8vw;
  background:#64acf5;
  margin-right:2vw;
}
h3.icon .coin-bg i{
  font-size:5vw;
}
.tactics-main .list .bd{
  color:#869aa8;
  padding:2.8vw 4vw;
}
.tactics-main .list .bd .left{
  line-height:6vw;
  font-size:3.6vw;
}
.tactics-main .list .bd .left label{
  margin-right:2vw;
}
.tactics-main .list .bd .k-line{
  width:24vw;
  float: right;
}
.otc-list-con .list .bd ul.box li{
  width:44%;
}
.otc-list-con .list .bd ul.box li:nth-child(2),.otc-list-con .list .bd ul.box li:nth-child(3){
  width:28%;
}

.tactics-set{
  padding:0px 4vw;
}
.tactics-set h4{
  height:12vw;
  line-height:12vw;
  font-size:4vw;
}
.tactics-set .input-block{
  border:1px solid #eee;
  background:#fff;
  height:10vw;
  padding:0px 2vw;
}
.tactics-set .input-box span{
  color:#333;
}
.text-info{
  padding-left:4.6vw;
  line-height:5.5vw;
  color:#a1b2bf;
}
.tactics-menu ul li{
  width:50%;
  height:12vw;
  line-height:12vw;
  border-bottom:2px solid #eee;
  color:#8c9fad;
  font-size:4vw;
  text-align: center
}
.tactics-menu ul li.active{
  border-bottom:2px solid #64acf5;
  color:#64acf5;
}
.tactics-menu ul li:first-child{
  border-right:1px solid #eee;
}
.r-text{
  font-size:3.8vw;
  color:#8c9fad
}
.edit-con .left{
  display:none;
  margin-right:3vw;
}
.is-active .edit-con .left{
  display: block
}
.edit-con .right{
  flex: 1;
}
.edit-allselect{
  background:#fff;
  border-top:1px solid #eee;
  height:12vw;
  padding-left:4vw;
}
.edit-allselect .left{
  margin-right:4vw;
}
.edit-allselect .bottom-btn02{
  width: initial;
  height:12vw;
  line-height:12vw;
  padding:0px 3vw;
  margin:0;
}
.edit-allselect .right{
  flex:1;
  align-items: center
}
.edit-allselect .right .txt{
  padding-right:2vw;
  color:#869aa8;
  font-size:2.8vw;
}
.edit-allselect .right .txt b{
  font-size:4.1vw;
  color:#333;
}
.tip-con .content.cancel-order{
  padding:4vw 10vw;
  font-size:3.6vw;
  color:#869aa8;
}
.tip-con .content.cancel-order .txt p{
  padding-bottom:2vw;
}
.tip-con .content.cancel-order .txt p:first-child{
  font-size:4vw;
  color:#464e6d;
}
.tip-con .content.cancel-order .radio-txt{
  text-align:left;
  padding:4vw 0;
  padding-bottom:0;
  align-items: center
}
.tip-con .content.cancel-order .radio-txt input{
  width:initial;
  margin:0vw 0
}

/*风险提示*/
.risk-con{
  padding:4vw;
  font-size:3.5vw;
  color:#464e6d;
}
.risk-con h1{
  font-weight: normal;
  font-size:4vw;
  text-align: center
}
.risk-con p{
  margin-top:2vw;
  line-height:5.5vw;
}
.tip-con .content.pass-con{
  text-align: center;
  padding:10vw 10vw 6vw 10vw;
}
.tip-con .content .pass-input{
  border:2px solid #efeff4;
  background:#fff;
  width:100%;
  height:11vw;
  text-align: left;
  margin:0 1vw;
}
.tip-con .content.pass-con p{
  width:80vw;
  text-align:right;
  padding-top:4vw;
  margin:0 auto;
  font-size:3.5vw;
  color:#869aa8;
}
/*申诉*/
span.appeal {
  background: #f9a167;
  color: #fff;
  height: 4vw;
  line-height: 4vw;
  border-radius: 2vw;
  font-size: 3vw;
  padding: 0px 2vw;
  margin-left: 2vw;
}
.detail-btn,.look-btn{
  background: #f9a167;
  color:#fff;
  font-size:3.5vw;
  padding:1vw 2vw;
  position: absolute;
  top:0;
  right:0;
}
.look-btn{
  background: #64acf5;
}
.top-hd{
  padding:1vw 0;
  font-size:4.5vw;
  color:#8196a5;
}
.arrow{
  background:#99aab6;
  width:4vw;
  height:4vw;
  border-radius:2vw;
  padding-top:0vw;
  display:flex;
  justify-content: center;
  align-items: center
}
.arrow i{
  color:#fff;
  font-size:2vw;
  transform: rotate(180deg)
}
.arrow.down i{
  transform: rotate(0deg)
}
.appeal-info{
  text-align:center;
  font-size:3.5vw;
  color:#8196a5;
  padding-top:3vw;
  margin-bottom:0;
}
.appeal-info h2{
  color:#64acf5;
  font-size:4.8vw;
  margin:2vw 0;
  font-weight: normal
}
.appeal-info div{
  padding-bottom:4vw;
}
.appeal-info h3,.appeal-info p{
  font-size:4.2vw;
  line-height:6vw;
  margin:2vw 0;
  font-weight: normal
}
.appeal-info ul{
  margin:2vw 0;
  flex-wrap: wrap
}
.appeal-info li{
  width:30%;
  height:26vw;
  background:#fff;
  border:1px solid #eee;
  padding:1vw;
  margin:0px 1vw;
  margin-bottom:4vw;
  display:flex;
  justify-content: center;
  align-items: center
}
.appeal-info li div{
  padding-bottom:0;
}
.appeal-info li img{
  width:100%;
  height:100%;
  max-height:20vw;
  //width:100%;
  -ms-interpolation-mode: bicubic;
  vertical-align:top;
}
.fixed-btn{
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  z-index: 10;
}
.fixed-btn.padding-btn{
  padding:3vw 4vw;
  background:#f8fafc;
}
.fixed-btn.padding-btn .bottom-btn02{
  width:48%;
}
.shadow-bg{
  background:#f8fafc;
  box-shadow: 0px 0px 2vw rgba(0, 0, 0, 0.3);
}
.reason-con{
  padding-top:4vw;
  font-size:4vw;
  color:#8196a5;
}
.reason-con .top{
  text-align: center;
  line-height:7vw;
  padding:2vw 2vw;
  font-size:4.5vw;
  color:#64acf5;
}
.reason-con ul{
  padding:4vw;
}
.reason-con li{
  text-align:center;
  padding:0vw 1vw;

  color:#64acf5;

}
.reason-con li.active{
  background:#64acf5;
  color:#fff;
}
.padding-box{
  padding:4vw;
}
.other-input{
  border-bottom:1px solid #ccc;
  text-align: center;
  padding:2vw;
  color:#ccc;
}
.upload{
  padding:5vw 4vw;
  margin-bottom: 8vw;
  text-align: center;
  font-size:3.5vw;
}
.upload h3{
  margin-top:5vw;
  line-height:5vw;
  color:#8196a5
}
.upload ul{
  margin:2vw 0;
  padding:0;
  flex-wrap: wrap;
}
.upload li{
  width:30%;
  margin:2vw 1vw;
  padding:0;
  border-radius: 0.5vw;
  font-size:3vw;
  display: flex;
  justify-content: center;
  align-items: center
}
.upload li i{
  font-size:12vw;
}
.upload li i,.upload li p{
  color:#fff;
}
.upload p{
  color:#ec7d56;
  line-height:5.5vw;
}
.reason-con .input-txt{
  text-align: center;
}
.reason-con .input-txt h4{
  margin-bottom: 5vw;
}
.container .list-con .list.appeal-menu li{
  padding:0 4vw;
  margin:0 5vw;
}

.appeal-list-con{

}
.otc-list-con.appeal-list-con .list{
  background: #f8fafc
}


/*帮助中心*/
.icon-jian:before { content: "\e711"; }
.icon-jia:before { content: "\e62f"; }
.help-con{
  color:#999;
  background: #fff;
}
.help-con .menu-hd{
  height:50px;
  line-height:50px;
  background:#f5f5f5;
  padding:0px 20px;
  font-size:15px;
  color:#999;
  border-bottom:1px solid #eee;
}
.help-con .title{
  font-size:16px;
  color:#64acf5;
}
.help-con .menu-hd i{margin-right:10px}
.help-con ul li{
  height:50px;
  font-size:14px;
  padding:0px 20px;
  border-bottom:1px solid #eee;
  display:flex;
  justify-content: space-between;
  align-items: center;
}
.help-con ul li i{
  color:#ddd;

}
.help-con li:after{
  right:20px;
}
.help-p{
  padding:20px;
  font-size:14px;
  line-height:28px;

}
.help-p p{
  margin-bottom:10px;
}
.help-p p img{
  width:336px;
  margin:20px auto;

}
p.border{
  border-bottom:1px solid #eee;
}

.help-p .table{
  margin-bottom:20px;
}
.table-header,.table-list{
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-align: center;
  align-items: center;
  padding: 10px 0;
  border-bottom:1px solid #eee;
  color:#999
}
.table-list{
  color:#b9b9b9
}
.table-header span,.table-list span{
  width:130px;
}
.table-header span.w150,.table-list span.w150{
  width:150px;
  text-align:right
}
.table-header span.w180,.table-list span.w180{
  width:180px;
}
.table-th{
  color:#999
}


</style>
