<template>
  <div class="new-layout">
    <!-- 左侧菜单栏 -->
    <div class="sidebar">
      <div class="logo-container">
        <div class="sidebar-logo">
          <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
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
          <i :class="getMenuIcon(menu.icon)" class="menu-icon"></i>
          <span class="menu-title">{{ menu.title }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="top-navbar">
        <div class="breadcrumb">
          <span class="current-page">{{ currentPageTitle }}</span>
        </div>
        <div class="user-info">
          <span class="username">{{ username }}</span>
          <el-dropdown @command="handleUserCommand">
            <span class="user-avatar">
              <i class="el-icon-user"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <!-- 页面内容区域 -->
      <div class="page-content">
        <div class="content-wrapper">
          <!-- 动态组件渲染 -->
          <component 
            :is="currentComponent" 
            v-if="currentComponent"
            :menu-data="currentMenuData"
            @menu-action="handleMenuAction"
          />
          
          <!-- 默认欢迎页面 -->
          <div v-else class="welcome-page">
            <div class="welcome-content">
              <h1>欢迎使用 RentPro 管理系统</h1>
              <p>请从左侧菜单选择要管理的功能模块</p>
              <div class="quick-stats">
                <div class="stat-card">
                  <div class="stat-number">{{ stats.totalUsers }}</div>
                  <div class="stat-label">用户总数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ stats.totalBuildings }}</div>
                  <div class="stat-label">楼盘总数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ stats.totalRooms }}</div>
                  <div class="stat-label">房源总数</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">{{ stats.totalContracts }}</div>
                  <div class="stat-label">合同总数</div>
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
import { mapState, mapActions } from 'vuex'
import Dashboard from '@/views/Dashboard/index.vue'
import UserManagement from '@/views/UserManagement/index.vue'
import RoleManagement from '@/views/RoleManagement/index.vue'
import BuildingManagement from '@/views/BuildingManagement/index.vue'
import RoomManagement from '@/views/RoomManagement/index.vue'
import TenantManagement from '@/views/TenantManagement/index.vue'
import ContractManagement from '@/views/ContractManagement/index.vue'

export default {
  name: 'NewLayout',
  components: {
    Dashboard,
    UserManagement,
    RoleManagement,
    BuildingManagement,
    RoomManagement,
    TenantManagement,
    ContractManagement
  },
  data() {
    return {
      activeMenu: null,
      currentComponent: null,
      currentMenuData: null,
      currentPageTitle: '欢迎页面',
      username: '管理员',
      stats: {
        totalUsers: 0,
        totalBuildings: 0,
        totalRooms: 0,
        totalContracts: 0
      }
    }
  },
  computed: {
    ...mapState({
      menus: state => state.menu.menus || []
    })
  },
  async mounted() {
    await this.loadMenus()
    await this.loadStats()
  },
  methods: {
    ...mapActions('menu', ['getUserMenus']),
    
    // 加载菜单数据
    async loadMenus() {
      try {
        await this.getUserMenus()
      } catch (error) {
        console.error('加载菜单失败:', error)
      }
    },
    
    // 加载统计数据
    async loadStats() {
      try {
        // 这里可以调用API获取统计数据
        this.stats = {
          totalUsers: 100,
          totalBuildings: 50,
          totalRooms: 200,
          totalContracts: 150
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },
    
    // 处理菜单点击
    handleMenuClick(menu) {
      this.activeMenu = menu.id
      this.currentPageTitle = menu.title
      this.currentMenuData = menu
      
      // 根据菜单名称设置对应的组件
      switch (menu.name) {
        case 'Dashboard':
          this.currentComponent = 'Dashboard'
          break
        case 'User':
          this.currentComponent = 'UserManagement'
          break
        case 'Role':
          this.currentComponent = 'RoleManagement'
          break
        case 'Building':
          this.currentComponent = 'BuildingManagement'
          break
        case 'Room':
          this.currentComponent = 'RoomManagement'
          break
        case 'Tenant':
          this.currentComponent = 'TenantManagement'
          break
        case 'Contract':
          this.currentComponent = 'ContractManagement'
          break
        default:
          this.currentComponent = null
      }
    },
    
    // 获取菜单图标
    getMenuIcon(icon) {
      const iconMap = {
        'dashboard': 'el-icon-s-data',
        'user': 'el-icon-user',
        'role': 'el-icon-s-check',
        'building': 'el-icon-office-building',
        'room': 'el-icon-house',
        'tenant': 'el-icon-s-custom',
        'contract': 'el-icon-document'
      }
      return iconMap[icon] || 'el-icon-menu'
    },
    
    // 处理用户命令
    handleUserCommand(command) {
      switch (command) {
        case 'profile':
          this.$message.info('个人资料功能开发中...')
          break
        case 'logout':
          this.$confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/login')
          })
          break
      }
    },
    
    // 处理菜单操作
    handleMenuAction(action, data) {
      console.log('菜单操作:', action, data)
      // 这里可以处理各种菜单操作
    }
  }
}
</script>

<style lang="less" scoped>
.new-layout {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
}

.sidebar {
  width: 240px;
  background: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .sidebar-logo {
    display: flex;
    align-items: center;
    
    .logo-img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }
    
    .sidebar-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
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
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s;
  border-right: 3px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: #1890ff;
    border-right-color: #fff;
    
    .menu-icon,
    .menu-title {
      color: #fff;
    }
  }
  
  .menu-icon {
    font-size: 18px;
    margin-right: 12px;
    color: rgba(255, 255, 255, 0.65);
  }
  
  .menu-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    transition: color 0.3s;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-navbar {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.breadcrumb {
  .current-page {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
  }
}

.user-info {
  display: flex;
  align-items: center;
  
  .username {
    margin-right: 12px;
    color: #595959;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1890ff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #40a9ff;
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
  padding: 60px 40px;
  text-align: center;
  
  .welcome-content {
    h1 {
      font-size: 32px;
      color: #262626;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 16px;
      color: #8c8c8c;
      margin-bottom: 48px;
    }
  }
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .stat-number {
    font-size: 32px;
    font-weight: 600;
    color: #1890ff;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #8c8c8c;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .page-content {
    padding: 16px;
  }
}
</style>
