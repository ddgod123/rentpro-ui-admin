<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <a-tooltip title="全屏" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </a-tooltip>
        
        <!-- 直接显示的退出按钮 -->
        <a-tooltip title="退出登录" placement="bottom">
          <div class="right-menu-item hover-effect logout-btn" @click="logout" style="display: inline-flex !important;">
            <a-icon type="logout" style="font-size: 16px; color: #f56a00;" />
          </div>
        </a-tooltip>
      </template>

      <a-dropdown class="avatar-container" placement="bottomRight">
        <div class="avatar-wrapper">
          <a-avatar :src="avatar || 'https://gitee.com/assets/no_portrait.png'" />
          <span class="user-name">{{ name || 'Admin' }}</span>
          <i class="ant-icon ant-icon-down" />
        </div>
        <a-menu slot="overlay" class="user-dropdown">
          <router-link to="/profile/index">
            <a-menu-item key="Profile">
              <a-icon type="user" />
              个人中心
            </a-menu-item>
          </router-link>
          <a-menu-divider />
          <a-menu-item key="logout" @click="logout">
            <a-icon type="logout" />
            退出登录
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'avatar',
      'name'
    ])
  },
  mounted() {
    // 添加调试信息，检查用户信息是否正确获取
    console.log('Navbar mounted - user info:', {
      name: this.name,
      avatar: this.avatar,
      device: this.device
    })
    
    // 强制检查退出按钮是否可见
    this.$nextTick(() => {
      const logoutBtn = document.querySelector('.logout-btn')
      console.log('Logout button element:', logoutBtn)
      if (logoutBtn) {
        console.log('Logout button styles:', window.getComputedStyle(logoutBtn).display)
      }
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      try {
        // 显示加载状态
        this.$message.loading('正在登出...', 0.5)
        
        // 执行登出操作
        await this.$store.dispatch('user/logout')
        
        // 显示成功消息
        this.$message.success('登出成功')
        
        // 跳转到登录页
        this.$router.push('/login')
      } catch (error) {
        console.error('登出失败:', error)
        this.$message.error('登出失败，请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
      
      &.logout-btn {
        display: inline-flex !important;
        align-items: center;
        font-size: 16px;
        visibility: visible !important;
        opacity: 1 !important;
        
        &:hover {
          background: rgba(245, 106, 0, 0.1);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        
        .user-name {
          margin-left: 8px;
          margin-right: 4px;
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }

        .ant-icon-down {
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>