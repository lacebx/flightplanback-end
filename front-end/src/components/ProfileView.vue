<template>
  <div class="profile-page">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>

    <!-- Main Profile Section -->
    <div class="profile-container">
      <!-- Profile Header -->
      <section class="profile-header glass-morphism" data-scroll>
        <div class="profile-avatar-wrapper">
          <div class="profile-avatar">
            <!-- If user has a photo, show it; otherwise show default image -->
            <template v-if="user && user.photos && user.photos.length">
              <img :src="user.photos[0].value" alt="Avatar" class="avatar-image" @error="handleImageError" />
            </template>
            <template v-else>
              <img src="@/assets/default.png" alt="Default Avatar" class="avatar-image" />
            </template>
          </div>
        </div>
        
        <div class="profile-info">
          <!-- Display the fetched user's name; fallback to a default if not yet loaded -->
          <h1  class="NAME">{{ user ? user.lastname : 'Your Name' }}</h1>
          <p class="title">Major: {{ user ? user.major : 'Your Major' }}</p>
          <p class="graduation">ID Number: {{ user ? user.idNumber : 'N/A' }}</p>
          <p class="graduation">Semester: {{ user ? user.semester : 'N/A' }}</p>
        </div>

        <div class="achievement-badges">
          <div class="badge" v-for="badge in badges" :key="badge.id">
            <div class="badge-icon" :style="{ backgroundColor: badge.color }">
              <img :src="badge.icon" alt="Badge Icon" class="badge-image" />
            </div>
            <div class="badge-tooltip">
              <h4>{{ badge.name }}</h4>
              <p>{{ badge.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card glass-morphism" v-for="stat in stats" :key="stat.label"
             :class="{ 'highlight': stat.highlight }">
          <div class="stat-icon">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-info">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
          </div>
          <svg class="stat-wave" viewBox="0 0 100 25">
            <path :d="stat.wavePath" fill="rgba(65, 184, 131, 0.2)"/>
          </svg>
        </div>
      </div>

      <!-- Career Progress -->
      <section class="career-progress glass-morphism" data-scroll>
        <h2>Career Progress</h2>
        <div class="progress-timeline">
          <div class="milestone" v-for="milestone in milestones" :key="milestone.id"
               :class="{ 'completed': milestone.completed }">
            <div class="milestone-dot"></div>
            <div class="milestone-content">
              <h4>{{ milestone.title }}</h4>
              <p>{{ milestone.description }}</p>
            </div>
          </div>
        </div>
        <router-link to="/leaderboard" class="leaderboard-link">
          Go to Leaderboard
        </router-link>
      </section>

      <!-- Skills Matrix -->
      <section class="skills-matrix glass-morphism" data-scroll>
        <h2>Your Top Strengths</h2>
        <div v-if="assessmentResults" class="skills-grid">
          <div class="skill-card" v-for="strength in assessmentResults.topStrengths" :key="strength.skill"
               :style="{ '--progress': strength.score + '%' }">
            <div class="skill-info">
              <h4>{{ strength.skill }}</h4>
              <span class="skill-level">{{ strength.score }}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress"></div>
            </div>
          </div>
        </div>
        <div v-else class="no-assessment">
          <p>You haven't taken the Strengths & Weaknesses assessment yet.</p>
          <router-link to="/sw" class="take-assessment-btn">
            Take Assessment
          </router-link>
        </div>
      </section>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <!-- Remove or comment out the Edit Profile button -->
        <!-- <button class="action-btn edit-btn" @click="editProfile">
          <i class="fas fa-edit"></i>
          Edit Profile
        </button> -->
        <button class="action-btn logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// Import SVG icons
import ResumeMasterIcon from '@/assets/Media/Badges/2020-Arctic-Code-Vault-Contributor/PNG/2020ArcticCodeVaultBadge.png';
import InterviewProIcon from '@/assets/Media/Badges/Galaxy-Brain/PNG/GalaxyBrain_Gold.png';
import NetworkBuilderIcon from '@/assets/Media/Badges/GitHub-Sponsor/PNG/GitHubSponsorBadge.png';
import SkillsChampionIcon from '@/assets/Media/Badges/Heart-on-your-sleeve/PNG/HeartOnYourSleeve_Gold.png';

export default {
  name: 'ProfileView',
  data() {
    return {
      user: null, // Will hold the authenticated user info from backend
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
      assessmentResults: null
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
    }
  },
  methods: {
    editProfile() {
      console.log('Edit profile clicked');
    },
    logout() {
      this.$emit('logout');
      this.$router.push('/');
    },
    handleImageError(event) {
      event.target.src = require('@/assets/default.png'); // Use require for dynamic paths
    },
    updateStats() {
      if (this.user) {
        axios.get(`http://localhost:8082/api/users/${this.user.id}/points`, { withCredentials: true })
          .then(response => {
            console.log('Points response:', response.data); // Log the response
            this.stats[0].value = response.data.points;
          })
          .catch(error => {
            console.error('Error fetching points:', error);
          });
      }
    }
  },
  mounted() {
    // Fetch the authenticated user's data from the backend.
    axios.get('http://localhost:8082/auth/user', { withCredentials: true })
      .then(response => {
        this.user = response.data;
        console.log("User data loaded:", this.user);
        // Check if photos exist and have at least one entry
        const photoUrl = this.user.photos && this.user.photos.length > 0 ? this.user.photos[0].value : 'default-photo-url';
        this.$emit('userPhotoLoaded', photoUrl); // Emit the photo URL
        this.updateStats(); // Update stats after loading user data
        // Update points directly from the user data
        this.stats[0].value = this.user.points;
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

    // Load assessment results from localStorage
    const savedResults = localStorage.getItem('swAssessmentResults');
    if (savedResults) {
      this.assessmentResults = JSON.parse(savedResults);
    }

    this.updateStats(); // Call updateStats to fetch points
  }
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.gradient-sphere:nth-child(1) {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #41b883 0%, transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: -5s;
}

.gradient-sphere:nth-child(2) {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #3aa876 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation-delay: -10s;
}

.gradient-sphere:nth-child(3) {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #2c3e50 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, 50px); }
  50% { transform: translate(0, 100px); }
  75% { transform: translate(-50px, 50px); }
}

.profile-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Glass Morphism Effect */
.glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  margin-bottom: 2rem;
}

/* Profile Header */
.profile-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.profile-avatar-wrapper {
  position: relative;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(145deg, #41b883, #3aa876);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Style for the image avatar */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-text {
  font-size: 2.5em;
  font-weight: bold;
  color: white;
}

.status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background: #4CAF50;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

.level-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #2c3e50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level {
  font-size: 0.8em;
  font-weight: bold;
}

.progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  position: relative;
  padding: 1.5rem;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 1.5em;
  color: #41b883;
  margin-bottom: 1rem;
}

.stat-info h3 {
  font-size: 2em;
  margin: 0;
  color: #41b883;
}

.stat-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25px;
}

/* Career Progress */
.career-progress {
  margin-bottom: 2rem;
}

.progress-timeline {
  position: relative;
  padding: 2rem 0;
}

.progress-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: rgba(65, 184, 131, 0.3);
}

.milestone {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 2rem;
}

.milestone-dot {
  position: absolute;
  left: -5px;
  top: 0;
  width: 12px;
  height: 12px;
  background: #41b883;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.milestone.completed .milestone-dot {
  background: #4CAF50;
}

.milestone:hover .milestone-dot {
  transform: scale(1.5);
}

/* Skills Matrix */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.skill-card {
  --progress: 0%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  width: var(--progress);
  background: #41b883;
  border-radius: 3px;
  transition: width 1s ease;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #41b883;
  color: white;
}

.logout-btn {
  background: #e74c3c;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .profile-avatar-wrapper {
    justify-self: center;
  }

  .achievement-badges {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}

/* Update achievement badges styles */
.achievement-badges {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Creates 3 equal columns */
  gap: 2rem;
  margin: 1rem 0;
  max-width: 600px; /* Limit the width to maintain proper spacing */
}

.badge {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.badge-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-icon i {
  font-size: 1.5rem;
  color: white;
}

.badge:hover .badge-icon {
  transform: translateY(-5px);
}

.badge-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.8rem;
  width: max-content;
  max-width: 200px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.badge-tooltip h4 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 0.9rem;
}

.badge-tooltip p {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.badge:hover .badge-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* Add a small arrow to the tooltip */
.badge-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(30, 30, 30, 0.95) transparent transparent transparent;
}

/* Update media query for responsive design */
@media (max-width: 768px) {
  .achievement-badges {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on smaller screens */
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .achievement-badges {
    grid-template-columns: 1fr; /* Single column on very small screens */
    gap: 1rem;
  }
}

.career-progress-card {
  position: relative;
}

.leaderboard-link {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 0.5rem 1rem;
  background-color: #41b883;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.leaderboard-link:hover {
  background-color: #69d4a4;
}

.no-assessment {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.no-assessment p {
  margin-bottom: 1.5rem;
  color: #888;
}

.take-assessment-btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: #41b883;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.take-assessment-btn:hover {
  transform: translateY(-2px);
  background: #3aa876;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
