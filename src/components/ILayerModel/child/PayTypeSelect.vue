<template lang="pug">
  .container.box.box-row
    .num-con.box.box-y-center
      i.iconfont &#xe606;
      input(class="box-col-flex" type="text" v-model="searchText" :placeholder="$t('fund.choose')+$t('otc.paymentMethod')")
      span(@click.stop="$Helper.emitAction('closeModel')") {{ $t('basic.cancel') }}
    .half-x-line
    ul.overflow-y.mescroll.box-row-flex
      li.box.box-y-center(v-for="(item, key) of selectedList" :key="key" @click.stop="chosePayType(item)")
        .left {{ item.paymentTypeName }}
        <!--.right.box.box-x-right.box-col-flex +{{ item.paymentTypeName }}-->
    <!--.lay.box.box-x-center.box-row-flex(v-else)-->
      <!--Spiner(color="#333")-->
</template>
<script>
import Spiner from '@/components/Spiner'
export default {
  components: {
    Spiner,
  },
  data() {
    return {
      payType: [],
      // errorStatus: false,
      searchText: '',
      closeFlag: false,
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    selectedList() {
      if (this.searchText) return this.payType.filter(item => item.searchText.indexOf(this.searchText) !== -1)
      return this.payType
    },
  },
  methods: {
    initPayType() {
      // let cachePayType = this.$Helper.getCache('PayTypeList')
      // if (cachePayType && cachePayType.length > 0) {
      //   this.payType = cachePayType
      //   return
      // }
      let $this = this
      this.$Helper
      .ajax({
        url: '/app/common/getPayType.api',
        method: 'POST',
      })
      .then(({data}) => {
        let { payType } = data
        $this.payType = payType.map(item => ({ ...item, searchText: item.paymentTypeName + item.paymentTypeName.toLowerCase() }))
        // save for 1 minute
        $this.$Helper.setCache('PayTypeList', $this.payType, 60 * 1000)
      })
    },
    chosePayType(item) {
      if (this.closeFlag) return
      this.closeFlag = true
      this.$Helper.emitAction('closeModel')
      let fn = this.params.callback
      if (fn && this.$Helper.isType(fn, () => {})) fn(item)
    },
  },
  created() {
    this.initPayType()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
    background: white;
    width: 80vw;
    .num-con{
      padding: 3vw 4vw;
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
    .half-x-line{
      margin-top: 2vw;
      margin: 0 4vw;
    }
    ul{
      margin-top:3vw;
      padding: 3vw 4vw;
      li{
        padding: 5vw 0;
        .left{
          font-size: 4vw;
          font-weight: 600;
        }
        .right{
          font-size:3.7vw;
          color: #555;
        }
      }
    }
    .lay{
      padding-top: 30vw;
      background: #fff;
    }
  }
</style>
