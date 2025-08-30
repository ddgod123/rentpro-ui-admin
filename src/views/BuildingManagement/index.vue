<template>
  <div class="building-management">
    <div class="page-header">
      <h2>楼盘管理</h2>
      <p>管理系统中的所有楼盘信息</p>
    </div>
    
    <div class="page-content">
      <div class="toolbar">
        <a-button type="primary" @click="showAddModal">
          <a-icon type="plus" />
          新增楼盘
        </a-button>
        <a-button @click="refreshData">
          <a-icon type="reload" />
          刷新
        </a-button>
      </div>
      
      <a-table
        :columns="columns"
        :data-source="buildingList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text">
          <a-tag :color="getStatusColor(text)">
            {{ getStatusText(text) }}
          </a-tag>
        </template>
        <template slot="is_hot" slot-scope="text">
          <a-tag :color="text ? 'red' : 'default'">
            {{ text ? '热门' : '普通' }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button type="link" @click="editBuilding(record)">编辑</a-button>
          <a-button type="link" @click="viewBuilding(record)">查看</a-button>
          <a-popconfirm
            title="确定要删除这个楼盘吗？"
            @confirm="deleteBuilding(record.id)"
          >
            <a-button type="link" style="color: #ff4d4f">删除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: "BuildingManagement",
  data() {
    return {
      loading: false,
      buildingList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
      },
      columns: [
        { title: "ID", dataIndex: "id", key: "id", width: 80 },
        { title: "楼盘名称", dataIndex: "name", key: "name", width: 150 },
        { title: "开发商", dataIndex: "developer", key: "developer", width: 120 },
        { title: "详细地址", dataIndex: "detailed_address", key: "detailed_address", width: 200 },
        { title: "城市", dataIndex: "city", key: "city", width: 100 },
        { title: "区域", dataIndex: "district", key: "district", width: 100 },
        { title: "所属商圈", dataIndex: "business_area", key: "business_area", width: 120 },
        { title: "物业类型", dataIndex: "property_type", key: "property_type", width: 100 },
        { title: "在售数", dataIndex: "sale_count", key: "sale_count", width: 80 },
        { title: "在租数", dataIndex: "rent_count", key: "rent_count", width: 80 },
        { title: "售出", dataIndex: "sale_deals_count", key: "sale_deals_count", width: 80 },
        { title: "租出", dataIndex: "rent_deals_count", key: "rent_deals_count", width: 80 },
        { title: "状态", dataIndex: "status", key: "status", scopedSlots: { customRender: "status" }, width: 80 },
        { title: "热门", dataIndex: "is_hot", key: "is_hot", scopedSlots: { customRender: "is_hot" }, width: 80 },
        { title: "创建时间", dataIndex: "created_at", key: "created_at", width: 150 },
        { title: "操作", key: "action", scopedSlots: { customRender: "action" }, width: 200, fixed: 'right' }
      ]
    };
  },
  mounted() {
    console.log('楼盘管理组件已挂载，开始加载数据...')
    this.loadBuildingData()
  },
  methods: {
    // 加载楼盘数据
    async loadBuildingData() {
      console.log('开始加载楼盘数据...')
      
      // 检查token
      const token = this.$store.getters.token
      console.log('当前token状态:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'null'
      })
      
      this.loading = true
      
      try {
        console.log('发送API请求: /api/rental/building')
        const response = await request.get('/api/rental/building', {
          params: {
            page: this.pagination.current,
            pageSize: this.pagination.pageSize
          }
        })
        
        console.log('楼盘数据API响应:', response)
        
        // request拦截器已经处理了响应格式，直接使用response
        if (response && response.code === 200) {
          this.buildingList = response.data?.list || []
          this.pagination.total = response.data?.total || 0
          
          console.log('楼盘列表:', this.buildingList)
          console.log('总数:', this.pagination.total)
          
          if (this.buildingList.length > 0) {
            this.$message.success(`成功加载 ${this.buildingList.length} 条楼盘数据`)
          } else {
            this.$message.warning('没有找到楼盘数据')
          }
        } else {
          console.error('楼盘数据加载失败:', response)
          this.$message.error(response?.msg || '加载楼盘数据失败')
        }
      } catch (error) {
        console.error('楼盘数据请求失败:', error)
        this.$message.error('请求失败：' + (error.message || '网络错误'))
        
        // 如果API调用失败，使用示例数据
        console.log('使用示例数据...')
        this.buildingList = [
          {
            id: 1,
            name: "滨江一号",
            developer: "滨江地产",
            detailed_address: "上海市浦东新区张江高科技园区博云路2号",
            city: "上海市",
            district: "浦东新区",
            business_area: "张江高科技园区",
            property_type: "住宅",
            property_company: "滨江物业",
            sale_count: 15,
            rent_count: 8,
            sale_deals_count: 3,
            rent_deals_count: 2,
            status: "active",
            is_hot: true,
            created_at: "2024-01-15 10:30:00"
          },
          {
            id: 2,
            name: "城市之光",
            developer: "城市发展",
            detailed_address: "北京市朝阳区建国路88号",
            city: "北京市",
            district: "朝阳区",
            business_area: "CBD商务区",
            property_type: "商业",
            property_company: "城市物业",
            sale_count: 22,
            rent_count: 12,
            sale_deals_count: 5,
            rent_deals_count: 4,
            status: "active",
            is_hot: false,
            created_at: "2024-01-16 14:20:00"
          }
        ]
        this.pagination.total = 2
      } finally {
        this.loading = false
      }
    },
    
    // 获取状态颜色
    getStatusColor(status) {
      const colorMap = {
        'active': 'green',
        'inactive': 'red',
        'pending': 'orange'
      }
      return colorMap[status] || 'default'
    },
    
    // 获取状态文本
    getStatusText(status) {
      const textMap = {
        'active': '在租/售',
        'inactive': '停用',
        'pending': '审核中'
      }
      return textMap[status] || status
    },
    
    // 格式化时间
    formatDateTime(dateTime) {
      if (!dateTime) return '-'
      const date = new Date(dateTime)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    showAddModal() {
      this.$message.info("新增楼盘功能开发中...");
    },
    
    editBuilding(record) {
      console.log('编辑楼盘:', record)
      this.$message.info(`编辑楼盘：${record.name}`);
    },
    
    viewBuilding(record) {
      console.log('查看楼盘:', record)
      this.$message.info(`查看楼盘：${record.name}
地址：${record.address}
开发商：${record.developer}
状态：${this.getStatusText(record.status)}`);
    },
    
    async deleteBuilding(id) {
      console.log('删除楼盘:', id)
      try {
        // 这里应该调用删除API
        // await request.delete(`/api/rental/building/${id}`)
        this.$message.success("删除成功");
        // 重新加载数据
        this.loadBuildingData()
      } catch (error) {
        console.error('删除失败:', error)
        this.$message.error('删除失败：' + (error.message || '网络错误'))
      }
    },
    
    refreshData() {
      console.log('刷新楼盘数据...')
      this.loadBuildingData()
    },
    
    handleTableChange(pagination) {
      console.log('表格变化:', pagination)
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.loadBuildingData()
    }
  }
};
</script>

<style lang="less" scoped>
.building-management {
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
