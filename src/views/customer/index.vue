<template >
  <div class="us-con">
    <h1>{{$t('route.customer')}}</h1>
    <p>{{$t('route.helpDetail')}}</p>
    <dl>
      <!--<dt><img src="static/images/masex.png" class="bac-image"></dt>-->
      <dd>
        <div><img src="static/images/mail.png"><a href="mailto:">service@masex.io</a></div>
        <div><img src="static/images/mail.png"><a href="mailto:">listing@masex.io</a></div>
      </dd>
    </dl>
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  export default {
    name: 'customer',
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .bac-image {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .us-con {
    padding: 3vw 4vw;
    background: white;
  }

  .us-con h1 {
    font-size: 4.5vw;
    padding-top: 3vw;

  }

  .us-con p {
    font-size: 3vw;

    padding: 3vw 0;
  }

  .us-con dl {
    border-top: 1px solid #eee;
    padding: 15px 0px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start
  }

  .us-con dl dt {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 4.5vw;
    width: 30vw;
  }

  .us-con dl dt img {
    width: 10vw;
    margin-right: 2vw;
  }

  .us-con dl dd div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 2.5vw;
    font-size: 3.6vw;
  }

  .us-con dl dd img {
    width: 24px;
    margin-right: 2vw;
  }

  .us-con dl dd a {
    color: #646da9;
    text-decoration: none
  }
</style>
