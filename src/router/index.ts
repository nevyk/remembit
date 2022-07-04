import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../store/user';

// Import Views (lazy load)
const Tabs = () => import('../views/Tabs.vue');
const Home = () => import('../views/Home.vue');
const Login = () => import('../views/Login.vue');
const Bookmarks = () => import('../views/Bookmarks.vue');
const Profile = () => import('../views/Profile.vue');

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    component: Home,
    path: '/',
    meta: {
      requiresAuth: false
    }
  },
  {
    name: 'Login',
    component: Login,
    path: '/login',
    meta: {
      requiresAuth: false
    }
  },
  {
    name: 'Neocortex',
    component: Tabs,
    path: '/neocortex/',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        // default to bookmarks view
        path: '',
        redirect: '/neocortex/bookmarks'
      },
      {
        name: 'Bookmarks',
        component: Bookmarks,
        path: 'bookmarks'
      },
      {
        name: 'Profile',
        component: Profile,
        path: 'profile'
      }
    ]
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
