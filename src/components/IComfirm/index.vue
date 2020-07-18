<template lang="html">
  <transition name="fade">
    <div class="layer" id="comfirm_container" v-if="show" @click.self="closeModelFn">
      <!-- v-animate-css.once="showAnimate" -->
      <div class="comfirm-container">
        <div class="c-text box box-item" v-html="text" />
        <!-- <div class="half-x-line"></div> -->
        <div class="btn-container box box-item">
          <div class="btn box box-item" v-for="(item, key) in btn" :key="key" @click="Run(item.callback)" :data-type="key%2 !== 0 ? 'primary' : ''">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import router from '@/router'
// import { mapState } from 'vuex'
import Btn from './Btn'
export default {
  components: {
    Btn,
  },
  data() {
    return {
      text: '',
      show: false,
      showAnimate: {
        classes: 'pulse',
        duration: 400,
      },
      btn: [
        { text: '取消', callback: () => this.closeModelFn() },
      ],
    }
  },
  methods: {
    closeModelFn() {
      this.show = false
    },
    Run(fn = () => {}) {
      if (this.$Helper.isType(fn, () => {})) {
        setTimeout(() => {
          fn.call(this, () => { this.closeModelFn() })
          this.closeModelFn()
        }, 200)
      }
    },
  },
  created() {
    this.$Helper.onAction('comfirm', ({text = '', show = true, btn}) => {
      this.text = text
      this.show = show
      if (this.$Helper.isType(btn, undefined)) {
        this.btn = [{ text: this.$t('basic.cancel'), callback: () => this.closeModelFn() }]
      } else if (this.$Helper.isType(btn, '')) {
        this.btn = [{ text: btn, callback: () => this.closeModelFn() }]
      } else if (this.$Helper.isType(btn, {})) {
        this.btn = [btn]
      } else {
        this.btn = btn
      }
    })
  },
}
</script>

<style lang="less" scoped>
@import '../../theme/index.less';
#comfirm_container {
  // background: none;
  transition: all .1s linear;
  padding-top:32vh;
  .comfirm-container{
    background: white;
    // height:26vh;
    border-radius: 1vw;
    width:86vw;
    margin:0 auto;
    -webkit-animation-duration: 0.4s;
    animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-name: pulse;
    animation-name: pulse;
    .c-text{
      padding:15vw 5vw 13vw 5vw;
      color:#121212;
      text-align: center;
      font-size: 4.2vw;
      img{
        height:6vw;
        margin-right:.2vw;
      }
      img:nth-child(3) {
        margin-right:2vw;
      }
    }
    .btn-container{
      padding-bottom:2vh;
      .btn{
        margin: 2vw;
      }
    }
  }
  .half-y-line{
    height:6vh;
    background: #aaa;
  }
  .half-x-line{
    background: #aaa;
  }
  .btn {
    height: 10vw;
    border-radius: 10vw;
    padding: 0 6vw;
    font-size: 4vw;
    border: 1px solid @icon-color;
    color: @icon-color;
    position: relative;
    overflow: hidden;
    &[data-type="primary"] {
      background: @icon-color;
      color: white;
    }
    &[data-size="small"] {
      height: 8vw;
      border-radius: 8vw;
      padding: 0 4vw;
      font-size: 4vw;
    }
    &.touching:before{
      content: '';
      position: absolute;
      left:0;
      right:0;
      top:0;
      bottom: 0;
      background:rgba(0,0,0,.2);
      // opacity:0.5;
    }
  }
}

@-webkit-keyframes pulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  50% {
    -webkit-transform: scale3d(1.05, 1.05, 1.05);
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@keyframes pulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  50% {
    -webkit-transform: scale3d(1.05, 1.05, 1.05);
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

</style>
