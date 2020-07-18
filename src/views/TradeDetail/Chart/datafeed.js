/**
 * Created by liang.zc on 2018/1/26.
 */

import {hisQuotation, getServerTime} from './quotation'
import { reloadKline } from '@/lib/quotation'
import Helper from '@/lib'
import _ from 'lodash'

const useCache = false
let Datafeeds = {};
Datafeeds.UDFCompatibleDatafeed = function (symbolInfo) {
  this._configuration = undefined;

  this._symbolInfo = symbolInfo;
  this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this);

  this._enableLogging = false;
  this._initializationFinished = false;
  this._callbacks = {};
  this._initialize();
};

Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
  return {
    supports_search: false,
    supports_group_request: true,
    supported_resolutions: this._symbolInfo.supported_resolutions,
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true
  };
};

Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
  if (this._configuration.supports_time) {
    getServerTime().then((response) => {
      if (response.code === 200) {
        callback(response.data.serverTime)
      }
    })
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
  if (!this._callbacks.hasOwnProperty(event)) {
    this._callbacks[event] = [];
  }

  this._callbacks[event].push(callback);
  return this;
};

Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (event, argument) {
  if (this._callbacks.hasOwnProperty(event)) {
    let callbacksChain = this._callbacks[event];
    for (let i = 0; i < callbacksChain.length; ++i) {
      callbacksChain[i](argument);
    }

    this._callbacks[event] = [];
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
  this._initializationFinished = true;
  this._fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
  if (this._enableLogging) {
    let now = new Date();
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
  this._configuration = this.defaultConfiguration();
  this.onInitialized();
  this._fireEvent('configuration_ready');
}

Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
  let _this = this;

  if (this._configuration) {
    setTimeout(function () {
      callback(_this._configuration);
    }, 0);
  } else {
    this.on('configuration_ready', function () {
      callback(_this._configuration);
    });
  }
};

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
  let _this = this;

  setTimeout(function () {
    onSymbolResolvedCallback(_this._symbolInfo);
  }, 0);
};


  Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onHistoryCallback, onErrorCallback, firstDataRequest) {
  //	timestamp sample: 1399939200
  if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
    throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
  }

  let cacheAll = Helper.getCache(`tradeViewCache`) || {}
  let cacheData = cacheAll[symbolInfo.ticker + resolution] || []
  if (useCache && cacheData && cacheData.length > 0) {
    // console.log('rere')
    rangeStartDate = cacheData[rangeStartDate < rangeEndDate ? cacheData.length - 1 : 0].time / 1000
  }


  hisQuotation(
    {
      symbol: symbolInfo.ticker,
      startTimeStamp: rangeStartDate,
      endTimeStamp: rangeEndDate,
      step: this.getStepByResolution(resolution)
    }
  ).then((response) => {
    let { kLineList } = _.get(response, 'data.kLineData') || {}
    if (!kLineList || kLineList.length === 0) {   // if no newset data
      getServerTime().then((res) => {
        if (res.code === 200) {
          // save nextServerTime
          onHistoryCallback([], { noData: true })
        }
      })
      return
    }
    kLineList = kLineList.map(item => ({
      ...item,
      time: item.sTimeStamp * 1000,
    }))
    const endData = cacheData.concat(kLineList)
    // save the newest list to cache
    if (useCache) {
      cacheAll[symbolInfo.ticker + resolution] = endData
      Helper.setCache('tradeViewCache', cacheAll)
    }
    // console.log('endData', endData)
    onHistoryCallback(endData, { noData: false })
  })
};

// 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据。
Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
  this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
};

// 取消订阅K线数据。在调用subscribeBars方法时,图表库将跳过与subscriberUID相同的对象。
Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
  this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

// 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度。
Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (period, resolutionBack, intervalBack) {
  if(period == "1M"){
    return {
      resolutionBack:'M',
      intervalBack: 200,
    }
   } else  if(period == "1W"){
    return {
      resolutionBack:'Y',
      intervalBack: 5,
    }
  }
  if(period == "1D"){
      return {
        resolutionBack:'M',
        intervalBack: 12,
      }
  }else  if(period == "60"){
    return {
      resolutionBack:'D',
      intervalBack: 30,
    }
  }else  if(period == "15"){
    return {
      resolutionBack:'D',
      intervalBack: 0.5,
    }
  }else  if(period == "30"){
    return {
      resolutionBack:'D',
      intervalBack: 1,
    }
  }else  if(period == "5"){
    return {
      resolutionBack:'D',
      intervalBack: 0.25,
    }
  }else if(period == "1"){
    return {
      resolutionBack:'D',
      intervalBack: 0.1,
    }
  }
};


Datafeeds.DataPulseUpdater = function (datafeed) {
  this._datafeed = datafeed;
  this._subscriber = {};
};

Datafeeds.UDFCompatibleDatafeed.prototype.subcribeKline = function(solution){
  var that = this._barsPulseUpdater;
  reloadKline(this._symbolInfo.name,solution)
  Helper.onAction('reloadSymbolKline', ({list}) => {
    var subscriptionRecord = that._subscriber;
    if(subscriptionRecord && subscriptionRecord.symbolInfo){
      var resolution = subscriptionRecord.resolution;
      if (list.symbol == subscriptionRecord.symbolInfo.ticker && list.period == resolution) {
        var bar = {
          time: list.sTimeStamp * 1000,
          close: list.close,
          open: list.open,
          high: list.high,
          low: list.low,
          volume: list.volume,
          symbol: list.symbol,
          sTimeStamp: list.sTimeStamp,
          socketAdd: true,
        }
        subscriptionRecord.listener(bar);
        if (useCache) {
          // save to cache
          let cacheAll = Helper.getCache(`tradeViewCache`) || {}
          let cacheData = cacheAll[list.symbol + resolution] || []
          // save the newest list to chche
          cacheAll[list.symbol] = cacheData.concat([bar])
          Helper.setCache('tradeViewCache', cacheAll)
        }
      }
    }
  })
}


Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function (resolution, requiredPeriodsCount) {
  var daysCount = 0;

  if (resolution == "D") {
    daysCount = requiredPeriodsCount;
  }
  else if (resolution == "M") {
    daysCount = 31 * requiredPeriodsCount;
  }
  else if (resolution == "W") {
    daysCount = 7 * requiredPeriodsCount;
  }
  else {
    daysCount = requiredPeriodsCount * resolution / (24 * 60);
  }

  return daysCount * 24 * 60 * 60;
};

Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID,onResetCacheNeededCallback) {

  this._datafeed._logMessage("Subscribing " + listenerGUID);

  this._subscriber = {
    symbolInfo: symbolInfo,
    resolution: resolution,
    listener: onRealtimeCallback,
    dataCallback:onResetCacheNeededCallback
  };
};

Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {
  this._datafeed._logMessage("Unsubscribing " + listenerGUID);
  delete this._subscriber;
};


Datafeeds.UDFCompatibleDatafeed.prototype.getStepByResolution = function (resolution) {
  let step = parseFloat(resolution);
  let filter = resolution.toString().match(/[a-z]/i);

  if (isNaN(step)) {
    step = 1;
  }

  if (filter) {
    switch (filter[0].toUpperCase()) {
      case "D":
        step *= 24 * 60;
        break;
      case "W":
        step *= 7 * 24 * 60;
        break;
      case "M":
        step *= 30 * 24 * 60;
        break;
    }
  } else {
    step *= 1;
  }

  return step;
}

export default {
  UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed
};
