<template>
  <div class="view-student-plans">
    <h1>View Student Plans</h1>
    <select v-model="selectedStudent" @change="fetchStudentPlan">
      <option v-for="student in students" :key="student.id" :value="student.id">{{ student.name }}</option>
    </select>
    <div v-if="studentPlan">
      <h2>{{ studentPlan.name }}'s Plan</h2>
      <p>{{ studentPlan.details }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [], // Fetch this from the backend
      selectedStudent: null,
      studentPlan: null,
    };
  },
  methods: {
    fetchStudents() {
      // Fetch students from the backend
    },
    fetchStudentPlan() {
      // Fetch the selected student's plan
    },
  },
  mounted() {
    this.fetchStudents();
  },
};
</script>

<style scoped>
.view-student-plans {
  /* Add styles for viewing student plans */
}
</style> 