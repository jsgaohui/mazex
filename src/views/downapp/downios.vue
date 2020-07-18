<template>
  <div class="layout overflow-y">
    <div class="appdown">

      <div class="down-bg">
        <img src="static/images/download/down-bg02.jpg">
      </div>
      <div class="down-btn">
        <div @click="downios"><i class="iconfont">&#xe63d;</i>iPhone Download</div>
        <!--<span>点击安装后，请返回桌面查看</span>-->
      </div>
      <p class="down-info">
        {{$t('downios.goto')}}:<br>「<em>{{$t('downios.set')}}</em>」⇀「<em>{{$t('downios.general')}}</em>」⇀「<em>{{$t('downios.device')}}</em>」<br>{{$t('downios.trust')}}
      </p>
      <div class="jietu"><img :src="'static/images/download/down_'+ language +'01.jpg'"></div>
      <div class="jietu"><img :src="'static/images/download/down_'+ language +'02.jpg'"></div>
      <p class="t-center">{{$t('downios.complete')}}</p>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'downios',
    computed: {
      ...mapState('setting', ['language']),
    },
    methods: {
      downios() {
        window.location.href = 'https://fir.im/masex'
      },
    },
  }
</script>

<style scoped>
  body, html {
    overflow: auto;
  }

  .layout {
    max-width: 640px;
    margin: 0 auto;
    z-index: 1;
    padding-bottom: 40px;
  }

  .appdown {
    background-size: auto auto;
    background-size: 100% 100%;
  }

  .logo {
    width: 30%;
    margin: 0 auto
  }

  .down-btn div {
    background: #6dc1ff;
    border-radius: 24px;
    height: 48px;
    width: 50%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px;
    color: #fff;
    font-size: 20px
  }

  .down-btn span {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 5px;
  }


  p.down-info {
    margin-top: 50px;
    line-height: 40px;
    margin-left: 50px;
    line-height: 24px;
  }

  p.down-info em {
    color: #0073c7;
    font-weight: 700;
  }

  .jietu {
    text-align: center;
    margin-top: 20px;
  }

  .jietu img {
    width: 310px;
  }

  p.t-center {
    text-align: center;
    margin-top: 20px;
  }

  .router-view {
    background: #fff
  }
</style>
