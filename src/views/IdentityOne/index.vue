<template lang="html">
  <div class="container">
    <div class="tb-form">
      <h5>{{ $t('identity.country') }}</h5>
      <h2 @click="showSlideModel">
        <span>
          {{ basicData.countryName || $t('identity.please_chose')  }}
        </span>
        <i class="iconfont" style="margin-right: 4vw;font-size: 4vw">&#xe61f;</i>
      </h2>
      <h5>{{ $t('identity.firstname') }}</h5>
      <Iinput inputType="text" v-model="basicData.firstName" :placeholder="$t('identity.firstname_toast')" />
      <div class="half-x-line" />
      <h5>{{ $t('identity.name') }}</h5>
      <Iinput inputType="text" v-model="basicData.realName" :placeholder="$t('identity.name_toast')" />
      <div class="half-x-line" />
      <h5>{{ $t('identity.card_number') }}</h5>
      <Iinput inputType="text" v-model="basicData.idCard" :placeholder="$t('identity.card_toast')" />
      <div class="half-x-line" />
    </div>
    <div class="bottom-btn box box-item" :class="{active: testParams.length === 0 && this.isIdCard}" @click="nextFn">{{ $t('basic.next_step') }}</div>
  </div>
</template>
<script>
import _ from 'lodash'
import components from '@/components'
export default {
  name: 'Identity',
  components,
  data() {
    return {
      basicData: {
        firstName: null,
        realName: null,
        idCard: null,
        countryName: null,
      },
      status: 0,
      addressConf: {},
    }
  },
  computed: {
    testParams() {
      return this.$Helper.testParamsComplete({params: this.basicData})
    },
    isIdCard() {
      return true
      // return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.basicData.idCard)
    },
    countryCode() {
      return _.get(_.filter(this.addressConf, item => this.basicData.countryName === item.code), '[0].countryCode')
    },
  },
  watch: {},
  methods: {
    nextFn() {
      if (this.testParams.length > 0) {
        let paramConf = {
          firstName: this.$t('identity.firstname_toast'),
          realName: this.$t('identity.name_toast'),
          idCard: this.$t('identity.card_toast'),
          countryName: this.$t('identity.contry_toast'),
        }
        this.$Helper.emitAction('toast', {
          text: paramConf[this.testParams[0]],
        })
        return
      }
      this.$Helper.jumpPage({name: 'IdentityTwo', query: this.basicData}, this)
    },
    showSlideModel() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'CountrySelect',
          type: 'right',
          params: {
            callback: item => {
              this.basicData.countryName = item.code
            },
          },
        },
      )
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
    padding: 3vw 4vw;
    h5{
      font-size: 3.8vw;
      padding: 2vw 0;
    }
    h2{
      font-size: 5vw;
      margin-bottom: 7vw;
      margin-top: 2vh;
    }
    i{
      color: #333;
    }
    input {
      margin-top: 3vw;
      margin-bottom: 1.8vw;
      width: 100%;
    }
    .half-x-line{
      background: #ccc;
      margin-bottom: 5vw;
    }
  }
</style>
