<template>
  <v-app>
    <nav style="font-size: 18px">
      <router-link to="/">{{ $t('home') }}</router-link> |
      <router-link to="/about">{{ $t('about') }}</router-link> |
      <router-link to="/IndexToday">{{ $t('indexToday') }}</router-link> |
      <router-link to="/priceCompare">{{ $t('assetCompare') }}</router-link> |
      <router-link to="/assetView">{{ $t('assetView') }}</router-link>
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
