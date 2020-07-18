<template lang="html">
  <div class="itable-container box box-row" :class="{dark: theme === 'dark'}" :style="{width: tableWidth ? tableWidth + 'vw' : 'auto'}">
    <div class="title box" v-if="title || subTitle">
      <div class="left box box-y-center box-x-right" v-if="title">
        {{ title }}
      </div>
      <div class="right box box-y-center box-x-right box-col-flex" v-if="subTitle">
        {{ subTitle }}
      </div>
    </div>
    <div class="row head box" v-if="showTr" :style="{height: 0.8 * baseRowHeight + 'vw', paddingRight: paddingRight ? paddingRight + 'vw' : 0}">
      <div class="col box box-y-center" :style="{fontSize: baseFontSize + 'vw', width: tr.width ? tr.width + '%' : ''}" :class="{ 'box-item': !tr.align || tr.align === 'center', 'box-x-right': tr.align === 'right', 'box-col-flex': !tr.width }" v-for="(tr, key) in showList" :key="key">
        {{ $Helper.isType(tr, '') ? tr : tr.text }}
      </div>

    </div>
    <div class="body-con box-row-flex overflow-y mescroll" v-if="list && list.length > 0" :style="{paddingRight: paddingRight ? paddingRight + 'vw' : 0}">
      <div class="row body box box-y-center" v-for="(row, rowKey) in loopList" :key="rowKey" :style="{height: baseRowHeight + 'vw'}" @click="$emit('tap', row)">
        <div class="col box" v-for="(col, colKey) in showList" :key="colKey" :style="{fontSize: baseFontSize * 0.9 + 'vw', width: col.width ? col.width + '%' : ''}" :class="{'box-col-flex': !col.width }">
          <div class="box box-y-center box-col-flex normal-text" :class="{ 'box-item': !col.align || col.align === 'center', 'box-x-right': col.align === 'right',}" :style="{color: getColColor(col, row[colKey]), fontWeight: col.fontWeight || baseFontWeight}">{{ caculateTrContent({colKey, rowKey, col, row }) }}</div>
        </div>
        <i v-if="$route.name !== 'Transaction'  && $route.name !== 'TradeDetail'" class="iconfont" style="font-size:16px;margin-left:2px;">&#xe604;</i>
        <div class="half-x-line" :class="{dark: theme === 'dark'}"/>
      </div>
    </div>
    <div class="empty box box-item" v-else>
      <img src="static/images/no-order.png" />
    </div>
    <!-- <div class="half-x-line" size="mini" /> -->
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  components: {},
  data() {
    return {
      tagStatusConf: {
        '负': 'danger',
        '平': 'warning',
        '胜': '',
      },
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
      required: true,
    },
    showList: {
      type: Object,
      default() {
        return {}
      },
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    showTr: {
      type: Boolean,
      default: true,
    },
    baseFontSize: {
      type: Number,
      default: 3,
    },
    baseRowHeight: {
      type: Number,
      default: 7,
    },
    baseFontWeight: {
      type: [String, Number],
      default: 400,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'light',
    },
    num: {
      type: Number,
    },
    tableWidth: {
      type: Number,
    },
    paddingRight: {
      type: Number,
    },
  },
  computed: {
    loopList() {
      let arr = []
      if (this.num && this.list.length < this.num) {
        for (let i = 0; i < this.num - this.list.length; i++) {
          arr.push({})
        }
      }
      let list = this.list.concat(arr)
      return this.reverse ? list.reverse() : list
    },
  },
  watch: {},
  methods: {
    getColColor(col, num) {
      if (this.$Helper.isType(col.color, '')) return col.color
      if (this.$Helper.isType(col.color, () => {})) return col.color(num)
    },
    caculateTrContent({colKey, rowKey, col, row}) {
      if (colKey === 'KEY') return _.isEmpty(row) ? '' : (this.reverse ? this.loopList.length - rowKey : rowKey + 1)
      return col.caculate ? col.caculate(row[colKey]) : row[colKey]
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .itable-container {
    // margin-bottom: 1vh;
    &.dark{
      // background: @chart-bg;
      .title{
        .left{
          color: #fff;
        }
        .right{
          color: #fff;
        }
      }
      .row{
        &.head {
          background: @chart-bg;
          .col{
            color: #fff;
          }
        }
        &.body {
          background: @chart-bg;
          .col{
            color: #fff;
          }
        }
      }
    }
    .title{
      height: 4.6vh;
      padding: 0 2.5vw;
      .left{
        font-size: 2.6vw;
        color: #222;
        font-weight: 500;
      }
      .right{
        font-size: 2.5vw;
        color: #555;
        font-weight: 300;
      }
    }
    .empty{
      height: 25vh;
      img{
        width: 15vw;
      }
    }
    .body-con{
      overflow-y: auto;
    }
    .row{
      position: relative;
      .col{
        height: 4vh;
        font-size: 3vw;
        .normal-text{
          height: 100%;
        }
        .t-tag{

        }
      }
      &.head {
        // background: #f2f2f2;
        background: white;
        .col{
          color: #999;
        }
      }
      &.body {
        background: white;
        &:nth-child(odd){
          // background: #fafbfd;
        }
        .col{
          color: #242424;
          font-size: 2.7vw;
        }
      }
      .half-x-line{
        position: absolute;
        bottom: 0;
        left: 0;
        // right: 0;
        width: 100%;
      }
    }
  }
</style>
