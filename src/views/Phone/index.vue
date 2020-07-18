<template lang="html">
  <div class="container">
    <IMenuList :list="settingConfig" @click="Run($event.handle)"/>
    <div class="bottom-btn active box box-item" @click="Run('BindPhone')">
      {{ $t('basic.modify_phone') }}
    </div>
  </div>
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
export default {
  name: 'Phone',
  components,
  data() {
    return {}
  },
  computed: {
    ...mapState('basic', ['mobile', 'openPhoneValid', 'openEmailValid']),
    settingConfig() {
      return [
        [
          {
            handle: 'Phone',
            text: this.$t('basic.mobile'),
            rightText: this.$Helper.secretStr({str: this.mobile, length: 4}),
            rightIcon: ' ',
          },
          {
            handle: () => {},
            text: this.$t('identity.open_validate'),
            rightIcon: ' ',
            isSwitch: true,
            switchValue: this.openPhoneValid,
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
                      const actionId = `ModifyValidate_Phone_actionId_${this.$Helper.getTime()}`
                      // subcribe the action when validate success
                      this.$Helper.onAction(actionId, smsCode => {
                        let params = {
                          sendType: 1,
                          validType: val === 1 ? 0 : 1,
                          mobile: this.mobile,
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
                              this.$store.dispatch('basic/setLoginData', { openPhoneValid: params.validType })
                              this.$store.dispatch('layermodel/close')
                              setTimeout(() => {
                                this.$Helper.jumpBack()
                              }, 600)
                            }
                          },
                        )
                      })
                      // 如果是开启   不用发送验证码
                      if (val === 0) {
                        this.$Helper.emitAction(actionId, '')
                      } else {
                        // dispatch the action to show the validate model
                        this.$store.dispatch('layermodel/push', { name: 'ModifyValidate', type: 'up', params: { bindType: 'mobile', actionId } })
                      }
                    },
                  },
                ],
              })
              // end
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
