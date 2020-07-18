<template lang="pug">
  .container.box.box-row
    .num-con.box.box-y-center
      i.iconfont &#xe606;
      input(class="box-col-flex" type="text" v-model="searchText" :placeholder="$t('country.input_country')")
      span(@click.stop="$Helper.emitAction('closeModel')") {{ $t('basic.cancel') }}
    .half-x-line
    ul.overflow-y.mescroll.box-row-flex(v-if="!errorStatus")
      li.box.box-y-center(v-for="(item, key) of selectedList" :key="key" @click.stop="choseCountry(item)")
        .left {{ item.code }}
        .right.box.box-x-right.box-col-flex +{{ item.countryCode }}
    .lay.box.box-x-center.box-row-flex(v-else)
      Spiner(color="#333")
</template>
<script>
import Spiner from '@/components/Spiner'
export default {
  components: {
    Spiner,
  },
  data() {
    return {
      addressConf: [],
      searchText: '',
      errorStatus: 'error',
      statusConf: {
        error: {
          text: this.$t('basic.web_error'),
          img: 'static/images/no-wifi.png',
        },
        empty: {
          text: this.$t('basic.empty_error'),
          img: 'static/images/no-order.png',
        },
        loginout: {
          text: this.$t('basic.not_login_error'),
          img: 'static/images/no-order.png',
        },
      },
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
      if (this.searchText) return this.addressConf.filter(item => item.searchText.indexOf(this.searchText) !== -1)
      return this.addressConf
    },
    errorConf() {
      return this.statusConf && this.errorStatus ? this.statusConf[this.errorStatus] : {}
    },
  },
  watch: {
    addressConf() {
      this.judgeErrorStatus(this.addressConf)
    },
    selectedList() {
      this.judgeErrorStatus(this.selectedList)
    },
  },
  methods: {
    initAddressConf() {
      let cacheAddress = this.$Helper.getCache('CountryList')
      if (cacheAddress && cacheAddress.length > 0) {
        this.addressConf = cacheAddress
        return
      }
      this.$Helper
      .ajax({
        url: '/app/user/getcountrys.api',
        method: 'POST',
      })
      .then(({data}) => {
        let { countryList } = data
        this.addressConf = countryList.map(item => ({ ...item, searchText: item.code + item.code.toLowerCase() + item.countryCode + item.name + item.keyword }))
        // save for 1 minute
        this.$Helper.setCache('CountryList', this.addressConf, 60 * 1000)
      })
    },
    choseCountry(item) {
      this.$Helper.emitAction('closeModel')
      let fn = this.params.callback
      if (fn && this.$Helper.isType(fn, () => {})) fn(item)
    },
    judgeErrorStatus(arr) {
      if (!arr) {
        this.errorStatus = 'error'
      } else if (arr.length === 0) {
        this.errorStatus = 'empty'
      } else {
        this.errorStatus = null
      }
    },
  },
  created() {
    this.initAddressConf()
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
