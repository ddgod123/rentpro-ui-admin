<template>
  <div class="tenant-management">
    <div class="page-header">
      <h2>租客管理</h2>
      <a-button type="primary" @click="handleAddTenant">
        <PlusOutlined />
        添加租客
      </a-button>
    </div>

    <!-- 租客列表 -->
    <div class="tenant-table">
      <a-table :data-source="tenantList" :loading="loading" :pagination="false" bordered>
        <a-table-column key="id" title="ID" data-index="id" width="80" />
        <a-table-column key="name" title="姓名" data-index="name" width="100" />
        <a-table-column key="phone" title="手机号" data-index="phone" width="120" />
        <a-table-column key="idCard" title="身份证号" data-index="idCard" width="180" />
        <a-table-column key="roomNumber" title="租住房间" data-index="roomNumber" width="100" />
        <a-table-column key="rentStartDate" title="租期开始" data-index="rentStartDate" width="120" />
        <a-table-column key="rentEndDate" title="租期结束" data-index="rentEndDate" width="120" />
        <a-table-column key="status" title="状态" data-index="status" width="100">
          <template #default="{ record }">
            <a-tag :color="record.status === '1' ? 'success' : 'default'">
              {{ record.status === '1' ? '在租' : '已退租' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" width="200" fixed="right">
          <template #default="{ record }">
            <a-button size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button size="small" type="primary" danger @click="handleDelete(record)" style="margin-left: 8px;">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <!-- 租客表单对话框 -->
    <a-modal 
      :title="dialogTitle" 
      :visible="dialogVisible" 
      :width="600"
      @ok="handleSubmit"
      @cancel="dialogVisible = false"
      :confirm-loading="submitLoading"
    >
      <a-form :model="tenantForm" :rules="tenantRules" ref="tenantFormRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="tenantForm.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="tenantForm.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="身份证号" name="idCard">
          <a-input v-model:value="tenantForm.idCard" placeholder="请输入身份证号" />
        </a-form-item>
        <a-form-item label="租住房间" name="roomId">
          <a-select v-model:value="tenantForm.roomId" placeholder="请选择房间">
            <a-select-option
              v-for="room in roomList"
              :key="room.id"
              :value="room.id"
            >
              {{ room.roomNumber }} - {{ room.buildingName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="租期开始" name="rentStartDate">
          <a-date-picker
            v-model:value="tenantForm.rentStartDate"
            placeholder="选择开始日期"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="租期结束" name="rentEndDate">
          <a-date-picker
            v-model:value="tenantForm.rentEndDate"
            placeholder="选择结束日期"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="tenantForm.status">
            <a-radio value="1">在租</a-radio>
            <a-radio value="0">已退租</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

export default {
  name: 'TenantManagement',
  components: {
    PlusOutlined
  },
  props: {
    menuData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      tenantList: [
        {
          id: 1,
          name: '张三',
          phone: '13800138001',
          idCard: '110101199001011234',
          roomNumber: 'A-102',
          rentStartDate: '2024-01-01',
          rentEndDate: '2024-12-31',
          status: '1'
        },
        {
          id: 2,
          name: '李四',
          phone: '13800138002',
          idCard: '110101199002022345',
          roomNumber: 'B-201',
          rentStartDate: '2024-02-01',
          rentEndDate: '2025-01-31',
          status: '1'
        }
      ],
      roomList: [
        { id: 1, roomNumber: 'A-101', buildingName: '阳光花园' },
        { id: 2, roomNumber: 'A-102', buildingName: '阳光花园' },
        { id: 3, roomNumber: 'B-201', buildingName: '翠湖庄园' }
      ],
      dialogVisible: false,
      dialogTitle: '添加租客',
      tenantForm: {
        name: '',
        phone: '',
        idCard: '',
        roomId: '',
        rentStartDate: '',
        rentEndDate: '',
        status: '1'
      },
      tenantRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        roomId: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.loadTenantList()
  },
  methods: {
    // 加载租客列表
    async loadTenantList() {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('加载租客列表')
      } catch (error) {
        console.error('加载租客列表失败:', error)
        message.error('加载租客列表失败')
      } finally {
        this.loading = false
      }
    },

    // 添加租客
    handleAddTenant() {
      this.dialogTitle = '添加租客'
      this.tenantForm = {
        name: '',
        phone: '',
        idCard: '',
        roomId: '',
        rentStartDate: '',
        rentEndDate: '',
        status: '1'
      }
      this.dialogVisible = true
    },

    // 编辑租客
    handleEdit(row) {
      this.dialogTitle = '编辑租客'
      this.tenantForm = { ...row }
      this.dialogVisible = true
    },

    // 删除租客
    handleDelete(row) {
      Modal.confirm({
        title: '提示',
        content: '确定要删除该租客吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          message.success('删除成功')
          this.loadTenantList()
        }
      })
    },

    // 提交表单
    async handleSubmit() {
      try {
        await this.$refs.tenantFormRef.validate()
        this.submitLoading = true
        
        // 模拟提交
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (this.tenantForm.id) {
          message.success('更新成功')
        } else {
          message.success('添加成功')
        }
        this.dialogVisible = false
        this.loadTenantList()
      } catch (error) {
        console.error('表单验证失败:', error)
      } finally {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tenant-management {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    color: #262626;
    margin: 0;
  }
}

.tenant-table {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
