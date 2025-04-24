<template>
  <div class="leaderboard-page">
    <!-- Overview Section: Personal Performance -->
<!-- Animated Background -->
<div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>
    <!-- Flex container for Leaderboard and Percentile Metrics -->
    <div class="flex-container">
      <!-- Leaderboard Section: Top 10 -->
      <section class="leaderboard-section glass-morphism">
        <h2>LEADERBOARD</h2>
        <ul class="leaderboard-list">
          <li class="leaderboard-header">
            <span class="name-header">Name</span>
            <span class="xp-header">XP</span>
          </li>
          <li v-for="(entry, index) in leaderboard" :key="entry.id">
            <span class="rank">{{ index + 1 }}</span>
            <img :src="entry.avatar" alt="Avatar" class="leaderboard-avatar"/>
            <span class="name">{{ entry.name }}</span>
            <span class="xp">{{ entry.xp.toLocaleString() }}</span>
          </li>
        </ul>
      </section>

      <!-- New Card: Percentile Metrics -->
      <section class="percentile-metrics glass-morphism">
        <h2>Percentile Metrics</h2>
        <div class="metrics-content">
          <div class="chart">
            <!-- Placeholder for chart -->
            <img src="/img/placeholder-chart.png" alt="Chart" class="chart-image"/>
          </div>
          <div class="metrics">
            <div class="metric">
              <span class="label">Current Percentile:</span>
              <span class="value">25%</span>
            </div>
            <div class="metric">
              <span class="label">Rank Progress:</span>
              <span class="value">Top 25%</span>
            </div>
            <div class="metric">
              <span class="label">XP Needed for Next Rank:</span>
              <span class="value">500 XP</span>
            </div>
            <!-- Activity Graph Placeholder -->
            <div class="activity-graph">
              <ActivityChart :pieChartData="chartData" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Earnable Badges Section -->
    <section class="badges-section glass-morphism">
      <h2>EARNABLE BADGES</h2>
      <div class="badges-grid">
        <div class="badge" v-for="badge in earnableBadges" :key="badge.id">
          <img :src="badge.icon" alt="Badge" class="badge-image"/>
          <div class="badge-info">
            <span class="badge-name">{{ badge.name }}</span>
            <span class="badge-progress">{{ badge.progress }}%</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ActivityChart from './ActivityChart.vue';
import axios from 'axios';

export default {
  name: "LeaderboardView",
  components: {
    ActivityChart
  },
  data() {
    return {
      user: {
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocIh5fG54ltKXN56NmPbuxk4Z-fIIdEiHhlFffB-wpJ0jakZ4_CX=s96-c",
        xp: 12350,
        tasksCompleted: 23,
        eventsAttended: 12,
        percentile: 25
      },
      leaderboard: [
        { id: 1, name: "Emma Johnson", avatar: require('@/assets/girl1.jpeg'), xp: 15200 },
        { id: 2, name: "William Brown", avatar: require('@/assets/boy1.jpg'), xp: 14750 },
        { id: 3, name: "Olivia Davis", avatar: require('@/assets/girl2.jpeg'), xp: 14100 },
        { id: 4, name: "Liam Wilson", avatar: require('@/assets/boy2.jpeg'), xp: 13800 },
        { id: 5, name: "Sophia Martinez", avatar: require('@/assets/girl3.jpeg'), xp: 13500 },
        { id: 6, name: "James Anderson", avatar: require('@/assets/boy3.jpg'), xp: 12950 },
        { id: 7, name: "Isabella Taylor", avatar: require('@/assets/girl4.jpg'), xp: 12700 },
        { id: 8, name: "Benjamin Thomas", avatar: require('@/assets/boy4.jpg'), xp: 12400 },
        { id: 9, name: "Mia White", avatar: require('@/assets/girl5.jpeg'), xp: 12150 },
        { id: 10, name: "Ethan Harris", avatar: require('@/assets/boy5.jpg'), xp: 11900 }
      ],
      earnableBadges: [
        { id: 1, name: "Achiever", icon: require('@/assets/Media/Badges/YOLO/PNG/YOLO_Badge.png'), progress: 75 },
        { id: 2, name: "Hustler", icon: require('@/assets/Media/Badges/Star-Struck/PNG/StarStruck_Gold.png'), progress: 40 },
        { id: 3, name: "Scholar", icon: require('@/assets/Media/Badges/Pull-Shark/GIF/PullShark_Animated.gif'), progress: 0 }
      ],
      chartData: [
        {
          labels: ['XP', 'Tasks', 'Events'],
          datasets: [
            {
              data: [12350, 23, 12],
              backgroundColor: ['#41b883', '#ff6384', '#36a2eb']
            }
          ]
        }
      ],
      activityData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      }
    };
  },
  computed: {
    // Calculate rotation for the gauge based on the user's percentile (100% = 360deg)
    gaugeRotation() {
      return (this.user.percentile / 100) * 360;
    }
  },
  methods: {
    // Helper method to generate last 7 days for labels
    getLastSevenDays() {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
      return days;
    },
    async fetchActivityData() {
      try {
        const response = await axios.get('your-api-endpoint/activity-data');
        this.activityData.datasets[0].data = response.data.points;
        this.activityData.labels = response.data.dates;
      } catch (error) {
        console.error('Error fetching activity data:', error);
        // Use default data if API call fails
        this.activityData.labels = this.getLastSevenDays();
      }
    }
  },
  mounted() {
    this.activityData.labels = this.getLastSevenDays();
    this.fetchActivityData();
  }
};
</script>

