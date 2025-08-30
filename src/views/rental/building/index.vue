<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <a-card title="楼盘管理" :bordered="false">
        <a-form layout="inline" :model="searchForm">
          <a-form-item label="楼盘名称">
            <a-input
              v-model:value="searchForm.name"
              placeholder="请输入楼盘名称"
              allow-clear
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item label="城市">
            <a-select
              v-model:value="searchForm.city"
              placeholder="请选择城市"
              allow-clear
              style="width: 150px"
            >
              <a-select-option value="上海市">上海市</a-select-option>
              <a-select-option value="北京市">北京市</a-select-option>
              <a-select-option value="深圳市">深圳市</a-select-option>
              <a-select-option value="杭州市">杭州市</a-select-option>
              <a-select-option value="广州市">广州市</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="searchForm.status"
              placeholder="请选择状态"
              allow-clear
              style="width: 120px"
            >
              <a-select-option value="active">在租/售</a-select-option>
              <a-select-option value="inactive">停用</a-select-option>
              <a-select-option value="pending">审核中</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button style="margin-left: 8px" @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-section">
      <a-button type="primary" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增楼盘
      </a-button>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <a-card :bordered="false">
        <a-table
          :columns="columns"
          :data-source="buildingList"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          @change="handleTableChange"
        >
          <!-- 楼盘名称列 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <a @click="handleView(record)">{{ record.name }}</a>
            </template>
            
            <!-- 状态列 -->
            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
            
            <!-- 是否热门列 -->
            <template v-else-if="column.key === 'is_hot'">
              <a-tag :color="record.is_hot ? 'red' : 'default'">
                {{ record.is_hot ? '是' : '否' }}
              </a-tag>
            </template>
            
            <!-- 操作列 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="handleView(record)">查看</a>
                <a @click="handleEdit(record)">编辑</a>
                <a-popconfirm
                  title="确定要删除这个楼盘吗？"
                  @confirm="handleDelete(record)"
                >
                  <a style="color: #ff4d4f">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="800px"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="楼盘名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入楼盘名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开发商" name="developer">
              <a-input v-model:value="formData.developer" placeholder="请输入开发商" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="城市" name="city">
              <a-select v-model:value="formData.city" placeholder="请选择城市">
                <a-select-option value="上海市">上海市</a-select-option>
                <a-select-option value="北京市">北京市</a-select-option>
                <a-select-option value="深圳市">深圳市</a-select-option>
                <a-select-option value="杭州市">杭州市</a-select-option>
                <a-select-option value="广州市">广州市</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="区域" name="district">
              <a-input v-model:value="formData.district" placeholder="请输入区域" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="街道" name="sub_district">
              <a-input v-model:value="formData.sub_district" placeholder="请输入街道" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="详细地址" name="address">
          <a-input v-model:value="formData.address" placeholder="请输入详细地址" />
        </a-form-item>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="物业类型" name="property_type">
              <a-select v-model:value="formData.property_type" placeholder="请选择物业类型">
                <a-select-option value="住宅">住宅</a-select-option>
                <a-select-option value="商业">商业</a-select-option>
                <a-select-option value="办公">办公</a-select-option>
                <a-select-option value="混合">混合</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="物业公司" name="property_company">
              <a-input v-model:value="formData.property_company" placeholder="请输入物业公司" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-select v-model:value="formData.status" placeholder="请选择状态">
                <a-select-option value="active">在租/售</a-select-option>
                <a-select-option value="inactive">停用</a-select-option>
                <a-select-option value="pending">审核中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否热门" name="is_hot">
              <a-switch v-model:checked="formData.is_hot" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="楼盘描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入楼盘描述"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看详情弹窗 -->
    <a-modal
      v-model:open="viewModalVisible"
      title="楼盘详情"
      width="600px"
      :footer="null"
    >
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="楼盘名称">{{ viewData.name }}</a-descriptions-item>
        <a-descriptions-item label="开发商">{{ viewData.developer }}</a-descriptions-item>
        <a-descriptions-item label="城市">{{ viewData.city }}</a-descriptions-item>
        <a-descriptions-item label="区域">{{ viewData.district }}</a-descriptions-item>
        <a-descriptions-item label="街道">{{ viewData.sub_district }}</a-descriptions-item>
        <a-descriptions-item label="物业类型">{{ viewData.property_type }}</a-descriptions-item>
        <a-descriptions-item label="物业公司">{{ viewData.property_company }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="getStatusColor(viewData.status)">
            {{ getStatusText(viewData.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="是否热门">
          <a-tag :color="viewData.is_hot ? 'red' : 'default'">
            {{ viewData.is_hot ? '是' : '否' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ viewData.created_at }}</a-descriptions-item>
        <a-descriptions-item label="详细地址" :span="2">{{ viewData.address }}</a-descriptions-item>
        <a-descriptions-item label="楼盘描述" :span="2">{{ viewData.description }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import { getBuildingList, createBuilding, updateBuilding, deleteBuilding, getBuilding } from '@/api/building'

export default {
  name: 'BuildingManagement',
  components: {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined
  },
  setup() {
    // 响应式数据
    const loading = ref(false)
    const buildingList = ref([])
    const modalVisible = ref(false)
    const viewModalVisible = ref(false)
    const modalTitle = ref('新增楼盘')
    const isEdit = ref(false)
    const currentId = ref(null)
    
    // 搜索表单
    const searchForm = reactive({
      name: '',
      city: '',
      status: ''
    })
    
    // 表单数据
    const formData = reactive({
      name: '',
      developer: '',
      address: '',
      city: '',
      district: '',
      sub_district: '',
      property_type: '',
      property_company: '',
      description: '',
      status: 'active',
      is_hot: false
    })
    
    // 查看数据
    const viewData = reactive({})
    
    // 分页配置
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
    })
    
    // 表格列配置
    const columns = [
      {
        title: '楼盘名称',
        dataIndex: 'name',
        key: 'name',
        width: 150
      },
      {
        title: '开发商',
        dataIndex: 'developer',
        key: 'developer',
        width: 120
      },
      {
        title: '城市',
        dataIndex: 'city',
        key: 'city',
        width: 100
      },
      {
        title: '区域',
        dataIndex: 'district',
        key: 'district',
        width: 100
      },
      {
        title: '物业类型',
        dataIndex: 'property_type',
        key: 'property_type',
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100
      },
      {
        title: '是否热门',
        dataIndex: 'is_hot',
        key: 'is_hot',
        width: 100
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        fixed: 'right'
      }
    ]
    
    // 表单验证规则
    const formRules = {
      name: [{ required: true, message: '请输入楼盘名称', trigger: 'blur' }],
      address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      city: [{ required: true, message: '请选择城市', trigger: 'change' }],
      district: [{ required: true, message: '请输入区域', trigger: 'blur' }],
      property_type: [{ required: true, message: '请选择物业类型', trigger: 'change' }]
    }
    
    // 获取楼盘列表
    const fetchBuildingList = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.current,
          pageSize: pagination.pageSize,
          ...searchForm
        }
        const response = await getBuildingList(params)
        if (response.code === 200) {
          buildingList.value = response.data.list
          pagination.total = response.data.total
        }
      } catch (error) {
        message.error('获取楼盘列表失败')
        console.error(error)
      } finally {
        loading.value = false
      }
    }
    
    // 搜索
    const handleSearch = () => {
      pagination.current = 1
      fetchBuildingList()
    }
    
    // 重置搜索
    const handleReset = () => {
      Object.keys(searchForm).forEach(key => {
        searchForm[key] = ''
      })
      pagination.current = 1
      fetchBuildingList()
    }
    
    // 表格变化处理
    const handleTableChange = (pag) => {
      pagination.current = pag.current
      pagination.pageSize = pag.pageSize
      fetchBuildingList()
    }
    
    // 新增楼盘
    const handleAdd = () => {
      modalTitle.value = '新增楼盘'
      isEdit.value = false
      currentId.value = null
      resetForm()
      modalVisible.value = true
    }
    
    // 编辑楼盘
    const handleEdit = (record) => {
      modalTitle.value = '编辑楼盘'
      isEdit.value = true
      currentId.value = record.id
      Object.keys(formData).forEach(key => {
        if (record[key] !== undefined) {
          formData[key] = record[key]
        }
      })
      modalVisible.value = true
    }
    
    // 查看楼盘详情
    const handleView = async (record) => {
      try {
        const response = await getBuilding(record.id)
        if (response.code === 200) {
          Object.assign(viewData, response.data)
          viewModalVisible.value = true
        }
      } catch (error) {
        message.error('获取楼盘详情失败')
        console.error(error)
      }
    }
    
    // 删除楼盘
    const handleDelete = async (record) => {
      try {
        const response = await deleteBuilding(record.id)
        if (response.code === 200) {
          message.success('删除成功')
          fetchBuildingList()
        }
      } catch (error) {
        message.error('删除失败')
        console.error(error)
      }
    }
    
    // 弹窗确认
    const handleModalOk = async () => {
      try {
        if (isEdit.value) {
          const response = await updateBuilding(currentId.value, formData)
          if (response.code === 200) {
            message.success('更新成功')
            modalVisible.value = false
            fetchBuildingList()
          }
        } else {
          const response = await createBuilding(formData)
          if (response.code === 200) {
            message.success('创建成功')
            modalVisible.value = false
            fetchBuildingList()
          }
        }
      } catch (error) {
        message.error(isEdit.value ? '更新失败' : '创建失败')
        console.error(error)
      }
    }
    
    // 弹窗取消
    const handleModalCancel = () => {
      modalVisible.value = false
      resetForm()
    }
    
    // 重置表单
    const resetForm = () => {
      Object.keys(formData).forEach(key => {
        if (key === 'status') {
          formData[key] = 'active'
        } else if (key === 'is_hot') {
          formData[key] = false
        } else {
          formData[key] = ''
        }
      })
    }
    
    // 获取状态颜色
    const getStatusColor = (status) => {
      const colorMap = {
        active: 'green',
        inactive: 'red',
        pending: 'orange'
      }
      return colorMap[status] || 'default'
    }
    
    // 获取状态文本
    const getStatusText = (status) => {
      const textMap = {
        active: '在租/售',
        inactive: '停用',
        pending: '审核中'
      }
      return textMap[status] || status
    }
    
    // 页面加载时获取数据
    onMounted(() => {
      fetchBuildingList()
    })
    
    return {
      loading,
      buildingList,
      modalVisible,
      viewModalVisible,
      modalTitle,
      searchForm,
      formData,
      viewData,
      pagination,
      columns,
      formRules,
      handleSearch,
      handleReset,
      handleTableChange,
      handleAdd,
      handleEdit,
      handleView,
      handleDelete,
      handleModalOk,
      handleModalCancel,
      getStatusColor,
      getStatusText
    }
  }
}
</script>

<style scoped>
.building-container {
  padding: 24px;
}

.search-section {
  margin-bottom: 16px;
}

.action-section {
  margin-bottom: 16px;
}

.table-section {
  margin-bottom: 16px;
}
</style>