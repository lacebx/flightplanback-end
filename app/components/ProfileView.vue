<template>
  <!-- No changes to template section -->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null, // Will hold the authenticated user info from backend
      major: '', // New field for user's major
      expectedGradYear: '', // New field for expected graduation year
      badges: [
        {
          id: 1,
          name: 'Resume Master',
          description: 'Created and refined a professional resume',
          icon: ResumeMasterIcon, 
          
        },
        {
          id: 2,
          name: 'Interview Pro',
          description: 'Completed 3 mock interviews',
          icon: InterviewProIcon, 
          
        },
        {
          id: 3,
          name: 'Network Builder',
          description: 'Connected with 10+ professionals',
          icon: NetworkBuilderIcon, 
          
        },
        {
          id: 4,
          name: 'Skills Champion',
          description: 'Mastered 5+ professional skills',
          icon: SkillsChampionIcon, 
          
        }
      ],
      stats: [
        { 
          label: 'Total Points', 
          value: this.user ? this.user.points : '0',
          icon: 'fas fa-star',
          highlight: true,
          wavePath: 'M 0 20 Q 25 5, 50 20 T 100 20 V 25 H 0 Z'
        },
        { 
          label: 'Events Attended', 
          value: this.user ? this.user.eventsAttended : '0',
          icon: 'fas fa-calendar-check',
          wavePath: 'M 0 15 Q 25 25, 50 15 T 100 15 V 25 H 0 Z'
        },
        { 
          label: 'Tasks Completed', 
          value: this.user ? this.user.tasksCompleted : '0',
          icon: 'fas fa-tasks',
          wavePath: 'M 0 20 Q 25 15, 50 20 T 100 20 V 25 H 0 Z'
        }
      ],
      milestones: [
        {
          id: 1,
          title: 'Resume Completion',
          description: 'Created and refined professional resume',
          completed: true
        },
        {
          id: 2,
          title: 'Mock Interview',
          description: 'Completed 3 practice interviews',
          completed: true
        },
        {
          id: 3,
          title: 'Career Fair',
          description: 'Attend upcoming spring career fair',
          completed: false
        }
      ],
      skills: [
        { name: 'Leadership', level: 85 },
        { name: 'Communication', level: 90 },
        { name: 'Problem Solving', level: 88 },
        { name: 'Team Work', level: 92 },
        { name: 'Technical Skills', level: 87 },
        { name: 'Project Management', level: 80 }
      ]
    };
  },
  computed: {
    // Generate initials from the user's display name as a fallback
    userInitials() {
      if (this.user && this.user.displayName) {
        const names = this.user.displayName.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
      }
      return 'MK';
    },
    // New computed property to calculate expected graduation year
    calculateExpectedGradYear() {
      if (this.user && this.user.semester) {
        const currentYear = new Date().getFullYear();
        const remainingSemesters = 8 - this.user.semester;
        return currentYear + Math.ceil(remainingSemesters / 2);
      }
      return 'Unknown';
    }
  },
  mounted() {
    // Fetch the authenticated user's data from the backend.
    axios.get('http://localhost:8082/auth/user', { withCredentials: true })
      .then(response => {
        this.user = response.data;
        this.major = this.user.major; // Set the user's major
        this.expectedGradYear = this.calculateExpectedGradYear; // Calculate expected graduation year
        console.log("User data loaded:", this.user);
        this.$emit('userPhotoLoaded', this.user.photos[0].value); // Emit the photo URL
        this.updateStats(); // Update stats after loading user data
      })
      .catch(error => {
        console.error("Error fetching user:", error);
      });

    // Log badge icons to verify they are loaded
    console.log("Badge Icons Loaded:");
    console.log("ResumeMasterIcon:", ResumeMasterIcon);
    console.log("InterviewProIcon:", InterviewProIcon);
    console.log("NetworkBuilderIcon:", NetworkBuilderIcon);
    console.log("SkillsChampionIcon:", SkillsChampionIcon);
  },
  methods: {
    updateStats() {
      if (this.user) {
        this.stats[0].value = this.user.points;
        this.stats[1].value = this.user.eventsAttended;
        this.stats[2].value = this.user.tasksCompleted;
      }
    }
  }
};
</script>

<style>
  /* No changes to style section */
</style> 