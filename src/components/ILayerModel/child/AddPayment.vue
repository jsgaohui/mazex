<template lang="html">
  <div class="layout overflow-y"  style="width:100%">
    <!--付款-->
    <div class="container box box-row router-view" img-set="static/favicon.ico">
      <div class="head box">
        <div class="left box box-item"><i class="iconfont" @click="closeDialog" ></i></div>
        <div class="name box box-item box-col-flex">
          <span>{{!ifModify?$t('payment.addPayMethod'):$t('payment.modifyPayMethod')}}</span>
        </div>

      </div>
      <div class="half-x-line"></div>
      <div class="otc-auth-con overflow-y">
        <div class="issue-form">
          <div class="input-block" style="position:relative">
            <div class="rel" style="width:100%"  v-if="ifModify" >
              <input type="text" class="input-t"  v-model="currentType.paymentTypeName"  :disabled="true">
            </div>
            <div class="rel" style="width:100%"  v-else @click="choosePayType()">
              <input type="text" class="input-t"  v-model="currentType.paymentTypeName"  :disabled="true">
              <span><i class="iconfont" style="color:#fff;font-size:5vw;" ></i></span>
            </div>
          </div>
          <!-- 银行卡 -->
          <div class="input-block">
            <div class="rel" style="width:100%">
              <input type="text" class="input-t" v-model="formParam.name" :disabled="!canModifyName"   :placeholder="$t('identity.name_toast')" maxLength="20">
            </div>
          </div>
          <template v-if="currentType.paymentTypeId === 1">
            <div v-show="!isIdr" class="input-block">
              <div class="rel" style="width:100%">
                <input type="text" class="input-t" v-model="formParam.bankName" :placeholder="$t('payment.bankName')" maxLength="20" autocomplete="off" />
              </div>
            </div>
            <div class="input-block">
            <div v-show="isIdr" class="rel" style="width:100%" @click="chooseInBank()">
              <input type="text" class="input-t"  :placeholder="$t('payment.bankName')" v-model="formParam.bankName"  :disabled="true">
              <span><i class="iconfont" style="color:#fff;font-size:5vw;" ></i></span>
            </div>
            </div>
            <div class="input-block">
              <div class="rel" style="width:100%">
                <input type="text" class="input-t" v-model="formParam.subBank" :placeholder="$t('payment.accountBranch')" maxLength="20" autocomplete="off" />
              </div>
            </div>
          </template>
          <!-- 出了银行卡都有账户信息 -->
          <template v-if="(currentType.paymentTypeId >= 1 &&  currentType.paymentTypeId <= 4) || (currentType.paymentTypeId >= 7 &&  currentType.paymentTypeId <= 12)  ">
            <div class="input-block">
              <div class="rel" style="width:100%">
                <input type="text" class="input-t"   v-model="formParam.account" :placeholder="i18[currentType.paymentTypeId].accountType" maxLength="64" autocomplete="off" />
              </div>
            </div>
          </template>
          <!-- 微信 -->  <!-- 支付宝 -->   <!-- paytm -->  <!-- upi -->
          <template v-if="currentType.paymentTypeId === 2 || currentType.paymentTypeId === 3 ||  currentType.paymentTypeId === 8  || currentType.paymentTypeId === 12">
            <!--上传图片-->

            <form id="form">
              <div class="auth-pic-block"  id="upLoad"  style="position:relative;width:100%;height:35vw;margin-bottom:2.5vw;">
                <!-- 新增页面才显示 -->
                <input type="file" accept="image/jpeg,image/png" @change="uploadImage($event)" style="position:absolute;opacity:0;width:100%;height:100%" id="qrCode"  multiple="multiple" />
                <div class="box-center" style="padding:0px 4vw;">
                  <template v-if="!this.formParam.qrCode">
                    <i class="iconfont">&#xe686;</i>
                  </template>
                  <template v-else>
                    <img :src="this.formParam.qrCode"  style="height:20vw;" />
                  </template>
                  {{this.i18[currentType.paymentTypeId].qrcodeRemark}}
                </div>
              </div>
            </form>
            <!--上传图片END-->
          </template>
          <!-- 西联 -->
          <template v-if="currentType.paymentTypeId === 5 || currentType.paymentTypeId === 6">
            <div class="input-block">
              <div class="rel" style="width:100%">
                <input type="text" class="input-t"  v-model="formParam.swiftInfo" :placeholder="currentType.paymentTypeId === 5 ? $t('payment.westernUnionAccount'):$t('payment.swiftAccount')">
              </div>
            </div>
          </template>
          <!-- IMPS -->
          <template v-if="currentType.paymentTypeId === 11">
            <div class="input-block">
              <div class="rel" style="width:100%">
                <input type="text" class="input-t"  v-model="formParam.ifscCode"  maxLength="32" :placeholder="$t('payment.ifscCode')" >
              </div>
            </div>
            <div class="input-block">
              <div class="rel" style="width:100%">
                <input type="text" class="input-t"  v-model="formParam.bankName"  maxLength="20" :placeholder="$t('payment.bankHead')" >
              </div>
            </div>
          </template>
          <div class="input-block" v-if="!ifModify || choosedType.status===1">
            <div class="rel" style="width:100%">
              <input type="password" class="input-t"  v-model="formParam.tradePwd" maxLength="6" :disabled='isExitTradePwd === 0 ? true:false' :placeholder="$t('otc.transactionPassword')">
            </div>
          </div>
          <div class="box box-x-right" style="font-size:4vw;color:#d0d9de;" @click="toPassword()">{{ isExitTradePwd === 0?$t('fund.no_pay_password'):$t('login.forget_password')}}</div>
          <div class="otc-btn box box-space-bettwen" v-if="ifModify" style="margin-top:10px">
            <!-- 1激活  0非激活  激活状态可以取消激活  取消激活状态可以删除和激活-->
            <div class="btn-cancel" v-if="choosedType.status===1" @click="addOrModifyPayment(1)">{{$t('otc.disable')}}</div>
            <div class="btn-cancel" v-if="choosedType.status===1" @click="addOrModifyPayment(3)" style="margin-left:2vw;">{{$t('payment.modifyPayMethod')}}</div>
            <div class="btn-cancel" v-if="choosedType.status===0" @click="addOrModifyPayment(0)">{{$t('otc.enable')}}</div>
            <div class="btn-cancel" v-if="choosedType.status===0"  @click="addOrModifyPayment(2)" style="margin-left:2vw;">{{$t('withdAddress.delete')}}</div>
          </div>
          <p class="pay-info">{{$t('payment.payMethodRemark')}}</p>
        </div>
      </div>
      <div class="otc-btn">
      <div class="bottom-btn02 active" v-if="!ifModify" @click="addOrModifyPayment(3)">{{$t('payment.addPayMethod')}}</div>
      </div>
    </div>
    <error-status :status="errorStatus" />
  </div>
