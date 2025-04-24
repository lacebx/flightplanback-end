<template>
    <div class="admin-task-approvals">
      <h2>Pending Task Approvals</h2>
      <div v-if="pendingRequests.length === 0">
        <p>No pending task approvals.</p>
      </div>
      <div v-else>
        <div class="task-approval-card" v-for="request in pendingRequests" :key="request.id">
          <h3>Task ID: {{ request.taskId }}</h3>
          <p>User ID: {{ request.userId }}</p>
          <p>User ID Number: {{ request.user.idNumber }}</p>
          <p>User Name: {{ request.user.firstName }} {{ request.user.lastName }}</p>
          <p>Task Name: {{ request.task.name }}</p>
          
          <button @click="approveTaskCompletion(request)">Approve</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import eventBus from '../eventBus';
  
  export default {
    name: 'AdminTaskApprovalsView',
    data() {
      return {
        pendingRequests: [],
      };
    },
    methods: {
      fetchPendingRequests() {
        axios.get('http://localhost:8082/api/admin/pending-task-approvals', { withCredentials: true })
          .then(response => {
            this.pendingRequests = response.data;
            console.log('Pending task approvals fetched:', this.pendingRequests);
            
            // Emit an event with the count of pending requests
            eventBus.emit('updatePendingTasksCount', this.pendingRequests.length);
          })
          .catch(error => {
            console.error('Error fetching pending task approvals:', error);
          });
      },
      approveTaskCompletion(request) {
        axios.put(`http://localhost:8082/api/tasks/${request.taskId}/approve-completion`, { userId: request.userId }, { withCredentials: true })
          .then(response => {
            console.log('Task completion approved:', response.data);
            // Remove the approved task from the pending requests
            this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
            
            // Emit an event using mitt
            eventBus.emit('taskApproved', request.taskId);
          })
          .catch(error => {
            console.error('Error approving task completion:', error);
          });
      }
    },
    mounted() {
      this.fetchPendingRequests();
    }
  };
  </script>
  
  <style scoped>
  .admin-task-approvals {
    padding: 20px;
  }
  .task-approval-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>