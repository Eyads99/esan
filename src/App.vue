<template>
  <v-app>
    <nav style="font-size: 20px; margin: 10px">
      <router-link to="/">{{ $t('home') }}</router-link> |      
      <router-link to="/IndexToday">{{ $t('indexToday') }}</router-link> |
      <router-link to="/priceCompare">{{ $t('assetCompare') }}</router-link> |      
      <router-link to="/assetView">{{ $t('assetView') }}</router-link> |
      <router-link to="/about">{{ $t('about') }}</router-link> |
      <router-link v-if="user" to="/PortfolioBuilder">{{ $t('PortfolioBuilder') }}</router-link> |
      <LocaleSwitcher></LocaleSwitcher> |
      <router-link v-if="!user" to="/login">{{ $t('login') }}</router-link>
    </nav>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import LocaleSwitcher from '/src/components/LocalSwitcher.vue'
import { auth, googleProvider, signInWithRedirect, signInWithPopup, getRedirectResult   }from "/src/firebase/init";

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export default {
  name: "App",

  data: () => ({
    user: null
  }),

  methods: {
    async signInWithGoogle() {
      try {
        //let result
        if (isMobileDevice())
          await signInWithRedirect(auth, googleProvider)
        else
          {
            const result = await signInWithPopup(auth, googleProvider)
            this.user = result.user;
            console.log(result.user);
          }
      } catch (error) {
        console.error('Error during sign-in:', error);
      } 
    },


    async checkAuthState() {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          this.user = result.user;
          console.log(result.user);
        }
      } catch (error) {
        console.error(error);
      }
      auth.onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          console.log('User signed in: ', user);
        } else {
          this.user = null;
          console.log('No user signed in');
        }
      });
    }
  },

  created() {
    this.checkAuthState();
  },

  components: {
    LocaleSwitcher
  }
};
</script>
