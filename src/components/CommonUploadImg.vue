<template lang="html">
  <!-- // .container
  //-   .upload-con.box.box-item(style="backgroundImage: url('static/images/uploading_bg.png')")
  //-     .upload-index(:style="{backgroundImage: `url(${uploadImage['uploadImage'] || 'static/images/uploading_img01.png'})`}")
  //-     .upload-cicle
  //-       .icon-con.box.box-item
  //-         i.iconfont &#xe687;
  //-       .text-con.box.box-item {{ $t('identity.upload') }}
  //-     form(id="uploadForm")
  //-         input(type="file" accept="image/jpeg,image/png" @change="uploadImageEvent($event)" :id="uploadInputId" name="file") -->

    <div class="upload-con box box-item" style="">
      <div class="upload-index" :style="{backgroundImage: `url(${uploadImage['uploadImage'] || 'static/images/delet-img.png'})`}">
      </div>
      <div class="upload-cicle">
        <div class="icon-con box box-item">
          <i class="iconfont"></i>
        </div>
        <div class="text-con box box-item">{{ $t('identity.upload') }}</div>
      </div>
      <!--删除图片-->
      <div class="upload-cicle" style="display:none">
        <div class="icon-con box box-item">
          <i class="iconfont">&#xe654;</i>
        </div>
        <div class="text-con box box-item">删除</div>
      </div>
      <form  id="uploadForm">
        <input  type="file" accept="image/jpeg,image/png" @change="uploadImageEvent(uploadInputId,$event)" :id="uploadInputId" name="file"/>
      </form>
    </div>
</template>
<script>
  import components from '@/components'
  import PreLoad from '@/lib/preload'
  import ImageCompressor from 'image-compressor.js'
  export default {
    name: 'CommonUploadImg',
    components,
    data() {
      return {
        uploadImage: {
          uploadImage: '',
        },
        paramForm: {
          imgUrl: '', // 图片链接
          uploadId: '', // 上传的组件Id
        },
      }
    },
    computed: {},
    watch: {},
    props: {
      uploadInputId: '',
    },
    methods: {
      uploadImageEvent() {
        let $thisEvent = this
        let file = document.getElementById(this.uploadInputId).files[0]
        this.changeFn(file, 'uploadImage', $thisEvent)
      },
      changeFn(file, name, $thisEvent) {
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
              this.upload(newFile, name, $thisEvent)
            },
            fail: () => {
              // upload without compress
              this.upload(file, name, $thisEvent)
            },
          },
        )
        compressImage.hasOwnProperty()
      },
      upload(file, name, $thisEvent) {
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
                  $thisEvent.paramForm.imgUrl = res.fileNames[0]
                  $thisEvent.paramForm.uploadId = $thisEvent.uploadInputId
                  $thisEvent.$emit('change', $thisEvent.paramForm)
                  setTimeout(() => {
                    this.$Helper.emitAction('loading', {
                      show: false,
                    })
                  }, 600)
                  this.clearInputFile()
                },
                () => {
                  this.uploadImage[name] = res.fileNames[0]
                  $thisEvent.paramForm.imgUrl = res.fileNames[0]
                  $thisEvent.paramForm.uploadId = $thisEvent.uploadInputId
                  $thisEvent.$emit('change', $thisEvent.paramForm)
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
      clearInputFile() {
        let form1 = document.getElementById('uploadForm')
        if (form1) form1.reset()
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');
  .container{
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
      width:100%;
      height: 30vw;
      background:#64acf5;
      background-size: 100% 100%;
      border-radius: 1vw;
      padding: 2vw;
      position: relative;
      margin-bottom: 3vw;
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
        height: 12vw;
        width: 12vw;
        border-radius: 100%;
        background: white;
        color: @icon-color;
        text-align: center;
        opacity: 0.9;
        .icon-con {
          width: 100%;
          margin-top:1vw;
          margin-bottom: 0vw;
          i {
            font-size: 5vw;
            color: @icon-color;
          }
        }
        .text-con{
          font-size: 3vw;
        }
      }
    }
  }
</style>
