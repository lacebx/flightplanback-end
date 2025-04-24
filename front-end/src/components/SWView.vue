<template>
  <div class="sw-page">
    <div class="content-wrapper">
      <!-- Results Section -->
      <section v-if="showResults" class="results-section glass-card">
        <h2>Your Assessment Results</h2>
        <div class="strengths-container">
          <div class="result-card strength" v-if="topStrengths.length">
            <h3>Top Strengths</h3>
            <ul>
              <li v-for="(strength, index) in topStrengths" :key="'strength-'+index">
                <span class="skill-name">{{ strength.skill }}</span>
                <div class="skill-bar">
                  <div class="skill-fill" :style="{ width: strength.score + '%' }"></div>
                </div>
                <span class="skill-score">{{ strength.score }}%</span>
              </li>
            </ul>
          </div>
          
          <div class="result-card weakness" v-if="topWeaknesses.length">
            <h3>Areas for Improvement</h3>
            <ul>
              <li v-for="(weakness, index) in topWeaknesses" :key="'weakness-'+index">
                <span class="skill-name">{{ weakness.skill }}</span>
                <div class="skill-bar">
                  <div class="skill-fill" :style="{ width: weakness.score + '%' }"></div>
                </div>
                <span class="skill-score">{{ weakness.score }}%</span>
              </li>
            </ul>
          </div>
        </div>
        <button @click="restartAssessment" class="action-btn restart-btn">Take Assessment Again</button>
      </section>

      <!-- Assessment Form -->
      <section v-else class="assessment-section glass-card">
        <div v-if="!isAssessmentStarted" class="start-container">
          <h2>Skills Assessment</h2>
          <p>This assessment will help identify your strengths and areas for improvement across various skills.</p>
          <button @click="startAssessment" class="action-btn start-btn">Begin Assessment</button>
        </div>

        <div v-else class="question-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <p class="question-count">Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</p>
          
          <div class="question">
            <h3>{{ currentQuestion.question }}</h3>
            <div class="options">
              <label v-for="(option, index) in currentQuestion.options" :key="index" class="option-label">
                <input 
                  type="radio" 
                  :value="index" 
                  v-model="currentAnswer"
                  :name="'question'+currentQuestionIndex"
                >
                <span class="option-text">{{ option.text }}</span>
              </label>
            </div>
          </div>

          <div class="navigation-buttons">
            <button 
              v-if="currentQuestionIndex > 0" 
              @click="previousQuestion" 
              class="nav-btn"
            >Previous</button>
            <button 
              v-if="currentQuestionIndex < questions.length - 1" 
              @click="nextQuestion" 
              class="nav-btn"
              :disabled="currentAnswer === null"
            >Next</button>
            <button 
              v-else 
              @click="submitAssessment" 
              class="nav-btn submit-btn"
              :disabled="currentAnswer === null"
            >Submit</button>
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
      isAssessmentStarted: false,
      showResults: false,
      currentQuestionIndex: 0,
      currentAnswer: null,
      answers: [],
      questions: [
        {
          question: "How comfortable are you with public speaking?",
          skill: "Communication",
          options: [
            { text: "Very uncomfortable", value: 1 },
            { text: "Somewhat uncomfortable", value: 2 },
            { text: "Neutral", value: 3 },
            { text: "Somewhat comfortable", value: 4 },
            { text: "Very comfortable", value: 5 }
          ]
        },
        {
          question: "How well do you handle working under pressure?",
          skill: "Stress Management",
          options: [
            { text: "Very poorly", value: 1 },
            { text: "Somewhat poorly", value: 2 },
            { text: "Average", value: 3 },
            { text: "Well", value: 4 },
            { text: "Very well", value: 5 }
          ]
        },
        {
          question: "How effectively do you manage your time?",
          skill: "Time Management",
          options: [
            { text: "Very ineffectively", value: 1 },
            { text: "Somewhat ineffectively", value: 2 },
            { text: "Average", value: 3 },
            { text: "Effectively", value: 4 },
            { text: "Very effectively", value: 5 }
          ]
        },
        {
          question: "How well do you work in team settings?",
          skill: "Teamwork",
          options: [
            { text: "Very poorly", value: 1 },
            { text: "Somewhat poorly", value: 2 },
            { text: "Average", value: 3 },
            { text: "Well", value: 4 },
            { text: "Very well", value: 5 }
          ]
        },
        {
          question: "How comfortable are you with learning new technologies?",
          skill: "Technical Adaptability",
          options: [
            { text: "Very uncomfortable", value: 1 },
            { text: "Somewhat uncomfortable", value: 2 },
            { text: "Neutral", value: 3 },
            { text: "Somewhat comfortable", value: 4 },
            { text: "Very comfortable", value: 5 }
          ]
        },
        {
          question: "How well can you adapt to unexpected changes in plans or requirements?",
          skill: "Adaptability",
          options: [
            { text: "Very difficult to adapt", value: 1 },
            { text: "Somewhat difficult", value: 2 },
            { text: "Neutral", value: 3 },
            { text: "Fairly adaptable", value: 4 },
            { text: "Very adaptable", value: 5 }
          ]
        },
        {
          question: "How confident are you in making decisions independently?",
          skill: "Decision Making",
          options: [
            { text: "Not at all confident", value: 1 },
            { text: "Slightly confident", value: 2 },
            { text: "Moderately confident", value: 3 },
            { text: "Quite confident", value: 4 },
            { text: "Very confident", value: 5 }
          ]
        },
        {
          question: "How well do you handle conflicts with others?",
          skill: "Conflict Resolution",
          options: [
            { text: "Very poorly", value: 1 },
            { text: "Somewhat poorly", value: 2 },
            { text: "Average", value: 3 },
            { text: "Well", value: 4 },
            { text: "Very well", value: 5 }
          ]
        },
        {
          question: "How effectively can you explain complex ideas to others?",
          skill: "Communication Clarity",
          options: [
            { text: "Very ineffectively", value: 1 },
            { text: "Somewhat ineffectively", value: 2 },
            { text: "Average", value: 3 },
            { text: "Effectively", value: 4 },
            { text: "Very effectively", value: 5 }
          ]
        },
        {
          question: "How well do you maintain focus on long-term goals?",
          skill: "Goal Orientation",
          options: [
            { text: "Very poorly", value: 1 },
            { text: "Somewhat poorly", value: 2 },
            { text: "Average", value: 3 },
            { text: "Well", value: 4 },
            { text: "Very well", value: 5 }
          ]
        }
      ],
      topStrengths: [],
      topWeaknesses: [],
      assessmentCount: 0
    };
  },
  created() {
    // Load previous results if they exist
    const savedResults = localStorage.getItem('swAssessmentResults');
    if (savedResults) {
      const results = JSON.parse(savedResults);
      this.topStrengths = results.topStrengths;
      this.topWeaknesses = results.topWeaknesses;
      this.showResults = true;
      this.assessmentCount = results.assessmentCount || 0;
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    progressPercentage() {
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    }
  },
  methods: {
    startAssessment() {
      this.isAssessmentStarted = true;
      this.answers = new Array(this.questions.length).fill(null);
      this.currentQuestionIndex = 0;
      this.currentAnswer = null;
      this.showResults = false;
    },
    nextQuestion() {
      if (this.currentAnswer !== null) {
        this.answers[this.currentQuestionIndex] = this.currentAnswer;
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.currentAnswer = this.answers[this.currentQuestionIndex];
        }
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.answers[this.currentQuestionIndex] = this.currentAnswer;
        this.currentQuestionIndex--;
        this.currentAnswer = this.answers[this.currentQuestionIndex];
      }
    },
    submitAssessment() {
      this.answers[this.currentQuestionIndex] = this.currentAnswer;
      
      // Calculate scores for each skill
      const skillScores = {};
      this.questions.forEach((question, index) => {
        const score = (this.answers[index] + 1) * 20; // Convert to percentage
        skillScores[question.skill] = score;
      });

      // Sort skills by score
      const sortedSkills = Object.entries(skillScores)
        .map(([skill, score]) => ({ skill, score }))
        .sort((a, b) => b.score - a.score);

      // Get top 5 strengths
      this.topStrengths = sortedSkills.filter(skill => skill.score >= 80);

      // Get areas of improvement (skills below 80%)
      this.topWeaknesses = sortedSkills
        .filter(skill => skill.score < 80)
        .sort((a, b) => a.score - b.score); // Sort weaknesses by lowest score first

      // Increment assessment count
      this.assessmentCount++;

      // Save results to localStorage
      const results = {
        topStrengths: this.topStrengths,
        topWeaknesses: this.topWeaknesses,
        assessmentCount: this.assessmentCount,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('swAssessmentResults', JSON.stringify(results));

      this.showResults = true;
    },
    restartAssessment() {
      if (confirm('Are you sure you want to take the assessment again? Your previous results will be overwritten.')) {
        this.startAssessment();
      }
    }
  }
};
</script>

