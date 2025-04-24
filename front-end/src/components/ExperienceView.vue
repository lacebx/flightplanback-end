<template>
  <div class="experience-page">
    <!-- Reuse the floating spheres background -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>
    
    <!-- Centered Hero Title -->
    <h1 class="hero-title centered">Professional Journey</h1>

    <div class="content-wrapper">
      <!-- Experience Cards -->
      <div class="experience-grid">
        <div class="experience-card" 
             v-for="exp in experiences" 
             :key="exp.experienceid">
          <div class="card-content">
            <h3 class="experience-name">{{ exp.name }}</h3>
            <p class="category">{{ exp.category }}</p>
            <p class="description">{{ exp.description }}</p>
            <div class="card-footer">
              <span class="points">
                <i class="fas fa-star"></i> <strong>{{ exp.pointsearned }} Points</strong>
              </span>
              <span class="date">
                <i class="fas fa-calendar-alt"></i> <small>{{ formatDate(exp.createdAt) }}</small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Experience Button -->
      <button class="add-experience-btn" @click="showAddExperience">
        <span class="btn-content">
          <span class="default-text">XP+</span>
          <span class="hover-text">+ Add Experience</span>
        </span>
      </button>

      <!-- Add Experience Modal -->
      <div class="modal" v-if="showModal">
        <div class="modal-content glass-morphism">
          <h2>Add New Experience</h2>
          <form @submit.prevent="submitExperience">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" v-model="newExperience.name" required>
            </div>
            
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" v-model="newExperience.category" required>
                <option value="Academic">Academic</option>
                <option value="Professional">Professional</option>
                <option value="Leadership">Leadership</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" v-model="newExperience.description" required></textarea>
            </div>

            <div class="form-group">
              <label for="points">Points Earned</label>
              <input type="number" id="points" v-model="newExperience.pointsearned" required min="0">
            </div>

            <div class="form-group">
              <label for="scheduling">Scheduling Type</label>
              <select id="scheduling" v-model="newExperience.schedulingtype" required>
                <option value="Flexible">Flexible</option>
                <option value="Fixed">Fixed</option>
              </select>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" v-model="newExperience.reflectionrequired">
                Reflection Required
              </label>
            </div>

            <div class="modal-buttons">
              <button type="submit" class="submit-btn">Add Experience</button>
              <button type="button" class="cancel-btn" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'ExperienceView',
  data() {
    return {
      totalYears: '3+',
      totalSkills: '13',
      totalProjects: '15',
      experiences: [],
      showModal: false,
      newExperience: {
        name: '',
        category: '',
        type: '',
        description: '',
        pointsearned: 0,
        reflectionrequired: false,
        schedulingtype: 'Flexible'
      }
    };
  },
  methods: {
    showAddExperience() {

      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      // Reset form
      this.newExperience = {
        name: '',
        category: '',
        type: '',
        description: '',
        pointsearned: 0,
        reflectionrequired: false,
        schedulingtype: 'Flexible'
      };
    },
    async submitExperience() {
      try {
        const response = await axios.post('http://localhost:8082/api/experiences', this.newExperience, {
          withCredentials: true
        });
        // Add the new experience to the list
        this.experiences.push(response.data);
        this.closeModal();
        // You might want to add a success message here
      } catch (error) {
        console.error('Error creating experience:', error);
        // You might want to show an error message to the user
      }
     
      this.$router.push('/add-experience');

      console.log('Add experience clicked');

    },
    fetchExperiences() {
      axios.get('http://localhost:8082/api/experiences', { withCredentials: true })
        .then(response => {
          this.experiences = response.data;
        })
        .catch(error => {
          console.error('Error fetching experiences:', error);
        });
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    }
  },
  mounted() {
    this.fetchExperiences();
    // Initialize scroll animations if needed...
  }
};
</script>

<style scoped>
.experience-page {
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
  overflow-x: hidden;
}

/* 3D Hero Section */
.hero-3d {
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 1000px;
}

.cube-container {
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate 20s infinite linear;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  background: rgba(65, 184, 131, 0.1);
  border: 2px solid #41b883;
  backdrop-filter: blur(5px);
}

.front  { transform: rotateY(0deg) translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.right  { transform: rotateY(90deg) translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.top    { transform: rotateX(90deg) translateZ(100px); }
.bottom { transform: rotateX(-90deg) translateZ(100px); }

@keyframes rotate {
  from { transform: rotateX(-20deg) rotateY(0deg); }
  to { transform: rotateX(-20deg) rotateY(360deg); }
}

.hero-title {
  font-size: 4rem;
  text-shadow: 0 0 10px rgba(65, 184, 131, 0.5);
  text-align: center;
  margin-top: 20px;
}

/* Floating Stats */
.floating-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: -50px 0 50px;
}

.stat-bubble {
  background: linear-gradient(145deg, #41b883, #3aa876);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 20px rgba(65, 184, 131, 0.2);
  animation: float 3s ease-in-out infinite;
}

.stat-bubble:nth-child(2) { animation-delay: 0.2s; }
.stat-bubble:nth-child(3) { animation-delay: 0.4s; }

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.8;
}

/* Experience Grid */
.experience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem; /* Increased gap for extra spacing between cards */
  padding: 2rem;
}

.experience-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(65, 184, 131, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.experience-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.experience-name {
  font-size: 1.5em;
  font-weight: bold;
}

.category {
  font-size: 1.1em;
  color: #41b883;
}

.description {
  font-size: 1em;
  color: #ccc;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.points, .date {
  font-size: 0.9em;
  color: #aaa;
}

.points i, .date i {
  margin-right: 5px;
}

/* Add Experience Button */
.add-experience-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #41b883;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 100;
}

.add-experience-btn:hover {
  width: 200px;
  border-radius: 30px;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  color: white;
}

.default-text {
  font-size: 1.2em;
  font-weight: bold;
}

.hover-text {
  display: none;
  margin-left: 10px;
}

.add-experience-btn:hover .default-text {
  display: none;
}

.add-experience-btn:hover .hover-text {
  display: inline;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .floating-stats {
    flex-direction: column;
    align-items: center;
  }
  .stat-bubble {
    width: 100px;
    height: 100px;
  }
}

/* Modal Styles */
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
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
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
  background: #dc3545;
  color: white;
}

.submit-btn:hover {
  background: #3aa876;
}

.cancel-btn:hover {
  background: #c82333;
}
</style>
