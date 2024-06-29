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
    </div>
  </template>
  
  <script>
  import { auth } from "@/firebase/init";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  
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
          alert("User registered successfully");
        } catch (error) {
          alert("Error signing up: " + error.message);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 400px;
    margin: auto;
  }
  </style>