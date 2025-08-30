import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/api/auth/user-info',
    method: 'get'
  })
}

// 获取菜单数据
export function getMenu() {
  return request({
    url: '/api/auth/menus',
    method: 'get'
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/system/user',
    method: 'get',
    params
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(id, data) {
  return request({
    url: `/system/user/${id}`,
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/system/user/${id}`,
    method: 'delete'
  })
}

// 重置用户密码
export function resetUserPassword(id, data) {
  return request({
    url: `/system/user/${id}/reset-password`,
    method: 'post',
    data
  })
}