import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sale',
    name: 'Sale',
    component: () => import('@/views/SaleView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rent',
    name: 'Rent',
    component: () => import('@/views/RentView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/property',
    name: 'Property',
    component: () => import('@/views/PropertyView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('@/views/RecordsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('xsuite_token')
  const isAuth = !!token

  if (to.meta.requiresAuth && !isAuth) {
    return next('/login')
  }

  if (to.meta.requiresGuest && isAuth) {
    return next('/')
  }

  next()
})

export default router
