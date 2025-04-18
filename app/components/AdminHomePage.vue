<template>
  <!-- No changes to template section -->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      stats: {
        totalStudents: 0,
        activeEvents: 0,
        pendingTasks: 0
      }
    };
  },
  methods: {
    async fetchDashboardStats() {
      try {
        const response = await axios.get('http://localhost:8082/api/admin/stats', { withCredentials: true });
        this.stats.totalStudents = response.data.totalStudents;
        this.stats.activeEvents = response.data.activeEvents;
        this.stats.pendingTasks = response.data.pendingTasks;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    }
  }
};
</script>

<style>
  /* No changes to style section */
</style> 