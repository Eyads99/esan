<template>
  <v-app>
    <nav class=title-bar>
      <v-img
          class="logo"
          src="@\assets\icon.jpg"
          contain
          alt="esan logo"
        />
      <router-link class=title-text to="/">{{ $t('home') }}</router-link>
      <router-link class=title-text to="/IndexToday">{{ $t('indexToday') }}</router-link>
      <router-link class=title-text to="/priceCompare">{{ $t('assetCompare') }}</router-link>     
      <router-link class=title-text to="/assetView">{{ $t('assetView') }}</router-link>
      <router-link class=title-text to="/about">{{ $t('about') }}</router-link>
      <router-link class=title-text v-if="user" to="/PortfolioBuilder">{{ $t('PortfolioBuilder') }}</router-link>
      <LocaleSwitcher class=title-text></LocaleSwitcher>

      <router-link class=login v-if="!user" to="/login">{{ $t('login') }}</router-link>
      <router-link class=login v-if="user" to="/login" >{{ $t('LogOut') }}</router-link>
      <hr style="border-color: black; border-width: 1px; margin: 0">
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
/*   position: fixed;
  top: 0; makes always show at the top of the screen but it overlaps 
  width: 100%; */
}

.title-text {
  font-size: 20px;
  margin-right: 10px;
  margin-left: 10px;
  color: black;
  text-decoration: none;
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
  padding: 1px;
}

.title-text:hover {
  background-color: #f0f0f0;
  border-radius: 5px;
}

.logo {
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
  float: left;
  width: 25px;
  height: 25px;
}
 .login {
/*   margin-right: 10px;
  margin-left: 10px;  
  float: right;*/
  font-size: 20px;
  color: black;
  text-decoration: none;
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
 }
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