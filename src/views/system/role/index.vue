<template>
  <div class="role-container">
    <a-card title="角色管理">
      <a-table 
        :columns="columns" 
        :data-source="roleList" 
        :pagination="false"
        row-key="id"
      />
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'RoleManagement',
  data() {
    return {
      roleList: [
        { id: 1, name: '管理员', description: '系统管理员' },
        { id: 2, name: '普通用户', description: '普通用户' }
      ],
      columns: [
        { title: '角色名称', dataIndex: 'name', key: 'name' },
        { title: '描述', dataIndex: 'description', key: 'description' }
      ]
    }
  }
}
</script>