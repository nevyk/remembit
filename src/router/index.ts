import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../store/user';

// Import Views (lazy load)
const HomePage = () => import('../views/HomePage.vue');
const LoginPage = () => import('../views/LoginPage.vue');
const BookmarksPage = () => import('../views/BookmarksPage.vue');

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    component: HomePage,
    path: '/',
    meta: {
      requiresAuth: false
    }
  },
  {
    name: 'Login',
    component: LoginPage,
    path: '/login',
    meta: {
      requiresAuth: false
    }
  },
  {
    name: 'Bookmarks',
    component: BookmarksPage,
    path: '/neocortex/bookmarks',
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      return { name: 'Login' };
    } else {
      return true;
    }
  } else {
    return true;
  }
});

// once the router is ready we register the service worker for PWA
router.isReady().then(async () => {
  const { registerSW } = await import('virtual:pwa-register');
  const intervalMS = 60 * 60 * 1000; // 1h

  registerSW({
    immediate: true,
    onRegistered(registered) {
      registered &&
        setInterval(() => {
          registered.update();
        }, intervalMS);
    }
  });
});

export default router;
