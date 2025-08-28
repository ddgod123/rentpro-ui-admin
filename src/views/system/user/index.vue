<template>
  <div class="user-container">
    <a-card>
      <div slot="title">
        <span>用户管理</span>
      </div>
      <div slot="extra">
        <a-button type="primary" @click="handleAdd">
          <a-icon type="plus" />
          添加用户
        </a-button>
      </div>
      
      <a-table 
        :columns="columns" 
        :data-source="userList" 
        :pagination="false"
        row-key="id"
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
  name: 'UserManagement',
  data() {
    return {
      userList: [
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com',
          role: '管理员',
          status: '启用'
        },
        {
          id: 2,
          username: 'user1',
          name: '普通用户',
          email: 'user1@example.com',
          role: '用户',
          status: '启用'
        }
      ],
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: '角色',
          dataIndex: 'role',
          key: 'role',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
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
      this.$message.info('添加用户功能待开发')
    },
    handleEdit(record) {
      this.$message.info(`编辑用户: ${record.name}`)
    },
    handleDelete(record) {
      this.$message.info(`删除用户: ${record.name}`)
    }
  }
}
</script>

<style scoped>
.user-container {
  padding: 20px;
}
</style>