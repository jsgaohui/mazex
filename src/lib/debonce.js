// 函数防抖
// 动态过滤socket推送的行情数据，动态合并收到2s后的同一个币种的行情更新
// ps 现有的socket推送问题很大，过于频繁的推送造成大量的性能消耗
// 该方法还未使用，可以忽略
// register a method for reloadQuotation, to filter some useless dispatch
// when a queue add, it will register a timer for it, when 2s pass, call the method and bind the newest data
// and then, clear the queue, wait for next que add

// depicts this example
// 'ETH': {
//   todo: [
//     {
//       data: {},
//       callback: () => {},
//     },
//   ],
//   timer: null,
// },

let queue = {}

export const addQueue = (data, callback) => {
  if (!queue[data.symbol]) {
    queue[data.symbol] = {
      todo: [],
      timer: null,
    }
  }
  let queue_now = queue[data.symbol]
  queue_now.todo.push({data, callback})
  // console.log('[debonce addQueue]', data.symbol)
  // register a timer, when queue add, check the timer, if has timer, just push in todos but not register a new timer
  if (!queue_now.timer) {
    queue_now.timer = setTimeout(() => {
      // remove timer
      queue_now.timer = null
      // if has no todo, do nothing
      if (queue_now.todo.length === 0) return
      // get the last todo
      let todo = queue_now.todo[queue_now.todo.length - 1]
      // delete all todo
      queue_now.todo = []
      // run callback
      todo.callback(todo.data)
    }, 2000)
  }
}