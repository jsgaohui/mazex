// 公用helper方法
// main.js中将这个方法绑定到每一个vue组件中了，可直接this.$Helper获取
import Vue from 'vue'
import Vuex from 'vuex'
import Router from '@/router'
import cacheLib from './cache'
import {routeIndexConf} from '@/config/route'
import Cookie from 'js-cookie'
import _ from 'lodash'
const THIS = new Vue()
const Helper = {
  ...cacheLib,
  // app环境还是web环境
  isApp() {
    return window.api || (window.webkit && window.webkit.messageHandlers)
  },
  // 获取本机浏览器语言
  getNavigatorLanguage() {
    return (navigator.appName === 'Netscape' ? navigator.language : navigator.browserLanguage).substr(0, 2)
  },
  // 密码正则判断
  checkPassword(str) {
    if (!this.isType(str, '')) return false
    return /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,20}/.test(str)
  },
  // input 13423232323 output 134****2323
  // input 32114141@qq.com output 321*****@qq.com
  secretStr({str = '', length = 4, ret = '*'}) {
    if (this.isType(str, null)) str = ''
    if (this.isType(str, 0)) str = str.toString()
    const len = str.length
    const getRet = (len = 0, ret) => {
      let s = ''
      for (let i = 0; i < len; i++) s += ret
      return s
    }
    if (len < length) {
      return getRet(len, ret)
    } else {
      let start = parseInt((len - length) / 2)
      return str.substr(0, start) + getRet(length, ret) + str.substr(start + length)
    }
  },
  // 因为js精度问题，定义的固定小数位的方法
  // 当返回的字符串长度大于maxLength时，会牺牲小数位以保证数据准确
  numFixedLength(num = 0, length = 5, maxLength = 30) {
    if (this.isType(num, null)) num = 0
    if (this.isType(num, '')) num = Number.parseFloat(num).toFixed(length)
    if((num.toString().indexOf('E') != -1) || (num.toString().indexOf('e') != -1)) {
      num=Number.parseFloat(num).toFixed(length)
    }
    let zLen = parseInt(num).toString().length
    let sLen = length + zLen >= maxLength ? maxLength - zLen - 1 : length
    sLen = sLen < 0 ? 0 : sLen
    if (sLen > 0) {
      num = num + (num.toString().indexOf('.') === -1 ? '.' : '') + '00000000000000000000000000000000000'
      return (num.substring(0, num.indexOf('.') + sLen + 1)).toString().replace('NaN', '0').replace('Infinity', '0')
    } else {
      return num.toString().replace('NaN', '0').replace('Infinity', '0')
    }
  },
  /*显示法币位数*/
  formatAmount(num) {
    if(!(typeof num==='Number')){
      num=Number.parseFloat(num)
    }
    if(num>0.5){
      num= num.toFixed(2)
    }else if(num<0.5&&num>0.01){
      num= num.toFixed(3)
    }else if(num<0.01&&num>0.001){
      num= num.toFixed(4)
    }else if(num<0.001&&num>0.0001){
      num= num.toFixed(5)
    }else if(num<0.0001){
      num= num.toFixed(5)
    }else{
      num=num.toFixed(2)
    }
    let numStrs=num.toString().split('.')
    return numStrs[0].replace(/\B(?=(\d{3})+(?!\d))/g,',')+'.'+numStrs[1]
  },
  // input 1231231 output 1,231,231
  numFormat(str) {
    str = !this.isType(str, '') ? str.toString() : str
    if (str.substr(0, 1) === '0') return str.substr(0, 3)
    let isBear = str.substr(0, 1) === '-'
    str = str.substr(isBear ? 1 : 0)
    let pointPlace = str.indexOf('.') === -1 ? str.length : str.indexOf('.')
    let z_str = str.substr(0, pointPlace)
    let intStr = ''
    z_str.split('').reverse().map((item, key) => {
      intStr += (key && key % 3 === 0) ? ',' : ''
      intStr += item
    })
    return (isBear ? '-' : '') + intStr.split('').reverse().join('') + str.substr(pointPlace)
  },
  // 是否是测试环境
  isTest() {
    return process.env.NODE_ENV === 'development'
  },
  // input {a: 1, b:2} output a=1&b=2
  preSetParams(params) {
    let newData = {}
    for (let i in params) {
      if (params[i] !== null && params[i] !== undefined && params[i] !== '') {
        newData[i] = _.trim(params[i])
      }
    }
    return newData
  },
  // 统一的ajax方法，请务必使用这个方法， 返回promise对象
  ajax({ params = {}, method = 'POST', url, isFile = false, responseType = 'json' }) {
    let userInfo = this.getCache('userInfo')
    let uuid = null
    if (userInfo) uuid = userInfo.token
    if (!url) throw new Error('Ajax error,without url!')
    // set cookie
    Cookie.set('locale', _.get(this.getCache('setting'), 'language') || this.getNavigatorLanguage(),)
    // assign a locale params to params
    let httpConf = {
      method,
      url,
      params: method === 'GET' ? params : {},
      body: isFile ? params : (method === 'POST' ? JSON.stringify(params) : {}),
      emulateHTTP: true,
      credentials: true,
      timeout: 60000,
      headers: {
        UUID: uuid,
        env: 'native',
        device: window.api || (window.webkit && window.webkit.messageHandlers) ? (this.isAndroid() ? 'android' : 'ios') : 'web',
        locale: _.get(this.getCache('setting'), 'language') || this.getNavigatorLanguage(),
      },
    }
    return new Promise((resolve, reject) => {
      THIS.$http(httpConf).then(res => {
        if (responseType === 'json') return res.json()
        if (responseType === 'blob') return res.blob()
      }).then(
        (res) => {
          // filter code, toast the i18n msg
          // let msg = i18n.t(`httpCode.${res.code}`)
          // if (msg) res.msg = msg
          if (res.code === '401' || res.code === 401) {
            Router.push({ name: 'Login' })
            THIS.$Helper.emitAction('toast', {
              text: res.msg || '登录信息有误',
            })
          } else {
            resolve(res)
          }
        },
        (e) => {
          reject(e)
        },
      ).catch(e => {
        reject(e)
      })
    })
  },
  // ajax
  fetch(params) {
    return Helper.ajax(params)
  },
  // 返回某个时间段到现在时间的时间间隔
  formatTime(time) {
    let timeBetween = (new Date().getTime() - new Date(time.replace(/-/g, '/')).getTime()) / 1000      // 秒
    let returnData
    if (timeBetween < 15) {
      returnData = '刚刚'
    } else if (timeBetween >= 15 && timeBetween < 60) {
      returnData = parseInt(timeBetween) + '秒前'
    } else if (timeBetween >= 60 && timeBetween < 3600) {
      returnData = parseInt(timeBetween / 60) + '分钟前'
    } else if (timeBetween >= 3600 && timeBetween < 86400) {
      returnData = parseInt(timeBetween / 3600) + '小时前'
    } else if (timeBetween >= 86400 && timeBetween < 2592000) {
      returnData = parseInt(timeBetween / 86400) + '天前'
    } else if (timeBetween >= 2592000 && timeBetween < 31104000) {
      returnData = parseInt(timeBetween / 2592000) + '月前'
    } else if (timeBetween > 31104000) {
      returnData = time
    }
    return returnData
  },
  // eventbus 的事件发布方法
  emitAction(type, data) {
    THIS.$emit(type, data)
  },
  // eventbus 的事件监听方法（务必监听组件要存在）
  onAction(type, callback) {
    THIS.$on(type, callback)
  },
  // 销毁创建的监听组件
  destroy(type) {
    THIS.$off(type)
  },
  // 获取当前时间戳
  getTime() {
    return new Date().getTime()
  },
  // 判断object里是否有空属性
  // { a: 1, b: undefined } 会返回['b']
  // expect包含忽略属性
  // contain表示一定要判断的属性
  // 可以都不填，默认判断所有
  testParamsComplete({ params = {}, except = [], contain = [] }) {
    let obj = !_.isEmpty(contain) ? contain : params
    let emptyArr = []
    let isEmpty = (o) => {
      return (typeof o === 'object' && _.isEmpty(o)) || (typeof o === 'string' && _.trim(o) === '') || _.isUndefined(o)
    }
    for (let i in obj) {
      let key = _.isEmpty(contain) ? i : obj[i]
      let item = params[key]
      if (isEmpty(item) && except.indexOf(key) === -1) emptyArr.push(key)
    }
    return emptyArr
  },
  // 获取url上的参数
  // 返回键值对
  getUrlParams(key) {
    let href = window.location.href
    // let pramsString = href.substring(href.indexOf('?') + 1, href.indexOf('#'))
    let wIndex = _.lastIndexOf(href.split(''), '?')
    // console.log(wIndex)
    let pramsString = wIndex !== -1 ? href.substr(wIndex + 1) : ''
    let paramsArr = pramsString ? pramsString.split('&') : []
    let returnData = {}
    paramsArr.map((item) => {
      let arr = item.split('=')
      returnData[arr[0]] = arr[1]
    })
    return returnData
  },
  // 返回url上某个确定key值的属性
  getUrlParamsByKey(key) {
    let params = Helper.getUrlParams()
    return params[key] || null
  },
  // js对象类型判断方法
  // isType(a, {}) === true表示a是对象
  // isType(a, '') === true表示a是字符串
  // 以此类推
  isType(obj1, obj2) {
    return Object.prototype.toString.call(obj1) === Object.prototype.toString.call(obj2)
  },
  // 是否是安卓开发环境
  isAndroid() {
    let u = navigator.userAgent
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
  },
  // 是否是pc开发环境
  isPc() {
    const userAgentInfo = navigator.userAgent
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  },
  // 类似_.get()方法
  getData(ob, str) {       // only object
    if (!this.isType(ob, {})) {
      return undefined
    }
    if (!this.isType(str, '')) {
      return undefined
    }
    let getParams = (obj, arr) => {
      if (this.isType(obj[arr[0]], undefined) || this.isType(obj[arr[0]], null)) {
        return undefined
      } else {
        if (arr.length > 1) {
          let key = arr.shift()
          let s = obj[key]
          return getParams(s, arr)
        } else {
          return obj[arr[0]]
        }
      }
    }
    return getParams(ob, str.replace(/\[\d+\]/g, s => `.${s.substr(1, s.length - 2)}`).split('.'))
  },
  // 去中心化引入路由或者文件的方法，这里接受require方法的返回值
  // 返回判断后的js对象，包含路由名称及组件文件
  requireAll(requireContext) {
    const ret = {}
    const getFileName = arr => arr.length > 2 && arr[arr.length - 1] === 'index.vue' ? arr[arr.length - 2] : (arr[arr.length - 1] !== '__index__.vue' ? arr[arr.length - 1].split('.')[0] : null)
    requireContext.keys().forEach(k => {
      let fileName = getFileName(k.split('/'))
      if (fileName && ['index'].indexOf(fileName)===-1) ret[fileName] = requireContext(k)
    })
    return ret
  },
  // js设定网页title的方法
  setDocumentTiTle(title) {
    let i = document.createElement('iframe')
    i.src = '../favicon.ico'
    i.style.display = 'none'
    i.onload = () => {
      setTimeout(() => {
        i.remove()
      }, 9)
    }
    document.title = title
    document.body.appendChild(i)
  },
  // vue-router规范化前进后退的方法
  // 请务必使用这个方法统一跳转页面
  // 请参考config/route
  jumpPage(params, that, jumpType) {
    if (jumpType && ['replace', 'push'].indexOf(jumpType) === -1) {
      return
    }
    params = typeof params === 'object' ? params : { name: params }
    let fn
    if (Helper.getRouteIndex(that.$route.name) >= Helper.getRouteIndex(params.name) || Helper.getRouteIndex(params.name) === 0) {
      fn = Router.replace
    } else {
      fn = Router.push
    }
    if (jumpType) fn = Router[jumpType]
    if (fn && this.isType(fn, () => {})) fn.call(Router, params)
  },
  // 后退一个页面
  jumpBack() {
    Router.go(-1)
  },
  push(path,ob) {
    Router.push({ name: path },ob)
  },
  replaceHis(url) {
    Router.replace(url)
  },
  // 获取config/route配置文件中当前路由的层级
  getRouteIndex(name) {
    let key = null
    for (let i in routeIndexConf) {
      let item = routeIndexConf[i]
      if (_.indexOf(item, name) !== -1) {
        key = parseInt(i)
      }
    }
    return key
  },
  // 一些简单的dom操作方法
  dom: {
    addClass: (obj, className) => {
      if (obj.className === ``) {
        obj.className = className
      } else {
        if (Helper.dom.classIndexOf(obj, className) === -1) {
          obj.className += ` ` + className
        }
      }
    },
    classIndexOf: (obj, v) => {
      const arrClassName = obj.className.split(` `)
      for (let i = 0; i < arrClassName.length; i++) {
        if (arrClassName[i] === v) return i
      }
      return -1
    },
  },
  // 拷贝到剪切板
  copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
      // IE specific code path to prevent textarea being shown while dialog is visible.
      return window.clipboardData.setData('Text', text)
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      var textarea = document.createElement('textarea')
      textarea.textContent = text
      textarea.style.position = 'fixed'  // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea)
      textarea.select()
      textarea.setSelectionRange(0, text.length)
      try {
        return document.execCommand('Copy')  // Security exception may be thrown by some browsers.
      } catch (ex) {
        console.warn('Copy to clipboard failed.', ex)
        return false
      } finally {
        document.body.removeChild(textarea)
      }
    }
  },
  /**
   *  根据返回的httpcode
   * @param code  httpcode
   * @param msg 返回消息
   * @returns {*}
   */
  dealHttpCode(code,msg,scrollObj, listQuery){
    if (Number.parseInt(code) !== 200) {
      if (!msg) {
        msg = this.$t('httpCode.' + code)
      }
      this.toast(msg)

      if (code === 207 &&  scrollObj && listQuery){
        scrollObj.endSuccess(listQuery.limit, true)
        return
      }
      return false

    }
    return true;
  },
  /**
   *   下拉分页控件处理
   * @param pageData  返回的数据
   * @param scrollObj 下拉分页查询控件
   * @param listQuery 查询条件
   * @returns {*}
   */
  dealPageResult(page,scrollObj,listQuery,orderList,newList){
    var hasNext = listQuery.page < page
    orderList = orderList.concat(newList)
    listQuery.page++
    if (scrollObj) {
      scrollObj.endSuccess(listQuery.limit, hasNext)
    }
    return orderList;
  },
  // 重置对象的属性值为空
  resetObject(ob) {
    let $this = this
    _.forEach(ob, (v, k) => {
      ob[k] = ''
    })
  },
  /**
   * 复制有相同名字的属性到target
   * @param source
   * @param target
   * @param flag true代表把target没有的属性也复制过去
   */
  copyProperties(source, target, flag = false) {
    let $this = this
    _.forEach(source, (v, k) => {
      if(!flag){
        if(target.hasOwnProperty(k)){
          target[k] = v
        }
      }else{
        target[k] = v
      }
    })
  },
  /**
   *
   * @param data 数据
   * @param precision  精度
   */
  format(data,precision){
    return Number.parseFloat(data).toFixed(precision).replace(/[.]?0+$/g, '')
  },
  // 截取几位小数
  floor(data,precision){
    let temp = Math.pow(10,precision)
    return Math.floor(Number.parseFloat(data) * temp) / temp
  },
  // 获取剩余时间（分秒）
  getTheRemainingTime(remainTime) {
    let minute = Math.floor(remainTime / 60);
    if (minute >= 0) {//需要在限定的时间内的才算
      minute = this.prefixInteger(minute, 2);
      let second = this.prefixInteger(remainTime % 60, 2);
      return minute + ':' + second;
    }
    return null
  },
  // 前补0
  prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length)
  },
  /**
   * 判断是否指定精度的数字
   * @param num 数字
   * @param floatNum 精度
   * @returns {boolean}
   */
  isZNum(num, floatNum = 5) {
    let reg = new RegExp(`(^[1-9]([0-9]+)?(.[0-9]{1,${floatNum}})?$)|(^[0-9].[0-9]{1,${floatNum}}$)`)
    return reg.test(num) && parseFloat(num) > 0
  },
  /**
   * 提示信息
   */
  toast(msg, type = 'center' ) {
    this.emitAction('toast', {
      text: msg,
      type: type,
    })
  },
  /**
   * 提示信息
   */
  dialog(modulName, direction, params, ob) {
    ob.dispatch(
      'layermodel/push',
        {
        name: modulName,
        type: direction,
        params: params,
      })
  },
  /**
   * 去otc訂單頁面
   * @param status
   * @param type 1查詢挂牌的  0查詢委托的
   */
  toOtcOrder(ob, key, status, type=0) {
    let param = {key: key, status: status, type: type} // 狀態 ,
    this.replaceHis('Account')
    this.jumpPage({name: 'OtcOrder', params: param}, ob)
  },
  setMaxlength(maxlength) {
    let value = $event.target.value
    if (value.length>5){
      value=value.slice(0,5)
    }
  },
  formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str))
      }
    }
    return fmt
  },
  padLeftZero(str) {
    return ('00' + str).substr(str.length)
  }
}
export default Helper
