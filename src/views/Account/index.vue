<template lang="html">
  <div class="container overflow-y mescroll" ref="mine">
    <div class="head">
      <!-- <img :src="bacImage" class="bac" alt="background-image" /> -->
      <div class="info box">
        <div class="logo box box-item" @click="Run((mobile || email) && uid? null : 'Login')">
          <i class="iconfont">&#xe60e;</i>
        </div>
        <div class="login-con box-col-flex" @click="Run((mobile || email) && uid? null : 'Login')" :class="{logined: mobile && uid}">
          <div class="login box box-y-center">
            {{ (mobile || email) && uid ? secretName : $t('basic.login') }}
          </div>
          <div class="more box box-y-center">
            {{ uid ? `UID: ${uid}` : $t('account.welcome') }}
          </div>
        </div>
        <!-- <div class="message box box-item" @click="Run('Message')">
          <i class="iconfont">&#xe70b;</i>
          <div class="spot">1</div>
        </div> -->
      </div>
    </div>
    <IMenuList :list="settingConfig" @click="Run($event.handle,$event)" linePosition="both" :subList="true"/>
    <!-- <ul class="bottom" v-for="(item, key) of settingConfig" :key="key">
      <li class="box" v-for="(li, key2) in item" :key="key2" @click="Run(li.handle)" v-if="!li.hidden">
        <div class="left box box-y-center box-col-flex">
          <i :class="[li.icon]"/>
          <span>{{ li.text }}</span>
        </div>
        <div class="icon box box-item">
          <i class="icon-arrow-right"/>
        </div>
      </li>
    </ul> -->
  </div>
</template>
<script>
  import components from '@/components'
  import { mapState } from 'vuex'
  export default {
    name: 'Account',
    components,
    data() {
      return {
        validStatus: null,
      }
    },
    computed: {
      ...mapState('basic', ['uid', 'mobile', 'email']),
      isSupportStartReveChat() {
        // return (window.api && window.api.startReveChat) || (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.startReveChat)
        return false
      },
      settingConfig() {
        // let autoTradekey = {url: 'FundOrder', name: this.$t('route.FundOrder')}
        // let domain = document.domain
        // if (!domain) {
        //   domain = 'udax.pro'
        // }
        // if (domain.indexOf('udax.kr') !== -1) {
        //   autoTradekey = {url: 'AutoTradeOrder', name: this.$t('at.atOrder')}
        // }
        return [
          [
            {
              // handle: this.fliterLogin('MyFund'),
              text: this.$t('account.my_fund'),
              icon: '&#xe614;',
              sublist: [{ name: this.$t('account.bbAccount'), url: 'MyFund' }],
              sublistShow: false,
            },
            // {
            //   handle: this.fliterLogin(this.validStatus === 0 ? 'IdentityOne' : 'IdentityStatus'),
            //   text: this.$t('account.authentication'),
            //   icon: '&#xe608;',
            //   hidden: this.validStatus === 2 || !this.uid,
            //   rightText: this.validStatus === 0 ? `<i class="iconfont" style="color: #F55858">&#xe622;</i><span style="color: #F55858">${this.$t('basic.not_validate')}</span>` : '',
            // },
            {
              // handle: this.fliterLogin('Orders'),
              text: this.$t('account.orders'),
              icon: '&#xe609;',
              sublist: [{ name: this.$t('account.bbOrder'), url: 'Orders' }],
              sublistShow: false,
            },
            {
              handle: this.fliterLogin('Personal'),
              text: this.$t('account.personal'),
              icon: '&#xe622;',
              rightText: this.validStatus === 0 ? `<i class="iconfont" style="color: #F55858">&#xe622;</i><span style="color: #F55858">${this.$t('basic.not_validate')}</span>` : '',
            },
            // {
            //   // handle: this.fliterLogin('Payment'),
            //   text: this.$t('payment.paymentMethod'),
            //   icon: '&#xe622;',
            //   dialogName: 'Payment', // 弹窗
            // },
            {
              handle: this.fliterLogin('Safety'),
              text: this.$t('account.safety'),
              icon: '&#xe60d;',
            },
            {
              handle: this.fliterLogin('Invite'),
              text: this.$t('route.Invite'),
              icon: '&#xe63c;',
            },
            // {
            //   handle: this.fliterLogin('Achieve'),
            //   text: this.$t('route.Achieve'),
            //   icon: '&#xe6f5;',
            // },
            {
              handle: this.fliterLogin('withdrawAddress'),
              text: this.$t('route.withdrawAddress'),
              icon: '&#xe6a3;',
            },
            // {
            //   handle: this.fliterLogin('Privilege'),
            //   text: this.$t('route.Privilege'),
            //   icon: '&#xe65e;',
            // },
            {
              handle: 'customer',
              text: this.$t('route.customer'),
              icon: '&#xe7bb;',
              // hidden: this.isSupportStartReveChat,
            },
            {
              handle: 'About',
              text: this.$t('account.about'),
              icon: '&#xe610;',
            },
            {
              handle: 'Setting',
              text: this.$t('account.setting'),
              icon: '&#xe68d;',
            },
          ],
        ]
      },
      secretName() {
        if (this.mobile) return this.$Helper.secretStr({str: this.mobile, length: 4})
        if (this.email) return this.$Helper.secretStr({str: this.email, length: 7})
        return ''
      },
    },
    watch: {},
    methods: {
      fliterLogin(name) {
        return this.uid ? name : 'Login'
      },
      getIcon(name) {
        return `static/icon/${name}.png`
      },
      Run(name, event) {
        // 处理有sublist的类型
        if (!name && event) {
          if (event.sublistShow != null) {
            event.sublistShow = !event.sublistShow
          } else {
            // 弹窗
            this.$Helper.dialog(event.dialogName, 'right', null, this.$store)
          }
          return
        }
        if (this.$Helper.isType(name, () => {})) {
          name.call(this)
          return
        }
        // console.log(name)

        this.$Helper.jumpPage({ name }, this)
      },
      judgeAnalyze() {
        return this.$Helper.ajax({
          url: '/app/user/authStatus.api',
          method: 'POST',
        })
          .then(
            ({data}) => {
              let { validStatus } = data
              this.validStatus = validStatus
            },
            (data) => {},
          )
      },
    },
    created() {
      // judge if user analyze, if true, hidden the Identity page
      if (this.uid) this.judgeAnalyze()
    },
    mounted() {
      // this.$Helper.noScroll(this.$refs.mine)
    },
    // activated() {
    //   // judge if user analyze, if true, hidden the Identity page
    //   if (this.uid) this.judgeAnalyze()
    // },
    // deactivated() {},
  }
