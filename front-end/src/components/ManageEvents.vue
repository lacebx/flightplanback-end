<template>
  <div class="manage-events">
    <div class="page-header">
      <h1>Manage Events</h1>
      <div class="action-buttons">
        <button @click="toggleForm" class="primary-btn">
          <i class="fas fa-plus"></i>
          {{ isFormVisible ? 'Cancel' : 'Add Event' }}
        </button>
        <button @click="fetchEvents" class="refresh-btn">
          <i class="fas fa-sync-alt"></i>
          Refresh Events
        </button>
      </div>
    </div>

    <!-- Event Form -->
    <div v-if="isFormVisible" class="form-container">
      <form @submit.prevent="isEditing ? updateEvent() : addEvent()" class="event-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="eventName">Event Name</label>
            <input type="text" id="eventName" v-model="eventName" required />
          </div>
          
          <div class="form-group">
            <label for="eventType">Event Type</label>
            <input type="text" id="eventType" v-model="eventType" required />
          </div>

          <div class="form-group">
            <label for="eventDate">Date</label>
            <input type="date" id="eventDate" v-model="eventDate" required />
          </div>

          <div class="form-group">
            <label for="eventStartTime">Start Time</label>
            <input type="time" id="eventStartTime" v-model="eventStartTime" required />
          </div>

          <div class="form-group">
            <label for="eventEndTime">End Time</label>
            <input type="time" id="eventEndTime" v-model="eventEndTime" required />
          </div>

          <div class="form-group">
            <label for="eventLocation">Location</label>
            <input type="text" id="eventLocation" v-model="eventLocation" required />
          </div>

          <div class="form-group">
            <label for="eventAttendanceType">Attendance Type</label>
            <select id="eventAttendanceType" v-model="eventAttendanceType" required>
              <option value="required">Required</option>
              <option value="optional">Optional</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
        </div>

        <div class="form-group full-width">
          <label for="eventDescription">Description</label>
          <textarea id="eventDescription" v-model="eventDescription" rows="4" required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">
            {{ isEditing ? 'Update Event' : 'Add Event' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Events List -->
    <div v-if="events.length === 0" class="no-events">
      <i class="fas fa-calendar-times"></i>
      <p>No events found. Try adding an event or refreshing the list.</p>
    </div>
    
    <div v-else class="events-grid">
      <div v-for="event in events" :key="event.eventid" class="event-card">
        <div class="event-header">
          <h3>{{ event.name }}</h3>
          <span :class="['attendance-badge', event.attendancetype]">
            {{ event.attendancetype }}
          </span>
        </div>
        
        <div class="event-details">
          <p class="event-date">
            <i class="fas fa-calendar"></i>
            {{ formatDate(event.date) }}
          </p>
          <p class="event-time">
            <i class="fas fa-clock"></i>
            {{ event.starttime }} - {{ event.endtime }}
          </p>
          <p class="event-location">
            <i class="fas fa-map-marker-alt"></i>
            {{ event.location }}
          </p>
          <p class="event-type">
            <i class="fas fa-tag"></i>
            {{ event.eventtype }}
          </p>
        </div>

        <div class="event-description">
          {{ event.description }}
        </div>

        <div class="event-actions">
          <button @click="editEvent(event)" class="edit-btn">
            <i class="fas fa-edit"></i>
            Edit
          </button>
          <button @click="deleteEvent(event.eventid)" class="delete-btn">
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
      events: [],
      eventName: '',
      eventDescription: '',
      eventType: '',
      eventDate: '',
      eventStartTime: '',
      eventEndTime: '',
      eventLocation: '',
      eventAttendanceType: '',
      isEditing: false,
      currentEventId: null,
      isFormVisible: false,
    };
  },
  methods: {
    fetchEvents() {
      console.log('Fetching events...');
      axios
        .get('http://localhost:8082/api/events', { withCredentials: true })
        .then((response) => {
          console.log('Events fetched successfully:', response.data);
          // Check if response.data is an array, if not, try to extract the events array
          if (Array.isArray(response.data)) {
            this.events = response.data;
          } else if (response.data && response.data.events) {
            this.events = response.data.events;
          } else {
            console.warn('Unexpected response format:', response.data);
            this.events = [];
          }
        })
        .catch((error) => {
          console.error('Error fetching events:', error);
          console.error('Error details:', error.response?.data);
          // Display error to user
          alert(`Error fetching events: ${error.response?.data?.message || error.message}`);
        });
    },
    addEvent() {
      // Format the date and time fields properly
      const formattedDate = this.eventDate ? new Date(this.eventDate).toISOString().split('T')[0] : '';
      
      const newEvent = {
        name: this.eventName,
        description: this.eventDescription,
        eventtype: this.eventType,
        date: formattedDate,
        starttime: this.eventStartTime,
        endtime: this.eventEndTime,
        location: this.eventLocation,
        attendancetype: this.eventAttendanceType,
      };
      
      console.log('Sending event data:', newEvent);
      
      axios
        .post('http://localhost:8082/api/events', newEvent, { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log('Event added successfully:', response.data);
          eventBus.emit('eventAdded', response.data);
          
          // Add the new event to the local array immediately
          if (response.data && response.data.eventid) {
            this.events.push(response.data);
          }
          
          this.resetForm();
          // Fetch events again to ensure we have the latest data
          this.fetchEvents();
        })
        .catch((error) => {
          console.error('Error adding event:', error);
          console.error('Error details:', error.response?.data);
          // Display error message to user
          alert(`Error adding event: ${error.response?.data?.message || error.message}`);
        });
    },
    editEvent(event) {
      this.eventName = event.name;
      this.eventDescription = event.description;
      this.eventType = event.eventtype;
      this.eventDate = event.date;
      this.eventStartTime = event.starttime;
      this.eventEndTime = event.endtime;
      this.eventLocation = event.location;
      this.eventAttendanceType = event.attendancetype;
      this.isEditing = true;
      this.currentEventId = event.eventid;
      this.isFormVisible = true;
    },
    updateEvent() {
      const updatedEvent = {
        name: this.eventName,
        description: this.eventDescription,
        eventtype: this.eventType,
        date: this.eventDate,
        starttime: this.eventStartTime,
        endtime: this.eventEndTime,
        location: this.eventLocation,
        attendancetype: this.eventAttendanceType,
      };
      axios
        .put(`http://localhost:8082/api/events/${this.currentEventId}`, updatedEvent, { withCredentials: true })
        .then((response) => {
          eventBus.emit('eventUpdated', response.data);
          this.resetForm();
          this.fetchEvents();
        })
        .catch((error) => {
          console.error('Error updating event:', error);
        });
    },
    deleteEvent(eventId) {
      axios
        .delete(`http://localhost:8082/api/events/${eventId}`, { withCredentials: true })
        .then(() => {
          this.events = this.events.filter((event) => event.eventid !== eventId);
        })
        .catch((error) => {
          console.error('Error deleting event:', error);
        });
    },
    resetForm() {
      this.eventName = '';
      this.eventDescription = '';
      this.eventType = '';
      this.eventDate = '';
      this.eventStartTime = '';
      this.eventEndTime = '';
      this.eventLocation = '';
      this.eventAttendanceType = '';
      this.isEditing = false;
      this.currentEventId = null;
      this.isFormVisible = false;
    },
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;
      if (!this.isFormVisible) {
        this.resetForm();
      }
    },
    logout() {
      // Clear user data from localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      // Redirect to login page
      this.$router.push('/admin-login');
    },
    formatDate(dateString) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchEvents();
  },
};
</script>

<style scoped>
.manage-events {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  color: white;
  background: #1a1a1a;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #41b883;
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
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.primary-btn {
  background: #41b883;
  color: white;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.primary-btn:hover, .refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.form-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.event-form {
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
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-btn {
  background: #41b883;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #3aa876;
  transform: translateY(-2px);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.event-header h3 {
  margin: 0;
  color: #41b883;
  font-size: 1.2rem;
}

.attendance-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.attendance-badge.required {
  background: #e74c3c;
  color: white;
}

.attendance-badge.optional {
  background: #3498db;
  color: white;
}

.attendance-badge.virtual {
  background: #9b59b6;
  color: white;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.event-details p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.event-details i {
  color: #41b883;
  width: 20px;
}

.event-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
}

.event-actions {
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
  padding: 0.6rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #2c805c;
  color: white;
}

.delete-btn {
  background: #802c2c;
  color: white;
}

.edit-btn:hover {
  background: #41b883;
}

.delete-btn:hover {
  background: #b84141;
}

.form-group select {
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.form-group select option {
  background: #1a1a1a;
  color: white;
  padding: 10px;
}

.no-events {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.no-events i {
  font-size: 3rem;
  color: #41b883;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
