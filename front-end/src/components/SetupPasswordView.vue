<template>
    <div class="setup-password-page">
      <!-- Animated Background -->
      <div class="animated-bg">
        <div class="gradient-sphere"></div>
        <div class="gradient-sphere"></div>
        <div class="gradient-sphere"></div>
      </div>
      <!-- Background Layer -->
      <div class="login-background"></div>
  
      <!-- Centered Setup Password Card -->
      <div class="login-container">
        <h1 class="login-title">Set Up Your Password</h1>
        <p class="login-subtitle">
          Secure your account by setting up a password.
        </p>
        <transition name="fade">
          <form @submit.prevent="setPassword" key="password-setup-form">
            <input type="password" v-model="newPassword" placeholder="Enter your new password" required />
            <button type="submit" class="email-login">Set Password</button>
          </form>
        </transition>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SetupPasswordView",
    data() {
      return {
        newPassword: '',
      };
    },
    methods: {
      async setPassword() {
        if (!this.newPassword) {
          alert('Please enter a new password.');
          return;
        }
  
        try {
          const response = await fetch('http://localhost:8082/auth/set-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ password: this.newPassword }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            // Fetch user info to determine role
            const userInfoResponse = await fetch('http://localhost:8082/auth/user', {
              method: 'GET',
              credentials: 'include',
            });
            const userInfo = await userInfoResponse.json();
  
            if (userInfoResponse.ok) {
              alert('Password set successfully!');
              // Redirect based on user role
              if (userInfo.role === 'admin') {
                this.$router.push('/admin');
              } else {
                this.$router.push('/home');
              }
            } else {
              alert('Failed to fetch user info.');
            }
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Error setting password:', error);
          alert('An error occurred. Please try again.');
        }
      }
    },
  };
  </script>
  
  <style scoped>
  /* Full-page container with dark background */
  .setup-password-page {
    position: relative;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 20px;
    overflow-y: hidden;
  }
  
  /* Subtle animated/gradient background layer */
  .login-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top left, #41b883, #0a0a0a);
    z-index: -1;
    opacity: 0.3;
  }
  
  /* Glassmorphism card for the setup password form */
  .login-container {
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 2rem 3rem;
    text-align: center;
    max-width: 400px;
    width: 100%;
  }
  
  /* Engaging title with our green accent */
  .login-title {
    font-size: 2.5rem;
    color: #41b883;
    margin-bottom: 0.5rem;
  }
  
  /* Clear, motivating subtitle */
  .login-subtitle {
    font-size: 1.1rem;
    color: #ffffff;
    margin-bottom: 1.5rem;
  }
  
  /* Modern button for setting password */
  .email-login {
    background-color: #41b883;
    color: #fff;
    border: none;
    font-size: 1.1rem;
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: block;
    width: 100%;
    max-width: 250px;
    margin: 1rem auto;
  }
  .email-login:hover {
    background-color: #369f6b;
  }
  
  /* Fade transition for setup password form */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style> 