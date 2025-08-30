<template>
  <div class="menu-container">
    <a-card>
      <div slot="title">
        <span>菜单管理</span>
      </div>
      <div slot="extra">
        <a-button type="primary" @click="handleAdd">
          <a-icon type="plus" />
          添加菜单
        </a-button>
      </div>
      
      <a-table 
        :columns="columns" 
        :data-source="menuList" 
        :pagination="false"
        row-key="id"
        :default-expand-all-rows="true"
      >
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="handleEdit(record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-button type="link" @click="handleDelete(record)">删除</a-button>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'MenuManagement',
  data() {
    return {
      menuList: [
        {
          id: 1,
          title: '仪表板',
          name: 'Dashboard',
          path: '/dashboard',
          type: 'C',
          sort: 1
        },
        {
          id: 2,
          title: '系统管理',
          name: 'System',
          path: '/system',
          type: 'M',
          sort: 2,
          children: [
            {
              id: 10,
              title: '用户管理',
              name: 'User',
              path: '/system/user',
              type: 'C',
              sort: 1
            },
            {
              id: 11,
              title: '角色管理',
              name: 'Role',
              path: '/system/role',
              type: 'C',
              sort: 2
            },
            {
              id: 12,
              title: '菜单管理',
              name: 'Menu',
              path: '/system/menu',
              type: 'C',
              sort: 3
            }
          ]
        },
        {
          id: 3,
          title: '租赁管理',
          name: 'Rental',
          path: '/rental',
          type: 'M',
          sort: 3,
          children: [
            {
              id: 20,
              title: '楼盘管理',
              name: 'Building',
              path: '/rental/building',
              type: 'C',
              sort: 1
            },
            {
              id: 21,
              title: '房源管理',
              name: 'Room',
              path: '/rental/room',
              type: 'C',
              sort: 2
            },
            {
              id: 22,
              title: '租客管理',
              name: 'Tenant',
              path: '/rental/tenant',
              type: 'C',
              sort: 3
            },
            {
              id: 23,
              title: '合同管理',
              name: 'Contract',
              path: '/rental/contract',
              type: 'C',
              sort: 4
            }
          ]
        }
      ],
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '组件名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '路由路径',
          dataIndex: 'path',
          key: 'path',
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort',
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ]
    }
  },
  methods: {
    handleAdd() {
      this.$message.info('添加菜单功能待开发')
    },
    handleEdit(record) {
      this.$message.info(`编辑菜单: ${record.title}`)
    },
    handleDelete(record) {
      this.$message.info(`删除菜单: ${record.title}`)
    }
  }
}
</script>

<style scoped>
.menu-container {
  padding: 20px;
}
</style>