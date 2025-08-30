<template>
  <div v-if="item && !item.hidden">
    <!-- 如果只有一个子菜单且不是始终显示父菜单的情况 -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <a-menu-item :key="resolvePath(onlyOneChild.path)" class="sidebar-menu-item">
          <a-icon v-if="onlyOneChild.meta && onlyOneChild.meta.icon" :type="getIcon(onlyOneChild.meta.icon)" class="sidebar-menu-item-icon" />
          <span class="sidebar-menu-item-title">{{ onlyOneChild.meta.title || onlyOneChild.name || '菜单' }}</span>
        </a-menu-item>
      </app-link>
    </template>

    <!-- 如果有多个子菜单或需要始终显示父菜单，显示为子菜单 -->
    <a-sub-menu v-else :key="resolvePath(item.path)" class="sidebar-sub-menu">
      <span slot="title" class="sidebar-sub-menu-title">
        <a-icon v-if="item.meta && item.meta.icon" :type="getIcon(item.meta.icon)" class="sidebar-sub-menu-icon" />
        <span class="sidebar-sub-menu-title-text">{{ item.meta.title || item.name || '菜单' }}</span>
      </span>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path || child.name || Math.random()"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </a-sub-menu>
  </div>
</template>

<script>
import { isExternal } from '@/utils/validate'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: {}
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent = {}) {
      // 如果没有子菜单，返回false
      if (!children || !Array.isArray(children)) {
        // 检查是否有路径，如果有路径则可以显示为单个菜单项
        if (parent.path) {
          this.onlyOneChild = { 
            ...parent, 
            path: parent.path || '', 
            noShowingChildren: true,
            meta: parent.meta || { title: parent.name || '菜单' }
          }
          return true
        }
        return false
      }
      
      const showingChildren = children.filter(item => {
        // 确保item存在且未隐藏
        if (!item || item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { 
          ...parent, 
          path: parent.path || '', 
          noShowingChildren: true,
          meta: parent.meta || { title: parent.name || '菜单' }
        }
        return true
      }

      return false
    },
    resolvePath(routePath = '') {
      if (!routePath) return this.basePath || '/'
      
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      // Simple path resolve without using node path module
      if (routePath.startsWith('/')) {
        return routePath
      }
      const basePath = this.basePath || ''
      return basePath.replace(/\/$/, '') + '/' + routePath.replace(/^\//, '')
    },
    // 菜单图标映射
    getIcon(iconName) {
      const iconMap = {
        'dashboard': 'dashboard',
        'system': 'setting',
        'rental': 'apartment',
        'user': 'user',
        'role': 'team',
        'menu': 'menu-unfold',
        'building': 'bank',
        'room': 'home',
        'tenant': 'contacts',
        'contract': 'file-text'
      }
      return iconMap[iconName] || iconName || 'menu-fold'
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar-menu-item {
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin: 2px 8px;
  transition: all 0.3s;
  
  &-icon {
    font-size: 16px;
    margin-right: 10px;
    transition: all 0.3s;
    min-width: 16px;
  }
  
  &-title {
    font-size: 14px;
    transition: all 0.3s;
    flex: 1;
    text-align: left;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  &.ant-menu-item-selected {
    background-color: #1890ff !important;
    color: #fff;
    
    .sidebar-menu-item-icon {
      color: #fff;
    }
    
    .sidebar-menu-item-title {
      color: #fff;
    }
  }
}

.sidebar-sub-menu {
  &-title {
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 2px 8px;
    transition: all 0.3s;
  }
  
  &-icon {
    font-size: 16px;
    margin-right: 10px;
    transition: all 0.3s;
    min-width: 16px;
  }
  
  &-title-text {
    font-size: 14px;
    transition: all 0.3s;
    flex: 1;
    text-align: left;
  }
  
  /deep/ .ant-menu-submenu-title:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  /deep/ .ant-menu-submenu-open > .ant-menu-submenu-title {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
}

// 嵌套菜单的样式
.nest-menu {
  /deep/ .ant-menu-item {
    padding-left: 48px !important;
    margin: 2px 8px !important;
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(24, 144, 255, 0.6) !important;
    }
    
    &.ant-menu-item-selected {
      background-color: rgba(24, 144, 255, 0.8) !important;
      color: #fff;
    }
  }
  
  /deep/ .sidebar-menu-item-icon {
    font-size: 14px;
  }
  
  /deep/ .sidebar-menu-item-title {
    font-size: 13px;
  }
}
</style>