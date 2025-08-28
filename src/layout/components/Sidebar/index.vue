<template>
  <div class="sidebar">
    <div class="logo-container">
      <div class="sidebar-logo">
        <span class="sidebar-title">RentPro Admin</span>
      </div>
    </div>
    <a-menu
      :default-selected-keys="activeMenu"
      :default-open-keys="defaultOpenKeys"
      :mode="mode"
      theme="dark"
      class="sidebar-menu"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routes'
    ]),
    routes() {
      return this.permission_routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return [meta.activeMenu]
      }
      return [path]
    },
    defaultOpenKeys() {
      return []
    },
    mode() {
      return 'inline'
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  background: #001529;

  .logo-container {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    background: rgba(255, 255, 255, 0.1);

    .sidebar-logo {
      display: flex;
      align-items: center;
      
      .sidebar-title {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        margin-left: 10px;
      }
    }
  }

  .sidebar-menu {
    height: calc(100% - 50px);
    border-right: none;

    /deep/ .ant-menu-item {
      margin: 0;
      
      &:hover {
        background-color: #1890ff !important;
      }
      
      &.ant-menu-item-selected {
        background-color: #1890ff !important;
      }
    }
    
    /deep/ .ant-menu-submenu-title:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }
}
</style>