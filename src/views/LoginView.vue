<template>
    <div class="container mt-5">
      <h1>Login</h1>
      <form @submit.prevent="signInWithEmail">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary mt-3">Login</button>
      </form>
    </div>
  <div class="login">
    <v-btn @click="signInWithGoogle">Login with Google</v-btn>
  </div>
  <p class="mt-5">Don't have an account? <a href="/SignUp">Click here</a> to sign up!</p>

</template>

<script> 
import { auth, googleProvider, signInWithRedirect, signInWithPopup, /* getRedirectResult */   }from "/src/firebase/init";
import { signInWithEmailAndPassword } from "firebase/auth";
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export default {
  name: "LoginView",
  
  data() {
        return {
          email: '',
          password: ''
        }
      },
  
  methods: {
    async signInWithGoogle() {
      try {
        //let result
        if (isMobileDevice())
          await signInWithRedirect(auth, googleProvider)
        .then(() => this.$router.push('/'))
        else
          {
            const result = await signInWithPopup(auth, googleProvider)
            .then(() => this.$router.push('/'))
            this.user = result.user;
            console.log(result.user);
          }
      } catch (error) {
        console.error('Error during sign-in:', error);
      } 
    },
    async signInWithEmail() {
          try {
            await signInWithEmailAndPassword(auth, this.email, this.password)
            .then(() => this.$router.push('/'));
            this.email = '';
            this.password = '';
          } catch (error) {
            console.error('Error during sign-in:', error);
          }
        }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
