import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/LoginPage.vue'
import SignUp from '../views/auth/SignUp.vue'
import Home from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import Predictions from '../views/UserPredictions.vue'
import Summary from '../views/SummaryTable.vue'
import Results from '../views/GameResults.vue'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: SignUp,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/predictions',
    name: 'predictions',
    component: Predictions,
  },
  {
    path: '/summary',
    name: 'summary',
    component: Summary,
  },
  {
    path: '/results',
    name: 'results',
    component: Results,
    beforeEnter: (_to, _from, next) => {
      const authStore = useAuthStore()
      if (authStore.user?.role === 'admin') {
        next()
      } else {
        next({ name: 'home' })
      }
    },
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

// Izveidojiet Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Add a global navigation guard to protect routes
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.name !== 'login' && to.name !== 'register') {
    if (authStore.isAuthenticated) {
      return next() // lietotājs jau login
    }
    // Ja nav autentificēts → aizsūti uz login
    return next({ name: 'login' })
  }
  next()
})

export default router
