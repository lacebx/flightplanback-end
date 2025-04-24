<template>
  <div class="shop-page">
    <div class="animated-bg">
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
    </div>

    <div class="shop-container">
      <!-- Header Section -->
      <div class="shop-header">
        <div class="points-display">
          <div class="points-card">
            <i class="fas fa-star points-icon"></i>
            <div class="points-info">
              <span class="points-label">Your Balance</span>
              <span class="points-value">{{ userPoints }} pts</span>
            </div>
          </div>
        </div>
        <nav class="shop-nav">
          <router-link to="/transactionhistory" class="history-link">
            <i class="fas fa-history"></i>
            Transaction History
          </router-link>
        </nav>
      </div>

      <h1 class="shop-title">Rewards Shop</h1>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Loading amazing rewards...</p>
      </div>

      <!-- Rewards Grid -->
      <div v-else class="rewards-grid">
        <div v-for="reward in sortedRewards" 
             :key="reward.id" 
             class="reward-card"
             :class="{ 'unavailable': !reward.availability }">
          <div class="reward-image-container">
            <img :src="reward.image" :alt="reward.item_name" class="reward-image" />
            <div v-if="!reward.availability" class="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          </div>
          
          <div class="reward-content">
            <h2 class="reward-title">{{ reward.item_name }}</h2>
            <p class="reward-description">{{ reward.description }}</p>
            
            <div class="reward-footer">
              <div class="points-cost">
                <i class="fas fa-star"></i>
                <span>{{ reward.points_cost }}</span>
              </div>
              
              <button 
                :disabled="!reward.availability || userPoints < reward.points_cost" 
                @click="redeemReward(reward)"
                class="redeem-btn"
              >
                <span v-if="userPoints < reward.points_cost">
                  Need {{ reward.points_cost - userPoints }} more pts
                </span>
                <span v-else>
                  Redeem Now
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add notification popup -->
    <transition name="fade">
      <div v-if="showNotification" class="notification-popup">
        <div class="notification-content">
          <i class="fas fa-check-circle"></i>
          <p>{{ notificationMessage }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// RedemptionPage.vue
import { inject } from 'vue';
import axios from 'axios';

import waterBottle from '@/assets/images/water-bottle.png';
import coffeeMug from '@/assets/images/coffee-mug.png';
import stationerySet from '@/assets/images/stationery-set.png';
import giftCard from '@/assets/images/giftcard.png';
import ebookVoucher from '@/assets/images/ebookvoucher.png';
import deskOrganizer from '@/assets/images/deskorganizer.png';
import courseDiscount from '@/assets/images/coursediscount.png';
import backPack from '@/assets/images/backpack.png';
import wirelessHeadPhones from '@/assets/images/wirelessheadphones.png';


export default {
  name: 'RedemptionPage',


  data() {
    // Inject the reactive array of redeemed items
    const redeemedItems = inject('redeemedItems');
    console.log(redeemedItems)
    return {
      userPoints: 0, // Will be fetched from database
      loading: true,
      showNotification: false,
      notificationMessage: '',
      rewardsList: [
        {
          id: 1,
          student_name: "Jane",
          item_name: 'Gift Card',
          description: 'A $50 gift card.',
          points_cost: 500,
          availability: true,
          image: giftCard,
        },
        {
          id: 2,
          student_name: "Kibret",
          item_name: 'Wireless Headphones',
          description: 'Noise-cancelling over-ear headphones.',
          points_cost: 1200,
          availability: true,
          image: wirelessHeadPhones,
        },
        {
          id: 3,
          student_name: "Ehit",
          item_name: 'Coffee Mug',
          description: 'A branded coffee mug.',
          points_cost: 300,
          availability: false,
          image: coffeeMug,
        },
        {
          id: 4,
          student_name: "Helen",
          item_name: 'E-Book Voucher',
          description: 'Voucher for an e-book of your choice.',
          points_cost: 400,
          availability: true,
          image: ebookVoucher,
        },
        {
          id: 5,
          student_name: "Mike",
          item_name: 'Online Course Discount',
          description: 'Discount on an online course.',
          points_cost: 800,
          availability: true,
          image: courseDiscount,
        },
        {
          id: 6,
          student_name: "Arsene",
          item_name: 'Stationery Set',
          description: 'A set of notebooks, pens, and more.',
          points_cost: 350,
          availability: true,
          image: stationerySet,
        },
        {
          id: 7,
          student_name: "Gaby",
          item_name: 'Backpack',
          description: 'A durable and stylish backpack.',
          points_cost: 1000,
          availability: true,
          image: backPack,
        },
        {
          id: 8,
          student_name: "Tade",
          item_name: 'Water Bottle',
          description: 'A reusable water bottle.',
          points_cost: 250,
          availability: true,
          image: waterBottle,
        },
        {
          id: 9,
          student_name: "Fanta",
          item_name: 'Desk Organizer',
          description: 'Keep your workspace neat and tidy.',
          points_cost: 450,
          availability: true,
          image: deskOrganizer,
        },
      ],
    };
  },
  computed: {

    sortedRewards() {
      return this.rewardsList.slice().sort((a, b) => a.points_cost - b.points_cost);
    },
  },
  inject: ['addRedeemedItem'],


 methods: {
    async fetchUserPoints() {
      try {
        const response = await axios.get('http://localhost:8082/auth/user', { withCredentials: true });
        if (response.data && response.data.points !== undefined) {
          this.userPoints = response.data.points;
        } else {
          console.warn('User points not found in response');
          this.userPoints = 0;
        }
        this.loading = false;
      } catch (error) {
        console.error('Error fetching user points:', error);
        this.userPoints = 0;
        this.loading = false;
      }
    },
    async redeemReward(reward) {
      if (this.userPoints >= reward.points_cost && reward.availability) {
        try {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            alert('Please log in to redeem rewards');
            return;
          }

          const response = await axios.post('http://localhost:8082/api/transactions', {
            userId: userId,
            itemId: reward.id,
            pointsCost: reward.points_cost,
            itemName: reward.item_name,
            date: new Date().toISOString()
          }, { withCredentials: true });

          if (response.status === 200) {
            this.userPoints -= reward.points_cost;
            this.addRedeemedItem(reward);
            reward.availability = false;
            
            // Show popup notification
            this.notificationMessage = `Successfully redeemed ${reward.item_name}! Please visit the Book Store to pick up your item.`;
            this.showNotification = true;
            
            // Hide notification after 5 seconds
            setTimeout(() => {
              this.showNotification = false;
            }, 5000);
          }
        } catch (error) {
          console.error('Error redeeming reward:', error);
          alert('Failed to redeem reward. Please try again.');
        }
      } else {
        alert('Insufficient points or item not available.');
      }
    },
    async addToTransactionHistory(reward) {
      try {
        await axios.post('http://localhost:8082/api/transactions', {
          userId: this.user?.id,
          itemName: reward.item_name,
          pointsCost: reward.points_cost,
          date: new Date().toISOString()
        }, { withCredentials: true });
      } catch (error) {
        console.error('Error adding to transaction history:', error);
      }
    }
  },
  async mounted() {
    await this.fetchUserPoints();
  }
};

