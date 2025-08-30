<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>仪表板</h2>
      <p>系统概览和关键指标</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <UserOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalUsers }}</div>
          <div class="stat-label">用户总数</div>
        </div>
        <div class="stat-trend up">
          <ArrowUpOutlined />
          <span>+12%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <BankOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalBuildings }}</div>
          <div class="stat-label">楼盘总数</div>
        </div>
        <div class="stat-trend up">
          <ArrowUpOutlined />
          <span>+8%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <HomeOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalRooms }}</div>
          <div class="stat-label">房源总数</div>
        </div>
        <div class="stat-trend up">
          <ArrowUpOutlined />
          <span>+15%</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <FileTextOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalContracts }}</div>
          <div class="stat-label">合同总数</div>
        </div>
        <div class="stat-trend up">
          <ArrowUpOutlined />
          <span>+20%</span>
        </div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>月度租金收入</h3>
          <a-select v-model:value="selectedYear" size="small" style="width: 100px">
            <a-select-option value="2024">2024</a-select-option>
            <a-select-option value="2023">2023</a-select-option>
          </a-select>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <PieChartOutlined />
            <p>图表区域 - 月度租金收入趋势</p>
          </div>
        </div>
      </div>
      
      <div class="chart-card">
        <div class="chart-header">
          <h3>房源状态分布</h3>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <PieChartOutlined />
            <p>图表区域 - 房源状态分布</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最近活动 -->
    <div class="recent-activities">
      <div class="section-header">
        <h3>最近活动</h3>
        <a-button type="link">查看全部</a-button>
      </div>
      
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
          <div class="activity-icon" :class="activity.type">
            <component :is="getActivityIcon(activity.type)" />
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-desc">{{ activity.description }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  UserOutlined,
  BankOutlined,
  HomeOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  PieChartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'

export default {
  name: 'Dashboard',
  components: {
    UserOutlined,
    BankOutlined,
    HomeOutlined,
    FileTextOutlined,
    ArrowUpOutlined,
    PieChartOutlined,
    InfoCircleOutlined
  },
  props: {
    menuData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedYear: '2024',
      stats: {
        totalUsers: 100,
        totalBuildings: 50,
        totalRooms: 200,
        totalContracts: 150
      },
      recentActivities: [
        {
          id: 1,
          type: 'user',
          title: '新用户注册',
          description: '张三完成了用户注册',
          time: '2分钟前'
        },
        {
          id: 2,
          type: 'contract',
          title: '新合同签订',
          description: '阳光花园A101房间签订了新合同',
          time: '15分钟前'
        },
        {
          id: 3,
          type: 'room',
          title: '房源状态更新',
          description: '翠湖庄园B201房间状态更新为空置',
          time: '1小时前'
        },
        {
          id: 4,
          type: 'building',
          title: '新楼盘添加',
          description: '添加了新楼盘"星河湾"',
          time: '2小时前'
        }
      ]
    }
  },
  mounted() {
    this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      try {
        // 这里可以调用API获取仪表板数据
        console.log('加载仪表板数据')
      } catch (error) {
        console.error('加载仪表板数据失败:', error)
      }
    },
    
    getActivityIcon(type) {
      const iconMap = {
        'user': 'UserOutlined',
        'contract': 'FileTextOutlined',
        'room': 'HomeOutlined',
        'building': 'BankOutlined'
      }
      return iconMap[type] || 'InfoCircleOutlined'
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard {
  padding: 24px;
}

.dashboard-header {
  margin-bottom: 32px;
  
  h2 {
    font-size: 28px;
    color: #262626;
    margin: 0 0 8px 0;
  }
  
  p {
    font-size: 16px;
    color: #8c8c8c;
    margin: 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #e6f7ff;
    color: #1890ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    
    :deep(svg) {
      font-size: 24px;
    }
  }
  
  .stat-content {
    flex: 1;
    
    .stat-number {
      font-size: 28px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #8c8c8c;
    }
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    font-size: 12px;
    
    &.up {
      color: #52c41a;
    }
    
    &.down {
      color: #ff4d4f;
    }
    
    :deep(svg) {
      margin-right: 4px;
    }
  }
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      color: #262626;
      margin: 0;
    }
  }
  
  .chart-content {
    height: 300px;
    
    .chart-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #d9d9d9;
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      
      :deep(svg) {
        font-size: 48px;
        margin-bottom: 16px;
      }
      
      p {
        font-size: 16px;
        margin: 0;
      }
    }
  }
}

.recent-activities {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 18px;
    color: #262626;
    margin: 0;
  }
}

.activity-list {
  .activity-item {
    display: flex;
    align-items: flex-start;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .activity-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
      
      &.user {
        background: #e6f7ff;
        color: #1890ff;
      }
      
      &.contract {
        background: #f6ffed;
        color: #52c41a;
      }
      
      &.room {
        background: #fff7e6;
        color: #fa8c16;
      }
      
      &.building {
        background: #f9f0ff;
        color: #722ed1;
      }
      
      :deep(svg) {
        font-size: 16px;
      }
    }
    
    .activity-content {
      flex: 1;
      
      .activity-title {
        font-size: 14px;
        color: #262626;
        margin-bottom: 4px;
        font-weight: 500;
      }
      
      .activity-desc {
        font-size: 12px;
        color: #8c8c8c;
        margin-bottom: 4px;
      }
      
      .activity-time {
        font-size: 12px;
        color: #bfbfbf;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard {
    padding: 16px;
  }
}
</style>