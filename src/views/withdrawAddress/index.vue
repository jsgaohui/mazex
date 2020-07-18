<template lang="html">
  <div class="container overflow-y mescroll" ref="routerView">
    <div class="table">
    <div class="half-x-line" style="background: #ddd;"/>
      <div class="row box box-x-center" v-for="(item, key) of showList" :key="key" @click="showEctAddress(item)">
        <div class="name box box-y-center box-col-flex">
          {{ item.dcCode }}
        </div>
        <div class="info box-x-right">
          <span class="input-group-addon addon-tag uppercase">{{ item.addressNum }}</span>
          <i class="iconfont">&#xe612;</i>
        </div>
        <div class="half-x-line" />
      </div>
      <error-status :status="errorStatus" />
    </div>
    </div>
  </div>
</template>
<script>
import ErrorStatus from '@/components/ErrorStatus'
import components from '@/components'

export default {
  name: 'MyFund',
  components: {
    ...components,
    ErrorStatus,
  },
  data() {
    return {
      errorStatus: null,
      showList: [],
    }
  },
  methods: {
    initSymbolCapital() {
      let $this = this
      this.$Helper.ajax({
        url: '/app/withdraw/appGetAddressByUserId.api',
      })
      .then(
        ({data}) => {
          $this.showList = data.resultList
        },
        () => {
          this.errorStatus = 'error'
        },
      )
    },
    showEctAddress(data) {
      let query = {dcCode: data.dcCode, addressNum: data.addressNum}
      this.$Helper.jumpPage({ name: 'ExtractAddress', query }, this)
    },
  },
  created() {
    this.initSymbolCapital()
  },
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    padding: 0vw 4vw;
    background: white;
    .card {
      color:#555;
      // background:#8dbaf9;
      box-shadow: 1px 1px 7px #ddd;
      border-radius: 4px;
      padding: 4vw;
      h2{
        font-weight: 600;
        font-size: 5vw;
      }
      p{
        font-weight: 400;
        font-size: 3.6vw;
        margin-bottom: 3vw;
        margin-top: 1vw;
      }
    }
    .cb-form{
      margin-top: 4vw;
      padding-bottom: 2vw;
      position:relative;
      .search input{
        line-height:24px;
        border:none;
      }

      .search .icon-search{
          font-size:16px;
          color:#ccc;
          margin-right:6px;

      }
    }
    .table {
      .row {
        padding: 4vw 0;
        position: relative;
        &.head{
          padding: 2.5vw 0;
          .name{
            font-size: 3.6vw;
            font-weight: 400;
          }
          .info{
            font-size: 3.6vw;
            font-weight: 400;
          }
        }
        .name {
          width: 20%;
          font-size: 4.4vw;
          font-weight: 600;
          color: #333;
          i{
            font-size: 5vw;
          }
        }
        .info {
          padding-left: 5vw;
          .num {
            font-size: 4.6vw;
            font-weight: 500;
            padding-bottom: 1vw;
          }
          .status {
            font-size: 3.4vw;
            color: #aaa;
          }
          i{
            font-size:3.4vw;
            color:#ccc;
          }
        }
        .half-x-line {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
        }
      }
    }
  }
</style>
