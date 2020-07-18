<template lang="html">
  <img :src="imageSrc" :alt="alt" :style="styleSheet">
</template>
<script>
export default {
  components: {},
  data() {
    return {
      imageSrc: this.errorImageSrc,
    }
  },
  props: {
    src: {
      type: String,
    },
    alt: {
      type: String,
      default: `image_${parseInt(Math.random() * 10000)}`,
    },
    styleSheet: {
      type: Object,
    },
    errorImageSrc: {
      type: String,
      default: `static/icon/boy.png`,
    },
  },
  computed: {},
  watch: {
    src() {
      this.judgeImage()
    },
  },
  methods: {
    judgeImage() {
      let image = new Image()
      image.src = this.src
      image.onload = () => {
        this.imageSrc = this.src
      }
      image.onerror = () => {
        this.imageSrc = this.errorImageSrc
      }
    },
  },
  created() {
    this.judgeImage()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../theme/index.less');

</style>
