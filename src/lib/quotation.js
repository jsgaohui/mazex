// 规范化socket监听流程
// 通过调用该页面的reloadQuotation方法，会在监听槽中新建一条监听
// 收到socket事件时会派发reloadQuotation的action
// 只需要在需要处理的地方，写上this.$Helper.onAction()就能监听到对应事件
// 当调用disconnect方法时，保留本地的所有连接，定一个计时器，如果10s内未再次收到监听信息，整个connect会被断开
import Sockjs from 'sockjs'
import {Client} from '@/views/MyFund/stomp.min'
import Helper from './index'
import setting from '../config/setting'
import _ from 'lodash'
import Cache from '@/lib/cache'
// import { addQueue } from '@/lib/debonce'

let currentHander = null    // save the socket hander
let currentListen = []     // save current socket listener
let queue = []      // save the request queue
let locked = false  // 引入锁机制防止同时派发两个监听事件
let timer = null
let subGearQuotations = null //已订阅的档位行情
let subKlines = null //已订阅的K线行情
let reconnections = [];//需要进行重新订阅的信息
let domain = 'https://' + document.domain.replace("www", 'cdn')
//let domain = 'http://localhost:8080'
// the method to build a request faster
const listen = ({url, name}) => {
  if (locked) {
    // save a request to queue
    queue.push({url, name})
    return
  }
  locked = true
  connectSocket({url: domain + '/udax/quotation',name: name, subUrl: url}).then(
    socket =>{
      // let data = Helper.getCache('Test')
      // if(!data){
      //   data = []
      // }
      // data.push('url' + url)
      // Helper.setCache('Test',data)
      let subscription=socket.subscribe(
        url,
        res => {
          if (res.body) {
            let list = JSON.parse(res.body)
            Helper.emitAction(name, {socket, list})
          }
        },
        {id: name, destination: name},
      )
      // save the listener name
      if(currentListen){
        removeObjByName(name,currentListen)
        currentListen.push(name)
      }
      // data.push('before')
      // Helper.setCache('Test',data)
      // print()
      if(reconnections){
        removeObjByName(name,reconnections) // 移除旧的
        reconnections.push({name:name,url:url}) //放入新的
      //  print()
      }
      if(name === 'reloadGearQuotation'){
        subGearQuotations = subscription
      }

      if(name === 'reloadSymbolKline') {
        subKlines = subscription
      }
      // unchain the lock
      locked = false
      // check the next queue, if not empty, do it
      if (queue.length > 0) {
        const listenNow = queue.shift()
        listen(listenNow)
      }
    }
  )
}
const print = () => {
  let data = Helper.getCache('Test')
  if(!data){
    data = []
  }
  data.push('reconnections')
  reconnections.forEach((i) =>{
    data.push(i)
  })
  Helper.setCache('Test',data)
}
const removeObjByName = (name,obj,newObj) => {
    for(var i in obj){
      if (obj[i].name === name) {
        obj.splice(i,1) // 移除旧的
      }
    }
}
const supportListen = {
  reloadQuotation() {
    listen({
      url: '/topic/quotation',
      name: 'reloadQuotation',
    })
  },
  reloadRate() {
    listen({
      url: '/topic/exchangeRate',
      name: 'reloadRate',
    })
  },
  reloadSymbolKline(symbol,resolution) {
    if(subKlines){
      subKlines.unsubscribe()  //取消已订阅的K线，重新订阅新的
    }
    listen({
      url: '/topic/kline/'+symbol + '/' +resolution,
      name: 'reloadSymbolKline',
    })
  },
  reloadGearQuotation(symbol) {
    if(subGearQuotations){
      subGearQuotations.unsubscribe()  //取消已订阅的档位行情，重新订阅新的
    }
    listen({
      url: '/topic/gearQuotation/' +symbol,
      name: 'reloadGearQuotation',
    })
  },
  reloadOrders() {
    let uid = _.get(Helper.getCache('userInfo'), 'uid')
    if (!uid) {
      return
    }
    listen({
      url: `/user/${uid}/order`,
      name: 'reloadOrders',
    })
  },
  // 监听法币订单
  fbOrders() {
    let uid = _.get(Helper.getCache('userInfo'), 'uid')
    if (!uid) {
      return
    }
    listen({
      url: `/user/${uid}/fbOrderStatus`,
      name: 'fbOrders',
    })
  },
}


