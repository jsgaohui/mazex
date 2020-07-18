<template lang="html">
  <!--我的特权-->

  <div class="privilege-con overflow-y" id="scroll_list" ref="routerView">
    <div class="vip-body">
      <div class="vip-main" v-if="item">
        <div class=" vip-card" style="display: block">
          <img :src="getImg('vip-card0'+(changeForm.levelId)+'.png')" style="width:100%">
          <div class="card-bg"></div>
            <div :class="'card0' +(changeForm.levelId)+ ' card-con'">
              <div class="top">
                <h1>VIP{{changeForm.levelId}}</h1>
              </div>
              <div class="bom">
                <p>
                  {{$t('userlevel.pri')}}（{{Number.parseFloat(item.map[changeForm.levelId].rate * 100).toFixed(2)}}%）
                </p>
                <div class="box box-space-bettwen"><b>{{$t('userlevel.lock')}}&nbsp;{{item.map[changeForm.levelId].udtFreeze}}&nbsp;{{$t('userlevel.currency')}}</b></div>
              </div>
            </div>

        </div>

        <div class="swiper-pagination" slot="pagination"></div>
      </div>
    </div>
    <!--幻灯-->
    <!--列表-->
    <div class="from-main" v-if="item">
      <div class="from-box box box-space-bettwen">
        <div class="left"><i class="iconfont">&#xe66b;</i></div>
        <div class="right">
          <div class="input-t box box-space-bettwen" @click="showSlideModel"><input type="text" :placeholder="'VIP'+changeForm.levelId" :disabled="true"><span><i class="iconfont" >&#xe638;</i></span></div>
          <div class="line"></div>
          <div class="info box box-space-bettwen">
             <label>
               {{$t('userlevel.need')}}:
               {{changeForm.levelId > 0 ? Number.parseFloat(item.map[changeForm.levelId].udtFreeze-this.item.freezeAmount).toFixed(8).replace(/[.]?0+$/g,""):0}} {{$t('userlevel.currency')}}
              </label><span >{{Number.parseFloat(item.map[changeForm.levelId].rate * 100).toFixed(2)}}%{{$t('userlevel.commission')}}</span></div>
        </div>
      </div>
      <p v-if="ifCanLevelUp" @click="jumpToMyFund()">{{$t('userlevel.balance_not_enough')}}</p>
      <p v-else>{{$t('userlevel.current')}}{{$t('userlevel.currency')}}{{$t('userlevel.balance')}}: {{Number.parseFloat(this.item.availableAmount).toFixed(8).replace(/[.]?0+$/g,"")}}</p>
      <div class="btn-box">
        <div class="login-btn box box-item" :class="{'active':!ifCanLevelUp}" @click="changeUserLevel()"> {{$t('userlevel.levelupnow')}}</div>
      </div>
    </div>
    <!--列表 end-->
    <error-status :status="errorStatus"/>
  </div>
  <!--我的特权END-->
