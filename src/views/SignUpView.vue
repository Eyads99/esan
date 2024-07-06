<template>
    <div class="container mt-5">
      <h1>Sign Up</h1>
      <form @submit.prevent="signUpWithEmailAndPassword">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" v-model="confirmPassword" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary mt-3">Sign Up</button>
      </form>
      <div class="login">
        <v-btn @click="signInWithGoogle">Login with Google</v-btn>
      </div>
    </div>
  </template>
  
  <script>
  import { createUserWithEmailAndPassword, sendEmailVerification  } from "firebase/auth";
  import { auth, googleProvider, signInWithRedirect, signInWithPopup, /* getRedirectResult */   }from "/src/firebase/init";
  function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}
  
  export default {
    name: "SignUpView",
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    methods: {
      async signUpWithEmailAndPassword() {
        if (this.password !== this.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        try {
          await createUserWithEmailAndPassword(auth, this.email, this.password);
          
          await sendEmailVerification(auth.currentUser)
          
          this.email= ''; this.password= ''; this.confirmPassword= ''; //reset the form
          alert("User registered successfully");
          this.$router.push("/login");
        } catch (error) {
          alert("Error signing up: " + error.message);
        }
      },
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
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 400px;
    margin: auto;
  }
  </style>