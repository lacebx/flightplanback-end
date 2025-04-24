<template>


  <div class="transaction-history">
    <!-- Reuse the floating spheres background -->
    <div class="animated-bg">

      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>
      <div class="gradient-sphere"></div>








      <h2>Transaction History</h2>

    </div>




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

          <td>{{ item.date }}</td>
          <td>{{ item.student_name }}</td>
          <td>{{ item.item_name }}</td>
          <td>{{ item.points_cost }}</td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'TransactionHistory',
  inject: ['redeemedItems'],
};

</script>

<style scoped>
.transaction-history {
  font-family: Arial, sans-serif;
  margin: 0px auto;
  max-width: 2500px;
  padding: 0px;
  text-align: center;
}


table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
</style>