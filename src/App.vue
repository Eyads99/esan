<template>
  <v-app>
    <nav class=title-bar>
      
      <img class=logo src="@/assets/icon.jpg" width="50" height="50" alt="logo">

      <router-link class=title-text to="/">{{ $t('home') }}</router-link>
      <router-link class=title-text to="/IndexToday">{{ $t('indexToday') }}</router-link>
      <router-link class=title-text to="/priceCompare">{{ $t('assetCompare') }}</router-link>     
      <router-link class=title-text to="/assetView">{{ $t('assetView') }}</router-link>
      <router-link class=title-text to="/about">{{ $t('about') }}</router-link>
      <router-link class=title-text v-if="user" to="/PortfolioBuilder">{{ $t('PortfolioBuilder') }}</router-link>
      <LocaleSwitcher class=title-text></LocaleSwitcher>

      <router-link class=login v-if="!user" to="/login">{{ $t('login') }}</router-link>
      <router-link class=login v-if="user" to="/login" >{{ $t('LogOut') }}</router-link>
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

<style>
.title-bar {
margin: 0;
font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
}

.title-text {
  font-size: 20px;
  margin-right: 10px;
  margin-left: 10px;
  color: black;
  text-decoration: none;
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
}

.logo {
  margin-right: 10px;
  margin-left: 10px;  
  float: left;
}
 .login {
  margin-right: 10px;
  margin-left: 10px;  
  float: right;
  font-size: 25px;
  color: black;
  text-decoration: none;
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
 }
.locale-picker {
}

</style>