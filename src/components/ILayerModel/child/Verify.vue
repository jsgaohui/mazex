<template lang="pug">
  .v-container
    .head.box.box-y-center
      .left.box-col-flex {{ $t('verify.safety_verify') }}
      .right.box-x-right(@click="$Helper.emitAction('closeModel')") {{ $t('basic.cancel') }}
    .half-x-line
    .con
      .item
        .image(class="bac-image" :style="{backgroundImage: `url('${verifyImage}')`}" @click="getVerifyImage")
        .num-con.box.box-y-center
          Iinput(class="box-col-flex" inputType="text" v-model="verifyCode" :placeholder="$t('verify.verify_code_toast')")
        .half-x-line
      IButton(class="btn" @click="sendVerifyFn") {{ $t('verify.verify') }}
</template>
<script>
import Iinput from '../../Iinput'
import IButton from '../../IButton'
// import { mapState } from 'vuex'
export default {
  components: {
    Iinput,
    IButton,
  },
  data() {
    return {
      verifyImage: null,
      verifyCode: null,
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {},
  watch: {},
  methods: {
    getVerifyImage() {
      this.verifyImage = `/verify/?d=` + Math.random()
    },
    sendVerifyFn() {
      this.$Helper.emitAction(this.params.actionId, this.verifyCode)
      this.$Helper.emitAction('closeModel')
    },
  },
  created() {
    this.getVerifyImage()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .v-container {
    background: white;
    .con{
      padding: 5vw 3vw;
      .image{
        height: 20vw;
        width: 40vw;
        // border: 1px solid #eee;
        margin: 3vw auto;
        background-size: 100% 100%;
      }
      .num-con{
        padding: 2vw 0;
        span{
          font-size: 3.6vw;
          color: @icon-color;
        }
        i{
          font-size: 4vw;
          padding: 2vw;
        }
        input{
          text-align: center;
          width: 40vw;
          // margin: auto;
          // border: 1px solid red;
          height: 7vw;
        }
      }
      .half-x-line{
        width: 40vw;
        margin: auto;
      }
    }
    .head{
      height: 15vw;
      padding: 0 3vw;
      .left{
        font-size: 4.5vw;
        font-weight: 600;
      }
      .right{
        font-size: 3.8vw;
        color: #888;
      }
    }
    .btn{
      margin-top: 10vw;
    }
  }
</style>
