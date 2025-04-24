<template>
  <div class="bar-chart">
    <Bar
      v-for="(data, index) in chartData"
      :key="index"
      :data="data"
      :options="chartOptions"
      :style="{ height: '200px', margin: '10px' }"
    />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default {
  name: 'ActivityChart',
  components: {
    Bar
  },
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff'
            }
          }
        }
      }
    };
  }
};
</script>