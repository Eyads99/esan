<template>
    <!-- Internally, we're just using Vue's 
         good old router link -->
    <router-link :to="localizedUrl">
      <slot></slot>
    </router-link>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
  // Expose the to prop to accept relative,
  // non-localized URIs
  props: ['to'],
  components: { RouterLink },
  computed: {
    localizedUrl() {
      // The root / route is special since it's
      // absolute
      return this.to === '/'
        ? `/${this.$i18n.locale}`
        : `/${this.$i18n.locale}/${this.to}`
    },
  },
}
</script>
