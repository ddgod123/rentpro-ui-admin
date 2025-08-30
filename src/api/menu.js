import request from '@/utils/request'

// 获取用户菜单
export function getUserMenus() {
  return request({
    url: '/api/menu/user-menus',
    method: 'get'
  })
}

// 获取所有菜单（管理员用）
export function getAllMenus() {
  return request({
    url: '/api/menu/all',
    method: 'get'
  })
}

// 根据ID获取菜单
export function getMenuById(id) {
  return request({
    url: `/api/menu/${id}`,
    method: 'get'
  })
}

// 创建菜单
export function createMenu(data) {
  return request({
    url: '/api/menu',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(id, data) {
  return request({
    url: `/api/menu/${id}`,
    method: 'put',
    data
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/api/menu/${id}`,
    method: 'delete'
  })
}

// 获取菜单路由配置
export function getMenuRoutes() {
  return request({
    url: '/api/menu/routes',
    method: 'get'
  })
}

// 获取菜单统计数据
export function getMenuStats() {
  return request({
    url: '/api/dashboard/stats',
    method: 'get'
  })
}
