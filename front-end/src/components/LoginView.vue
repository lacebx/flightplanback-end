<template>
  <div class="login-page">
       <!-- Animated Background -->
       <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>
    <!-- Background Layer -->
    <div class="login-background"></div>
    
    <!-- Centered Login Card -->
    <div class="login-container">
      <h1 class="login-title">Eagle FlighPlan</h1>
      <transition name="fade">
        <div v-if="!showLoginForm && !showPasswordSetup" key="initial-content">
          <p class="login-subtitle">
            Level up your professional appeal. Unlock opportunities and accelerate your career journey.
          </p>
          <button class="google-login" @click="login">
            <i class="fab fa-google"></i>
            Sign in with Google
          </button>
          <p class="login-note">* Must have a valid @oc.edu email.</p>
        </div>
      </transition>
      <button class="show-login" @click="toggleLoginForm">Login wih password.</button>
      <transition name="fade">
        <form v-if="showLoginForm && !showPasswordSetup" @submit.prevent="loginWithEmail" key="login-form">
          <div class="input-group">
            <label for="email">Email</label>
            <input id="email" type="email" v-model="email" placeholder="Enter your email" required />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" class="email-login">Login</button>
        </form>
      </transition>
      <transition name="fade">
        <form v-if="showPasswordSetup" @submit.prevent="setPassword" key="password-setup-form">
          <input type="password" v-model="newPassword" placeholder="Set your new password" required />
          <button type="submit" class="email-login">Set Password</button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: '',
      password: '',
      newPassword: '',
      showLoginForm: false,
      showPasswordSetup: false
    };
  },
  methods: {
    login() {
      window.location.href = "http://localhost:8082/auth/google";
      this.$emit('login');
    },
    toggleLoginForm() {
      this.showLoginForm = !this.showLoginForm;
    },
    async loginWithEmail() {
      if (!this.email || !this.password) {
        alert('Please enter your email and password.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8082/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await response.json();

        if (response.ok) {
          const userInfoResponse = await fetch('http://localhost:8082/auth/user', {
            method: 'GET',
            credentials: 'include',
          });
          const userInfo = await userInfoResponse.json();

          if (userInfoResponse.ok) {
           
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
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
    },
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
          body: JSON.stringify({ password: this.newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Password set successfully!');
          this.showPasswordSetup = false;
          // Redirect to the appropriate page
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
.login-page {
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

/* Glassmorphism card for the login form */
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

/* Modern Google login button */
.google-login {
  background-color: #41b883;
  color: #fff;
  border: none;
  font-size: 1.1rem;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
}

.google-login i {
  font-size: 1.3rem;
}

.google-login:hover {
  background-color: #369f6b;
}

/* Informative note below the button */
.login-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #cccccc;
}

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

/* New Button to Show Login Form */
.show-login {
  background: none;
  color: #ffffff;
  border: none;
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 1rem;
}

/* Fade transition for login form */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.input-group input::placeholder {
  color: #cccccc;
}
</style>