<style scoped>
.leaderboard-page {
  padding: 2rem;
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
}

/* Flex container for Leaderboard and Percentile Metrics */
.flex-container {
  display: flex;
  gap: 2rem;
}

/* Glass Morphism Base */
.glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  margin-bottom: 2rem;
  flex: 1;
}

/* Overview Section */
.overview-section h2 {
  margin-bottom: 1rem;
  font-size: 2em;
  text-align: center;
}

.personal-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat .label {
  font-size: 0.9em;
  color: #aaa;
}

.stat .value {
  font-size: 1.5em;
  font-weight: bold;
}

.gauge {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  /* Use conic-gradient with CSS variable --rotate for progress */
  background: conic-gradient(#41b883 var(--rotate), transparent var(--rotate));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  transition: background 0.5s ease;
}

.gauge-cover {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  font-weight: bold;
}

/* Leaderboard Section */
.leaderboard-section h2 {
  margin-bottom: 1rem;
  font-size: 1.8em;
  text-align: center;
}

.leaderboard-list {
  list-style: none;
  padding: 0;
}

.leaderboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.leaderboard-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding: 0.8rem 0;
}

.rank {
  font-size: 1.2em;
  width: 30px;
  text-align: center;
}

.avatar-header, .name-header {
  flex: 1;
  text-align: left;
}

.xp-header {
  flex: 1;
  text-align: right;
}

.leaderboard-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 1rem;
}

.name {
  flex: 1;
  font-weight: bold;
  font-size: 1em;
}

.xp {
  font-size: 1em;
}

/* Earnable Badges Section */
.badges-section h2 {
  margin-bottom: 1rem;
  font-size: 1.8em;
  text-align: center;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.badge-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.5rem;
}

.badge-info {
  text-align: center;
}

.badge-name {
  font-size: 1em;
  font-weight: bold;
}

.badge-progress {
  font-size: 0.9em;
  color: #aaa;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .flex-container {
    flex-direction: column;
  }
  .stats {
    flex-direction: column;
  }
  .leaderboard-list li {
    flex-direction: column;
    align-items: flex-start;
  }
  .xp {
    margin-top: 0.5rem;
  }
}

.percentile-metrics {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.metrics-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 1rem;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric .label {
  font-size: 0.9em;
  color: #aaa;
}

.metric .value {
  font-size: 1.2em;
  font-weight: bold;
}

.activity-graph {
  margin-top: 1rem;
  height: 200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
}
</style>