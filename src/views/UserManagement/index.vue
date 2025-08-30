<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <p>管理系统中的所有用户账户</p>
    </div>
    
    <div class="page-content">
      <div class="toolbar">
        <a-button type="primary" @click="showAddModal">
          <a-icon type="plus" />
          新增用户
        </a-button>
        <a-button @click="refreshData">
          <a-icon type="reload" />
          刷新
        </a-button>
      </div>
      
      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
      >
        <template slot="action" slot-scope="text, record">
          <a-button type="link" @click="editUser(record)">编辑</a-button>
          <a-button type="link" @click="viewUser(record)">查看</a-button>
          <a-popconfirm
            title="确定要删除这个用户吗？"
            @confirm="deleteUser(record.id)"
          >
            <a-button type="link" style="color: #ff4d4f">删除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserManagement",
  data() {
    return {
      loading: false,
      userList: [
        {
          id: 1,
          username: "admin",
          nickname: "超级管理员",
          email: "admin@rentpro.com",
          phone: "15888888888",
          status: "active",
          createdAt: "2024-01-15 10:30:00"
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
      },
      columns: [
        { title: "用户名", dataIndex: "username", key: "username" },
        { title: "昵称", dataIndex: "nickname", key: "nickname" },
        { title: "邮箱", dataIndex: "email", key: "email" },
        { title: "手机号", dataIndex: "phone", key: "phone" },
        { title: "状态", dataIndex: "status", key: "status" },
        { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
        { title: "操作", key: "action", scopedSlots: { customRender: "action" } }
      ]
    };
  },
  methods: {
    showAddModal() {
      this.$message.info("新增用户功能开发中...");
    },
    editUser(record) {
      this.$message.info(`编辑用户：${record.username}`);
    },
    viewUser(record) {
      this.$message.info(`查看用户：${record.username}`);
    },
    deleteUser(id) {
      this.$message.success("删除成功");
    },
    refreshData() {
      this.$message.success("刷新成功");
    }
  }
};
</script>

<style lang="less" scoped>
.user-management {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  
  .page-header {
    margin-bottom: 24px;
    h2 { margin: 0 0 8px 0; font-size: 20px; }
    p { margin: 0; color: #8c8c8c; }
  }
  
  .toolbar {
    margin-bottom: 16px;
    display: flex;
    gap: 12px;
  }
}
</style>
