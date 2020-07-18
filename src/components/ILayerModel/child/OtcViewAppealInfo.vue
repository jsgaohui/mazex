<template lang="html">
  <div class="layout overflow-y"  style="width:100% " v-if="appealEntity">
    <!--订单详情-->
    <div class="container box box-row router-view" img-set="static/favicon.ico">
      <div class="head box">
        <div class="left box box-item"><i class="iconfont" @click="toOtcOrder(appealEntity.orderStatus,appealEntity.status)"></i></div>
        <div class="name box box-item box-col-flex">
          <span>{{$t('appeal.appealDetailInfo')}}</span>
        </div>
        <!-- <div class="right box box-item">
          <a :href="isBuyer?'tel:'+'+'+appealEntity.sellerLocationCode+' '+appealEntity.sellerMobile:'tel:'+'+'+appealEntity.buyerLocationCode+' '+appealEntity.buyerMobile">{{$t('appeal.contactEachOther')}}</a>
        </div> -->
      </div>
      <div class="half-x-line"></div>
      <div class="otc-list-con box-row-flex overflow-y">
        <div class="list">
          <div class="hd rel box box-space-bettwen">
            <div class="box box-x-left" style="align-items: center">
              <div class="order-rel">
                <img src="/static/images/buy-bg.png">
                <span v-if="isBuyer">{{$t('otc.buy')}}</span>
                <span v-else>{{$t('otc.sell')}}</span>
              </div>
              <b style="color:#1f3b60;">{{$Helper.format(Number.parseFloat(appealEntity.orderPrice*appealEntity.orderVolume),2)}}&nbsp;{{appealEntity.currencySymbol}}</b>
            </div>
            <div class="detail-btn">{{appealStatus[appealEntity.status]}}</div>
          </div>
          <div  class="half-x-line"></div>
          <div class="half-x-line"></div>
          <div class="bd">
            <div class="box box-space-bettwen"><label>{{$t('otc.oddNumber')}}</label><span class="r-txt"> {{appealEntity.relateOrderId}}</span></div>
            <div class="box box-space-bettwen"><span>{{$t('otc.unitPrice')}}</span><span class="r-txt"> {{Number.parseFloat(appealEntity.orderPrice)}}&nbsp;{{appealEntity.currencySymbol}} </span></div>
            <div class="box box-space-bettwen"><span>{{$t('otc.quantity')}}</span><span class="r-txt"> {{Number.parseFloat(appealEntity.orderVolume)}}&nbsp;{{appealEntity.dcCode}}</span></div>
            <div class="box box-space-bettwen"><span>{{$t('otc.time')}}</span><span class="r-txt"> {{appealEntity.createTime}}</span></div>
            <div class="box box-space-bettwen"><span>{{$t('otc.orderStatus')}}</span><span class="r-txt">{{taterStatus[appealEntity.orderStatus]}}</span></div>
          </div>
        </div>
        <!---对方信息-->
        <div class="pay-info">
          <div class="top-hd box box-space-bettwen">
            {{isBuyer?$t('appeal.sellerInfo'):$t('appeal.buyerInfo')}}
            <span  @click="isShowSellerInfo=!isShowSellerInfo" :class="isShowSellerInfo?'arrow down':'arrow'"><i class="iconfont">&#xe638;</i></span>
          </div>
          <div v-show="isShowSellerInfo">
            <div class="pay-td">
              <label>{{showNameInfo}}</label><div><span>{{isBuyer?appealEntity.sellerRealName:appealEntity.buyerRealName}}</span></div>
            </div>
            <div class="pay-td">
              <label>{{$t('appeal.appealPhone')}}</label>
              <div>
                <span>
                  {{isBuyer?'+'+appealEntity.sellerLocationCode+' '+appealEntity.sellerMobile:'+'+appealEntity.buyerLocationCode+' '+appealEntity.buyerMobile}}
                </span>
              </div>
            </div>
            <div v-show="isBuyer" style="display:block" v-for="item in appealEntity.payTypeList">
              <div class="pay-txt box box-y-center box-x-left">
                <div :class="'pay-icon ' +item.cssName+'-bg'">
                  <label><i :class="'iconfont icon-'+item.cssName"></i></label>
                </div>
                <label>{{item.paymentTypeName}}</label>
              </div>
              <div class="pay-td">
                <label>{{$t('appeal.appealAccountName')}}:</label><div><span>{{item.name}}</span>&nbsp;<em @click="copyFn(item.name)">{{$t('invite.copy')}}</em></div>
              </div>
              <div v-if="item.paymentTypeId===1" class="pay-td"><label>{{$t('otc.bankName')}}</label><div><span>{{item.bankName}}</span>&nbsp;<em @click="copyFn(item.bankName)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===1 && item.subBank" class="pay-td" ><label>{{$t('otc.subbranch')}}</label><div><span>{{item.subBank}}</span>&nbsp;<em @click="copyFn(item.subBank)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===1" class="pay-td"><label>{{$t('otc.bankCardNumber')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===2" class="pay-td"><label>{{$t('otc.wechatAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===3" class="pay-td"><label>{{$t('otc.alipayAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===4" class="pay-td"><label>{{$t('payment.payPalAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===5" class="pay-td" style="align-items: flex-start"><label style="line-height:4vw;">{{$t('payment.westernUnionAccount')}}</label><div><span style="width:60%;word-break:break-all">{{item.swiftInfo}}</span>&nbsp;<em @click="copyFn(item.bankName)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===6" class="pay-td"><label>{{$t('payment.swiftAccount')}}</label><div><span style="word-break:break-all">{{item.swiftInfo}}</span>&nbsp;<em @click="copyFn(item.swiftInfo)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===7" class="pay-td"><label>{{$t('payment.payNowAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===8" class="pay-td"><label>{{$t('payment.PaytmAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===9" class="pay-td"><label>{{$t('payment.qiwiAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===10" class="pay-td"><label>{{$t('payment.interacAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===11" class="pay-td"><label>{{$t('payment.bankAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===11" class="pay-td"><label>{{$t('payment.ifscCode')}}</label><div><span>{{item.ifscCode}}</span>&nbsp;<em @click="copyFn(item.ifscCode)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===11" class="pay-td"><label>{{$t('payment.bankHead')}}</label><div><span>{{item.bankName}}</span>&nbsp;<em @click="copyFn(item.bankName)">{{$t('invite.copy')}}</em></div></div>
              <div v-if="item.paymentTypeId===12" class="pay-td"><label>{{$t('payment.UPIAccount')}}</label><div><span>{{item.account}}</span>&nbsp;<em @click="copyFn(item.account)">{{$t('invite.copy')}}</em></div></div>
              <div class="pay-td" v-if="item.paymentTypeId===2 || item.paymentTypeId===3 || item.paymentTypeId===8 || item.paymentTypeId===12">
                <template v-if="item.qrCode"><label>{{$t('otc.qrCode')}}</label><div><span><i class="iconfont" @click="">&#xe64d;</i></span>&nbsp;<em @click="blowUp(item.qrCode)">{{$t('otc.blowUp')}}</em></div></template>
              </div>
          </div>
          </div>
        </div>
        <!---卖家信息END-->        
        <!---本人申诉-->
        <div class="pay-info appeal-info">
          <div v-show="(isAppealUser&&appealEntity.appealUserDesc)||(!isAppealUser&&appealEntity.matchUserDesc)">
            <h2>{{$t('appeal.myAppeal')}}</h2>
            <h3><p v-show="isAppealUser">{{$t('appeal.appealReason')}}:{{appealEntity.appealTopic}}</p></h3>
            <ul class="box box-x-left">
              <li v-if="appealUserAttach!==''" v-for="appealUserAttach in isAppealUser?appealUserAttachList:matchUserAttachList">
                <div @click="blowUp(appealUserAttach)"><img :src="appealUserAttach">
                  <span class="el-upload-list__item-actions">
                    <span><i class="el-icon-zoom-in"></i></span>
                  </span>
                </div>
              </li>
            </ul>
            <p><span>{{$t('appeal.appealInfo')}}:</span><br>{{isAppealUser?appealEntity.appealUserDesc:appealEntity.matchUserDesc}}</p>
          </div>
          <div v-show="(isAppealUser&&appealEntity.matchUserDesc)||(!isAppealUser&&appealEntity.appealUserDesc)">
            <h2>{{$t('appeal.otherSideAppeal')}}</h2>
            <h3><p v-show="!isAppealUser">{{$t('appeal.appealReason')}}:{{appealEntity.appealTopic}}</p></h3>
            <ul class="box box-x-left">
              <li v-if="appealUserAttach!==''" v-for="appealUserAttach in isAppealUser?matchUserAttachList:appealUserAttachList">
                <div @click="blowUp(appealUserAttach)"><img :src="appealUserAttach">
                  <span class="el-upload-list__item-actions">
                    <span><i class="el-icon-zoom-in"></i></span>
                  </span>
                </div>
              </li>
            </ul>
            <p><span>{{$t('appeal.appealInfo')}}:</span><br>{{isAppealUser?appealEntity.matchUserDesc:appealEntity.appealUserDesc}}</p>
          </div>
        </div>
        <!---本人申诉END-->
        <!-- 补充资料 -->
        <div id="addAppealInfo" class="reason-con" v-show="isShowGoToAppeal">
          <div v-show="imgNum>0" class="upload">
            <h3>{{$t('appeal.appealUploadImg')}}</h3>
            <ul v-if="imgNum <= 3" class="box box-x-left">
              <li v-for="i in imgNum">
                <CommonUploadImg  :uploadInputId="'uploadInputId'+i"  @change="uploadImageEvent( $event.handle, $event)" />
              </li>
            </ul>
            <ul v-if="imgNum > 3" class="box box-x-left">
              <li v-for="i in 3">
                <CommonUploadImg  :uploadInputId="'uploadInputId'+i"  @change="uploadImageEvent( $event.handle, $event)" />
              </li>
              <li v-for="i in imgNum-3">
                <CommonUploadImg v-show="isShowUploadInput" :uploadInputId="'uploadInputId'+(3+i)"  @change="uploadImageEvent( $event.handle, $event)" />
              </li>
            </ul>
            <p>{{$t('appeal.appealNote')}} {{$t('appeal.appealNoteOne')}}<br>
              {{$t('appeal.appealNoteTwo')}}</p>
          </div>
          <div class="input-txt box box-x-center" style="margin-bottom:20vw">
            <div>
              <h4>{{$t('appeal.textDocument')}}</h4>
              <textarea type="text" class="other-input" v-model="appealForm.addAppealDesc"  :placeholder="$t('appeal.requireTextDocument')" maxLength="512"/>
            </div>
          </div>
        </div>
        <!-- 补充资料END -->
      </div>
  </div>
    <!--订单详情END--->
    <!--底部按钮-->
    <div v-show="!isShowGoToAppeal" class="fixed-btn padding-btn box box-space-bettwen">
      <div class="bottom-btn02 active" v-if="appealEntity.status===1||appealEntity.status===2||appealEntity.status===3" @click="goToAppeal(appealEntity)">{{$t('appeal.addAppealInfo')}}</div>
      <div v-show="isAppealUser" v-if="appealEntity.enable!==0&&(appealEntity.status===1||appealEntity.status===2||appealEntity.status===3)" @click="isShowCancelAppeal=true" class="bottom-btn02 active">{{$t('appeal.cancelAppeal')}}</div>
    </div>
    <div v-show="!isShowGoToAppeal&&appealEntity.status===6&&!isAppealUser" class="fixed-btn padding-btn box box-space-bettwen">
      <!-- 申诉方撤销了的,被申诉方可以重新补充资料发起申诉,防止恶意撤销 -->
      <div class="bottom-btn02 active" @click="goToAppeal(appealEntity)">{{$t('appeal.addAppealInfo')}}</div>
    </div>
    <div v-show="isShowGoToAppeal" class="fixed-btn padding-box box box-space-bettwen">
      <div class="bottom-btn02 active" @click="goToAppealRequest()" :disabled="buttonStatus">{{$t('basic.send')}}</div>
    </div>
    <!--底部按钮 END-->
    <!--撤销申诉弹框-->
    <div id="comfirm_container" class="layer" v-show="isShowCancelAppeal">
      <div  class="comfirm-container">
        <div class="c-top">
          <div>{{$t('appeal.cancelAppeal')}}</div>
          <div @click="isShowCancelAppeal=false"><i class="iconfont">&#xe620;</i></div>
        </div>
        <div  class="c-text box box-item">{{$t('appeal.confirmCancelAppeal')}}</div>
        <div  class="btn-container  box box-space-bettwen">
          <div class="bottom-btn02" @click="isShowCancelAppeal=false">{{$t('basic.cancel')}}</div>
          <div class="bottom-btn02 active" @click="cancelAppealClick(appealEntity.relateOrderId)">{{$t('basic.comfirm')}}</div>
        </div>
      </div>
    </div>
    <!--弹出窗口-->
    <div class="tip-bg" @click="imgDiv=!imgDiv"  v-show="imgDiv"></div>
    <div class="tip-box"  style="display:block;top:10%;"   v-show="imgDiv" @click="imgDiv=!imgDiv">
      <div class="tip-con" style="padding:0;" >
        <div style="padding:3vw 9vw;font-size:3.8vw;line-height:7vw;color:#1f405a; text-align: center">
            <img :src="imgUrl" />
        </div>
      </div>
    </div>
    <!--撤销申诉弹框END-->
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
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isBuyer: false, // 是否买家
      appealEntity: {}, // 数据库返回过来的数据
      // 委托单状态 1.申请;2.已取消;3.买方付款确认;4.卖方收款确认;5.已成交;6.申诉处理中;-
      taterStatus: {
        1: this.$i18n.t('otc.pendingPayment'),
        2: this.$i18n.t('otc.cancelled'),
        3: this.$i18n.t('otc.paid'),
        4: this.$i18n.t('otc.paidFor'),
        5: this.$i18n.t('otc.dealDone'),
        6: this.$i18n.t('otc.appeal'),
      },
      // 申诉订单状态1-2申诉待处理;3.申诉处理中;4.申诉成功;5.申诉失败;6.申诉已撤销;
      appealStatus: {
        1: this.$i18n.t('appeal.toBeAppealOne'),
        2: this.$i18n.t('appeal.toBeAppealOne'),
        3: this.$i18n.t('appeal.toBeAppealTwo'),
        4: this.$i18n.t('appeal.toBeAppealThree'),
        5: this.$i18n.t('appeal.toBeAppealFour'),
        6: this.$i18n.t('appeal.toBeAppealFive'),
      },
      isShowGoToAppeal: false, // 我要申诉弹框
      buttonStatus: false, // 提交申诉按钮是否置灰
      appealForm: {
        appealType: null, // 申诉原因类型
        appealTopic: null, // 申诉原因
        appealUserAttach: '', // 申诉图片链接,多张图片以逗号","隔开
        appealUserDesc: null, // 申诉描述文字资料
        matchUserAttach: '', // 对手方申诉图片链接,多张图片以逗号","隔开
        matchUserDesc: null, // 对手方申诉描述文字资料
        addAppealDesc: null, // 补充文字描述
      },
      appealUserAttachList: [], // 申诉方所有图片集合
      matchUserAttachList: [], // 被申诉方所有图片集合
      showAppealImgdiv: false, // 是否展示图片弹出框
      showAppealImgUrl: null, // 展示的图片链接
      imgNum: 6, // 申诉图片还能上传的数量
      isShowCancelAppeal: false, // 是否取消申诉
      isAppealUser: false, // 当前用户是否申诉方
      isBothAppeal: false, // 双方是否都提交了申诉资料(主要是用来控制排版布局)
      imgUrl: null, // 二维码地址
      imgDiv: false,
      imgUrlArr: new Array(6), // 多个组件上传的照片放集合里
      isShowUploadInput: false, //  是否展示第二行的组件
      isShowSellerInfo: true, // 是否展示卖家信息
      showNameInfo: null, // 根据是否买家和是否挂牌用户展示不同信息
    }
  },
  computed: {
    ...mapState('basic', ['uid', 'id']),
    errorStatus() {
      let appealEntity = this.appealEntity
      if (!this.uid) {
        return 'loginout'
      } else if (!appealEntity) {
        return 'error'
      }
    },
  },
  methods: {
    isMyBuy(userId, direction, makerUserId) { // userId为发起申诉方 direction为申诉方的买卖方向 makerUserId为当前订单的挂牌单用户
      if (this.id) {
        // console.log("userId " + userId,this.user);
        // 买卖方向（1买入;2卖出）
        if (direction === 1) {
          if (this.id === userId) {
            this.isBuyer = true
          } else {
            this.isBuyer = false
          }
        } else { // direction === 2
          if (this.id === userId) {
            this.isBuyer = false
          } else {
            this.isBuyer = true
          }
        }
        if (this.isBuyer) { // 当前是买家 展示对方卖家信息
          if (this.id === makerUserId) { // 对方不为挂牌用户
            this.showNameInfo = this.$t('otc.sellerName') // 展示 卖家昵称
          } else {
            this.showNameInfo = this.$t('appeal.sellerNickName') // 展示 卖家姓名
          }
        } else { // 当前是卖家 展示买家信息
          if (this.id === makerUserId) { // 对方不为挂牌用户
            this.showNameInfo = this.$t('appeal.buyerName') // 展示 买家昵称
          } else {
            this.showNameInfo = this.$t('appeal.buyerNickName') // 展示 买家姓名
          }
        }
      }
      return false
    },
    blowUp(url) {
      this.imgDiv = true
      this.imgUrl = url
    },
    copyFn(data) {
      this.$Helper.copyToClipboard(data)
      this.$Helper.emitAction('toast', {
        type: 'top',
        text: this.$t('myfund.copy_success'),
      })
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
    toOtcOrder(orderStatus, appealStatus) {
      let currentPath = this.$route.path // 当前路径
      // 如果是在当前路径 直接关闭
      if (currentPath.indexOf('OtcOrder'.toLowerCase()) > -1) {
        this.$Helper.emitAction('closeModel')
        let fn = this.params.callback
        let param = {key: status, type: 0, status: status}
        if (fn && this.$Helper.isType(fn, () => {})) {
          fn(param)
        }
      } else if (currentPath.indexOf('AppealOrder'.toLowerCase()) > -1) {
        this.$Helper.emitAction('closeModel')
        let fn = this.params.callback
        let param = {key: status, type: 0, status: [appealStatus]}
        if (fn && this.$Helper.isType(fn, () => {})) {
          fn(param)
        }
      } else {
        this.$Helper.toOtcOrder(this, status, status)
      }
    },
    // 补充资料弹框
    goToAppeal(record) {
      this.isShowGoToAppeal = true
      this.appealForm = this.deepCopy(record)
      this.$nextTick(function() { // dom渲染之后,重新回调
        document.querySelector('#addAppealInfo').scrollIntoView(true)
      })
    },
    deepCopy(obj) { // 深复制,以防更改当前对象,将被复制对象也做更改
      let $this = this
      if (typeof obj !== 'object') {
        return obj
      }
      var newobj
      if (!obj) {
        newobj = null
      } else {
        newobj = {}
      }
      for (var attr in obj) {
        newobj[attr] = $this.deepCopy(obj[attr])
      }
      return newobj
    },
    validate() {
      if (!this.appealForm.appealType && this.appealForm.appealType !== 0) {
        this.$Helper.emitAction('toast', {
          text: this.$t('appeal.selectAppealReason'),
        })
        return false
      }
      if (this.appealForm.appealType === 0) {
        if (!this.appealForm.appealTopic) {
          this.$Helper.emitAction('toast', {
            text: this.$t('appeal.requireOtherReason'),
          })
          return false
        }
      }
      if (!this.appealForm.addAppealDesc) {
        this.$Helper.emitAction('toast', {
          text: this.$t('appeal.requireTextDocument'),
        })
        return false
      }
      return true
    },
    // 查詢申诉單
    queryAppealOrder(takerId) {
      let $this = this
      this.$Helper
        .ajax({
          url: '/app/otc/getAppealDetail.api?takerId=' + takerId,
          method: 'POST',
        })
        .then(({code, data, msg}) => {
          if (code === 200) {
            $this.appealEntity = data
            $this.isMyBuy($this.appealEntity.appealUserId, $this.appealEntity.appealDirection, $this.appealEntity.makerUserId)
            $this.appealEntity.appealType = data.appealType
            if ($this.appealEntity.appealUserAttach) {
              $this.appealUserAttachList = $this.appealEntity.appealUserAttach.split(',')
            }
            if ($this.appealEntity.matchUserAttach) {
              $this.matchUserAttachList = $this.appealEntity.matchUserAttach.split(',')
            }
            if ($this.appealEntity.appealUserId === $this.id) {
              $this.isAppealUser = true
            }
            if ($this.isAppealUser) { // 此账号是申诉人账号
              $this.imgNum = $this.appealUserAttachList.length > 0 ? 6 - $this.appealUserAttachList.length + 1 : 6 // 还能上传的申诉图片数量
              $this.appealEntity.addAppealDesc = $this.appealEntity.appealUserDesc
            } else if (!$this.isAppealUser) { // 此账号是对手方账号
              $this.imgNum = $this.matchUserAttachList.length > 0 ? 6 - $this.matchUserAttachList.length + 1 : 6 // 还能上传的申诉图片数量
              $this.appealEntity.addAppealDesc = $this.appealEntity.matchUserDesc
            }
            if ($this.imgNum < 0) { // 理论上不会出现小于零,为了规避页面报错
              $this.imgNum = 0
            }
            if ($this.appealEntity.matchUserDesc && $this.appealEntity.appealUserDesc) {
              $this.isBothAppeal = true
            }
          }
        })
    },
    // 补充资料提交申诉
    goToAppealRequest() {
      let $this = this
      $this.appealForm.createTime = null
      if (!$this.validate()) return
      if (!$this.isAppealUser) { // 被申诉方补充资料
        $this.appealForm.appealUserDesc = null
        $this.appealForm.matchUserAttach = $this.appealForm.matchUserAttach === null ? '' : $this.appealForm.matchUserAttach
        for (var ii = 0; ii < $this.imgUrlArr.length; ii++) {
          if ($this.imgUrlArr[ii]) {
            $this.appealForm.matchUserAttach += $this.imgUrlArr[ii] + ','
          }
        }
        $this.appealForm.matchUserDesc = $this.appealForm.addAppealDesc
      } else {
        for (var i = 0; i < $this.imgUrlArr.length; i++) {
          if ($this.imgUrlArr[i]) {
            $this.appealForm.appealUserAttach += $this.imgUrlArr[i] + ','
          }
        }
        $this.appealForm.appealUserDesc = $this.appealForm.addAppealDesc
      }
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
              $this.toOtcOrder($this.appealEntity.orderStatus, $this.appealEntity.status)
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
    // 撤销申诉
    cancelAppealClick(relateOrderId) {
      this.$Helper.ajax({
        url: '/app/otc/cancelAppeal.api?takerId=' + relateOrderId,
        method: 'post',
      })
      .then(
        ({code, msg}) => {
          if (code === 200) {
            this.$Helper.emitAction('toast', {
              type: 'bottom',
              text: this.$t('appeal.cancelAppealSuccess'),
            })
            setTimeout(() => {
              this.toOtcOrder(this.appealEntity.orderStatus, this.appealEntity.status)
            }, 600)
            return
          }
          this.$Helper.emitAction('toast', { text: msg })
        },
        () => {
          this.errorStatus = 'error'
        },
      )
    },
  },
  created() {
    // 初始化参数
    this.takerId = this.params.takerOrderId
    this.queryAppealOrder(this.takerId)
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container,.fixed-btn {
    background: white;
  }
  .otc-list-con{
    padding-bottom:16vw;
  }
  .layer{
    text-align:center;
    vertical-align: middle;

  }
  .comfirm-container{
    background:#fff;
    width:90%;
    position:absolute;
    top:50%;
    left:4vw;
    right:4vw;
    margin-top:-25vw;
    display:inline-block;

  }
  .comfirm-container .c-top{
    background:#ecf0f7;
    height:12vw;
    line-height:12vw;
    padding:0px 4vw;
    font-size:4.5vw;
    color:#1f405a;
    position:relative;
  }
  .comfirm-container .c-top i{
    font-size:4.5vw;
    color:#1f405a;
    position:absolute;
    right:4vw;
    top:4vw;
  }
  .comfirm-container .c-text{
    padding:8vw 0;
    font-size:4vw;
  }
.bottom-btn02{
    background:#ecf0f7;
    color:#1f405a;
  }
  .bottom-btn02.active{
    background:#64acf5;
    color:#fff;
  }
  textarea.other-input{
    width:70vw;
    height:30vw;
    border:1px solid #eee;
    padding:1vw;
    text-align:left;
  }
  .right a{
    color:#64acf5;
  }
</style>
