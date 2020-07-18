<template lang="pug">
  .container.box.box-row
    .top-con.overflow-y.mescroll.box-row-flex(id="invite_scroll_con")
      .top.bac-image(:style="{backgroundImage: `url('static/images/invite.jpeg')`}")
        P {{ $t('invite.invite_toast') }}
        <!--h2 {{ $t('invite.reback') }}-->
      ul
        li.box-y-center.box
          .left {{$t('invite.invite_code')}}
          .right.box-col-flex.box-x-right.box.box-y-center.invite
            span {{ visitCode }}
        .line
        li.box-y-center.box
          .left {{ $t('invite.invite_num') }}
          .right.box-col-flex.box-x-right.box.box-y-center {{ $t('invite.total_num') }}
            span {{ result.total }}
        .line
        li.box-y-center.box
          .left {{ $t('invite.get_reback') }}
          .right.box-col-flex.box-x-right.box.box-y-center GOLDT
            span 0.00
      ul
        li.box-y-center.box
          .left {{ $t('invite.invite_record') }}
          .right.box-col-flex.box-x-right.box.show-more.box-y-center(v-if="result.total > 5" @click="jumpPage('InviteRecord')")
            i.iconfont &#xe648;
            span(style="font-size: 3.4vw;color: #777;margin-left:1vw;font-weight:400;") {{ $t('invite.more_record') }}
      .line
      .table-con.overflow-x.mescroll
        // Itable(:list="result.records" :showList="showList" :baseFontSize="4" :baseRowHeight="12" :tableWidth="result.records && result.records.length > 0 ? 150 : 0" :paddingRight="result.records && result.records.length > 0 ? 3 : 0")
        InviteOne(:list="result.records" :splitHeight="5")
        error-status(status="empty" v-if="!result.records || result.records.length === 0" style="background: #fff")
      .ercode-con
        .img-con.box.box-item(v-longTap="{methods: saveImageFn}")
          .img.box.box-item#invite_qrcode
        p.box.box-item {{ $t('invite.send_qrcode') }}
        span.box.box-item(v-if="$Helper.isApp()") ({{ $t('invite.long_tap_save') }})
    .bottom-con
      .comfirm.box.box-y-center
        .text.box.box-col-flex.box-y-center
          .invite-url.box-col-flex.overtext {{ visitUrl }}
        .copy.box.box-item(@click="copyFn")
          i.iconfont &#xe643;
          span {{ $t('invite.copy') }}
      .login-btn.box.box-item(@click="showInvite") {{ $t('invite.invite_right_now') }}