</template>
<script>
import ErrorStatus from '@/components/ErrorStatus'
import PreLoad from '@/lib/preload'
import ImageCompressor from 'image-compressor.js'
import {mapState} from 'vuex'
// import _ from 'lodash'
export default {
  components: {
    ErrorStatus,
  },
  data() {
    return {
      formParam: {
        paymentTypeId: null,
        paymentTypeName: null, // 收款方式名称
        cssName: null, // 图标样式名
        name: null, // 真实姓名
        accountType: null, // 账号类型 比如微信账号、支付宝账号等
        account: null, // 收款账号
        bankName: null, // 开户银行
        subBank: null, // 开户支行
        qrCode: null, // 二维码图片
        tradePwd: null, // 交易密码
        swiftInfo: null, // SWIFT信息
        ifscCode: null, // IFSC码
        id: null,
        bankCode: null, // 印尼银行需要的银行代码
      },
      submitFlag: false,
      updateParam: {
        // 参数 id(支付方式Id), userId, status(没有传代表删除,对应枚举FbPymentStatus)
        status: null, // 狀態
        paymentTypeId: null, // 支付方式的類型
        id: null, // 記錄的id
      },
      payType: [], // 所有支付方式
      currentType: {paymentTypeId: null, paymentTypeName: ''}, // 添加/选择的支付方式
      choosedType: null, // 修改/选择的支付方式
      i18: [
        {accountType: '', qrcodeRemark: ''},
        {accountType: this.$t('payment.cardAccount'), qrcodeRemark: ''}, // 银行
        {accountType: this.$t('payment.wechatAccount'), qrcodeRemark: this.$t('payment.wechatUpload')}, // 微信
        {accountType: this.$t('payment.alipayAccount'), qrcodeRemark: this.$t('payment.alipayUpload')}, // 支付宝
        {accountType: this.$t('payment.payPalAccount'), qrcodeRemark: ''}, // paypal
        {accountType: this.$t('payment.westernUnionAccount'), qrcodeRemark: ''}, // 西联
        {accountType: this.$t('payment.swiftAccount'), qrcodeRemark: ''}, // SWIFT
        {accountType: this.$t('payment.payNowAccount'), qrcodeRemark: ''}, // payNow
        {accountType: this.$t('payment.PaytmAccount'), qrcodeRemark: this.$t('payment.paytmUpload')}, // Paytm
        {accountType: this.$t('payment.qiwiAccount'), qrcodeRemark: ''}, // QIWI
        {accountType: this.$t('payment.interacAccount'), qrcodeRemark: ''}, // Interac e-Transfer
        {accountType: this.$t('payment.bankAccount'), qrcodeRemark: ''}, // IMPS
        {accountType: this.$t('payment.UPIAccount'), qrcodeRemark: this.$t('payment.UPIUpload')}, // UPI
      ],
      validatorRules: [
        {}, // 除了5,6都有account
        {'name': this.$t('identity.name_toast'), 'bankName': this.$t('payment.bankNameIsNull'), 'account': this.$t('payment.accountIsNull')}, // 银行
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull'), 'qrCode': this.$t('payment.wechatUpload')}, // 微信
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull')}, // 支付宝
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull')}, // paypal
        {'name': this.$t('identity.name_toast'), 'swiftInfo': this.$t('payment.swiftIsNull')}, // 西联
        {'name': this.$t('identity.name_toast'), 'swiftInfo': this.$t('payment.swiftIsNull')}, // SWIFT
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull')}, // payNow
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull')}, // Paytm
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull')},  // QIWI
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull')}, // Interac e-Transfer
        {'name': this.$t('identity.name_toast'), 'bankName': this.$t('payment.bankAccountIsNull'), 'ifscCode': this.$t('payment.ifscCodeIsNull')},  // IMPS
        {'name': this.$t('identity.name_toast'), 'account': this.$t('payment.accountIsNull')}, // UPI
      ],
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('basic', ['uid', 'isValid', 'isMerchant', 'isExitTradePwd']),
    canModifyName() {
      // 如果是商户
      return this.isMerchant
    },
    ifModify() {
      return this.choosedType
    },
    errorStatus() {
      if (this.isValid !== 2) {
        this.$Helper.toast(this.$t('payment.doVerification'))
        this.closeDialog()
      }
      let item = this.item
      if (!this.uid) {
        return 'loginout'
      } else if (!item) {
        return 'error'
      }
    },
  },
  methods: {
    url(status) {
      return status === 3 ? '/app/otc/addPaymentMethod.api' : '/app/otc/updatePaymentMethod.api'
    },
    postParam(status) {
      return status === 3 ? this.formParam : this.updateParam
    },
    toPassword() {
      // 跳转重构之密码页面
      this.$Helper.jumpPage({ name: 'ResetTradePwd' }, this)
      // }
    },
    // 上傳圖片
    uploadImage() {
      let file = document.getElementById('qrCode').files[0]
      this.changeFn(file, 'qrCode')
    },
    // 清空圖片
    clearInputFile() {
      let form1 = document.getElementById('form')
      if (form1) form1.reset()
    },
    changeFn(file, name) {
      // 大小不能大于10M
      if (file.size > 1024 * 1024 * 10) {
        this.$Helper.emitAction('toast', {
          text: this.$t('identity.upload_size_max'),
          type: 'bottom',
        })
        this.clearInputFile()
        return
      }
      // 压缩图片
      const compressImage = new ImageCompressor(
        file,
        {
          maxWidth: 1000,
          success: (newFile) => {
            this.upload(newFile, name)
          },
          fail: () => {
            // upload without compress
            this.upload(file, name)
          },
        },
      )
      compressImage.hasOwnProperty()
    },
    upload(file, name) {
      let $this = this
      let formData = new FormData()
      formData.append('file', file)
      this.$Helper.emitAction('loading', {
        show: true,
        time: 20,
      })
      this.$Helper.ajax({
        url: '/app/upload/imageFtp',
        params: formData,
        isFile: true,
      })
        .then(
          res => {
            // 上傳成功回写文件名
            new PreLoad([res.fileNames[0]]).init().then(
              () => {
                $this.formParam.qrCode = res.fileNames[0]
                $this.clearInputFile()
              },
              () => {
                $this.formParam.qrCode = res.fileNames[0]
                // $this.$Helper.emitAction('toast', {
                //   text: 'image preload error!',
                // })
              },
            )
          },
          () => {
            this.clearInputFile()
            this.$Helper.emitAction('toast', {
              text: this.$t('identity.upload_error'),
            })
          },
        )
    },
    closeDialog() {
      this.$Helper.emitAction('closeModel')
      let fn = this.params.callback
      if (fn && this.$Helper.isType(fn, () => {})) fn()
    },
    // 选择交易方式
    choosePayType() {
      let $this = this
      this.$store.dispatch(
        'layermodel/push',
        { name: 'RightSelect',
          type: 'right',
          params: {
            callback: item => {
              $this.currentType = item
            },
            list: this.payType.map(item => ({...item,
              name: item.paymentTypeName,
            })),
          },
        },
      )
    },
    // 选择印尼银行
    chooseInBank() {
      let $this = this
      this.$store.dispatch(
        'layermodel/push',
        { name: 'RightSelect',
          type: 'right',
          params: {
            callback: item => {
              $this.formParam.bankName = item.bankName
              $this.formParam.bankCode = item.bankCode
            },
            list: this.inBankList.map(item => ({...item,
              name: item.bankName,
            })),
          },
        },
      )
    },
    validateAdd() {
      let validateOb = this.validatorRules[this.currentType.paymentTypeId]
      for (var field in validateOb) {
        if (!this.formParam[field] || this.formParam[field] === '') {
          this.$Helper.toast(validateOb[field])
          return false
        }
      }
      if (!this.formParam.tradePwd || this.formParam.tradePwd.length !== 6) {
        this.$Helper.toast(this.$t('forgetPwd.tradePwd_test_error'))
        return false
      }
      return true
    },
    // 添加默認支付方式
    addOrModifyPayment(status) {
      if (this.submitFlag) {
        return
      }
      this.submitFlag = true
      let $this = this
      // 更行以及刪除
      if (status < 3) {
        this.$Helper.copyProperties(this.choosedType, this.updateParam)
        this.updateParam.status = status === 2 ? null : status // 删除不用传status状态
      } else {
        // 複製id和名字
        if (!this.validateAdd()) {
          this.submitFlag = false
          return
        }
        this.formParam.paymentTypeId = this.currentType.paymentTypeId
        this.formParam.paymentTypeName = this.currentType.paymentTypeName
      }
      this.$Helper
        .ajax({
          url: this.url(status),
          method: 'POST',
          params: this.postParam(status),
        })
        .then(({code, data, msg}) => {
          $this.submitFlag = false
          // 提示信息  关闭窗口  刷新页面
          if ($this.$Helper.dealHttpCode(code, msg)) {
            let msg = $this.formParam.id ? $this.$t('payment.editSuccess') : $this.$t('withdAddress.add_success')
            $this.$Helper.toast(msg, 'top')
            $this.closeDialog()
          }
        })
    },
  },
  created() {
    // 初始化参数
    this.payType = this.params.payType // 所有支持的支付类型
    // 如果是修改支付方式
    if (this.params.chooseType) {  // 待修改的支付类型
      // 复制属性到表单
      this.choosedType = this.params.chooseType
      this.$Helper.copyProperties(this.params.chooseType, this.formParam)
      this.$Helper.copyProperties(this.params.chooseType, this.currentType)
    } else {
      this.currentType = this.payType[0] // 默认用第一个支付方式
    }
    this.formParam.name = this.choosedType ? this.choosedType.name : this.params.name
    this.isIdr = false
    if (this.params.inBankList) { // 若有值表示为域名印尼的,开户银行需下拉展示
      this.inBankList = this.params.inBankList
      this.isIdr = true
    }
  },
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
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
  .tip-con .box-space-bettwen {
    padding: 4vw 5vw;
    font-size: 4vw;
    color: #8398a6
  }
  .otc-btn{
    position:fixed;
    bottom:4vw;
    left:0;
    right:0;
    background: #fff;
    padding:0vw 4vw;
  }
  .otc-btn div{
    width:100%;
  }
</style>
