<template lang="html">


  <div class="about-con  mescroll">
    <h1>Past Events</h1>
    <h3>2019</h3>
    <ul class="flex-x-start">
      <ol>October 21-22</ol>
      <li><a href="http://www.worldblockchainstosummit.com/" target="_blank">World Blockchain STO Summit – Dubai</a></li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
      <div @click="showImages(showPhoto10)" style="color:#64acf5">Dubai Conference Photos
      </div></li>
    </ul>
    <ul class="flex-x-start">
      <ol>August 10</ol>
      <li><a target="_blank" href="https://tokyoblockchainpowerhouse.com">Tokyo Blockchain Powerhouse – Tokyo</a></li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li><a target="_blank" href="https://youtu.be/22vCLuzWORg">Aaron Tsai, First Keynote Speech </a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto1)" style="color:#64acf5">Tokyo Conference
          Photos
        </div>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol>July 31</ol>
      <li><a target="_blank" href="http://mu.worldblockchainstosummit.com">World BlockChain STO Summit - Mauritius</a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>Mauritius Newspaper Article</li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto2)" style="color:#64acf5">Mauritius Conference Photos</div>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol>June 25-26</ol>
      <li><a target="_blank" href="https://kryptonevents.com/bangkok">Next Block Asia "Beyong Crypto" - Bangkok</a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto3)" style="color:#64acf5">Bangkok Conference Photos</div>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol>June 18-19</ol>
      <li><a target="_blank" href="https://securitytokensrealised.com">Security Tokens Realised - Hong Kong</a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li><a target="_blank" href="https://www.youtube.com/watch?v=ysfQ6Oe6AT0">Aaron Tsai Interview Video</a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto4)" style="color:#64acf5">Hong Kong Conference Photos</div>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol>April 29-30</ol>
      <li><a target="_blank" href="https://worldblockchainstosummit.com">World BlockChain STO Summit - Dubai</a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto5)" style="color:#64acf5">Dubai Conference Photos</div>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol>April 9-10</ol>
      <li>Crypto Invest Summit – Los Angeles</li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto6)" style="color:#64acf5">CIS Conference Photos</div>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol>April 8</ol>
      <li>Security Token Summit</li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li><a
        href="https://www.youtube.com/watch?v=wzx3cTxyKLY&t=31s">Age of Tokenization - Decentralization vs. Regulation
        Video</a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto7)" style="color:#64acf5">STS Photos</div>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol>February 15</ol>
      <li>
        <div @click="showImages(showPhoto8)" style="color:#64acf5">Road to IPO – Kuala Lumpur Photo
        </div>
      </li>
    </ul>
    <br>
    <h3>2018</h3>
    <ul class="flex-x-start">
      <ol>December 16</ol>
      <li>The 15th China International Financial Forum - Shanghai</li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li><a target="_blank"
             href="https://finance.sina.com.cn/hy/hyjz/2018-12-16/doc-ihmutuec9781554.shtml">Aaron Tsai speech</a>
      </li>
    </ul>
    <br>
    <h3>2017</h3>
    <ul class="flex-x-start">
      <ol>December 16</ol>
      <li>The 14th China International Financial Forum - Shanghai</li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li><a target="_blank"
             href="https://finance.sina.com.cn/meeting/2017-12-16/doc-ifypsqka3724297.shtml">Aaron Tsai speech </a>
      </li>
    </ul>
    <br>
    <h3>2013</h3>
    <ul class="flex-x-start">
      <ol>September 7</ol>
      <li><a target="_blank" href="http://www.xmhouse.com/union/2013/ljs">CIFIT The 11th Capital Forum – Xiamen</a>
      </li>
    </ul>
    <ul class="flex-x-start">
      <ol></ol>
      <li>
        <div @click="showImages(showPhoto9)" style="color:#64acf5">CIFIT Photos</div>
      </li>
    </ul>
  </div>


</template>
<script>
  import Vue from 'vue'
  import {ImagePreview, Lazyload} from 'vant'
  import 'vant/lib/image-preview/style'

  Vue.use(ImagePreview)
  Vue.use(Lazyload, {
    loading: 'static/images/loading.gif',
    lazyComponent: true,
  })
  export default {
    name: 'past',
    data() {
      const imgs1 = []
      const imgs2 = []
      const imgs3 = []
      const imgs4 = []
      const imgs5 = []
      const imgs6 = []
      const imgs7 = []
      const imgs8 = []
      const imgs9 = []
      const imgs10 = []
      for (let i = 1; i < 10; i++) {
        imgs1.push('static/images/Tokyo/T' + i + '.jpg')
      }
      for (let i = 1; i < 5; i++) {
        imgs2.push('static/images/Maritius/M' + i + '.jpg')
      }
      for (let i = 1; i < 7; i++) {
        imgs3.push('static/images/Bangkok/B' + i + '.jpg')
      }
      for (let i = 1; i < 7; i++) {
        imgs4.push('static/images/Hong Kong/H' + i + '.jpg')
      }
      for (let i = 1; i < 7; i++) {
        imgs5.push('static/images/Dubai/D' + i + '.jpg')
      }
      for (let i = 1; i < 7; i++) {
        imgs6.push('static/images/CIS/L' + i + '.jpg')
      }
      for (let i = 1; i < 4; i++) {
        imgs7.push('static/images/STS/S' + i + '.jpg')
      }
      for (let i = 1; i < 7; i++) {
        imgs8.push('static/images/Kuala Lumpur/K' + i + '.jpg')
      }
      for (let i = 1; i < 10; i++) {
        imgs9.push('static/images/CIFIT/' + i + '.jpg')
      }

      for (let i = 1; i < 6; i++) {
        imgs10.push('static/images/Dubai2/D' + i + '.jpg')
      }
      return {
        showPhoto1: imgs1,
        showPhoto2: imgs2,
        showPhoto3: imgs3,
        showPhoto4: imgs4,
        showPhoto5: imgs5,
        showPhoto6: imgs6,
        showPhoto7: imgs7,
        showPhoto8: imgs8,
        showPhoto9: imgs9,
        showPhoto10: imgs10,
      }
    },
    methods: {
      showImages(imgs) {
        ImagePreview({
          images: imgs,
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  @import url('../../theme/index.less');


  /*关于我们*/
  .about-con {
    line-height: 1.8;
    padding: 3vw 4vw;
    background: white;

    h1 {
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1rem;
    }

    ol {
      font-size: 0.9rem;
      color: #333;
      margin: 0.6rem 0;
      font-weight: bold;
    }

    a {
      color: #646da9;
      text-decoration: underline;
    }

    .line {
      border-bottom: 1px solid #eee;
      margin: 0.5rem 0;
    }
  }
</style>
