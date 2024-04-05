<template>
  <div class="about">
    <h1>This is an about page</h1>
  <SideDrawer/>
  </div>
</template>

<script> 
import SideDrawer from "/src/components/SideDrawer.vue";

export default {
  name: "AboutView",
  components: {
    SideDrawer
  },
}
</script>