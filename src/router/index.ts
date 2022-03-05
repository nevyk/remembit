import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

// Import Views (lazy load)
const HomePage = () => import('../views/HomePage.vue');
const LoginPage = () => import('../views/LoginPage.vue');

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    component: HomePage,
    path: '/',
    meta: {
      authRequired: false
    }
  },
  {
    name: 'Login',
    component: LoginPage,
    path: '/login',
    meta: {
      authRequired: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
