import axios from 'axios'
import { Message, Modal } from 'ant-design-vue'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API !== undefined ? process.env.VUE_APP_BASE_API : '/api', // api 的 base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true // 跨域请求时发送 cookies
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = getToken()
    console.log('Request拦截器 - Token检查:', {
      hasStoreToken: !!store.getters.token,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'null',
      url: config.url
    })
    
    if (token) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + token
      console.log('已添加Authorization头:', config.headers['Authorization'].substring(0, 30) + '...')
    } else {
      console.warn('Token为空，无法添加Authorization头')
    }
    return config
  },
  error => {
    // 请求错误处理
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    console.log('Response拦截器 - 原始响应:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      url: response.config?.url
    })
    
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    console.log('Response拦截器 - 响应数据:', res)
    console.log('Response拦截器 - 响应code:', res.code)

    // 如果自定义代码不是200，则将其判断为错误。
    if (res.code !== 200) {
      const errorMessage = res.msg || res.message || '请求失败，请重试'
      console.error('Response拦截器 - 业务错误:', {
        code: res.code,
        message: errorMessage,
        fullResponse: res
      })
      Message.error({
        message: errorMessage,
        duration: 5 * 1000
      })

      // 50008: 非法的token; 50012: 其他客户端登录了; 50014: Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        Modal.confirm({
          title: '确认登出',
          content: '你已被登出，可以取消继续留在该页面，或者重新登录',
          okText: '重新登录',
          cancelText: '取消',
          onOk() {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }
        })
      }
      return Promise.reject(new Error(errorMessage))
    } else {
      console.log('Response拦截器 - 成功响应，返回数据:', res)
      return res
    }
  },
  error => {
    console.log('HTTP Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config
    })
    
    let { message } = error
    if (message === 'Network Error') {
      message = '网络连接异常，请检查网络连接'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      const code = message.substr(message.length - 3)
      if (code === '500') {
        message = '服务器内部错误，请稍后重试或联系管理员'
      } else if (code === '404') {
        message = '请求的接口不存在，请检查请求地址'
      } else if (code === '403') {
        message = '没有权限访问该资源'
      } else {
        message = `系统接口${code}异常`
      }
    }
    
    // 如果是500错误，添加更详细的错误信息
    if (error.response?.status === 500 && error.response?.data?.msg) {
      message = `服务器错误: ${error.response.data.msg}`
    }
    
    Message.error({
      message,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service