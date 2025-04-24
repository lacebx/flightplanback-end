<template>
  <div class="transaction-history">
    <!-- Reuse the floating spheres background -->
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>

    <h2 class="history-title">Transaction History</h2>

    <div class="history-container">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Student Name</th>
              <th>Item Name</th>
              <th>Points Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in redeemedItems" :key="index">
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.student_name }}</td>
              <td>{{ item.item_name }}</td>
              <td>
                <span class="points-badge">
                  <i class="fas fa-star"></i>
                  {{ item.points_cost }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionHistory',
  inject: ['redeemedItems'],
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.transaction-history {
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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

.history-title {
  color: #41b883;
  font-size: 2.5rem;
  margin: 2rem auto;
  text-align: center;
  font-weight: 300;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.history-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.table-container {
  overflow-x: auto;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.03);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0;
}

th, td {
  padding: 1.2rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

th {
  background: rgba(65, 184, 131, 0.1);
  color: #41b883;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

td {
  color: #ffffff;
}

tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.points-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(65, 184, 131, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #41b883;
}

.points-badge i {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .transaction-history {
    padding: 1rem;
  }

  .history-container {
    padding: 1rem;
  }

  .history-title {
    font-size: 2rem;
  }

  th, td {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
}
</style>