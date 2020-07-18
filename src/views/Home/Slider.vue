<template lang="html">
  <div class="slider-s-container">
    <div class="empty-bac box box-item" v-if="!pages || pages.length === 0">
      <Spiner/>
    </div>
    <Slide class="slider" v-else :pages='pages' :sliderinit='sliderinit' @slide='slide' @tap='onTap' @init='onInit'>
      <div slot='loading'></div>
    </Slide>
  </div>
</template>
<script>
import Slide from 'vue-concise-slider'
import PreLoad from '@/lib/preload'
import Spiner from '@/components/Spiner'
export default {
  name: 'Slider',
  components: {
    Slide,
    Spiner,
  },
  data() {
    return {
      // images: [
      //   'http://img1.gtimg.com/sports/pics/hv1/114/230/2265/147340389.jpg',
      //   'http://img1.gtimg.com/sports/pics/hv1/90/230/2265/147340365.jpg',
      //   'http://img1.gtimg.com/sports/pics/hv1/179/231/2265/147340709.jpg',
      // ],
      pages: [],
      sliderinit: {
        currentPage: 0,
        autoplay: 5000,
        loop: true,
        direction: 'horizontal',
        infinite: 1,
        slidesToScroll: 1,
        timingFunction: 'ease',
        duration: 300,
      },
    }
  },
  props: {
    images: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  computed: {},
  watch: {
    images() {
      this.initPage()
    },
  },
  methods: {
    slide(data) {},
    onTap({currentPage}) {
      this.$emit('tap', this.images[currentPage])
    },
    onInit(data) {},
    initPage() {
      // preload image
      new PreLoad(this.images.map(({ imgUrl }) => imgUrl)).init().then(
        () => {
          this.pages = this.images.map(({title, imgUrl}) => (
            {
              html: `
                <div class="slider-inner">
                  <div class="image-bac" style="background-image: url('${imgUrl}')" />
                  <!--<div class="slider-text overtext ${title ? '' : 'hidden'}">${title}</div>-->
                </div>
              `,
              style: {
                background: '#ffffff',
              },
            }
          ))
        },
        () => {},
      )
    },
  },
  created() {
    this.initPage()
  },
  mounted() {},
}
</script>

<style lang="less">
  @import url('../../theme/index.less');
  .slider-s-container {
    /*height: 39vw;*/
    .empty-bac{
      height: 100%;
      background: #fff;
      position: relative;
      img{
        height: 8vh;
        position: absolute;
        top:12vh;
        left:0;
        right: 0;
        margin:auto;
        -webkit-animation: ball 300ms cubic-bezier(0.165, 0.840, 0.440, 1.000) infinite alternate;
        animation: ball 300ms cubic-bezier(0.165, 0.840, 0.440, 1.000) infinite alternate;
      }
      .shadow {
        -webkit-animation: shadow 300ms cubic-bezier(0.165, 0.840, 0.440, 1.000) infinite alternate;
        animation: shadow 300ms cubic-bezier(0.165, 0.840, 0.440, 1.000) infinite alternate;
        // -webkit-animation-delay: -300ms; animation-delay: -300ms;
        background: #fff;
        position: absolute;
        left:0;
        right: 0;
        margin:auto;
        bottom: 5vh;
        height: 2vh;
        width: 5vh;
        border-radius: 100%;
      }
    }
    .slider{
      .slider-inner{
        height: 39vw;
        width: 100vw;
        position: relative;
        .image-bac{
          height: 100%;
          width: 100%;
          background-size:100% 100%;
          background-position: center center;
          background-repeat: no-repeat;
        }
        .slider-text{
          position: absolute;
          bottom: 0;
          left:0;
          right: 0;
          background: rgba(0,0,0,0.7);
          font-size: 3.8vw;
          font-weight: 400;
          color:white;
          padding:2vw;
          text-align: start;
          &.hidden{
            display: none;
          }
        }
      }
    }
    /* remove slider stylesheet*/
    .slider-pagination.slider-pagination-bullets{
      display: none!important;
    }
    @-webkit-keyframes line-spin-fade-loader {
      50% {
        opacity: 0.3;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line-spin-fade-loader {
      50% {
        opacity: 0.3;
      }
      100% {
        opacity: 1;
      }
    }
  }
</style>
