import axios from 'axios'
import { Message, Modal } from 'ant-design-vue'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api', // api 的 base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true // 跨域请求时发送 cookies
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    if (store.getters.token) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
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
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data

    // 如果自定义代码不是200，则将其判断为错误。
    if (res.code !== 200) {
      Message.error({
        message: res.msg || 'Error',
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
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    let { message } = error
    if (message === 'Network Error') {
      message = '网络连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      const code = message.substr(message.length - 3)
      message = '系统接口' + code + '异常'
    }
    Message.error({
      message,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service