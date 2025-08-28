<template>
  <div @click="click">
    <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" />
  </div>
</template>

<script>
export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        this.isFullscreen = true
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
          this.isFullscreen = false
        }
      }
    }
  }
}
</script>