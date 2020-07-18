// 此处只有socket用到了，ajax的url是页面url
const getHref = () => {
  let href = window.location.href
  return href.substr(0, href.indexOf('#') - 1)
}
const ISPRO = true
module.exports = {
  title: 'UDAX',
  getTarget() {
    return process.env.NODE_ENV === 'production' && ISPRO ? getHref() : 'http://192.168.1.162:8080'
  },
}
