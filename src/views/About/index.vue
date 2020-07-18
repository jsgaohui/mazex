<template lang="html">
  <div class="container">
    <IMenuList :list="settingConfig" @click="Run($event.handle)"/>
  </div>
</template>
<script>
  import components from '@/components'
  export default {
    name: 'About',
    components,
    computed: {
      settingConfig() {
        return [
          [
            {
              handle: 'Masex',
              text: this.$t('About MASEx'),
              rightText: '',
            },
            {
              handle: 'Upcoming',
              text: this.$t('Upcoming Events'),
              hidden: '',
            },
            {
              handle: 'Past',
              text: this.$t('Past Events'),
              hidden: '',
            },
            {
              handle: 'Video',
              text: this.$t('MASEx Videos'),
              hidden: '',
            },
          ],
        ]
      },
    },
    watch: {},
    methods: {
      Run(name) {
        if (this.$Helper.isType(name, () => {})) {
          name.call(this)
          return
        }
        this.$Helper.jumpPage(name, this)
      },
    },
  }
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
  }
</style>
