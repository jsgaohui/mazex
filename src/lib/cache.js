// 注意，缓存操作务必规范化
// 如果你使用自带的window.localStorage api去处理缓存
// 可能造成不可预知的错误
import Cache from 'storejs'
import _ from 'lodash'
// every cache must set the key here, if not, throw a error!
// 规范缓存，所有缓存的key必须在白名单中配置
const whiteList = [
  'CacheStatus',  // 存储缓存数据状态
  'userInfo',   // logined user' basic info 用户基本信息
  'Transaction', // route named Transaction, save the page's info  // Transaction页面数据缓存
  'MarketActiveKey', // route named Market, save the active key when toggle 市场数据切换时缓存key值
  'TradeDetailCache', // route named TradeDetail, save the page basic data to prevent window reload
  'Login',   // route named Login, save the login username, when page reopen, the username will appear
  'setting',  // app basic setting
  'CountryList', // route named CountrySelect, save the country list, prevent ajax to much
  'tradeViewCache', // tradeView' cache  已废弃,
  'FundDetailCache', // route named TradeDetail, save the page basic data to prevent window reload
  'PayTypeList', // 支付方式缓存
  'CurrencyList' , // 法币币种
  'AutoTradeDetailCache', //跟单详情缓存
]
// difine a list to contain the cache that will not be delete
// 这里定义的key，在清空缓存时不会被清除
const stableList = [
  'Login',
  'setting',
]
export default {
  // 所有本地缓存必须使用这个方法获取
  // localstorage默认不具有过期时间，这里动态判断CacheStatus的数据，每次获取缓存时对比
  // 如果已过期返回空，并删除缓存
  getCache(key) {
    // judge if have expries
    let cacheInfo = Cache.get('CacheStatus')
    let cacheDeadTime = _.get(cacheInfo, `[${key}].deadTime`)
    if (cacheDeadTime && cacheDeadTime < new Date().getTime()) {
      // remove the cache then return null
      Cache.set(key, null)
      cacheInfo[key] = { ...cacheInfo[key], deadTime: null }
      // remove the deadTime
      Cache.set('CacheStatus', cacheInfo)
      return null
    }
    return Cache.get(key)
  },
  // 设定缓存的方法
  // 默认缓存一个月
  setCache(key, data, long = 30 * 24 * 60 * 60 * 1000) {  // save the cache for a month by default(ms)
    // test whitList
    if (whiteList.indexOf(key) === -1) throw new Error(`[setCache ERROR]: cache key nemed ${key} are not set in whiteList, please recheck!`)
    // if setted save long
    if (long) {
      // get the saved cache info
      let cacheInfo = Cache.get('CacheStatus') || {}
      // save or update the cache deadTime
      cacheInfo[key] = { ...cacheInfo[key], deadTime: new Date().getTime() + long }
      Cache.set('CacheStatus', cacheInfo)
    }
    Cache.set(key, data)
  },
  // 清楚缓存
  clearCache(list = _.difference(whiteList, stableList), except = []) {
    Cache.forEach((k, d) => {
      list = _.difference(list, except)
      if (list.indexOf(k) !== -1) Cache.remove(k)
    })
  },
  // 获取本机缓存大小
  getCacheLength() {
    let currentCache = {}
    Cache.forEach((k, d) => {
      let list = _.difference(whiteList, stableList)
      if (list.indexOf(k) !== -1) currentCache[k] = d
    })
    return JSON.stringify(currentCache).length
  },
}
