<template>
  <div class="admin-login-page">
    <div class="admin-header">
      <h1>Admin Portal</h1>
    </div>
    
    <div class="admin-login">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  methods: {
    async login() {
      try {
        this.error = null;
        const response = await axios.post('http://localhost:8082/api/admin/login', {
          email: this.email,
          password: this.password,
        }, { withCredentials: true });
        
        // Redirect to admin home page
        this.$router.push('/admin');
      } catch (error) {
        console.error('Login failed:', error);
        this.error = error.response?.data?.message || 'Login failed. Please try again.';
      }
    },
  }
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  background: #1a1a1a;
}

.admin-header {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  text-align: center;
  margin-bottom: 40px;
}

.admin-header h1 {
  color: white;
  margin: 0;
  font-size: 2rem;
}

.admin-login {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.admin-login h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.admin-login form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-login input {
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.admin-login button {
  background: #41b883;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.admin-login button:hover {
  background: #3aa876;
  transform: translateY(-2px);
}

.error-message {
  color: #ff4444;
  text-align: center;
  margin-top: 1rem;
}
</style> 