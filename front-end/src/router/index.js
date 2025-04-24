import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../components/LoginView.vue';
import TasksAndEventsView from '../components/TasksAndEventsView.vue';
import SWView from '../components/SWView.vue';
import ExperienceView from '../components/ExperienceView.vue';
import ProfileView from '../components/ProfileView.vue';
import LeaderboardView from '../components/LeaderboardView.vue';
import AdminLogin from '../components/AdminLogin.vue';
import ManageStudents from '../components/ManageStudents.vue';
import ManageEvents from '../components/ManageEvents.vue';
import ManageTasks from '../components/ManageTasks.vue';
import ViewStudentPlans from '../components/ViewStudentPlans.vue';
import AdminHomePage from '../components/AdminHomePage.vue';
import AddExperience from '../components/AddExperience.vue';
import Shop from '../components/ShopView.vue';
import TransactionHistory from '../components/TransactionHistory.vue';
import Reports from '../components/EngagementReport.vue';

import SetupPasswordView from '../components/SetupPasswordView.vue';


const routes = [
  { path: '/', component: LoginView },
  { path: '/home', component: TasksAndEventsView },
  { path: '/sw', component: SWView },
  { path: '/experience', component: ExperienceView },
  { path: '/profile', component: ProfileView },
  { path: '/transactionhistory', component: TransactionHistory },
  { path: '/shop', component: Shop },
   { path: '/admin/reports', component: Reports },


  { path: '/leaderboard', component: LeaderboardView },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/admin',
    name: 'AdminHomePage',
    component: AdminHomePage
  },
  {
    path: '/admin/manage-students',
    name: 'ManageStudents',
    component: ManageStudents
  },
  {
    path: '/admin/manage-events',
    name: 'ManageEvents',
    component: ManageEvents
  },

  {
    path: '/admin/manage-tasks',
    name: 'ManageTasks',
    component: ManageTasks
  },
  {
    path: '/admin/view-student-plans',
    name: 'ViewStudentPlans',
    component: ViewStudentPlans
  },
  {
    path: '/setup-password',
    name: 'SetupPasswordView',
    component: SetupPasswordView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router; 