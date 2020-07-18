<template lang="html">
  <div class="layout overflow-y"  style="width:100% " v-if="appealRecord">
    <!--付款-->
    <div class="container box box-row router-view" img-set="static/favicon.ico">
      <div class="head box">
        <div class="left box box-item"><i class="iconfont" @click="toOtcOrder(appealRecord.orderStatus)"></i></div>
        <div class="name box box-item box-col-flex">
          <span>{{$t('appeal.appealInformation')}}</span>
        </div>

      </div>
      <div class="half-x-line"></div>
      <div class="reason-con box-row-flex overflow-y">
        <div class="shadow-bg top" @click="showAppealReasonSelct">
        <span v-show="!appealForm.appealType&&appealForm.appealType!==0" >{{$t('appeal.selectAppealReason')}}<i class="iconfont">&#xe61f;</i></span>
        <span v-show="appealForm.appealType||appealForm.appealType===0" >{{appealForm.appealTopic}}<i class="iconfont">&#xe61f;</i></span>
        </div>
        <div  v-if="appealForm.appealType===0">
          <ul><li>
            <span>{{$t('appeal.appealOtherReason')}}</span>
          </li>
          </ul>
            <div class="input-txt box box-x-center">

              <textarea type="text" class="other-input" v-model="appealForm.appealOtherReason"  :placeholder="$t('appeal.requireOtherReason')" maxLength="128" style="height:20vw;"/>
          </div>
        </div>
        <div class="upload">
          <h3>{{$t('appeal.appealUploadImg')}}</h3>
          <ul class="box box-space-bettwen">
            <li>
              <CommonUploadImg  uploadInputId="uploadInputId1"  @change="uploadImageEvent( $event.handle, $event)" />
            </li>
            <li>
              <CommonUploadImg  uploadInputId="uploadInputId2"  @change="uploadImageEvent( $event.handle, $event)" />
            </li>
            <li>
              <CommonUploadImg  uploadInputId="uploadInputId3"  @change="uploadImageEvent( $event.handle, $event)"/>
            </li>
            <li v-show="isShowUploadInput">
              <CommonUploadImg  uploadInputId="uploadInputId4"  @change="uploadImageEvent( $event.handle, $event)"/>
            </li>
            <li v-show="isShowUploadInput">
              <CommonUploadImg  uploadInputId="uploadInputId5"  @change="uploadImageEvent( $event.handle, $event)"/>
            </li>
            <li v-show="isShowUploadInput">
              <CommonUploadImg  uploadInputId="uploadInputId6"  @change="uploadImageEvent( $event.handle, $event)"/>
            </li>
          </ul>
          <p>{{$t('appeal.appealNote')}} {{$t('appeal.appealNoteOne')}}<br>
            {{$t('appeal.appealNoteTwo')}}</p>
        </div>
        <div class="input-txt box box-x-center" style="margin-bottom:30vw">
          <div>
            <h4>{{$t('appeal.textDocument')}}</h4>
            <textarea type="text" class="other-input" v-model="appealForm.appealUserDesc"  :placeholder="$t('appeal.requireTextDocument')" maxLength="512"/>
          </div>
        </div>
      </div>

  </div>
    <!--选择支付方式END--->
    <!--购买END-->
    <!--底部按钮-->
    <div class="fixed-btn padding-box box box-space-bettwen">
      <div class="bottom-btn02 active" @click="goToAppealRequest()" :disabled="buttonStatus">{{$t('basic.send')}}</div>
    </div>
    <!--底部按钮 END-->
    <error-status :status="errorStatus" />
  </div>
