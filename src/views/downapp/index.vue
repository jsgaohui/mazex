<template>
  <div class="layout" style="top:0;">
    <div class="appdown">
      <div class="step01">
        <div ><img src="static/images/down-bg.jpg" style="width: 100%"></div>
        <div class="down-btn">
          <div @click="downandroid"><i class="iconfont">&#xe635;</i>Android Download</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'downapp',
    methods: {
      downandroid() {
        window.location.href = 'https://admin.udax.kr/upload/app-masex-release.apk'
      },
    },
  }
</script>

<style scoped>
  .layout {
    max-width: 640px;
    margin: 0 auto;
    z-index: 1;
    height: 100%;
    position: relative
  }

  .appdown {
    height: 100vh;
    top: 0;
    background-size: auto auto;
    background-size: 100% 100%;
  }

  .logo {
    width: 30%;
    margin: 0 auto
  }

  .down-btn {
    position: absolute;
    bottom: 20%;
    left: 0;
    right: 0;
  }

  .down-btn div {
    background: #fff;
    border-radius: 24px;
    height: 48px;
    width: 60%;
    margin: 0 auto;
    padding-left: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 12px;
    color: #646da9;
    font-size: 20px
  }

  .down-btn div i {
    color: #646da9;
    font-size: 24px;
    margin-right: 10px
  }
</style>
