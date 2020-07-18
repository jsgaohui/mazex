<template lang="html">
  <transition name="fade">
    <div class="layer container box" v-if="show" style="z-index:100000">
      <span class="toast-container box box-item" :style="{marginTop: type==='top' ? '20vw' : (type==='bottom' ? '80vh' : '')}" :class="{large: text.length> 10}">
        {{ text }}
      </span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      show: false,
      type: 'top',
      time: 2000,
      timer: null,
    }
  },
  methods: {
  },
  created() {
    this.$Helper.onAction('toast', ({text = '', show = true, type = 'top', time = 2000} = {}) => {
      this.text = text
      this.show = show
      this.type = type
      if (this.timer) clearInterval(this.timer)
      this.timer = setTimeout(() => {
        this.text = ''
        this.show = false
        this.type = 'top'
        this.time = 2000
      }, this.time)
    })
  },
}
</script>

<style lang="less" scoped>
@import "../theme/index.less";
.container {
  background: rgba(0,0,0,0.0);
  transition: all .2s linear;
  pointer-events: none;
  text-align: center;
  z-index: 1000;
}

.toast-container{
  background-color: #202020;
  color:white;
  font-size: 3.3vw;
  max-width: 75vw;
  text-align: center;
  margin:auto;
  padding:0 4vw;
  min-height: 9vw;
  border-radius: 12vw;
  line-height: 1.5;
  &.large{
    padding:3vw 5vw;
  }
}
</style>
