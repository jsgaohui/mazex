<template lang="html">
  <div class="container box box-row mescroll" id="scroll_list">
    <itable :list="recordList" :showList="tableShowList" :baseFontSize="3.8" :baseRowHeight="14"
            style="margin-top: 2vw;" @tap="toDetail($event)"></itable>
  </div>
</template>

<script>
  import components from '@/components'
  import _ from 'lodash'
  import MeScroll from 'mescroll.js'

  export default {
    name: 'history',
    components,
    data() {
      return {
        bottomSelect: 1,
        page: 1,
        query: {},
        recordList: [],
        scrollObj: null,
        isShow: true,
        count: 0,
        tradeMarket: null,
      }
    },
    computed: {
      showList() {
        return [
          {
            createTime: {
              text: this.$t('myfund.submit_time'),
              align: 'left',
              width: 60,
            },
            rechargeAmount: {
              text: this.$t('basic.num'),
              align: 'center',
            },
            enable: {
              text: this.$t('basic.status'),
              align: 'right',
              caculate: (res) => {
                if (res === 1) return this.$t('basic.complete')
                else return this.$t('basic.not_complete')
              },
            },
          },
          {
            createTime: {
              text: this.$t('myfund.submit_time'),
              align: 'left',
              width: 60,
            },
            tradeAmount: {
              text: this.$t('basic.num'),
              align: 'center',
            },
            enable: {
              text: this.$t('basic.status'),
              align: 'right',
              caculate: (res) => {
                if (res === 5) return this.$t('basic.complete')
                else return this.$t('basic.not_complete')
              },
            },
          },
        ]
      },
      tableShowList() {
        return this.showList[this.bottomSelect]
      },
    },
    methods: {
      toDetail(item) {
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'RechargeWithdraw',
            type: 'right',
            params: {item: item, type: this.bottomSelect}, // 0充值  1提现
          }
        )
      },
      initRecordList() {
        this.$Helper.ajax({
          url: (this.bottomSelect === 0 ? `/app/account/appQueryRecords.api` : `/app/account/appWithdrawRecords.api`) + `?symbol=${this.query.dcCode}`,
          params: {
            page: this.page,
            limit: 100,
          },
        })
          .then(
            data => {
              let list = _.get(data, 'data.pageResult.records')
              if (list && list.length > 0) {
                this.recordList = this.recordList.concat(list)
                this.page++
              }
              this.scrollObj.endSuccess(list.length, list && list.length > 0)
            },
          )
      },
      initScroll() {
        this.scrollObj = new MeScroll(`scroll_list`, {
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.initRecordList,
            isBounce: false,
            // clearEmptyId: `scroll_list`,
            htmlNodata: `<div class="box box-item empty-status">${this.$t('basic.not_more')}</div>`,
          },
        })
      },
    },
    created() {
      this.query = this.$Helper.getUrlParams()
      this.bottomSelect = Number.parseInt(this.query.bottomSelect)
    },
    mounted() {
      this.initScroll()
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  @import url('../../theme/mescroll.min.css');

  .container {
    overflow-x: hidden;
    overflow-y: auto;
    background: white;
    padding:15px
  }

  .cw-box {
    padding: 10px;

    .ls-list {

      padding-top: 10px;
      padding-bottom: 10px;

      ol {
        font-size: 15px;
        font-weight: bold;
        line-height: 40px;
      }

      .cw-list {
        line-height: 24px;
        width: 100%;
        color: #ccc;
        font-size: 14px;
      }

      .cw-list-tr {
        color: #333;
      }

      .cw-list-th div:first-child, .cw-list-tr div:first-child {
        width: 50%;
        text-align: left;
      }

      .cw-list-th div:nth-child(2), .cw-list-tr div:nth-child(2) {
        width: 30%;
        text-align: left;
      }

      .cw-list-th div:last-child, .cw-list-tr div:last-child {
        width: 20%;
        text-align: right;
      }
    }

    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .line {
      border-bottom: 1px solid #e5e5e5;
      height: 1px;
      line-height: 1px;
    }
  }
</style>
