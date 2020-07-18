<template lang="html">
  <div class="scroll-news box" @click="clickFn">
    <div class="half-x-line"/>
    <div class="icon box box-item">
      <i class="iconfont">&#xe753;</i>
    </div>
    <div class="box-col-flex text-con">
      <transition name='slide-top'>
        <div class="box box-y-center text" v-for="(item, key) in list" :key="key" v-if="active === key">
          <p class="overtext">
            {{ item.noticeTitle }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      active: 0,
    }
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  computed: {},
  watch: {},
  methods: {
    clickFn() {
      this.$emit('tap', this.list[this.active])
    },
  },
  created() {
    this.active = 0
    setInterval(() => {
      let active = this.active + 1
      if (active >= this.list.length) active = 0
      this.active = active
    }, 5000)
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .scroll-news{
    height: 10vw;
    // margin: 1.6vw auto;
    background: white;
    padding:0px 15px;
    font-size:3.6vw;
    color:@icon-color;
    position: relative;
    .half-x-line{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .icon{
      i{
        font-size:4vw;
        margin-right:2vw;
      }
    }
    .text-con{
      position: relative;
      overflow: hidden;
      .text{
        transition: all 0.4s ease;
        position: absolute;
        top:0;
        bottom: 0;
        left: 0;
        right: 0;
        p{
          font-size: 3.6vw;
          padding:0 2vw;
          max-height: 11vw;
        }
      }
    }
  }
</style>
