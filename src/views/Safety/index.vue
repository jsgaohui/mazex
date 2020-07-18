<template lang="html">
  <div class="container">
    <IMenuSafety :list="settingConfig" @click="Run($event.handle)"/>
  </div>
</template>
<script>
import components from '@/components'
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  name: 'Safety',
  components,
  data() {
    return {
      openEmailValid: null,
      openPhoneValid: null,
    }
  },
  computed: {
    ...mapState('basic', ['mobile', 'email']),
    isApp() {
      return window.api || (window.webkit && window.webkit.messageHandlers)
    },
    settingConfig() {
      return [
        [
          {
            handle: this.openPhoneValid === -1 ? 'BindPhone' : 'Phone',
            text: this.$t('basic.mobile'),
            rightText: this.openPhoneValid === -1 ? this.$t('basic.unbind') : (this.openPhoneValid === 1 ? this.$t('basic.enabled') : this.$t('basic.disabled')),
          },
          {
            handle: this.openEmailValid === -1 ? 'BindEmail' : 'Email',
            text: this.$t('basic.email'),
            rightText: this.openEmailValid === -1 ? this.$t('basic.unbind') : (this.openEmailValid === 1 ? this.$t('basic.enabled') : this.$t('basic.disabled')),
          },
          {
            handle: () => {
              if (_.get(window, 'api.showModifyLock')) {
                window.api.showModifyLock() // Android
              } else if (_.get(window, 'webkit') && _.get(window, 'webkit.messageHandlers') && _.get(window, 'webkit.messageHandlers')) {
                window.webkit.messageHandlers.showModifyLock.postMessage('') // iOS
              }
            },
            text: this.$t('setting.set_dumb'),
            hidden: !this.isApp,
          },
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
    queryNeedValid() {
      this.$Helper.ajax({
        url: '/app/account/queryNeedValid.api',
      })
      .then(
        data => {
          // -1 未绑定 0 未开启验证 1 开启验证
          this.openEmailValid = !this.email ? -1 : _.get(data, 'openEmailValid')
          this.openPhoneValid = !this.mobile ? -1 : _.get(data, 'openPhoneValid')
          // save to store
          this.$store.dispatch('basic/setLoginData', { openEmailValid: this.openEmailValid, openPhoneValid: this.openPhoneValid })
          setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 600)
        },
      )
    },
  },
  created() {
    setTimeout(() => this.$Helper.emitAction('loading', { show: true }), 200)
    this.queryNeedValid()
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
