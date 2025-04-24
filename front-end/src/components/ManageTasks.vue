<template>
  <div class="manage-tasks">
  

    <div class="page-header">
      <h1>Manage Tasks</h1>
      <div class="action-buttons">
        <button @click="toggleForm" class="primary-btn">
          <i class="fas fa-plus"></i>
          {{ isFormVisible ? 'Cancel' : 'Add Task' }}
        </button>
        <button @click="fetchTasks" class="refresh-btn">
          <i class="fas fa-sync-alt"></i>
          Refresh Tasks
        </button>
      </div>
    </div>

    <!-- Task Form -->
    <div v-if="isFormVisible" class="form-container">
      <form @submit.prevent="isEditing ? updateTask() : addTask()" class="task-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="taskName">Task Name</label>
            <input type="text" id="taskName" v-model="taskName" required />
          </div>
          
          <div class="form-group">
            <label for="taskPriority">Priority</label>
            <select id="taskPriority" v-model="taskPriority" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="form-group">
            <label for="taskDueDate">Due Date</label>
            <input type="date" id="taskDueDate" v-model="taskDueDate" required />
          </div>

          <div class="form-group">
            <label for="taskStatus">Status</label>
            <select id="taskStatus" v-model="taskStatus" required>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="form-group">
            <label for="taskAssignee">Assignee</label>
            <input type="text" id="taskAssignee" v-model="taskAssignee" required />
          </div>
        </div>

        <div class="form-group full-width">
          <label for="taskDescription">Description</label>
          <textarea id="taskDescription" v-model="taskDescription" rows="4" required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">
            {{ isEditing ? 'Update Task' : 'Add Task' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Tasks List -->
    <div v-if="tasks.length === 0" class="no-tasks">
      <i class="fas fa-tasks"></i>
      <p>No tasks found. Try adding a task or refreshing the list.</p>
    </div>
    
    <div v-else class="tasks-grid">
      <div v-for="task in tasks" :key="task.taskid" class="task-card">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <span :class="['priority-badge', task.priority]">
            {{ task.priority }}
          </span>
        </div>
        
        <div class="task-details">
          <p class="task-due-date">
            <i class="fas fa-calendar"></i>
            {{ formatDate(task.duedate) }}
          </p>
          <p class="task-status">
            <i class="fas fa-check-circle"></i>
            {{ task.status }}
          </p>
          <p class="task-assignee">
            <i class="fas fa-user"></i>
            {{ task.assignee }}
          </p>
        </div>

        <div class="task-description">
          {{ task.description }}
        </div>

        <div class="task-actions">
          <button @click="editTask(task)" class="edit-btn">
            <i class="fas fa-edit"></i>
            Edit
          </button>
          <button @click="deleteTask(task.taskid)" class="delete-btn">
            <i class="fas fa-trash-alt"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import eventBus from '../eventBus';

export default {
  data() {
    return {
      tasks: [],
      taskName: '',
      taskDescription: '',
      taskPriority: '',
      taskDueDate: '',
      taskStatus: '',
      taskAssignee: '',
      isEditing: false,
      currentTaskId: null,
      isFormVisible: false,
    };
  },
  methods: {
    fetchTasks() {
      console.log('Fetching tasks...');
      axios
        .get('http://localhost:8082/api/tasks', { withCredentials: true })
        .then((response) => {
          console.log('Tasks fetched successfully:', response.data);
          if (Array.isArray(response.data)) {
            this.tasks = response.data;
          } else if (response.data && response.data.tasks) {
            this.tasks = response.data.tasks;
          } else {
            console.warn('Unexpected response format:', response.data);
            this.tasks = [];
          }
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          console.error('Error details:', error.response?.data);
          alert(`Error fetching tasks: ${error.response?.data?.message || error.message}`);
        });
    },
    addTask() {
      const formattedDate = this.taskDueDate ? new Date(this.taskDueDate).toISOString().split('T')[0] : '';
      
      const newTask = {
        name: this.taskName,
        description: this.taskDescription,
        priority: this.taskPriority,
        duedate: formattedDate,
        status: this.taskStatus,
        assignee: this.taskAssignee,
      };
      
      console.log('Sending task data:', newTask);
      
      axios
        .post('http://localhost:8082/api/tasks', newTask, { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log('Task added successfully:', response.data);
          eventBus.emit('taskAdded', response.data);
          
          if (response.data && response.data.taskid) {
            this.tasks.push(response.data);
          }
          
          this.resetForm();
          this.fetchTasks();
        })
        .catch((error) => {
          console.error('Error adding task:', error);
          console.error('Error details:', error.response?.data);
          alert(`Error adding task: ${error.response?.data?.message || error.message}`);
        });
    },
    editTask(task) {
      this.taskName = task.name;
      this.taskDescription = task.description;
      this.taskPriority = task.priority;
      this.taskDueDate = task.duedate;
      this.taskStatus = task.status;
      this.taskAssignee = task.assignee;
      this.isEditing = true;
      this.currentTaskId = task.taskid;
      this.isFormVisible = true;
    },
    updateTask() {
      const updatedTask = {
        name: this.taskName,
        description: this.taskDescription,
        priority: this.taskPriority,
        duedate: this.taskDueDate,
        status: this.taskStatus,
        assignee: this.taskAssignee,
      };
      axios
        .put(`http://localhost:8082/api/tasks/${this.currentTaskId}`, updatedTask, { withCredentials: true })
        .then((response) => {
          eventBus.emit('taskUpdated', response.data);
          this.resetForm();
          this.fetchTasks();
        })
        .catch((error) => {
          console.error('Error updating task:', error);
          alert(`Error updating task: ${error.response?.data?.message || error.message}`);
        });
    },
    deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        axios
          .delete(`http://localhost:8082/api/tasks/${taskId}`, { withCredentials: true })
          .then(() => {
            eventBus.emit('taskDeleted', taskId);
            this.fetchTasks();
          })
          .catch((error) => {
            console.error('Error deleting task:', error);
            alert(`Error deleting task: ${error.response?.data?.message || error.message}`);
          });
      }
    },
    resetForm() {
      this.taskName = '';
      this.taskDescription = '';
      this.taskPriority = '';
      this.taskDueDate = '';
      this.taskStatus = '';
      this.taskAssignee = '';
      this.isEditing = false;
      this.currentTaskId = null;
      this.isFormVisible = false;
    },
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
      if (!this.isFormVisible) {
        this.resetForm();
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
   
  },
  created() {
    this.fetchTasks();
  }
};
</script>

<style scoped>
.manage-tasks {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  color: white;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #41b883 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.primary-btn, .refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.primary-btn {
  background: linear-gradient(135deg, #41b883 0%, #34495e 100%);
  color: white;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.primary-btn:hover, .refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.primary-btn::after, .refresh-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.primary-btn:hover::after, .refresh-btn:hover::after {
  transform: translateX(0);
}

.form-container {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #41b883;
  box-shadow: 0 0 0 2px rgba(65, 184, 131, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-btn {
  background: linear-gradient(135deg, #41b883 0%, #34495e 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.task-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  border-color: rgba(65, 184, 131, 0.3);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.task-header h3 {
  margin: 0;
  background: linear-gradient(135deg, #41b883 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.3rem;
}

.priority-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.priority-badge.low {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.priority-badge.medium {
  background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
  color: white;
}

.priority-badge.high {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.task-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.task-details p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 0;
}

.task-details i {
  color: #41b883;
  width: 20px;
  font-size: 1.1rem;
}

.task-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.task-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.edit-btn, .delete-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-btn {
  background: linear-gradient(135deg, #2c805c 0%, #1a4a35 100%);
  color: white;
}

.delete-btn {
  background: linear-gradient(135deg, #802c2c 0%, #4a1a1a 100%);
  color: white;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #41b883 0%, #2c805c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(65, 184, 131, 0.2);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #b84141 0%, #802c2c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 65, 65, 0.2);
}

.no-tasks {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.no-tasks i {
  font-size: 4rem;
  background: linear-gradient(135deg, #41b883 0%, #34495e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .manage-tasks {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem 1rem;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
  }

  .primary-btn, .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .tasks-grid {
    grid-template-columns: 1fr;
  }

  .task-card {
    margin: 0 0.5rem;
  }
}
</style> 