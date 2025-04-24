<template>
  <div class="sw-page">
     <!-- Reuse the floating spheres background -->
     <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>
    <!-- Parallax Hero Section -->
    <div class="parallax-hero">
      <div class="hero-content glass-effect">
        <h1>Strengths & Weaknesses</h1>
        <p>Discover your unique potential with the Clifton Strengths Assessment</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Info Section with Glassmorphism -->
      <section class="info-section glass-card" data-scroll>
        <div class="info-content">
          <h2>About the Assessment</h2>
          <p>The Clifton Strengths assessment helps you discover your unique combination of talents. 
             Understanding your strengths can help you perform better in your career and daily life.</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card neumorphic">
            <span class="stat-number">34</span>
            <p>Themes of Talent</p>
          </div>
          <div class="stat-card neumorphic">
            <span class="stat-number">45</span>
            <p>Minutes to Complete</p>
          </div>
          <div class="stat-card neumorphic">
            <span class="stat-number">20M+</span>
            <p>People Assessed</p>
          </div>
        </div>
      </section>

      <!-- Assessment Section -->
      <section class="assessment-section" data-scroll>
        <div class="video-container glass-card">
          <video autoplay loop muted playsinline>
            <source src="https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-keyboard-in-an-office-environment-41493-large.mp4" type="video/mp4">
          </video>
          <div class="overlay"></div>
          <div class="video-content">
            <h2>Take the Assessment</h2>
            <p>Start your journey of self-discovery</p>
            <button class="start-btn neumorphic">Begin Assessment</button>
          </div>
        </div>
      </section>

      <!-- Results Section with Scroll Animation -->
      <section class="results-section" data-scroll>
        
        <div class="strengths-container">
          <div class="strength-card neumorphic" v-for="(strength, index) in strengths" :key="index">
            <div class="strength-header">
              <span class="strength-number">{{ index + 1 }}</span>
              <h3>{{ strength.name }}</h3>
            </div>
            <p>{{ strength.description }}</p>
            <div class="strength-meter">
              <div class="meter-fill" :style="{ width: strength.score + '%' }"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SWView',
  data() {
    return {
      strengths: [
        {
          name: 'Strategic Thinking',
          description: 'You create alternative ways to proceed and easily spot relevant patterns.',
          score: 85
        },
        {
          name: 'Relationship Building',
          description: 'You excel at establishing strong connections with others.',
          score: 75
        },
        {
          name: 'Executing',
          description: 'You have the ability to catch an idea and make it happen.',
          score: 90
        }
      ]
    };
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
    initScrollAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('[data-scroll]').forEach((section) => {
        observer.observe(section);
      });
    }
  }
};
</script>

<style scoped>
.sw-page {
  min-height: 100vh;
  background: #1a1a1a; /* Match ExperienceView background */
  color: white; /* Match text color */
}

.parallax-hero {
  height: 60vh;
  background-image: url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex; /* Center content */
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1); /* Glassmorphism effect */
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  margin-bottom: 2rem;
}

.info-section {
  margin-top: -5rem;
  position: relative;
  z-index: 2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  border-radius: 15px;
  background: white;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #41b883;
}

.video-container {
  position: relative;
  height: 400px;
  overflow: hidden;
  border-radius: 20px;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.video-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 100%;
  padding: 2rem;
}

.start-btn {
  background: #41b883;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-top: 1rem;
}

.start-btn:hover {
  transform: scale(1.05);
}

.strengths-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.strength-card {
  background: rgba(255, 255, 255, 0.1); /* Glassmorphism effect */
  padding: 1.5rem;
  border-radius: 15px;
  transform: translateY(50px);
  opacity: 0;
  transition: all 0.6s ease;
}

.strength-card.animate {
  transform: translateY(0);
  opacity: 1;
}

.strength-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.strength-number {
  background: #41b883;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.strength-meter {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-top: 1rem;
}

.meter-fill {
  height: 100%;
  background: #41b883;
  border-radius: 3px;
  transition: width 1s ease;
}

[data-scroll] {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

[data-scroll].animate {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .video-container {
    height: 300px;
  }
}
</style>