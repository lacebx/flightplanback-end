<template>
  <div class="admin-login">
    <h1>Admin Login</h1>
    <p class="tagline">Manage the application and user accounts.</p>
    <img alt="Admin logo" src="@/assets/admin-icon.svg" class="logo" />
    <button class="admin-login-button" @click="login">
      Login as Admin
    </button>
    <p class="note">* Only users with an @oc.edu email can use this app</p>
  </div>
</template>

<script>
export default {
  name: "AdminLoginView",
  methods: {
    login() {
      // Redirect to the backend Google OAuth login route for admin
      window.location.href = "http://localhost:8082/auth/google/admin"; // Redirect to backend for admin Google login
    },
  },
};
</script>

<style scoped>
.admin-login {
  text-align: center;
  background-color: #d3d3d3;
  padding: 20px;
  border-radius: 5px;
}

.logo {
  width: 120px;
  margin-bottom: 20px;
}

h1 {
  color: #e74c3c; /* Different color for admin */
  font-size: 2.5rem;
  margin: 10px 0;
}

.tagline {
  font-size: 1.2rem;
  color: #3c3c3c;
}

.admin-login-button {
  background-color: #e74c3c; /* Different color for admin button */
  color: #fff;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.admin-login-button:hover {
  background-color: #c0392b; /* Darker shade on hover */
}

.note {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
}
</style> 