fetchTasksAndEvents() {
  // Fetch tasks
  axios.get('http://localhost:8082/api/tasks', { withCredentials: true })
    .then(response => {
      const userSemester = this.userProfile.semester; // Assume userProfile contains semester info
      this.tasks = response.data
        .filter(task => task.semester === userSemester) // Filter tasks by semester
        .map(task => ({ ...task, completed: false }));
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
  // Fetch events
  axios.get('http://localhost:8082/api/events', { withCredentials: true })
    .then(response => {
      const eventsArray = Array.isArray(response.data) ? response.data : response.data.events;
      this.events = eventsArray.map(event => ({ ...event, completed: false }));
      this.$nextTick(() => {
        const eventItems = document.querySelectorAll('.event-item');
        eventItems.forEach(item => item.classList.add('scrolled'));
      });
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
} 