export const connectSocket = ({url,name,subUrl}) => {
  return new Promise((reslove, reject) => {
    if (currentHander) {
      reslove(currentHander)
      return
    }
    if (!url || !Helper.isType(url, '')) reject(new Error('[connectSocket ERROR]: url is none or not a string type, expect a string!'))
    if (url.indexOf('http') === -1) url = setting.getTarget() + url
    let sessionid = Cache.getCache('userInfo')?Cache.getCache('userInfo').token:false
    let header = sessionid ? {sessionid: sessionid} : {}
    let initCount = 0
    const socket = new StompJs.Client({
      debug:function(str) {
          // let data = Helper.getCache('Test')
          // if(!data){
          //   data = []
          // }
          // data.push(str)
          // Helper.setCache('Test',data)
          //this.$store.dispatch('basic/setLoginData', { mobile: data.mobile, email: data.email, openEmailValid: data.openEmailValid ? 1 : 0, openPhoneValid: data.openPhoneValid ? 1 : 0 })
      },
      connectHeaders:header,
      reconnectDelay: 1000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000
    })
    socket.webSocketFactory = function () {
      initCount++
      return new SockJS(url);
    }
    socket.onConnect = function(frame) {
      // let data = Helper.getCache('Test')
      // data.push(frame)
      // Helper.setCache('Test',data)
      // data.push('initCount:' + initCount+ ';name' + name + ';subUrl' + subUrl)
      // Helper.setCache('Test',data)
      currentHander = socket
      if(initCount > 1) {
        reconnection()
      } else {
        reslove(currentHander)
      }
    }
    socket.activate()
  })
}

export const reconnection =() =>{
  let connected = []
  if(reconnections){
   // let data = Helper.getCache('Test')
   // data.push("reconnections")
    reconnections.forEach(function(item){
    //  data.push(item)
      let repeat = false
      connected.forEach((citem) => {
          if(citem === item.name){
            // data.push("repeat")
            repeat = true
          }
      })
      if(repeat) return
      // data.push(" no repeat")
      connected.push(item.name)
      listen(item)
     // Helper.setCache('Test',data)
    })
  }
}
export const disconnectSocket = () => {
  if (!currentHander) {
    return
  }
  if (timer) clearInterval(timer)
  timer = setTimeout(() => {
    currentHander.deactivate()
    locked = false
    queue = []
    currentListen = []
    currentHander = null
    subGearQuotations = null
    subKlines = null
  }, 10000)
}

export const deactivateSocket = () => {
  if (!currentHander) {
    return
  }
  currentHander.deactivate()
  locked = false
  queue = []
  currentListen = []
  currentHander = null
  subGearQuotations = null
  subKlines = null
}

export const stopDisconnenctSocket = () => {
  if (timer) clearInterval(timer)
}

export const listenRuner = (name,symbol,resolution) => {
  stopDisconnenctSocket()
  if (!supportListen[name]) {
    return
  }
  if(symbol || resolution){
    if (currentListen.indexOf(name+'/'+symbol+'/'+resolution) !== -1) {
      return
    }
  }else if (currentListen.indexOf(name) !== -1) {
      return
  }
  supportListen[name](symbol,resolution)
}

export const removeListenRuner = name => {
  if (!supportListen[name]) {
    return
  }
  if (currentListen.indexOf(name) === -1) {
    return
  }
  if (!currentHander) {
    return
  }
  removeObjByName(name, reconnections)
  removeObjByName(name, currentListen)
  if(name === 'reloadGearQuotation' && subGearQuotations){
    subGearQuotations.unsubscribe()
  }else if(name === 'reloadSymbolKline' && subKlines){
    subKlines.unsubscribe()
  }else {
    currentHander.unsubscribe(name)
  }
}

export const reloadQuotation = () => listenRuner('reloadQuotation')
export const reloadRate = () => listenRuner('reloadRate')
export const reloadKline = (symbol,resolution) => listenRuner('reloadSymbolKline',symbol,resolution)
export const reloadOrders = () => listenRuner('reloadOrders')
export const fbOrders = () => listenRuner('fbOrders')
export const reloadGearQuotation = (symbol) => listenRuner('reloadGearQuotation',symbol)
