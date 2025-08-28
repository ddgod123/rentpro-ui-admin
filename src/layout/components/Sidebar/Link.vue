<template>
  <div>
    <router-link v-if="isRouterLink" :to="to">
      <slot />
    </router-link>
    <a v-else :href="to" target="_blank">
      <slot />
    </a>
  </div>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    isRouterLink() {
      return !this.isExternal
    }
  }
}
</script>