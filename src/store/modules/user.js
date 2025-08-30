import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // 从后端返回的数据结构中获取token
        const { data } = response
        const token = data.token
        if (!token) {
          reject(new Error('登录失败：未获取到token'))
          return
        }
        commit('SET_TOKEN', token)
        setToken(token)
        
        // 将权限数据存储到sessionStorage中
        if (data.permissions) {
          console.log('存储权限数据 (data.permissions):', data.permissions)
          sessionStorage.setItem('permissions', JSON.stringify(data.permissions))
        } else if (data.user_info && data.user_info.permissions) {
          // 兼容不同的数据结构
          console.log('存储权限数据 (data.user_info.permissions):', data.user_info.permissions)
          sessionStorage.setItem('permissions', JSON.stringify(data.user_info.permissions))
        } else {
          console.warn('未找到权限数据')
        }
        
        // 将菜单数据存储到sessionStorage中
        if (data.menus) {
          console.log('存储菜单数据 (data.menus):', data.menus)
          sessionStorage.setItem('menus', JSON.stringify(data.menus))
        } else if (data.user_info && data.user_info.menus) {
          // 兼容不同的数据结构
          console.log('存储菜单数据 (data.user_info.menus):', data.user_info.menus)
          sessionStorage.setItem('menus', JSON.stringify(data.user_info.menus))
        } else {
          console.warn('未找到菜单数据')
        }
        
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 从后端返回的数据结构中获取用户信息
        const { data } = response

        if (!data) {
          reject(new Error('验证失败，请重新登录.'))
          return
        }
        
        // 适配后端字段名
        const roles = [data.role?.key || 'common']
        const name = data.nick_name || data.username
        const avatar = data.avatar || ''
        const permissions = data.permissions || []

        // 角色必须是非空数组
        if (!roles || roles.length <= 0) {
          reject(new Error('getInfo: 用户角色不能为空!'))
          return
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_PERMISSIONS', permissions)
        
        // 将权限数据存储到sessionStorage中
        if (permissions && permissions.length > 0) {
          sessionStorage.setItem('permissions', JSON.stringify(permissions))
        }
        
        // 将菜单数据存储到sessionStorage中
        if (data.menus) {
          sessionStorage.setItem('menus', JSON.stringify(data.menus))
        } else if (data.user_info && data.user_info.menus) {
          sessionStorage.setItem('menus', JSON.stringify(data.user_info.menus))
        }
        
        resolve({ roles, permissions })
      }).catch(error => {
        console.error('getInfo error:', error)
        reject(error)
      })
    })
  },

  // 用户登出
  logout({ commit, state }) {
    return new Promise((resolve) => {
      // 无论后端登出API是否成功，都要清除本地状态
      logout(state.token).then(() => {
        console.log('后端登出成功')
      }).catch(error => {
        console.warn('后端登出失败，但仍继续清除本地状态:', error)
      }).finally(() => {
        // 清除本地token和状态
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        // 清除sessionStorage中的菜单数据
        sessionStorage.removeItem('menus')
        resolve()
      })
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先移除token
      commit('RESET_STATE')
      // 清除sessionStorage中的数据
      sessionStorage.removeItem('menus')
      sessionStorage.removeItem('permissions')
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