<template lang="pug">
  .container.box.box-row
    .box-row-flex.mescroll.table-con#scroll_list
      // Itable(:list="tableList" :showList="showList" :baseFontSize="4" :baseRowHeight="15" :tableWidth="tableList && tableList.length > 0 ? 150 : 0" :paddingRight="tableList && tableList.length > 0 ? 3 : 0")
      InviteOne(:list="tableList")
    err-status(:status="errorStatus")
</template>
<script>
import InviteOne from './InviteOne'
import components from '@/components'
import MeScroll from 'mescroll.js'
import _ from 'lodash'
export default {
  name: 'InviteRecord',
  components: {
    ...components,
    InviteOne,
  },
  data() {
    return {
      tableList: [],
      page: 1,
      scrollObj: null,
    }
  },
  props: {},
  computed: {
    errorStatus() {
      return null
    },
    showList() {
      return {
        createTime: {
          align: 'left',
          text: this.$t('basic.time'),
          color: '#717dd9',
          // width: 30,
        },
        mobile: {
          text: this.$t('basic.mobile'),
          color: '#717dd9',
          align: 'right',
          // width: 30,
        },
        email: {
          text: this.$t('basic.email'),
          color: '#717dd9',
          align: 'right',
          // width: 30,
          caculate: item => {
            return item || '-'
          },
        },
        locationCountry: {
          text: this.$t('invite.country'),
          color: '#717dd9',
          align: 'right',
          // width: 30,
        },
        isValid: {
          align: 'right',
          text: this.$t('basic.status'),
          color: '#717dd9',
          caculate: item => {
            if (item === 1) return this.$t('invite.validated')
            return this.$t('invite.un_validated')
          },
          // width: 30,
        },
      }
    },
  },
  watch: {},
  methods: {
    initScroll() {
      if (this.scrollObj) return
      this.scrollObj = new MeScroll('scroll_list', {
        down: {
          use: false,
          auto: false,
        },
        up: {
          callback: this.initList,
          htmlNodata: `<div class="box box-item empty-status">${this.$t('basic.not_more')}</div>`,
        },
      })
    },
    initList() {
      this.$Helper.ajax({
        url: '/app/manage/getOwnMember.api',
        params: {
          page: this.page,
          limit: 10,
          userName: '',
        },
      })
      .then(
        ({data}) => {
          let list = _.get(data, 'result.records') || []
          if (list.length > 0) {
            this.tableList = this.tableList.concat(list)
            this.page++
          }
          this.scrollObj.endSuccess(list.length, list.length > 0)
        },
      )
    },
  },
  created() {},
  mounted() {
    this.initScroll()
  },
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container{

  }
</style>
