<template lang="html">
  <div class="container">
    <IMenuList :list="settingConfig" listType="chose" :listChosed="listChosed" @click="choseFn"/>
  </div>
</template>
<script>
import components from '@/components'
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  name: 'Language',
  components,
  data() {
    return {
      listChosed: 'zh',
    }
  },
  computed: {
    ...mapState('setting', ['language']),
    settingConfig() {
      return [
        [
          {
            handle: 'en',
            text: 'English',
          },
          {
            handle: 'zh',
            text: '简体中文',
          },
          {
            handle: 'ko',
            text: '한국어',
          },
          {
            handle: 'in',
            text: 'Indonesia',
          },
        ],
      ]
    },
  },
  watch: {},
  methods: {
    choseFn(e) {
      this.listChosed = e.handle
      this.$store.dispatch('setting/setData', { language: this.listChosed })
      setTimeout(() => this.$Helper.jumpBack(-1), 200)
      this.initSymbolList()
    },
    initSymbolList() {
      this.$Helper.ajax({
        url: '/app/appInitQuotation.api',
      })
      .then(
        data => {
          let { symbolMap, sellteMarket } = _.get(data, 'data') || {}
          // update the store
          // 获取信息，更新store
          this.$store.dispatch('quotation/refreshData', { symbolMap, sellteMarket })
        },
        () => {
          this.setErrorStatus('error')
        },
      )
    },
  },
  created() {
    this.listChosed = this.language
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
