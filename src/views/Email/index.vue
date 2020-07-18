<template lang="html">
  <div class="container">
    <IMenuList :list="settingConfig" @click="Run($event.handle)"/>
  </div>
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'Email',
  components,
  data() {
    return {}
  },
  computed: {
    ...mapState('basic', ['email', 'openPhoneValid', 'openEmailValid']),
    settingConfig() {
      return [
        [
          {
            text: this.$t('basic.email'),
            rightText: this.email.substr(0, 3) + '****' + this.email.substr(this.email.indexOf('@'), 10),
            rightIcon: ' ',
          },
          {
            handle: () => {},
            text: this.$t('route.Email'),
            rightIcon: ' ',
            isSwitch: true,
            switchValue: this.openEmailValid,
            valueChangeFn: val => {
              // judge email validate && mobile validate, if the opened validate num less than 1, user will not allow to untie it
              if (val === 1 && (this.openPhoneValid + this.openEmailValid < 2)) {
                this.$Helper.emitAction('toast', {
                  text: this.$t('verify.must_have_one_phone_email'),
                })
                return
              }
              this.$Helper.emitAction('comfirm', {
                text: this.$t('verify.open_validate_change_toast'),
                btn: [
                  {
                    text: this.$t('basic.cancel'),
                    callback: () => {},
                  },
                  {
                    text: this.$t('basic.comfirm'),
                    callback: () => {
                      // create a action id activity
                      const actionId = `ModifyValidate_Email_actionId_${this.$Helper.getTime()}`
                      // subcribe the action when validate success
                      this.$Helper.onAction(actionId, smsCode => {
                        let params = {
                          sendType: 2,
                          validType: val === 1 ? 0 : 1,
                          email: this.email,
                        }
                        if (smsCode[0]) params.mobileCode = smsCode[0]
                        if (smsCode[1]) params.emailCode = smsCode[1]
                        this.$Helper.ajax({
                          url: '/app/account/setValid.api',
                          params,
                        })
                        .then(
                          ({code, msg}) => {
                            this.$Helper.emitAction('toast', { text: msg })
                            if (code === 200) {
                              this.$store.dispatch('basic/setLoginData', { openEmailValid: params.validType })
                              this.$store.dispatch('layermodel/close')
                              setTimeout(() => {
                                this.$Helper.jumpBack()
                              }, 600)
                            }
                          },
                        )
                      })

                      if (val === 0) {
                        this.$Helper.emitAction(actionId, '')
                      } else {
                        // dispatch the action to show the validate model
                        this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: { bindType: 'email', actionId } })
                      }
                    },
                  },
                ],
              })
            },
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
    switchValue() {
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
  }
</style>
