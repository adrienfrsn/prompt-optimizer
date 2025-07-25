import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import PromptForm from '@/components/PromptForm.vue'
import { jwtDecode } from 'jwt-decode';

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return false;
  }
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/app', component: PromptForm, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isTokenValid(localStorage.getItem('token'))) {
    next('/login')
  } else if (isTokenValid(localStorage.getItem('token')) && (to.path === '/login' || to.path === '/register')) {
    next('/app')
  } else {
    next()
  }
})

export default router