</template>
<script>
import {mapState} from 'vuex'
import CommonUploadImg from '@/components/CommonUploadImg'
import ErrorStatus from '@/components/ErrorStatus'
export default {
  components: {
    CommonUploadImg,
    ErrorStatus,
  },
  data() {
    return {
      buyerResonArr: [
        {text: this.$t('appeal.buyAppealReasonOne'), key: 1, hander: () => { this.bottomSelect(1) }},
        {text: this.$t('appeal.buyAppealReasonTwo'), key: 2, hander: () => { this.bottomSelect(2) }},
        {text: this.$t('appeal.buyAppealReasonThree'), key: 3, hander: () => { this.bottomSelect(3) }},
        {text: this.$t('appeal.appealOther'), key: 0, hander: () => { this.bottomSelect(0) }},
      ],
      sellerResonArr: [
        {text: this.$t('appeal.sellAppealReasonOne'), key: 4, hander: () => { this.bottomSelect(4) }},
        {text: this.$t('appeal.sellAppealReasonTwo'), key: 5, hander: () => { this.bottomSelect(5) }},
        {text: this.$t('appeal.appealOther'), key: 0, hander: () => { this.bottomSelect(0) }},
      ],
      buttonStatus: true, // 提交申诉按钮是否置灰
      appealRecord: {}, // 页面跳转传过来的参数
      appealForm: {
        appealType: null, // 申诉原因类型
        appealTopic: null, // 申诉原因
        appealUserAttach: '', // 申诉图片链接,多张图片以逗号","隔开
        appealUserDesc: null, // 申诉描述文字资料
        appealOtherReason: null, // 其他原因
      },
      imgUrlArr: new Array(6), // 多个组件上传的照片放集合里
      isShowUploadInput: false, //  是否展示第二行的组件
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('basic', ['uid', 'id']),
    orderStatus() {
      switch (this.appealRecord.orderStatus) {
        case 2: return this.$t('otc.cancelled')
        case 3: return this.$t('otc.paid')
        case 4: return this.$t('otc.paidFor')
        case 5: return this.$t('otc.dealDone')
        case 6: return this.$t('otc.appeal')
        default: this.$t('otc.cancelled')
      }
    },
    errorStatus() {
      let appealRecord = this.appealRecord
      if (!this.uid) {
        return 'loginout'
      } else if (!appealRecord) {
        return 'error'
      }
    },
  },

  methods: {
    showAppealReasonSelct() {
      // this.selectAddress = address
      // this.selectId = id
      this.$store.dispatch('layermodel/push', { name: 'BottomSelect', type: 'up', params: { active: this.bottomSelect, list: this.isMyBuy(this.appealRecord.userId, this.appealRecord.direction) ? this.buyerResonArr : this.sellerResonArr } })
    },
    bottomSelect(bottomSelect) {
      this.appealForm.appealType = bottomSelect
      if (bottomSelect === 0) {
        this.appealForm.appealTopic = this.$t('appeal.appealOther')
      } else if (bottomSelect === 1) {
        this.appealForm.appealTopic = this.$t('appeal.buyAppealReasonOne')
      } else if (bottomSelect === 2) {
        this.appealForm.appealTopic = this.$t('appeal.buyAppealReasonTwo')
      } else if (bottomSelect === 3) {
        this.appealForm.appealTopic = this.$t('appeal.buyAppealReasonThree')
      } else if (bottomSelect === 4) {
        this.appealForm.appealTopic = this.$t('appeal.sellAppealReasonOne')
      } else if (bottomSelect === 5) {
        this.appealForm.appealTopic = this.$t('appeal.sellAppealReasonTwo')
      }
    },
    isMyBuy(userId, direction) { // 针对对象是委托单的对象
      if (this.id) {
        // console.log("userId " + userId,this.user);
        // 买卖方向（1买入;2卖出）
        if (direction === 1) {
          if (userId === this.id) {
            return true
          }
        } else { // direction === 2
          if (userId !== this.id) {
            return true
          }
        }
      }
      return false
    },
    uploadImageEvent(i, paramForm) {
      if (paramForm.uploadId === 'uploadInputId1') {
        this.imgUrlArr[0] = paramForm.imgUrl
      } else if (paramForm.uploadId === 'uploadInputId2') {
        this.imgUrlArr[1] = paramForm.imgUrl
      } else if (paramForm.uploadId === 'uploadInputId3') {
        this.imgUrlArr[2] = paramForm.imgUrl
      } else if (paramForm.uploadId === 'uploadInputId4') {
        this.imgUrlArr[3] = paramForm.imgUrl
      } else if (paramForm.uploadId === 'uploadInputId5') {
        this.imgUrlArr[4] = paramForm.imgUrl
      } else if (paramForm.uploadId === 'uploadInputId6') {
        this.imgUrlArr[5] = paramForm.imgUrl
      }
      if (this.imgUrlArr[0] && this.imgUrlArr[1] && this.imgUrlArr[2]) {
        this.isShowUploadInput = true
      }
    },
    toOtcOrder(status) {
      let currentPath = this.$route.path // 当前路径
      // 如果是在当前路径 直接关闭
      if (currentPath.indexOf('OtcOrder'.toLowerCase()) > -1) {
        this.$Helper.emitAction('closeModel')
        let fn = this.params.callback
        let param = {key: status, type: 0, status: status}
        if (fn && this.$Helper.isType(fn, () => {})) {
          fn(param)
        }
      } else {
        this.$Helper.toOtcOrder(this, status, status)
      }
    },
    validate() {
      if (!this.appealForm.appealType && this.appealForm.appealType !== 0) {
        this.$Helper.emitAction('toast', {
          text: this.$t('appeal.selectAppealReason'),
        })
        return false
      }
      if (this.appealForm.appealType === 0) {
        if (!this.appealForm.appealOtherReason) {
          this.$Helper.emitAction('toast', {
            text: this.$t('appeal.requireOtherReason'),
          })
          return false
        }
      }
      if (!this.appealForm.appealUserDesc) {
        this.$Helper.emitAction('toast', {
          text: this.$t('appeal.requireTextDocument'),
        })
        return false
      }
      return true
    },
    goToAppealRequest() {
      let $this = this
      $this.appealForm.createTime = null
      if (!$this.validate()) return
      $this.appealForm.appealUserAttach = ''
      for (var i = 0; i < $this.imgUrlArr.length; i++) {
        if ($this.imgUrlArr[i]) {
          $this.appealForm.appealUserAttach += $this.imgUrlArr[i] + ','
        }
      }
      if ($this.appealForm.appealType === 0) {
        $this.appealForm.appealTopic = $this.appealForm.appealOtherReason
      }
      $this.appealForm.relateOrderId = $this.appealRecord.takerOrderId
      let params = $this.appealForm
      this.$Helper.ajax({
        url: '/app/otc/doAppeal.api',
        params,
      })
      .then(
        ({code, msg}) => {
          if (code === 200) {
            $this.buttonStatus = false
            setTimeout(() => {
              $this.toOtcOrder($this.appealRecord.orderStatus)
            }, 600)
            msg = this.$t('appeal.submitAppealSuccess')
            this.$Helper.emitAction('toast', {
              text: msg,
            })
          }
          this.$Helper.emitAction('toast', { text: msg })
        },
      )
    },
  },
  created() {
    // 初始化参数
    this.appealRecord = this.params.appealRecord
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container,.fixed-btn {
    background: white;
  }
  .tip-top{
    height:12vw;
    line-height:12vw;
    color:#455070;
    font-size:4vw;
    font-weight: bold
  }
  .tip-box .tip-con{
    padding:4vw 0;
    padding-bottom:0px;
  }
  .tip-close {
    position: absolute;
    top: 0vw;
    right: 1.8vw;
    z-index: 101;
  }
  .tip-close i{
    color:#455070;
  }
  .tip-con .content{
    text-align: center;
    line-height:7vw;
    font-size:4.1vw;
    color:#455070
  }
  .tip-con .content p{
    font-size:3.5vw;
  }
  .half-x-line{
    background:#dcdcdf
  }
  .tip-con .box-space-bettwen{
    padding:4vw 5vw;
    font-size:4vw;
    color:#8398a6
  }
  textarea.other-input{
    width:70vw;
    height:30vw;
    border:1px solid #eee;
    padding:1vw;
    text-align:left;
  }
</style>
