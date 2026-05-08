<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-img
          class="ml-2 mr-2"
          src="@\assets\icon.jpg"
          contain
          alt="esan logo"
          max-width="30"
          max-height="30"
        />
      <v-btn variant="text" to="/">{{ $t('home') }}</v-btn>
      <v-btn variant="text" to="/IndexToday">{{ $t('indexToday') }}</v-btn>
      <v-btn variant="text" to="/priceCompare">{{ $t('assetCompare') }}</v-btn>     
      <v-btn variant="text" to="/assetView">{{ $t('assetView') }}</v-btn>
      <v-btn variant="text" to="/about">{{ $t('about') }}</v-btn>
      <v-btn variant="text" v-if="user" to="/PortfolioBuilder">{{ $t('PortfolioBuilder') }}</v-btn>
      
      <v-spacer></v-spacer>
      
      <LocaleSwitcher class="locale-picker"></LocaleSwitcher>

      <v-btn variant="text" v-if="!user" to="/login">{{ $t('login') }}</v-btn>
      <v-btn variant="text" v-if="user" to="/login" >{{ $t('LogOut') }}</v-btn>
    </v-app-bar>
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

<style>

.locale-picker {
  font-size: 20px;
  margin-right: 10px;
  margin-left: 10px;
  color: black;
  text-decoration: none;
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
  padding: 1px;
  text-align: center;
}

</style>