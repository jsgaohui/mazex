<template lang="html">
  <div class="layout  container box box-row router-view">
    <div class="head box">
      <div class="left box box-item"><i data-v-2b663b10="" class="iconfont" @click="$Helper.emitAction('closeModel')"></i></div>
      <div class="name box box-item box-col-flex">
        <span>{{$t('basic.help')}}</span>
      </div>

    </div>
      <div class="main overflow-y">
        <div class="help-con" >
          <div class="menu-hd title">{{item.helpTitle}}</div>
          <div class="help_r_content" v-html="item.content"></div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      item: null,
    }
  },
  methods: {
    showOb(item) {
    },
  },
  created() {
    // 初始化参数
    if (this.params.item) {
      this.item = this.params.item
    }
  },
}
</script>
<style lang="less" scoped>

  .router-view{
    background:#fff
  }
  .layout .head{
    border-bottom:1px solid #eee;
    min-height:12vw!important;
    height: 12vw;
    background: #fff;
    padding: 0 2vw;
  }
  .layout .head .name {
    font-size: 4.6vw;
    font-weight: 600;
    color: #64acf5;
  }

  .help_r_content{
    padding:4vw
  }

</style>

