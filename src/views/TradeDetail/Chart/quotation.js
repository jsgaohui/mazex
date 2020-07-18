import Helper from '@/lib'
export function hisQuotation(obj) {
  return Helper.ajax({
    url: '/app/quotation/hisQuotation.api',
    method: 'POST',
    params: obj,
  })
}
export function getServerTime() {
  return Helper.ajax({
    url: '/app/quotation/getServerTime.api',
    method: 'POST',
  })
}
