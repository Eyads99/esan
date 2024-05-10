<template>
  <v-app>
    <nav style="font-size: 18px">
      <router-link to="/">{{ $t('home') }}</router-link> |
      <router-link to="/about">{{ $t('about') }}</router-link> |
      <router-link to="/IndexToday">{{ $t('indexToday') }}</router-link> |
      <router-link to="/priceCompare">{{ $t('assetCompare') }}</router-link> |
      <router-link to="/assetView">{{ $t('assetView') }}</router-link> |
      <LocaleSwitcher></LocaleSwitcher>
    </nav>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import LocaleSwitcher from '/src/components/LocalSwitcher.vue'
export default {
  name: "App",

  data: () => ({
    //
  }),

  components: {
    LocaleSwitcher
  }
};
</script>
