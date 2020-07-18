<template lang="html">
  <div class="privilege-con overflow-y" id="scroll_list" ref="routerView"  v-if="item" >
    <div class="vip-body">
      <swiper :options="swiperOption" class="swiper-box vip-main" ref="mySwiper" >
        <swiper-slide class="swiper-item vip-card" v-for="(value, key,index) in item.map" :key="key" >
          <img :src="getImg('vip-card0'+(index+1)+'.png')" style="width:100%">
          <div class="card-bg"></div>
          <!--<img src="static/images/vip-card01.png" style="width:100%">-->
            <div :class="'card0' +(index+1)+ ' card-con'">
              <div class="top">
                <h1>VIP{{key}}</h1>
                  <span  v-if="item.levelId < key" @click="toOpen(key,value)">{{$t('userlevel.open')}}</span>
                  <div class="open-vip" v-else><i class="iconfont">&#xe669;</i>{{$t('userlevel.opened')}}</div>
              </div>
              <div class="bom">
                <p v-if="Number.parseInt(item.levelId) === Number.parseInt(key)">
                  <!--{{$t('userlevel.current_pri')}}（{{ item.levelId > 0 ? Number.parseFloat(item.map[item.levelId].rate * 100).toFixed(2) : 0}}%）-->
                  {{$t('userlevel.current_pri')}}（{{Number.parseFloat(item.map[key].rate * 100).toFixed(2)}}%）
                </p>
                <p v-else>
                  {{$t('userlevel.pri')}}（{{Number.parseFloat(item.map[key].rate * 100).toFixed(2)}}%）
                </p>
                <div class="box box-space-bettwen">
                   <b v-if="Number.parseInt(item.levelId) !== Number.parseInt(key)">{{$t('userlevel.lock')}}&nbsp;{{item.map[key].udtFreeze}}&nbsp;{{$t('userlevel.currency')}}</b>
                   <b v-else>{{$t('userlevel.lock_volume')}}  {{item.freezeAmount}}&nbsp;{{$t('userlevel.currency')}}</b>
                  <span  v-if="!ifCanUnfreeze" >{{$t('userlevel.unlock')}}</span>
                  <a  v-else @click="unFreeze()">{{$t('userlevel.unlock')}}</a>
                </div>
              </div>
            </div>

        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!--幻灯-->
    <!--列表-->
    <div class="top-txt box box-space-bettwen">
      <div class="line"></div>
      <span>{{$t('userlevel.cmsorder')}}</span>
      <div class="line"></div>
    </div>
    <div class="list-main overflow-y" v-for="(item, index) in list" v-if="list">
      <div class="list-box">
        <div class="list-top box box-space-bettwen">
          <h2>{{$t('userlevel.userName')}} <b>{{item.userName}}</b></h2><span>{{item.createTime}}</span>
        </div>
        <div class="list-tr box box-space-bettwen">
          <div class="list-td"><label>{{$t('userlevel.orderNo')}}</label><span>{{item.flowPrimary}}</span></div>
          <div class="list-td"> {{Number.parseFloat(item.commissionRate*100).toFixed(8).replace(/[.]?0+$/g,"")}}%{{$t('userlevel.rate')}}</div>
        </div>
        <div class="list-tr box box-space-bettwen">
          <div class="list-td"><label>{{$t('userlevel.volume')}}</label>{{Number.parseFloat(item.totalCommission).toFixed(8).replace(/[.]?0+$/g,"")}}&nbsp;{{item.dcCode}}</div>
          <div class="list-td"><label>{{$t('userlevel.commission')}}</label>{{Number.parseFloat(item.commission).toFixed(8).replace(/[.]?0+$/g,"")}}&nbsp;{{item.changeDcCode}}</div>
        </div>
      </div>
      <!--<div class="list-box">-->
        <!--<div class="list-tr box box-x-left">-->
          <!--<div class="list-td"><label>{{$t('userlevel.orderNo')}}</label>{{item.flowPrimary}}</div>-->
          <!--<div class="list-td"><label>{{$t('userlevel.userName')}}</label>{{item.userName}}</div>-->
          <!--<div class="list-td"><label>{{$t('userlevel.volume')}}</label>{{-->
            <!--Number.parseFloat(item.totalCommission).toFixed(8).replace(/[.]?0+$/g,"")}}&nbsp;{{item.dcCode}}-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="list-tr box box-x-left">-->
          <!--<div class="list-td"><label>{{$t('userlevel.commission')}}</label>{{-->
            <!--Number.parseFloat(item.commission).toFixed(8).replace(/[.]?0+$/g,"")}}&nbsp;{{item.changeDcCode}}-->
          <!--</div>-->
          <!--<div class="list-td"><label>{{$t('userlevel.rate')}}</label> {{-->
            <!--Number.parseFloat(item.commissionRate*10).toFixed(8).replace(/[.]?0+$/g,"")}}%-->
          <!--</div>-->
          <!--<div class="list-td"><label>{{$t('userlevel.time')}}</label>{{item.createTime}}</div>-->
        <!--</div>-->
        <!--&lt;!&ndash;<div class="num"><span>116</span></div>&ndash;&gt;-->
      <!--</div>-->
    </div>
    <!--列表 end-->
    <!--弹出窗口-->
    <div class="tip-bg" v-show="freezediv" @click="freezediv=false"></div>
    <div class="tip-box" v-show="freezediv" >
      <div class="tip-con">
        <div class="content">
          <!--<h2>解除特权</h2>-->
          <div class="con">{{$t('userlevel.unfreezeTips')}}</div>
        </div>
        <div class="tipbtn"><div class="login-btn"  @click="freezediv = !freezediv" >{{$t('userlevel.cancel')}}</div>
          <div class="login-btn active" @click="changeUserLevel()">{{$t('userlevel.confirm')}}</div></div>
      </div>

    </div>
    <!--弹出窗口-->
    <error-status :status="errorStatus"/>
  </div>
  <!--我的特权END-->
