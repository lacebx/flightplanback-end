<template>
  <div class="tasks-events">
    <!-- Reuse the floating spheres background -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>

    <!-- Tasks Section -->
    <section class="tasks-section glass-effect" data-scroll>
      <h2>Current Tasks</h2>
      <div class="tasks-grid">
        <div class="task-card neumorphic" v-for="task in tasks" :key="task.Taskid">
          <h3>{{ task.name }}</h3>
          <p><strong>Category:</strong> {{ task.category }} | <strong>Type:</strong> {{ task.type }}</p>
          <p>{{ task.description }}</p>
          <p><strong>Earnable Points:</strong> {{ task.earnablepoints }}</p>
          <p><strong>Schedule:</strong> {{ task.schedulingtype }}</p>
          <button class="complete-btn" @click="completeTask(task)" :disabled="task.completed">
            <span v-if="!task.completed">Complete</span>
            <span v-else>Completed <i class="fas fa-check"></i></span>
          </button>
        </div>
      </div>
    </section>

    <!-- Registered Events Section -->
    <section class="registered-events-section glass-effect" data-scroll>
      <h2>Registered Events</h2>
      <div class="registered-events-grid">
        <div class="registered-event-card neumorphic" v-for="event in registeredEvents" :key="event.id">
          <h3>{{ event.name }}</h3>
          <p>{{ event.description }}</p>
          <p><strong>Type:</strong> {{ event.eventtype }}</p>
          <p><strong>Date:</strong> {{ event.date }}</p>
          <p><strong>Attendance:</strong> {{ event.attended ? 'Attended' : 'Not Attended' }}</p>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
      <div class="calendar-container">
        <!-- Calendar view for events -->
        <calendar-view :events="events" @register="openRegistrationModal" />
      </div>
    </section>

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="modal">
      <div class="modal-content glass-effect">
        <h2>Register for Event</h2>
        <form @submit.prevent="registerForEvent">
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="registrationForm.isVisible">
              Make my attendance visible to others
            </label>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-btn">Register</button>
            <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import eventBus from '../eventBus';
import CalendarView from './CalendarView.vue';

export default {
  name: 'TasksAndEventsView',
  components: {
    CalendarView,
  },
  data() {
    return {
      tasks: [],  // Fetched from backend
      events: [], // Initialize as an empty array
      registeredEvents: [], // New array for registered events
      badges: [],
      points: 0,
      showRegistrationModal: false,
      registrationForm: {
        isVisible: false,
      },
      selectedEventId: null,
      userProfile: {
        name: '',
        email: '',
        semester: '',
      },
      notification: null,
    };
  },
  methods: {
    fetchTasksAndEvents() {
      // Fetch tasks
      axios.get('http://localhost:8082/api/tasks', { withCredentials: true })
        .then(response => {
          console.log('Raw tasks response:', response.data);
          const userSemester = this.userProfile.semester; // Assume userProfile contains semester info
          if (!userSemester) {
            console.error('User semester is not set.');
            return;
          }
          this.tasks = response.data
            .filter(task => task.semester === parseInt(userSemester, 10)) // Filter tasks by semester
            .map(task => ({ ...task, completed: false }));
          console.log('Tasks fetched:', this.tasks);
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
        });
      // Fetch events
      axios.get('http://localhost:8082/api/events', { withCredentials: true })
        .then(response => {
          const eventsArray = Array.isArray(response.data) ? response.data : response.data.events;
          this.events = eventsArray.map(event => ({ ...event, completed: false, expanded: false }));
          console.log('Events fetched:', this.events);
          this.$nextTick(() => {
            const eventItems = document.querySelectorAll('.event-item');
            eventItems.forEach(item => item.classList.add('scrolled'));
          });
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    },
    fetchRegisteredEvents() {
      const userId = this.userProfile.id; // Assume userProfile contains user ID
      if (!userId) {
        console.error('User ID is not set.');
        return;
      }

      axios.get(`http://localhost:8082/api/users/${userId}/registered-events`, { withCredentials: true })
        .then(response => {
          this.registeredEvents = response.data;
          console.log('Registered events fetched:', this.registeredEvents);
        })
        .catch(error => {
          console.error('Error fetching registered events:', error);
        });
    },
    async completeTask(task) {
      try {
        await axios.put(`http://localhost:8082/api/tasks/${task.Taskid}/complete`, { userId: this.userProfile.id }, { withCredentials: true });
        this.tasks = this.tasks.filter(t => t.Taskid !== task.Taskid);
        this.fetchUserProfile(); // Refresh user profile to update points and tasks completed
      } catch (error) {
        console.error('Error completing task:', error);
      }
    },
    openRegistrationModal(eventId) {
      this.selectedEventId = eventId;
      this.showRegistrationModal = true;
    },
    closeModal() {
      this.showRegistrationModal = false;
      this.registrationForm = { isVisible: false };
    },
    async registerForEvent() {
      try {
        const registrationData = {
          name: this.userProfile.name,
          email: this.userProfile.email,
          isVisible: this.registrationForm.isVisible
        };

        const response = await axios.post(
          `http://localhost:8082/api/events/${this.selectedEventId}/register`,
          registrationData,
          { withCredentials: true }
        );

        console.log('Registration successful:', response.data);

        this.closeModal();
        this.fetchRegisteredEvents(); // Refresh registered events after registration
      } catch (error) {
        console.error('Error registering for event:', error);
      }
    },
    fetchUserProfile() {
      const email = this.userProfile.email; // Ensure this is set before calling
      if (!email) {
        console.error('User email is not set.');
        return;
      }
      axios.get(`http://localhost:8082/api/users/profile/${encodeURIComponent(email)}`, { withCredentials: true })
        .then(response => {
          this.userProfile = response.data;
          console.log('User profile fetched:', this.userProfile);
          this.fetchTasksAndEvents(); // Fetch tasks and events after getting the user profile
          this.fetchRegisteredEvents(); // Fetch registered events after getting the user profile
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  },
  mounted() {
    this.fetchTasksAndEvents();
    this.initScrollAnimations();
    this.fetchPoints();
    this.fetchRegisteredEvents();

    // Listen for eventAdded event using mitt
    eventBus.on('eventAdded', (event) => {
      this.notification = `Event "${event.name}" added successfully!`;
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    });
  },
  beforeUnmount() {
    // Clean up the event listener
    eventBus.off('eventAdded');
  }
};
</script> 