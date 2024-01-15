import { useUserStore } from '@/stores/user';
import { createRouter, createWebHistory } from 'vue-router';
import LoginHandlerVue from '../components/LoginHandler.vue';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginHandlerVue
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('../views/NewComparison.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  console.log(to.meta);
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
      next();
    } else {
      userStore.$reset();
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
