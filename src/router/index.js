import Vue from 'vue'
import VueRouter from 'vue-router'
import Helper from '@/lib/index.js'
import settingConfig from '@/config/setting'
import { routeTitleConfig, lazyRoute } from '../config/route'
import _ from 'lodash'

Vue.use(VueRouter)
// 去中心化引入views下的所有pages,并动态绑定到路由
// 从config/route里获取该页面的层级信息
// 从i18中获取路由的title
const routerFile = Helper.requireAll(require.context(`../views`, true, /\.vue$/))
const getRouteArr = (file, isChild = false) => _.map(
  file,
  (component, fileName) => ({
    path: (isChild ? '' : '/') + fileName.toLowerCase(),
    name: fileName,
    component: lazyRoute[fileName] ? lazyRoute[fileName] : component,
    meta: {
      title: routeTitleConfig[fileName] || settingConfig['title'],
    },
  })
)
export default new VueRouter({
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/home',
    },
  ].concat(getRouteArr(routerFile)),
})
