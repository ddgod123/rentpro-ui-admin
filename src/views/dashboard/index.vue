<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <h1>欢迎使用 RentPro Admin</h1>
      <p>这是一个基于 Ant Design Vue 的租赁管理系统</p>
    </div>
    
    <a-row :gutter="16" class="stats-row">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总用户数"
            :value="1128"
            :precision="0"
            style="text-align: center"
          >
            <template #prefix>
              <a-icon type="user" style="color: #1890ff" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总房源数"
            :value="568"
            :precision="0"
            style="text-align: center"
          >
            <template #prefix>
              <a-icon type="home" style="color: #52c41a" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="活跃合同"
            :value="234"
            :precision="0"
            style="text-align: center"
          >
            <template #prefix>
              <a-icon type="file-text" style="color: #faad14" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="本月收入"
            :value="112893"
            :precision="2"
            style="text-align: center"
          >
            <template #prefix>
              ¥
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="charts-row">
      <a-col :span="12">
        <a-card title="最近活动" size="small">
          <a-timeline>
            <a-timeline-item>
              <p>新增租客：张三 - 2024年8月28日</p>
            </a-timeline-item>
            <a-timeline-item>
              <p>合同到期提醒：李四的合同将在3天后到期</p>
            </a-timeline-item>
            <a-timeline-item>
              <p>房源上架：朝阳区某小区3室2厅</p>
            </a-timeline-item>
            <a-timeline-item>
              <p>收到租金：王五 - ¥3500</p>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="快速操作" size="small">
          <a-row :gutter="8">
            <a-col :span="12">
              <a-button type="primary" block @click="$router.push('/rental/building')">
                <a-icon type="home" />
                添加房源
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-button type="default" block @click="$router.push('/rental/tenant')">
                <a-icon type="user" />
                添加租客
              </a-button>
            </a-col>
          </a-row>
          <a-row :gutter="8" style="margin-top: 8px">
            <a-col :span="12">
              <a-button type="default" block @click="$router.push('/rental/contract')">
                <a-icon type="file-text" />
                新建合同
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-button type="default" block @click="$router.push('/system/user')">
                <a-icon type="setting" />
                系统设置
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;

  .dashboard-text {
    text-align: center;
    margin-bottom: 30px;

    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    p {
      color: #7f8c8d;
      font-size: 16px;
    }
  }

  .stats-row {
    margin-bottom: 20px;
  }

  .charts-row {
    margin-top: 20px;
  }
}
</style>