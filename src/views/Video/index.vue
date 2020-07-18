<template lang="html">


  <div class="about-con  mescroll">
    <h1>MASEx Videos</h1>
    <h3>2019</h3>
    <ul class="flex-x-start">
      <ol>August 10</ol>
      <li>Tokyo Blockchain Powerhouse</li>
    </ul>
    <ul class="flex-x-start"><ol></ol><li><a target="_blank" href="https://youtu.be/22vCLuzWORg">Aaron Tsai, First Keynote Speech Video</a></li></ul>
    <ul class="flex-x-start">
      <ol>August 1</ol>
      <li><a target="_blank" href="https://www.wimplo.com/interview-with-aaron-tsai">Interview with Aaron Tsai – Discussion on Security Challenges on Exchanges</a></li>
    </ul>
    <ul class="flex-x-start">
      <ol>June 19</ol>
      <li>Security Token Realized - Hong Kong</li>
    </ul>
    <ul class="flex-x-start"><ol></ol><li><a target="_blank" href="https://www.youtube.com/watch?v=ysfQ6Oe6AT0">Aaron Tsai Interview Video</a></li></ul>
    <ul class="flex-x-start">
      <ol>April 8</ol>
      <li>Security Token Summit - Los Angeles</li>
    </ul>
    <ul class="flex-x-start"><ol></ol><li><a target="_blank" href="https://www.youtube.com/watch?v=wzx3cTxyKLY&t=31s">Age of Tokenization - Decentralization vs. Regulation Video</a></li></ul>
  </div>


</template>
<script>
  export default {
    name: 'About',
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');


  /*关于我们*/
  .about-con{
    line-height:1.8;
    padding: 3vw 4vw;
    background: white;
    h1{
      border-bottom:1px solid #eee;
      padding-bottom:0.5rem;
      margin-bottom:1rem;
    }
    h3{
      font-size:1rem;
    }
    ol{
      font-size:0.9rem;
      color:#333;
      margin:0.6rem 0;
      font-weight: bold;
    }
    a{
      color:#646da9;
      text-decoration: underline;
    }
    .line{
      border-bottom:1px solid #eee;
      margin:0.5rem 0;
    }
  }
</style>
