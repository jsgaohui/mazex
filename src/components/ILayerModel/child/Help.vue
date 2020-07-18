<template lang="html">
  <div class="layout  container box box-row router-view">
    <div class="head box">
      <div class="left box box-item"><i data-v-2b663b10="" class="iconfont" @click="$Helper.emitAction('closeModel')"></i></div>
      <div class="name box box-item box-col-flex">
        <span>{{$t('basic.help')}}</span>
      </div>

    </div>
    <div class="main overflow-y">
      <div class="help-con" v-if="map">
        <template v-for="(value,key,index) in map">
          <div class="menu-hd" @click="tab(index)"><i :class="{'iconfont':true,'icon-jia':!status[index].show,'icon-jian':status[index].show}" ></i>{{key}}</div>
          <ul v-if="status[index].show" >
            <li v-for="(item,index) in value" @click="toDetail(item)">
              {{item.helpTitle}}<i class="iconfont">&#xe612</i>
            </li>
          </ul>
        </template>
      </div>

    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import _ from 'lodash'
  export default {
    computed: {
    },
    components: {
    },
    data() {
      return {
        map: {},
        status: [],
      }
    },
    methods: {
      toDetail(item) {
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'HelpDetail',
            type: 'right',
            params: {
              item: item,
            },
          }
        )
      },
      tab(index) {
        Vue.set(this.status[index], 'show', !this.status[index].show)
      },
      init() {
        this.$Helper
          .ajax({
            url: '/app/help/helps.api',
          })
          .then(
            ({data}) => {
              // update the store
              this.map = _.get(data, 'helpMap')
              for (var a in this.map) {
                this.status.push({show: false})
                a = a + 1
              }
            },
          )
      },
    },
    created() {
      this.init()
    },
  }
</script>
<style lang="less" scoped>
  .container .head{
    border-bottom:1px solid #eee;
    min-height:12vw!important;
  }
  .router-view{
    background:#fff
  }
</style>
