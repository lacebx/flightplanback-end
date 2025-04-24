<template>
  <div id="app">
    <div style="display:none;">
      <RedemptionPage />
      <TransactionHistory />
    </div>
    <!-- Conditional Navbar -->
    <header v-if="isAdmin && isAdminView">
      <nav>
        <ul>
          <li>
            <router-link to="/admin" class="nav-link">
              &#x1F3E0;
            </router-link>
          </li>
          <li><router-link to="/admin/manage-events" class="nav-link">Manage Events</router-link></li>
          <li><router-link to="/admin/manage-students" class="nav-link">Manage Students</router-link></li>
          <li><router-link to="/admin/reports" class="nav-link">Reports</router-link></li>
          <li><router-link to="/admin/task-approvals" class="nav-link">Task Approvals</router-link></li>
          <li class="nav-link" @click="toggleDropdown">
            Admin View
            <ul v-if="showDropdown" class="dropdown-menu">
              <li @click="switchToStudentView">Student View</li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <header v-else-if="isLoggedIn && !isLoginRoute">
      <nav><!--Student Navbar-->
        <ul>
          <li><router-link to="/home" class="nav-link">Tasks & Events</router-link></li>
          <li><router-link to="/sw" class="nav-link">S&W</router-link></li>
          <li><router-link to="/experience" class="nav-link">Experience</router-link></li>
          <li><router-link to="/shop" class="nav-link">Shop</router-link></li>
          <li><router-link to="/profile" class="nav-link">Profile</router-link></li>
          <li v-if="isAdmin" @click="switchToAdminView" class="nav-link">
            Return to Admin View
          </li>
          <li class="nav-link notification-icon" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span v-if="unreadNotifications.length" class="notification-count">{{ unreadNotifications.length }}</span>
            <div v-if="showNotifications" class="notification-dropdown">
              <ul>
                <li v-for="notification in unreadNotifications" :key="notification.id">
                  {{ notification.message }}
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <router-view @login="handleLogin" @logout="handleLogout" @userPhotoLoaded="setUserPhoto" />
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed, provide } from 'vue';
import axios from 'axios';

import { useRoute, useRouter } from 'vue-router';
import RedemptionPage from './components/ShopView.vue';
import TransactionHistory from './components/TransactionHistory.vue';

export default {

  name: "App",  
  name: "App",
  components: {
    RedemptionPage,
    TransactionHistory,
  },    
  setup() {
    const isLoggedIn = ref(false);
    const route = useRoute();
    const router = useRouter();
    const showNotifications = ref(false);
    const unreadNotifications = ref([]);
    const showDropdown = ref(false);
    const userRole = ref(null);
    const isStudentView = ref(false);

    RedemptionPage;

    // Create a reactive array to store redeemed items

    const redeemedItems = ref([]);
    // Provide the reactive array to descendant components
    provide('redeemedItems', redeemedItems);

   
  
    // Method to add a redeemed item
    const addRedeemedItem = (item) => {
      redeemedItems.value.push({
        ...item,
        date: new Date().toLocaleString(),
      });
    };

    // Provide the reactive array and the method

    provide('redeemedItems', redeemedItems);
    provide('addRedeemedItem', addRedeemedItem);



    const userPhoto = ref('');
    

    const fetchNotifications = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      axios.get(`http://localhost:8082/api/notifications/${userId}`)
        .then(response => {
          unreadNotifications.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching notifications:', error);
        });
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const switchToStudentView = () => {
      showDropdown.value = false;
      isStudentView.value = true;
      router.push('/home');
    };

    const switchToAdminView = () => {
      isStudentView.value = false;
      router.push('/admin');
    };

    const fetchUserRole = () => {
      axios.get('http://localhost:8082/auth/user', { withCredentials: true })
        .then(response => {
          userRole.value = response.data.role;
        })
        .catch(error => {
          console.error('Error fetching user role:', error);
        });
    };

    onMounted(() => {
      isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';
      fetchNotifications();
      fetchUserRole();
    });

    const handleLogin = () => {
      isLoggedIn.value = true;
      localStorage.setItem('isLoggedIn', 'true');
      fetchNotifications();
      fetchUserRole();
    };

    const handleLogout = () => {
      isLoggedIn.value = false;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      router.push('/');
    };
    

    const setUserPhoto = (photoUrl) => {
      userPhoto.value = photoUrl;
    };

    const isLoginRoute = computed(() => route.path === '/');
    const isAdmin = computed(() => userRole.value === 'admin');
    const isAdminView = computed(() => {
      return isAdmin.value && !isStudentView.value;
    });

    return { isLoggedIn, handleLogin, handleLogout, isLoginRoute, userPhoto, setUserPhoto, showNotifications, toggleNotifications, unreadNotifications, isAdmin, toggleDropdown, showDropdown, switchToStudentView, switchToAdminView, isAdminView, isStudentView };
    return { isLoggedIn, handleLogin, handleLogout, isLoginRoute, userPhoto, setUserPhoto, showNotifications, toggleNotifications, unreadNotifications, isAdmin, toggleDropdown, showDropdown, switchToStudentView, switchToAdminView };
  },
};
</script>

<style>
/* Existing styles for the navbar */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background: #0a0a0a;
  color: #ffffff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* HEADER (Navbar) */
header {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem;
}

/* Nav Styles */
nav ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  padding: 0 2rem;
}

.nav-link {
  position: relative;
  color: #ffffff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.logout-container {
  margin-left: auto; /* This pushes the logout button to the right */
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .logout-container {
    margin-left: 0;
    margin-top: 1rem;
  }

  .logout-btn {
    width: 100%;
  }
}

/* MAIN CONTENT */
main {
  padding-top: 80px;
  padding-bottom: 100px;
  flex-grow: 1;
  background: transparent;
  padding-left: 20px;
  padding-right: 20px;
}

@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }

  .profile-dropdown {
    position: relative;
    right: auto;
    align-self: flex-end;
    margin-top: 1rem;
  }
}

.profile-dropdown {
  position: absolute;
  right: 2rem;
}

.profile-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  padding: 0;
}

.profile-button i {
  font-size: 1.2rem;
  color: #ffffff;
}

.profile-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.dropdown-content {
  margin-top: 8px;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 150px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1100;
}

.profile-dropdown:hover .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  color: #ffffff;
  text-decoration: none;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.home-icon {
  font-size: 1.5rem; /* Adjust size as needed */
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon {
  position: relative;
  cursor: pointer;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  z-index: 1100;
}

.notification-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-dropdown li {
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.notification-dropdown li:last-child {
  border-bottom: none;
}

.notification-dropdown li:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  z-index: 1100;
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 10px;
  color: white;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
