<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth">&lt;</button>
      <span>{{ currentMonth }} {{ currentYear }}</span>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-grid">
      <div class="calendar-day" v-for="day in daysInMonth" :key="day">
        <div class="day-number">{{ day }}</div>
        <div class="events">
          <div v-for="event in getEventsForDay(day)" :key="event.id" class="event">
            <span @click="toggleEventDetails(event.id)">{{ event.name }}</span>
            <div v-if="event.expanded">
              <p>{{ event.details }}</p>
              <button @click="$emit('register', event.id)">Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMonth: new Date().toLocaleString('default', { month: 'long' }),
      currentYear: new Date().getFullYear(),
    };
  },
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  computed: {
    daysInMonth() {
      const date = new Date(this.currentYear, new Date().getMonth() + 1, 0);
      return Array.from({ length: date.getDate() }, (_, i) => i + 1);
    },
  },
  methods: {
    getEventsForDay(day) {
      return this.events.filter(event => new Date(event.date).getDate() === day);
    },
    prevMonth() {
      const date = new Date(this.currentYear, new Date().getMonth() - 1);
      this.currentMonth = date.toLocaleString('default', { month: 'long' });
      this.currentYear = date.getFullYear();
      console.log(`Navigated to previous month: ${this.currentMonth} ${this.currentYear}`);
    },
    nextMonth() {
      const date = new Date(this.currentYear, new Date().getMonth() + 1);
      this.currentMonth = date.toLocaleString('default', { month: 'long' });
      this.currentYear = date.getFullYear();
      console.log(`Navigated to next month: ${this.currentMonth} ${this.currentYear}`);
    },
    toggleEventDetails(eventId) {
      console.log(`Toggled event details for event ID: ${eventId}`);
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        event.expanded = !event.expanded;
      }
    }
  },
};
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background-color: #f0f0f0;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.calendar-day {
  border: 1px solid #ddd;
  padding: 5px;
  min-height: 120px;
}
.day-number {
  font-weight: bold;
}
.event {
  background-color: #e0e0e0;
  margin: 2px 0;
  padding: 2px;
  border-radius: 3px;
}
</style>