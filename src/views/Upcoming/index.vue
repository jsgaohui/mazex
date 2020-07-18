<template lang="html">
  <div class="about-con  mescroll">
    <h1>Upcoming Events</h1>
    <h3>2020</h3>
    <ul class="flex-x-start">
      <ol>February 26-27</ol>
      <li><a href="https://sg.worldblockchainstosummit.com/" target="_blank"> World Blockchain STO Summit - Singapore</a>></li>
    </ul>
    <ul class="flex-x-start">
      <ol>June 12</ol>
      <li ><a href="http://www.blockchaineventon.com/" target="_blank">Blockchain & AI Eventon - Mumbai</a>></li>
    </ul>
    <h3>2019</h3>
    <ul class="flex-x-start">
      <ol>Deember 23</ol>
      <li>i5 Global Fintech Summit - Seoul</li>
    </ul>
    <ul class="flex-x-start">
      <ol>October 21-22</ol>
      <li><a target="_blank" href="http://www.worldblockchainstosummit.com">World Blockchain STO Summit – Dubai</a></li>
    </ul>
    <ul class="flex-x-start">
      <ol>December 6</ol>
      <li><a  target="_blank" href="http://www.blockchaineventon.com">Blockchain & AI Eventon - Mumbai</a></li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'upcoming',
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
