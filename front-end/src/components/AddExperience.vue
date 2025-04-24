<template>
  <div class="experience-form-container">
    <h2>Add Experience</h2>
    <form @submit.prevent="submitExperience">
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="form.category" required>
          <option value="Internship">Internship</option>
          <option value="Volunteering">Volunteering</option>
          <option value="Leadership">Leadership</option>
          <option value="Work Experience">Work Experience</option>
        </select>
      </div>

      <div class="form-group">
        <label for="type">Type</label>
        <select id="type" v-model="form.type" required>
          <option value="Online">Online</option>
          <option value="In-Person">In-Person</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div class="form-group">
        <label for="name">Experience Name</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description"></textarea>
      </div>

      <div class="form-group">
        <label for="duration">Duration</label>
        <input type="text" id="duration" v-model="form.duration" required />
      </div>

      <div class="form-group">
        <label for="schedulingtype">Scheduling Type</label>
        <select id="schedulingtype" v-model="form.schedulingType" required>
          <option value="Fixed">Fixed</option>
          <option value="Flexible">Flexible</option>
        </select>
      </div>

      <div class="form-group">
        <label for="points">Points Earned</label>
        <input type="number" id="points" v-model="form.pointsEarned" required />
      </div>

      <div class="form-group checkbox-group">
        <input type="checkbox" id="reflectionRequired" v-model="form.reflectionRequired" />
        <label for="reflectionRequired">Reflection Required</label>
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? "Saving..." : "Save Experience" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const form = ref({
  category: "",
  type: "",
  name: "",
  description: "",
  duration: "",
  schedulingType: "",
  pointsEarned: 0,
  reflectionRequired: false,
});

const isSubmitting = ref(false);

const submitExperience = async () => {
  isSubmitting.value = true;
  try {
    const response = await axios.post("http://localhost:8082/api/experiences", form.value, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Experience Created:", response.data);
    alert("Experience added successfully!");

    // Redirect to the experience list page
    router.push("/experience");
  } catch (error) {
    console.error("Error creating experience:", error);
    alert("Failed to add experience.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.experience-form-container {
  max-width: 500px;
  margin: auto;
  padding: 30px;
  background: #ffffff;
  color: #000;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>