<template>
    <div class="report-container">
    <h2 class="report-title">Student Engagement Report</h2>

    <form class="filter-form" @submit.prevent="generateReport">
      <div class="form-group">
        <label for="semester">Semester</label>
        <select id="semester" v-model="filters.semester">
          <option value="">All</option>
          <option v-for="sem in semesters" :key="sem" :value="sem">{{ sem }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="major">Major</label>
        <select id="major" v-model="filters.major">
          <option value="">All</option>
          <option v-for="maj in majors" :key="maj" :value="maj">{{ maj }}</option>
        </select>
      </div>

      <button type="submit" class="generate-btn" :disabled="loading">
        {{ loading ? 'Generating...' : 'Generate' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="reportData" class="report-results">
      <h3>Report Summary</h3>
      <ul>
        <li><strong>Tasks Completed:</strong> {{ reportData.tasksCompleted }}</li>
        <li><strong>Events Attended:</strong> {{ reportData.eventsAttended }}</li>
      </ul>

      <!-- Chart Component -->
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>


   
    


            
    </div>
</template>

<script>
import axios from 'axios';
import { Bar } from 'vue-chartjs';

export default {
  name: 'EngagementReport',
  components: {
    Bar,
  },
  data() {
    return {
      filters: { semester: '', major: '' },
      semesters: ['Fall 2024', 'Spring 2025'], // Replace with dynamic data as needed
      majors: ['Computer Science', 'Business', 'Engineering'], // Replace with dynamic data as needed
      tasks: [],
      events: [],
      reportData: null,
      chartData: null,
      chartOptions: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, precision: 0 },
        },
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    fetchTasks() {
      console.log('Fetching tasks...');
      return axios
        .get('http://localhost:8082/api/tasks', {
          withCredentials: true,
          params: this.filters,
        })
        .then((res) => {
          this.tasks = Array.isArray(res.data)
            ? res.data.map((t) => ({ ...t, taskid: t.Taskid }))
            : [];
        })
        .catch((err) => {
          alert(`Error fetching tasks: ${err.response?.data?.message || err.message}`);
          throw err;
        });
    },
    fetchEvents() {
      console.log('Fetching events...');
      return axios
        .get('http://localhost:8082/api/events', {
          withCredentials: true,
          params: this.filters,
        })
        .then((res) => {
          this.events = Array.isArray(res.data)
            ? res.data
            : res.data.events || [];
        })
        .catch((err) => {
          alert(`Error fetching events: ${err.response?.data?.message || err.message}`);
          throw err;
        });
    },
    async generateReport() {
      this.loading = true;
      this.error = null;
      this.reportData = null;
      this.chartData = null;

      try {
        await this.fetchTasks();
        await this.fetchEvents();
        this.reportData = {
          tasksCompleted: this.tasks.length,
          eventsAttended: this.events.length,
        };
        this.chartData = {
          labels: ['Tasks Completed', 'Events Attended'],
          datasets: [
            {
              label: 'Count',
              data: [this.reportData.tasksCompleted, this.reportData.eventsAttended],
              backgroundColor: ['#3498db', '#e67e22'],
            },
          ],
        };
      } catch {
        this.error = 'Failed to generate report.';
      } finally {
        this.loading = false;
      }
    },
  },
};


</script>

<style scoped>
.report-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.report-title {
    text-align: center;
    margin-bottom: 20px;
}

.filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
}

.form-group {
    flex: 1 1 200px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.generate-btn {
    align-self: flex-end;
    padding: 10px 20px;
    background-color: #2c3e50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.generate-btn:hover {
    background-color: #34495e;
}

.report-results {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    color: black;
}

.report-results h3 {
    margin-top: 0;
}

.report-results ul {
    list-style: none;
    padding: 0;
}

.report-results li {
    margin-bottom: 10px;
}
</style>