# RentPro Admin UI

基于 Ant Design Vue 的租赁管理系统前端

## 项目简介

RentPro Admin UI 是一个现代化的租赁管理系统前端，使用 Vue.js 2.x + Ant Design Vue 构建，提供完整的租赁业务管理功能。

## 技术栈

### 前端框架
- **Vue.js 2.6.14** - 渐进式JavaScript框架
- **Vue Router 3.5.4** - 官方路由管理器
- **Vuex 3.6.2** - 状态管理模式

### UI框架
- **Ant Design Vue 1.7.8** - 企业级UI设计语言
- **Less** - CSS预处理器

### 开发工具
- **Vue CLI 5.0.4** - Vue.js开发工具
- **Webpack 5** - 模块打包工具
- **Babel** - JavaScript编译器
- **ESLint** - 代码质量检查工具

### 其他依赖
- **Axios 0.27.2** - HTTP客户端
- **Moment.js 2.29.4** - 日期处理库
- **js-cookie 3.0.5** - Cookie操作库
- **ECharts 5.4.2** - 数据可视化图表库

## 功能特性

### 🏢 租赁管理
- **楼盘管理** - 楼盘信息的增删改查
- **房源管理** - 房间信息管理
- **租客管理** - 租客信息维护
- **合同管理** - 租赁合同管理

### 👥 系统管理
- **用户管理** - 系统用户管理
- **角色管理** - 角色权限配置
- **菜单管理** - 系统菜单配置

### 🎨 界面特性
- **响应式设计** - 支持桌面和移动端
- **主题定制** - 支持Ant Design主题配置
- **国际化** - 支持多语言切换
- **权限控制** - 基于角色的权限管理

## 项目结构

```
rentpro-admin-ui/
├── public/                 # 静态资源
│   └── index.html         # HTML模板
├── src/
│   ├── api/               # API接口
│   │   └── user.js       # 用户相关API
│   ├── assets/           # 资源文件
│   ├── components/       # 公共组件
│   │   ├── Breadcrumb/   # 面包屑导航
│   │   ├── Hamburger/    # 汉堡菜单
│   │   ├── Pagination/   # 分页组件
│   │   └── Screenfull/   # 全屏组件
│   ├── directive/        # 自定义指令
│   │   └── permission/   # 权限指令
│   ├── layout/           # 布局组件
│   │   ├── components/   # 布局子组件
│   │   ├── mixin/        # 布局mixins
│   │   └── index.vue     # 主布局
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── store/            # Vuex状态管理
│   │   ├── modules/      # 状态模块
│   │   ├── getters.js    # 全局getters
│   │   └── index.js      # store入口
│   ├── styles/           # 样式文件
│   │   ├── index.less    # 主样式
│   │   ├── mixin.less    # 样式mixins
│   │   └── variables.less # 样式变量
│   ├── utils/            # 工具函数
│   │   ├── auth.js       # 认证工具
│   │   ├── request.js    # 请求封装
│   │   └── validate.js   # 验证工具
│   ├── views/            # 页面组件
│   │   ├── dashboard/    # 仪表板
│   │   ├── login/        # 登录页
│   │   ├── system/       # 系统管理
│   │   └── rental/       # 租赁管理
│   ├── App.vue           # 根组件
│   ├── main.js           # 应用入口
│   ├── permission.js     # 权限控制
│   └── settings.js       # 应用配置
├── babel.config.js       # Babel配置
├── vue.config.js         # Vue CLI配置
├── package.json          # 项目依赖
└── README.md            # 项目说明
```

## 快速开始

### 环境要求
- Node.js 14.0+
- npm 6.0+

### 安装依赖
```bash
npm install --legacy-peer-deps
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 http://localhost:9528 启动

### 构建生产版本
```bash
npm run build
```

## 配置说明

### 环境配置
- 开发环境：`http://localhost:9528`
- API代理：`http://localhost:8002/api`

### 主题配置
在 `vue.config.js` 中可以配置 Ant Design 主题变量：
```javascript
modifyVars: {
  'primary-color': '#1890ff',
  'success-color': '#52c41a',
  // ... 更多主题变量
}
```

## 开发指南

### 新增页面
1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 根据需要添加到侧边栏菜单

### 新增API
1. 在 `src/api/` 下创建对应的API文件
2. 使用 `src/utils/request.js` 中的封装方法

### 权限控制
使用 `v-permission` 指令控制元素显示：
```vue
<a-button v-permission="['admin']">管理员可见</a-button>
```

## 与后端集成

### API接口规范
- 基础URL：`/api`
- 认证方式：Bearer Token
- 响应格式：
```json
{
  "code": 200,
  "data": {},
  "msg": "success"
}
```

### 后端项目
配合 `rentpro-admin` 后端项目使用，确保后端服务运行在 `http://localhost:8000`

## 许可证

MIT License

## 更新日志

### v1.0.0 (2024-08-28)
- 🎉 初始版本发布
- ✨ 完整的租赁管理功能模块
- 🎨 基于 Ant Design Vue 的现代化界面
- 🔐 完整的权限管理系统
# rentpro-ui-admin
>>>>>>> fb451b6da14e96a46ccbe3401f1099e62d2e322e
- 📱 响应式设计支持
=======
# rentpro-ui-admin
>>>>>>> fb451b6da14e96a46ccbe3401f1099e62d2e322e
