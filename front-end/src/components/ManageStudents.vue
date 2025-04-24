<template>
  <div class="manage-students">
    <div class="page-header">
      <h1>Manage Students</h1>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by name or ID number" 
          @input="filterStudents" 
          class="search-input"
        />
        <button @click="fetchStudents" class="refresh-btn">
          <i class="fas fa-sync-alt"></i>
          Refresh List
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loader"></div>
      <p>Loading students...</p>
    </div>
    
    <div v-else-if="filteredStudents.length === 0" class="no-results">
      <i class="fas fa-user-graduate"></i>
      <p>No students found. Try adjusting your search or refreshing the list.</p>
    </div>
    
    <div class="content-container">
      <div class="students-list">
        <div 
          v-for="student in filteredStudents" 
          :key="student.id" 
          @click="selectStudent(student)"
          class="student-item"
          :class="{ 'selected': selectedStudent && selectedStudent.id === student.id }"
        >
          <div class="student-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="student-info">
            <span class="student-name">{{ student.firstName }} {{ student.lastName }}</span>
            <span class="student-id">ID: {{ student.idNumber }}</span>
            <span class="student-major">{{ student.major || 'Major not specified' }}</span>
          </div>
          <div class="student-points">
            <span class="points-badge">{{ student.points || 0 }} pts</span>
          </div>
        </div>
      </div>
      
      <div v-if="selectedStudent" class="student-details">
        <div class="details-header">
          <div class="student-profile">
            <div class="profile-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="profile-info">
              <h2>{{ selectedStudent.firstName }} {{ selectedStudent.lastName }}</h2>
              <p class="student-role">{{ selectedStudent.role || 'Student' }}</p>
            </div>
          </div>
          <div class="quick-stats">
            <div class="stat-item">
              <i class="fas fa-star"></i>
              <span>{{ selectedStudent.points || 0 }}</span>
              <label>Points</label>
            </div>
            <div class="stat-item">
              <i class="fas fa-calendar-check"></i>
              <span>{{ selectedStudent.events?.length || 0 }}</span>
              <label>Events</label>
            </div>
            <div class="stat-item">
              <i class="fas fa-tasks"></i>
              <span>{{ selectedStudent.tasks?.length || 0 }}</span>
              <label>Tasks</label>
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="detail-card">
            <h3>Personal Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>ID Number</label>
                <span>{{ selectedStudent.idNumber }}</span>
              </div>
              <div class="info-item">
                <label>Major</label>
                <span>{{ selectedStudent.major || 'Not specified' }}</span>
              </div>
              <div class="info-item">
                <label>Expected Graduation</label>
                <span>{{ selectedStudent.expectedGraduation || 'Not specified' }}</span>
              </div>
              <div class="info-item">
                <label>Email</label>
                <span>{{ selectedStudent.email || 'Not specified' }}</span>
              </div>
            </div>
          </div>

          <div class="detail-card badges-section">
            <h3>Badges Earned</h3>
            <div class="badges-grid" v-if="selectedStudent.badges && selectedStudent.badges.length > 0">
              <div v-for="badge in selectedStudent.badges" :key="badge.id" class="badge-item">
                <i :class="badge.icon || 'fas fa-medal'"></i>
                <span>{{ badge.name }}</span>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-medal"></i>
              <p>No badges earned yet</p>
            </div>
          </div>

          <div class="detail-card tasks-section">
            <h3>Tasks</h3>
            <div class="tasks-tabs">
              <button 
                v-for="status in ['All', 'Pending', 'In Progress', 'Completed']" 
                :key="status"
                @click="currentTaskTab = status.toLowerCase()"
                :class="{ active: currentTaskTab === status.toLowerCase() }"
                class="tab-btn"
              >
                {{ status }}
              </button>
            </div>
            <div class="tasks-list" v-if="filteredTasks.length > 0">
              <div v-for="task in filteredTasks" :key="task.id" class="task-item">
                <div class="task-status">
                  <i :class="getTaskStatusIcon(task.status)"></i>
                </div>
                <div class="task-content">
                  <h4>{{ task.name }}</h4>
                  <p>{{ task.description }}</p>
                  <div class="task-meta">
                    <span class="due-date">
                      <i class="fas fa-calendar"></i>
                      Due: {{ formatDate(task.dueDate) }}
                    </span>
                    <span :class="['status-badge', task.status]">
                      {{ task.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-tasks"></i>
              <p>No tasks found</p>
            </div>
          </div>

          <div class="detail-card events-section">
            <h3>Events Attended</h3>
            <div class="events-timeline" v-if="selectedStudent.events && selectedStudent.events.length > 0">
              <div v-for="event in selectedStudent.events" :key="event.id" class="event-item">
                <div class="event-date">
                  <span class="date">{{ formatDateShort(event.date) }}</span>
                </div>
                <div class="event-content">
                  <h4>{{ event.name }}</h4>
                  <p>{{ event.description }}</p>
                  <div class="event-meta">
                    <span class="event-points">
                      <i class="fas fa-star"></i>
                      {{ event.points || 0 }} points earned
                    </span>
                    <span class="event-location" v-if="event.location">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ event.location }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-calendar-alt"></i>
              <p>No events attended yet</p>
            </div>
          </div>
        </div>

        <div class="notification-section">
          <h3>Send Email Notification</h3>
          <div class="notification-form">
            <textarea 
              v-model="notificationMessage" 
              placeholder="Enter your message to send via email..." 
              class="notification-input"
              rows="4"
            ></textarea>
            <button 
              @click="sendNotification" 
              class="send-btn"
              :disabled="loading || !notificationMessage.trim()"
            >
              <i class="fas fa-paper-plane"></i>
              {{ loading ? 'Sending...' : 'Send Email' }}
            </button>
          </div>
        </div>

        <div class="role-change-section">
          <h3>Change Role</h3>
          <div class="role-form">
            <p>Current Role: <strong>{{ selectedStudent.role }}</strong></p>
            <div class="role-selector">
              <select v-model="selectedRole" class="role-select">
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="student staff">Student Staff</option>
              </select>
              <button @click="changeRole" class="change-role-btn">
                <i class="fas fa-user-shield"></i>
                Change Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      students: [],
      searchQuery: '',
      filteredStudents: [],
      selectedStudent: null,
      loading: false,
      error: null,
      notificationMessage: '',
      selectedRole: '',
      currentTaskTab: 'all'
    };
  },
  computed: {
    filteredTasks() {
      if (!this.selectedStudent?.tasks) return [];
      if (this.currentTaskTab === 'all') return this.selectedStudent.tasks;
      return this.selectedStudent.tasks.filter(task => task.status === this.currentTaskTab);
    }
  },
  methods: {
    fetchStudents() {
      this.loading = true;
      this.error = null;
      console.log('Fetching students...');
      
      axios
        .get('http://localhost:8082/api/users', { withCredentials: true })
        .then((response) => {
          console.log('Students fetched successfully:', response.data);
          this.students = Array.isArray(response.data) ? response.data : [];
          this.filteredStudents = [...this.students];
          this.loading = false;
        })
        .catch((error) => {
          console.error('Error fetching students:', error);
          console.error('Error details:', error.response?.data);
          this.error = error.response?.data?.message || 'Failed to fetch students';
          this.loading = false;
          alert(`Error fetching students: ${error.response?.data?.message || error.message}`);
        });
    },
    filterStudents() {
      if (!this.searchQuery.trim()) {
        this.filteredStudents = [...this.students];
        return;
      }
      
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredStudents = this.students.filter(student => {
        const firstNameMatch = student.firstName && student.firstName.toLowerCase().includes(query);
        const lastNameMatch = student.lastName && student.lastName.toLowerCase().includes(query);
        const idMatch = student.idNumber && student.idNumber.toString().includes(query);
        return firstNameMatch || lastNameMatch || idMatch;
      });
      
      console.log(`Filtered ${this.filteredStudents.length} students matching "${query}"`);
    },
    selectStudent(student) {
      this.loading = true;
      console.log('Fetching details for student:', student.id);
      
      this.selectedStudent = student;
      this.loading = false;
      
      // Uncomment this code when the backend endpoint is available
      /*
      axios
        .get(`http://localhost:8082/api/users/${student.id}`, { withCredentials: true })
        .then((response) => {
          console.log('Student details fetched successfully:', response.data);
          this.selectedStudent = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error('Error fetching student details:', error);
          console.error('Error details:', error.response?.data);
          this.error = error.response?.data?.message || 'Failed to fetch student details';
          this.loading = false;
          alert(`Error fetching student details: ${error.response?.data?.message || error.message}`);
        });
      */
    },
    async sendNotification() {
      if (!this.notificationMessage.trim()) {
        alert('Please enter a message');
        return;
      }

      if (!this.selectedStudent) {
        alert('Please select a student first');
        return;
      }

      try {
        this.loading = true;
        const response = await axios.post(
          'http://localhost:8082/api/notifications/send',
          {
            studentId: this.selectedStudent.id,
            message: this.notificationMessage,
            studentName: `${this.selectedStudent.firstName} ${this.selectedStudent.lastName}`
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert('Notification sent successfully!');
          this.notificationMessage = ''; // Clear the message input
        }
      } catch (error) {
        console.error('Error sending notification:', error);
        alert('Failed to send notification. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    logout() {
      // Clear user data from localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      // Redirect to login page
      this.$router.push('/admin-login');
    },
    async changeRole() {
      if (!this.selectedStudent) {
        alert('Please select a student first');
        return;
      }

      if (!this.selectedRole) {
        alert('Please select a role');
        return;
      }

      try {
        const response = await axios.put(`http://localhost:8082/api/users/${this.selectedStudent.id}/role`, {
          role: this.selectedRole
        }, { withCredentials: true });

        if (response.status === 200) {
          alert('Role updated successfully');
          this.selectedStudent.role = this.selectedRole;
        } else {
          alert('Failed to update role');
        }
      } catch (error) {
        console.error('Error updating role:', error);
        alert('An error occurred. Please try again.');
      }
    },
    getTaskStatusIcon(status) {
      const icons = {
        'pending': 'fas fa-clock',
        'in-progress': 'fas fa-spinner',
        'completed': 'fas fa-check-circle'
      };
      return icons[status] || 'fas fa-question-circle';
    },
    formatDateShort(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  },
  mounted() {
    this.fetchStudents();
  },
};
</script>

<style scoped>
.manage-students {
  padding: 2rem;
  max-width: 1400px;
  margin: auto;
  color: white;
  background: #1a1a1a;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 3rem;
  color: #41b883;
  padding: 1rem;
  font-weight: 300;
}

.search-container {
  background: #2a2a2a;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.search-input {
  background: #333;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  width: 100%;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(65, 184, 131, 0.2);
}

.content-container {
  display: grid;
  grid-template-columns: minmax(400px, 2fr) 3fr;
  gap: 2rem;
  height: calc(100vh - 200px);
  margin-top: 2rem;
}

.students-list {
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 12px;
  overflow-y: auto;
  height: 100%;
}

.student-item {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: none;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.student-item:hover {
  transform: translateX(5px);
  background: #333;
}

.student-item.selected {
  background: #2d3c34;
  border-left: 4px solid #41b883;
}

.student-avatar {
  width: 50px;
  height: 50px;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-avatar i {
  font-size: 1.8rem;
  color: #41b883;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.student-name {
  font-size: 1.4rem;
  font-weight: 500;
  color: white;
}

.student-id {
  font-size: 0.9rem;
  color: #888;
}

.student-major {
  font-size: 1rem;
  color: #41b883;
}

.points-badge {
  background: #41b883;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.points-badge::after {
  content: 'pts';
  font-size: 0.9rem;
  opacity: 0.8;
}

.student-details {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 2rem;
  overflow-y: auto;
  height: 100%;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #333;
}

.student-profile {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar i {
  font-size: 2.5rem;
  color: #41b883;
}

.profile-info h2 {
  margin: 0;
  font-size: 2rem;
  color: white;
  font-weight: 500;
}

.student-role {
  margin: 0.5rem 0 0;
  color: #41b883;
  font-size: 1.1rem;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  background: #1a1a1a;
  padding: 1.2rem;
  border-radius: 10px;
  min-width: 120px;
  text-align: center;
}

.stat-item i {
  font-size: 1.5rem;
  color: #41b883;
  margin-bottom: 0.5rem;
}

.stat-item span {
  display: block;
  font-size: 1.8rem;
  font-weight: 500;
  margin: 0.5rem 0;
  color: white;
}

.stat-item label {
  display: block;
  color: #888;
  font-size: 0.9rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.detail-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
}

.detail-card h3 {
  margin: 0 0 1.5rem;
  color: #41b883;
  font-size: 1.3rem;
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  color: #888;
  font-size: 0.9rem;
}

.info-item span {
  color: white;
  font-weight: 500;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.badge-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.badge-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.badge-item i {
  font-size: 2rem;
  color: #41b883;
  margin-bottom: 0.5rem;
}

.badge-item span {
  display: block;
  font-size: 0.9rem;
}

.tasks-section, .events-section {
  grid-column: span 2;
}

.tasks-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.8rem 1.5rem;
  background: #333;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #41b883;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  background: #1a1a1a;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.task-status i {
  font-size: 1.5rem;
  color: #41b883;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  color: white;
  margin: 0 0 0.5rem;
  font-weight: 500;
}

.task-content p {
  color: #888;
  margin: 0;
}

.task-meta {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  color: #666;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.status-badge.pending {
  background: #332200;
  color: #f39c12;
}

.status-badge.in-progress {
  background: #1a2632;
  color: #3498db;
}

.status-badge.completed {
  background: #1a2922;
  color: #41b883;
}

.events-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  background: #1a1a1a;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.event-date {
  min-width: 80px;
  text-align: center;
  padding: 0.5rem;
  background: rgba(65, 184, 131, 0.2);
  border-radius: 5px;
}

.event-content {
  flex: 1;
}

.event-content h4 {
  color: white;
  margin: 0 0 0.5rem;
  font-weight: 500;
}

.event-content p {
  color: #888;
  margin: 0;
}

.event-meta {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.notification-section, .role-change-section {
  margin-top: 2rem;
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
}

.notification-form, .role-selector {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.notification-input, .role-select {
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #333;
  background: #333;
  color: white;
}

.send-btn, .change-role-btn {
  background: #41b883;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .students-list {
    height: auto;
    max-height: 400px;
  }

  .student-details {
    height: auto;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .tasks-section, .events-section {
    grid-column: span 1;
  }

  .quick-stats {
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .manage-students {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
  }

  .details-header {
    flex-direction: column;
    gap: 2rem;
  }

  .student-profile {
    flex-direction: column;
    text-align: center;
    width: 100%;
  }

  .profile-info {
    text-align: center;
  }

  .quick-stats {
    width: 100%;
    justify-content: center;
  }

  .notification-form, .role-selector {
    flex-direction: column;
  }
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #41b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.notification-input {
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #333;
  background: #333;
  color: white;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.notification-input:focus {
  outline: none;
  border-color: #41b883;
  box-shadow: 0 0 0 2px rgba(65, 184, 131, 0.2);
}

.send-btn {
  align-self: flex-start;
  height: fit-content;
  background: #41b883;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #3aa876;
  transform: translateY(-2px);
}

.send-btn:disabled {
  background: #2c805c;
  cursor: not-allowed;
  opacity: 0.7;
}

.notification-form {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: flex-start;
}
</style> 