</template>
<script>
  import '../../theme/swiper.css'
  import MeScroll from 'mescroll.js'
  import _ from 'lodash'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import components from '@/components'
  import {mapState} from 'vuex'

  export default {
    name: 'Privilege',
    computed: {
      ...mapState('basic', ['uid']),
      swiperOb() {
        return this.$refs.mySwiper.swiper
      },
      ifCanUnfreeze() {
        return Number.parseFloat(this.item.freezeAmount) > 0 || this.item.levelId > 0
      },
      errorStatus() {
        let list = this.list
        if (!this.uid) {
          return 'loginout'
        } else if (!list) {
          return 'error'
        } else if (list.length === 0) {
          return 'empty'
        } else if (list.length > 0) {
          return null
        }
      },
    },
    components: {
      ...components,
      swiper,
      swiperSlide,
    },
    data() {
      return {
        swiperOption: {
          notNextTick: true,
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          },
          pagination: {
            el: '.swiper-pagination',
          },
        },
        freezediv: false,
        showdiv: false,
        item: [],
        list: [],
        total: null,
        listLoading: true,
        changeForm: {
          preLevelId: null,
          levelId: null,
        },
        listQuery: {
          page: 1,
          limit: 10,
        },
        scrollObj: null,
      }
    },
    methods: {
      unFreeze() {
        this.changeForm.levelId = 0
        this.freezediv = true
      },
      toOpen(levelId) {
        let query = {levelId: levelId}
        this.$Helper.jumpPage({ name: 'PrivilegeOpen', query }, this)
      },
      getImg(srcImage) {
        return '/static/images/' + srcImage
      },
      initScroll() {
        if (this.scrollObj) return
        this.scrollObj = new MeScroll('scroll_list', {
          isLock: true,
          down: {
            use: false,
            auto: false,
          },
          up: {
            callback: this.getCommissionLog, // 上拉回调
            htmlNodata: `<div class="box box-item empty-status">${this.$t('basic.not_more')}</div>`,
          },
        })
      },
      getCommissionLog() {
        let $this = this
        this.listLoading = true
        this.$Helper.ajax({
          url: '/app/manage/getCommissionLog.api',
          method: 'POST',
          params: this.listQuery,
        }).then(
          ({code, data}) => {
            let result = _.get(data, 'result')
            if (code === 207) {
              this.scrollObj.endSuccess($this.listQuery.limit, true)
              return
            }
            // let size = data.size
            let page = result.pages
            // var currentPageDataLength = page === $this.listQuery.page ? total - (page - 1) * size : $this.listQuery.limit
            var hasNext = $this.listQuery.page < page
            var recordList = result.records
            $this.total = result.total
            if (recordList.length > 0) {
              // $this.list = response.data.result.records
              $this.list = $this.list.concat(recordList)
              $this.listQuery.page++
            }
            if ($this.scrollObj) {
              $this.scrollObj.endSuccess($this.listQuery.limit, hasNext)
            }
          },
        )
      },
      changeUserLevel() {
        let $this = this
        this.$Helper.ajax({
          url: '/app/user/changeUserLevel.api',
          method: 'POST',
          params: this.changeForm,
        }).then(
          ({code, msg}) => {
            this.showdiv = false
            this.freezediv = false
            if (code !== 200) {
              this.$Helper.emitAction('toast', {
                text: msg,
              })
              return
            }
            this.$Helper.emitAction('toast', {
              text: this.$t('userlevel.op_success'),
            })
            setTimeout(function() {
              $this.getUserLevel()
            }, 200)
          },
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
            this.changeForm.preLevelId = this.item.levelId
            let userlevel = this.item.levelId
            this.swiperOb.slideTo((userlevel - 1 > 0 ? userlevel - 1 : 0), 0, false)
          },
        )
      },
      getQrImage(userAddress) {
      },
    },
    created() {
      this.getUserLevel()
      // this.getCommissionLog()
    },
    mounted() {
      this.initScroll()
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');

  .vip-body {

  }

  .vip-main {
    overflow: hidden;
    position: relative;

  }

  .vip-card {
    width: 82vw;
    height: auto;
    margin: 5vw auto;
    position: relative;
    transform: scale(1)
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
    width: 28%;
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
  .swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction{
    bottom:0px;
  }
  /*弹窗*/
  .tip-bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.6);
  }
  .tip-box{
    position:fixed;
    top:15%;
    right: 2vw;
    left:2vw;
    z-index: 100;
    text-align: center;
    background: #fff;
  }
  .tip-box .tip-con{
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: left;

    background: #fff;
    position: relative;
  }

  .tip-con .content h2{
    background: #ecf0f7;
    height:12vw;
    line-height:12vw;
    text-align:center;
    font-size:4.2vw;
    color:#464e6d;
  }
  .tip-con .content .con{
    height:50vw;
    padding-top:15vw;
    text-align: center;
    vertical-align: middle;
    font-size:4.2vw;
    color:#464e6d;
  }
  .tip-close{
    position:absolute;
    top:1.5vw;
    right:1.5vw;
    z-index: 101;
  }
  .tip-close i{
    font-size:4.5vw;

  }
  .tipbtn{
    position:absolute;
    bottom:0;
    left:0;
    right:0px;
    display:flex;
    justify-content: center;
    align-items: center
  }
  .tipbtn .login-btn{
    width:50%;
  }
  .login-btn{
    text-align: center;
    height: 11vw;
    line-height: 11vw;
    width:100%;
    margin: 0 auto;
    background: #ecf0f7;
    color: #646da9;
    font-size: 4.2vw;
    font-weight: 600;
    transition: all .4s;
  }
  .login-btn.active{
    background:#646da9;
    color:#fff;
  }
</style>