</script>

<style scoped>
.shop-page {
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

.shop-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.points-display {
  flex: 1;
}

.points-card {
  background: rgba(65, 184, 131, 0.1);
  border: 1px solid rgba(65, 184, 131, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 300px;
}

.points-icon {
  font-size: 2rem;
  color: #41b883;
}

.points-info {
  display: flex;
  flex-direction: column;
}

.points-label {
  font-size: 0.9rem;
  color: #888;
}

.points-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #41b883;
}

.shop-nav {
  padding: 1rem;
}

.history-link {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.history-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.shop-title {
  font-size: 3rem;
  color: #41b883;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 300;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(65, 184, 131, 0.3);
  border-radius: 50%;
  border-top-color: #41b883;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.reward-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  max-width: 280px;
  margin: 0 auto;
}

.reward-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.reward-image-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.reward-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.reward-card:hover .reward-image {
  transform: scale(1.05);
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.reward-content {
  padding: 1.2rem;
}

.reward-title {
  font-size: 1.2rem;
  margin: 0 0 0.8rem;
}

.reward-description {
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
}

.reward-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.points-cost {
  font-size: 1.1rem;
}

.redeem-btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
}

.unavailable {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .shop-page {
    padding: 1rem;
  }

  .shop-header {
    flex-direction: column;
    gap: 1rem;
  }

  .points-card {
    max-width: 100%;
  }

  .shop-title {
    font-size: 2rem;
  }

  .rewards-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .reward-card {
    max-width: 240px;
  }

  .notification-popup {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .notification-content {
    padding: 0.8rem 1rem;
  }
}

/* Add notification styles */
.notification-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideIn 0.5s ease-out;
}

.notification-content {
  background: rgba(65, 184, 131, 0.95);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
}

.notification-content i {
  font-size: 1.5rem;
}

.notification-content p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
