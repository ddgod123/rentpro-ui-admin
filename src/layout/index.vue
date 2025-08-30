<template>
  <div class="app-wrapper">
    <!-- 左侧菜单栏 -->
    <div class="sidebar-container">
      <div class="logo-container">
        <div class="sidebar-logo">
          <span class="sidebar-title">RentPro Admin</span>
        </div>
      </div>
      
      <!-- 菜单列表 -->
      <div class="menu-container">
        <div 
          v-for="menu in menus" 
          :key="menu.id"
          class="menu-item"
          :class="{ active: activeMenu === menu.id }"
          @click="handleMenuClick(menu)"
        >
          <a-icon :type="getMenuIcon(menu.icon)" class="menu-icon" />
          <span class="menu-title">{{ menu.title }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="top-navbar">
        <div class="breadcrumb">
          <span class="current-page">{{ currentPageTitle }}</span>
        </div>
        <div class="user-info">
          <span class="username">{{ username }}</span>
          
          <!-- 测试按钮 -->
          <a-button @click="testLogout" style="margin-right: 10px;" type="primary" size="small">
            测试退出
          </a-button>
          
          <!-- 直接退出按钮 -->
          <a-button @click="directLogout" style="margin-right: 10px;" type="danger" size="small">
            直接退出
          </a-button>
          
          <a-dropdown>
            <span class="user-avatar">
              <a-icon type="user" />
            </span>
            <template #overlay>
              <a-menu @click="handleUserCommand">
                <a-menu-item key="profile">个人资料</a-menu-item>
                <a-menu-item key="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

      <!-- 页面内容区域 -->
      <div class="page-content">
        <div class="content-wrapper">
          <!-- 动态组件显示 -->
          <component 
            :is="currentComponent" 
            v-if="currentComponent"
            :menuData="currentMenu"
          />
          <!-- 默认欢迎页面 -->
          <div v-else class="welcome-page">
            <div class="welcome-content">
              <h1>欢迎使用 RentPro 管理系统</h1>
              <p>请从左侧菜单选择要管理的功能模块</p>
              <div class="quick-stats">
                <div class="stat-item">
                  <div class="stat-number">3</div>
                  <div class="stat-label">楼盘总数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">120</div>
                  <div class="stat-label">房间总数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">85</div>
                  <div class="stat-label">已租房间</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">35</div>
                  <div class="stat-label">空置房间</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 移除未使用的导入

export default {
  name: 'Layout',
  data() {
    return {
      activeMenu: null,
      currentPageTitle: '欢迎页面',
      username: '管理员',
      currentComponent: null,
      currentMenu: null,
      menus: [
        { id: 1, name: 'Dashboard', title: '仪表板', icon: 'dashboard', path: '/dashboard', component: 'Dashboard' },
        { id: 2, name: 'User', title: '用户管理', icon: 'user', path: '/system/user', component: 'UserManagement' },
        { id: 3, name: 'Role', title: '角色管理', icon: 'safety-certificate', path: '/system/role', component: 'RoleManagement' },
        { id: 4, name: 'Building', title: '楼盘管理', icon: 'bank', path: '/rental/building', component: 'BuildingManagement' },
        { id: 5, name: 'Room', title: '房源管理', icon: 'home', path: '/rental/room', component: 'RoomManagement' },
        { id: 6, name: 'Tenant', title: '租客管理', icon: 'team', path: '/rental/tenant', component: 'TenantManagement' },
        { id: 7, name: 'Contract', title: '合同管理', icon: 'file-text', path: '/rental/contract', component: 'ContractManagement' }
      ],
      // 预定义组件映射
      componentMap: {
        'Dashboard': () => import('@/views/dashboard/index.vue'),
        'UserManagement': () => import('@/views/UserManagement/index.vue'),
        'RoleManagement': () => import('@/views/RoleManagement/index.vue'),
        'BuildingManagement': () => import('@/views/BuildingManagement/index.vue'),
        'RoomManagement': () => import('@/views/RoomManagement/index.vue'),
        'TenantManagement': () => import('@/views/TenantManagement/index.vue'),
        'ContractManagement': () => import('@/views/ContractManagement/index.vue'),
        // 系统管理组件
        'system-user': () => import('@/views/system/user/index.vue'),
        'system-role': () => import('@/views/system/role/index.vue'),
        'system-menu': () => import('@/views/system/menu/index.vue'),
        // 租赁管理组件
        'rental-building': () => import('@/views/rental/building/index.vue'),
        'rental-room': () => import('@/views/rental/room/index.vue'),
        'rental-tenant': () => import('@/views/rental/tenant/index.vue'),
        'rental-contract': () => import('@/views/rental/contract/index.vue')
      }
    }
  },
  computed: {
    // 移除未使用的computed属性
  },
  async mounted() {
    console.log('Layout组件mounted')
    
    try {
      // 等待用户信息和权限加载完成后再加载菜单
      await this.$nextTick()
      await this.loadMenus()
      
      // 根据当前路由加载对应组件
      const currentPath = this.$route.path
      console.log('mounted时加载当前路由组件:', currentPath)
      this.loadComponentByRoute(currentPath)
      
      this.setActiveMenu()
    } catch (error) {
      console.error('Layout组件mounted失败:', error)
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        console.log('路由变化:', { from: from?.path, to: to.path })
        
        // 延迟加载组件，确保路由状态完全准备好
        this.$nextTick(() => {
          this.loadComponentByRoute(to.path)
          this.setActiveMenu()
        })
      },
      immediate: true
    }
  },
  methods: {
    // 加载菜单数据
    async loadMenus() {
      try {
        // 从sessionStorage获取菜单数据
        const menusStr = sessionStorage.getItem('menus')
        if (menusStr) {
          const menus = JSON.parse(menusStr)
          console.log('从sessionStorage加载菜单:', menus)
          
          // 转换菜单格式以匹配前端需求
          this.menus = menus.map(menu => ({
            id: menu.id,
            name: menu.name,
            title: menu.title,
            icon: this.mapIconName(menu.icon),
            path: menu.path,
            component: this.mapComponentName(menu.name)
          }))
        } else {
          console.log('sessionStorage中没有菜单数据，使用默认菜单')
          // 使用默认菜单作为后备
          this.menus = [
            { id: 1, name: 'Dashboard', title: '仪表板', icon: 'dashboard', path: '/dashboard', component: 'Dashboard' },
            { id: 2, name: 'User', title: '用户管理', icon: 'user', path: '/system/user', component: 'UserManagement' },
            { id: 3, name: 'Role', title: '角色管理', icon: 'safety-certificate', path: '/system/role', component: 'RoleManagement' },
            { id: 4, name: 'Building', title: '楼盘管理', icon: 'bank', path: '/rental/building', component: 'BuildingManagement' },
            { id: 5, name: 'Room', title: '房源管理', icon: 'home', path: '/rental/room', component: 'RoomManagement' },
            { id: 6, name: 'Tenant', title: '租客管理', icon: 'team', path: '/rental/tenant', component: 'TenantManagement' },
            { id: 7, name: 'Contract', title: '合同管理', icon: 'file-text', path: '/rental/contract', component: 'ContractManagement' }
          ]
        }
      } catch (error) {
        console.error('加载菜单失败:', error)
        // 使用默认菜单作为后备
        this.menus = [
          { id: 1, name: 'Dashboard', title: '仪表板', icon: 'dashboard', path: '/dashboard', component: 'Dashboard' },
          { id: 2, name: 'User', title: '用户管理', icon: 'user', path: '/system/user', component: 'UserManagement' },
          { id: 3, name: 'Role', title: '角色管理', icon: 'safety-certificate', path: '/system/role', component: 'RoleManagement' },
          { id: 4, name: 'Building', title: '楼盘管理', icon: 'bank', path: '/rental/building', component: 'BuildingManagement' },
          { id: 5, name: 'Room', title: '房源管理', icon: 'home', path: '/rental/room', component: 'RoomManagement' },
          { id: 6, name: 'Tenant', title: '租客管理', icon: 'team', path: '/rental/tenant', component: 'TenantManagement' },
          { id: 7, name: 'Contract', title: '合同管理', icon: 'file-text', path: '/rental/contract', component: 'ContractManagement' }
        ]
      }
    },
    
    // 设置当前激活的菜单
    setActiveMenu() {
      const currentPath = this.$route.path
      console.log('设置激活菜单，当前路径:', currentPath)
      
      // 查找对应的菜单
      const menu = this.menus.find(m => m.path === currentPath)
      if (menu) {
        console.log('找到对应菜单:', menu)
        this.activeMenu = menu.id
        this.currentPageTitle = menu.title
      } else {
        console.log('未找到对应菜单，尝试模糊匹配')
        // 尝试模糊匹配，处理嵌套路由
        const matchedMenu = this.menus.find(m => currentPath.startsWith(m.path) || m.path.startsWith(currentPath))
        if (matchedMenu) {
          console.log('模糊匹配到菜单:', matchedMenu)
          this.activeMenu = matchedMenu.id
          this.currentPageTitle = matchedMenu.title
        } else {
          console.log('未找到匹配菜单，使用默认值')
          this.activeMenu = null
          this.currentPageTitle = '未知页面'
        }
      }
    },
    
    // 处理菜单点击
    async handleMenuClick(menu) {
      console.log('菜单点击:', menu)
      console.log('菜单详细信息:', {
        id: menu.id,
        title: menu.title,
        path: menu.path,
        component: menu.component,
        name: menu.name,
        icon: menu.icon
      })
      this.activeMenu = menu.id
      this.currentPageTitle = menu.title
      this.currentMenu = menu
      
      try {
        // 先导航到目标路由
        console.log('跳转路由:', menu.path)
        await this.$router.push(menu.path)
        
        // 等待路由变化完成后再加载组件
        await this.$nextTick()
        
        // 使用新的组件加载方法
        this.loadComponentByMenu(menu)
        
      } catch (error) {
        console.error('加载组件失败:', error)
        this.$message.error('加载页面失败')
        
        // 如果组件加载失败，回退到仪表板
        this.currentComponent = this.componentMap['Dashboard']
        this.currentPageTitle = '仪表板'
        this.activeMenu = 1
      }
    },
    
    // 获取菜单图标
    getMenuIcon(icon) {
      const iconMap = {
        dashboard: 'dashboard',
        user: 'user',
        'safety-certificate': 'safety-certificate',
        bank: 'bank',
        home: 'home',
        team: 'team',
        'file-text': 'file-text'
      }
      return iconMap[icon] || 'menu'
    },

    // 映射图标名称
    mapIconName(iconName) {
      const iconMap = {
        'dashboard': 'dashboard',
        'user': 'user',
        'role': 'safety-certificate',
        'building': 'bank',
        'room': 'home',
        'tenant': 'team',
        'contract': 'file-text'
      }
      return iconMap[iconName] || 'menu'
    },

    // 映射组件名称
    mapComponentName(menuName) {
      const componentMap = {
        'Dashboard': 'Dashboard',
        'User': 'UserManagement',
        'Role': 'RoleManagement',
        'Building': 'BuildingManagement',
        'Room': 'RoomManagement',
        'Tenant': 'TenantManagement',
        'Contract': 'ContractManagement'
      }
      return componentMap[menuName] || 'Dashboard'
    },

    // 根据路由路径加载对应的组件
    async loadComponentByRoute(path) {
      console.log('根据路由加载组件:', path)
      
      // 检查路由是否已经被正确添加
      const route = this.$router.resolve(path)
      console.log('路由解析结果:', route)
      
      // 如果路由没有匹配到，等待一下再重试
      if (route && route.matched && route.matched.length === 0) {
        console.log('路由未匹配，等待路由添加完成...')
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 重新检查路由
        const retryRoute = this.$router.resolve(path)
        console.log('重试路由解析结果:', retryRoute)
        
        if (retryRoute && retryRoute.matched && retryRoute.matched.length === 0) {
          console.warn('路由仍然未匹配，使用默认组件')
          this.currentComponent = this.componentMap['Dashboard']
          this.currentPageTitle = '仪表板'
          return
        }
      }
      
      // 确保菜单数据已加载
      if (!this.menus || this.menus.length === 0) {
        console.log('菜单数据未加载，等待加载完成...')
        await this.loadMenus()
      }
      
      // 查找对应的菜单
      const menu = this.menus.find(m => m.path === path)
      if (menu) {
        console.log('找到对应菜单:', menu)
        this.currentMenu = menu
        this.currentPageTitle = menu.title
        this.activeMenu = menu.id
        
        // 加载对应的组件
        this.loadComponentByMenu(menu)
      } else {
        console.log('未找到对应菜单，尝试从路由配置加载')
        // 尝试从路由配置加载组件
        this.loadComponentFromRoute(path)
      }
    },

    // 从路由配置加载组件
    loadComponentFromRoute(path) {
      console.log('从路由配置加载组件:', path)
      console.log('当前componentMap:', Object.keys(this.componentMap))
      
      // 根据路径映射到对应的组件
      let componentKey = null
      let pageTitle = '未知页面'
      
      if (path === '/dashboard') {
        componentKey = 'Dashboard'
        pageTitle = '仪表板'
      } else if (path.startsWith('/system/')) {
        if (path === '/system/user') {
          componentKey = 'system-user'
          pageTitle = '用户管理'
        } else if (path === '/system/role') {
          componentKey = 'system-role'
          pageTitle = '角色管理'
        } else if (path === '/system/menu') {
          componentKey = 'system-menu'
          pageTitle = '菜单管理'
        }
      } else if (path.startsWith('/rental/')) {
        if (path === '/rental/building') {
          componentKey = 'rental-building'
          pageTitle = '楼盘管理'
        } else if (path === '/rental/room') {
          componentKey = 'rental-room'
          pageTitle = '房源管理'
        } else if (path === '/rental/tenant') {
          componentKey = 'rental-tenant'
          pageTitle = '租客管理'
        } else if (path === '/rental/contract') {
          componentKey = 'rental-contract'
          pageTitle = '合同管理'
        }
      }
      
      console.log('映射结果 - componentKey:', componentKey, 'pageTitle:', pageTitle)
      
      if (componentKey && this.componentMap[componentKey]) {
        console.log('成功加载组件:', componentKey)
        this.currentComponent = this.componentMap[componentKey]
        this.currentPageTitle = pageTitle
        this.currentMenu = { title: pageTitle, path: path }
      } else {
        console.warn('未找到对应组件，使用默认组件。componentKey:', componentKey, 'componentMap:', this.componentMap)
        this.currentComponent = this.componentMap['Dashboard']
        this.currentPageTitle = '仪表板'
        this.currentMenu = { title: '仪表板', path: '/dashboard' }
      }
    },

    // 根据菜单加载组件
    loadComponentByMenu(menu) {
      console.log('根据菜单加载组件:', menu)
      
      if (!menu) {
        console.warn('菜单对象为空，使用默认组件')
        this.currentComponent = this.componentMap['Dashboard']
        return
      }
      
      // 尝试多种方式映射组件
      let componentKey = null
      
      // 方式1: 直接使用 component 字段
      if (menu.component && this.componentMap[menu.component]) {
        componentKey = menu.component
        console.log('通过component字段找到组件:', componentKey)
      }
      // 方式2: 通过菜单名称映射
      else if (menu.title && this.componentMap[menu.title]) {
        componentKey = menu.title
        console.log('通过title字段找到组件:', componentKey)
      }
      // 方式3: 通过路径映射
      else if (menu.path) {
        const pathMap = {
          '/dashboard': 'Dashboard',
          '/rental/building': 'rental-building',
          '/rental/room': 'rental-room',
          '/rental/tenant': 'rental-tenant',
          '/rental/contract': 'rental-contract',
          '/system/user': 'system-user',
          '/system/role': 'system-role',
          '/system/menu': 'system-menu'
        }
        
        if (pathMap[menu.path]) {
          componentKey = pathMap[menu.path]
          console.log('通过path字段找到组件:', componentKey)
        }
      }
      
      // 加载组件
      if (componentKey && this.componentMap[componentKey]) {
        console.log('加载组件:', componentKey)
        this.currentComponent = this.componentMap[componentKey]
      } else {
        console.warn('未找到对应组件，使用默认组件。菜单信息:', {
          component: menu.component,
          title: menu.title,
          path: menu.path
        })
        // 回退到默认组件
        this.currentComponent = this.componentMap['Dashboard']
      }
    },
    
    // 测试退出方法
    testLogout() {
      console.log('测试退出按钮被点击')
      
      // 显示确认对话框
      this.$confirm({
        title: '测试退出功能',
        content: '这是测试退出按钮，点击确定将跳转到登录页',
        okText: '确定',
        cancelText: '取消',
        type: 'info',
        onOk: async () => {
          console.log('测试退出确认')
          
          try {
            // 清理当前状态
            this.currentComponent = null
            this.currentMenu = null
            this.activeMenu = null
            this.currentPageTitle = '欢迎页面'
            
            // 清除Vuex状态
            await this.$store.dispatch('user/logout')
            await this.$store.dispatch('permission/clearRoutes')
            
            // 清除本地存储
            localStorage.clear()
            sessionStorage.clear()
            
            // 清除cookie
            document.cookie = 'Admin-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            
            // 显示成功消息
            this.$message.success('测试退出成功！')
            
            // 直接跳转到登录页并刷新页面，确保所有状态都是全新的
            setTimeout(() => {
              window.location.href = '/login'
            }, 1000)
          } catch (error) {
            console.error('测试退出过程中发生错误:', error)
            this.$message.error('测试退出失败，请重试')
          }
        },
        onCancel: () => {
          console.log('测试退出取消')
          this.$message.info('已取消测试退出')
        }
      })
    },
    
    // 直接退出方法（不显示确认对话框）
    async directLogout() {
      console.log('直接退出按钮被点击')
      
      try {
        // 清理当前状态
        this.currentComponent = null
        this.currentMenu = null
        this.activeMenu = null
        this.currentPageTitle = '欢迎页面'
        
        // 清除Vuex状态
        await this.$store.dispatch('user/logout')
        await this.$store.dispatch('permission/clearRoutes')
        
        // 清除本地存储
        localStorage.clear()
        sessionStorage.clear()
        
        // 清除cookie
        document.cookie = 'Admin-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        
        // 显示成功消息
        this.$message.success('退出成功！')
        
                        // 直接跳转到登录页并刷新页面，确保所有状态都是全新的
                window.location.href = '/login'
      } catch (error) {
        console.error('直接退出过程中发生错误:', error)
        this.$message.error('退出失败，请重试')
      }
    },
    
    // 处理用户命令
    handleUserCommand({ key }) {
      console.log('handleUserCommand被调用，key:', key)
      
      switch (key) {
        case 'profile':
          console.log('处理个人资料')
          this.$message.info('个人资料功能开发中...')
          break
        case 'logout':
          console.log('=== 退出按钮被点击了！===')
          
          // 显示确认对话框
          this.$confirm({
            title: '确认退出',
            content: '确定要退出登录吗？',
            okText: '确定',
            cancelText: '取消',
            type: 'warning',
            onOk: async () => {
              console.log('用户确认退出')
              
              try {
                // 清理当前状态
                this.currentComponent = null
                this.currentMenu = null
                this.activeMenu = null
                this.currentPageTitle = '欢迎页面'
                
                // 清除Vuex状态
                await this.$store.dispatch('user/logout')
                await this.$store.dispatch('permission/clearRoutes')
                
                // 清除本地存储
                localStorage.clear()
                sessionStorage.clear()
                
                // 清除cookie
                document.cookie = 'Admin-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                
                // 显示成功消息
                this.$message.success('退出成功！')
                
                // 直接跳转到登录页并刷新页面，确保所有状态都是全新的
                setTimeout(() => {
                  window.location.href = '/login'
                }, 1000)
              } catch (error) {
                console.error('退出过程中发生错误:', error)
                this.$message.error('退出失败，请重试')
              }
            },
            onCancel: () => {
              console.log('用户取消退出')
              this.$message.info('已取消退出')
            }
          })
          break
        default:
          console.log('未知的命令:', key)
          break
      }
    },
    
  }
}
</script>

