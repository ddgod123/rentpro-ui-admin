import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import '@/styles/index.less'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/zh-cn'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission'
import './permission'

// 最简单的Ant Design Vue导入方式
const Antd = require('ant-design-vue')
require('ant-design-vue/dist/antd.css')

// 注册Ant Design Vue
Vue.use(Antd)

// 配置Vue
Vue.use(permission)
Vue.component('Pagination', Pagination)

// 配置moment
moment.locale('zh-cn')

// 全局方法挂载
Vue.prototype.$http = axios
Vue.prototype.$moment = moment

// 全局消息提示方法
Vue.prototype.$msgSuccess = function(msg) {
  this.$message.success(msg)
}

Vue.prototype.$msgError = function(msg) {
  this.$message.error(msg)
}

Vue.prototype.$msgInfo = function(msg) {
  this.$message.info(msg)
}

Vue.prototype.$msgWarning = function(msg) {
  this.$message.warning(msg)
}

Vue.config.productionTip = false

console.info('欢迎使用RentPro Admin，这是基于Ant Design Vue的租赁管理系统前端')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')