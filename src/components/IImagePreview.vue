<template lang="html">
  <transition name="fade">
    <div class="layer container box box-item" @click="close" :style="{ backgroundImage: `url('${image}')` }" v-if="image"></div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      image: null,
    }
  },
  computed: {},
  methods: {
    close() {
      this.image = null
    },
  },
  created() {
    this.$Helper.onAction('imagePreview', image => {
      this.image = image
    })
  },
}
</script>

<style lang="less" scoped>
.container {
  background-color:black;
  background-repeat:no-repeat;
  background-position:center center;
  background-size: 100% auto;   
  transition: all .2s linear;
}
</style>
