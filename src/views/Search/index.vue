<template lang="pug">
  .container
    .num-con.box.box-y-center
      i.iconfont &#xe606;
      Iinput(class="box-col-flex" inputType="text" value="" placeholder="输入或者长按输入地址")
      span(@click="$Helper.jumpBack") 取消
    ul
      li.box.box-y-center(v-for="i in 10" :key="i")
        .left BTC/USDT
        .right.box.box-x-right.box-col-flex
          i.iconfont &#xe602;
</template>
<script>
import components from '@/components'
export default {
  name: 'Search',
  components,
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 3vw 4vw;
    .num-con{
      span{
        margin-left: 2vw;
        font-size: 3.6vw;
        color: @icon-color;
      }
      i{
        font-size: 4vw;
        color: #aaa;
        margin-right: 2vw;
      }
    }
    ul{
      margin-top:3vw;
      li{
        padding: 3vw 0;
        .left{
          font-size: 4vw;
          font-weight: 600;
        }
        .right{
          i{
            font-size:4vw;
          }
        }
      }
    }
  }
</style>