</script>

<style lang="less" scoped>
  @import '../../theme/index.less';
  .container {
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .head {
    height: 33vw;
    // background-image: url('../../../static/wo_background.png');
    padding-top: 5vw;
    margin-bottom: 0;
    overflow: hidden;
    position: relative;
    background: white;
    .bac{
      position: absolute;
      left:0;
      right: 0;
      bottom: 0;
      width: 100%;
      z-index: 0;
    }
    .info{
      height: 22vw;
      position: relative;
      z-index: 1;
      .logo{
        width: 25vw;
        // img{
        //   width: 16vw;
        //   height: 1vw;
        //   border-radius: 100%;
        //   border: 2px solid rgba(255,255,255,0.5);
        // }
        i{
          font-size: 16vw;
        }
      }
      .login-con{
        &.logined{
          .login{
            font-size: 5.7vw;
          }
          .more{
            font-size: 2.5vw;
          }
        }
        .login{
          color:#646da9;
          font-size: 4.8vw;
          font-weight: 600;
          margin-top: 5vw;
          margin-bottom: 1.2vw;
        }
        .more{
          font-size: 3vw;
          font-weight: 400;
          color:#777;
          padding-left: 2px;
        }
      }
      .message{
        width: 16vw;
        position: relative;
        i{
          font-size: 6.5vw;
          color: white;
        }
        .spot{
          font-size: 2.5vw;
          color: white;
          // font-weight: 300;
          position: relative;
          top: -1.5vw;
        }
      }
    }
  }


  .half-y-line {
    height: 11vh;
    background: #aaa;
  }

  .dot {
    background: white;
    height:3.6vh;
    width:3.6vh;
    position: relative;
    border-radius: 100%;
    padding:0;
    i{
      color:@active-deep;
      margin-top:.2vh;
    }
  }

  .dot.active:before {
    content: '';
    width: 1.2vw;
    height: 1.2vw;
    border-radius: 100%;
    background: red;
    position: absolute;
    top: 4px;
    right:4px;
  }
</style>
