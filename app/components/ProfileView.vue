<template>
  <!-- No changes to template section -->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null, // Will hold the authenticated user info from backend
      major: '', // New field for user's major
      expectedGradYear: '', // New field for expected graduation year
      // ... existing code ...
    };
  },
  computed: {
    // Generate initials from the user's display name as a fallback
    userInitials() {
      if (this.user && this.user.displayName) {
        const names = this.user.displayName.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
      }
      return 'MK';
    },
    // New computed property to calculate expected graduation year
    calculateExpectedGradYear() {
      if (this.user && this.user.semester) {
        const currentYear = new Date().getFullYear();
        const remainingSemesters = 8 - this.user.semester;
        return currentYear + Math.ceil(remainingSemesters / 2);
      }
      return 'Unknown';
    }
  },
  mounted() {
    // Fetch the authenticated user's data from the backend.
    axios.get('http://localhost:8082/auth/user', { withCredentials: true })
      .then(response => {
        this.user = response.data;
        this.major = this.user.major; // Set the user's major
        this.expectedGradYear = this.calculateExpectedGradYear; // Calculate expected graduation year
        console.log("User data loaded:", this.user);
        this.$emit('userPhotoLoaded', this.user.photos[0].value); // Emit the photo URL
      })
      .catch(error => {
        console.error("Error fetching user:", error);
      });

    // ... existing code ...
  }
};
</script>

<style>
  /* No changes to style section */
</style> 