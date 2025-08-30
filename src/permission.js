import router from './router'
import store from './store'
import { Message } from 'ant-design-vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404', '/401'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  
  console.log('权限拦截器检查:', {
    to: to.path,
    from: from.path,
    hasToken: hasToken,
    tokenValue: getToken()
  })

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，重定向到主页
      next({ path: '/dashboard', replace: true })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          // Vue Router 3.5+ 使用 addRoute 替代 addRoutes
          if (router.addRoute) {
            console.log('开始添加动态路由，数量:', accessRoutes.length)
            for (const route of accessRoutes) {
              console.log('添加动态路由:', route.path)
              router.addRoute(route)
            }
            console.log('动态路由添加完成')
          } else {
            console.log('使用旧版addRoutes方法')
            router.addRoutes(accessRoutes)
          }

          // 等待路由添加完成
          await new Promise(resolve => setTimeout(resolve, 200))

          // 修复重定向循环问题
          // 检查目标路由是否已经被正确添加
          const toRoute = router.match(to.path)
          console.log('路由匹配检查:', {
            path: to.path,
            matched: toRoute.matched.length,
            toRoute: toRoute
          })
          
          if (toRoute.matched.length === 0) {
            // 如果路由未匹配，重定向到dashboard
            console.log('路由未匹配，重定向到dashboard')
            next({ path: '/dashboard', replace: true })
          } else {
            // 使用replace而不是next()避免循环重定向
            console.log('路由匹配成功，继续导航')
            next({ ...to, replace: true })
          }
        } catch (error) {
          // remove token and go to login page to re-login
          console.error('获取用户信息失败:', error)
          await store.dispatch('user/resetToken')
          const errorMessage = error?.message || error || '获取用户信息失败，请重新登录'
          Message.error(errorMessage)
          next(`/login?redirect=${encodeURIComponent(to.path)}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${encodeURIComponent(to.path)}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})