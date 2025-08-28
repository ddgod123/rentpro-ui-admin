<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <a-icon :type="isActive ? 'menu-fold' : 'menu-unfold'" style="font-size: 18px;" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>