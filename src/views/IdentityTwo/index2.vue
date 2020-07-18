<template lang="pug">
  .container
    h5.box.box-item {{ $t('identity.upload_card') }}
    .up-con.box.box-wrap
      .up-index(v-for="(item, key) in uploadArr" :key="key" :style="{backgroundImage: `url(${item || 'static/images/uploading_img01.png'})`}" @click="preview(item)")
        .delete.right-color(@click.stop="deleteImageFn(key)")
          i.iconfont &#xe623;
      .up-index.box.box-item
        i.iconfont &#xe619;
        form(id="uploadForm")
          input(type="file" accept="image/jpeg,image/png" @change="changeFn($event)" id="uploadInput" name="file")
    .bottom-btn.box.box-item(:class="{active: testParams}" @click="nextFn") {{ $t('basic.next_step') }}
</template>
<script>
import components from '@/components'
export default {
  name: 'IdentityTwo',
  components,
  data() {
    return {
      status: 0,
      uploadArr: [],
    }
  },
  computed: {
    testParams() {
      return this.uploadArr.length > 0
    },
  },
  watch: {},
  methods: {
    clearInputFile() {
      let form = document.getElementById('uploadForm')
      form.reset()
    },
    changeFn(e) {
      let file = document.getElementById('uploadInput').files[0]
      if (file.size > 1024 * 1024 * 5) {
        this.$Helper.emitAction('toast', {
          text: this.$t('identity.upload_size_max'),
          type: 'bottom',
        })
        this.clearInputFile()
        return
      }
      let formData = new FormData()
      formData.append('file', file)
      this.$Helper.emitAction('toast', {
        text: this.$t('identity.uploading'),
        type: 'bottom',
      })
      this.$Helper.emitAction('loading', {
        show: true,
        time: 10,
      })
      this.$Helper.ajax({
        url: '/app/upload/imageFtp',
        params: formData,
        isFile: true,
      })
      .then(
        res => {
          this.uploadArr.push(res.fileNames[0])
          setTimeout(() => {
            this.$Helper.emitAction('loading', {
              show: false,
            })
          }, 400)
          this.clearInputFile()
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
      if (!this.testParams) {
        this.$Helper.emitAction('toast', {
          text: this.$t('identity.please_upload'),
        })
        return
      }
      // save
      this.$Helper.ajax({
        url: '/app/user/authuser.api',
        params: {
          ...this.$route.query,
          idCardImgZm: this.uploadArr.join(',') + ',',
        },
      })
      .then(
        ({code, msg}) => {
          if (code === 200) {
            this.$Helper.jumpPage({ name: 'IdentityStatus' }, this)
          } else {
            this.$Helper.emitAction('toast', {
              text: msg || this.$t('basic.web_error'),
            })
          }
        },
      )
    },
    preview(image) {
      this.$Helper.emitAction('imagePreview', image)
    },
    deleteImageFn(key) {
      this.uploadArr.splice(key, 1)
    },
  },
  created() {},
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
    .up-con{
      margin-top: 10vw;
      .up-index{
        height: 20vw;
        width: 20vw;
        border: 1px solid #eee;
        margin-right: 3vw;
        margin-bottom: 3vw;
        background-size: cover;
        background-color: white;
        background-position: center center;
        position: relative;
        input{
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        &>i{
          font-size: 5vw;
          color: #ccc;
        }
        &>.delete{
          position: absolute;
          right: -2vw;
          top: -2vw;
          height: 4.6vw;
          width: 4.6vw;
          i{
            font-size: 4.6vw;
          }
        }
      }
    }
  }
</style>
