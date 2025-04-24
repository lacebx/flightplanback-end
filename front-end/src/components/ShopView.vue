<template>
  <div class="redemption-page">
    <!-- Reuse the floating spheres background -->
   
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
   


    <nav align="right"><router-link to="/transactionhistory" class="nav-link">Transaction History</router-link></nav>
    <p class="user-points">Your Points: {{ userPoints }}</p>
    <h1>Available Rewards</h1>

    <div v-if="loading" class="loading">Loading rewards...</div>
    <div v-else class="rewards-grid">
      <div v-for="reward in sortedRewards" :key="reward.id" class="reward-card">
        <img :src="reward.image" :alt="reward.item_name" class="reward-image" />
        <h2>{{ reward.item_name }}</h2>
        <p>{{ reward.description }}</p>
        <p>Cost: {{ reward.points_cost }} points</p>
        <p v-if="!reward.availability" class="unavailable">Out of Stock </p>
        <button :disabled="!reward.availability || userPoints < reward.points_cost" @click="redeemReward(reward)"
          class="redeem-btn">
          Redeem
        </button>

      </div>
    </div>





  </div>



</template>


<script>
// RedemptionPage.vue
import { inject } from 'vue';

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
      userPoints: 1500, // Example starting points
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
      loading: false,
    };
  },
  computed: {

    sortedRewards() {
      return this.rewardsList.slice().sort((a, b) => a.points_cost - b.points_cost);
    },
  },
  inject: ['addRedeemedItem'],

  methods: {
    getImageUrl(imagePath) {
      return new URL(`../assets/${imagePath}`, import.meta.url).href;
    },
    redeemReward(reward) {
      if (this.userPoints >= reward.points_cost && reward.availability) {
        this.userPoints -= reward.points_cost;
        this.addRedeemedItem(reward);

        alert(`You have redeemed: ${reward.item_name}`);

        // Additional logic (e.g., update reward availability) can be added here.
      } else {
        alert('Insufficient points or item not available.');
      }
    },
  },
};

</script>






<style scoped>
.redemption-page {
  background: #1a1a1a;
  color: white;
  margin: auto;
  text-align: center;

}

.loading {
  font-size: 10px;
  text-align: center;
}

.rewards-grid {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
 
  margin-left: 50px;
}

.reward-card {
  border: 1px solid #ccc;
  padding: 0px;
  border-radius: 10px;
  text-align: center;
  width: 350px;
}

.reward-card h2 {
  margin: 0 0 5px;
}

.reward-card p {
  margin: 0px 0;
}

.reward-card button {
  padding: 10px px;
  font-size: 5px;
  cursor: pointer;
}

.reward-card button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.unavailable {
  color: #ff0000;
  font-size: small;


}

.user-points {
  font-size: 42px;
  font-weight: bold;
  text-align: center;
}

.redeem-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;

  font-size: 16px !important;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  width: 100px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.redeem-btn:hover {
  background-color: #218838;
}







@media (max-width: 668px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .floating-stats {
    flex-direction: column;
    align-items: center;
  }

  .stat-bubble {
    width: 10px;
    height: 10px;
  }
}
</style>
