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
          <button class="complete-btn" @click="requestTaskCompletionApproval(task)" :disabled="task.completed">
            <span v-if="!task.completed">Request Completion</span>
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
      <div class="events-container">
        <div class="event-item" v-for="event in events" :key="event.id" data-scroll>
          <div class="event-image">
            <img :src="getEventImage(event.id)" :alt="event.name">
          </div>
          <div class="event-content glass-effect">
            <h3>{{ event.name }}</h3>
            <p>{{ event.description }}</p>
            <p><strong>Type:</strong> {{ event.eventtype }}</p>
            <div class="event-details">
              <span>{{ event.date }}</span>
              <span>{{ event.starttime }} - {{ event.endtime }}</span>
            </div>
            <p><strong>Location:</strong> {{ event.location }}</p>
            <p><strong>Attendance:</strong> {{ event.attendancetype }}</p>
            <button class="register-button neumorphic" @click="openRegistrationModal(event.id)">Register Now</button>
          </div>
        </div>
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

export default {
  name: 'TasksAndEventsView',
  
  data() {
    return {
      tasks: [],  // Fetched from backend
      events: [], // Initialize as an empty array
      registeredEvents: [], // Initialize as an empty array
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
    getEventImage(id) {
      const images = {
        1: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
        2: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
      };
      return images[id] || 'https://via.placeholder.com/600x400?text=Event+Image';
    },
    
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
          this.events = eventsArray.map(event => ({
            ...event,
            id: event.id || event.eventid, // Ensure id is assigned
            completed: false
          }));
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
    async requestTaskCompletionApproval(task) {
      try {
        const response = await axios.post(
          `http://localhost:8082/api/tasks/${task.Taskid}/request-completion`,
          { userId: this.userProfile.id },
          { withCredentials: true }
        );
        console.log('Task completion request sent:', response.data);
        this.notification = 'Task completion request sent to admin.';
        setTimeout(() => {
          this.notification = null;
        }, 3000);
      } catch (error) {
        console.error('Error requesting task completion approval:', error);
      }
    },
    openRegistrationModal(eventId) {
      console.log("Opening registration modal for event ID:", eventId);
      if (!eventId) {
        console.error("Event ID is undefined. Cannot open registration modal.");
        return;
      }
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
       this.fetchRegisteredEvents();
     } catch (error) {
       console.error('Error registering for event:', error);
     }
   },

    
    initScrollAnimations() {
      // Example: Add scroll animations or initializations here
      console.log('Scroll animations initialized');
    },
    fetchPoints() {
      // Example: Fetch points logic here
      console.log('Fetching points...');
    },
    fetchUserProfile() {
      const email = this.userProfile.email; // Ensure this is set before calling
      console.log('User email before fetching profile:', email); // Log the email

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
    },
    removeTask(taskId) {
      this.tasks = this.tasks.filter(task => task.Taskid !== taskId);
    }
  },
  mounted() {
    // Fetch user profile from the backend
    axios.get('http://localhost:8082/auth/user', { withCredentials: true })
      .then(response => {
        if (response.data && response.data.email) {
          this.userProfile.email = response.data.email;
          console.log('User email set in mounted:', this.userProfile.email); // Log the email
          this.fetchUserProfile();
        } else {
          console.error('User email is not set.');
        }
      })
      .catch(error => {
        console.error('Error fetching authenticated user:', error);
      });

    this.initScrollAnimations();
    this.fetchPoints();

    // Listen for eventAdded event using mitt
    eventBus.on('eventAdded', (event) => {
      this.notification = `Event "${event.name}" added successfully!`;
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    });

    // Listen for the taskApproved event using mitt
    eventBus.on('taskApproved', this.removeTask);
  },
  beforeUnmount() {
    // Clean up the event listener
    eventBus.off('eventAdded');
    eventBus.off('taskApproved', this.removeTask);
  }
};
</script> 

<style scoped>
.tasks-events {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: #1a1a1a;
  color: white;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

/* Hero Section */
.hero-section {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section h1 {
  font-size: 4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Glassmorphism Effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Tasks Section */
.tasks-section {
  margin: 40px auto;
  max-width: 1200px;
  padding: 40px;
  z-index: 1;
  position: relative;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.task-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.task-card:hover {
  transform: translateY(-5px);
}

.task-card.task-completed {
  opacity: 0.6;
  border: 2px solid #41b883;
}

.complete-btn {
  margin-top: 10px;
  padding: 10px 20px;
  background: #41b883;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.complete-btn:hover:not([disabled]) {
  background: #369f6b;
}

.complete-btn[disabled] {
  cursor: default;
}

/* Events Section */
.events-section {
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 40px;
}

.events-container {
  max-width: 1200px;
  margin: 0 auto;
}

.event-item {
  display: flex;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease;
}

.event-item.scrolled {
  opacity: 1;
  transform: translateY(0);
}

.event-item:nth-child(even) {
  flex-direction: row-reverse;
}

.event-image {
  flex: 1;
  height: 300px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-content {
  flex: 1;
  padding: 40px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.event-content:hover {
  transform: translateY(-5px);
}

.event-details {
  margin: 10px 0;
  font-weight: bold;
}

.register-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #41b883;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.register-button:hover {
  background: #369f6b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .event-item {
    flex-direction: column !important;
  }
  
  .event-image, .event-content {
    width: 100%;
  }
}

.task-list, .badges, .points {
  margin-bottom: 20px;
}

/* Add styles for the modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.submit-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn {
  background: #41b883;
  color: white;
}

.cancel-btn {
  background: #e74c3c;
  color: white;
}

.submit-btn:hover {
  background: #3aa876;
}

.cancel-btn:hover {
  background: #c82333;
}

.notification {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #41b883;
  color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
</style>
