<template lang="html">
  <div class="container box box-row">
    <div class="num-con box box-y-center" v-if="!uid">
      <div><i class="iconfont" style="color:#646da9">&#xe632;</i>
      <span @click="Run('Login')" >{{ $t('basic.login') }}</span>
      <em>|</em>
      <span @click="Run('EmailRegister')" >{{ $t('basic.register') }}</span>
      </div>

    </div>
    <div class="num-con box box-y-center box-space-bettwen" v-else>
      <div><i class="iconfont" style="color:#64acf5">&#xe632;</i><span>{{username}}</span></div>
      <div v-if="uid" @click="loginOutFn" ><span><i class="iconfont" style="color:#64acf5;margin-right:0">&#xe665;</i></span></div>
    </div>
    <div class="half-x-line"></div>
    <ul class="overflow-y mescroll box-row-flex">
      <li class="left" v-for="(item) in list" @click="jumpPage(item.url)">
       <i v-html="item.icon" class="iconfont"></i> {{item.name}}
      </li>
    </ul>
  </div>
        <!--.right.box.box-x-right.box-col-flex +{{ item.name }}-->
    <!--.lay.box.box-x-center.box-row-flex(v-else)-->
      <!--Spiner(color="#333")-->
</template>
<script>
import Spiner from '@/components/Spiner'
import {mapState} from 'vuex'
export default {
  components: {
    Spiner,
  },
  data() {
    return {
      list: [
          {name: this.$t('account.bbOrder'), url: 'Orders', icon: '&#xe609;'}, // 币币订单
          // {name: this.$t('route.Privilege'), url: 'Privilege', icon: '&#xe65e;'}, //我的特权
      ],
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
    ...mapState('basic', ['uid', 'username']),
    selectedList() {
      if (this.searchText) return this.list.filter(item => item.searchText.indexOf(this.searchText) !== -1)
      return this.list
    },
  },
  methods: {
    loginOutFn() {
      this.$Helper.emitAction('closeModel')
      this.$Helper.emitAction('comfirm', {
        text: this.$t('login.loginout_resuire'),
        btn: [
          {
            text: this.$t('basic.cancel'),
          },
          {
            text: this.$t('basic.comfirm'),
            callback: () => {
              this.$Helper.ajax({
                url: '/app/logout.api',
              })
                .then(
                  ({code}) => {
                    if (code !== 200) return
                    this.$Helper.clearCache()
                    this.$store.dispatch('basic/clearLoginData')
                    // jumpToAccount
                    this.Run('Home', this)
                  },
                )
            },
          },
        ],
      })
    },
    Run(name) {
      if (this.$Helper.isType(name, () => {})) {
        name.call(this)
        return
      }
      this.$Helper.jumpPage(name, this)
    },
    init() {
      // this.list = this.params.list.map(item => ({ ...item, searchText: item.name + item.name.toLowerCase() }))
    },
    jumpPage(url) {
      if (!this.uid) {
        this.$Helper.jumpPage('Login', this)
        return
      }
      this.$Helper.jumpPage(url, this)
    },
  },
  created() {

  },
  mounted() {
    // 传过来的list
    // this.init()
  },
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
    background: #fff;
    width: 80vw;
    .num-con{
      padding: 3.2vw 4vw;
      span{

        font-size: 3.6vw;
        color: @icon-color;
      }
      em{
        color: @icon-color;
        margin:0 2vw;
      }
      i{
        font-size: 4vw;
        color: #aaa;
        margin-right: 2vw;
      }
    }
    .half-x-line{
      margin: 0;
    }
    ul{
      padding: 0 4vw;
      li{
        padding:4vw 1vw;
        font-size: 3.6vw;
        display: block;
        border-bottom:1px solid #f5f5f5;
      li.on{
          color: @icon-color;
        }
      }
    }
    .lay{
      padding-top: 30vw;
      background: #fff;
    }
  }
</style>
