<template lang="html">
  <div class="layout container" >
    <!--购买-->
    <div class="container box box-row router-view" img-set="static/favicon.ico">
      <div  class="head box">
        <div class="left box box-item">
           <!--<i  class="iconfont"></i>-->
        </div>
        <div class="name box box-item box-col-flex">
          <span>{{$t('otc.option')}}</span>
        </div>
        <div class="right box box-item font-blue" @click="done()">{{$t('otc.confirm')}}</div>
      </div>
      <div class="half-x-line"></div>
      <div class="screen-list box-row-flex">
        <!--<div class="screen-box box box-space-bettwen" @click="selectCountry()">-->
          <!--<div class="box box-x-left box-col-flex">-->
            <!--<div class="text box-col-4">{{$t('identity.country')}}</div>-->
            <!--<div class="input"><input type="text" :placeholder="$t('identity.contry_toast')" v-model="item.countryCode" :disabled="true"></div>-->
          <!--</div>-->
          <!--<div class="icon box box-item">-->
            <!--<span class="box box-item"></span>-->
            <!--<i class="iconfont" ></i>-->
          <!--</div>-->
        <!--</div>-->
        <div class="half-x-line"></div>
        <div class="screen-box box box-space-bettwen" >
          <div class="box box-x-left box-col-flex" @click="selectCurrency()">
            <div class="text box-col-4">OTC</div>
            <div class="input"><input type="text" :placeholder="$t('fund.choose')" v-model="item.currencySymbol"></div>
          </div>
          <div class="icon box box-item">
            <span class="box box-item"></span>
            <i class="iconfont"></i>
          </div>
        </div>
        <div class="half-x-line"></div>
        <div class="screen-box box box-space-bettwen" @click="selectPayType()">
          <div class="box box-x-left box-col-flex" style="align-items: center">
            <div class="text box-col-4">{{$t('otc.paymentMethod')}}</div>
            <div class="input"><input type="text" :placeholder="$t('fund.choose')"  v-model="item.payMethod"></div>
          </div>
          <div  class="icon box box-item">
            <span class="box box-item"></span>
            <i class="iconfont"></i>
          </div>
        </div>
        <div class="half-x-line"></div>
        <div class="screen-box box box-space-bettwen">
          <div class="box box-x-left box-col-flex">
            <div class="text box-col-4">{{$t('otc.amount')}}</div>
            <div class="input"><input type="text" :placeholder="$t('otc.editAmount')" v-model="item.amount"></div>
          </div>
          <div class="icon box box-item">
            <span class="box box-item"></span>
            <i class="iconfont" style="color:#fff"></i>
          </div>
        </div>
        <div class="half-x-line"></div>
        <div class="reset"><span @click="reset(item)">{{$t('otc.reset')}}</span></div>
      </div>

    </div>
    <!--购买END-->

  </div>
  <!--.container.box.box-row-->
    <!--.num-con.box.box-y-center-->
      <!--i.iconfont &#xe606;-->
      <!--input(class="box-col-flex" type="text" v-model="searchText" :placeholder="$t('country.input_country')")-->
      <!--span(@click.stop="$Helper.emitAction('closeModel')") {{ $t('basic.cancel') }}-->
    <!--.half-x-line-->
    <!--ul.overflow-y.mescroll.box-row-flex(v-if="!errorStatus")-->
      <!--li.box.box-y-center(v-for="(item, key) of selectedList" :key="key" @click.stop="choseCountry(item)")-->
        <!--.left {{ item.code }}-->
        <!--.right.box.box-x-right.box-col-flex +{{ item.countryCode }}-->
    <!--.lay.box.box-x-center.box-row-flex(v-else)-->
      <!--Spiner(color="#333")-->
