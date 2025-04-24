<template>
  <div class="manage-tasks">
    <div class="admin-nav">
      <ul>
        <li><router-link to="/admin/manage-students" class="nav-btn">Manage Students</router-link></li>
        <li><router-link to="/admin/manage-events" class="nav-btn">Manage Events</router-link></li>
        <li><router-link to="/admin/manage-tasks" class="nav-btn">Manage Tasks</router-link></li>
        <li><router-link to="/admin/view-student-plans" class="nav-btn">View Plans</router-link></li>
        <li><button @click="logout" class="logout-btn">Logout</button></li>
      </ul>
    </div>

    <h1>Manage Tasks</h1>
    <div class="action-buttons">
      <button @click="toggleForm">{{ isFormVisible ? 'Cancel' : 'Add Task' }}</button>
      <button @click="fetchTasks" class="refresh-btn">Refresh Tasks</button>
    </div>
    <form v-if="isFormVisible" @submit.prevent="isEditing ? updateTask() : addTask()">
      <input type="text" v-model="taskName" placeholder="Task Name" required />
      <textarea v-model="taskDescription" placeholder="Description" required></textarea>
      <input type="text" v-model="taskType" placeholder="Type" required />
      <input type="date" v-model="taskDueDate" required />
      <select v-model="taskStatus" required>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input type="number" v-model="taskPoints" placeholder="Points" required />
      <button type="submit">{{ isEditing ? 'Update Task' : 'Add Task' }}</button>
    </form>
    <div v-if="tasks.length === 0" class="no-tasks">
      <p>No tasks found. Try adding a task or refreshing the list.</p>
    </div>
    <ul v-else>
      <li v-for="task in tasks" :key="task.taskid" class="task-item">
        <div class="task-info">
          <span class="task-name">{{ task.name }}</span>
          <span class="task-details">Due: {{ task.dueDate }} | Points: {{ task.points }}</span>
          <span class="task-status" :class="task.status">{{ task.status }}</span>
        </div>
        <div class="task-actions">
          <button @click="editTask(task)">Edit</button>
          <button @click="deleteTask(task.taskid)">Delete</button>
        </div>
      </li>
    </ul>
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
      taskType: '',
      taskDueDate: '',
      taskStatus: 'pending',
      taskPoints: '',
      isEditing: false,
      currentTaskId: null,
      isFormVisible: false,
    };
  },
  methods: {
    fetchTasks() {
      console.log('Fetching tasks...');
      axios
        .get('http://localhost:8082/api/tasks', { 
          withCredentials: true
        })
        .then((response) => {
          console.log('Tasks fetched successfully:', response.data);
          if (Array.isArray(response.data)) {
            this.tasks = response.data.map(task => ({
              ...task,
              taskid: task.Taskid
            }));
          } else {
            console.warn('Unexpected response format:', response.data);
            this.tasks = [];
          }
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          alert(`Error fetching tasks: ${error.response?.data?.message || error.message}`);
        });
    },
    addTask() {
      const formattedDate = this.taskDueDate ? new Date(this.taskDueDate).toISOString().split('T')[0] : '';
      
      const newTask = {
        name: this.taskName,
        description: this.taskDescription,
        type: this.taskType,
        dueDate: formattedDate,
        status: this.taskStatus,
        points: parseInt(this.taskPoints),
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
          const taskWithId = {
            ...response.data,
            taskid: response.data.Taskid
          };
          this.tasks.push(taskWithId);
          this.resetForm();
        })
        .catch((error) => {
          console.error('Error adding task:', error);
          alert(`Error adding task: ${error.response?.data?.message || error.message}`);
        });
    },
    editTask(task) {
      this.taskName = task.name;
      this.taskDescription = task.description;
      this.taskType = task.type;
      this.taskDueDate = task.dueDate;
      this.taskStatus = task.status;
      this.taskPoints = task.points;
      this.isEditing = true;
      this.currentTaskId = task.taskid;
      this.isFormVisible = true;
    },
    updateTask() {
      if (!this.currentTaskId) {
        console.error('No task ID provided for update');
        return;
      }

      const updatedTask = {
        name: this.taskName,
        description: this.taskDescription,
        type: this.taskType,
        dueDate: this.taskDueDate,
        status: this.taskStatus,
        points: parseInt(this.taskPoints),
      };

      axios
        .put(`http://localhost:8082/api/tasks/${this.currentTaskId}`, updatedTask, { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log('Task updated successfully:', response.data);
          const index = this.tasks.findIndex(t => t.taskid === this.currentTaskId);
          if (index !== -1) {
            this.tasks[index] = {
              ...response.data,
              taskid: response.data.Taskid
            };
          }
          this.resetForm();
        })
        .catch((error) => {
          console.error('Error updating task:', error);
          alert(`Error updating task: ${error.response?.data?.message || error.message}`);
        });
    },
    deleteTask(taskId) {
      if (!taskId) {
        console.error('No task ID provided for deletion');
        return;
      }

      if (!confirm('Are you sure you want to delete this task?')) {
        return;
      }

      axios
        .delete(`http://localhost:8082/api/tasks/${taskId}`, { 
          withCredentials: true
        })
        .then(() => {
          console.log('Task deleted successfully');
          this.tasks = this.tasks.filter((task) => task.taskid !== taskId);
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
          alert(`Error deleting task: ${error.response?.data?.message || error.message}`);
        });
    },
    resetForm() {
      this.taskName = '';
      this.taskDescription = '';
      this.taskType = '';
      this.taskDueDate = '';
      this.taskStatus = 'pending';
      this.taskPoints = '';
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
    logout() {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      this.$router.push('/admin-login');
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
.manage-tasks {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  color: white;
  background: #1a1a1a;
}

.admin-nav {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
}

.admin-nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.admin-nav li {
  margin: 0;
}

.nav-btn, .admin-nav a {
  display: inline-block;
  background-color: #41b883;
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.nav-btn:hover, .admin-nav a:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.nav-btn.router-link-active, .admin-nav a.router-link-active {
  background-color: #2c805c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logout-btn {
  background-color: #e74c3c !important;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #c0392b !important;
  transform: translateY(-2px);
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.action-buttons button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: #41b883;
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
}

.action-buttons button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.refresh-btn {
  background-color: #41b883;
  color: white;
}

.no-tasks {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-top: 20px;
  color: white;
}

.manage-tasks form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 5px;
}

.manage-tasks input,
.manage-tasks textarea,
.manage-tasks select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.manage-tasks input::placeholder,
.manage-tasks textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.manage-tasks button {
  padding: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: #41b883;
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
}

.manage-tasks button:hover {
  background-color: #3aa876;
  transform: translateY(-2px);
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.task-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.task-name {
  font-weight: bold;
  font-size: 1.1em;
}

.task-details {
  font-size: 0.9em;
  opacity: 0.8;
}

.task-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.task-status.pending {
  background-color: #f39c12;
}

.task-status.in-progress {
  background-color: #3498db;
}

.task-status.completed {
  background-color: #2ecc71;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.task-actions button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.task-actions button:first-child {
  background-color: #3498db;
  color: white;
}

.task-actions button:last-child {
  background-color: #e74c3c;
  color: white;
}

.task-actions button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
</style> 