</template>
<script>
  import _ from 'lodash'
  import components from '@/components'
  import {mapState} from 'vuex'

  export default {
    name: 'Privilege',
    computed: {
      ...mapState('basic', ['uid']),
      errorStatus() {
        if (!this.uid) {
          return 'loginout'
        }
      },
      ifCanLevelUp() {
        return Number.parseFloat(this.item.map[this.changeForm.levelId].udtFreeze - this.item.freezeAmount) > Number.parseFloat(this.item.availableAmount)
      },
    },
    components: {
      ...components,
    },
    data() {
      return {
        vipArr: [],
        vipList: [],
        freezediv: false,
        showdiv: false,
        item: null,
        chooseId: null,
        listLoading: true,
        chooseLevel: null,
        changeForm: {
          preLevelId: null,
          levelId: null,
        },
      }
    },
    created() {
      this.getUserLevel()
    },
    methods: {
      getImg(srcImage) {
        return '/static/images/' + srcImage
      },
      jumpToMyFund() {
        this.$Helper.jumpPage({ name: 'MyFund' }, this)
      },
      showSlideModel() {
        let $this = this
        this.$store.dispatch(
          'layermodel/push',
          {
            name: 'BottomSelect',
            type: 'up',
            params: {
              active: this.language,
              list: this.vipArr.map(item => ({
                // text: `<img src="static/lang/${item.img}.png" style="height: 7vw; margin-right: 2vw;"/> ${item.name}`,
                text: `${item.name}`,
                hander: () => {
                  // this.setLanguage(item.key)
                  $this.changeForm.levelId = item.id
                },
              })),
            },
          }
        )
      },
      getUserLevel() {
        // let $this = this
        this.$Helper.ajax({
          url: '/app/user/getUserLevel.api',
          method: 'POST',
        }).then(
          data => {
            this.item = _.get(data, 'data.result')
            for (var key in this.item.map) {
              if (key > this.item.levelId) {
                let arr = {name: 'VIP' + key, id: key, key: this.item.map[key]}
                this.vipArr.push(arr)
              }
            }
            this.changeForm.levelId = this.$Helper.getUrlParams().levelId
            this.changeForm.preLevelId = this.item.levelId
           // this.chooseLevel = this.item.map[this.choooseId]
          })
      },
      changeUserLevel() {
        let $this = this
        if (this.ifCanLevelUp) return
        this.$Helper.ajax({
          url: '/app/user/changeUserLevel.api',
          method: 'POST',
          params: this.changeForm,
        }).then(
          ({code, msg}) => {
            if (code !== 200) {
              this.$Helper.emitAction('toast', {
                text: msg,
              })
              return
            }
            setTimeout(function() {
              $this.$Helper.jumpBack()
            }, 200)
          },
        )
      },
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .router-view{
    background: #fff;
  }


  .vip-main {
    overflow: hidden;
    position: relative;
    padding-bottom:2vw;
    background:#fafafd;
  }

  .vip-card {
    width: 82vw;
    height: 54vw;
    margin: 5vw auto;
    position: relative;
    display: none;
  }

  .scale-card {
    transform: scale(0.8)
  }

  .vip-card .card-bg {
    position: absolute;
    left: 0px;
    top: 0px;
  }

  .vip-card .card-con {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 4vw;
    color: #fff;

  }

  .vip-card .card-con .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

  }

  .vip-card .card-con .top h1 {
    font-size: 5.3vw;
  }

  .vip-card .card-con .top em {
    display: block;
    font-size: 3.9vw;
    padding-top: 1.5vw;
    padding-left: 0.6vw;

  }

  .vip-card .card-con .top span {
    background: #3c746b;
    border-radius: 1vw;
    padding: 1.5vw 3vw;
    font-size: 4.2vw;
  }
  .vip-card .card-con.card01 .top span{
    background: #3c746b;
  }
  .vip-card .card-con.card02 .top span{
    background: #5c72aa;
  }
  .vip-card .card-con.card02 .top .open-vip,.vip-card .card-con.card02 .top .open-vip i{
    color:#5c72aa;
  }
  .vip-card .card-con.card03 .top span{
    background: #9197a0;
  }
  .vip-card .card-con.card03 .top .open-vip,.vip-card .card-con.card03 .top .open-vip i{
    color:#9197a0;
  }
  .vip-card .card-con.card04 .top span{
    background: #cbaf7f;
  }
  .vip-card .card-con.card04 .top .open-vip,.vip-card .card-con.card04 .top .open-vip i{
    color:#cbaf7f;
  }
  .vip-card .card-con.card05 .top span{
    background: #cb9b97;
  }
  .vip-card .card-con.card05 .top .open-vip,.vip-card .card-con.card05 .top .open-vip i{
    color:#cb9b97;
  }
  .vip-card .card-con .top .open-vip{
    font-size: 4.2vw;
    color:#3c746b;
  }
  .vip-card .card-con .top .open-vip i{
    color:#3c746b;
    font-size: 5.5vw;
  }
  .vip-card .card-con .bom {
    position: absolute;
    bottom: 4vw;
    left: 0vw;
    padding: 0 4vw;
    width: 100%;
    font-size: 4vw;
  }

  .vip-card .card-con .bom p {
    color: #eee;
    font-size: 3.8vw;
    padding-bottom: 1vw;
  }

  .vip-card .card-con .bom span {
    color: #135a42
  }
  .vip-card .card-con.card02 .bom span {
    color: #5c72aa
  }
  .vip-card .card-con.card03 .bom span {
    color: #777f8d
  }
  .vip-card .card-con.card04 .bom span {
    color: #bd8d3a
  }
  .vip-card .card-con.card05 .bom span {
    color: #cb584c
  }

  .privilege-con .top-txt {
    padding: 4vw
  }

  .privilege-con .top-txt .line {
    background: #646da9;
    width: 35%;
    height: 2px;
  }

  .privilege-con .top-txt span {
    padding: 0px 4vw;
    font-size: 4.5vw;
    color: #646da9
  }

  .list-box {
    padding-left: 4vw;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: relative;
    padding-bottom: 4vw;
    margin-bottom: 4.4vw;
  }

  .list-top {
    border-bottom: 1px solid #eee;
    height: 12.9vw;
    font-size: 3.9vw;
    color: #a9adbe;
    padding-right: 4vw
  }

  .list-top h2 {
    font-size: 3.9vw;
  }

  .list-top h2 b {
    color: #3d4566
  }

  .list-top span {
    font-size: 3.3vw;
  }

  .list-tr {
    font-size: 3.3vw;
    padding-top: 2.5vw;
    padding-right: 4vw;
  }

  .list-td {

    line-height: 6vw;
    font-size: 3.5vw;
    color: #3d4566
  }

  .list-td label {
    color: #a9adbe;
    margin-right: 1.2vw;
  }
  .from-main{
    padding:4vw;
  }
  .from-box{
    border:1px solid #dfdfdf;
    height:24vw;
  }
  .from-box .left{
    padding:0;
    background:#fff;
  }
  .from-box .left i{
    color:#dfdfdf;
    font-size:8vw;
  }
  .from-box .line{
    background:#dfdfdf;
    height:1px;
  }
  .from-box .right{
    width:84vw;
  }
  .from-box .input-t{
    height:12vw;
  }
  .from-box .input-t input{
    height:12vw;
font-size:4.5vw
  }
  .from-box .input-t span{
    background:#d0d9de;
    width:12vw;
    height:12vw;
    text-align:center;
    padding-top:1.5vw;
  }
  .from-box .input-t i{
    color:#fff;
    font-size:9vw;

  }
  .from-box .info{
    height:11vw;
    color:#a9adbe;
    font-size:4.2vw;
    padding-right:2vw;
  }
  .from-main p{
    padding:3vw 0;
    text-align: right;
    color:#a1b2bf;
  }
  .btn-box .login-btn{
    height: 11vw;
    margin: 0 auto;
    background: #aaa;
    color: #fff;
    font-size: 4.2vw;
    font-weight: 600;
    border-radius: 1px;
  }
  .btn-box .login-btn.active{
    background: #646da9;
  }
</style>