<style scoped>
.sw-page {
  min-height: 100vh;
  background: #1a1a1a;
  color: white;
  padding: 2rem;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  margin-bottom: 2rem;
}

.start-container {
  text-align: center;
}

.action-btn {
  background: #41b883;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.action-btn:hover {
  transform: scale(1.05);
  background: #3aa876;
}

.restart-btn {
  background: #2c805c;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: #41b883;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.question-count {
  color: #41b883;
  font-weight: bold;
  margin-bottom: 1rem;
}

.question {
  margin-bottom: 2rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-label:hover {
  background: rgba(255, 255, 255, 0.1);
}

.option-text {
  font-size: 1.1rem;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.nav-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #2c805c;
  color: white;
  font-weight: bold;
}

.nav-btn:hover:not(:disabled) {
  background: #41b883;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  background: #41b883;
}

.results-section {
  text-align: center;
}

.strengths-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.result-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  text-align: left;
}

.result-card h3 {
  color: #41b883;
  margin-bottom: 1rem;
}

.result-card ul {
  list-style: none;
  padding: 0;
}

.result-card li {
  margin-bottom: 1rem;
}

.skill-name {
  display: block;
  margin-bottom: 0.5rem;
}

.skill-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.skill-fill {
  height: 100%;
  background: #41b883;
  border-radius: 4px;
  transition: width 1s ease;
}

.skill-score {
  font-size: 0.9rem;
  color: #41b883;
}

@media (max-width: 768px) {
  .sw-page {
    padding: 1rem;
  }

  .strengths-container {
    grid-template-columns: 1fr;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .nav-btn {
    width: 100%;
  }
}
</style>