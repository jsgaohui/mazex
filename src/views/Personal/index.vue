<template lang="pug">
  .container
    .head.box.box-y-center
      .left.box.box-y-center {{ $t('account.authentication') }}
      .right.box.box-x-right.box-y-center.box-col-flex(v-if="status !== 0")
        i.iconfont(:class="{'right-color': status===1, 'error-color': status===0}") {{ status === 1 ? '&#xe685;' : '&#xe65c;' }}
        span {{ $t(`invite.validate${status}`) || '-' }}
      .right.box.box-x-right.box-y-center.box-col-flex(v-else)
        span.error-color(@click="jumpPage('IdentityOne')") {{ $t('identity.get_authentication') }}
        i.iconfont.error-color &#xe612;
    .half-x-line
    ul
      li.box.box-y-center
        .left.box.box-y-center {{ $t('identity.firstname') }}
        .right.box.box-x-right.box-y-center.box-col-flex {{ decodeURI(firstName?firstName:'') || '' }}
      li.box.box-y-center
        .left.box.box-y-center {{ $t('identity.name') }}
        .right.box.box-x-right.box-y-center.box-col-flex {{ decodeURI(realName?realName:'') || '' }}
      li.box.box-y-center
        .left.box.box-y-center {{ $t('basic.account') }}
        .right.box.box-x-right.box-y-center.box-col-flex {{ $Helper.secretStr({str: mobile || email, length: mobile ? 4 : 7 }) }}
      li.box.box-y-center
        .left.box.box-y-center UID
        .right.box.box-x-right.box-y-center.box-col-flex {{ uid }}
      li.box.box-y-center
        .left.box.box-y-center {{ $t('identity.country') }}
        .right.box.box-x-right.box-y-center.box-col-flex {{ countryName || '' }}
      li.box.box-y-center
        .left.box.box-y-center {{ $t('identity.card_number') }}
        .right.box.box-x-right.box-y-center.box-col-flex {{ $Helper.secretStr({str: idCard, length: 8}) || '' }}
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'Personal',
  components: {},
  data() {
    return {
      status: 0,
    }
  },
  computed: {
    ...mapState('basic', ['countryName', 'firstName', 'realName', 'mobile', 'idCard', 'uid', 'email']),
  },
  watch: {},
  methods: {
    jumpPage(name) {
      return this.$Helper.jumpPage(name, this)
    },
    judgeAnalyze() {
      setTimeout(() => this.$Helper.emitAction('loading', { show: true }), 200)
      return this.$Helper.ajax({
        url: '/app/user/authStatus.api',
        method: 'POST',
      })
      .then(
        ({data}) => {
          let { validStatus } = data
          this.status = validStatus
          setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 600)
        },
        (data) => {
          setTimeout(() => this.$Helper.emitAction('loading', { show: false }), 600)
        },
      )
    },
  },
  created() {
    this.judgeAnalyze()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../theme/index.less');
  .container {
    background: white;
    .head{
      padding: 0 3vw;
      .left{
        height: 12vw;
        font-size: 4vw;
        font-weight: 600;
        color: #333;
      }
      .right{
        color: #666;
        font-size: 3.7vw;
        i{
          font-size: 4vw;
          margin-right: 1vw;
        }
      }
    }
    ul{
      padding: 3vw;
      li{
        height: 10vw;
        .left{
          color: #777;
          font-size: 3.6vw;
        }
        .right{
          color: #333;
          font-size: 4vw;
        }
      }
    }
  }
</style>
