<template lang="html">
  <div class="container">
    <IMenuList :list="settingConfig" @click="Run($event.handle)"/>
    <div class="bottom-btn active box box-item" v-if="uid" @click="loginOutFn">
      {{ $t('setting.loginout') }}
    </div>
  </div>
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'Setting',
  components,
  data() {
    return {
      runtimeSelect: ['始终普通行情', '始终实时行情', '仅在wifi下实时行情'],
      runtimeKey: 0,
      handicapSelect: ['横版', '竖版'],
      handicapKey: 0,
      cacheLength: 0,
    }
  },
  computed: {
    ...mapState('basic', ['uid', 'mobile', 'isExitTradePwd']),
    settingConfig() {
      return [
        [
          {
            handle: 'Language',
            text: this.$t('setting.language'),
            rightText: this.$t('NAME'),
          },
          {
            handle: () => {
              this.$Helper.emitAction('toast', { text: this.$t('setting.clearing') })
              this.$Helper.clearCache(undefined, ['userInfo'])
              setTimeout(() => {
                this.cacheLength = '0 kb'
                this.$Helper.emitAction('toast', { text: this.$t('setting.cleared') })
              }, 2000)
            },
            text: this.$t('setting.clear_cache'),
            rightText: this.cacheLength,
          },
          {
            handle: 'ResetPwd',
            text: this.$t('forgetPwd.modify_password'),
            hidden: !this.uid,
          },
          {
            handle: 'ResetTradePwd',
            text: this.isExitTradePwd === 1 ? this.$t('setting.reset_tradePwq') : this.$t('setting.add_tradePwq'),
            hidden: !this.uid,
          },
          // {
          //   handle: () => {
          //     this.$store.dispatch('layermodel/push', {
          //       name: 'BottomSelect',
          //       type: 'up',
          //       params: {
          //         active: this.runtimeKey,
          //         list: this.runtimeSelect.map(
          //           (text, key) => ({
          //             text,
          //             key,
          //             hander: () => {
          //               this.runtimeKey = key
          //             },
          //           })
          //         ),
          //       },
          //     })
          //   },
          //   text: '行情刷新频率',
          //   rightText: this.runtimeSelect[this.runtimeKey],
          // },
          // {
          //   handle: () => {
          //     this.$store.dispatch('layermodel/push', {
          //       name: 'BottomSelect',
          //       type: 'up',
          //       params: {
          //         active: this.handicapKey,
          //         list: this.handicapSelect.map(
          //           (text, key) => ({
          //             text,
          //             key,
          //             hander: () => {
          //               this.handicapKey = key
          //             },
          //           })
          //         ),
          //       },
          //     })
          //   },
          //   text: '盘口样式',
          //   rightText: this.handicapSelect[this.handicapKey],
          // },
        ],
      ]
    },
  },
  watch: {},
  methods: {
    Run(name) {
      if (this.$Helper.isType(name, () => {})) {
        name.call(this)
        return
      }
      this.$Helper.jumpPage(name, this)
    },
    loginOutFn() {
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
                  this.Run('Account')
                },
              )
            },
          },
        ],
      })
    },
  },
  created() {
    this.cacheLength = this.$Helper.numFixedLength(this.$Helper.getCacheLength() / 1000, 2, 30) + ' kb'
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
  }
</style>
