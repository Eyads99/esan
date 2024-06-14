<template>
  <v-app>
    <nav style="font-size: 20px; margin: 10px">
      <router-link to="/">{{ $t('home') }}</router-link> |      
      <router-link to="/IndexToday">{{ $t('indexToday') }}</router-link> |
      <router-link to="/priceCompare">{{ $t('assetCompare') }}</router-link> |      
      <router-link to="/assetView">{{ $t('assetView') }}</router-link> |
      <router-link to="/about">{{ $t('about') }}</router-link> |
      <LocaleSwitcher></LocaleSwitcher>
      <v-btn @click="signInWithGoogle">Login with Google</v-btn>
    </nav>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import LocaleSwitcher from '/src/components/LocalSwitcher.vue'
import { auth, googleProvider, signInWithPopup }from "/src/firebase/init";
export default {
  name: "App",

  data: () => ({
    //
  }),

  methods: {
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log(result.user);
      } catch (error) {
        console.error(error);
      }
    }
  },

  components: {
    LocaleSwitcher
  }
};
</script>
