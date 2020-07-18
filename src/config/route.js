import i18n from '../language'
// specify the hierarchical relationship of the page
// to select the animation effect that moves forward and backward.
// if route' level less then 5
// the page will remove the Header
// brief speak, when target page's level is more then current page, the route will be push
// want know more detail about how to use it, please refer to @/lib/index.js of method jumpPage

// 路由层级规范
// 举例：从1跳转到5，路由push,页面动画slide-left
// 5到1,路由replace，动画slide-right
// 参考@/lib/index.js中的jumpPage方法，当层级小于5时页面不会有title
// 跳转到层级大页面默认都是push
// 跳转到小的或者相等都是replace
export const routeIndexConf = {
  '1': [
    'Market',
    'Home',
    'Transaction',
    'Account',
  ],
  '2': [
    'Login',
    'Register',
    'EmailRegister',
  ],
  '5': [
    'TradeDetail',
    'Search',
  ],
  '10': [
    'FundOrder',
    'FundDetail',
    'FundAccountLog',
    'FundAssert',
    'MyFund',
    'Orders',
    'Personal',
    'Safety',
    'Setting',
    'About',
    'Encrypt',
    'NoticeDetail',
    'Legal',
    'Invite',
    'withdrawAddress',
    'customer',
    'downapp',
    'Privilege',
    'OtcOrder',
    'OtcAssert',
    'AppealOrder',
  ],
  '20': [
    'IdentityOne',
    'IdentityTwo',
    'IdentityStatus',
    'Language',
    'ForgetPwdOne',
    'ExtractAddress',
    'Ht',
    'Phone',
    'Email',
    'ResetPwd',
    'InviteRecord',
    'FriendChargeRecord',
    'ResetTradePwd',
    'PrivilegeOpen',
    'Masex',
    'Upcoming',
    'Past',
    'Video',
  ],
  '30': [
    'HtRecharge',
    'Extract',
    'BindEmail',
    'BindPhone',
    'ForgetPwdTwo',
    'AddAddress',
  ],
  '40': [
    'Code',
    'HtEtcAddress',
    'History',
  ],
}
export const routeTitleConfig = i18n.t('route')
export const lazyRoute = {
  'TradeDetail': resolve => require(['@/views/TradeDetail'], resolve),
}
