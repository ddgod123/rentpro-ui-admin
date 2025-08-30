<template>
  <div class="menu-container">
    <a-menu
      :selectedKeys="[activeMenu]"
      :defaultOpenKeys="[]"
      mode="inline"
      theme="dark"
      @select="handleSelect"
    >
      <a-menu-item 
        v-for="menu in menuList"
        :key="menu.path"
      >
        <a-icon v-if="menu.icon" :type="getIconType(menu.icon)" />
        <span>{{ menu.title }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeMenu: ''
    }
  },
  computed: {
    // 获取菜单列表
    menuList() {
      // 直接从sessionStorage获取菜单数据
      const menusStr = sessionStorage.getItem('menus')
      let menus = []
      try {
        menus = JSON.parse(menusStr || '[]')
      } catch (error) {
        console.error('解析菜单数据失败:', error)
        menus = []
      }
      console.log('Menu组件 - 从sessionStorage获取的菜单数据:', menus)
      return menus || []
    }
  },
  watch: {
    '$route.path': {
      handler(newPath) {
        this.activeMenu = newPath
      },
      immediate: true
    }
  },
  methods: {
    // 处理菜单选择
    handleSelect({ key }) {
      console.log('菜单选择:', key)
      this.$router.push(key)
    },
    
    // 图标类型映射
    getIconType(icon) {
      const iconMap = {
        'dashboard': 'dashboard',
        'user': 'user',
        'role': 'team',
        'menu': 'menu',
        'system': 'setting',
        'rental': 'home',
        'building': 'bank',
        'room': 'home',
        'tenant': 'user',
        'contract': 'file-text'
      }
      return iconMap[icon] || 'file'
    }
  }
}
</script>

<style scoped>
.menu-container {
  height: 100%;
  overflow-y: auto;
}

.ant-menu {
  border-right: none;
}

.ant-menu-item {
  height: 50px;
  line-height: 50px;
}

.ant-menu-submenu .ant-menu-item {
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
}

.anticon {
  margin-right: 8px;
}
</style>
