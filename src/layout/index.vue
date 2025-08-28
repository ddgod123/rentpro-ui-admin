<template>
  <div class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Sidebar, Navbar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/styles/mixin.less";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.sidebar-container {
  width: 200px;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;

  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0.2s width ease-in-out, 0.2s padding-left ease-in-out, 0.2s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .ant-scrollbar__bar.is-vertical {
    right: 0px;
  }

  .ant-scrollbar {
    height: 100%;
  }

  &.has-logo {
    .ant-scrollbar {
      height: calc(100% - 50px);
    }
  }

  .is-horizontal {
    &.is-outside {
      position: absolute;
      top: 100%;
      right: 0px;
      z-index: 40000;
    }
  }
}

.main-container {
  min-height: 100%;
  transition: margin-left .28s;
  margin-left: 200px;
  position: relative;
}
</style>