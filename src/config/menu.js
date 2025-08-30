// 静态菜单配置
export const staticMenus = [
  {
    id: 1,
    name: 'Dashboard',
    title: '仪表板',
    icon: 'dashboard',
    path: '/dashboard',
    component: 'dashboard/index',
    permission: 'dashboard:view',
    type: 'C',
    sort: 1
  },
  {
    id: 2,
    name: 'User',
    title: '用户管理',
    icon: 'user',
    path: '/system/user',
    component: 'system/user/index',
    permission: 'system:user:view',
    type: 'C',
    sort: 2
  },
  {
    id: 3,
    name: 'Role',
    title: '角色管理',
    icon: 'team',
    path: '/system/role',
    component: 'system/role/index',
    permission: 'system:role:view',
    type: 'C',
    sort: 3
  },
  {
    id: 4,
    name: 'Building',
    title: '楼盘管理',
    icon: 'bank',
    path: '/rental/building',
    component: 'rental/building/index',
    permission: 'rental:building:view',
    type: 'C',
    sort: 4
  },
  {
    id: 5,
    name: 'Room',
    title: '房源管理',
    icon: 'home',
    path: '/rental/room',
    component: 'rental/room/index',
    permission: 'rental:room:view',
    type: 'C',
    sort: 5
  },
  {
    id: 6,
    name: 'Tenant',
    title: '租客管理',
    icon: 'contacts',
    path: '/rental/tenant',
    component: 'rental/tenant/index',
    permission: 'rental:tenant:view',
    type: 'C',
    sort: 6
  },
  {
    id: 7,
    name: 'Contract',
    title: '合同管理',
    icon: 'file-text',
    path: '/rental/contract',
    component: 'rental/contract/index',
    permission: 'rental:contract:view',
    type: 'C',
    sort: 7
  }
]

// 根据权限过滤菜单
export function filterMenusByPermissions(menus, permissions) {
  if (!permissions || permissions.length === 0) {
    return []
  }
  
  return menus.filter(menu => {
    return permissions.includes(menu.permission)
  })
}

// 构建菜单树结构
export function buildMenuTree(menus) {
  const menuMap = new Map()
  const rootMenus = []
  
  // 创建菜单映射
  menus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] })
  })
  
  // 构建树结构
  menus.forEach(menu => {
    if (menu.parent_id === 0 || !menu.parent_id) {
      // 根菜单
      rootMenus.push(menuMap.get(menu.id))
    } else {
      // 子菜单，添加到父菜单的children中
      const parent = menuMap.get(menu.parent_id)
      if (parent) {
        parent.children.push(menuMap.get(menu.id))
      }
    }
  })
  
  // 对菜单进行排序
  sortMenus(rootMenus)
  
  return rootMenus
}

// 递归排序菜单
function sortMenus(menus) {
  menus.sort((a, b) => a.sort - b.sort)
  
  menus.forEach(menu => {
    if (menu.children && menu.children.length > 0) {
      sortMenus(menu.children)
    }
  })
}