</template>
<script>
import Spiner from '@/components/Spiner'
export default {
  components: {
    Spiner,
  },
  data() {
    return {
      addressConf: [],
      searchText: '',
      errorStatus: 'error',
      item: {
        countryCode: '', // 国家
        currencySymbol: '', // 法币币种
        payMethod: '', // 支付方式
        payId: '', // 支付方式Id
        amount: '', //  订单金额
      },
      statusConf: {
        error: {
          text: this.$t('basic.web_error'),
          img: 'static/images/no-wifi.png',
        },
        empty: {
          text: this.$t('basic.empty_error'),
          img: 'static/images/no-order.png',
        },
        loginout: {
          text: this.$t('basic.not_login_error'),
          img: 'static/images/no-order.png',
        },
      },
    }
  },
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    selectedList() {
      if (this.searchText) return this.addressConf.filter(item => item.searchText.indexOf(this.searchText) !== -1)
      return this.addressConf
    },
    errorConf() {
      return this.statusConf && this.errorStatus ? this.statusConf[this.errorStatus] : {}
    },
  },
  watch: {
    addressConf() {
      this.judgeErrorStatus(this.addressConf)
    },
    selectedList() {
      this.judgeErrorStatus(this.selectedList)
    },
  },
  methods: {
    // 重置对象
    reset(item) {
      this.$Helper.resetObject(item)
    },
    // 选择国家
    selectCountry() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'CountrySelect',
          type: 'right',
          params: {
            callback: item => {
              this.item.countryCode = item.code
                // this.addressSelect = item.countryCode
            },
          },
        }
      )
    },
    // 选择法币
    selectCurrency() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'CurrencySelect',
          type: 'right',
          params: {
            callback: item => {
              this.item.currencySymbol = item.currencySymbol
              // this.addressSelect = item.countryCode
            },
          },
        }
      )
    },
    selectPayType() {
      this.$store.dispatch(
        'layermodel/push',
        {
          name: 'PayTypeSelect',
          type: 'right',
          params: {
            callback: item => {
              this.item.payMethod = item.paymentTypeName
              this.item.payId = item.paymentTypeId
            },
          },
        }
      )
    },
    initAddressConf() {
      let cacheAddress = this.$Helper.getCache('CountryList')
      if (cacheAddress && cacheAddress.length > 0) {
        this.addressConf = cacheAddress
        return
      }
      this.$Helper
      .ajax({
        url: '/app/user/getcountrys.api',
        method: 'POST',
      })
      .then(({data}) => {
        let { countryList } = data
        this.addressConf = countryList.map(item => ({ ...item, searchText: item.code + item.code.toLowerCase() + item.countryCode + item.name + item.keyword }))
        // save for 1 minute
        this.$Helper.setCache('CountryList', this.addressConf, 60 * 1000)
      })
    },
    done() {
      this.$Helper.emitAction('closeModel')
      let fn = this.params.callback
      if (fn && this.$Helper.isType(fn, () => {})) fn(this.item)
    },
    judgeErrorStatus(arr) {
      if (!arr) {
        this.errorStatus = 'error'
      } else if (arr.length === 0) {
        this.errorStatus = 'empty'
      } else {
        this.errorStatus = null
      }
    },
  },
  created() {
    // 初始化参数
    if (this.params.initParam) {
      this.item = this.params.initParam
    }
    this.initAddressConf()
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
  @import url('../../../theme/index.less');
  .container {
    background: white;
    width: 80vw;
    .num-con{
      padding: 3vw 4vw;
      span{
        margin-left: 2vw;
        font-size: 3.6vw;
        color: #646da9;
      }
      i{
        font-size: 4vw;
        color: #aaa;
        margin-right: 2vw;
      }
    }
    .half-x-line{
      margin-top: 2vw;
      margin: 0 4vw;
    }
    ul{
      margin-top:3vw;
      padding: 3vw 4vw;
      li{
        padding: 5vw 0;
        .left{
          font-size: 4vw;
          font-weight: 600;
        }
        .right{
          font-size:3.7vw;
          color: #555;
        }
      }
    }
    .lay{
      padding-top: 30vw;
      background: #fff;
    }
  }
</style>
