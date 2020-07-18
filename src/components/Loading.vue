<template lang="html">
  <!--<transition name="fade">-->
    <!--<div class="layer container box box-x-center" v-if="show">-->
      <!--<div class="content box box-item">-->
        <!--<Spiner color="#fff"/>-->
      <!--</div>-->
    <!--</div>-->
  <!--</transition>-->
</template>

<script>
import Spiner from '@/components/Spiner'
export default {
  components: {
    Spiner,
  },
  data() {
    return {
      text: '',
      show: false,
      time: 12000,
      timer: null,
    }
  },
  methods: {
  },
  created() {
    this.$Helper.onAction('loading', ({text = 'Loading...', show = true, time} = {}) => {
      this.text = text
      this.show = show
      if (this.timer) clearInterval(this.timer)
      if (this.time) {
        this.timer = setTimeout(() => {
          this.text = ''
          this.show = false
          this.type = 'top'
          this.time = 2000
        }, this.time)
      }
    })
  },
}
</script>

<style lang="less" scoped>
@import "../theme/index.less";
.container {
  background: transparent;
  transition: all .2s linear;
  // pointer-events: none;
  text-align: center;
  z-index: 10000;
  padding-top: 30vh;
  .content{
    width: 15vw;
    height: 15vw;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 2vw;
    padding: 0;
  }

}
</style>
