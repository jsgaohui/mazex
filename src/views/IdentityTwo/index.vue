<template lang="pug">
  .container
    h5.box.box-item {{ $t('identity.upload_card') }}
    h4.box.box-item  ( {{ $t('identity.upload_size_max') }} )
    .upload-con.box.box-item(style="backgroundImage: url('static/images/uploading_bg.png')")
      .upload-index(:style="{backgroundImage: `url(${uploadImage['uploadImage01'] || 'static/images/uploading_img01.png'})`}")
      .upload-cicle
        .icon-con.box.box-item
          i.iconfont &#xe687;
        .text-con.box.box-item {{ $t('identity.upload') }}
      form(id="uploadFormOne")
          input(type="file" accept="image/jpeg,image/png" @change="uploadImageOneFn($event)" id="uploadInput1" name="file")
    .upload-again(@click="uploadNext=true" v-if="!uploadNext && uploadImage.uploadImage01")
      i.iconfont &#xe62e;
    .upload-con.box.box-item(v-if="uploadNext && uploadImage.uploadImage01" style="backgroundImage: url('static/images/uploading_bg.png')")
      .upload-index(:style="{backgroundImage: `url(${uploadImage['uploadImage02'] || 'static/images/uploading_img02.png'})`}")
      .upload-cicle
        .icon-con.box.box-item
          i.iconfont &#xe687;
        .text-con.box.box-item {{ $t('identity.upload') }}
      form(id="uploadFormTwo")
          input(type="file" accept="image/jpeg,image/png" @change="uploadImageTwoFn($event)" id="uploadInput2" name="file")
    .bottom-btn.box.box-item(:class="{active: !!uploadImage.uploadImage01}" @click="nextFn") {{ $t('basic.next_step') }}
</template>
<script>
import components from '@/components'
import PreLoad from '@/lib/preload'
import ImageCompressor from 'image-compressor.js'
export default {
  name: 'Identity',
  components,
  data() {
    return {
      uploadImage: {
        uploadImage01: null,
        uploadImage02: null,
      },
      uploadNext: false,
    }
  },
  computed: {},
  watch: {},
  methods: {
    uploadImageOneFn() {
      let file = document.getElementById('uploadInput1').files[0]
      this.changeFn(file, 'uploadImage01')
    },
    uploadImageTwoFn() {
      let file = document.getElementById('uploadInput2').files[0]
      this.changeFn(file, 'uploadImage02')
    },
    clearInputFile() {
      let form1 = document.getElementById('uploadFormOne')
      let form2 = document.getElementById('uploadFormTwo')
      if (form1) form1.reset()
      if (form2) form2.reset()
    },
    changeFn(file, name) {
      if (file.size > 1024 * 1024 * 5) {
        this.$Helper.emitAction('toast', {
          text: this.$t('identity.upload_size_max'),
          type: 'bottom',
        })
        this.clearInputFile()
        return
      }
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
          new PreLoad([res.fileNames[0]]).init().then(
            () => {
              this.uploadImage[name] = res.fileNames[0]
              setTimeout(() => {
                this.$Helper.emitAction('loading', {
                  show: false,
                })
              }, 400)
              this.clearInputFile()
            },
            () => {
              this.uploadImage[name] = res.fileNames[0]
              // this.$Helper.emitAction('toast', {
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
    nextFn() {
      if (!this.uploadImage.uploadImage01) {
        this.$Helper.emitAction('toast', {
          text: this.$t('identity.please_upload'),
        })
        return
      }
      this.$Helper.emitAction('loading', {
        show: true,
        time: 10,
      })
      // save
      this.$Helper.ajax({
        url: '/app/user/authuser.api',
        params: {
          ...this.$route.query,
          idCardImgZm: this.uploadImage.uploadImage01 + (this.uploadImage.uploadImage02 ? `,${this.uploadImage.uploadImage02},` : ','),
        },
      })
      .then(
        ({code, msg}) => {
          if (code === 200) {
            this.$store.dispatch('basic/setLoginData', {firstName: this.query.firstName, realName: this.query.realName, idCard: this.query.idCard})
            this.$Helper.jumpPage({ name: 'IdentityStatus' }, this)
          } else {
            this.$Helper.emitAction('toast', {
              text: msg || this.$t('basic.web_error'),
            })
          }
        },
      )
    },
  },
  created() {
    this.query = this.$Helper.getUrlParams()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    padding: 3vw 4vw;
    h5{
      font-size: 4.5vw;
      padding: 2vw 0;
      color: @fontColor;
    }
    h4{
      font-size: 3.2vw;
      color: #888;
      font-weight: 400;
    }
    .upload-again{
      text-align: center;
      padding-top: 10vw;
      i{
        font-size: 8vw;
        color: @icon-color;
      }
      div{
        // margin-top: 1vw;
        font-size: 3.6vw;
        color: #666;
        text-align: center;
      }
    }
    .upload-con{
      margin: 0 auto;
      width: 60vw;
      height: 40vw;
      background-size: 100% 100%;
      padding: 3vw;
      position: relative;
      margin-top: 5vw;
      margin-bottom: 7vw;
      input{
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }
      .upload-index{
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        border-radius: 1vw;
        overflow: hidden;
        background-color: white;
      }
      .upload-cicle{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 18vw;
        width: 18vw;
        border-radius: 100%;
        background: @icon-color;
        color: white;
        text-align: center;
        opacity: 0.9;
        .icon-con {
          width: 100%;
          margin-top: 3.5vw;
          margin-bottom: 1vw;
          i {
            font-size: 6vw;
            color: white;
          }
        }
        .text-con{
          font-size: 3.5vw;
        }
      }
    }
  }
</style>
