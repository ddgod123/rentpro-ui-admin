import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

// 根据用户权限过滤路由
export function filterAsyncRoutes(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    
    // 检查路由权限
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

// 检查是否有权限
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permission) {
    return permissions.includes(route.meta.permission)
  } else {
    return true
  }
}

// 将后端菜单数据转换为路由格式
export function convertMenuToRoutes(menus) {
  const routes = []
  
  // 确保menus是数组
  if (!Array.isArray(menus)) {
    console.warn('菜单数据不是数组格式:', menus)
    return routes
  }
  
  // 递归处理菜单数据
  function processMenu(menu) {
    // 忽略按钮类型的菜单
    if (menu.type === 'F') {
      return null
    }
    
    // 构建路由对象
    const route = {
      path: menu.path,
      name: menu.name,
      component: Layout, // 所有菜单项都使用Layout组件
      meta: {
        title: menu.title,
        icon: menu.icon,
        permission: menu.permission
      }
    }
    
    // 处理子菜单
    if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
      const children = menu.children.map(processMenu).filter(child => child !== null)
      if (children.length > 0) {
        route.children = children
      }
    }
    
    return route
  }
  
  // 处理所有菜单项
  menus.forEach(menu => {
    const route = processMenu(menu)
    if (route) {
      routes.push(route)
    }
  })
  
  console.log('生成的动态路由:', routes)
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    console.log('SET_ROUTES called with:', routes)
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    console.log('Final routes:', state.routes)
  },
  CLEAR_ROUTES: (state) => {
    console.log('CLEAR_ROUTES called')
    state.addRoutes = []
    state.routes = constantRoutes
    console.log('Routes cleared, current routes:', state.routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      console.log('generateRoutes called with roles:', roles)
      
      // 从sessionStorage获取菜单数据
      const menusStr = sessionStorage.getItem('menus')
      console.log('menus from sessionStorage (raw):', menusStr)
      
      let menus = []
      try {
        menus = JSON.parse(menusStr || '[]')
      } catch (error) {
        console.error('解析菜单数据失败:', error)
        menus = []
      }
      
      console.log('menus from sessionStorage (parsed):', menus)
      
      // 将后端菜单数据转换为路由格式
      const accessedRoutes = convertMenuToRoutes(menus)
      console.log('accessedRoutes:', accessedRoutes)
      
      // 确保路由被正确添加
      if (accessedRoutes && accessedRoutes.length > 0) {
        console.log('成功生成动态路由，数量:', accessedRoutes.length)
        commit('SET_ROUTES', accessedRoutes)
      } else {
        console.warn('没有生成任何动态路由')
        commit('SET_ROUTES', [])
      }
      
      resolve(accessedRoutes)
    })
  },

  // 清理路由状态
  clearRoutes({ commit }) {
    return new Promise(resolve => {
      console.log('clearRoutes called')
      commit('CLEAR_ROUTES')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}