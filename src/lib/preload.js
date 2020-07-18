// 图片预加载
import _ from 'lodash'
class PreLoad {
  constructor(arr) {
    this.arr = arr
  }
  init() {
    return new Promise((resolve, reject) => {
      if (!this.arr || !_.isArray(this.arr) || _.isEmpty(this.arr)) {
        // console.error('The preload image arr is not available!')
        reject()
        return
      }
      this.index = 0
      this.load(resolve, reject)
    })
  }
  load(resolve, reject) {
    if (this.index < this.arr.length) {
      this.loadImage(this.arr[this.index]).then(
        () => {
          this.index++
          this.load(resolve, reject)
        },
        (err) => {
          reject(err)
        }
      )
    } else {
      // console.log('preLoad complete!')
      resolve()
    }
  }
  loadImage(src) {
    return new Promise(function(resolve, reject) {
      let img = new Image()
      let setTime = setTimeout(() => {
        reject(new Error('Could not load image at ' + src))
      }, 6000)
      img.src = src
      img.onload = function() {
        // console.log(src + 'preload success')
        clearInterval(setTime)
        resolve()
      }
      img.onerror = function() {
        clearInterval(setTime)
        reject(new Error('Could not load image at ' + src))
      }
    })
  }
}
export default PreLoad