<style lang="less" scoped>
@import "~@/styles/mixin.less";

.app-wrapper {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
}

.sidebar-container {
  width: 256px;
  background: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  flex-shrink: 0;
  position: relative;
}

.logo-container {
  height: 64px;
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #303030;
  background: #002140;
  
  .sidebar-logo {
    .sidebar-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      line-height: 32px;
    }
  }
}

.menu-container {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  margin: 4px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  
  &:hover {
    background: #1890ff;
    color: #fff;
    
    .menu-icon,
    .menu-title {
      color: #fff;
    }
  }
  
  &.active {
    background: #1890ff;
    color: #fff;
    
    .menu-icon,
    .menu-title {
      color: #fff;
    }
    
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 16px;
      background: #fff;
      border-radius: 2px 0 0 2px;
    }
  }
  
  .menu-icon {
    margin-right: 12px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    transition: color 0.3s;
  }
  
  .menu-title {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.65);
    transition: color 0.3s;
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-navbar {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.breadcrumb {
  .current-page {
    font-size: 16px;
    font-weight: 500;
    color: #262626;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .username {
    font-size: 14px;
    color: #595959;
    font-weight: 400;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #d9d9d9;
    
    &:hover {
      background: #e6f7ff;
      color: #1890ff;
      border-color: #91d5ff;
    }
    
    .anticon {
      font-size: 16px;
    }
  }
}

.page-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.content-wrapper {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  min-height: calc(100vh - 112px);
}

.welcome-page {
  text-align: center;
  padding: 80px 20px;
  
  .welcome-content {
    max-width: 800px;
    margin: 0 auto;
    
    h1 {
      font-size: 38px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    
    p {
      font-size: 16px;
      color: #8c8c8c;
      margin-bottom: 48px;
      line-height: 1.6;
    }
    
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 24px;
      margin-top: 48px;
      
      .stat-item {
        padding: 32px 24px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(0, 0, 0, 0.02);
        border: 1px solid #f0f0f0;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04), 0 3px 6px rgba(0, 0, 0, 0.03);
          border-color: #d9d9d9;
        }
        
        .stat-number {
          font-size: 36px;
          font-weight: 600;
          color: #1890ff;
          margin-bottom: 8px;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 14px;
          color: #8c8c8c;
          font-weight: 400;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar-container {
    width: 200px;
}

.main-container {
    .top-navbar {
      padding: 0 16px;
    }
    
    .page-content {
      padding: 16px;
    }
  }
}
</style>