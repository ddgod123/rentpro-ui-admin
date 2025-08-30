<template>
  <div class="sidebar">
    <div class="logo-container">
      <div class="sidebar-logo">
        <span class="sidebar-title">RentPro Admin</span>
      </div>
    </div>
    <Menu :is-collapse="false" />
  </div>
</template>

<script>
import Menu from '@/components/Menu'

export default {
  components: { Menu },
  data() {
    return {}
  },

}
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  background: #001529;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  display: flex;
  flex-direction: column;

  .logo-container {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;

    .sidebar-logo {
      display: flex;
      align-items: center;
      
      .sidebar-title {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        margin-left: 10px;
        white-space: nowrap;
      }
    }
  }

  .sidebar-menu {
    flex: 1;
    border-right: none;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 8px 0;

    /deep/ .ant-menu {
      background: transparent;
      color: rgba(255, 255, 255, 0.65);
    }

    /deep/ .ant-menu-item {
      margin: 0;
      height: 40px;
      line-height: 40px;
      padding: 0 16px !important;
      border-radius: 0;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
        color: #fff !important;
      }
      
      &.ant-menu-item-selected {
        background-color: #1890ff !important;
        color: #fff !important;
        
        &::after {
          border-right: 3px solid #fff;
        }
      }
      
      .anticon {
        font-size: 16px;
        margin-right: 10px;
      }
    }
    
    /deep/ .ant-menu-submenu {
      .ant-menu-submenu-title {
        height: 40px;
        line-height: 40px;
        margin: 0;
        padding: 0 16px !important;
        border-radius: 0;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
        
        .anticon {
          font-size: 16px;
          margin-right: 10px;
        }
        
        .ant-menu-submenu-arrow {
          opacity: 0.6;
          color: rgba(255, 255, 255, 0.65);
        }
      }
      
      &.ant-menu-submenu-open {
        > .ant-menu-submenu-title {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
      }
      
      .ant-menu-sub {
        background: #000c17;
        
        .ant-menu-item {
          padding-left: 48px !important;
          margin: 0 !important;
          height: 36px;
          line-height: 36px;
          
          &:hover {
            background-color: rgba(24, 144, 255, 0.6) !important;
            color: #fff !important;
          }
          
          &.ant-menu-item-selected {
            background-color: rgba(24, 144, 255, 0.8) !important;
            color: #fff !important;
          }
        }
      }
    }
    
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #001529;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>