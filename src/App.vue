<template>
  <v-app>
    <nav style="font-size: 18px">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/IndexToday">Index Today</router-link> |
      <router-link to="/priceCompare">Asset Compare</router-link> |
      <router-link to="/assetView">Asset View</router-link>
    </nav>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
