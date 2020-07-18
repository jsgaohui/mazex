
<template>
  <div class="btn box box-item" :class="{touching: touching}" :data-type="type" :data-size="size" @touchstart.stop.prevent="touchstart" @touchend="touchend">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'i-button',
  data() {
    return {
      touching: false,
    }
  },
  props: ['type', 'size'],
  computed: {
  },
  methods: {
    touchstart() {
      this.touching = true
      this.$emit('click')
    },
    touchend() {
      this.touching = false
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../theme/index.less';
.btn {
  height: 11vw;
  margin:0 auto;
  background: @icon-color;
  color: white;
  font-size: 4.2vw;
  font-weight: 600;
  border-radius: 1px;
  position: relative;
  overflow: hidden;
  &.touching:before{
    content: '';
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    background:rgba(0,0,0,.1);
    opacity:0.5;
  }
}

// .btn[data-type="primary"] {
//   background: @active-deep;
//   color: white;
// }
</style>