</template>
<script>
  import InviteOne from '../InviteRecord/InviteOne'
  import components from '@/components'
  import {mapState} from 'vuex'

  export default {
    name: 'Invite',
    components: {
      ...components,
      InviteOne,
    },
    data() {
      return {
        tableList: [],
        qrCodeImage: 'static/images/qrcode.png',
        result: {
          total: 0,
          records: [],
        },
        visitUrl: null,
      }
    },
    computed: {
      ...mapState('basic', ['visitCode']),
      showList() {
        return {
          createTime: {
            align: 'left',
            text: this.$t('basic.time'),
            color: '#717dd9',
            // width: 30,
          },
          mobile: {
            text: this.$t('basic.mobile'),
            color: '#717dd9',
            align: 'right',
            // width: 30,
          },
          email: {
            text: this.$t('basic.email'),
            color: '#717dd9',
            align: 'right',
            // width: 30,
            caculate: item => {
              return item || '-'
            },
          },
          locationCountry: {
            text: this.$t('invite.country'),
            color: '#717dd9',
            align: 'right',
            // width: 30,
          },
          isValid: {
            align: 'right',
            text: this.$t('basic.status'),
            color: '#717dd9',
            caculate: item => {
              return this.$t(`invite.validate${item}`) || '-'
            },
            // width: 30,
          },
        }
      },
    },
    watch: {},
    methods: {
      jumpPage(name) {
        this.$Helper.jumpPage(name, this)
      },
      showInvite() {
        this.$nextTick(() => {
          let document = window.document.getElementById('invite_scroll_con')
          document.scrollTop = document.scrollHeight
        })
        // this.$store.dispatch(
        //   'layermodel/push',
        //   {
        //     name: 'Share',
        //     type: 'up',
        //     params: {},
        //   },
        // )
      },
      copyFn() {
        this.$Helper.copyToClipboard(this.visitUrl)
        this.$Helper.emitAction('toast', {
          type: 'bottom',
          text: this.$t('myfund.copy_success'),
        })
      },
      initFn() {
        this.$Helper.ajax({
          url: '/app/user/getOwnMember.api',
          params: {
            page: 1,
            limit: 5,
            userName: '',
          },
        })
          .then(
            ({data}) => {
              let {result} = data || {}
              this.result = result || {}
            },
          )
      },
      getQrImage(userAddress) {
        let qrcode = new window.QRCode(document.getElementById('invite_qrcode'), {
          width: 120,
          height: 120,
        })
        qrcode.makeCode(userAddress)
      },
      saveImageFn() {
        this.$Helper.emitAction('toast', {
          text: this.$t('basic.save_success'),
        })
        if (window.api) {
          window.api.saveQRCode(this.visitCode)
        } else {
          window.webkit.messageHandlers.iosMethod.postMessage({
            method: 'saveQrCode',
            params: {userAddress: this.visitCode, language: this.language},
          })
        }
      },
    },
    created() {
      this.initFn()
    },
    mounted() {
      // var locale = window.location.href.substr(0, window.location.href.indexOf('#'))
      // if (this.$Helper.isApp()) {
      //   locale = Cookie.get('locale') || this.$Helper.getNavigatorLanguage()
      //   if (locale === 'zh') {
      //     locale = 'https://www.udax.hk/'
      //   } else if (locale === 'ko') {
      //     locale = 'https://www.udax.kr/'
      //   } else {
      //     locale = 'https://www.udax.pro/'
      //   }
      // }
      let location = 'https://' + document.domain + '/#/register?visitCode=' + this.visitCode
      this.visitUrl = location
      this.getQrImage(location)
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');

  .container {
    .line {
      height: 1px;
      width: 100%;
      background: #eee;
    }
    .top {
      height: 40vw;
      padding-top: 10vw;
      padding-left: 4vw;
      p {
        font-size: 4.8vw;
        font-weight: 500;
      }
      h2 {
        margin-top: 3vw;
        padding-left: 2vw;
        font-size: 7.4vw;
      }
    }
    ul {
      margin-top: 2vw;
      li {
        height: 14vw;
        background: #fff;
        padding: 0 3vw;
        font-size: 4.2vw;
        .left {
          color: @icon-color;
        }
        .right {
          &.invite {
            span {
              color: #717dd9;
              font-size: 5vw;
              font-weight: 500;
              margin-left: 2vw;
            }
          }
          span {
            color: #717dd9;
            font-size: 7vw;
            font-weight: 500;
            margin-left: 2vw;
          }
        }
        .show-more {
          i {
            color: #666;
            font-size: 4.2vw;
            margin-left: 1vw;
          }
          font-size: 3.6vw;
          color: #666;
        }
      }
    }
    .table-con {
      // padding: 3vw;
      // margin-right: 3vw;
      // background: #fff;
    }
    .ercode-con {
      background: #fff;
      margin-top: 2vw;
      padding: 10vw;
      .img-con {
        user-select: none;
        -webkit-user-select: none;
      }
      .img {
        width: 40vw;
        height: 40vw;
      }
      p {
        margin-top: 4vw;
        font-size: 4.5vw;
        color: @active-deep;
        text-align: center;
      }
      span {
        margin-top: 1vw;
        color: #999;
        font-size: 3.7vw
      }
    }
    .bottom-con {
      background: #fff;
      padding: 2vw 4vw;
      padding-top: 0;
      box-shadow: 1px 0px 10px #eee;
      z-index: 1;
      .comfirm {
        margin: 4vw 0;
        .text {
          .invite-text {
            font-size: 4vw;
            color: #666;
          }
          .invite-url {
            color: @icon-color;
            font-weight: 500;
            margin-left: 2vw;
            font-size: 4.5vw;
            padding-right: 1vw;
          }
        }
        .copy {
          background: #d7dcff;
          padding: 1.5vw 3vw;
          color: #646da9;
          font-size: 4vw;
          i {
            color: #646da9;
            margin-left: 1vw;
          }
        }
      }
      .login-btn {
        height: 11vw;
        width: 92vw;
        margin: 0 auto;
        background: @icon-color;
        color: white;
        font-size: 4.2vw;
        font-weight: 600;
        border-radius: 1px;
      }
    }
  }
</style>
