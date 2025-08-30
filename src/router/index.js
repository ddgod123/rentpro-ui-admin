import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

// 静态路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态添加
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'setting'
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index'),
        meta: {
          title: '用户管理',
          icon: 'user',
          permission: 'system:user:view'
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index'),
        meta: {
          title: '角色管理',
          icon: 'team',
          permission: 'system:role:view'
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index'),
        meta: {
          title: '菜单管理',
          icon: 'menu-unfold',
          permission: 'system:menu:view'
        }
      }
    ]
  },
  {
    path: '/rental',
    component: Layout,
    redirect: '/rental/building',
    name: 'Rental',
    meta: {
      title: '租赁管理',
      icon: 'apartment'
    },
    children: [
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/rental/building/index'),
        meta: {
          title: '楼盘管理',
          icon: 'bank',
          permission: 'rental:building:view'
        }
      },
      {
        path: 'room',
        name: 'Room',
        component: () => import('@/views/rental/room/index'),
        meta: {
          title: '房源管理',
          icon: 'home',
          permission: 'rental:room:view'
        }
      },
      {
        path: 'tenant',
        name: 'Tenant',
        component: () => import('@/views/rental/tenant/index'),
        meta: {
          title: '租客管理',
          icon: 'contacts',
          permission: 'rental:tenant:view'
        }
      },
      {
        path: 'contract',
        name: 'Contract',
        component: () => import('@/views/rental/contract/index'),
        meta: {
          title: '合同管理',
          icon: 'file-text',
          permission: 'rental:contract:view'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 解决Vue Router 3.x中的重定向警告和导航取消问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => {
    // 忽略导航重复和导航取消错误
    if (err.name !== 'NavigationDuplicated' && 
        err.name !== 'NavigationCancelled' && 
        !err.message.includes('cancelled')) {
      throw err
    }
  })
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => {
    // 忽略导航重复和导航取消错误
    if (err.name !== 'NavigationDuplicated' && 
        err.name !== 'NavigationCancelled' && 
        !err.message.includes('cancelled')) {
      throw err
    }
  })
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router